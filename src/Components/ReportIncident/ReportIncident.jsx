import React from "react";
import { database } from "../../firebase";
import { ref, push } from "firebase/database";

const ReportIncident = () => {
  const handleReport = async () => {
    console.log("Report button clicked");

    const description = window.prompt("Please describe the incident:");
    console.log("Description:", description);

    if (!description || description.trim() === "") {
      alert("Description cannot be empty!");
      return;
    }

    const address = window.prompt("Please enter the address:");
    console.log("Address:", address);

    if (!address || address.trim() === "") {
      alert("Address cannot be empty!");
      return;
    }

    try {
      const incidentRef = ref(database, "incidents");
      await push(incidentRef, {
        description: description,
        address: address,
        timestamp: new Date().toISOString(),
      });

      alert("Incident reported successfully!");
    } catch (error) {
      console.error("Error reporting incident: ", error);
      alert("Failed to report the incident. Please try again.");
    }
  };

  return (
    <div>
      <h2>Report an Incident</h2>
      <button onClick={handleReport}>Report Incident</button>
    </div>
  );
};

export default ReportIncident;
