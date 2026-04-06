import './SignupPage.css';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import SignupForm from '../components/SignupForm';
import signupPhoto from '../../../assets/register.jpg';
import { ROUTES } from '../../../app/routes';

const SignupPage = () => {
  return (
    <div className="signup_page">
      <div className="signup_left-side">
        <SignupForm className="signup_form" />
        <div className="already-account_group">
          <p>Har du redan ett konto?</p>
          <Link to={ROUTES.LOGIN}>
            Logga in
            <ArrowRight className="login_icon_arrowright" />
          </Link>
        </div>
      </div>
      <img src={signupPhoto} />
    </div>
  );
};

export default SignupPage;
