import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom'
import APIClient from '../../APIClient';


export default function BranchesContainer({repoLink}) {
  const [branches, setBranches] = useState()
  const [loading, setLoading] = useState()

  const { repo_id } = useParams()

  useEffect(()=>{
    getBranches()
  },[])

  const getBranches = async()=>{
    setLoading(true)
    await APIClient.get(`repos/${repo_id}`)
    const branches = await APIClient.get(`branch/`)
    setBranches(branches)
    setLoading(false)
  }


  return (
    <div className='my-20 flex flex-col items-center justify-center'>
        <div className='text-3xl font-bold text-indigo-800 py-16'>List of branches</div>
        {loading? <div className='text-lg text-indigo-300'>LOADING....</div>: null}
        {branches && branches.length > 0 ? branches.map(branch=>{
            return <Link className='border p-3 rounded bg-indigo-400 text-center text-white w-full' to={`/home/${repo_id}/branch_detail/${branch.id}`}>{branch.name}</Link>
        }):null}
    </div>
  );
}