import type { Mission } from "./models"


const INITIAL_MISSIONS: Mission[] = [
  {
    id: "m1",
    name: "Operation Firewall",
    requiredSkills: ["Cybersecurity", "Data Analysis"],
    priority: "High",
    assignedPersonnel:[],
  },
  {
    
    id: "m2",
    name: "Diplomatic Summit",
    requiredSkills: ["Leadership", "Negotiation", "Communications"],
    priority: "Medium",
    assignedPersonnel:[],
  },
  {
    id: "m3",
    name: "Supply Chain Review",
    requiredSkills: ["Logistics", "Data Analysis"],
    priority: "Low",
    assignedPersonnel:[],
  },
   {
    id: "m4",
    name: "West Zhao Invasion",
    requiredSkills: ["Logistics", "Communication"],
    priority: "High",
    assignedPersonnel:[],
  },
   {
    id: "m5",
    name: "Presidential Escort",
    requiredSkills: ["Communication", "Negotiation"],
    priority: "High",
    assignedPersonnel:[],
  },
];


export default INITIAL_MISSIONS