import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, signIn, signOut } from '../features/auth/api';
import { getCurrentUserProfile } from '../features/profile/api';
import { env } from '../shared/config/env';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileRefreshing, setProfileRefreshing] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {
    setAuthLoading(true);
    setProfileLoading(true);

    try {
      if (env.enableDevAuthBypass) {
        const demoUser = {
          id: 1,
          email: 'demo@example.com',
          roles: ['Admin'],
        };

        const demoProfile = {
          succeeded: true,
          message: 'Success',
          statusCode: 200,
          data: {
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
            isProfileCompleted: true,
          },
        };

        setUser(demoUser);
        setUserProfile(demoProfile);
        return;
      }

      const userData = await getMe();
      setUser(userData);

      try {
        const profileData = await getCurrentUserProfile();
        setUserProfile(profileData);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setUserProfile(null);
      }
    } catch (error) {
      setUser(null);
      setUserProfile(null);

      if (error?.status !== 401) {
        console.error('Auth check failed', error);
      }
    } finally {
      setAuthLoading(false);
      setProfileLoading(false);
    }
  }

  async function refreshProfile() {
    setProfileRefreshing(true);

    try {
      const profileData = await getCurrentUserProfile();
      setUserProfile(profileData);
      return profileData;
    } catch (err) {
      console.error('Failed to refresh profile', err);
      setUserProfile(null);
      throw err;
    } finally {
      setProfileRefreshing(false);
    }
  }

  async function refreshAuth() {
    await initializeAuth();
  }

  async function login(email, password) {
    await signIn(email, password);
    await initializeAuth();
  }

  async function logout() {
    try {
      await signOut();
    } finally {
      setUser(null);
      setUserProfile(null);
      setAuthLoading(false);
      setProfileLoading(false);
      setProfileRefreshing(false);
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
  const isProfileComplete = userProfile?.data?.isProfileCompleted === true;

  // Viktigt för guards:
  const isReadyForGuards =
    !authLoading && !profileLoading && !profileRefreshing;

  const value = useMemo(
    () => ({
      user,
      userProfile,
      setUserProfile,

      roles: user?.roles || [],

      authLoading,
      profileLoading,
      profileRefreshing,
      loading: authLoading || profileLoading || profileRefreshing,

      isAuthenticated,
      hasProfile,
      isProfileComplete,
      isReadyForGuards,

      login,
      logout,
      refreshAuth,
      refreshProfile,

      hasRole,
      hasAnyRole,
      isAdmin,
    }),
    [
      user,
      userProfile,
      authLoading,
      profileLoading,
      profileRefreshing,
      isAuthenticated,
      hasProfile,
      isProfileComplete,
      isReadyForGuards,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
