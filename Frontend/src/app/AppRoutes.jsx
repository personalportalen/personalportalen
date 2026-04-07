import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';
import { Suspense } from 'react';
import { env } from '../shared/config/env';
import AddWorkshiftPage from '../features/workshift/pages/AddWorkshiftPage';
import EditWorkshiftPage from '../features/workshift/pages/EditWorkshiftPage';
import WorkshiftsPage from '../features/workshift/pages/WorkshiftsPage';
import BookingsPage from '../features/booking/pages/BookingsPage';
import CompleteProfilePage from '../features/profile/pages/CompleteProfilePage';
import SignupPage from '../features/auth/pages/SignupPage';
import LoginPage from '../features/auth/pages/LoginPage';
import AccountPage from '../features/profile/pages/AccountPage';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import DesignSandbox from '../../DesignSandbox';
import NotFoundPage from '../shared/pages/NotFoundPage';
import CustomLoader from '../shared/components/CustomLoader';
import ProfileCompletionGuard from '../features/profile/components/ProfileCompletionGuard';
import WorkshiftDetailsPage from '../features/workshift/pages/WorkshiftDetailsPage';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

const AppRoutes = () => {
  return (
    <Suspense fallback={<CustomLoader />}>
      <Routes>
        {/* DesignSandbox */}
        {env.enableDevAuthBypass && (
          <Route path="/dev/design" element={<DesignSandbox />} />
        )}

        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path={ROUTES.COMPLETE_PROFILE}
            element={<CompleteProfilePage />}
          />

          <Route element={<ProfileCompletionGuard />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.HOME} element={<WorkshiftsPage />} />
              <Route
                path={ROUTES.ADD_WORKSHIFT}
                element={<AddWorkshiftPage />}
              />
              <Route
                path={ROUTES.DETAILS_WORKSHIFT}
                element={<WorkshiftDetailsPage />}
              />
              <Route
                path={ROUTES.EDIT_WORKSHIFT}
                element={<EditWorkshiftPage />}
              />
              <Route path={ROUTES.BOOKINGS} element={<BookingsPage />} />
              <Route path={ROUTES.ACCOUNT} element={<AccountPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
