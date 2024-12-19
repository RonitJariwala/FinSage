import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 

const MapComponent = () => {
  const position = [19.1145, 72.8502];

  return (
    <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
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