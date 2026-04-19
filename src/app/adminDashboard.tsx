import PersonnelCard from "../components/PersonnelCard";
import MissionCard from "../components/MissionCard";
import AssignmentPanel from "../components/assignmentPanel";
import AssignedMissionsTab from "./assignedMissionsTab";
import SearchInput from "../components/search";
import { useState, useEffect } from "react";
import type { Mission, Personnel } from "../data/models";
import { WarningPanel } from "../components/WarningPanel";
import { AddPersonnelForm } from "../components/addPersonnelForm";
import { AddMissionForm } from "../components/addMissionForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getDocs,
  updateDoc,
  doc,
  collection,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db, secondaryAuth } from "../lib/firebase";
import { logActivity } from "../lib/activityLog";
import { onSnapshot } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import ConfirmationModal from "../components/confirmationModal";

const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');
    body, * { font-family: 'IBM Plex Mono', 'Courier New', monospace !important; }
    .font-display { font-family: 'Syne', sans-serif !important; }
  `}</style>
);

type TabKey = "warnings" | "personnel" | "missions" | "assignedMissions" | "activityLog";

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
    key: "assignedMissions",
    label: "Assigned Missions",
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
  key: "activityLog",
  label: "Activity Log",
  icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
},
];

export default function PersonnelDeploymentPlanner() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("warnings");
  const [showAddPersonnel, setShowAddPersonnel] = useState(false);
  const [showAddMission, setShowAddMission] = useState(false);
  const [search, setSearch] = useState("");
  const [assigningMissionId, setAssigningMissionId] = useState<string | null>(
    null,
  );
  const [confirmModal, setConfirmModal] = useState<{
    type: "removePersonnel" | "logout" | "removeMission";
    personnelId?: string;
    missionId?: string;
    name?: string;
  } | null>(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activityLog, setActivityLog] = useState<any[]>([])

  const overstrechedCount = personnel.filter(
    (p) => p.assignedMissionIds.length >= 3,
  ).length;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "personnel"), (snapshot) => {
      const updated = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          assignedMissionIds: data.assignedMissionIds ?? [],
        };
      }) as Personnel[];
      setPersonnel(updated);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "missions"), (snap) => {
      const data = snap.docs.map((d) => {
        const m = d.data();
        return {
          id: d.id,
          ...m,
          assignedPersonnel: m.assignedPersonnel ?? [], // 🔥 normalize
        };
      }) as Mission[];

      setMissions(data);
    });

    return unsub;
  }, []);

  useEffect(() => {
  const q = query(
    collection(db, "activityLog"),
    orderBy("timestamp", "desc"),
    limit(50) // only fetch the 50 most recent entries
  );

  const unsub = onSnapshot(q, snapshot => {
    const logs = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
    setActivityLog(logs);
  });

  return unsub;
}, []);

  const handleLogout = async () => {
    setConfirmModal({ type: "logout" });
  };

  const confirmLogout = async () => {
    setConfirmModal(null);
    //activity log
    await logActivity({
    action:      "admin_logout",
    category:    "auth",
    description: `${user?.name} signed out`,
    actorId:     user?.id ?? "",
    actorName:   user?.name ?? "",
    actorRole:   "admin",
    targetName:  user?.name ?? "",
  });
    await logout();
    navigate("/app/login");
  };

  const handleAddPersonnel = async (
    newPerson: Personnel,
    email: string,
    password: string,
  ) => {
    try {
      //create user with secondaryauth

      const result = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password,
      );
      const userUid = result.user.uid;

      //create user account
      await setDoc(doc(db, "users", userUid), {
        name: newPerson.name,
        role: "personnel",
        personnelId: newPerson.id,
      });

      //create personnel record
      await setDoc(doc(db, "personnel", newPerson.id), {
        ...newPerson,
        assignedMissionIds: [],
      });
      await sendPasswordResetEmail(secondaryAuth, email);

      //log activity
      await logActivity({
      action:      "personnel_added",
      category:    "personnel",
      description: `${user?.name} added ${newPerson.name} to the system`,
      actorId:     user?.id ?? "",
      actorName:   user?.name ?? "",
      actorRole:   "admin",
      targetName:  newPerson.name,
      metadata:    { rank: newPerson.rank, email },
    });

      setShowAddPersonnel(false);
      alert(
        `Account created. A password setup email has been sent to ${email}`,
      );
    } catch (err: any) {
      console.error("Failed to add personnel:", err.message);
      alert(err.message);
    }
  };

  //confirmation first
  const handleRemovePersonnel = (id: string) => {
    const person = personnel.find((p) => p.id === id);
    setConfirmModal({
      type: "removePersonnel",
      personnelId: id,
      name: person?.name ?? "this person",
    });
  };
  //actual delete
  const confirmRemovePersonnel = async () => {
    if (!confirmModal?.personnelId) return;
    const id = confirmModal.personnelId;
    const name = confirmModal.name ?? "Unknown";
    setConfirmModal(null);

    try {
      await deleteDoc(doc(db, "personnel", id));

      // query for user.id
      const usersQuery = query(
        collection(db, "users"),
        where("personnelId", "==", id),
      );
      const snapshot = await getDocs(usersQuery);
      for (const userDoc of snapshot.docs) {
        await updateDoc(doc(db, "users", userDoc.id), { disabled: true });
      }
      const assignedMissions = missions.filter((m) =>
        m.assignedPersonnel.includes(id),
      );

      for (const mission of assignedMissions) {
        await updateDoc(doc(db, "missions", mission.id), {
          assignedPersonnel: mission.assignedPersonnel.filter(
            (pid) => pid !== id,
          ),
          //revert to planning if it drops below teamSize
          status:
            mission.assignedPersonnel.length - 1 < mission.teamSize
              ? "planning"
              : mission.status,
        });
      }

      //log activity
      await logActivity({
      action:      "personnel_removed",
      category:    "personnel",
      description: `${user?.name} removed ${name} from the system`,
      actorId:     user?.id ?? "",
      actorName:   user?.name ?? "",
      actorRole:   "admin",
      targetName:  name,
      metadata:    { personnelId:id},
    });
    } catch (err: any) {
      console.error("Failed to remove personnel:", err.message);
      alert(err.message);
    }
  };

  const handleAddMission = async (newMission: Mission) => {
    await setDoc(doc(db, "missions", newMission.id), newMission);
    await logActivity({
    action:      "mission_created",
    category:    "mission",
    description: `${user?.name} created mission "${newMission.name}"`,
    actorId:     user?.id ?? "",
    actorName:   user?.name ?? "",
    actorRole:   "admin",
    targetName:  newMission.name,
    metadata:    {
      priority:       newMission.priority,
      teamSize:       newMission.teamSize,
      requiredSkills: newMission.requiredSkills,
    },
  })
    setShowAddMission(false);
  };

  //show confirmation first
  const handleRemoveMission = (id: string) => {
    const mission = missions.find((m) => m.id === id);
    setConfirmModal({
      type: "removeMission",
      missionId: id,
      name: mission?.name ?? "this mission",
    });

    //activity log
    
  };

  // Actual delete
  const confirmRemoveMission = async () => {
    if (!confirmModal?.missionId) return;
    const id = confirmModal.missionId;
    const name = confirmModal.name ?? "Unknown";
    setConfirmModal(null);

    try {
      //find and delete mission
      const mission = missions.find((m) => m.id === id);
      await deleteDoc(doc(db, "missions", id));
      //check for assigned personnels
      if (mission && mission.assignedPersonnel.length > 0) {
        for (const personId of mission.assignedPersonnel) {
          const person = personnel.find((p) => p.id === personId);
          if (!person) continue;

          const updatedMissionIds = person.assignedMissionIds.filter(
            (mId) => mId !== id,
          );

          await updateDoc(doc(db, "personnel", personId), {
            assignedMissionIds: updatedMissionIds,
          });
        }
      }

      //log activity
      await logActivity({
      action:      "mission_removed",
      category:    "mission",
      description: `${user?.name} removed mission "${name}"`,
      actorId:     user?.id ?? "",
      actorName:   user?.name ?? "",
      actorRole:   "admin",
      targetName:  name,
      metadata:    {
        missionId:         id,
        assignedPersonnel: mission?.assignedPersonnel ?? [],
      },
    });
    } catch (err: any) {
      console.error("Failed to remove mission:", err.message);
      alert(err.message);
    }
  };

  const handleToggleAssign = (missionId: string) => {
    setAssigningMissionId((prev) => (prev === missionId ? null : missionId));
  };

  const handleConfirmAssignment = async (
    missionId: string,
    selectedIds: string[],
  ) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    const isFullyAssigned = selectedIds.length >= mission.teamSize;

    try {
      await updateDoc(doc(db, "missions", missionId), {
        assignedPersonnel: selectedIds,
        status: isFullyAssigned ? "inProgress" : "planning",
      });

      const allAffectedIds = Array.from(
        new Set([...selectedIds, ...(mission.assignedPersonnel ?? [])]),
      );

      for (const personId of allAffectedIds) {
        const updatedMissionIds = missions
          .map((m) =>
            m.id === missionId ? { ...m, assignedPersonnel: selectedIds } : m,
          )
          .filter((m) => m.assignedPersonnel.includes(personId))
          .map((m) => m.id);

        await updateDoc(doc(db, "personnel", personId), {
          assignedMissionIds: updatedMissionIds,
        });
      }
      const assignedNames = selectedIds
    .map(pid => personnel.find(p => p.id === pid)?.name ?? pid)
    .join(", ");
      //log activity
       await logActivity({
    action:      "personnel_assigned",
    category:    "mission",
    description: `${user?.name} assigned ${assignedNames} to "${mission.name}"`,
    actorId:     user?.id ?? "",
    actorName:   user?.name ?? "",
    actorRole:   "admin",
    targetName:  mission.name,
    metadata:    {
      missionId:     missionId,
      assignedIds:   selectedIds,
      isFullyAssigned,
    },
  });
    } catch (err) {
      console.error("Assignment failed:", err);
    } finally {
      setAssigningMissionId(null);
    }
  };

  // Only planning missions show in the Missions tab
  const planningMissions = missions.filter((m) => m.status === "planning");

  const filteredPersonnel = personnel.filter((p) =>
  p.name.toLowerCase().includes(search.toLowerCase())
);

const filteredMissions = missions.filter((m) =>
  m.status === "planning" &&
  m.name.toLowerCase().includes(search.toLowerCase())
);   

  return (
    <div className="min-h-screen bg-gray-100">
      <FontStyle />

      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
          {/* Top row */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-xs font-medium text-gray-700">
                Welcome,{" "}
                <span className="font-semibold text-gray-900">
                  {user?.name}
                </span>
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <svg
                className="h-3 w-3"
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

          {/* Title row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">
                Personnel Deployment Planner
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Match personnel to missions intelligently
              </p>
            </div>

            <div className="hidden items-center gap-2 text-xs sm:flex">
              <span className="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[15px] font-semibold text-indigo-700">
                👤 {personnel.length}
              </span>

              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[15px] font-semibold text-gray-600">
                🎯 {missions.length}
              </span>

              {overstrechedCount > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[15px] font-semibold text-red-600">
                  ⚠ {overstrechedCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto" aria-label="Tabs">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium
              transition-colors duration-150 focus:outline-none
              ${
                isActive
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.key === "warnings" && overstrechedCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                      {overstrechedCount}
                    </span>
                  )}
                  {tab.key === "personnel" && (
                    <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                      {personnel.length}
                    </span>
                  )}
                  {tab.key === "missions" && (
                    <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                      {planningMissions.length}
                    </span>
                  )}
                  {tab.key === "assignedMissions" && (
                    <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                      {missions.filter((m) => m.status !== "planning").length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6">
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

        {activeTab === "personnel" && (
          <section>
            <div className="mb-3">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search personnel..."
              />
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <svg
                    className="h-4 w-4 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path
                      strokeLinecap="round"
                      d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                    />
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
              {showAddPersonnel && (
                <div className="mb-4">
                  <AddPersonnelForm
                    onAdd={handleAddPersonnel}
                    onCancel={() => setShowAddPersonnel(false)}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredPersonnel.map((person) => (
  <PersonnelCard
    key={person.id}
    person={person}
    onRemove={handleRemovePersonnel}
  />
))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "missions" && (
          <section>
             <div className="mb-3">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search mission..."
              />
            </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                Missions
              </h2>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                {planningMissions.length} planning
              </span>
              <button
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                onClick={() => setShowAddMission(true)}
              >
                + Add
              </button>
            </div>

            {showAddMission && (
              <div className="mb-4">
                <AddMissionForm
                  onAdd={handleAddMission}
                  onCancel={() => setShowAddMission(false)}
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredMissions.map((mission) => (
                <div key={mission.id} className="flex flex-col">
                  <MissionCard
                    mission={mission}
                    onRemove={handleRemoveMission}
                    onAssign={handleToggleAssign}
                    isAssigning={assigningMissionId === mission.id}
                  />
                  {assigningMissionId === mission.id && (
                    <AssignmentPanel
                      mission={mission}
                      personnel={personnel}
                      onConfirm={handleConfirmAssignment}
                    />
                  )}
                </div>
              ))}

              {planningMissions.length === 0 && (
                <p className="col-span-2 py-6 text-center text-sm text-gray-400">
                  All missions have been assigned. Check the Assigned Missions
                  tab.
                </p>
              )}
            </div>
          </div>
          </section>
        )}
        

        {activeTab === "assignedMissions" && (
          <AssignedMissionsTab missions={missions} personnel={personnel} />
        )}
        {activeTab === "activityLog" && (
  <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <h2 className="mb-4 text-base font-bold text-gray-900">Activity Log</h2>

    {activityLog.length === 0 ? (
      <p className="py-6 text-center text-sm text-gray-400">
        No activity recorded yet.
      </p>
    ) : (
      <div className="flex flex-col divide-y divide-gray-100">
        {activityLog.map(entry => {
          const categoryColors: Record<string, string> = {
            personnel: "bg-indigo-100 text-indigo-700",
            mission:   "bg-blue-100 text-blue-700",
            auth:      "bg-gray-100 text-gray-600",
          };

          // Format the Firestore timestamp
          const time = entry.timestamp?.toDate
            ? entry.timestamp.toDate().toLocaleString()
            : "—";

          return (
            <div key={entry.id} className="flex items-start gap-3 py-3">
              {/* Category pill */}
              <span className={`mt-0.5 flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold
                ${categoryColors[entry.category] ?? "bg-gray-100 text-gray-600"}`}>
                {entry.category}
              </span>

              <div className="flex-1 min-w-0">
                {/* Description */}
                <p className="text-sm text-gray-800">{entry.description}</p>
                {/* Actor and time */}
                <p className="mt-0.5 text-xs text-gray-400">
                  {time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </section>
)}
      </main>
      {/* Confirmation modal — renders on top of everything when active */}
      {confirmModal?.type === "logout" && (
        <ConfirmationModal
          icon="logout"
          title="Sign out?"
          body="You will be returned to the login page. Any unsaved changes may be lost."
          warning="Make sure all assignments have been confirmed before signing out."
          confirmLabel="Sign Out"
          confirmClass="bg-amber-500 hover:bg-amber-600"
          onConfirm={confirmLogout}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {confirmModal?.type === "removePersonnel" && (
        <ConfirmationModal
          icon="remove"
          title={`Remove ${confirmModal.name}?`}
          body={`This will disable ${confirmModal.name}'s access to the system. They will no longer be able to log in.`}
          warning="Their mission history and assignment records will be preserved for audit purposes."
          confirmLabel="Remove Personnel"
          confirmClass="bg-red-600 hover:bg-red-700"
          onConfirm={confirmRemovePersonnel}
          onCancel={() => setConfirmModal(null)}
        />
      )}
      {confirmModal?.type === "removeMission" && (
        <ConfirmationModal
          icon="remove"
          title={`Remove ${confirmModal.name}?`}
          body={`This will permanently delete ${confirmModal.name} from the system.`}
          warning="Any personnel currently assigned to this mission will lose their assignment. This cannot be undone."
          confirmLabel="Remove Mission"
          confirmClass="bg-red-600 hover:bg-red-700"
          onConfirm={confirmRemoveMission}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}
