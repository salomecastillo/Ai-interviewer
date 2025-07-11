import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Progress } from '@radix-ui/react-progress';

function CandidateFeedbackDialogue({ candidate }) {
  const feedback = candidate?.feedback?.feedback;

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="primary">View Report</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <h2 className="bg-primary p-3 px-4.5 font-bold text-white rounded-full">
                      {candidate.userName?.[0] || "U"}
                    </h2>
                    <div>
                      <h2 className="font-bold">{candidate?.userName}</h2>
                      <h2 className="text-sm text-gray-500">{candidate?.userEmail}</h2>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <h2 className="text-primary text-2xl font-bold">
                      {feedback?.rating?.totalRating ?? "N/A"} / 10
                    </h2>
                  </div>
                </div>

                <div className="mt-5">
                  <h2 className="font-bold">Skills Assessment</h2>

                  <div className="mt-3 grid grid-cols-2 gap-10">
                    <h2 className="flex justify-between">
                      Technical Skills <span>{feedback?.rating?.technicalSkills ?? "N/A"} / 10</span>
                    </h2>
                    <Progress value={Number(feedback?.rating?.technicalSkills) * 10 || 0} className="mt-1" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-10">
                    <h2 className="flex justify-between">
                      Communication <span>{feedback?.rating?.communication ?? "N/A"} / 10</span>
                    </h2>
                    <Progress value={Number(feedback?.rating?.communication) * 10 || 0} className="mt-1" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-10">
                    <h2 className="flex justify-between">
                      Problem Solving <span>{feedback?.rating?.problemSolving ?? "N/A"} / 10</span>
                    </h2>
                    <Progress value={Number(feedback?.rating?.problemSolving) * 10 || 0} className="mt-1" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-10">
                    <h2 className="flex justify-between">
                      Experience <span>{feedback?.rating?.experience ?? "N/A"} / 10</span>
                    </h2>
                    <Progress value={Number(feedback?.rating?.experience) * 10 || 0} className="mt-1" />
                  </div>
                </div>

                <div className="mt-5">
                  <h2 className="font-bold">Performance Summary</h2>
                  <div className="p-5 bg-secondary mt-3 rounded-md">
                    {Array.isArray(feedback?.summary) ? (
                      feedback.summary.map((summary, index) => (
                        <p key={index}>{summary}</p>
                      ))
                    ) : (
                      <p>
                        {typeof feedback?.summary === "string"
                          ? feedback.summary
                          : "No summary available."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CandidateFeedbackDialogue;
