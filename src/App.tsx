import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import TableComponent from './components/Table/TableComponent';
import { UserRole } from './enums/UserRole';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLoginSuccess = (role: UserRole) => {
    setIsLoggedIn(true);// Set the login state
    setUserRole(role);// Set the user role
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Reset the login state
    setUserRole(null); // Clear the user role
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/table" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/table" element={isLoggedIn ? <TableComponent role={userRole} onLogout={handleLogout}/> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
