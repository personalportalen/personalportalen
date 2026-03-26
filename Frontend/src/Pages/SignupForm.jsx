import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, signUpAndSignIn } from "../api/auth";

const SignupForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      return setError("Lösenorden matchar inte");
    }

    try {
      setLoading(true);

      await signUpAndSignIn(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "Något gick fel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Registrera</h1>

        <div className="login_input-group">
          <label>Email</label>
          <input
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            type="email"
            placeholder="Email"
          />
        </div>

        <div className="login_input-group">
          <label>Password</label>
          <input
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            type="password"
            placeholder="Password"
          />
        </div>

        <div className="login_input-group">
          <label>Confirm password</label>
          <input
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            type="password"
            placeholder="Confirm password"
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registrerar..." : "Registrera"}
        </button>
      </form>

      <p>Har du redan ett konto?</p>
      <Link to="/login">Klicka här för att logga in</Link>
    </div>
  );
};

export default SignupForm;
