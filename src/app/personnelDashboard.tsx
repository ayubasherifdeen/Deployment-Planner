
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import INITIAL_PERSONNEL from "../data/PersonnelData";
import PersonnelCard from "../components/PersonnelCard";
import type { Mission } from "../data/models";

const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');
    body, * { font-family: 'IBM Plex Mono', 'Courier New', monospace !important; }
    .font-display { font-family: 'Syne', sans-serif !important; }
  `}</style>
);

interface Props {
  missions:       Mission[];
  onMarkComplete: (missionId: string) => void;
}

export default function PersonnelDashboard({ missions, onMarkComplete }: Props) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const myRecord = INITIAL_PERSONNEL.find(p => p.id === user?.personnelId);

  // Only missions this person is assigned to
  const myMissions = missions.filter(m =>
    m.assignedPersonnel.includes(user?.personnelId ?? "")
  );

  const handleLogout = () => {
    logout();
    navigate("/app/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <FontStyle />

      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700">
                Welcome, <span className="font-semibold text-gray-900">{user?.name}</span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Personnel Deployment Planner
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">Your deployment overview</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 flex flex-col gap-6">

        {/* Their own profile card */}
        {myRecord && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">Your Profile</h2>
            {/* onRemove is a no-op — personnel can't remove themselves */}
            <PersonnelCard person={myRecord} onRemove={() => {}} />
          </section>
        )}

        
        {/* assigned missions */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">
            Your Missions ({myMissions.length})
          </h2>

          {myMissions.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">
              No missions assigned to you yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {myMissions.map(mission => (
                <div
                  key={mission.id}
                  className={`rounded-xl border p-4 transition-all
                    ${mission.status === "completed"
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-white"
                    }`}
                >
                  {/* Header */}
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{mission.name}</h3>
                      <span className="text-xs text-gray-400">{mission.priority} Priority</span>
                    </div>

                    {/* Completed badge or Mark Complete button */}
                    {mission.status === "completed" ? (
                      <span className="flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                        ✓ Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => onMarkComplete(mission.id)}
                        className="flex-shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-700"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>

                  

                  {/* Required skills */}
                  <div className="flex flex-wrap gap-1">
                    {mission.requiredSkills.map(skill => (
                      <span key={skill} className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}