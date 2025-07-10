"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Timer, Mic, Phone, Loader2Icon } from "lucide-react";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import Image from "next/image";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const vapiRef = useRef(null);
  const intervalRef = useRef(null);
  const callStartedRef = useRef(false);

  const [activeUser, setActiveUser] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [conversation, setConversation] = useState([]);
  const { interview_id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}.${minutes}.${seconds}`;
  };

  useEffect(() => {
    vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    const vapi = vapiRef.current;

    const onError = (err) => {
      console.error("Vapi SDK error event:", err);
      toast.error("Vapi AI failed: " + (err?.errorMsg || "Unknown error"));
    };

    const onCallStart = () => {
      toast("Call Connected...");
      setSecondsElapsed(0);
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    };

    const onSpeechStart = () => setActiveUser(false);
    const onSpeechEnd = () => setActiveUser(true);

    const onCallEnd = () => {
      toast("Interview Ended");
      clearInterval(intervalRef.current);
      callStartedRef.current = false;
      GenerateFeedback();
    };

    const onMessage = (message) => {
      if (message?.conversation) {
        setConversation(message.conversation);
      }
    };

    vapi.on("error", onError);
    vapi.on("call-start", onCallStart);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);

    return () => {
      vapi.off("error", onError);
      vapi.off("call-start", onCallStart);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (interviewInfo && !callStartedRef.current) {
      callStartedRef.current = true;
      startCall();
    }
  }, [interviewInfo]);

  const startCall = async () => {
    const vapi = vapiRef.current;
    let questionList = "";

    (interviewInfo?.interviewData?.questionList || []).forEach((item) => {
      questionList += item?.question + ", ";
    });

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}?`,
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions and assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.
Ask one question at a time and wait for the candidate’s response before proceeding.
Questions: ${questionList}
If the candidate struggles, offer hints or rephrase the question without giving away the answer.
Provide brief, encouraging feedback after each answer.
Keep the conversation natural and engaging.
After 5–7 questions, wrap up the interview smoothly and end on a positive note.
Keep it friendly, engaging, and React-focused.
            `.trim(),
          },
        ],
      },
    };

    try {
      await vapi.start(assistantOptions);
    } catch (err) {
      console.error("Vapi start error:", err);
      toast.error("Failed to start interview.");
      callStartedRef.current = false;
    }
  };

  const GenerateFeedback = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-feedback", { conversation });
      const content = result.data.content;

      let feedbackData;
      try {
        const FINAL_CONTENT = content.replace(/```json/g, "").replace(/```/g, "").trim();
        feedbackData = JSON.parse(FINAL_CONTENT);
      } catch {
        feedbackData = { raw: content };
      }

      const { data, error } = await supabase
        .from("interview-feedback")
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id: interview_id,
            feedback: JSON.stringify(feedbackData),
            recommended: false,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        toast.error("Failed to save feedback.");
        setLoading(false);
        return;
      }

      router.replace(`https://ai-interviewer-nine-drab.vercel.app/interview/${interview_id}/completed`);
    } catch (err) {
      console.error("Feedback generation error:", err);
      toast.error("Error generating feedback.");
    } finally {
      setLoading(false);
    }
  };

  const stopInterview = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (vapiRef.current) {
        try {
          await vapiRef.current.stop();
          console.log("Vapi stopped.");
        } catch (e) {
          console.warn("Vapi stop failed", e);
        }

        if (typeof vapiRef.current.cancelSpeech === "function") {
          try {
            await vapiRef.current.cancelSpeech();
            console.log("Speech canceled.");
          } catch (err) {
            console.warn("Cancel speech failed", err);
          }
        }

        if (vapiRef.current.meeting && typeof vapiRef.current.meeting.leave === "function") {
          try {
            await vapiRef.current.meeting.leave();
            console.log("Daily meeting left.");
          } catch (e) {
            console.warn("Daily meeting leave failed", e);
          }
        }
      }

      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        console.log("SpeechSynthesis canceled.");
      }

      clearInterval(intervalRef.current);
      callStartedRef.current = false;
      setSecondsElapsed(0);
      setActiveUser(false);
      toast("Call Force-Stopped");

      setTimeout(() => {
        window.location.href = `https://ai-interviewer-nine-drab.vercel.app/interview/${interview_id}/completed`;
      }, 300);
    } catch (err) {
      console.error("Error force stopping interview:", err);
      toast.error("Failed to force end call.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="font-bold text-2xl flex justify-between">
        Interview Session
        <span className="flex items-center gap-2">
          <Timer />
          {formatTime(secondsElapsed)}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative w-[60px] h-[60px]">
            {!activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
            )}
            <Image
              src="/ai.jpg"
              alt="face"
              width={100}
              height={100}
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
          </div>
          <h2>Recruiter</h2>
        </div>

        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative w-[60px] h-[60px]">
            {activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
            )}
            <h2 className="text-2xl bg-primary text-white p-3 rounded-full px-5">
              {interviewInfo?.userName?.[0] || "U"}
            </h2>
          </div>
          <h2>{interviewInfo?.userName}</h2>
        </div>
      </div>

      <div className="flex items-center gap-5 mt-5 justify-center">
        <Mic className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
        {!loading ? (
          <Phone
            className="h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer"
            onClick={stopInterview}
          />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </div>

      <h2 className="text-sm text-gray-400 mt-5 text-center">Interview in Progress...</h2>
    </div>
  );
}

export default StartInterview;
