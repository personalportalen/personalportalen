import React, { useEffect, useState } from "react";
import BookingCard from "../Components/BookingCard";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [id, setId] = useState("f529ea14-7db4-4c81-a216-e37f655dcdf5");
  const navigate = useNavigate();

  useEffect(() => {
    const getBookings = async () => {
      const token = document.cookie;
      if (token == "") {
        console.log("asdf");
        navigate("/login");
        return;
      }
      const tokenEdited = token
        .split("; ")
        .find((row) => row.startsWith("token="))
        .split("=")[1];

      console.log("token", tokenEdited);

      const res = await fetch(
        `https://localhost:7213/api/booking/getallbyuserid`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenEdited}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
        console.log("dataBookings", data);
      } else {
        console.error("Could not fetch");
      }
    };

    getBookings();
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

export default Bookings;
