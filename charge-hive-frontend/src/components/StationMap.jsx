import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";


import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function StationMap({ stations, center = null, currentLocation = null }) {
    // If there are no stations, set fallback map center (e.g. Delhi, India)
    const defaultPosition = [28.6139, 77.2090];

    // Use first station as map center if exists
    const mapCenter = center
        ? center
        : (stations && stations.length
            ? [stations[0].latitude, stations[0].longitude]
            : defaultPosition);

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6 z-0">
            <h2 className="text-lg font-semibold mb-3">Station Map</h2>
            <div className="h-64 w-full rounded overflow-hidden">
                <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                    <FitToMarkers stations={stations} currentLocation={currentLocation} />
                    <TileLayer
                        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {stations.map(station => (
                        <Marker position={[station.latitude, station.longitude]} key={station.id}>
                            <Popup>
                                <div>
                                    <div className="font-semibold">{station.name}</div>
                                    <div className="text-xs text-gray-700">{station.location}</div>
                                    <div className="text-xs">Chargers: {station.chargers}</div>
                                    <div className="text-xs">
                                        <span className={station.status === 'Online' ? "text-green-600" : "text-red-600"}>
                                            {station.status}
                                        </span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                    {currentLocation && (
                        <Marker position={currentLocation}>
                            <Popup>
                                <div className="text-sm font-medium">You are here</div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}

function FitToMarkers({ stations, currentLocation }) {
    const map = useMap();
    useEffect(() => {
        const points = [];
        if (Array.isArray(stations)) {
            stations.forEach(s => {
                if (typeof s?.latitude === 'number' && typeof s?.longitude === 'number') {
                    points.push([s.latitude, s.longitude]);
                }
            });
        }
        if (currentLocation && Array.isArray(currentLocation)) {
            points.push(currentLocation);
        }
        if (points.length === 1) {
            map.setView(points[0], 14);
        } else if (points.length > 1) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
        }
    }, [stations, currentLocation, map]);
    return null;
}

export default StationMap;

