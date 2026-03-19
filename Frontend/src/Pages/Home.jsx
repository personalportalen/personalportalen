import React from "react";
import WorkshiftCard from "../Components/WorkshiftCard";
import { Link } from "react-router-dom";

const Home = ({
  workshifts,
  shouldLoadAgain,
  setShouldLoadAgain,
  authorityLevel,
}) => {
  return (
    <div className="home_container">
      <h1>Lediga pass att boka</h1>
      <div className="home_content-container">
        {authorityLevel == "Anställd" ? (
          ""
        ) : (
          <Link to={"/add"} className="home_add-workshift">
            <p>+</p>
          </Link>
        )}

        {workshifts.map((workshift) => (
          <WorkshiftCard
            key={workshift.id}
            workshift={workshift}
            shouldLoadAgain={shouldLoadAgain}
            setShouldLoadAgain={setShouldLoadAgain}
            authorityLevel={authorityLevel}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
