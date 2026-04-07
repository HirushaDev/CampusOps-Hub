import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard";
import Auth from "./Components/login";
import Dashboard from "./Components/Dashboard";
import ResetPassword from "./Components/ResetPassword";
import OAuth2Success from "./Components/OAuth2Success";
import ModernResourceBooking from "./Components/BookingPage";
import VerifyEmail from "./Components/VerifyEmail";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/login" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/oauth2/success" element={<OAuth2Success />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                            <Route path="/booking" element={<ModernResourceBooking />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;