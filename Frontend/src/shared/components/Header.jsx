import './Header.css';
import { CalendarCheck2, IdCardLanyard, User } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const Header = () => {
  const navigate = useNavigate();

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
          <div></div>
          <div className="header_midd-section">
            <Link to={'/'}>
              <IdCardLanyard className="header_icon" />
              Pass
            </Link>
            {isAdmin() ? (
              ''
            ) : (
              <Link to={'/bookings'}>
                <CalendarCheck2 className="header_icon" />
                Bokningar
              </Link>
            )}
            <Link to={'/konto'}>
              <User className="header_icon" />
              Mitt konto
            </Link>
          </div>
          <Link to={'/'} className="header__right-secion">
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
