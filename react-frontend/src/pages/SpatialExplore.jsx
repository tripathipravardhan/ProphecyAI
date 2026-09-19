import { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import SpatialExplorer from '../components/SpatialExplorer';
import { demoProperties } from '../data/demoProperties';

export default function SpatialExplore() {
  const [searchParams] = useSearchParams();
  const routeState = useLocation().state;
  const navigate = useNavigate();

  const getInitialLocation = () => {
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const labelParam = searchParams.get('label');
    const propertyId = searchParams.get('property');

    if (routeState?.location) return routeState.location;
    if (latParam && lngParam) {
      return {
        lat: Number(latParam),
        lng: Number(lngParam),
        label: labelParam ? decodeURIComponent(labelParam) : 'Selected Location'
      };
    }
    if (propertyId) {
      const demo = demoProperties.find(p => p.id === propertyId);
      if (demo) return { lat: demo.latitude, lng: demo.longitude, label: demo.name };
    }
    try {
      const saved = localStorage.getItem('prophecy_active_location');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore parse error
    }
    return { lat: 28.627, lng: 77.362, label: 'Sector 62, Noida' };
  };

  const [activeLocation, setActiveLocation] = useState(getInitialLocation);

  // Sync state if route parameters change
  useEffect(() => {
    const newLoc = getInitialLocation();
    setActiveLocation(newLoc);
  }, [searchParams, routeState]);

  const handleLocationChange = (newLoc) => {
    setActiveLocation(newLoc);
    localStorage.setItem('prophecy_active_location', JSON.stringify(newLoc));
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '100%', position: 'relative' }}>
      <SpatialExplorer 
        location={activeLocation} 
        onLocationChange={handleLocationChange} 
        onFallback={() => navigate(-1)} 
      />
    </div>
  );
}
