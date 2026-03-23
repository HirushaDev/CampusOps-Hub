/**
 * Main App Component
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import ClubsPage from './pages/ClubsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import MyClubsPage from './pages/MyClubsPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-clubs"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <MyClubsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
