import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;