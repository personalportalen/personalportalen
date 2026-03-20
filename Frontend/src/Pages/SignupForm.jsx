import { useState } from "react";
import { Link } from "react-router-dom";
import { signUp } from "../api/auth";

const SignupForm = () => {
  const [user, setUser] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("user", user);

    try {
      const userData = await signUp(user);
      console.log("Signed in user:", userData);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Registrera</h1>
        <div className="login_input-group">
          <label>Email</label>
          <input
            onChange={handleChange}
            name="Email"
            type="email"
            placeholder="Email"
          />
        </div>
        <div className="login_input-group">
          <label>Password</label>
          <input
            onChange={handleChange}
            name="Password"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="login_input-group">
          <label>Confirm password</label>
          <input
            onChange={handleChange}
            name="ConfirmPassword"
            type="password"
            placeholder="Confirm password"
          />
        </div>
        <button type="submit">Registrera</button>
      </form>
      <p>Har du redan ett konto?</p>
      <Link to={"/login"}>Klicka här för att logga in</Link>
    </div>
  );
};

export default SignupForm;
