"use client";

import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import InterviewDetailContainer from './_componenets/InterviewDetailContainer';
import CandidateList from './_componenets/CandidateList';

function InterviewDetail() {
  const { interview_id } = useParams(); // assuming this is the "id" in Interviews table
  const { user } = useUser();
  const [interviewDetail, setInterviewDetail] = useState();

  useEffect(() => {
    if (user) {
      GetInterviewDetail();
    }
  }, [user]);

  const GetInterviewDetail = async () => {
    const result = await supabase
      .from('Interviews')
      .select(`
        id,
        jobPosition,
        jobDescription,
        type,
        questionList,
        duration,
        created_at,
        interview_feedback(
          userEmail,
          userName,
          feedback,
          created_at
        )
      `)
      .eq('id', interview_id); // filter using the correct primary key

    setInterviewDetail(result?.data?.[0]);
    console.log("Interview Detail Result:", result);
  };

  return (
    <div className="mt-5">
      <h2 className="font-bold text-2xl">Interview Details</h2>
      <InterviewDetailContainer interviewDetail={interviewDetail} />
      <CandidateList candidateList={interviewDetail?.interview_feedback} />
    </div>
  );
}

export default InterviewDetail;
