
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import UserDashboard from './pages/UserDashboard';
import CompleteProfile from './pages/CompleteProfile';
import AdminSignIn from './pages/AdminSignIn';
import AdminDashboard from './pages/AdminDashboard';
import SecretRouteListener from './components/SecretRouteListener';
import { ThemeProvider } from './context/ThemeContext';


import LandingPage from './pages/LandingPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/admin/signin" element={<AdminSignIn />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <SecretRouteListener />
      </Router>
    </ThemeProvider>
  );
}

export default App;
