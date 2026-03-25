import type{ Mission } from "../data/models";
import type { Personnel } from "../data/models";
import { checkEligibility } from "./checkEligibility";


export function getEligiblePersonnel(mission: Mission, personnelList: Personnel[]): Personnel[] {
  return personnelList.filter(person => checkEligibility(person, mission));
}   