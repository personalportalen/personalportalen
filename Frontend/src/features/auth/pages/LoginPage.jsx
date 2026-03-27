import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="login_page">
      <div className="login_container">
        <LoginForm />
        <div className="no-account_group">
          <p>Har du inget konto?</p>
          <Link to={"/signup"}>Klicka här för att registrera dig</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
