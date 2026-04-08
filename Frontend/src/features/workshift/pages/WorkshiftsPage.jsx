import React, { useEffect, useState } from 'react';
import './WorkshiftsPage.css';
import WorkshiftCard from '../components/WorkshiftCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import { deleteWorkshift, getWorkshifts } from '../api';

const WorkshiftsPage = () => {
  const [workshifts, setWorkshifts] = useState([]);
  const { hasAnyRole, isAdmin } = useAuth();

  const handleDeleteWorkshift = async (id) => {
    try {
      await deleteWorkshift(id);

      setWorkshifts((prev) => prev.filter((workshift) => workshift.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workshiftsData = await getWorkshifts();
        setWorkshifts(workshiftsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home_container">
      <div className="workshifts_page-header-container">
        <h1>{isAdmin() ? 'Upplagda pass' : 'Lediga pass'}</h1>
        {hasAnyRole(['Admin', 'Passledare']) && (
          <Link to={'/add'} className="home_add-workshift">
            <p>+</p>
          </Link>
        )}
      </div>
      <div className="home_content-container">
        {workshifts.map((workshift) => (
          <WorkshiftCard
            key={workshift.id}
            workshift={workshift}
            onDelete={handleDeleteWorkshift}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkshiftsPage;
