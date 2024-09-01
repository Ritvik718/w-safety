import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";
import L from "leaflet";

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
  const [places, setPlaces] = useState([]);

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

  // New data
  const providedPlaces = [
    {
      area: "Kattankulathur",
      zone: "SRM Institute of Science and Technology",
      isSafe: true,
      coordinates: [12.7985, 80.039],
    },
    {
      area: "Kattankulathur",
      zone: "Bharath University",
      isSafe: false,
      coordinates: [12.802, 80.07],
    },
    {
      area: "Kattankulathur",
      zone: "Chengalpattu",
      isSafe: true,
      coordinates: [12.7988, 80.0592],
    },
    {
      area: "Kattankulathur",
      zone: "SIPCOT",
      isSafe: false,
      coordinates: [12.805, 80.065],
    },
    {
      area: "Kattankulathur",
      zone: "Muthamil Nagar",
      isSafe: true,
      coordinates: [12.8, 80.06],
    },
    {
      area: "Kattankulathur",
      zone: "Kandigai",
      isSafe: false,
      coordinates: [12.81, 80.075],
    },
    {
      area: "Potheri",
      zone: "Potheri Village",
      isSafe: true,
      coordinates: [12.8232, 80.0786],
    },
    {
      area: "Potheri",
      zone: "Sree Perumal Koil",
      isSafe: false,
      coordinates: [12.825, 80.08],
    },
    {
      area: "Potheri",
      zone: "Sathangadu",
      isSafe: true,
      coordinates: [12.82, 80.085],
    },
    {
      area: "Potheri",
      zone: "Ranganathapuram",
      isSafe: false,
      coordinates: [12.83, 80.09],
    },
    {
      area: "Guduvancheri",
      zone: "Guduvancheri Town",
      isSafe: false,
      coordinates: [12.8495, 80.1422],
    },
    {
      area: "Guduvancheri",
      zone: "Thirumazhisai",
      isSafe: true,
      coordinates: [12.855, 80.15],
    },
    {
      area: "Guduvancheri",
      zone: "Kumarasamy Nagar",
      isSafe: false,
      coordinates: [12.848, 80.14],
    },
    {
      area: "Guduvancheri",
      zone: "Nellikuppam",
      isSafe: true,
      coordinates: [12.85, 80.145],
    },
    {
      area: "Guduvancheri",
      zone: "Perungalathur",
      isSafe: false,
      coordinates: [12.853, 80.155],
    },
    {
      area: "Maraimalai Nagar",
      zone: "Maraimalai Nagar Town",
      isSafe: true,
      coordinates: [12.752, 80.032],
    },
    {
      area: "Maraimalai Nagar",
      zone: "SIPCOT Industrial Area",
      isSafe: false,
      coordinates: [12.755, 80.04],
    },
    {
      area: "Maraimalai Nagar",
      zone: "Aditya Nagar",
      isSafe: true,
      coordinates: [12.748, 80.02],
    },
    {
      area: "Maraimalai Nagar",
      zone: "Kalamadai",
      isSafe: false,
      coordinates: [12.75, 80.025],
    },
  ];

  useEffect(() => {
    setPlaces(providedPlaces);
  }, []);

  const isValidLatLng = (lat, lng) =>
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (isValidLatLng(position.lat, position.lng)) {
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

    setAddress("");
    setDescription("");
    setShowForm(false);
  };

  const validIncidents = incidents.filter((incident) =>
    isValidLatLng(incident.lat, incident.lng)
  );

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
        {isValidLatLng(position.lat, position.lng) && (
          <Marker position={[position.lat, position.lng]} />
        )}
        {validIncidents.map((incident, index) => (
          <Circle
            key={index}
            center={[incident.lat, incident.lng]}
            radius={100} // 100m radius
            color="red"
          />
        ))}
        {places.map((place, index) => (
          <React.Fragment key={index}>
            <Marker
              position={place.coordinates}
              icon={L.icon({
                iconUrl: place.isSafe
                  ? "https://example.com/safe-icon.png" // Replace with a valid URL for safe places
                  : "https://example.com/unsafe-icon.png", // Replace with a valid URL for unsafe places
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              })}
            >
              <Popup>
                <b>{place.zone}</b>
                <br />
                {place.isSafe ? "Safe" : "Unsafe"}
              </Popup>
            </Marker>
            <Circle
              center={place.coordinates}
              radius={400} // 100m radius
              color={place.isSafe ? "green" : "orange"}
              fillOpacity={0.3}
            />
          </React.Fragment>
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
