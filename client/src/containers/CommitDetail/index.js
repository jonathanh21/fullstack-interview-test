import React, {useState, useEffect} from 'react'
import APIClient from '../../APIClient'
import { useParams } from 'react-router-dom'


export default function CommitDetail() {
    const [commitDetails, setCommitDetails] = useState({})

    const { commit_id } = useParams()

    useEffect(()=>{
        getDetails()
    },[])

    const getDetails = async() =>{
        const details = await APIClient.get(`commit/${commit_id}`)
        setCommitDetails(details)
    }


  return (
    <div className=' w-96 text-black flex flex-col items-end justify-end my-32'>
        <div className='text-center w-full border m-2 pt-4'>
            <div className='font-semibold text-lg text-indigo-700 border-b pb-4'>COMMIT #{commitDetails.id} INFORMATION</div>
            <div className='p-6'>
                <div className='font-bold '>message:</div>
                <div >{commitDetails.message}</div>
                <div className='font-bold'>authors:</div>
                <div>{commitDetails.message}</div>
                <div className='font-bold'>filed changed:</div>
                <div>{commitDetails.files_changed}</div>
                <div className='font-bold'>author email:</div>
                <div>{commitDetails.email}</div>
                <div className='font-bold'>timestamp:</div>
                <div className=''>{commitDetails.created_at}</div>
            </div>
        </div>
    </div>
  )
}
