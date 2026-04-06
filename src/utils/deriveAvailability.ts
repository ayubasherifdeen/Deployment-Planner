import type { Personnel } from "../data/models";

export function deriveAvailability(person: Personnel): number {
  const count = person.assignedMissionIds.length;
  return count === 0 ? 100 : Math.max(0, 100 - count * 20);
}