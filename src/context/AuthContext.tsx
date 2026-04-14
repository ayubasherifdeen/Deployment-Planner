// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { AppUser } from "../data/models";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";





interface AuthContextType {
  user:    AppUser | null; // null = nobody is logged in
  login:   (email: string, password: string) => Promise<AppUser>;
  logout:  () =>Promise<void>;
  loading: boolean;       
}


// create the context.
const AuthContext = createContext<AuthContextType | null>(null);

// the Provider component.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser({
            id:          firebaseUser.uid,
            email:       firebaseUser.email ?? "",
            name:        data.name,
            role:        data.role,
            personnelId: data.personnelId,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);


  //login function, route to page based on role
 const login = async (email: string, password: string): Promise<AppUser> => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const userDoc = await getDoc(doc(db, "users", result.user.uid))
    if(!userDoc.exists()) throw new Error("User does not exist")
    
    const data = userDoc.data();
    //check if disabled and carry out neccessary action
    if(data.disabled == true){
      await signOut(auth)
      throw new Error("Your account has been deactivated. Contact your administrator.")
    }
    
    const appUser: AppUser = {
      id:          result.user.uid,
      email:       result.user.email ?? "",
      name:        data.name,
      role:        data.role,
      personnelId: data.personnelId
    
  };
  setUser(appUser);
  return appUser

};

  //logout function
  const logout = async () => {
    await signOut(auth);
    setUser(null)
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