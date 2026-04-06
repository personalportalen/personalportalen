import './LoginForm.css';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import ErrorMessage from '../../../shared/components/ErrorMessage';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const from = location.state?.from?.pathname || '/';

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Mejladress är obligatorisk';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Ogiltig mejladress';
        }
        return '';

      case 'password':
        if (!value) return 'Lösenord är obligatoriskt';
        return '';

      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: validateField('email', credentials.email),
      password: validateField('password', credentials.password),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (error) {
      setError('');
    }

    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (name === 'email') {
      const trimmedValue = value.trim();

      setCredentials((prev) => ({
        ...prev,
        [name]: trimmedValue,
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, trimmedValue),
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    setTouched({
      email: true,
      password: true,
    });

    const isValid = validateForm();

    if (!isValid) return;

    try {
      setLoading(true);

      const cleanedCredentials = {
        email: credentials.email.trim(),
        password: credentials.password,
      };

      await login(cleanedCredentials.email, cleanedCredentials.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || 'Inloggningen misslyckades. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="login_first-header">Logga in på</h1>
      <h1>Personalportalen</h1>

      <div className="login_input-group">
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

      <div className="login_input-group">
        <label htmlFor="password">Lösenord</label>
        <input
          id="password"
          type="password"
          name="password"
          autoComplete="current-password"
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

      {error && <ErrorMessage message={error} />}

      <button className="button button-prim" type="submit" disabled={loading}>
        {loading ? 'Loggar in...' : 'Logga in'}
        {!loading && <ArrowRight className="login_icon_arrowright" />}
      </button>
    </form>
  );
};

export default LoginForm;
