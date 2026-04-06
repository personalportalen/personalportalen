import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, signIn, signOut } from '../features/auth/api';
import { getCurrentUserProfile } from '../features/profile/api';
import { env } from '../shared/config/env';

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
      if (env.enableDevAuthBypass) {
        const demoUser = {
          id: 1,
          email: 'demo@example.com',
          roles: ['Admin'],
        };

        const demoProfile = {
          email: 'demo@example.com',
          firstName: 'Rasmus',
          lastName: 'Waleij',
          phoneNumber: '0763941212',
          address: {
            id: 10,
            street: 'Kvarntorget 11',
            city: 'Uppsala',
            state: 'test',
            zipCode: '75421',
            country: 'test',
          },

          isComplete: true,
        };

        setUser(demoUser);
        setUserProfile(demoProfile);
        return;
      }

      const userData = await getMe();
      setUser(userData);

      try {
        const profileUserData = await getCurrentUserProfile();
        setUserProfile(profileUserData);
      } catch (err) {
        console.error(err);
        setUserProfile(null);
      }
    } catch (error) {
      setUser(null);
      setUserProfile(null);

      if (error?.status !== 401) {
        console.error('Auth check failed', error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    await signIn(email, password);
    return await checkAuth();
  }

  async function logout() {
    try {
      await signOut();
    } finally {
      setUser(null);
      setUserProfile(null);
    }
  }

  function hasRole(role) {
    return user?.roles?.includes(role);
  }

  function hasAnyRole(roles = []) {
    return roles.some((role) => user?.roles?.includes(role));
  }

  function isAdmin() {
    return hasRole('Admin');
  }

  const isAuthenticated = !!user;
  const hasProfile = !!userProfile;
  const isProfileComplete = !!userProfile?.isComplete;

  const value = {
    user,
    userProfile,
    setUserProfile,
    roles: user?.roles || [],
    isAuthenticated,
    hasProfile,
    isProfileComplete,
    loading,
    login,
    logout,
    refresh: checkAuth,
    hasRole,
    hasAnyRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used insid AuthProvider');
  }
  return context;
}
