import React, { useState } from "react";
import { verifyGender } from "./GenderVerification";

const GenderVerification = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    const result = await verifyGender(name);
    setGender(result?.gender || "Not Found");
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Gender Verification
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-3 font-semibold hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Gender"}
          </button>
        </form>
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

export default GenderVerification;
