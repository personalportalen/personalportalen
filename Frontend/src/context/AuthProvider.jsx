import { createContext, useContext, useEffect, useState } from "react";
import { getMe, signIn, signOut } from "../api/auth";
import { getCurrentUserProfile } from "../api/profile";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const userData = await getMe();
      setUser(userData);
      try {
        console.log("Trying to get currentuser");
        const profileUserData = await getCurrentUserProfile();
        console.log("profileUserData", profileUserData);
        setUserProfile(profileUserData);
      } catch (err) {
        console.error(err);
        setUserProfile(null);
      }
    } catch (error) {
      setUser(null);
      setUserProfile(null);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    await signIn(email, password);
    await checkAuth();
  }

  async function logout() {
    await signOut();
    setUser(null);
  }

  function hasRole(role) {
    return user?.roles?.includes(role);
  }

  function isAdmin() {
    return hasRole("Admin");
  }

  const value = {
    user,
    userProfile,
    setUserProfile,
    roles: user?.roles || [],
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    refresh: checkAuth,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used insid AuthProvider");
  }
  return context;
}
