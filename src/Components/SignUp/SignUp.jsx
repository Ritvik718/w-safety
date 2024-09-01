import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { verifyGender } from "../../genderVerificationService"; // Ensure this path is correct

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [contact1, setContact1] = useState("");
  const [contact2, setContact2] = useState("");
  const [contact3, setContact3] = useState("");
  const [contactEmail1, setContactEmail1] = useState("");
  const [contactEmail2, setContactEmail2] = useState("");
  const [contactEmail3, setContactEmail3] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameVerified, setNameVerified] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!nameVerified) {
      setError("Name verification failed or not performed.");
      return;
    }
    setLoading(true);

    const auth = getAuth();
    const db = getDatabase();
    try {
      // Create user in Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      // Save user details and emergency contacts to Firebase Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        email,
        name,
        contacts: [
          { name: contact1, email: contactEmail1 },
          { name: contact2, email: contactEmail2 },
          { name: contact3, email: contactEmail3 },
        ],
      });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleNameVerification = async () => {
    if (!name) {
      setError("Please enter your name.");
      return;
    }
    try {
      const result = await verifyGender(name);
      if (result?.gender === "female") {
        // Assuming "female" is the valid gender for this verification
        setNameVerified(true);
        setError("");
      } else {
        setNameVerified(false);
        setError("Name verification failed. Please enter a valid name.");
      }
    } catch (err) {
      setError("Error verifying name.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Sign Up
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleNameVerification}
            className="bg-green-500 text-white rounded-md p-3 font-semibold hover:bg-green-600 transition duration-300 mb-4"
          >
            Verify Name
          </button>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Emergency Contact 1 Name"
            value={contact1}
            onChange={(e) => setContact1(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Emergency Contact 1 Email"
            value={contactEmail1}
            onChange={(e) => setContactEmail1(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Emergency Contact 2 Name"
            value={contact2}
            onChange={(e) => setContact2(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Emergency Contact 2 Email"
            value={contactEmail2}
            onChange={(e) => setContactEmail2(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Emergency Contact 3 Name"
            value={contact3}
            onChange={(e) => setContact3(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Emergency Contact 3 Email"
            value={contactEmail3}
            onChange={(e) => setContactEmail3(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-3 font-semibold hover:bg-blue-600 transition duration-300"
            disabled={loading || !nameVerified}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
