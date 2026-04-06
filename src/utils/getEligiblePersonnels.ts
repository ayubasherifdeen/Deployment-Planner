import type { Mission, Personnel } from "../data/models";
 
export type EligiblePersonnel = Personnel & {
  score:   number;
  matched: string[];
  missing: string[];
};
 
export function getEligiblePersonnel(
  mission:    Mission,
  personnels: Personnel[]
): EligiblePersonnel[] {
  return personnels
    .map(person => {
      const matched = mission.requiredSkills.filter(s => person.skills.includes(s));
      const missing = mission.requiredSkills.filter(s => !person.skills.includes(s));
      const score   = Math.round((matched.length / mission.requiredSkills.length) * 100);
      return { ...person, score, matched, missing };
    })
    
    .filter(person => person.score > 0)
    .sort((a, b) => b.score - a.score);
}