import { useEffect, useState } from 'react';
import BookingCard from '../components/BookingCard';
import './BookingsPage.css';
import { getBookingsByUserId } from '../api';
import { getWorkshift } from '../../workshift/api';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const bookingsData = await getBookingsByUserId();

        const bookingsWithWorkshifts = await Promise.all(
          bookingsData.map(async (booking) => {
            try {
              const workshift = await getWorkshift(booking.workshiftId);

              return {
                ...booking,
                workshift,
              };
            } catch (err) {
              console.error(
                `Kunde inte hämta workshift ${booking.workshiftId}`,
                err,
              );

              return {
                ...booking,
                workshift: null,
              };
            }
          }),
        );

        setBookings(bookingsWithWorkshifts);
      } catch (error) {
        console.error(error);
        setError('Kunde inte hämta bokningar');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Laddar bokningar...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bookings_container">
      <h1>Mina bokningar</h1>

      <div className="bookings_map_conatiner">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;
