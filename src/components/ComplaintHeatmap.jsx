// src/components/ComplaintHeatmap.jsx
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet.heat";
import { useEffect } from "react";

function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    const L = window.L;

    const heat = L.heatLayer(points, {
      radius: 40,
      blur: 25,
      maxZoom: 10,
      minOpacity: 0.4,
      gradient: {
        0.2: "green",
        0.4: "yellow",
        0.6: "orange",
        0.8: "red",
      },
    }).addTo(map);

    if (points.length) {
      const latlngs = points.map((p) => [p[0], p[1]]);
      map.fitBounds(latlngs, { padding: [30, 30] });
    }

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

export default function ComplaintHeatmap({ complaints }) {
  // Convert complaints into [lat, lng, weight]
  const points = complaints
    .filter((c) => c.location?.coordinates?.length === 2)
    .map((c) => [c.location.coordinates[1], c.location.coordinates[0], 0.7]);

  return (
    <div className="w-full h-72 rounded-xl overflow-hidden shadow">
      <MapContainer
        center={[22.9734, 78.6569]} // India center
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        />
        <HeatLayer points={points} />
      </MapContainer>
    </div>
  );
}
