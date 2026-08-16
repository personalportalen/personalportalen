import './LoginPage.css';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import loginPhoto from '../../../assets/login_photo_web.webp';
import Banner from '../../../shared/components/Banner';

const LoginPage = () => {
  return (
    <div className="login_page">
      <div className="login_left-side">
        <Banner />
        <LoginForm />
        <div className="no-account_group">
          <p>Har du inget konto än?</p>
          <Link to={'/signup'}>
            Registrera konto
            <ArrowRight className="login_icon_arrowright" />
          </Link>
        </div>
      </div>
      <img src={loginPhoto} />
    </div>
  );
};

export default LoginPage;
