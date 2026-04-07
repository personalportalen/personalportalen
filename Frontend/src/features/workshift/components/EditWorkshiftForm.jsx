import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWorkshift, updateWorkshift } from '../api';

const formatDateTimeLocal = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return '';

  const pad = (num) => String(num).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const EditWorkshiftForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    area: '',
    level: '',
    startTime: '',
    endTime: '',
  });

  const [errors, setErrors] = useState({
    area: '',
    level: '',
    startTime: '',
    endTime: '',
  });

  const [touched, setTouched] = useState({
    area: false,
    level: false,
    startTime: false,
    endTime: false,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const validateField = (name, value, allValues = form) => {
    switch (name) {
      case 'area':
        if (!value.trim()) return 'Område är obligatoriskt';
        if (value.trim().length < 2) return 'Område måste vara minst 2 tecken';
        return '';

      case 'level':
        if (!value.trim()) return '';
        if (value.trim().length < 2) return 'Nivå måste vara minst 2 tecken';
        return '';

      case 'startTime':
        if (!value) return 'Starttid är obligatorisk';
        return '';

      case 'endTime':
        if (!value) return 'Sluttid är obligatorisk';
        if (
          allValues.startTime &&
          new Date(value) <= new Date(allValues.startTime)
        ) {
          return 'Sluttid måste vara efter starttid';
        }
        return '';

      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {
      area: validateField('area', form.area, form),
      level: validateField('level', form.level, form),
      startTime: validateField('startTime', form.startTime, form),
      endTime: validateField('endTime', form.endTime, form),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== '');
  };

  useEffect(() => {
    const fetchWorkshift = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getWorkshift(id);

        const workshift = data?.data || data;

        setForm({
          area: workshift?.area || '',
          level: workshift?.level || '',
          startTime: formatDateTimeLocal(
            workshift?.startTime || workshift?.starttime,
          ),
          endTime: formatDateTimeLocal(
            workshift?.endTime || workshift?.endtime,
          ),
        });
      } catch (err) {
        console.error('Could not load workshift', err);
        setError(
          err?.response?.data?.message ||
            err.message ||
            'Kunde inte hämta arbetspasset',
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkshift();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (error) {
      setError('');
    }

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (touched[name]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateField(name, value, updated),
          ...(name === 'startTime' || name === 'endTime'
            ? {
                endTime: validateField('endTime', updated.endTime, updated),
              }
            : {}),
        }));
      }

      return updated;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (name === 'area' || name === 'level') {
      const trimmedValue = value.trim();

      setForm((prev) => {
        const updated = {
          ...prev,
          [name]: trimmedValue,
        };

        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateField(name, trimmedValue, updated),
          ...(name === 'startTime' || name === 'endTime'
            ? {
                endTime: validateField('endTime', updated.endTime, updated),
              }
            : {}),
        }));

        return updated;
      });
    } else {
      const updated = {
        ...form,
        [name]: value,
      };

      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, updated),
        ...(name === 'startTime' || name === 'endTime'
          ? {
              endTime: validateField('endTime', updated.endTime, updated),
            }
          : {}),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    setTouched({
      area: true,
      level: true,
      startTime: true,
      endTime: true,
    });

    const isValid = validateForm();

    if (!isValid) return;

    try {
      setSaving(true);

      const cleanedForm = {
        ...form,
        area: form.area.trim(),
        level: form.level.trim(),
      };

      await updateWorkshift(id, cleanedForm);

      navigate('/', { replace: true });
    } catch (err) {
      console.error('Workshift could not be updated', err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Kunde inte uppdatera arbetspasset',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Laddar arbetspass...</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="standard-form">
      <h1>Uppdatera arbetspass</h1>

      <div className="standard-form_input-group">
        <label htmlFor="area">Område</label>
        <input
          id="area"
          value={form.area}
          name="area"
          type="text"
          placeholder="Område"
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={saving}
          required
          maxLength={100}
          aria-invalid={!!errors.area}
          aria-describedby={errors.area ? 'area-error' : undefined}
        />
        {touched.area && errors.area && (
          <p id="area-error" className="input-error">
            {errors.area}
          </p>
        )}
      </div>

      <div className="standard-form_input-group">
        <label htmlFor="level">Nivå</label>
        <input
          id="level"
          value={form.level}
          name="level"
          type="text"
          placeholder="Nivå"
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={saving}
          maxLength={100}
          aria-invalid={!!errors.level}
          aria-describedby={errors.level ? 'level-error' : undefined}
        />
        {touched.level && errors.level && (
          <p id="level-error" className="input-error">
            {errors.level}
          </p>
        )}
      </div>

      <div className="standard-form_input-group-flex">
        <div>
          <div>
            <label htmlFor="start-time">Starttid</label>
            <input
              id="start-time"
              value={form.startTime}
              name="startTime"
              type="datetime-local"
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={saving}
              required
              aria-invalid={!!errors.startTime}
              aria-describedby={
                errors.startTime ? 'start-time-error' : undefined
              }
            />
            {touched.startTime && errors.startTime && (
              <p id="start-time-error" className="input-error">
                {errors.startTime}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="end-time">Sluttid</label>
            <input
              id="end-time"
              value={form.endTime}
              name="endTime"
              type="datetime-local"
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={saving}
              required
              aria-invalid={!!errors.endTime}
              aria-describedby={errors.endTime ? 'end-time-error' : undefined}
            />
            {touched.endTime && errors.endTime && (
              <p id="end-time-error" className="input-error">
                {errors.endTime}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" className="button button-prim" disabled={saving}>
        {saving ? 'Sparar...' : 'Spara ändringar'}
        {!saving && <ArrowRight className="complete_icon_arrow" />}
      </button>
    </form>
  );
};

export default EditWorkshiftForm;
