import './App.css'
import INITIAL_MISSIONS from './data/MissionData'
import type{ Mission } from './data/models'
import PersonnelDeploymentPlanner from './app/adminDashboard'
import LoginPage from './app/login'
import PersonnelDashboard from './app/personnelDashboard'
import { useAuth } from './context/AuthContext'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useState } from 'react'




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
  const [missions, setMissions] = useState<Mission[]>(() => {
    const stored = localStorage.getItem("missions");
    return stored ? JSON.parse(stored) : INITIAL_MISSIONS;
})
  const handleMarkComplete = (missionId: string) => {
    setMissions(prev => prev.map(m =>
      m.id === missionId ? { ...m, status: "completed" as const } : m
    ));
  };
  return(
   
     <BrowserRouter>
      <Routes>
         <Route path="/app/login" element={<LoginPage />}/>
     
         <Route
         path="/app/adminDashboard" 
         element={
            <ProtectedRoute requiredRole="admin">
               <PersonnelDeploymentPlanner
               missions={missions}
               setMissions={setMissions} />
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

