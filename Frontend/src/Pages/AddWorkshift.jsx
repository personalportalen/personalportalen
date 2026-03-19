import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddWorkshift = ({ shouldLoadAgain, setShouldLoadAgain }) => {
  const [payload, setPayload] = useState({});
  const navigate = useNavigate();

  //Denna är temporär:
  const [userId, setUserId] = useState("1");

  const createWorkshift = async (body) => {
    const res = await fetch("https://localhost:7103/api/workshift/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      console.log("res", res);
      setShouldLoadAgain(true);
      navigate("/");
    } else {
      console.error(res);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting");
    const newPayload = { ...payload, ["AddedByUserId"]: userId };
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
