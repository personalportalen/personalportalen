import './SignupForm.css';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../api';
import { useAuth } from '../../../context/AuthProvider';

const SignupForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const validateField = (name, value, allValues = credentials) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Mejladress är obligatorisk';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Ogiltig mejladress';
        }
        return '';

      case 'password':
        if (!value) return 'Lösenord är obligatoriskt';
        if (value.length < 8) return 'Lösenord måste vara minst 8 tecken';
        return '';

      case 'confirmPassword':
        if (!value) return 'Bekräfta ditt lösenord';
        if (value !== allValues.password) return 'Lösenorden matchar inte';
        return '';

      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: validateField('email', credentials.email, credentials),
      password: validateField('password', credentials.password, credentials),
      confirmPassword: validateField(
        'confirmPassword',
        credentials.confirmPassword,
        credentials,
      ),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (error) {
      setError('');
    }

    setCredentials((prevState) => {
      const updated = { ...prevState, [name]: value };

      if (touched[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: validateField(name, value, updated),
          ...(name === 'password' || name === 'confirmPassword'
            ? {
                confirmPassword: validateField(
                  'confirmPassword',
                  updated.confirmPassword,
                  updated,
                ),
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

    if (name === 'email') {
      const trimmedValue = value.trim();

      setCredentials((prev) => {
        const updated = { ...prev, [name]: trimmedValue };

        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateField(name, trimmedValue, updated),
        }));

        return updated;
      });
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, credentials),
        ...(name === 'password' || name === 'confirmPassword'
          ? {
              confirmPassword: validateField(
                'confirmPassword',
                name === 'confirmPassword'
                  ? value
                  : credentials.confirmPassword,
                {
                  ...credentials,
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
      email: true,
      password: true,
      confirmPassword: true,
    });

    const isValid = validateForm();

    if (!isValid) return;

    try {
      console.log("form:", form);
      setLoading(true);

      const cleanedCredentials = {
        email: credentials.email.trim(),
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
      };

      await signUp(cleanedCredentials);
      await login(cleanedCredentials.email, cleanedCredentials.password);

      navigate('/bookings', { replace: true });
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err?.response?.data?.message || err.message || 'Något gick fel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="login_first-header">Välkommen</h1>
      <h1>Registrera ett nytt konto</h1>

      <div className="signup_input-group">
        <label htmlFor="email">Mejladress</label>
        <input
          id="email"
          type="email"
          inputMode="email"
          name="email"
          autoComplete="email"
          placeholder="Ange din mejladress"
          disabled={loading}
          value={credentials.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {touched.email && errors.email && (
          <p id="email-error" className="input-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="signup_input-group">
        <label htmlFor="password">Lösenord</label>
        <input
          id="password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Ange ditt lösenord"
          disabled={loading}
          value={credentials.password}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {touched.password && errors.password && (
          <p id="password-error" className="input-error">
            {errors.password}
          </p>
        )}
      </div>

      <div className="signup_input-group">
        <label htmlFor="confirm-password">Bekräfta lösenord</label>
        <input
          id="confirm-password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Bekräfta ditt lösenord"
          disabled={loading}
          value={credentials.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={
            errors.confirmPassword ? 'confirm-password-error' : undefined
          }
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <p id="confirm-password-error" className="input-error">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={loading} className="button button-prim">
        {loading ? 'Skapar konto...' : 'Skapa konto'}
        {!loading && <ArrowRight className="login_icon_arrowright" />}
      </button>
    </form>
  );
};

export default SignupForm;
