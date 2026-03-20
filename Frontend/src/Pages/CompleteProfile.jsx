import React, { useState } from "react";
import { updateProfile } from "../api/profile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const CompleteProfile = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    street: "",
    city: "",
    zipCode: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateProfile(form);

    navigate("/account");
  };

  return (
    <div className="complete-profile">
      <h1>Slutför din profil</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Förnamn"
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />

        <input
          placeholder="Efternamn"
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />

        <input
          placeholder="Email"
          value={userProfile.data.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Telefon"
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
        />

        <input
          placeholder="Gata"
          onChange={(e) => setForm({ ...form, street: e.target.value })}
        />

        <input
          placeholder="Stad"
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <input
          placeholder="Postnummer"
          onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
        />

        <button type="submit">Spara</button>
      </form>
    </div>
  );
};

export default CompleteProfile;
