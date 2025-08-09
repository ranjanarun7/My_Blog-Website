import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa";

export default function Navbar({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-black text-white p-4 relative z-50">
      <div className="flex justify-between items-center">
        {/* Left: Logo & Sidebar toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white text-2xl"
          >
            <FaBars />
          </button>
          <Link to="/">
            <img
              src="/image/Logo.png"
              alt="Logo"
              className="h-10 w-32 rounded-full"
            />
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <div className="hidden md:flex space-x-6 font-bold">
          <Link
            to="/"
            className={`hover:text-orange-600 ${
              location.pathname === "/" ? "border-b-2 border-orange-500 pb-1" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`hover:text-orange-600 ${
              location.pathname === "/about" ? "border-b-2 border-orange-500 pb-1" : ""
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`hover:text-orange-600 ${
              location.pathname === "/contact" ? "border-b-2 border-orange-500 pb-1" : ""
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Right: User Icon */}
        <div className="relative z-50" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="cursor-pointer"
          >
            <FaUserCircle size={28} />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-black shadow-lg rounded-md py-2 z-50">
              {/* Mobile nav links only visible on mobile */}
              <div className="block md:hidden">
                <Link
                  to="/"
                  onClick={() => setDropdownOpen(false)}
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                    location.pathname === "/" ? "text-orange-600" : ""
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  onClick={() => setDropdownOpen(false)}
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                    location.pathname === "/about" ? "text-orange-600" : ""
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setDropdownOpen(false)}
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                    location.pathname === "/contact" ? "text-orange-600" : ""
                  }`}
                >
                  Contact
                </Link>
                <hr className="my-2" />
              </div>

              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-800 border-b">
                    Hello, {user.username}
                  </div>

                  {/* ✅ Show Admin Dashboard only if user is admin */}
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 text-red-600 font-bold"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/create"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Create Post
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
