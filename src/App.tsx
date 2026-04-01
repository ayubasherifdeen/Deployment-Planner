import './App.css'
import PersonnelDeploymentPlanner from './app/adminDashboard'
import LoginPage from './app/login'
import PersonnelDashboard from './app/personnelDashboard'
import { useAuth } from './context/AuthContext'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'




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
  return(
   
     <BrowserRouter>
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
              <PersonnelDashboard />
            </ProtectedRoute>
          }
        />
         <Route path="*" element={<Navigate to="/app/login" replace />} />
       </Routes>
     </BrowserRouter>
  )
 }

