// import {
//   GoogleMap,
//   Marker,
//   Polyline,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import PropTypes from "prop-types";
// import { useEffect, useState } from "react";
// import styled from "styled-components";

// const containerStyle = {
//   width: "100%",
//   height: "80vh",
// };

// const NoDustbinMessage = styled.div`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   color: #ff0000;
//   background: rgba(255, 255, 255, 0.9);
//   padding: 1.5rem;
//   border-radius: 0.5rem;
//   box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
//   text-align: center;
//   font-size: 1rem;
//   font-weight: bold;
//   z-index: 1000;
//   animation: fadeIn 0.5s ease;

//   @keyframes fadeIn {
//     from {
//       opacity: 0;
//     }
//     to {
//       opacity: 1;
//     }
//   }
// `;

// const MapComponent = ({ latitude, longitude, areaId }) => {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
//   });

//   const [map, setMap] = useState(null);
//   const [center, setCenter] = useState({ lat: 23.0654247, lng: 87.3026587 });
//   const [coordinates, setCoordinates] = useState([]);
//   const [polylinePath, setPolylinePath] = useState([]);
//   const [dustbins, setDustbins] = useState([]);

//   // console.log(latitude,longitude)

//   useEffect(() => {
//     if (latitude && longitude) {
//       setCoordinates((prevCoords) => [
//         ...prevCoords,
//         { latitude: latitude, longitude: longitude },
//       ]);
//       setPolylinePath((prevPath) => [
//         ...prevPath,
//         { latitude: latitude, longitude: longitude },
//       ]);
//     }
//   }, [latitude, longitude]);

//   useEffect(() => {
//     const fetchCoordinates = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           `https://garbage-tracking-backend.onrender.com/dustbins/get-middleCoordinates/${areaId}`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch predefined points");
//         }

//         const data = await response.json();
//         setDustbins(data);
//         if (data.length > 0) {
//           const firstDustbin = data[0].middleCoordinates;
//           setCenter({
//             lat: firstDustbin.latitude,
//             lng: firstDustbin.longitude,
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching predefined points:", error);
//       }
//     };

//     fetchCoordinates();
//   }, [areaId]);

//   const onLoad = (map) => setMap(map);
//   const onUnmount = () => setMap(null);

//   const createSvgMarker = (position, isVisited) => {
//     const icon = {
//       url:
//         "data:image/svg+xml;charset=UTF-8," +
//         encodeURIComponent(`
//            <svg fill="${
//              isVisited ? "#00FF00" : "#FF0000"
//            }" width="64px" height="64px" viewBox="-93.95 -93.95 596.38 596.38" xmlns="http://www.w3.org/2000/svg">
//              <g><path d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316H74.043L87.748,388.784zM247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329zM189.216,171.329c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329zM130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"></path></g>
//            </svg>
//       `),
//       scaledSize: new window.google.maps.Size(40, 40),
//       anchor: new window.google.maps.Point(25, 25),
//     };

//     return (
//       <Marker
//         key={`${position.lat}-${position.lng}`}
//         position={position}
//         icon={icon}
//       />
//     );
//   };

//   const createVehicleSvgMarker = (position) => {
//     const icon = {
//       url:
//         "data:image/svg+xml;charset=UTF-8," +
//         encodeURIComponent(`
//         <svg width="64px" height="64px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ff0000"><g><path d="M3 5.25C3 4.00736 4.00736 3 5.25 3H18.75C19.9926 3 21 4.00736 21 5.25V18.75C21 19.1642 20.6642 19.5 20.25 19.5H19.25V11.25C19.25 11.1406 19.238 11.0314 19.2143 10.9246L18.4753 7.59921C18.1703 6.2266 16.9528 5.25 15.5467 5.25H8.45326C7.04716 5.25 5.82972 6.2266 5.5247 7.59921L4.78572 10.9246C4.76198 11.0314 4.75 11.1406 4.75 11.25V19.5H3.75C3.33579 19.5 3 19.1642 3 18.75V5.25Z" fill="#37ff00"></path></g></svg>
//       `),
//       scaledSize: new window.google.maps.Size(40, 40),
//       anchor: new window.google.maps.Point(25, 25),
//     };

//     return (
//       <Marker
//         key={`${position.latitude}-${position.longitude}`}
//         position={position}
//         icon={icon}
//       />
//     );
//   };

//   return isLoaded ? (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={center}
//       zoom={18}
//       onLoad={onLoad}
//       onUnmount={onUnmount}
//     >
//       {dustbins.length > 0 ? (
//         dustbins.map((dustbin) =>
//           createSvgMarker(
//             {
//               lat: dustbin.middleCoordinates.latitude,
//               lng: dustbin.middleCoordinates.longitude,
//             },
//             dustbin.isVisited
//           )
//         )
//       ) : (
//         <NoDustbinMessage>No dustbins available in the area.</NoDustbinMessage>
//       )}

//       {latitude !== null &&
//         longitude !== null &&
//         createVehicleSvgMarker(coordinates)}

//       <Polyline
//         path={polylinePath}
//         options={{
//           strokeColor: "#0BDE00",
//           strokeWeight: 5,
//         }}
//       />
//     </GoogleMap>
//   ) : null;
// };
// MapComponent.propTypes = {
//   latitude: PropTypes.number.isRequired,
//   longitude: PropTypes.number.isRequired,
//   areaId: PropTypes.string.isRequired,
//   driverId: PropTypes.string,
//   vehicleId: PropTypes.string,
// };

// export default MapComponent;


import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styled from "styled-components";

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const NoDustbinMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff0000;
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  z-index: 1000;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const MapComponent = ({ latitude, longitude, areaId }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 23.0654247, lng: 87.3026587 });
  const [coordinates, setCoordinates] = useState([]);
  const [polylinePath, setPolylinePath] = useState([]);
  const [dustbins, setDustbins] = useState([]);

  useEffect(() => {
    if (latitude && longitude) {
      const newCoordinate = { lat: latitude, lng: longitude };
      setCoordinates((prevCoords) => [...prevCoords, newCoordinate]);
      setPolylinePath((prevPath) => [...prevPath, newCoordinate]);
    }
  }, [latitude, longitude]);

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
        setDustbins(data);
        if (data.length > 0) {
          const firstDustbin = data[0].middleCoordinates;
          setCenter({
            lat: firstDustbin.latitude,
            lng: firstDustbin.longitude,
          });
        }
      } catch (error) {
        console.error("Error fetching predefined points:", error);
      }
    };

    fetchCoordinates();
  }, [areaId]);

  const onLoad = (map) => setMap(map);
  const onUnmount = () => setMap(null);

  const createSvgMarker = (position, isVisited) => {
    const icon = {
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
            <svg fill="${
              isVisited ? "#00FF00" : "#FF0000"
            }" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="-93.95 -93.95 596.38 596.38" xml:space="preserve" stroke="${
          isVisited ? "#00FF00" : "#FF0000"
        }" stroke-width="11.846006999999998"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(0,0), scale(1)"><rect x="-93.95" y="-93.95" width="596.38" height="596.38" rx="298.19" fill="#000000" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#000000" stroke-width="9.803592"> <g> <g> <path d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316 H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293 c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329 c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355 c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356 c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"></path> <path d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916 c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z"></path> </g> </g> </g></svg>
      `),
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(25, 25),
    };

    return (
      <Marker
        key={`${position.lat}-${position.lng}`}
        position={position}
        icon={icon}
      />
    );
  };

  const createVehicleSvgMarker = (position) => {
    const icon = {
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
          <svg width="64px" height="64px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ff0000" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-2.4" y="-2.4" width="28.80" height="28.80" rx="14.4" fill="#000000" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 5.25C3 4.00736 4.00736 3 5.25 3H18.75C19.9926 3 21 4.00736 21 5.25V18.75C21 19.1642 20.6642 19.5 20.25 19.5H19.25V11.25C19.25 11.1406 19.238 11.0314 19.2143 10.9246L18.4753 7.59921C18.1703 6.2266 16.9528 5.25 15.5467 5.25H8.45326C7.04716 5.25 5.82972 6.2266 5.5247 7.59921L4.78572 10.9246C4.76198 11.0314 4.75 11.1406 4.75 11.25V19.5H3.75C3.33579 19.5 3 19.1642 3 18.75V5.25Z" fill="#37ff00"></path> <path d="M8.45326 6C7.39869 6 6.48561 6.73245 6.25684 7.76191L5.51786 11.0873C5.50599 11.1407 5.5 11.1953 5.5 11.25V20.25C5.5 21.2165 6.2835 22 7.25 22H8.75C9.7165 22 10.5 21.2165 10.5 20.25V19.5H13.5V20.25C13.5 21.2165 14.2835 22 15.25 22H16.75C17.7165 22 18.5 21.2165 18.5 20.25V11.25C18.5 11.1953 18.494 11.1407 18.4821 11.0873L17.7432 7.76191C17.5144 6.73245 16.6013 6 15.5467 6H8.45326ZM7.72112 8.0873C7.79737 7.74415 8.10173 7.5 8.45326 7.5H15.5467C15.8983 7.5 16.2026 7.74415 16.2789 8.0873L16.815 10.5H7.18496L7.72112 8.0873ZM7 20.25V19.5H9V20.25C9 20.3881 8.88807 20.5 8.75 20.5H7.25C7.11193 20.5 7 20.3881 7 20.25ZM17 19.5V20.25C17 20.3881 16.8881 20.5 16.75 20.5H15.25C15.1119 20.5 15 20.3881 15 20.25V19.5H17ZM10.75 16.5H13.25C13.6642 16.5 14 16.8358 14 17.25C14 17.6642 13.6642 18 13.25 18H10.75C10.3358 18 10 17.6642 10 17.25C10 16.8358 10.3358 16.5 10.75 16.5ZM10.0054 14C10.0054 14.5523 9.55766 15 9.00537 15C8.45309 15 8.00537 14.5523 8.00537 14C8.00537 13.4477 8.45309 13 9.00537 13C9.55766 13 10.0054 13.4477 10.0054 14ZM14.9998 15C14.4475 15 13.9998 14.5523 13.9998 14C13.9998 13.4477 14.4475 13 14.9998 13C15.552 13 15.9998 13.4477 15.9998 14C15.9998 14.5523 15.552 15 14.9998 15Z" fill="#37ff00"></path> </g></svg>
      `),
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(25, 25),
    };

    return (
      <Marker
        key={`${position.lat}-${position.lng}`}
        position={position}
        icon={icon}
      />
    );
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={18}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {dustbins.length > 0 ? (
        dustbins.map((dustbin) =>
          createSvgMarker(
            {
              lat: dustbin.middleCoordinates.latitude,
              lng: dustbin.middleCoordinates.longitude,
            },
            dustbin.isVisited
          )
        )
      ) : (
        <NoDustbinMessage>No dustbins available in the area.</NoDustbinMessage>
      )}

      {coordinates.length > 0 &&
        createVehicleSvgMarker(coordinates[coordinates.length - 1])}

      <Polyline
        path={polylinePath}
        options={{
          strokeColor: "#0BDE00",
          strokeWeight: 5,
        }}
      />
    </GoogleMap>
  ) : null;
};

MapComponent.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  areaId: PropTypes.string.isRequired,
};

export default MapComponent;
