import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import socket from './socket';
import MapComponent from './MapCompnent'; // Make sure this import is correct
import "./HomePage.css";

const HomePage = () => {
  const location = useLocation();
  const { driverId, name, vehicleId, areaId, areaName, driverImage } = location.state;
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationCount, setLocationCount] = useState(0);

  useEffect(() => {
    window.sendLocation = (lat, lon) => {
      setLatitude(lat);
      setLongitude(lon);
      sendLocationToServer(lat, lon);
    };
  }, []);

  const sendLocationToServer = (lat, lon) => {
    console.log('Got Location Successfully! Latitude:', lat, 'Longitude:', lon);
    setLocationCount(prevCount => prevCount + 1);
    socket.emit('coordinatesUpdated', { vehicleId, latitude: lat, longitude: lon });
  };

  return (
    <div className="container">
      <div className="mapContainer">
        <MapComponent latitude={latitude} longitude={longitude} areaId={areaId} driverId={driverId} vehicleId={vehicleId}/>
      </div>
      <div className="sidebar">
        <img src={driverImage} alt="Driver" className="profileImage" />
        <div className="profileInfo">
          <h1 className="heading">Welcome, {name}</h1>
          <p><b>Vehicle ID:</b> <span className='display-text'> {vehicleId}</span> </p>
          <p><b>Area:</b>  <span className='display-text'> {areaName} </span></p>
        </div>
      </div>
      <div className="coordinatesContainer">
        <div className="coordinates">Lat: {latitude} || Long: {longitude}</div>
        <div className="coordinates">Location Sent: {locationCount} times!</div>
      </div>
    </div>
  );
};

export default HomePage;
