import { useState } from "react";
import type { Mission, Personnel } from "../data/models";
import { getEligiblePersonnel } from "../utils/getEligiblePersonnels";
import PersonnelCard from "./PersonnelCard";

const MAX_MISSIONS = 3;

interface AssignmentPanelProps {
  mission: Mission;
  personnel: Personnel[];
  onConfirm: (missionId: string, selectedIds: string[]) => void;
}

export default function AssignmentPanel({
  mission,
  personnel,
  onConfirm,
}: AssignmentPanelProps) {
  const eligible = getEligiblePersonnel(mission, personnel);

  const [selected, setSelected] = useState<string[]>(
    mission.assignedPersonnel ?? [],
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="border-t border-indigo-200 bg-indigo-50 p-4">
      {/* Panel header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="h-3.5 w-3.5 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
            Eligible Personnel
          </span>
        </div>
        <span className="text-xs text-gray-400">
          Select to assign · skills shown below each
        </span>
      </div>

      {/* Personnel rows */}
      <div className="flex flex-col gap-2">
        {eligible.map((person) => {
          const isUnavailable =
            person.assignedMissionIds.length >= MAX_MISSIONS &&
            !mission.assignedPersonnel.includes(person.id);
          const isChecked = selected.includes(person.id);

          return (
            <div
              key={person.id}
              className={`rounded-xl border transition-all
              ${isUnavailable ? "opacity-50 pointer-events-none" : ""}
              ${isChecked ? "border-indigo-300" : "border-gray-200"}
      `}
            >
              <PersonnelCard person={person} onRemove={() => {}} />

              <div className="flex flex-col gap-1.5 border-t border-gray-100 bg-gray-50 px-4 py-2">
                {/* Matched skills */}
                {person.matched.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="w-14 flex-shrink-0 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Matched
                    </span>
                    {person.matched.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Missing skills */}
                {person.missing.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="w-14 flex-shrink-0 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Missing
                    </span>
                    {person.missing.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700"
                      >
                        ✗ {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold
            ${
              person.score === 100
                ? "bg-green-100 text-green-700"
                : person.score >= 50
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-500"
            }`}
                  >
                    {person.score}% match
                  </span>

                  {isUnavailable ? (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-400">
                      Max missions reached
                    </span>
                  ) : (
                    <button
                      onClick={() => toggleSelect(person.id)}
                      className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors
                ${
                  isChecked
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-gray-300 bg-white hover:border-indigo-400"
                }`}
                    >
                      {isChecked && (
                        <svg
                          className="h-2.5 w-2.5"
                          fill="none"
                          stroke="white"
                          strokeWidth={3}
                          viewBox="0 0 12 12"
                        >
                          <polyline points="2,6 5,9 10,3" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {eligible.length === 0 && (
          <p className="py-3 text-center text-xs text-gray-400">
            No eligible personnel found for this mission.
          </p>
        )}
      </div>

      <button
        onClick={() => onConfirm(mission.id, selected)}
        className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700"
      >
        Confirm assignments ({selected.length}/{mission.teamSize} selected)
      </button>
    </div>
  );
}
