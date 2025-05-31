import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good Afternoon");
      } else if (hour >= 17 && hour < 22) {
        setGreeting("Good Evening");
      } else {
        setGreeting("Good Night");
      }
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <nav
      className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 p-4 shadow-lg shadow-inner sticky top-0 z-50"
      role="navigation"
    >
      <style>
        {`
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(209, 213, 219, 0.3); }
            50% { box-shadow: 0 0 15px rgba(209, 213, 219, 0.5); }
            100% { box-shadow: 0 0 5px rgba(209, 213, 219, 0.3); }
          }
          .dark-glow {
            animation: glow 2s infinite ease-in-out;
          }
          .hover-underline::after {
            content: '';
            position: absolute;
            width: 0;
            height: 1px;
            bottom: 0;
            left: 0;
            background: #93c5fd;
            transition: width 0.3s ease-in-out;
          }
          .dark .hover-underline::after {
            background: #9ca3af;
          }
          .hover-underline:hover::after {
            width: 100%;
          }
        `}
      </style>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <NavLink
            to="/"
            className="text-white dark:text-amber-200 text-2xl font-bold hover:text-white dark:hover:text-amber-200 transition-none"
            aria-label="NexusEd Home"
          >
            NexusEd
          </NavLink>
          {user && (
            <span className="text-white dark:text-amber-200 text-sm md:text-base">
              {greeting}, {user.username}!
            </span>
          )}
          <button
            onClick={toggleDarkMode}
            className="text-white dark:text-amber-400 focus:outline-none rounded-md p-2 transition-all duration-300"
            aria-label={
              isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            <i
              className={
                isDarkMode
                  ? "fa-solid fa-sun text-2xl"
                  : "fa-solid fa-moon text-2xl"
              }
            ></i>
          </button>
        </div>

        <div className="flex items-center">
          <button
            className="md:hidden text-white dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-gray-500 rounded-md p-2 transition-all duration-300"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        <div className="hidden md:flex md:space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative text-white dark:text-gray-200 px-3 py-1 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                isActive
                  ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                  : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
              }`
            }
            aria-label="Home"
          >
            Posts
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `relative text-white dark:text-gray-200 px-3 py-1 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                    isActive
                      ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                      : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
                  }`
                }
                aria-label="Profile"
              >
                Profile
              </NavLink>
              <NavLink
                to="/study-groups"
                className={({ isActive }) =>
                  `relative text-white dark:text-gray-200 px-3 py-1 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                    isActive
                      ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                      : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
                  }`
                }
                aria-label="Study Groups"
              >
                Groups
              </NavLink>
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  `relative text-white dark:text-gray-200 px-3 py-1 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                    isActive
                      ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                      : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
                  }`
                }
                aria-label="Calendar"
              >
                Calendar
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-500 dark:bg-red-600 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:bg-red-400 dark:hover:bg-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.3)] dark:hover:dark-glow transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/study-groups"
                className={({ isActive }) =>
                  `relative text-white dark:text-gray-200 px-3 py-1 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                    isActive
                      ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                      : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
                  }`
                }
                aria-label="Study Groups"
              >
                Groups
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `relative text-white dark:text-gray-200 px-3 py-1 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                    isActive
                      ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                      : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
                  }`
                }
                aria-label="Login"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `relative text-white dark:text-gray-200 px-3 py-1 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                    isActive
                      ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                      : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
                  }`
                }
                aria-label="Register"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden mt-4 space-y-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block text-white dark:text-gray-200 px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                isActive
                  ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                  : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Home"
          >
            Home
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `block text-white dark:text-gray-200 px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                    isActive
                      ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                      : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Profile"
              >
                Profile
              </NavLink>
              <NavLink
                to="/study-groups"
                className={({ isActive }) =>
                  `block text-white dark:text-gray-200 px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                    isActive
                      ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                      : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Study Groups"
              >
                Study Groups
              </NavLink>
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  `block text-white dark:text-gray-200 px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                    isActive
                      ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                      : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Calendar"
              >
                Calendar
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left text-white dark:text-gray-200 px-4 py-2 rounded-md bg-red-500 dark:bg-red-600 hover:bg-red-400 dark:hover:bg-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.3)] dark:hover:dark-glow transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/study-groups"
                className={({ isActive }) =>
                  `block text-white dark:text-gray-200 px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                    isActive
                      ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                      : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Study Groups"
              >
                Study Groups
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `block text-white dark:text-gray-200 px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                    isActive
                      ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0)] dark:shadow-[0_0_10px_rgba(209,213,219,0)]"
                      : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Login"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `block text-white dark:text-gray-200 px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover-underline ${
                    isActive
                      ? "bg-blue-400 dark:bg-gray-600 text-white dark:text-gray-200 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)]"
                      : "hover:bg-blue-500 dark:hover:bg-gray-700 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)]"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Register"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
