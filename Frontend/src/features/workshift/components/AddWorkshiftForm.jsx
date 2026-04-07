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
  const [loading, setLoading] = useState(false);

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
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, {
          ...form,
          [name]: value,
        }),
        ...(name === 'startTime' || name === 'endTime'
          ? {
              endTime: validateField(
                'endTime',
                name === 'endTime' ? value : form.endTime,
                {
                  ...form,
                  [name]: value,
                },
              ),
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
      setLoading(true);

      const cleanedForm = {
        ...form,
        area: form.area.trim(),
        level: form.level.trim(),
      };

      await createWorkshift(cleanedForm);

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

      <form onSubmit={handleSubmit} className="standard-form" noValidate>
        <div className="standard-form_input-group">
          <label htmlFor="area">Område</label>
          <input
            id="area"
            name="area"
            type="text"
            placeholder="Område"
            value={form.area}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
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
            name="level"
            type="text"
            placeholder="Nivå"
            value={form.level}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
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
          <div className="standard-form_input-group">
            <div>
              <label htmlFor="start-time">Starttid</label>
              <input
                id="start-time"
                name="startTime"
                type="datetime-local"
                value={form.startTime}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
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
                name="endTime"
                type="datetime-local"
                value={form.endTime}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
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

        <button className="button button-prim" type="submit" disabled={loading}>
          {loading ? 'Sparar...' : 'Skapa pass'}
          {!loading && <ArrowRight className="complete_icon_arrow" />}
        </button>
      </form>
    </div>
  );
};

export default AddWorkshiftForm;
