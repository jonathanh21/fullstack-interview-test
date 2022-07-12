import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom'
import APIClient from '../../APIClient';


export default function PrContainer({repoLink}) {
  const [prs, setPrs] = useState()

  const { repo_id } = useParams()

  useEffect(()=>{
    getPrs()
  },[])

  const getPrs = async()=>{
    const prs = await APIClient.get(`pullrequest/`)
    setPrs(prs)
  }
   const handleClosePr = async(pr_id) => {
    const new_pr = await APIClient.patch(`pullrequest/${pr_id}/`,{status:"CLOSED"})
    getPrs()
   }


  return (
    <div className='my-32 py-20 flex flex-col justify-between items-center w-full' >
        <div className='text-3xl font-bold text-indigo-800 pb-10'>LIST OF PULL REQUESTS</div>
        <div className='flex justify-between w-1/2' style={{'flex-wrap':'wrap'}}>
            {prs && prs.length > 0 ? prs.map(pr=>{
                return (
                <div className='border w-56 m-2 p-6 rounded'>
                    <div className='flex'>
                        <div className='font-semibold text-indigo-600 w-32'>Title:</div>
                        <div>{pr.title}</div>
                    </div>
                    <div className='flex'>
                        <div className='font-semibold text-indigo-600 w-32'>author:</div>
                        <div>{pr.author}</div>
                    </div>
                    <div className='flex'>
                        <div className='font-semibold text-indigo-600 w-32'>description:</div>
                        <div>{pr.description}</div>
                    </div>
                    <div className='flex'>
                        <div className='font-semibold text-indigo-600 w-32'>status:</div>
                        <div>{pr.status.toLowerCase()}</div>
                    </div>
                    {pr.status=='OPEN'?<button className='w-full border rounded p-2 mt-6 bg-indigo-600 text-white' onClick={()=>handleClosePr(pr.id)}>Close PR</button>:null}
                </div>
                )
            }):null}
        </div>
    </div>
  );
}