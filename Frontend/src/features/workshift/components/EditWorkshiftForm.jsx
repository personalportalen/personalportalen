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
    starttime: '',
    endtime: '',
  });

  const [errors, setErrors] = useState({
    area: '',
    level: '',
    starttime: '',
    endtime: '',
  });

  const [touched, setTouched] = useState({
    area: false,
    level: false,
    starttime: false,
    endtime: false,
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

      case 'starttime':
        if (!value) return 'Starttid är obligatorisk';
        return '';

      case 'endtime':
        if (!value) return 'Sluttid är obligatorisk';
        if (
          allValues.starttime &&
          new Date(value) <= new Date(allValues.starttime)
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
      starttime: validateField('starttime', form.starttime, form),
      endtime: validateField('endtime', form.endtime, form),
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
          starttime: formatDateTimeLocal(
            workshift?.starttime || workshift?.starttime,
          ),
          endtime: formatDateTimeLocal(
            workshift?.endtime || workshift?.endtime,
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
          ...(name === 'starttime' || name === 'endtime'
            ? {
                endtime: validateField('endtime', updated.endtime, updated),
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
          ...(name === 'starttime' || name === 'endtime'
            ? {
                endtime: validateField('endtime', updated.endtime, updated),
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
        ...(name === 'starttime' || name === 'endtime'
          ? {
              endtime: validateField('endtime', updated.endtime, updated),
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
      starttime: true,
      endtime: true,
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

      await updateWorkshift(cleanedForm, id);

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
              value={form.starttime}
              name="starttime"
              type="datetime-local"
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={saving}
              required
              aria-invalid={!!errors.starttime}
              aria-describedby={
                errors.starttime ? 'start-time-error' : undefined
              }
            />
            {touched.starttime && errors.starttime && (
              <p id="start-time-error" className="input-error">
                {errors.starttime}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="end-time">Sluttid</label>
            <input
              id="end-time"
              value={form.endtime}
              name="endtime"
              type="datetime-local"
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={saving}
              required
              aria-invalid={!!errors.endtime}
              aria-describedby={errors.endtime ? 'end-time-error' : undefined}
            />
            {touched.endtime && errors.endtime && (
              <p id="end-time-error" className="input-error">
                {errors.endtime}
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
