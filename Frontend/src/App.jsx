import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { getWorkshifts } from "./api/workshift";
import AddWorkshift from "./Pages/AddWorkshift";
import EditWorkshift from "./Pages/EditWorkshift";
import Login from "./Pages/LoginForm";
import SignupForm from "./Pages/SignupForm";
import Header from "./Components/Header";
import Bookings from "./Pages/Bookings";
import Account from "./Pages/Account";
import Workshifts from "./Pages/Workshifts";
import ProtectedRoute from "./Components/ProtectedRoute";
import CompleteProfile from "./Pages/CompleteProfile";

function App() {
  const { isAuthenticated } = useAuth();
  const [workshifts, setWorkshifts] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const fetchData = async () => {
      try {
        const workshiftsData = await getWorkshifts();
        setWorkshifts(workshiftsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  return (
    <>
      <main>
        <Header isAuthenticated={isAuthenticated} />
        <Routes>
          <Route
            path="/login"
            element={<Login isAuthenticated={isAuthenticated} />}
          />
          <Route path="/signup" element={<SignupForm />} />

          <Route path="/" element={<Workshifts workshifts={workshifts} />} />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddWorkshift />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditWorkshift />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/konto"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
