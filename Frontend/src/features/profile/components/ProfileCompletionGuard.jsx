import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../../../shared/components/Loader';
import { ROUTES } from '../../../app/routes';
import { useAuth } from '../../../context/AuthProvider';

const ProfileCompletionGuard = () => {
  const { isProfileComplete, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    if (loading) return <Loader text="Kontrollerar inloggning..." />;
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
