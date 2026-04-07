import { Navigate, Outlet, useLocation } from 'react-router-dom';
import CustomLoader from '../../../shared/components/CustomLoader';
import { ROUTES } from '../../../app/routes';
import { useAuth } from '../../../context/AuthProvider';

const ProfileCompletionGuard = () => {
  const { userProfile, isProfileComplete, isReadyForGuards } = useAuth();

  const location = useLocation();

  if (!isReadyForGuards) {
    return <CustomLoader text="Kontrollerar profil..." />;
  }

  if (!userProfile) {
    return <CustomLoader text="Hämtar profil..." />;
  }

  if (!isProfileComplete) {
    return (
      <Navigate
        to={ROUTES.COMPLETE_PROFILE}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default ProfileCompletionGuard;
