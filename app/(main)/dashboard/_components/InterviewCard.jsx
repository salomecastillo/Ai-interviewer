import { Button } from '@/components/ui/button'
import { ArrowRight, Copy, Send } from 'lucide-react'
import moment from 'moment'
import { urlToUrlWithoutFlightMarker } from 'next/dist/client/components/router-reducer/fetch-server-response'
import Link from 'next/link'

import React from 'react'
import { toast } from 'sonner'

function InterviewCard({interview, viewDetail=false}) {
    const url=(process.env.NEXT_PUBLIC_HOST_URL || 'https://ai-interviewer-nine-drab.vercel.app') + '/' + interview?.interview_id
        const copyLink=()=>{
          navigator.clipboard.writeText(url);
          toast('Text copied')
        }

        const onSend=()=>{
            window.location.href="mailto:salomecv555@gmail.com?subject=AI Interview Link & body=Interview Link:"+ url
        }

  return (
    <div className='p-5 bg-white rounded-lg border'>
        <div className='flex items-center justify-between'>
            <div className='h-[40px] w-[40px] bg-primary rounded-full'/>
            <h2 className='text-sm'>{moment(interview?.created_at).format('DD MMM YYY')}</h2>
        </div>
        <h2 className='mt-3 font-bold text-lg'>{interview?.jobPosition}</h2>
        <h2 className='mt-2 flex justify-between text-gray-500'>{interview?.duration}
          <span className='text-primary'>{interview['interview-feedback']?.length} Candidates</span>
        </h2>
        {!viewDetail? <div className='flex gap-3 w-full mt-5' >
            <Button variant='outline' className={''} onClick={copyLink}> <Copy /> Copy Link</Button>
            <Button className={''} onClick={onSend}> <Send /> Send</Button>
        </div>
        :
        <Link href={'/scheduled-interview/' + interview?.interview_id + '/details'}>
          <Button className='mt-5 w-full' variant='outline'>View Details <ArrowRight/> </Button>
        </Link>
        }
    </div>
  )
}

export default InterviewCard