import React from "react";
import { Link } from "react-router-dom";
import {
  FaComments,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transform top-0 left-0 w-64 bg-gray-800 text-white fixed h-full transition-transform duration-300 ease-in-out z-40`}
      >
        <nav className="flex flex-col mt-12 space-y-4">
          <Link
            to="/chat"
            className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-300"
            onClick={toggleSidebar}
          >
            <FaComments className="mr-3" />
            <span>Chat</span>
          </Link>
          <Link
            to="/map"
            className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-300"
            onClick={toggleSidebar}
          >
            <FaMapMarkerAlt className="mr-3" />
            <span>Map</span>
          </Link>
          <Link
            to="/faq"
            className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-300"
            onClick={toggleSidebar}
          >
            <FaQuestionCircle className="mr-3" />
            <span>FAQ</span>
          </Link>
          <Link
            to="/logout"
            className="mt-auto flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-300"
            onClick={toggleSidebar}
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
