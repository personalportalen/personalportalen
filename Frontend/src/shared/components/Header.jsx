import './Header.css';
import { CalendarCheck2, IdCardLanyard, User, Menu } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useState } from 'react';
import MobileMenu from './MobileMenu';
import { ROUTES } from '../../app/routes';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, isAuthenticated, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <>
      {isAuthenticated && (
        <div className="header_container">
          <MobileMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            setIsMenuOpen={setIsMenuOpen}
          />
          <div className="header_midd-section">
            <Link to={ROUTES.HOME}>
              <IdCardLanyard className="header_icon" />
              {isAdmin ? 'Upplagda pass' : 'Lediga pass'}
            </Link>
            {isAdmin() ? (
              ''
            ) : (
              <Link to={ROUTES.BOOKINGS}>
                <CalendarCheck2 className="header_icon" />
                Schema
              </Link>
            )}
            <Link to={ROUTES.ACCOUNT}>
              <User className="header_icon" />
              {isAdmin ? 'Admin-kontot' : 'Mitt konto'}
            </Link>
          </div>
          <Link to={ROUTES.HOME} className="header__right-secion">
            <button className="button" onClick={handleLogout}>
              Logga ut
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Header;
