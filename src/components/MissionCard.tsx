"use client";


import type{ Mission } from "../data/models"

interface MissionCardProps {
  mission: Mission;

}

export function MissionCard({
  mission
}: MissionCardProps) {
   const priorityStyles = {
    Low:    "bg-gray-100 text-gray-700 border-gray-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    High:   "bg-red-100 text-red-700 border-red-200",
  };
 
  const cardBorder = {
    Low:    "border-gray-200",
    Medium: "border-yellow-200",
    High:   "border-red-200",
  };
 
  return (
    <div className={`rounded-xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${cardBorder[mission.priority]}`}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{mission.name}</h3>
          <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${priorityStyles[mission.priority]}`}>
            {mission.priority} Priority
          </span>
        </div>
        
      </div>
 
      <div className="mb-2">
        <p className="mb-1.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Required Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {mission.requiredSkills.map(skill => (
            <span key={skill} className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {skill}
            </span>
          ))}
        </div>
      </div>
 
    </div>
  );


 
}
export default MissionCard