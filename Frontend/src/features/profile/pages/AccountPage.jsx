import './AccountPage.css';
import ProfileUpdateForm from '../components/ProfileUpdateForm';

const AccountPage = () => {
  return (
    <div className="standard-form_page">
      <div>
        <h1>Mitt konto</h1>
        <ProfileUpdateForm />
      </div>
    </div>
  );
};

export default AccountPage;
