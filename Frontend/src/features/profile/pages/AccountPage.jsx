import { useAuth } from "../../../context/AuthProvider";

const AccountPage = () => {
  const { userProfile } = useAuth();
  const userData = userProfile?.data;

  console.log(userProfile);

  return (
    <div>
      <h1>Konto</h1>
      <p>Förnamn</p>
      <p>{userData?.firstName}</p>
      <p>Efternamn</p>
      <p>Email</p>
      <p>{userData?.email}</p>
      <p></p>
    </div>
  );
};

export default AccountPage;
