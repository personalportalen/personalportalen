import { createContext, useEffect, useState } from "react";
import { signOut } from "../api/auth";
import { getCurrentUser } from "../api/profile";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setUser(user);
      setLoading(false);
    })();
  }, []);

  async function logout() {
    await signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={(user, setUser, logout, loading)}>
      {children}
    </AuthContext.Provider>
  );
}
