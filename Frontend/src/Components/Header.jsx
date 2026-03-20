import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Header = () => {
  const navigate = useNavigate();

  const { logout, isAuthenticated, userProfile } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  if (userProfile?.data.completionStatus === "Incompleted") {
    return;
  }

  return (
    <div className="header_container">
      <Link to={"/"} className="button">
        Pass
      </Link>

      {isAuthenticated ? (
        <>
          <Link to={"/bookings"} className="button">
            Bokningar
          </Link>
          <Link to={"/konto"} className="button">
            Konto
          </Link>
          <Link to={"/"} className="">
            <button className="button" onClick={handleLogout}>
              Logga ut
            </button>
          </Link>
        </>
      ) : (
        <Link to={"/login"} className="button">
          Logga in
        </Link>
      )}
    </div>
  );
};

export default Header;
