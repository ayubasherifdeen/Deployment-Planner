import type{ Personnel } from "../data/models";



interface PersonnelCardProps {
  person: Personnel;
}

export function PersonnelCard({
  person,
}: PersonnelCardProps) {
  const rankColors: Record<string, string> = {
    Private: "bg-gray-100 text-gray-700",
    Lieutenant: "bg-blue-100 text-blue-700",
    Captain: "bg-purple-100 text-purple-700",
    General: "bg-amber-100 text-amber-700",
  };

  const avBarColor =
    person.availability >= 70 ? "bg-green-500" :
    person.availability >= 40 ? "bg-yellow-500" : "bg-red-500"

  const avTextColor =
    person.availability >= 70 ? "text-green-600" :
    person.availability >= 40 ? "text-yellow-600" : "text-red-600";

  const initials = person.name.split(" ").map(n => n[0]).slice(0, 2).join('');   

  const overworked = person.availability < 70;
  
  return (
    <div className={`rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${overworked ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"}`}>
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{person.name}</h3>
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${rankColors[person.rank] || "bg-gray-100 text-gray-700"}`}>
              {person.rank}
            </span>
          </div>
        </div>
        {overworked && (
          <span className="rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
            ⚠ OVERWORKED
          </span>
        )}
      </div>
 
      {/* Skills */}
      <div className="mb-3">
        <p className="mb-1.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {person.skills.map(skill => (
            <span key={skill} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {skill}
            </span>
          ))}
        </div>
      </div>
 
      {/* Availability */}
      <div className="mb-2">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Availability</p>
          <span className={`text-xs font-bold ${avTextColor}`}>{person.availability}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${avBarColor}`}
            style={{ width: `${person.availability}%` }}
          />
        </div>
      </div>
 
      {person.assignedMissions > 0 && (
        <p className="mt-2 text-xs text-gray-500">
          Assigned to <span className="font-semibold text-gray-700">{person.assignedMissions}</span> mission{person.assignedMissions !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
  
}


export default PersonnelCard