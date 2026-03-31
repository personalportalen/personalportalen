import "./CompleteProfileForm.css"
import {ArrowRight} from "lucide-react"

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
      <div className="complete_input-group">
        <label>Mejladress</label>
        {/* Visa email om du vill, men skicka inte med om backend inte behöver det */}
        <input
          disabled
          placeholder="Email"
          value={userProfile?.data?.email || ""}
          />
      </div>
      <div className="complete_input-group">
        <label>Namn</label>
        <div>
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
        </div>
      </div>

      <div className="complete_input-group">
        <label>Telefon</label>
        <input
          disabled={loading}
          name="phoneNumber"
          placeholder="Telefonnummer"
          value={form.phoneNumber}
          onChange={handleChange}
        />
      </div>

      <div className="complete_input-group address">
        <label>Adress</label>
        <input
          disabled={loading}
          name="street"
          placeholder="Gata"
          value={form.address.street}
          onChange={handleAddressChange}
        />
        <div>
          <input
            disabled={loading}
            name="zipCode"
            placeholder="Postnummer"
            value={form.address.zipCode}
            onChange={handleAddressChange}
          />
          <input
            disabled={loading}
            name="city"
            placeholder="Stad"
            value={form.address.city}
            onChange={handleAddressChange}
          />
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button disabled={loading} type="submit" className="button button-prim">
        {loading ? "Sparar..." : "Spara"}
        {!loading && <ArrowRight className="complete_icon_arrow" />}
      </button>
    </form>
  );
};

export default CompleteProfileForm;
