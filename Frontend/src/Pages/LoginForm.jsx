import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../api/auth";

const LoginForm = ({
  isLoggedIn,
  setIsLoggedIn,
  authorityLevel,
  setAuthorityLevel,
  setUserProfile,
}) => {
  /*   const getToken = async () => {
    const token = await cookieStore.get("token");
    const value = token.value;
    const decoded = jwtDecode(value);
    const longName =
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    setAuthorityLevel(decoded[longName]);
  }; */

  const [user, setUser] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("user", user);
    try {
      const userData = await signIn(user.email, user.password);
      console.log("Signed in user:", userData);
      console.log("Omdirigerar");
      setUserProfile(true);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Logga in</h1>
        <div className="login_input-group">
          <label>Email</label>
          <input
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="Email"
          />
        </div>
        <div className="login_input-group">
          <label>Password</label>
          <input
            onChange={handleChange}
            name="password"
            type="password"
            placeholder="Password"
          />
        </div>
        <button className="button button-alt" type="submit">
          Logga in
        </button>
      </form>
      <p>Har du inget konto?</p>
      <Link to={"/signup"}>Klicka här för att registrera dig</Link>
    </div>
  );
};

export default LoginForm;
