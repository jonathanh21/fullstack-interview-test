import React, {useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom'
import APIClient from '../../APIClient';


export default function ManageRepo({setRepoLink}) {
  const [reposList, setRepoList] = useState()
  const [name, setName] = useState()
  const [link, setLink] = useState()
  const [error, setError] = useState()
  const navigate = useNavigate()

  useEffect(()=>{
    getExistingRepos()
  },[])

  const getExistingRepos = async () =>{
    const reposList = await APIClient.get('repos/')
    setRepoList(reposList)
  }

  const handleSubmit = async () => {
    if(!name || !link){
      return setError('Fill all the inputs')
    }
    const repo = await APIClient.post('repos/',{name, link})
    if(!repo.id){
      return setError('repo with this name already existss')
    }
    setRepoLink(repo.link)
    await APIClient.get(`repos/${repo.id}/`)
    navigate(`/home/${repo.id}/branches`)
  }

  return (
    <div className='my-20 flex flex-col items-center justify-center'>
        <div className='text-3xl text-indigo-800 font-bold p-10' >REGISTER YOUR REPO OR SELEC AN EXISTING ONE</div>
        {error?<div className='p-2 text-red'>{error}</div>:null}
        <div className='mb-4 border rounded p-8 items-center justify-center flex flex-col'>
          <div className='flex items-center '>
            <div className='w-24'>Name</div>
            <input className='border p-2 m-2 rounded' onChange={(e)=>setName(e.target.value)} value={name}/>
          </div>
          <div className='flex items-center '>
            <div className='w-24'>Repo Link</div>
            <input className='border p-2 m-2 ropunded' onChange={(e)=>setLink(e.target.value)} value={link}/>
          </div>
          <button onClick={handleSubmit} className='border p-3 mt-10 bg-indigo-600 text-white w-48 rounded'>Manage your repo</button>
        </div>
        <div className='text-lg py-5 mb-5 w-56 text-center border-b '>EXISTING REPOS</div>
        {reposList && reposList.length? reposList.map((repo)=>{
          return <Link to={`/home/${repo.id}/branches`} className="p-3 w-40 text-center border rounded bg-indigo-400 text-white">{repo.name.toUpperCase()}</Link>
        }):null}
    </div>
  );
}
