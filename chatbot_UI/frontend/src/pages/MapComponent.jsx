import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Define custom Leaflet icon
const customIcon = new L.Icon({
  iconUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Default Leaflet icon size
  iconAnchor: [12, 41], // Anchors the icon to the correct position
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent = () => {
  const position = [19.1145, 72.8502];

  return (
    <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Apply custom icon to Marker */}
      <Marker position={position} icon={customIcon}>
        <Popup>
          <b>DJ Sanghvi College of Engineering</b>
          <br />
          This is the location of DJ Sanghvi College of Engineering, Mumbai.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
