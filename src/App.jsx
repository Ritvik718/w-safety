import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./Components/Home/Home";
import Signup from "./Components/Signup/Signup";
import Login from "./Components/Login/Login";
import PhoneSignIn from "./Components/PhoneSignIn/PhoneSignIn";
import AnonymousChat from "./Components/AnonymousChat/AnonymousChat";
import Sidebar from "./Components/Sidebar/Sidebar";
import Faq from "./Components/Faq/Faq";
import SOSButton from "./Components/SOSButton/SOSButton"; // Adjust path if necessary

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
          <AnimatePresence>
            <Routes>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Home
                      isSidebarOpen={isSidebarOpen}
                      toggleSidebar={toggleSidebar}
                    />
                  </PageTransition>
                }
              />
              <Route
                path="/signup"
                element={
                  <PageTransition>
                    <Signup />
                  </PageTransition>
                }
              />
              <Route
                path="/login"
                element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                }
              />
              <Route
                path="/faq"
                element={
                  <PageTransition>
                    <Faq />
                  </PageTransition>
                }
              />
              <Route
                path="/phonesignin"
                element={
                  <PageTransition>
                    <PhoneSignIn />
                  </PageTransition>
                }
              />
              <Route
                path="/chat"
                element={
                  <PageTransition>
                    <AnonymousChat />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
      {/* SOS Button */}
      <div className="fixed bottom-4 right-4">
        <SOSButton />
      </div>
    </Router>
  );
}

// Component to handle page transitions
const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default App;
