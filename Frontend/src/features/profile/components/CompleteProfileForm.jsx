import React, { useState } from "react";
import { completeProfile } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";

const CompleteProfileForm = () => {
  const navigate = useNavigate();
  const { userProfile, refresh } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    imageUrl: "",
    address: {
      id: 10,
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      console.log("form: ", form);
      await completeProfile(form);
      await refresh();

      navigate("/konto");
    } catch (err) {
      console.error("Completion of profile failed", err);
      setError(err?.response?.data?.message || err.message || "Något gick fel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={loading}
        name="firstName"
        placeholder="Förnamn"
        value={form.firstName}
        onChange={handleChange}
      />

      <input
        disabled={loading}
        name="lastName"
        placeholder="Efternamn"
        value={form.lastName}
        onChange={handleChange}
      />

      {/* Visa email om du vill, men skicka inte med om backend inte behöver det */}
      <input
        disabled
        placeholder="Email"
        value={userProfile?.data?.email || ""}
      />

      <input
        disabled={loading}
        name="phoneNumber"
        placeholder="Telefon"
        value={form.phoneNumber}
        onChange={handleChange}
      />

      <input
        disabled={loading}
        name="imageUrl"
        placeholder="Bild-URL"
        value={form.imageUrl}
        onChange={handleChange}
      />

      <input
        disabled={loading}
        name="street"
        placeholder="Gata"
        value={form.address.street}
        onChange={handleAddressChange}
      />

      <input
        disabled={loading}
        name="city"
        placeholder="Stad"
        value={form.address.city}
        onChange={handleAddressChange}
      />

      <input
        disabled={loading}
        name="state"
        placeholder="Län / Region"
        value={form.address.state}
        onChange={handleAddressChange}
      />

      <input
        disabled={loading}
        name="zipCode"
        placeholder="Postnummer"
        value={form.address.zipCode}
        onChange={handleAddressChange}
      />

      <input
        disabled={loading}
        name="country"
        placeholder="Land"
        value={form.address.country}
        onChange={handleAddressChange}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button disabled={loading} type="submit">
        {loading ? "Sparar..." : "Spara"}
      </button>
    </form>
  );
};

export default CompleteProfileForm;
