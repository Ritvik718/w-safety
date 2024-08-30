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

  // Fetch reported incidents from the database
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
              // Check if incident is less than 3 hours old
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
    const db = getDatabase();
    const incidentsRef = ref(db, "incidents");
    push(incidentsRef, {
      lat: position.lat,
      lng: position.lng,
      timestamp: Date.now(),
    });
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
    </div>
  );
};

export default LeafletMap;
