export type Rank = "General" |"Colonel"|"Captain" | "Lieutenant" | "Private";

export interface Personnel {
  id: string;
  name: string;
  rank: Rank;
  skills: string[];
  availability: number;
  assignedMissions: number;
}

export type Priority = "Low" | "Medium" | "High";

export interface Mission {
  id: string;
  name: string;
  requiredSkills: string[];
  priority: Priority;

}

