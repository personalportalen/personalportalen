import { useEffect, useState } from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import SmallScreenPage from './SmallScreenPage';
import ContactPopup from '../shared/components/ContactPopup';
import PopupProvider from '../shared/components/PopupProvider';

function App() {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };
    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /*   if (isSmallScreen) {
    return <SmallScreenPage />;
  } */

  return (
    <PopupProvider>
      <AppRoutes />
      <ContactPopup />
    </PopupProvider>
  );
}

export default App;
