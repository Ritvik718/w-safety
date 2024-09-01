import React, { useState, useEffect } from "react";
import { ref, onValue, remove } from "firebase/database";
import { auth, database } from "../../firebase"; // Adjust the path if needed

const ReportsLog = () => {
  const [reports, setReports] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    // Fetch current user's email
    if (auth.currentUser) {
      setCurrentUserEmail(auth.currentUser.email);
    }

    const reportsRef = ref(database, "incidents");

    // Handler to update the state with new reports
    const handleReportsUpdate = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reportsArray = [];
        for (let id in data) {
          reportsArray.push({ id, ...data[id] });
        }
        setReports(reportsArray);
      }
    };

    const unsubscribe = onValue(reportsRef, handleReportsUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDeleteReport = (reportId, reportOwnerUid) => {
    if (currentUserEmail === reportOwnerUid) {
      // Assuming reportOwnerUid is the email here
      remove(ref(database, `incidents/${reportId}`))
        .then(() => {
          console.log("Report deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting report: ", error);
        });
    } else {
      alert("You do not have permission to delete this report.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 to-purple-100 flex flex-col p-8">
      <h2 className="text-3xl font-bold text-purple-700 mb-4">Reports Log</h2>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {reports.length > 0 ? (
          <ul>
            {reports.map((report) => (
              <li
                key={report.id}
                className="mb-4 p-4 border border-gray-300 rounded"
              >
                <p>
                  <strong>Address:</strong> {report.address}
                </p>
                <p>
                  <strong>Description:</strong> {report.description}
                </p>
                <p>
                  <strong>Timestamp:</strong>{" "}
                  {new Date(report.timestamp).toLocaleString()}
                </p>
                {currentUserEmail === report.ownerUid && (
                  <button
                    onClick={() =>
                      handleDeleteReport(report.id, report.ownerUid)
                    }
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete Report
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reports available.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsLog;
