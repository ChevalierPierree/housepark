'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default Leaflet marker icons (Next.js asset issue)
const iconDefault = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapController({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

interface VillaMapProps {
  latitude: number;
  longitude: number;
  locationLabel: string;
}

export default function VillaMap({ latitude, longitude, locationLabel }: VillaMapProps) {
  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden border border-gray-100 relative">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {/* Cercle zone approx — comme Airbnb */}
        <Circle
          center={[latitude, longitude]}
          radius={400}
          pathOptions={{ color: '#055043', fillColor: '#b8cca1', fillOpacity: 0.25, weight: 1.5 }}
        />
        {/* Marker centré */}
        <Marker position={[latitude, longitude]} icon={iconDefault} />
        <MapController lat={latitude} lng={longitude} />
      </MapContainer>
      {/* Label en overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white shadow-lg rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 flex items-center gap-1.5 pointer-events-none">
        <span className="h-2 w-2 rounded-full bg-primary inline-block" />
        {locationLabel}
      </div>
    </div>
  );
}
