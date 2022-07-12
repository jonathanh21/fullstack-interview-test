import React, { useEffect, useState } from 'react'
import APIClient from '../../APIClient'

import { useParams, Link } from 'react-router-dom'

export default function BranchDetail() {
    const [branchDetails, setBranchDetails] = useState()

    const { branch_id, repo_id } = useParams()

    useEffect(()=>{
        getDetails()
    },[])

    const getDetails = async() =>{
        const details = await APIClient.get(`branch/${branch_id}`)
        delete details.repo
        const detailsList = Object.entries(details)

        setBranchDetails(detailsList)
    }


  return (
    <div className=' w-96 text-black flex flex-col items-end justify-end my-32'>
        {branchDetails && branchDetails.length>0 ? branchDetails.map(detail=>{
            return (
            <div className='text-center w-full border m-2 pt-4'>
                <div className='text-indigo-600 border-b pb-4 font-semibold text-lg'>{detail[0].toUpperCase()}</div>
                <div className='p-2'>{Array.isArray(detail[1])?detail[1].map(commit=>{
                    return (
                    <Link to={`/home/${repo_id}/commit_detail/${commit.id}`} className=''>
                        <div className='font-bold pt-6'>message:</div>
                        <div >{commit.message}</div>
                        <div className='font-bold'>author:</div>
                        <div>{commit.message}</div>
                        <div className='font-bold'>timestamp:</div>
                        <div className='border-b pb-6'>{commit.created_at}</div>
                    </Link>
                    )
                }):detail[1]}</div>
            </div>
            )
        }):null}
    </div>
  )
}
