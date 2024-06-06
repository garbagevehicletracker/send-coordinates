import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "80vh",
};

// eslint-disable-next-line react/prop-types
const MapComponent = ({ latitude, longitude, areaId, driverId, vehicleId }) => {
  console.log(vehicleId);
  console.log(latitude);
  console.log(longitude);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC8rsCM1PxiuuyL7FdtvXimGMSR-0dtkB0",
  });

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [center, setCenter] = useState({
    lat: 23.0654247,
    lng: 87.3026587,
  });
  const [coordinates, setCoordinates] = useState([]);
  const [polylinePath, setPolylinePath] = useState([]);
  console.log(coordinates);
  console.log(polylinePath);
console.log(areaId)
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://garbage-tracking-backend.onrender.com/dustbins/get-middleCoordinates/${areaId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch predefined points");
        }

        const data = await response.json();
        console.log("Fetched Data:", data); // Debug: Log the fetched data

        const markersData = data.map((point) => ({
          lat: point.middleCoordinates.latitude,
          lng: point.middleCoordinates.longitude,
        }));
        console.log("Markers Data:", markersData); // Debug: Log the markers data

        setMarkers(markersData);

        // Set center dynamically
        if (data.length > 0) {
          const firstMarker = data[0].middleCoordinates;
          setCenter({ lat: firstMarker.latitude, lng: firstMarker.longitude });
        }
      } catch (error) {
        console.error("Error fetching predefined points:", error);
      }
    };

    fetchCoordinates();
  }, [areaId]);

  useEffect(() => {
    // Update polyline path when coordinates change
    setPolylinePath(
      coordinates.map(() => ({
        lat: latitude,
        lng: longitude,
      }))
    );
  }, []);

  const onLoad = (map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={18}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {markers.map((position, index) => (
        <Marker
          key={index}
          position={position}
          onClick={() => handleMarkerClick(position)}
        />
      ))}

      <Polyline path={polylinePath} options={{ strokeColor: "#FF0000" }} />
    </GoogleMap>
  ) : null;
};

export default MapComponent;
