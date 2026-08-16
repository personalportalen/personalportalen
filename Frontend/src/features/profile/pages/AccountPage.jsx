import './AccountPage.css';
import ProfileUpdateForm from '../components/ProfileUpdateForm';
import { useAuth } from '../../../context/AuthProvider';

const AccountPage = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="standard-form_page">
      <div className="update-profile">
        <h1>{isAdmin ? 'Admin-kontot' : 'Mitt konto'}</h1>
        <ProfileUpdateForm />
      </div>
    </div>
  );
};

export default AccountPage;
