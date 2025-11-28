import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, GraduationCap, ExternalLink, Menu, X, UserPlus } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          {/* Logo and University Name */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img 
                  src="https://hbtu.ac.in/wp-content/uploads/2024/07/hbtu-logo-1.jpg" 
                  alt="HBTU Logo 1" 
                  className="h-16 w-auto"
                />
                <img 
                  src="https://hbtu.ac.in/wp-content/uploads/2024/07/hbtu-logo-2.jpg" 
                  alt="HBTU Logo 2" 
                  className="h-16 w-auto"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-900">Harcourt Butler Technical University</span>
                <span className="text-sm text-gray-600">Department of Master of Computer Applications</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                location.pathname === '/' 
                  ? 'text-blue-900 font-medium'
                  : 'text-gray-600 hover:text-blue-900'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Students</span>
            </Link>
            
            <Link
              to="/alumni"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                location.pathname === '/alumni'
                  ? 'text-blue-900 font-medium'
                  : 'text-gray-600 hover:text-blue-900'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Alumni</span>
            </Link>

            <Link
              to="/register"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                location.pathname === '/register'
                  ? 'text-blue-900 font-medium'
                  : 'text-gray-600 hover:text-blue-900'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span>Register</span>
            </Link>

            <a
              href="https://hbtu.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-600 hover:text-blue-900"
            >
              <ExternalLink className="w-5 h-5" />
              <span>HBTU Website</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-blue-900 focus:outline-none">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="flex flex-col space-y-2 p-4 bg-white shadow-md">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  location.pathname === '/' 
                    ? 'text-blue-900 font-medium'
                    : 'text-gray-600 hover:text-blue-900'
                }`}
                onClick={toggleMobileMenu}
              >
                <Users className="w-5 h-5" />
                <span>Students</span>
              </Link>
              
              <Link
                to="/alumni"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  location.pathname === '/alumni'
                    ? 'text-blue-900 font-medium'
                    : 'text-gray-600 hover:text-blue-900'
                }`}
                onClick={toggleMobileMenu}
              >
                <GraduationCap className="w-5 h-5" />
                <span>Alumni</span>
              </Link>

              <Link
                to="/register"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  location.pathname === '/register'
                    ? 'text-blue-900 font-medium'
                    : 'text-gray-600 hover:text-blue-900'
                }`}
                onClick={toggleMobileMenu}
              >
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </Link>

              <a
                href="https://hbtu.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:text-blue-900"
                onClick={toggleMobileMenu}
              >
                <ExternalLink className="w-5 h-5" />
                <span>HBTU Website</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;