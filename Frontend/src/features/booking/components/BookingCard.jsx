import React from 'react';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookingCard = ({ booking }) => {
  console.log('booking;: ', booking);

  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, hasRole } = useAuth();

  const formatTime = (time) => time?.slice(11, 16).replace(':', '.');
  const formatDate = (date) => {
    if (!date) return '';

    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className={`wc_container ${isOpen ? 'open' : ''}`}>
      <div className="wc_header" onClick={handleToggle}>
        <div className="wc_info-group">
          <p>{formatDate(booking.workshift.starttime)}</p>
        </div>
        <div className="wc_info-group">
          <label>Bokad</label>

          <p>{formatTime(booking.bookingCreated)}</p>
        </div>

        <div className="wc_info-group">
          <label>Område</label>
          <p>{booking.workshift.area}</p>
        </div>

        <div className="wc_info-group">
          <label>Nivå</label>
          <p>{booking.workshift.level}</p>
        </div>
        <div className="wc__chevron">
          <ChevronDown className={isOpen ? 'rotate' : ''} />
        </div>
      </div>

      {isOpen && (
        <div className="wc_details">
          <div className="wc_info-group">
            <label>{booking.workshift.level}</label>
            <p>{booking.workshift.employeeId || 'Ej tilldelad'}</p>
          </div>
          <div className="wc_info-group">
            <label>Bokad</label>
            <p>{formatDate(booking.bookingCreated)}</p>
          </div>

          <div className="wc_info-group">
            <label>Boknings-ID</label>
            <p>{booking.id}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
