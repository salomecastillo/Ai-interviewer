"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider';
import InterviewDetailContainer from './_componenets/InterviewDetailContainer';
import CandidateList from './_componenets/CandidateList';

function InterviewDetail() {
  const { interview_id } = useParams();
  const { user } = useUser();
  const [interviewDetail, setInterviewDetail] = useState({});

  useEffect(() => {
    if (user) GetInterviewDetail();
  }, [user]);

  const GetInterviewDetail = async () => {
    const { data, error } = await supabase
      .from('Interviews')
      .select(`jobPosition, jobDescription, type, questionList, duration, interview_id, created_at, interview-feedback(userEmail, userName, feedback, created_at)`)
      .eq('userEmail', user?.email)
      .eq('interview_id', interview_id);

    if (error) {
      console.error('Error fetching interview detail:', error);
      return;
    }

    if (data && data.length > 0) {
      const detail = data[0];

      // Parse questionList if it's a JSON string
      const parsedQuestionList =
        typeof detail.questionList === 'string'
          ? JSON.parse(detail.questionList)
          : detail.questionList;

      setInterviewDetail({ ...detail, questionList: parsedQuestionList });
    }
  };

  return (
    <div className="mt-15">
      <h2 className="font-bold text-2xl">Interview Detail</h2>
      <InterviewDetailContainer interviewDetail={interviewDetail} />
      <CandidateList candidateList={interviewDetail?.['interview-feedback']} />
    </div>
  );
}

export default InterviewDetail;
