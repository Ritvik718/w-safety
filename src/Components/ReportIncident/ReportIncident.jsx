// ReportIncident.jsx
import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { useNavigate } from "react-router-dom";

const ReportIncident = () => {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const db = getDatabase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const incidentsRef = ref(db, "incidents");

    try {
      await push(incidentsRef, {
        location,
        description,
        timestamp: new Date().toISOString(),
      });
      alert("Incident reported successfully!");
      navigate("/"); // Redirect to home page or map view after reporting
    } catch (error) {
      console.error("Error reporting incident:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Report an Incident</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 rounded"
        >
          Report
        </button>
      </form>
    </div>
  );
};

export default ReportIncident;
