import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { createWorkshift } from '../api';

const AddWorkshiftForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    area: '',
    level: '',
    startTime: '',
    endTime: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      await createWorkshift(form);

      navigate('/', { replace: true });
    } catch (err) {
      console.error('Workshift could not be added', err);
      setError(err?.response?.data?.message || err.message || 'Något gick fel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Skapa arbetspass</h1>
      <form onSubmit={handleSubmit} className="standard-form">
        <div className="standard-form_input-group">
          <label>Område</label>
          <input
            name="area"
            type="text"
            placeholder="Område"
            value={form.area}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="standard-form_input-group">
          <label>Nivå</label>
          <input
            name="level"
            type="text"
            placeholder="Nivå"
            value={form.level}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="standard-form_input-group-flex">
          <div>
            <label>Starttid</label>
            <input
              name="startTime"
              type="datetime-local"
              value={form.startTime}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="standard-form_input-group">
            <label>Sluttid</label>
            <input
              name="endTime"
              type="datetime-local"
              value={form.endTime}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button className="button button-prim" type="submit" disabled={loading}>
          {loading ? 'Sparar...' : 'Skapa pass'}
          {!loading && <ArrowRight className="complete_icon_arrow" />}
        </button>
      </form>
    </div>
  );
};

export default AddWorkshiftForm;
