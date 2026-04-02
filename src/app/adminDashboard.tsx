

import PersonnelCard from "../components/PersonnelCard";
import MissionCard from "../components/MissionCard";
import MakeMatchPanel from "../components/MakeMatchPanel";
import { useState } from "react";
import { getEligiblePersonnel } from "../utils/getEligiblePersonnels";
import type { Mission } from "../data/models";
import type { Personnel } from "../data/models";
import { WarningPanel } from "../components/WarningPanel";
import { AddPersonnelForm } from "../components/addPersonnelForm";
import { AddMissionForm } from "../components/addMissionForm";
import INITIAL_PERSONNEL from "../data/PersonnelData";
import INITIAL_MISSIONS from "../data/MissionData";
import MatchedPersonnelCard from "../components/matchedPersonnelCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');
    body, * { font-family: 'IBM Plex Mono', 'Courier New', monospace !important; }
    .font-display { font-family: 'Syne', sans-serif !important; }
  `}</style>
);

type TabKey = "warnings" | "personnel" | "missions" | "match";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "warnings",
    label: "Status & Warnings",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    key: "personnel",
    label: "Personnel",
    icon: (
      <svg
        className="w-4 h-4"
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
    ),
  },
  {
    key: "missions",
    label: "Missions",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 21l9-9m0 0l9-9M12 12L3 3m9 9l9 9"
        />
      </svg>
    ),
  },
  {
    key: "match",
    label: "Match Results",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"
        />
      </svg>
    ),
  },
];

export default function PersonnelDeploymentPlanner() {
  const [personnel, setPersonnel] = useState<Personnel[]>(INITIAL_PERSONNEL);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [missionName, setMissionName] = useState("");
  const [matchedPersonnels, setMatchedPersonnels] = useState<Personnel[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("warnings");
  const [showAddPersonnel, setShowAddPersonnel] = useState(false);
  const [showAddMission, setShowAddMission] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const overworkedCount = personnel.filter((p) => p.availability < 70).length;

  const onMatch = () => {
    const selectedMission = missions.find((m) => m.name === missionName);
    if (!selectedMission) return;
    const result = getEligiblePersonnel(selectedMission, personnel);
    setMatchedPersonnels(result);
  };

  const handleAddPersonnel = (newPerson: Personnel) => {
    setPersonnel((prev) => [...prev, newPerson]);
    setShowAddPersonnel(false);
  };

  const handleRemovePersonnel = (id: string) => {
    setPersonnel((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddMission = (newMission: Mission) => {
    setMissions((prev) => [...prev, newMission]);
    setShowAddMission(false);
  };

  const handleRemoveMission = (id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate("app/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <FontStyle />
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700">
                Hi,{" "}
                <span className="font-semibold text-gray-900">
                  {user?.name}
                </span>
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              {/* Sign out icon */}
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-gray-900">
                Personnel Deployment Planner
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Match personnel to missions intelligently while avoiding
                overwork
              </p>
            </div>
            <div className="hidden items-center gap-3 text-sm sm:flex">
              <span className="rounded-full bg-indigo-100 px-3 py-1 font-semibold text-indigo-700">
                {personnel.length} personnel
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-600">
                {missions.length} missions
              </span>
              {overworkedCount > 0 && (
                <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-600">
                  {overworkedCount} overworked
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Tab Navbar ── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto" aria-label="Tabs">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium
                    transition-colors duration-150 focus:outline-none
                    ${
                      isActive
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.icon}
                  {tab.label}
                  {/* Badge — show overwork count on warnings tab */}
                  {tab.key === "warnings" && overworkedCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                      {overworkedCount}
                    </span>
                  )}
                  {/* Badge — show counts on personnel / missions tabs */}
                  {tab.key === "personnel" && (
                    <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                      {personnel.length}
                    </span>
                  )}
                  {tab.key === "missions" && (
                    <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                      {missions.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
        {/* Status & Warnings */}
        {activeTab === "warnings" && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
              <svg
                className="h-4 w-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Status &amp; Warnings
            </h2>
            <WarningPanel persons={personnel} />
          </section>
        )}

        {/* Personnel */}
        {activeTab === "personnel" && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                <svg
                  className="h-4 w-4 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                Personnel
              </h2>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                {personnel.length} units
              </span>
              <button
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                onClick={() => setShowAddPersonnel(true)}
              >
                + Add
              </button>
            </div>
            <div className="space-y-3 m-4">
              {showAddPersonnel && (
                <AddPersonnelForm
                  onAdd={handleAddPersonnel}
                  onCancel={() => setShowAddPersonnel(false)}
                />
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {personnel.map((person) => (
                <PersonnelCard
                  key={person.id}
                  person={person}
                  onRemove={handleRemovePersonnel}
                />
              ))}
            </div>
          </section>
        )}

        {/* Missions */}
        {activeTab === "missions" && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                <svg
                  className="h-4 w-4 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <polygon points="3,11 12,2 21,11 21,21 3,21" />
                  <rect x="9" y="14" width="6" height="7" />
                </svg>
                Missions
              </h2>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                {missions.length} active
              </span>
              <button
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                onClick={() => setShowAddMission(true)}
              >
                + Add
              </button>
            </div>
            <div className="space-y-3 m-4">
              {showAddMission && (
                <AddMissionForm
                  onAdd={handleAddMission}
                  onCancel={() => setShowAddMission(false)}
                />
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
              {missions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onRemove={handleRemoveMission}
                />
              ))}
            </div>
          </section>
        )}

        {/* Match Results */}
        {activeTab === "match" && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
              <svg
                className="h-4 w-4 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"
                />
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
              <div className="mt-4 space-y-2 m-6">
                {matchedPersonnels.map((person) => (
                  <MatchedPersonnelCard key={person.id} person={person} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
