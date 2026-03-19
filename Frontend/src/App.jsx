import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import AddWorkshift from "./Pages/AddWorkshift";
import EditWorkshift from "./Pages/EditWorkshift";
import Login from "./Pages/LoginForm";
import SignupForm from "./Pages/SignupForm";
import Header from "./Components/Header";
import Bookings from "./Pages/Bookings";
import Account from "./Pages/Account";

function App() {
  const [userProfile, setUserProfile] = useState();
  const [workshifts, setWorkshifts] = useState([]);
  const [shouldLoadAgain, setShouldLoadAgain] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authorityLevel, setAuthorityLevel] = useState();

  const getWorkshifts = async () => {
    const res = await fetch("https://localhost:7103/api/workshift/getall");
    if (res.ok) {
      const data = await res.json();
      setWorkshifts(data);
    } else {
      console.error("res", res);
    }
  };

  const getUserProfile = async (token) => {
    const res = await fetch(`https://localhost:7294/api/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = res.json();
      return data;
    } else {
      return;
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (token) {
      getUserProfile(token.split("=")[1]).then((profile) => {
        setUserProfile(profile);
      });
    }

    getWorkshifts();
  }, []);

  useEffect(() => {
    getWorkshifts();
  }, [shouldLoadAgain]);

  return (
    <>
      <main>
        {userProfile ? (
          <>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
              <Route
                path="/home"
                element={
                  <Home
                    workshifts={workshifts}
                    shouldLoadAgain={shouldLoadAgain}
                    setShouldLoadAgain={setShouldLoadAgain}
                    authorityLevel={authorityLevel}
                  />
                }
              />
              <Route
                path="/add"
                element={
                  <AddWorkshift
                    shouldLoadAgain={shouldLoadAgain}
                    setShouldLoadAgain={setShouldLoadAgain}
                  />
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <EditWorkshift
                    shouldLoadAgain={shouldLoadAgain}
                    setShouldLoadAgain={setShouldLoadAgain}
                  />
                }
              />
              <Route
                path="/login"
                element={
                  <Login
                    authorityLevel={authorityLevel}
                    setAuthorityLevel={setAuthorityLevel}
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                  />
                }
              />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/" element={<Bookings />} />
              <Route path="/konto" element={<Account />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route
              path={"/"}
              element={
                <Login
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  setAuthorityLevel={setAuthorityLevel}
                  setUserProfile={setUserProfile}
                />
              }
            />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        )}
      </main>
    </>
  );
}

export default App;
