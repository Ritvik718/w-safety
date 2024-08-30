// LeafletMap.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";

const LeafletMap = () => {
  const defaultPosition = {
    lat: 37.7749, // Default location (San Francisco)
    lng: -122.4194,
  };

  const [position, setPosition] = useState(defaultPosition);
  const [hasLocation, setHasLocation] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setHasLocation(true);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setHasLocation(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setHasLocation(false);
    }
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const incidentsRef = ref(db, "incidents");

    onValue(incidentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const currentTime = Date.now();
        const filteredIncidents = Object.entries(data)
          .filter(([key, incident]) => {
            const incidentAge = currentTime - incident.timestamp;
            if (incidentAge < 168 * 60 * 60 * 1000) {
              // Check if incident is less than 7 days old
              return true;
            } else {
              // Remove expired incident from the database
              remove(ref(db, `incidents/${key}`));
              return false;
            }
          })
          .map(([key, incident]) => incident);

        setIncidents(filteredIncidents);
      }
    });
  }, []);

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (position && position.lat && position.lng) {
        map.setView([position.lat, position.lng], 13);
      }
    }, [position, map]);

    return null;
  };

  const reportIncident = () => {
    setShowForm(true);
  };

  const submitReport = () => {
    const db = getDatabase();
    const incidentsRef = ref(db, "incidents");
    push(incidentsRef, {
      lat: position.lat,
      lng: position.lng,
      address,
      description,
      timestamp: Date.now(),
    });

    // Optionally, trigger a notification here if addNotification is available
    // addNotification({ lat: position.lat, lng: position.lng, address, description });

    setAddress("");
    setDescription("");
    setShowForm(false);
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[position.lat, position.lng]} />
        {incidents.map((incident, index) => (
          <Circle
            key={index}
            center={[incident.lat, incident.lng]}
            radius={100} // 100m radius
            color="red"
          />
        ))}
        <MapUpdater />
      </MapContainer>
      <button
        onClick={reportIncident}
        className="bg-red-600 text-white px-4 py-2 rounded absolute bottom-4 left-4 z-[1000]"
      >
        Report Incident
      </button>
      {showForm && (
        <div className="absolute top-16 left-4 bg-white p-4 shadow-lg rounded z-[1001]">
          <h3 className="text-xl mb-2">Report Incident</h3>
          <label className="block mb-2">
            Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </label>
          <label className="block mb-2">
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </label>
          <button
            onClick={submitReport}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Submit
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default LeafletMap;
