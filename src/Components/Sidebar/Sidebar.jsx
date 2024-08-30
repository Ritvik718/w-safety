import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-white to-pink-200 text-pink-800 z-40 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        width: "16rem",
        borderTopRightRadius: "1rem",
        borderBottomRightRadius: "1rem",
      }}
    >
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-8 text-pink-600">Menu</h2>
        <ul>
          <li className="mb-6">
            <Link
              to="/login"
              onClick={toggleSidebar}
              className="bg-pink-100 text-pink-800 hover:bg-pink-300 hover:text-pink-900 py-2 px-4 rounded-lg shadow-md text-lg font-semibold transition-colors duration-200 block text-center"
            >
              Login
            </Link>
          </li>
          <li className="mb-6">
            <Link
              to="/signup"
              onClick={toggleSidebar}
              className="bg-pink-100 text-pink-800 hover:bg-pink-300 hover:text-pink-900 py-2 px-4 rounded-lg shadow-md text-lg font-semibold transition-colors duration-200 block text-center"
            >
              Signup
            </Link>
          </li>
          <li className="mb-6">
            <Link
              to="/profile"
              onClick={toggleSidebar}
              className="bg-pink-100 text-pink-800 hover:bg-pink-300 hover:text-pink-900 py-2 px-4 rounded-lg shadow-md text-lg font-semibold transition-colors duration-200 block text-center"
            >
              Profile
            </Link>
          </li>
          <li className="mb-6">
            <Link
              to="/chat"
              onClick={toggleSidebar}
              className="bg-pink-100 text-pink-800 hover:bg-pink-300 hover:text-pink-900 py-2 px-4 rounded-lg shadow-md text-lg font-semibold transition-colors duration-200 block text-center"
            >
              Chat
            </Link>
          </li>
          <li className="mb-6">
            <button
              onClick={toggleSidebar}
              className="bg-pink-100 text-pink-800 hover:bg-pink-300 hover:text-pink-900 py-2 px-4 rounded-lg shadow-md text-lg font-semibold transition-colors duration-200 w-full"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
