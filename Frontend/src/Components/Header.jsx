import React from "react";
import { Link } from "react-router-dom";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const handleClick = async () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="header_container">
      <Link to={"/home"} className="button">
        Pass
      </Link>
      <Link to={"/"} className="button">
        Bokningar
      </Link>
      <Link to={"/"} className="">
        <button className="button" onClick={handleClick}>
          Logga ut
        </button>
      </Link>
      <Link to={"/konto"} className="button">
        Konto
      </Link>
    </div>
  );
};

export default Header;
