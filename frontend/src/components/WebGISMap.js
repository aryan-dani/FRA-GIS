import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const getClaimColor = (claimType) => {
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
        background-color: #343a40; /* Dark grey color */
        width: 2rem;
        height: 2rem;
        border-radius: 50% 50% 50% 0;
        position: relative;
        transform: rotate(-45deg);
        border: 2px solid #FFFFFF;
        box-shadow: 0 4px 8px rgba(0,0,0,0.4);
    ">
      <div style="
        width: 0.8rem;
        height: 0.8rem;
        position: absolute;
        top: 5px;
        left: 5px;
        background: ${color};
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>`;

  return L.divIcon({
    className: "custom-div-icon",
    html: markerHtml,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
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
      style={{ height: "75vh", width: "100%" }}
      className="leaflet-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {validClaims.map((claim) => {
        const position = [claim.latitude, claim.longitude];
        const claimColor = getClaimColor(claim.claim_type);

        // Create a dummy polygon area around the claim point
        const areaSize = 0.01; // Adjust size as needed
        const polygon = [
          [position[0] - areaSize, position[1] - areaSize],
          [position[0] + areaSize, position[1] - areaSize],
          [position[0] + areaSize, position[1] + areaSize],
          [position[0] - areaSize, position[1] + areaSize],
        ];

        return (
          <React.Fragment key={claim.id}>
            <Marker position={position} icon={createMarkerIcon(claimColor)}>
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
            <Polygon
              pathOptions={{
                color: claimColor,
                fillColor: claimColor,
                fillOpacity: 0.3,
              }}
              positions={polygon}
            />
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}

export default WebGISMap;
