export type Rank = "General" |"Colonel"|"Captain" | "Lieutenant" | "Private";

export interface Personnel {
  id: string;
  name: string;
  rank: Rank;
  skills: string[];
  assignedMissionIds: string[]
}

export type Priority = "Low" | "Medium" | "High";
export type MissionStatus = "planning" | "inProgress" | "completed";

export interface Mission {
  id: string;
  name: string;
 
  requiredSkills: string[];
  priority: Priority;
  assignedPersonnel:string[]
  teamSize:number,
  status:MissionStatus

}


type Role = "admin" | "personnel";

export interface AppUser {
  id: string;
  email:string
  password:string
  role: Role;
  personnelId: string | null;
  name: string;
}
