"use client"

import { useUser } from '@/app/provider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';
import { Camera, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import InterviewCard from './InterviewCard';
import { toast } from 'sonner';

function LatestInterviewsList() {
    const [interviewList, setInterviewList] = useState([]);
    const {user}=useUser();

    useEffect(()=>{
      user&&GetInterviewList();
    },[user])

    const GetInterviewList=async()=>{
      let{data: Interviews, error} = await supabase
        .from('Interviews')
        .select('*')
        .eq('userEmail', user?.email)
        .order('id',{ascending: false})
        ;
      console.log(Interviews);
      setInterviewList(Interviews);
    }
  return (
    <div className='my-5'>
        <h2 className='font-bold text-2xl'> Previously Created Interviews  </h2>
    
        {interviewList?.length==0&&
        <div className='p-5 flex flex-col gap-3 items-center mt-5 bg-white'>
            <Video className='h-12 w-12 text-primary'/>
            <h2> You don't have any interviews yet</h2>
            <Button>+ Create New Interview </Button>
        </div>}

        {interviewList&&
            <div className='grid grid-cols-2 xl: grid-cols-3 gap-5 mt-5'>
              {interviewList.map((interview,index)=>(
                <InterviewCard interview={interview} key={index}/>
              ))}
            </div>
        }
    </div>
  )
}

export default LatestInterviewsList