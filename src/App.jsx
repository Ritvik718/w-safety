// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import Signup from "./Components/Signup/Signup";
import Login from "./Components/Login/Login";
import PhoneSignIn from "./Components/PhoneSignIn/PhoneSignIn";
import AnonymousChat from "./Components/AnonymousChat/AnonymousChat";
import Sidebar from "./Components/Sidebar/Sidebar";
import Faq from "./Components/Faq/Faq";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="flex">
        {/* Sidebar component */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                />
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/phonesignin" element={<PhoneSignIn />} />
            <Route path="/chat" element={<AnonymousChat />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
