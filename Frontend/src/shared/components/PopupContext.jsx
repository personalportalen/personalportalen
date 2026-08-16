import { createContext, useContext } from 'react';

const PopupContext = createContext(null);

export const usePopup = () => {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error('usePopup must be used within PopupProvider');
  }

  return context;
};

export default PopupContext;
