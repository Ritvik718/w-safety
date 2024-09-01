import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue, remove } from "firebase/database";

const ReportsLog = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const reportRef = ref(database, "incidents");
    onValue(reportRef, (snapshot) => {
      const data = snapshot.val();
      const reportsArray = data
        ? Object.entries(data).map(([id, report]) => ({ id, ...report }))
        : [];
      setReports(reportsArray);
    });
  }, []);

  const handleDelete = (id) => {
    const reportRef = ref(database, `incidents/${id}`);
    remove(reportRef)
      .then(() => {
        alert("Report deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting report: ", error);
      });
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
                className="mb-4 p-4 border border-gray-300 rounded flex justify-between items-center"
              >
                <div>
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
                </div>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="text-red-600 hover:text-red-800 ml-4"
                >
                  Delete
                </button>
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
