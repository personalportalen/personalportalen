import { Routes, Route } from "react-router-dom";
import AddWorkshiftPage from "../features/workshift/pages/AddWorkshiftPage";
import EditWorkshiftPage from "../features/workshift/pages/EditWorkshiftPage";
import WorkshiftsPage from "../features/workshift/pages/WorkshiftsPage";
import BookingsPage from "../features/booking/pages/BookingsPage";
import CompleteProfilePage from "../features/profile/pages/CompleteProfilePage";
import SignupPage from "../features/auth/pages/SignupPage";
import LoginPage from "../features/auth/pages/LoginPage";
import AccountPage from "../features/profile/pages/AccountPage";
import ProtectedProfileRoute from "../shared/components/ProtectedProfileRoute";
import ProtectedRoute from "../shared/Components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<WorkshiftsPage />} />

      <Route
        path="/add"
        element={
          <ProtectedProfileRoute>
            <AddWorkshiftPage />
          </ProtectedProfileRoute>
        }
      />

      <Route
        path="/edit/:id"
        element={
          <ProtectedProfileRoute>
            <EditWorkshiftPage />
          </ProtectedProfileRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <ProtectedProfileRoute>
            <BookingsPage />
          </ProtectedProfileRoute>
        }
      />

      <Route
        path="/konto"
        element={
          <ProtectedProfileRoute>
            <AccountPage />
          </ProtectedProfileRoute>
        }
      />

      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
