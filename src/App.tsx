import './App.css'
import type{ Mission } from './data/models'
import PersonnelDeploymentPlanner from './app/adminDashboard'
import LoginPage from './app/login'
import PersonnelDashboard from './app/personnelDashboard'
import { useAuth } from './context/AuthContext'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from './lib/firebase'
import { logActivity } from './lib/activityLog'





function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole: "admin" | "personnel";
}) {
  const { user, loading } = useAuth();

  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  
  if (!user) return <Navigate to="/app/login" replace />;

  
  if (user.role !== requiredRole) {
    return <Navigate to={user.role === "admin" ? "/app/adminDashboard" : "/app/personnelDashboard"} replace />;
  }


  return <>{children}</>;
}


export default function App() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [missionsLoading, setMissionsLoading] = useState(true);
  const { user }=useAuth()

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "missions"), snapshot => {
      const updated = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as Mission[];
      setMissions(updated);
      setMissionsLoading(false);
    });
    return unsub;
  }, []);

  const handleMarkComplete = async (missionId: string) => {
    await updateDoc(doc(db, "missions", missionId), {
      status: "completed",
    });
    const mission = missions.find(m => m.id === missionId);

  await logActivity({
    action:      "mission_completed",
    category:    "mission",
    description: `${user?.name} marked "${mission?.name ?? missionId}" as complete`,
    actorId:     user?.id ?? "",
    actorName:   user?.name ?? "",
    actorRole:   "personnel",
    targetName:  mission?.name ?? missionId,
    metadata:    { missionId },
  });
  };

  if (missionsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return(
   
     <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
         <Route path="/app/login" element={<LoginPage />}/>
     
         <Route
         path="/app/adminDashboard" 
         element={
            <ProtectedRoute requiredRole="admin">
               <PersonnelDeploymentPlanner />
            </ProtectedRoute>
         }
         />

         <Route
          path="/app/personnelDashboard"
          element={
            <ProtectedRoute requiredRole="personnel">
              <PersonnelDashboard
              missions={missions}
              onMarkComplete={handleMarkComplete}
              />
            </ProtectedRoute>
          }
        />
         <Route path="*" element={<Navigate to="/app/login" replace />} />
       </Routes>
     </BrowserRouter>
  )
 }

