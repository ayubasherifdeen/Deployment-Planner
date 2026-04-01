// src/context/AuthContext.tsx
import { createContext, useContext, useState } from "react";
import { USERS } from "../data/users";
import type { AppUser } from "../data/models";


interface AuthContextType {
  user:    AppUser | null; // null = nobody is logged in
  login:   (email: string, password: string) => Promise<AppUser>;
  logout:  () => void;
  loading: boolean;       
}

// create the context.

const AuthContext = createContext<AuthContextType | null>(null);

// the Provider component.
export function AuthProvider({ children }: { children: React.ReactNode }) {
 const [user, setUser] = useState<AppUser | null>(() => {
  const stored = localStorage.getItem("auth_user");
  return stored ? JSON.parse(stored) : null;
});

const [loading, setLoading] = useState(false);



  //login function
 const login = async (email: string, password: string): Promise<AppUser> => {
  setLoading(true);
  try {
    const found = USERS.find(u => u.email === email);
    if (!found)                      throw new Error("No account found with that email");
    if (found.password !== password) throw new Error("Incorrect password");

    setUser(found);
    localStorage.setItem("auth_user", JSON.stringify(found));

    return found;
  } finally {
    setLoading(false);
  }
};

  //logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    // Provide the state and functions to every child component
     <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}