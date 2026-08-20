import { useEffect, useState } from 'react';
import './WorkshiftsPage.css';
import WorkshiftCard from '../components/WorkshiftCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import { deleteWorkshift, getWorkshifts, getUnbookedWorkshifts } from '../api';
import { getAll } from '../../booking/api';
import { getProfiles } from '../../profile/api';

const WorkshiftsPage = () => {
  const [workshifts, setWorkshifts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const { hasAnyRole, isAdmin } = useAuth();

  const handleDeleteWorkshift = async (id) => {
    try {
      await deleteWorkshift(id);

      setWorkshifts((prev) => prev.filter((workshift) => workshift.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const fetchWorkshifts = async () => {
    try {
      if (isAdmin()) {
        const workshiftsData = await getWorkshifts();
        setWorkshifts(workshiftsData);
      } else {
        const workshiftsData = await getUnbookedWorkshifts();
        setWorkshifts(workshiftsData);
        console.log('workshiftsData', workshiftsData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const bookingsData = await getAll();
      setBookings(bookingsData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const profilesData = await getProfiles();
      /*       console.log('profilesData length:', profilesData.length);
      console.log('profilesData:', profilesData); */
      setProfiles(profilesData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkshifts();
    fetchBookings();
    fetchProfiles();
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
        {workshifts.map((workshift) => {
          const booking = bookings.find(
            (booking) => booking.workshiftId === workshift.id,
          );

          const profile = profiles.find(
            (profile) => profile.userId === booking?.employeeId,
          );

          /*           console.log('booking employeeId:', booking?.employeeId);
          console.log(
            'profile userIds:',
            profiles.map((p) => p.userId),
          ); */
          return (
            <WorkshiftCard
              key={workshift.id}
              workshift={workshift}
              booking={booking}
              profile={profile}
              onDelete={handleDeleteWorkshift}
              onBookingComplete={fetchWorkshifts}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WorkshiftsPage;
