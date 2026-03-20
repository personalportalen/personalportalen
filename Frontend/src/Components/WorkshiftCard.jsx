import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { deleteWorkshift } from "../api/workshift";
import { createBooking } from "../api/bookings";

const WorkshiftCard = ({ workshift }) => {
  const { isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleClickDelete = async () => {
    deleteWorkshift();
  };

  const handleClickBook = async () => {
    const payload = {
      workshiftId: workshift.id,
    };
    console.log("payload", payload);

    await createBooking(payload);
  };

  return (
    <div className="wc_container">
      <div className="wc_info-group">
        <label htmlFor="">Id</label>
        <p>{workshift.id}</p>
      </div>
      <div className="wc_info-group">
        <label htmlFor="">Område</label>
        <p>{workshift.area}</p>
      </div>
      <div className="wc_info-group">
        <label htmlFor="">Nivå</label>
        <p>{workshift.level}</p>
      </div>
      <div className="wc_info-group">
        <label htmlFor="">Starttid</label>
        <p>{workshift.starttime}</p>
      </div>
      <div className="wc_info-group">
        <label htmlFor="">Sluttid</label>
        <p>{workshift.endtime}</p>
      </div>

      <div className="wc_info-group">
        <label htmlFor="">Arbetare</label>
        <p>{workshift.employeeId}</p>
      </div>
      <div className="wc_info-group">
        <label htmlFor="">Skapad av användare</label>
        <p>{workshift.addedByUserId}</p>
      </div>
      <div className="wc_info-group">
        <label htmlFor="">Skapad</label>
        <p>{workshift.addedTime}</p>
      </div>
      <div className="wc_button-container">
        {isAuthenticated && hasRole("Admin") && (
          <>
            <Link to={`/edit/${workshift.id}`} className="button button-prim">
              Ändra
            </Link>
            <Link onClick={handleClickDelete} className="button button-alt">
              Radera
            </Link>
          </>
        )}

        {isAuthenticated && !hasRole("Admin") && (
          <button onClick={handleClickBook} className="button button-alt">
            Boka
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkshiftCard;
