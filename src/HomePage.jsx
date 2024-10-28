import  { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./HomePage.css";
import MapComponent from "./MapCompnent"; // Corrected component name spelling
import socket from "./socket";

const HomePage = () => {
  const location = useLocation();
  const { driverId, name, vehicleId, areaId, areaName, driverImage } =
    location.state;
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationCount, setLocationCount] = useState(0);

  // Debounced function to send location to server
  const sendLocationToServer = useCallback(
    (lat, lon) => {
      console.log(
        "Got Location Successfully! Latitude:",
        lat,
        "Longitude:",
        lon
      );
      setLocationCount((prevCount) => prevCount + 1);
      socket.emit("coordinatesUpdated", {
        vehicleId,
        latitude: lat,
        longitude: lon,
      });
    },
    [vehicleId]
  );

  useEffect(() => {
    // Watch the user's position for real-time tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        sendLocationToServer(latitude, longitude);
      },
      (error) => {
        console.error("Error fetching location:", error.message);
      },
      {
        enableHighAccuracy: true, // Use high accuracy mode
        timeout: 5000, // Timeout for location request
        maximumAge: 10000, // Use a cached location if it's not older than 10 seconds
      }
    );

    return () => navigator.geolocation.clearWatch(watchId); // Cleanup watch on component unmount
  }, [sendLocationToServer]);

  return (
    <div className="container">
      <div className="mapContainer">
        <MapComponent
          latitude={latitude}
          longitude={longitude}
          areaId={areaId}
          driverId={driverId}
          vehicleId={vehicleId}
        />
      </div>
      <div className="sidebar">
        <img src={driverImage} alt="Driver" className="profileImage" />
        <div className="profileInfo">
          <h1 className="heading">Welcome, {name}</h1>
          <p>
            <b>Vehicle ID:</b> <span className="display-text">{vehicleId}</span>
          </p>
          <p>
            <b>Area:</b> <span className="display-text">{areaName}</span>
          </p>
        </div>
      </div>
      <div className="coordinatesContainer">
        <div className="coordinates">
          Lat: {latitude} || Long: {longitude}
        </div>
        <div className="coordinates">Location Sent: {locationCount} times!</div>
      </div>
    </div>
  );
};

export default HomePage;
