import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationPopup from "./NotificationPopup";

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <header className="py-4 w-full bg-black shadow-md">
      <nav>
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-8">
            <Link to="/">
              <img
                src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
                alt="Logo"
                width="50"
                className="cursor-pointer rounded-full border-2 border-white hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Teams and Tasks */}
            {token && (
              <div className="flex gap-6">
                <Link
                  to="/teams"
                  className="text-white font-semibold hover:bg-gray-700 px-4 py-2 rounded-full transition-all duration-300"
                >
                  Teams
                </Link>
                <Link
                  to="/tasks"
                  className="text-white font-semibold hover:bg-gray-700 px-4 py-2 rounded-full transition-all duration-300"
                >
                  Tasks
                </Link>
              </div>
            )}
          </div>

          {/* Right-Side Links */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            {token && (
              <div className="relative">
                <div
                  className="cursor-pointer text-black rounded-full p-2 w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  onClick={() => navigate("/notifications")}
                >
                  <span className="text-xl font-bold">🔔</span>
                </div>
                {isNotificationOpen && <NotificationPopup />}
              </div>
            )}

            {!token ? (
              <ul className="flex space-x-6">
                <li>
                  <Link
                    to="/"
                    className="text-white font-semibold hover:bg-gray-700 px-4 py-2 rounded-full transition-all duration-300"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-white font-semibold hover:bg-gray-700 px-4 py-2 rounded-full transition-all duration-300"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="text-white font-semibold hover:bg-gray-700 px-4 py-2 rounded-full transition-all duration-300"
                  >
                    SignUp
                  </Link>
                </li>
              </ul>
            ) : (
              <div className="relative">
                {/* Profile Icon */}
                <div
                  className="cursor-pointer bg-white text-black rounded-full p-2 w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  onClick={toggleDropdown}
                >
                  <span className="text-xl font-bold">S</span>
                </div>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-all duration-300"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
