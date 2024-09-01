import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { verifyGender } from "../../genderVerificationService"; // Ensure the correct path
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gender, setGender] = useState(null);
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

      // Clear form and error
      setName("");
      setEmail("");
      setPassword("");
      setGender(null);
      setError("");

      // Redirect to the home page after successful login
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-3 font-semibold hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
        {error && !loading && (
          <div className="mt-6 text-center text-red-600">
            <p>{error}</p>
          </div>
        )}
        {gender && !loading && (
          <div className="mt-6 text-center">
            <p className="text-lg text-gray-700">
              Predicted Gender:
              <span className="font-bold ml-2 capitalize">{gender}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
