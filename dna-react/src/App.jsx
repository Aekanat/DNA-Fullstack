import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Navbar from "./components/Navibar";
import DataExploration from "./pages/DataExploration";
import DiseasePrediction from "./pages/DiseasePrediction";
import DataSubmission from "./pages/DataSubmission";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateUsername from "./pages/CreateUsername";
import Profile from "./pages/Profile";
import Settings from "./pages/Setting";
import Home from "./pages/Home";
import Footer from "./components/Footer";

// protected routes
const ProtectedRoute = ({ isAuthenticated, children, navbarProps }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Navbar {...navbarProps} />
      {children}
    </>
  );
};

function App() {
  const [theme, setTheme] = useState("retro");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Update theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Check for authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const navbarProps = {
    theme,
    onThemeChange: setTheme,
    handleLogout,
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-username" element={<CreateUsername />} />

        {/* Home Page - Protected*/}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <>
                <Navbar {...navbarProps} />
                <Home/>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Other Protected Routes */}
        <Route
          path="/data-exploration"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} navbarProps={navbarProps}>
              <DataExploration />
              <Footer/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/disease-prediction"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} navbarProps={navbarProps}>
              <DiseasePrediction />
              <Footer/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-submission"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} navbarProps={navbarProps}>
              <DataSubmission />
              <Footer/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} navbarProps={navbarProps}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} navbarProps={navbarProps}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
