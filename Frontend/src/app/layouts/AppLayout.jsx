import { Outlet } from 'react-router-dom';
import Header from '../../shared/components/Header';

const AppLayout = () => {
  return (
    <>
      <Header />
      <main className="app-main">
        <div className="app-container">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AppLayout;
