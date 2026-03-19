import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const WorkshiftCard = ({
  workshift,
  shouldLoadAgain,
  setShouldLoadAgain,
  authorityLevel,
}) => {
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(false);
  const [payload, setPayload] = useState();

  const deleteWorkshift = async () => {
    console.log("workshift.id", workshift.id);

    const res = await fetch("https://localhost:7103/api/workshift/delete", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workshift.id),
    });
    if (res.ok) {
      setShouldLoadAgain(true);
      navigate("/");
      console.log("deleted");
    }
  };

  const bookWorkshift = async () => {
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

    console.log("Payload", payload);

    const res = await fetch(`https://localhost:7213/api/booking/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenEdited}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      navigate("/");
    }
  };

  const checkAuhtorityLevel = async () => {
    if (authorityLevel == "Anställd") {
      setIsMember(true);
    }
  };

  const handleClickDelete = async () => {
    deleteWorkshift();
  };

  const handleClickBook = async () => {
    bookWorkshift();
  };

  useEffect(() => {
    checkAuhtorityLevel();
    setPayload({
      ["WorkshiftId"]: workshift.id,
      ["EmployeeId"]: workshift.id,
      ["BookingMadeById"]: workshift.id,
      ["LastUpdatedById"]: workshift.id,
    });
  }, []);

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
        {isMember ? (
          <Link onClick={handleClickBook} className="button button-alt">
            Boka
          </Link>
        ) : (
          <>
            <Link to={`/edit/:${workshift.id}`} className="button button-prim">
              Ändra
            </Link>
            <Link onClick={handleClickDelete} className="button button-alt">
              Radera
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkshiftCard;
