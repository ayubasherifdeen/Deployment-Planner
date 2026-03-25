import PersonnelCard from "./PersonnelCard";
import MissionCard from "./MissionCard";
import MakeMatchPanel from "./MakeMatchPanel";
import { useState } from "react";
import { getEligiblePersonnel } from "../utils/getEligiblePersonnels";
import type { Mission } from "../data/models";
import type { Personnel } from "../data/models";

import { WarningPanel } from "./WarningPanel";
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');
    body, * { font-family: 'IBM Plex Mono', 'Courier New', monospace !important; }
    .font-display { font-family: 'Syne', sans-serif !important; }
  `}</style>
);

interface PersonnelDeploymentPlannerProps {
  persons: Personnel[];
  missions: Mission[];
}

export default function PersonnelDeploymentPlanner({
  persons,
  missions,
}: PersonnelDeploymentPlannerProps) {
  const [missionName, setMissionName] = useState("");
  const [matchedPersonnels, setMatchedPersonnels] = useState<Personnel[]>([]);

   const overworkedCount = persons.filter(p => p.availability < 70).length;
 
  const onMatch = () => {
    const selectedMission = missions.find((m) => m.name === missionName);
    if (!selectedMission) return;
    const result = getEligiblePersonnel(selectedMission, persons);
    setMatchedPersonnels(result);
  };

  return (
    
    <div className="min-h-screen bg-gray-100">
      <FontStyle />
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">Personnel Deployment Planner</h1>
              <p className="mt-0.5 text-sm text-gray-500">Match personnel to missions intelligently while avoiding overwork</p>
            </div>
            <div className="hidden items-center gap-3 text-sm sm:flex">
              <span className="rounded-full bg-indigo-100 px-3 py-1 font-semibold text-indigo-700">{persons.length} personnel</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-600">{missions.length} missions</span>
              {overworkedCount > 0 && (
                <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-600">{overworkedCount} overworked</span>
              )}
            </div>
          </div>
        </div>
      </header>
 
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
 
        {/* Status & Warnings */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
            <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Status &amp; Warnings
          </h2>
          <WarningPanel persons={persons} />
        </section>
 
        {/* Personnel */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
              <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/><path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              Personnel
            </h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {persons.length} units
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {persons.map(person => <PersonnelCard key={person.id} person={person} />)}
          </div>
        </section>
 
        {/* Missions */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
              <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polygon points="3,11 12,2 21,11 21,21 3,21"/><rect x="9" y="14" width="6" height="7"/>
              </svg>
              Missions
            </h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {missions.length} active
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
            {missions.map(mission => <MissionCard key={mission.id} mission={mission} />)}
          </div>
        </section>
 
        {/* Match Results */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
            <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
            </svg>
            Match Results
          </h2>
          <MakeMatchPanel
            missions={missions}
            missionName={missionName}
            onMissionChange={setMissionName}
            onMatch={onMatch}
          />

          {/* Results */}
          {missionName !== "" && matchedPersonnels.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              No personnel match the requirements for this mission.
            </p>
          )}
          {matchedPersonnels.length > 0 && (
            
            <div className="mt-4 space-y-2 flex flex-space-around flex-wrap m-4">
              {matchedPersonnels.map((person) => (
                <PersonnelCard key={person.id} person={person} />
              ))}
            </div>
          )}
        </section>
 
      </main>
    </div>
  );
}