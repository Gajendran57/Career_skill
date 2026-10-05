import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Questionnaire from "./pages/Questionnaire";
import AdminDashboard from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import AdminSkillMapPage from "./pages/AdminSkillMapPage";
import SkillDetail from "./pages/SkillDetail";

function App() {
  const [user, setUser] = useState(null);
  const [visitedQuestionnaire, setVisitedQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));;

    setUser(storedUser);

    setLoading(false); // Set loading to false once data is fetched
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking localStorage
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={user ? "/dashboard" : "/login"} />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {user && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin_map" element={<AdminSkillMapPage />} />
            <Route path="/skill/:id" element={<SkillDetail />} />

            <Route
              path="/questionnaire"
              element={ <Questionnaire/> } />
          </>
        )}

        {user?.email === "admin@gmail.com" && (
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
