import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <span className="text-red-600">DKTE</span>
            <span className="text-gray-800">INSTITUTE</span>
            <div className="text-sm text-gray-500 font-light">
              COMMON ENTRANCE TEST
            </div>
          </div>

          {/* Menu for larger screens */}
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
            <a href="#admin-login" className="hover:text-black">
              ADMIN LOGIN
            </a>
            <a href="#result" className="hover:text-black">
              RESULT
            </a>
            <a href="#contact" className="hover:text-black">
              CONTACT US
            </a>
          </div>

          {/* Hamburger Icon for smaller screens */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-black focus:outline-none"
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden space-y-4 text-sm font-medium text-gray-700">
            <a href="#admin-login" className="block hover:text-black">
              ADMIN LOGIN
            </a>
            <a href="#result" className="block hover:text-black">
              RESULT
            </a>
            <a href="#contact" className="block hover:text-black">
              CONTACT US
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
