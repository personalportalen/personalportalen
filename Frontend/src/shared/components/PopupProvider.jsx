import { useEffect, useState } from 'react';
import PopupContext from './PopupContext';

const POPUP_DELAY = 10_000;

const PopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, POPUP_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <PopupContext.Provider value={{ isOpen, closePopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export default PopupProvider;
