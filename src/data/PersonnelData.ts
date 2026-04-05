import type { Personnel } from "./models";

export const INITIAL_PERSONNEL: Personnel[] = [
  {
    id: "p1",
    name: "Sarah Chen",
    rank: "Private",
    skills: ["Cybersecurity", "Data Analysis", "Intelligence"],
    assignedMissionIds:[]
  },
  {
    id: "p2",
    name: "Marcus Johnson",
    rank: "General",
    skills: ["Leadership", "Field Operations", "Negotiation"],
    assignedMissionIds:[],
  },
  {
    id: "p3",
    name: "Elena Rodriguez",
    rank: "Captain",
    skills: ["Communications", "Logistics", "Medical"],
    assignedMissionIds:[]
  },
  {
    id: "p4",
    name: "James Kim",
    rank: "Lieutenant",
    skills: ["Engineering", "Data Analysis"],
    assignedMissionIds:[]
  },
  {
    id: "p5",
    name: "Aisha Patel",
    rank: "Private",
    skills: ["Intelligence", "Cybersecurity", "Communications"],
    assignedMissionIds:[]
  },
  {
    id: "p6",
    name: "Tughril Mahmut",
    rank: "Captain",
    skills: ["Intelligence", "Logistics", "Communications"],
    assignedMissionIds:[]
  },
];



export default INITIAL_PERSONNEL