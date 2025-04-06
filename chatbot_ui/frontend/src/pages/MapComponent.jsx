import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Define a custom Leaflet icon
const customIcon = new L.Icon({
  iconUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],       // Default size for the Leaflet icon
  iconAnchor: [12, 41],     // Point of the icon which corresponds to marker's location
  popupAnchor: [1, -34],    // Point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41],
});

const MapComponent = () => {
  // Position for the marker (latitude, longitude)
  const position = [19.1145, 72.8502];

  return (
    <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Marker with custom icon */}
      <Marker position={position} icon={customIcon}>
        <Popup>
          <strong>DJ Sanghvi College of Engineering</strong>
          <br />
          This is the location of DJ Sanghvi College of Engineering, Mumbai.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
