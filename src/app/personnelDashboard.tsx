// src/pages/PersonnelDashboard.tsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import INITIAL_PERSONNEL from "../data/PersonnelData";
import PersonnelCard from "../components/PersonnelCard";



const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');
    body, * { font-family: 'IBM Plex Mono', 'Courier New', monospace !important; }
    .font-display { font-family: 'Syne', sans-serif !important; }
  `}</style>
);
export default function PersonnelDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  
  const myRecord = INITIAL_PERSONNEL.find(p => p.id === user?.personnelId);

 
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
        <FontStyle />
      <header className="border-b border-gray-200 bg-white shadow-sm">
       <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700">
                Welcome,
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
                Your Deployment Overview
              </p>
            </div>
            
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 flex flex-col gap-6">

        {/* personnel's own personnel card */}
        {myRecord && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">
              Your Profile
            </h2>
            {/* onRemove is not operational, personnel can't remove themselves */}
            <PersonnelCard person={myRecord} onRemove={() => {}} />
          </section>
        )}

        

      </main>
    </div>
  );
}
