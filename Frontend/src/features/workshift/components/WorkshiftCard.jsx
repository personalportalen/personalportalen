import './WorkshiftCard.css';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { deleteWorkshift } from '../api';
import { createBooking } from '../../booking/api';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkshiftCard = ({ workshift, onDelete }) => {
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

  const handleBook = async () => {
    try {
      await createBooking({ workshiftId: workshift.id });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`wc_container ${isOpen ? 'open' : ''}`}>
      <div className="wc_header" onClick={handleToggle}>
        <div className="wc_info-group">
          <p>{formatDate(workshift.starttime)}</p>
        </div>
        <div className="wc_info-group-flex">
          <p>{formatTime(workshift.starttime)}</p>
          <p>-</p>
          <p>{formatTime(workshift.endtime)}</p>
        </div>

        <div className="wc_info-group">
          <label>Område</label>
          <p>{workshift.area}</p>
        </div>

        <div className="wc_info-group">
          <label>Nivå</label>
          <p>{workshift.level}</p>
        </div>
        <div className="wc__chevron">
          <ChevronDown className={isOpen ? 'rotate' : ''} />
        </div>
      </div>

      {isOpen && (
        <div className="wc_details">
          <div className="wc_info-group">
            <label>{workshift.level}</label>
            <p>{workshift.employeeId || 'Ej tilldelad'}</p>
          </div>

          <div className="wc_button-container">
            {isAuthenticated && hasRole('Admin') && (
              <>
                <Link
                  to={`./edit/${workshift.id}`}
                  state={{ initialWorkshift: workshift }}
                  className="button button-prim"
                >
                  Ändra
                </Link>
                <button
                  onClick={() => onDelete(workshift.id)}
                  className="button button-alt"
                >
                  Radera
                </button>
              </>
            )}

            {isAuthenticated && !hasRole('Admin') && (
              <button onClick={handleBook} className="button button-prim">
                Boka
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshiftCard;
