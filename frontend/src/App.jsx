import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Alumni from './pages/Alumni';
import Jobs from './pages/Jobs';
import Register from './pages/Register';
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
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;