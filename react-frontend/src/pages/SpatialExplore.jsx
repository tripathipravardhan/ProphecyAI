import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import SpatialExplorer from '../components/SpatialExplorer';
import { demoProperties } from '../data/demoProperties';

export default function SpatialExplore() {
  const [searchParams] = useSearchParams();
  const routeState = useLocation().state;
  const navigate = useNavigate();
  
  const propertyId = searchParams.get('property');
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');
  const labelParam = searchParams.get('label');
  
  let location = null;
  
  // 1. Direct router location state
  if (routeState?.location) {
    location = routeState.location;
  }
  // 2. Explicit latitude/longitude URL query params
  else if (latParam && lngParam) {
    location = {
      lat: Number(latParam),
      lng: Number(lngParam),
      label: labelParam ? decodeURIComponent(labelParam) : 'Selected Location'
    };
  }
  // 3. Demo property ID
  else if (propertyId) {
    const demo = demoProperties.find(p => p.id === propertyId);
    if (demo) {
      location = { lat: demo.latitude, lng: demo.longitude, label: demo.name };
    }
  }
  
  // 4. Active location saved in 2D map / Analyze selection
  if (!location) {
    try {
      const saved = localStorage.getItem('prophecy_active_location');
      if (saved) {
        location = JSON.parse(saved);
      }
    } catch {
      // ignore parse error
    }
  }
  
  // 5. Default fallback
  if (!location) {
    location = { lat: 28.627, lng: 77.362, label: 'Sector 62, Noida' };
  }

  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '100%', position: 'relative' }}>
      <SpatialExplorer location={location} onFallback={() => navigate(-1)} />
    </div>
  );
}
