import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { createWorkshift } from "../api/workshift";

const AddWorkshift = ({}) => {
  const [payload, setPayload] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    console.log("user", user);

    e.preventDefault();
    console.log("submitting");
    const newPayload = { ...payload, ["AddedByUserId"]: user };
    setPayload(newPayload);

    await createWorkshift(newPayload);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setPayload((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="aw_container">
      <form onSubmit={handleSubmit}>
        <h1>Skapa arbetspass</h1>
        <div className="input-group">
          <label>Område</label>
          <input
            name="Area"
            type="text"
            placeholder="Område"
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>Nivå</label>
          <input
            name="Level"
            type="text"
            placeholder="Nivå"
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>Starttid</label>
          <input
            name="StartTime"
            type="date"
            placeholder="Starttid"
            onChange={handleChange}
          />
        </div>{" "}
        <div className="input-group">
          <label>Sluttid</label>
          <input
            name="EndTime"
            type="date"
            placeholder="Sluttid"
            onChange={handleChange}
          />
        </div>{" "}
        <button className="button button-alt" type="submit">
          Skapa pass
        </button>
      </form>
    </div>
  );
};

export default AddWorkshift;
