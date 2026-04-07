import { useEffect, useState } from 'react';
import './WorkshiftDetailsPage.css';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import { deleteWorkshift, getWorkshift } from '../api';
import { createBooking } from '../../booking/api';
import CustomLoader from '../../../shared/components/CustomLoader';
import ErrorMessage from '../../../shared/components/ErrorMessage';

const WorkshiftDetailsPage = () => {
  const { isAuthenticated, hasRole } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [workshift, setWorkshift] = useState(
    location.state?.initialWorkshift || location.state?.workshift || null,
  );
  const [loading, setLoading] = useState(!workshift);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (workshift) return;

    async function fetchWorkshift() {
      try {
        setLoading(true);
        setError(null);

        const data = await getWorkshift(id);
        setWorkshift(data);
      } catch (err) {
        console.error(err);
        setError('Kunde inte hämta arbetspasset');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkshift();
  }, [id, workshift]);

  const handleClickDelete = async () => {
    try {
      await deleteWorkshift(workshift.id);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleClickBook = async () => {
    try {
      await createBooking({ workshiftId: workshift.id });
    } catch (err) {
      console.error('Booking failed', err);
    }
  };

  if (loading) return <CustomLoader />;
  if (error) return <ErrorMessage title={error} />;
  if (!workshift) return <ErrorMessage title={'Arbetspasset hittades inte'} />;

  const formatTime = (time) => time?.slice(11, 16).replace(':', '.');

  return (
    <div className="workshift-details__container">
      <h1>Arbetspass</h1>

      <div className="workshift-details__info">
        <p>
          <strong>Tid:</strong> {formatTime(workshift.starttime)} -{' '}
          {formatTime(workshift.endtime)}
        </p>

        <p>
          <strong>Område:</strong> {workshift.area}
        </p>

        <p>
          <strong>Nivå:</strong> {workshift.level}
        </p>

        <p>
          <strong>Anställd:</strong> {workshift.employeeId || 'Ej tilldelad'}
        </p>
      </div>

      <div className="wc_button-container">
        {isAuthenticated && hasRole('Admin') && (
          <>
            <Link to={`/edit/${workshift.id}`} className="button button-prim">
              Ändra
            </Link>

            <button onClick={handleClickDelete} className="button button-alt">
              Radera
            </button>
          </>
        )}

        {isAuthenticated && !hasRole('Admin') && (
          <button onClick={handleClickBook} className="button button-prim">
            Boka
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkshiftDetailsPage;
