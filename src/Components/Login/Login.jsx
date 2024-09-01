import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { verifyGender } from "../../genderVerificationService"; // Ensure the correct path
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gender, setGender] = useState(null);
  const [redirect, setRedirect] = useState(false); // Added state for redirection
  const navigate = useNavigate(); // Initialize useNavigate hook

  const validateEmail = (email) => {
    return email.endsWith("@srmist.edu.in");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please use a valid SRMIST email address.");
      return;
    }

    setLoading(true);

    try {
      // Verify gender
      const result = await verifyGender(name);
      setGender(result?.gender || "Not Found");

      if (result?.gender !== "female") {
        setError("Gender verification failed. Only female names are allowed.");
        setLoading(false);
        return;
      }

      // Sign in with Firebase Authentication
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);

      // Set redirect state to true
      setRedirect(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect after login
  useEffect(() => {
    if (redirect) {
      navigate("/", { replace: true });
    }
  }, [redirect, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-red-300 p-4">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
      >
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-6 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Login
        </motion.h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <motion.input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.button
            type="submit"
            className="bg-pink-500 text-white rounded-md p-3 font-semibold hover:bg-pink-600 transition duration-300"
            disabled={loading}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {loading ? "Logging In..." : "Log In"}
          </motion.button>
        </form>
        {error && !loading && (
          <motion.div
            className="mt-6 text-center text-red-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p>{error}</p>
          </motion.div>
        )}
        {gender && !loading && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-lg text-gray-700">
              Predicted Gender:
              <span className="font-bold ml-2 capitalize">{gender}</span>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
