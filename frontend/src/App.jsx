import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard";
import ModernResourceBooking from "./Components/BookingPage";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/booking" element={<ModernResourceBooking />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;