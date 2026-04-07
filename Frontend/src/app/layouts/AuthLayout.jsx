import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;
