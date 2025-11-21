import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import TestPage from "./pages/TestPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default goes to admin */}
        <Route path="/" element={<Admin />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<Admin />} />

        {/* Test Page for users */}
        <Route path="/test/:testId" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}
