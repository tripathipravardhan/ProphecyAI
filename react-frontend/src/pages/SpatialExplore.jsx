import { useSearchParams, useNavigate } from 'react-router-dom';
import SpatialExplorer from '../components/SpatialExplorer';
import { demoProperties } from '../data/demoProperties';

export default function SpatialExplore() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyId = searchParams.get('property');
  
  let location = { lat: 28.627, lng: 77.362, label: 'Sector 62, Noida' }; // Default fallback
  
  if (propertyId) {
    const demo = demoProperties.find(p => p.id === propertyId);
    if (demo) {
      location = { lat: demo.latitude, lng: demo.longitude, label: demo.name };
    }
  }

  return (
    <div style={{ height: 'calc(100vh - 64px)', width: '100%', position: 'relative' }}>
      <SpatialExplorer location={location} onFallback={() => navigate(-1)} />
    </div>
  );
}
