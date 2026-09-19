import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const pin = new L.Icon({ 
  iconUrl: '/custom-pin.jpeg', 
  iconSize: [34, 34], 
  iconAnchor: [17, 34] 
});

function MapViewport({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 0.8 });
  }, [center, map]);
  return null;
}

function PickableMarker({ location, onPick }) {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      // Immediately set coordinates
      onPick({ lat, lng, label: 'Selected map location' });

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.display_name) {
            const shortLabel = data.display_name.split(',').slice(0, 3).join(',');
            onPick({ lat, lng, label: shortLabel });
          }
        }
      } catch {
        // keep initial selected location label fallback
      }
    }
  });
  return <Marker position={location} icon={pin} />;
}

export default function GeoMap({ location, onPick, mode = 'satellite' }) {
  const isSatellite = mode === 'satellite';
  
  // Satellite Hybrid with full place names, towns, villages, roads & street labels
  const tileUrl = isSatellite 
    ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' 
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = isSatellite
    ? '&copy; Google Maps & CartoDB'
    : '&copy; OpenStreetMap contributors';

  return (
    <MapContainer 
      center={location} 
      zoom={13} 
      className="map" 
      style={{ height: '100%', width: '100%' }}
      aria-label="Interactive property location map"
    >
      <TileLayer 
        url={tileUrl} 
        attribution={attribution} 
        maxZoom={20}
      />
      {isSatellite && (
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
          maxZoom={20}
          subdomains="abcd"
        />
      )}
      <MapViewport center={location} />
      {onPick ? (
        <PickableMarker location={location} onPick={onPick} />
      ) : (
        <Marker position={location} icon={pin} />
      )}
    </MapContainer>
  );
}
