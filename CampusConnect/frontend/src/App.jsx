import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Alumni from './pages/Alumni';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Home />} /> {/* Matches Navbar link */}
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/alumni" element={<Alumni />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;