import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, GraduationCap, Briefcase, ExternalLink, Menu, X, UserPlus, Edit3 } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center min-h-24 py-2">
          {/* Logo and University Name */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 mr-2">
            <Link to="/" className="flex items-center space-x-1 sm:space-x-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <img 
                  src="https://hbtu.ac.in/wp-content/uploads/2024/07/hbtu-logo-1.jpg" 
                  alt="HBTU Logo 1" 
                  className="h-12 sm:h-14 md:h-16 w-auto"
                />
                <img 
                  src="https://hbtu.ac.in/wp-content/uploads/2024/07/hbtu-logo-2.jpg" 
                  alt="HBTU Logo 2" 
                  className="h-12 sm:h-14 md:h-16 w-auto"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base md:text-xl font-bold text-blue-900 leading-tight">Harcourt Butler Technical University</span>
                <span className="text-xs sm:text-sm text-gray-600 leading-tight">Department of Master of Computer Applications</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                (location.pathname === '/' || location.pathname === '/students')
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
              to="/jobs"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                location.pathname === '/jobs'
                  ? 'text-blue-900 font-medium'
                  : 'text-gray-600 hover:text-blue-900'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Jobs</span>
            </Link>

            <Link
              to="/update-profile-by-roll"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all ${
                location.pathname.startsWith('/update-profile-by-roll')
                  ? 'ring-2 ring-green-300'
                  : ''
              }`}
            >
              <Edit3 className="w-5 h-5" />
              <span>Update Profile</span>
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
          <div className="md:hidden flex items-center flex-shrink-0">
            <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-blue-900 focus:outline-none p-2">
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
                  (location.pathname === '/' || location.pathname === '/students')
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
                to="/jobs"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  location.pathname === '/jobs'
                    ? 'text-blue-900 font-medium'
                    : 'text-gray-600 hover:text-blue-900'
                }`}
                onClick={toggleMobileMenu}
              >
                <Briefcase className="w-5 h-5" />
                <span>Jobs</span>
              </Link>

              <Link
                to="/update-profile-by-roll"
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700"
                onClick={toggleMobileMenu}
              >
                <Edit3 className="w-5 h-5" />
                <span>Update Profile</span>
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