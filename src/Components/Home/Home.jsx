import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import LeafletMap from "../LeafletMap/LeafletMap";
import ReportsLog from "../ReportsLog/ReportsLog";
import { ref, push, set } from "firebase/database";
import { database } from "../../firebase";
import Sidebar from "../Sidebar/Sidebar";
import { FaBars, FaTimes } from "react-icons/fa";

const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;

  // States for handling incident reporting
  const [showReportForm, setShowReportForm] = useState(false);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleReport = () => {
    if (address && description) {
      const incidentRef = ref(database, "incidents");
      const newIncidentRef = push(incidentRef);
      set(newIncidentRef, {
        address: address,
        description: description,
        timestamp: new Date().toISOString(),
      })
        .then(() => {
          alert("Incident reported successfully.");
          setAddress("");
          setDescription("");
          setShowReportForm(false);
        })
        .catch((error) => {
          console.error("Error reporting incident: ", error);
        });
    } else {
      alert("Please provide address and description.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-50 to-purple-200">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <header className="w-full bg-pink-600 py-4 shadow-lg flex justify-between items-center px-8">
          <button
            className="text-white p-2 focus:outline-none z-50"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h1 className="text-3xl font-bold text-white">
            <Link to="/">Women's Safety App</Link>
          </h1>
          <nav className="space-x-4">
            {!user ? (
              <>
                <Link
                  to="/chat"
                  className="text-white font-semibold hover:text-gray-300"
                >
                  Chat
                </Link>
                <Link
                  to="/login"
                  className="text-white font-semibold hover:text-gray-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white font-semibold hover:text-gray-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/chat"
                  className="text-white font-semibold hover:text-gray-300"
                >
                  Chat
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white font-semibold hover:text-gray-300"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full flex lg:flex-row flex-col-reverse lg:space-x-8 space-y-8 lg:space-y-0 p-8">
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-pink-300 flex flex-col">
            <div className="p-6 bg-pink-50 rounded-t-lg">
              <h2 className="text-2xl font-bold text-pink-700 mb-4">Map</h2>
              <LeafletMap onReport={() => setShowReportForm(true)} />
            </div>
          </div>
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-purple-300 flex flex-col">
            <div className="p-6 bg-purple-50 rounded-t-lg flex-1 flex-col">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                Incident Log
              </h2>
              <ReportsLog />
            </div>
          </div>
        </main>

        {/* Report Incident Form */}
        {showReportForm && (
          <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg border-t-4 border-pink-300 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4">Report an Incident</h3>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border p-2 mb-2 w-full max-w-md"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 mb-4 w-full max-w-md"
            />
            <button
              onClick={handleReport}
              className="bg-pink-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
            <button
              onClick={() => setShowReportForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded mt-2"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="w-full bg-pink-600 py-4 mt-auto">
          <p className="text-center text-white">
            ©️ 2024 Women's Safety App. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
