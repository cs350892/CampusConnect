import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, UserPlus } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-orange-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold flex items-center">
          <Home className="w-6 h-6 mr-2" /> HBTU Connect
        </Link>
        <div className="flex space-x-4">
          <Link to="/alumni" className="text-white hover:text-orange-300 flex items-center">
            <Users className="w-5 h-5 mr-1" /> Alumni
          </Link>
          <Link to="/students" className="text-white hover:text-orange-300 flex items-center">
            <UserPlus className="w-5 h-5 mr-1" /> Students
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;