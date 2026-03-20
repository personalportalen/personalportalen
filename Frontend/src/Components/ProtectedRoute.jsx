import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, userProfile } = useAuth();

  console.log("ProtectedRoute - isAuthenticated", isAuthenticated);
  console.log("userProfile.completionStatus", userProfile?.data);

  if (loading || (isAuthenticated && userProfile === null)) {
    return <p>Laddar...</p>;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (
    userProfile?.data.completionStatus == "Incomplete" &&
    location.pathname !== "/complete-profile"
  ) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
