import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const getMarkerColor = (claimType) => {
  switch (claimType) {
    case "IFR":
      return "#0d6efd"; // Blue
    case "CR":
      return "#198754"; // Green
    case "CFR":
      return "#ffc107"; // Orange
    default:
      return "#6c757d"; // Grey
  }
};

const createMarkerIcon = (color) => {
  const markerHtml = `
    <div style="
        background-color: ${color};
        width: 2rem;
        height: 2rem;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #FFFFFF;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    ">
    </div>`;

  return L.divIcon({
    className: "custom-div-icon",
    html: markerHtml,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

function WebGISMap({ claims }) {
  const defaultPosition = [20.5937, 78.9629]; // Default center of India

  const validClaims = claims.filter(
    (claim) =>
      claim.latitude &&
      claim.longitude &&
      !isNaN(claim.latitude) &&
      !isNaN(claim.longitude)
  );

  return (
    <MapContainer
      center={defaultPosition}
      zoom={5}
      style={{ height: "40vh", width: "100%" }}
      className="leaflet-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {validClaims.map((claim) => (
        <Marker
          key={claim.id}
          position={[claim.latitude, claim.longitude]}
          icon={createMarkerIcon(getMarkerColor(claim.claim_type))}
        >
          <Popup>
            <strong>{claim.name || "N/A"}</strong>
            <br />
            Village: {claim.village || "N/A"}
            <br />
            District: {claim.district || "N/A"}
            <br />
            Claim Type: {claim.claim_type || "N/A"}
            <br />
            Status: {claim.status || "N/A"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default WebGISMap;
