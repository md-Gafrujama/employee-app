import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Home, LayoutDashboard, LogOut, User, LogIn } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shadow-xl z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <span className="text-white text-xl font-bold">E</span>
              </div>
              <span className="text-xl font-extrabold text-white group-hover:text-blue-200 transition-colors ease-in-out duration-300">EMS</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/" className="flex items-center text-lg font-semibold text-white hover:text-blue-200 transition duration-300">
                  <Home className="w-5 h-5 mr-2" />
                  Home
                </Link>
                <Link to="/dashboard" className="flex items-center text-lg font-semibold text-white hover:text-blue-200 transition duration-300">
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-lg font-semibold text-white hover:text-blue-200 transition duration-300"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center text-lg font-semibold text-white hover:text-blue-200 transition duration-300">
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </Link>
                <Link to="/signup" className="flex items-center text-lg font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded-lg px-6 py-2 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  <User className="w-5 h-5 mr-2" />
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-600 bg-opacity-95 backdrop-blur-sm z-50">
          <div className="px-4 py-3 space-y-4">
            {isAuthenticated ? (
              <>
                <Link to="/" 
                  className="flex items-center text-lg font-semibold text-white hover:text-blue-200 transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-6 h-6 mr-3" />
                  Home
                </Link>
                <Link to="/dashboard"
                  className="flex items-center text-lg font-semibold text-white hover:text-blue-200 transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-6 h-6 mr-3" />
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full text-lg font-semibold text-white hover:text-blue-200 transition duration-300"
                >
                  <LogOut className="w-6 h-6 mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="flex items-center text-lg font-semibold text-white hover:text-blue-200 transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="w-6 h-6 mr-3" />
                  Login
                </Link>
                <Link to="/signup"
                  className="flex items-center text-lg font-semibold text-blue-600 bg-white rounded-lg px-6 py-2 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-6 h-6 mr-3" />
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
