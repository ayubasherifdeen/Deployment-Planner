import type { Personnel } from "./models";

const INITIAL_PERSONNEL: Personnel[] = [
  {
    id: "p1",
    name: "Sarah Chen",
    rank: "Private",
    skills: ["Cybersecurity", "Data Analysis", "Intelligence"],
    availability: 80,
    assignedMissions:2,
  },
  {
    id: "p2",
    name: "Marcus Johnson",
    rank: "General",
    skills: ["Leadership", "Field Operations", "Negotiation"],
    availability: 70,
    assignedMissions: 2
  },
  {
    id: "p3",
    name: "Elena Rodriguez",
    rank: "Captain",
    skills: ["Communications", "Logistics", "Medical"],
    availability: 100,
    assignedMissions: 0,
  },
  {
    id: "p4",
    name: "James Kim",
    rank: "Lieutenant",
    skills: ["Engineering", "Data Analysis"],
    availability: 90,
    assignedMissions: 1,
  },
  {
    id: "p5",
    name: "Aisha Patel",
    rank: "Private",
    skills: ["Intelligence", "Cybersecurity", "Communications"],
    availability: 40,
    assignedMissions: 4,
  },
  {
    id: "p6",
    name: "Tughril Mahmut",
    rank: "Captain",
    skills: ["Intelligence", "Logistics", "Communications"],
    availability: 80,
    assignedMissions: 2,
  },
];



 export default INITIAL_PERSONNEL

