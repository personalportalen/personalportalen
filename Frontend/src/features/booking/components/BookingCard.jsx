import React from "react";

const BookingCard = ({ booking }) => {
  return (
    <div className="wc_container">
      <div className="wc_info-group">
        <label>Id</label>
        <p>{booking.id}</p>
      </div>
      <div className="wc_info-group">
        <label>Created</label>
        <p>{booking.bookingCreated}</p>
      </div>
      <div className="wc_info-group">
        <label>Booking made by user id</label>
        <p>{booking.bookingMadeById}</p>
      </div>
      <div className="wc_info-group">
        <label>Employee Id</label>
        <p>{booking.employeeId}</p>
      </div>
      <div className="wc_info-group">
        <label>Last updated</label>
        <p>{booking.lastUpdated}</p>
      </div>
      <div className="wc_info-group">
        <label>Updated by user id</label>
        <p>{booking.lastUpdatedById}</p>
      </div>
      <div className="wc_info-group">
        <label>Workshift id</label>
        <p>{booking.workshiftId}</p>
      </div>
    </div>
  );
};

export default BookingCard;
