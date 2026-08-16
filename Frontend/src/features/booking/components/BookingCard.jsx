import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './BookingCard.css';

const BookingCard = ({ booking }) => {
  const [isOpen, setIsOpen] = useState(false);

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
    <div className={`bc_container ${isOpen ? 'open' : ''}`}>
      <div className="bc_header" onClick={handleToggle}>
        <div className="bc_info-group">
          <p>{formatDate(booking.workshift.starttime)}</p>
        </div>
        <div className="bc_info-group">
          <label>Bokad</label>

          <p>{formatTime(booking.bookingCreated)}</p>
        </div>

        <div className="bc_info-group">
          <label>Område</label>
          <p>{booking.workshift.area}</p>
        </div>

        <div className="bc_info-group bc_level-header">
          <label>Nivå</label>
          <p>{booking.workshift.level}</p>
        </div>
        <div className="bc__chevron">
          <ChevronDown className={isOpen ? 'rotate' : ''} />
        </div>
      </div>

      {isOpen && (
        <div className="bc_details">
          <div className="bc_info-group bc_level-details">
            <label>Nivå</label>
            <p>{booking.workshift.level}</p>
          </div>
          <div className="bc_info-group">
            <label>{booking.workshift.level}</label>
            <p>{booking.workshift.employeeId || 'Ej tilldelad'}</p>
          </div>
          <div className="bc_info-group">
            <label>Bokad</label>
            <p>{formatDate(booking.bookingCreated)}</p>
          </div>

          <div className="bc_info-group">
            <label>Boknings-ID</label>
            <p>{booking.id}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
