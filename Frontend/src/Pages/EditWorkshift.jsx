import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditWorkshift = ({ shouldLoadAgain, setShouldLoadAgain }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [workshift, setWorkshift] = useState({ area: "afsd", level: "asdf" });

  useEffect(() => {
    getWorkshift();
  }, []);

  const getWorkshift = async () => {
    const id = location.pathname.split("/");
    const idToSend = id[2];
    const idToSend2 = idToSend.split(":");
    const hoppla = idToSend2[1];
    console.log("hoppla", hoppla);
    const res = await fetch(`https://localhost:7103/api/workshift/${hoppla}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      setWorkshift(data);
    } else {
      console.error("Kunde inte hämta workshift");
    }
  };

  const editWorkshift = async () => {
    const res = await fetch("https://localhost:7103/api/workshift/update", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workshift),
    });
    if (res.ok) {
      setShouldLoadAgain(true);
      navigate("/");
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setWorkshift((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    editWorkshift();
  };

  return (
    <div className="ew_container">
      <form onSubmit={handleSubmit}>
        <h1>Uppdatera arbetspass</h1>
        <div className="ew_input-group">
          <label>area</label>
          <input
            value={workshift.area}
            name="area"
            type="text"
            placeholder="area"
            onChange={handleChange}
          />
        </div>
        <div className="ew_input-group">
          <label>level</label>
          <input
            value={workshift.level}
            name="level"
            type="text"
            placeholder="level"
            onChange={handleChange}
          />
        </div>
        <div className="ew_input-group">
          <label>starttime</label>
          <input
            value={workshift.starttime}
            name="starttime"
            type="text"
            placeholder="starttime"
            onChange={handleChange}
          />
        </div>
        <div className="ew_input-group">
          <label>endtime</label>
          <input
            value={workshift.endtime}
            name="endtime"
            type="text"
            placeholder="endtime"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="button button-alt">
          Spara ändringar
        </button>
      </form>
    </div>
  );
};

export default EditWorkshift;
