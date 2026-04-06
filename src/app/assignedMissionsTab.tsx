import { useState } from "react";
import type { Mission } from "../data/models";

type SubTab = "inProgress" | "completed";

interface AssignedMissionsTabProps {
  missions: Mission[];
}

export default function AssignedMissionsTab({ missions }: AssignedMissionsTabProps) {
  const [subTab, setSubTab] = useState<SubTab>("inProgress");

  const inProgress = missions.filter(m => m.status === "inProgress");
  const completed  = missions.filter(m => m.status === "completed");
  const current    = subTab === "inProgress" ? inProgress : completed;

  const priorityStyles = {
    Low:    "bg-gray-100 text-gray-700 border-gray-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    High:   "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-gray-900">Assigned Missions</h2>

      {/* Sub-tabs */}
      <div className="mb-5 flex gap-1 border-b border-gray-200">
        {(["inProgress", "completed"] as SubTab[]).map(key => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors
              ${subTab === key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {key === "inProgress" ? "In Progress" : "Completed"}
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold
              ${subTab === key ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"}`}>
              {key === "inProgress" ? inProgress.length : completed.length}
            </span>
          </button>
        ))}
      </div>

      {/* Mission cards */}
      {current.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">
          {subTab === "inProgress"
            ? "No missions in progress yet. Fully assign a mission to see it here."
            : "No completed missions yet."
          }
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {current.map(mission => (
            <div
              key={mission.id}
              className={`rounded-xl border p-4 transition-all
                ${mission.status === "completed"
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-white"
                }`}
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{mission.name}</h3>
                  <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${priorityStyles[mission.priority]}`}>
                    {mission.priority} Priority
                  </span>
                </div>
                {/* Status badge */}
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold
                  ${mission.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                  }`}>
                  {mission.status === "completed" ? "✓ Completed" : "● In Progress"}
                </span>
              </div>

              {/* Team fill indicator */}
              <div className="mb-3">
                <div className="mb-1 flex justify-between text-xs text-gray-500">
                  <span>Team</span>
                  <span className="font-semibold text-gray-700">
                    {mission.assignedPersonnel.length} / {mission.teamSize}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${Math.round((mission.assignedPersonnel.length / mission.teamSize) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Required skills */}
              <div className="mb-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Required Skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {mission.requiredSkills.map(skill => (
                    <span key={skill} className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assigned personnel */}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Assigned Personnel
                </p>
                <div className="flex flex-wrap gap-1">
                  {mission.assignedPersonnel.map(id => (
                    <span key={id} className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}