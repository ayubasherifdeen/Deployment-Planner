import type { Mission } from "../data/models";
 
interface MissionCardProps {
  mission:     Mission;
  onRemove:    (id: string) => void;
  onAssign:    (id: string) => void;
  isAssigning: boolean;
}
 
export function MissionCard({
  mission,
  onRemove,
  onAssign,
  isAssigning,
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
    <div className={`overflow-hidden rounded-xl border bg-white transition-all hover:shadow-md
      ${isAssigning ? "border-indigo-400" : cardBorder[mission.priority]}`}>
 
      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{mission.name}</h3>
            <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${priorityStyles[mission.priority]}`}>
              {mission.priority} Priority
            </span>
          </div>
          
 
          <div className="text-right">
            <p className="text-xs text-gray-400">Assigned</p>
            <p className="text-base font-extrabold text-gray-800">
              {mission.assignedPersonnel.length}/{mission.teamSize}
            </p>
          </div>
        </div>
        
 
        {/* Required skills */}
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Required Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {mission.requiredSkills.map(skill => (
              <span key={skill} className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
 
        {/* Assigned personnel — shows names not raw ids */}
        {/* Bug fix: was mission.assignedPersonnelId */}
        {mission.assignedPersonnel.length > 0 && (
          <div className="mb-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Assigned
            </p>
            <div className="flex flex-wrap gap-1">
              {mission.assignedPersonnel.map(id => (
                <span key={id} className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}
 
        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <button
            onClick={() => onRemove(mission.id)}
            className="text-xs text-gray-400 transition-colors hover:text-red-500"
          >
            Remove
          </button>
          <button
            onClick={() => onAssign(mission.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors
              ${isAssigning
                ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
          >
            {isAssigning ? "▲ Close" : "+ Assign Personnel"}
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default MissionCard;