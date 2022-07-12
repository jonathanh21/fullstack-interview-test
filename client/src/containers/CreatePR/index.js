import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import APIClient from '../../APIClient';


export default function BranchesContainer({repoLink}) {
  const [branches, setBranches] = useState()
  const [baseBranch, setBaseBranch] = useState()
  const [compareBranch, setCompareBranch] = useState()
  const [prInfo, setPrInfo] = useState({status:'OPEN'})
  const [error, setError] = useState()
  const navigate = useNavigate()

  const { repo_id } = useParams()

  useEffect(()=>{
    getBranches()
  },[])

  const getBranches = async()=>{
    const branches = await APIClient.get(`branch/`)
    setBranches(branches)
  }

  const handleBaseChange = (e) =>{
    setBaseBranch(e.currentTarget.value)
  }

  const handleCompareChange = (e) =>{
    setCompareBranch(e.currentTarget.value)
  }

  const handleInputChange = (e) => {
    let { name, value } = e.target

    setPrInfo({
        ...prInfo,
        [name]:value
    })
  }

  const handleSubmit = async() =>{
    if(baseBranch && compareBranch && prInfo.author && prInfo.title &&
        prInfo.description && prInfo.status){
            const prBody = {
                ...prInfo,
                base_branch_id:baseBranch,
                compare_branch_id:compareBranch
            }
        const PR = await APIClient.post('pullrequest/', prBody)
        if(!PR.id){
            setError('There are conflicts to merge these branches')
        } else {
            navigate(`/home/${repo_id}/prs`)
        }
    } else {
        setError('Fill all the inputs')
    }

  }


  return (
    <div className='my-32 py-20 w-full flex flex-col items-center justify-center'>
        {error?<div className='text-red-500'>{error}</div>:null}
        <div className='flex items-center justify-center'>
            <div className='flex pr-5 border-r'>
                <div className='text-indigo-600 font-semibold text-lg py-4 mr-4'>Base Branch:</div>
                <select className='border p-2 rounded' value={baseBranch} onChange={handleBaseChange}>
                    {branches && branches.length > 0 ? branches.filter(branch=>branch.id !== compareBranch).map(branch=>{
                    return <option value={branch.id}>{branch.name}</option>
                }):null}
                </select>
            </div>
            <div className='flex pl-5'>
                <div className='text-indigo-600 font-semibold text-lg py-4 mr-4'>Compare Branch:</div>
                <select value={compareBranch} className='border p-2 rounded' onChange={handleCompareChange}>
                    {branches && branches.length > 0 ? branches.filter(branch=>branch.id !== baseBranch).map(branch=>{
                    return <option value={branch.id}>{branch.name}</option>
                }):null}
                </select>
            </div>
        </div>
        <div className='flex items-center w-full justify-center mt-10'>
          <div className='w-24'>Title</div>
          <input className='border p-2 m-2 w-1/2' onChange={handleInputChange} value={prInfo.title} name='title'/>
        </div>
        <div className='flex items-center w-full justify-center'>
          <div className='w-24'>Author</div>
          <input className='border p-2 m-2 w-1/2' onChange={handleInputChange} value={prInfo.author} name='author'/>
        </div>
        <div className='flex items-center w-full justify-center'>
          <div className='w-24'>Description</div>
          <textarea className='border p-2 m-2 w-1/2' onChange={handleInputChange} value={prInfo.description} name='description'/>
        </div>
        <div className='flex items-center w-full justify-center' >
            <div className='w-24'>Status:</div>
            <select className='border p-2 m-2 w-1/2' onChange={handleInputChange} value={prInfo.status} name='status'>
                    <option value='OPEN'>Open</option>
                    <option value='MERGED'>Merged</option>
            </select>
        </div>
        <button onClick={handleSubmit} className='border p-2 mt-10 bg-indigo-600 text-white w-40'>Create PR</button>
    </div>
  );
}