import "./CompleteProfilePage.css"
import CompleteProfileForm from "../components/CompleteProfileForm";

const CompleteProfilePage = () => {
  return (
    <div className="complete_page" >
      <div className="complete-profile">
        <h1 className="first-header">Välkommen tillbaka</h1>
        <h1>Dags att slutföra din profil</h1>
        <CompleteProfileForm />
      </div>
    </div>
  );
};

export default CompleteProfilePage;
