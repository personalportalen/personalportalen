import { useEffect, useState } from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import SmallScreenPage from './SmallScreenPage';

function App() {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isSmallScreen) {
    return <SmallScreenPage />;
  }

  return <AppRoutes />;
}

export default App;
