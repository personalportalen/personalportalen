import ProtectedRoute from "../Components/ProtectedRoute";
import ProfileCompletionGuard from "../../features/profile/components/ProfileCompletionGuard";

const ProtectedProfileRoute = ({ children }) => {
  return (
    <ProtectedRoute>
      <ProfileCompletionGuard>{children}</ProfileCompletionGuard>
    </ProtectedRoute>
  );
};

export default ProtectedProfileRoute;
