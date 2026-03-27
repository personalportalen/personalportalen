import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";

const ProfileCompletionGuard = ({ children }) => {
  const { loading, isAuthenticated, userProfile } = useAuth();
  const location = useLocation();

  if (loading) return <p>Laddar...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  console.log("userProfile:", userProfile);

  const completionStatus = userProfile?.data?.isProfileCompleted;

  const profileIncomplete = !userProfile || completionStatus === false;

  if (profileIncomplete && location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

export default ProfileCompletionGuard;
