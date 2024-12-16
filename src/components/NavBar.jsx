import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ContactPopup from "./Contact";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to open the popup
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-3 px-8 fixed w-full z-50">
      <div className="max-w-full mx-auto px- sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold">
              <span className="text-red-600">DKTE</span>
              <span className="text-gray-800">COLLEGE</span>
              <div className="text-sm text-gray-500 font-light">
                DKTE COLLEGE ENTRANCE TEST
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={openPopup}
              className="text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 bg-gray-200 uppercase transition-colors"

            >
              CONTACT
            </button>

            <Link
              to="/student/getHallTicket"
              className="text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 bg-gray-200 uppercase transition-colors"
            >
              HallTicket
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-red-600 transition-colors px-3 py-2 text-sm font-medium"
                >
                  DASHBOARD
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ADMIN LOGIN
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* <Link
              to="/result"
              className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              RESULT
            </Link> */}

              <Link
                  to="/student/getHallTicket"
                  className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base uppercase font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  HallTicket
                </Link>

            <button
              onClick={() => {
                openPopup();
                setIsMenuOpen(false);
              }}
              className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium w-full text-left"
            >
              CONTACT
            </button>

            {isLoggedIn ? (
              <>
                

                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  DASHBOARD
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium w-full text-left"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ADMIN LOGIN
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Contact Popup */}
      {isPopupOpen && <ContactPopup closePopup={closePopup} />}
    </nav>
  );
};

export default Navbar;