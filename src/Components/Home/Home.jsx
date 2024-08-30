// Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import LeafletMap from "../LeafletMap/LeafletMap";
import AnonymousChat from "../AnonymousChat/AnonymousChat";

const Home = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to home page after successful logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 to-purple-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-pink-600 py-4 shadow-lg flex justify-between items-center px-8">
        <h1 className="text-3xl font-bold text-white">
          <Link to="/">Women's Safety App</Link>
        </h1>
        <nav className="space-x-4">
          {!user ? (
            <>
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
                to="/report"
                className="text-white font-semibold hover:text-gray-300"
              >
                Report Incident
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
            <LeafletMap />
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-purple-300 flex flex-col">
          <div className="p-6 bg-purple-50 rounded-t-lg flex-1  flex-col">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Chat</h2>
            <AnonymousChat />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-pink-600 py-4 mt-auto">
        <p className="text-center text-white">
          © 2024 Women's Safety App. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
