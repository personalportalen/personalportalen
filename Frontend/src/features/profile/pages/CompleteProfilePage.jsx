import './CompleteProfilePage.css';
import CompleteProfileForm from '../components/CompleteProfileForm';
import { useAuth } from '../../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CompleteProfilePage = () => {
  const { isReadyForGuards, isProfileComplete } = useAuth();
  const navigate = useNavigate();

  console.log('isReadyForGuards: ', isReadyForGuards);
  console.log('isProfileComplete: ', isProfileComplete);
  useEffect(() => {
    if (!isReadyForGuards) return;

    if (isProfileComplete) {
      navigate('/bookings', { replace: true });
    }
  }, [isReadyForGuards, isProfileComplete, navigate]);

  return (
    <div className="complete_page">
      <div className="complete-profile">
        <h1 className="first-header">Välkommen tillbaka</h1>
        <h1>Dags att slutföra din profil</h1>
        <CompleteProfileForm />
      </div>
    </div>
  );
};

export default CompleteProfilePage;
