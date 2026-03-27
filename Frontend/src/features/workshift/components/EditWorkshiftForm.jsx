import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateWorkshift, getWorkshift } from "../api";

const EditWorkshiftForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [workshift, setWorkshift] = useState();
  const [loading, setLoading] = useState(true);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setWorkshift((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateWorkshift(workshift, id);
    navigate("/");
  };

  useEffect(() => {
    async function getWorkshiftData() {
      const workshiftData = await getWorkshift(id);
      console.log("workshiftData", workshiftData);
      setWorkshift(workshiftData);
      setLoading(false);
    }
    getWorkshiftData();
  }, []);

  if (loading) {
    return;
  }
  return (
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
  );
};

export default EditWorkshiftForm;
