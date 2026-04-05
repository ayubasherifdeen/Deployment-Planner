
import type { Mission, Personnel } from "../data/models";

export function checkAvailability(personnel:Personnel):boolean{
  return (personnel.assignedMissionIds.length < 3)
}

export function checkSkills(personnel:Personnel, mission:Mission):boolean{
    const matchingSkills = personnel.skills.filter(skill => mission.requiredSkills.includes(skill));
    return matchingSkills.length >= 1;
}

export function checkEligibility(personnel:Personnel, mission:Mission):boolean{
    return checkAvailability(personnel) && checkSkills(personnel, mission)
}








