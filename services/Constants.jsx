import { BriefcaseBusinessIcon, Code2Icon, LayoutDashboard, Puzzle, User2Icon } from "lucide-react";

export const SideBarOptions=[
    {
        name:'Dashboard',
        icon: LayoutDashboard,
        path:'/dashboard'
    },
    {
        name:'Scheduled Interview',
        icon: LayoutDashboard,
        path:'/scheduled-interview'
    },
    {
        name:'All Interview',
        icon: LayoutDashboard,
        path:'/all-interview'
    },
    {
        name:'Billing',
        icon: LayoutDashboard,
        path:'/billing'
    },
    {
        name:'Settings',
        icon: LayoutDashboard,
        path:'/settings'
    },
]

export const InterviewType=[
    {
        title: 'Technical',
        icon: Code2Icon
    },
    {
        title: 'Behavioral',
        icon: User2Icon
    },
    {
        title: 'Experience',
        icon: BriefcaseBusinessIcon
    },
    {
        title: 'Probelm Solving',
        icon: Puzzle
    },
    {
        title: 'PLeadership',
        icon: Puzzle
    },
]

export const QUESTIONS_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}

Job Description:{{jobDescription}}

Interview Duration: {{duration}}

Interview Type: {{type}}

Your task:

Analyze the job description to identify key responsibilities, required skills, and expected experience.

Generate a list of interview questions depends on interview duration

Adjust the number and depth of questions to match the interview duration.

Ensure the questions match the tone and structure of a real-life {{type}} interview.

Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
 question:'',
 type:'Technical/Behavioral/Experince/Problem Solving/Leaseship'
},{
...
}]

The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role. DO not return anything aside from the structure i have given you.`

export const FEEDBACK_PROMPT= `{{conversation}}
Depends on this Interview Conversation between assitant and user, 
Give me feedback for user interview. Give me rating out of 10 for technical Skills, 
Communication, Problem Solving, Experince. Also give me summery in 3 lines 
about the interview and one line to let me know whether is recommanded 
for hire or not with msg. Give me response in JSON format
{
    feedback:{
        rating:{
            techicalSkills:5,
            communication:6,
            problemSolving:4,
            experince:7
        },
        summary:<in 3 Line>,
        Recommendation:'',
        RecommendationMsg:''
    }
}
`
