import React, { useEffect, useState } from "react";
import BookingCard from "../components/BookingCard";
import { useNavigate } from "react-router-dom";
import { getBookingsByUserId } from "../api";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsData = await getBookingsByUserId();
        setBookings(bookingsData);
      } catch (error) {
        console.error(error);
      }
    };
    console.log("bookings", bookings);
    fetchData();
  }, []);

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
