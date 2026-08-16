import React from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import './MobileMenu.css';
import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose, setIsMenuOpen }) => {
  return (
    <>
      <header className="navigation__mobile">
        <button
          onClick={() => {
            setIsMenuOpen(!isOpen);
          }}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </header>
      <div
        className={`mobile-menu-backdrop ${
          isOpen ? 'mobile-menu-backdrop--visible' : ''
        }`}
        onClick={onClose}
      />
      <aside className={`mobile-menu ${isOpen ? 'mobile-menu--open' : ''}`}>
        <nav>
          <Link className="mobile-menu__link" to={'/'} onClick={onClose}>
            Lediga pass <ChevronRight className="chevron" />
          </Link>
          <Link
            className="mobile-menu__link"
            to={'/bookings'}
            onClick={onClose}
          >
            Schema <ChevronRight className="chevron" />
          </Link>
          <Link className="mobile-menu__link" to={'/konto'} onClick={onClose}>
            Mitt konto <ChevronRight className="chevron" />
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default MobileMenu;
