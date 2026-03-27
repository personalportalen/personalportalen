import { Link } from "react-router-dom";
import SignupForm from "../components/SignupForm";

const SignupPage = () => {
  return (
    <div>
      <SignupForm />
      <p>Har du redan ett konto?</p>
      <Link to="/login">Klicka här för att logga in</Link>
    </div>
  );
};

export default SignupPage;
