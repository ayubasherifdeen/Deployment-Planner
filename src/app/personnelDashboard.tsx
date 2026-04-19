import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PersonnelCard from "../components/PersonnelCard";
import type { Mission } from "../data/models";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import type { Personnel } from "../data/models";
import { db } from "../lib/firebase";
import { logActivity } from "../lib/activityLog";
import ConfirmationModal from "../components/confirmationModal";

const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');
    body, * { font-family: 'IBM Plex Mono', 'Courier New', monospace !important; }
    .font-display { font-family: 'Syne', sans-serif !important; }
  `}</style>
);

type TabKey = "profile" | "missions";
type MissionSubTab = "inProgress" | "completed";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "profile",
    label: "Profile",
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
];

interface Props {
  missions: Mission[];
  onMarkComplete: (missionId: string) => void;
}

export default function PersonnelDashboard({
  missions,
  onMarkComplete,
}: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [missionTab, setMissionTab] = useState<MissionSubTab>("inProgress");
  const [myRecord, setMyRecord] = useState<Personnel | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([]);

  useEffect(() => {
    getDocs(collection(db, "personnel")).then((snapshot) => {
      const people = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Personnel[];
      setAllPersonnel(people);
    });
  }, []);

  useEffect(() => {
    if (!user?.personnelId) return;
    // Fetch just their own personnel record
    getDoc(doc(db, "personnel", user.personnelId)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setMyRecord({
          id: snap.id,
          ...data,
          assignedMissionIds: data.assignedMissionIds ?? [],
        } as Personnel);
      }
    });
  }, [user?.personnelId]);

  const myMissions = missions.filter((m) =>
    m.assignedPersonnel.includes(user?.personnelId ?? ""),
  );

  const inProgressMissions = myMissions.filter(
    (m) => m.status === "inProgress",
  );

  const completedMissions = myMissions.filter((m) => m.status === "completed");

  //  show confirmation first
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  //actual logout
  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logActivity({
    action:      "personnel_logout",
    category:    "auth",
    description: `${user?.name} signed out`,
    actorId:     user?.id ?? "",
    actorName:   user?.name ?? "",
    actorRole:   "personnel",
    targetName:  user?.name ?? "",
  });
    await logout();
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
                Welcome,{" "}
                <span className="font-semibold text-gray-900">
                  {user?.name}
                </span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
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

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Personnel Deployment Planner
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Your deployment overview
            </p>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-1 border-b border-gray-200">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors
            ${
              isActive
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-6 flex flex-col gap-6">
        {/* Their own profile card */}

        {activeTab === "profile" && myRecord && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">
              Your Profile
            </h2>

            <PersonnelCard person={myRecord} onRemove={() => {}} />
          </section>
        )}

        {/* assigned missions */}
        {activeTab === "missions" && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">
            Your Missions
          </h2>

          {/* Sub-tabs */}
          <div className="mb-4 flex gap-1 border-b border-gray-200">
            {(["inProgress", "completed"] as MissionSubTab[]).map((key) => (
              <button
                key={key}
                onClick={() => setMissionTab(key)}
                className={`flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium
            ${
              missionTab === key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
              >
                {key === "inProgress" ? "In Progress" : "Completed"}

                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold">
                  {key === "inProgress"
                    ? inProgressMissions.length
                    : completedMissions.length}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          {(missionTab === "inProgress"
            ? inProgressMissions
            : completedMissions
          ).length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              {missionTab === "inProgress"
                ? "No active missions."
                : "No completed missions yet."}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {(missionTab === "inProgress"
                ? inProgressMissions
                : completedMissions
              ).map((mission) => (
                <div
                  key={mission.id}
                  className={`rounded-xl border p-4
              ${
                mission.status === "completed"
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
                >
                  {/* Header */}
                  <div className="mb-2 flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {mission.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {mission.priority} Priority
                      </span>
                    </div>

                    {mission.status === "completed" ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                        ✓ Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => onMarkComplete(mission.id)}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {mission.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {/* ── Teammates — who else is on this mission ── */}
                  {mission.assignedPersonnel.length > 1 && (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Your Team
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {mission.assignedPersonnel
                          // exclude the logged-in person themselves
                          .filter((pid) => pid !== user?.personnelId)
                          .map((pid) => {
                            const teammate = allPersonnel.find(
                              (p) => p.id === pid,
                            );
                            const name = teammate?.name ?? "Unknown";
                            const initials = name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("");

                            return (
                              <div
                                key={pid}
                                className="flex items-center gap-1.5"
                              >
                                {/* Small avatar circle */}
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                                  {initials}
                                </div>
                                <div>
                                  <span className="text-xs font-semibold text-gray-700">
                                    {name}
                                  </span>
                                  {teammate?.rank && (
                                    <span className="ml-1 text-xs text-gray-400">
                                      {teammate.rank}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        )}
        </main>
      {showLogoutConfirm && (
        <ConfirmationModal
          icon="logout"
          title="Sign out?"
          body="You will be returned to the login page."
          warning="Make sure you have noted any important mission details before signing out."
          confirmLabel="Sign Out"
          confirmClass="bg-amber-500 hover:bg-amber-600"
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
}
