import React, { useEffect, useState } from "react";
import { getCurrentUserProfile } from "../api/profile";

const Account = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getCurrentUserProfile();
      setUser(userData);
      console.log("user", user);
    };

    fetchData();
  }, []);

  if (!user) {
    return <p>Laddar...</p>;
  }
  return (
    <div>
      <h1>Konto</h1>
      <p>{user.email}</p>
    </div>
  );
};

export default Account;
