import { useEffect, useRef, useState } from 'react';
import { findDemoProperty } from '../data/demoProperties';

const colors = {
  Metro: '#66d8ea', Railway: '#a78bfa', 'Bus stop': '#f5b971', Hospital: '#f37e7e', Clinic: '#f3a5a5',
  Education: '#7dd3a8', Pharmacy: '#7dd3a8', Market: '#f4cf73', Police: '#8ab4f8',
};
const distance = (value) => value < 1 ? `${Math.round(value * 1000)} m` : `${value.toFixed(1)} km`;

let cesiumPromise;
function loadCesium() {
  if (window.Cesium) return Promise.resolve(window.Cesium);
  if (cesiumPromise) return cesiumPromise;
  cesiumPromise = new Promise((resolve, reject) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/cesium@1.115.0/Build/Cesium/Widgets/widgets.css';
    document.head.appendChild(css);
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/cesium@1.115.0/Build/Cesium/Cesium.js';
    script.async = true;
    script.onload = () => window.Cesium ? resolve(window.Cesium) : reject(new Error('Cesium unavailable'));
    script.onerror = () => reject(new Error('Cesium unavailable'));
    document.head.appendChild(script);
  });
  return cesiumPromise;
}

export default function SpatialExplorer({ location, onFallback }) {
  const host = useRef(null);
  const viewerRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [places, setPlaces] = useState([]);
  const [filter, setFilter] = useState('All');
  const [mapMode, setMapMode] = useState('standard');
  const demo = findDemoProperty(location.lat, location.lng);

  useEffect(() => {
    let disposed = false;
    const load = async () => {
      try {
        const params = new URLSearchParams({ latitude: location.lat, longitude: location.lng });
        const response = await fetch(`http://127.0.0.1:8000/nearby-amenities?${params}`);
        const data = await response.json();
        if (!response.ok || !data.available) throw new Error('Amenity data unavailable');
        if (!disposed) setPlaces(data.places || []);
      } catch {
        if (!disposed) setStatus('data-error');
      }
    };
    load();
    return () => { disposed = true; };
  }, [location.lat, location.lng]);

  useEffect(() => {
    if (!host.current) return undefined;
    let disposed = false;
    const initialise = async () => {
      try {
        const Cesium = await loadCesium();
        if (disposed) return;
        const viewer = new Cesium.Viewer(host.current, {
        animation: false, baseLayerPicker: false, geocoder: false, homeButton: false, infoBox: false,
        sceneModePicker: false, selectionIndicator: false, timeline: false, navigationHelpButton: false,
        fullscreenButton: false, terrain: undefined,
      });
        viewer.imageryLayers.removeAll();
        viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({ url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c'] }));
        viewer.scene.globe.depthTestAgainstTerrain = false;
        viewerRef.current = viewer;
        setStatus('ready');
        viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(location.lng, location.lat - 0.008, 1250), orientation: { heading: 0, pitch: Cesium.Math.toRadians(-42), roll: 0 }, duration: 1.4 });
      } catch {
        if (!disposed) {
          setStatus('scene-error');
          onFallback?.();
        }
      }
    };
    initialise();
    return () => { disposed = true; viewerRef.current?.destroy(); viewerRef.current = null; };
  }, [location.lat, location.lng, onFallback]);

  useEffect(() => {
    const Cesium = window.Cesium;
    const viewer = viewerRef.current;
    if (!Cesium || !viewer || status !== 'ready') return;
    
    viewer.entities.removeAll();
    const propertyPosition = Cesium.Cartesian3.fromDegrees(location.lng, location.lat, 0);
    
    // Property Digital Twin (Building context)
    viewer.entities.add({ 
      position: propertyPosition, 
      name: location.label, 
      box: { 
        dimensions: new Cesium.Cartesian3(45, 35, 60), 
        material: Cesium.Color.fromCssColorString('#62d4e4').withAlpha(.85), 
        outline: true, 
        outlineColor: Cesium.Color.WHITE 
      }, 
      label: { 
        text: demo ? `${demo.name}` : 'SELECTED PROPERTY', 
        font: '600 13px sans-serif', 
        fillColor: Cesium.Color.WHITE, 
        outlineColor: Cesium.Color.fromCssColorString('#06242b'), 
        outlineWidth: 4, 
        style: Cesium.LabelStyle.FILL_AND_OUTLINE, 
        pixelOffset: new Cesium.Cartesian2(0, -60) 
      } 
    });
    
    // Proximity Rings
    const addRing = (radius, opacity) => {
      viewer.entities.add({ 
        position: propertyPosition, 
        ellipse: { 
          semiMajorAxis: radius, 
          semiMinorAxis: radius, 
          material: Cesium.Color.fromCssColorString('#62d4e4').withAlpha(opacity), 
          outline: true, 
          outlineColor: Cesium.Color.fromCssColorString('#62d4e4').withAlpha(opacity * 2), 
          height: 1 
        } 
      });
    };
    
    addRing(250, 0.05); // 250m ring
    addRing(500, 0.03); // 500m ring
    addRing(1000, 0.01); // 1km ring

    // Mapping API types to UI categories
    const categoryMap = {
      'Metro': 'Connectivity', 'Railway': 'Connectivity', 'Bus stop': 'Connectivity',
      'Hospital': 'Healthcare', 'Clinic': 'Healthcare', 'Pharmacy': 'Healthcare',
      'Education': 'Education',
      'Market': 'Daily Life', 'Police': 'Infrastructure'
    };

    places.forEach((place) => {
      const cat = categoryMap[place.type] || 'All';
      const isVisible = filter === 'All' || filter === cat;
      
      if (!isVisible) return;

      const poiPosition = Cesium.Cartesian3.fromDegrees(place.longitude, place.latitude, 2);
      const color = Cesium.Color.fromCssColorString(colors[place.type] || '#ffffff');
      
      // POI Marker
      viewer.entities.add({ 
        position: poiPosition, 
        point: { pixelSize: 12, color, outlineColor: Cesium.Color.WHITE, outlineWidth: 2 }, 
        label: { 
          text: `${place.type}\n${distance(place.distance_km)}`, 
          font: 'bold 12px sans-serif', 
          fillColor: Cesium.Color.WHITE, 
          outlineColor: Cesium.Color.BLACK, 
          outlineWidth: 3, 
          style: Cesium.LabelStyle.FILL_AND_OUTLINE, 
          pixelOffset: new Cesium.Cartesian2(0, -25) 
        }, 
        // Spatial Relationship Line (Animated/Dash)
        polyline: { 
          positions: [propertyPosition, poiPosition], 
          width: 2, 
          material: new Cesium.PolylineDashMaterialProperty({ 
            color, 
            dashLength: 16,
            dashPattern: 255
          }) 
        } 
      });
    });
  }, [places, filter, location, demo, status]);

  const displayCategories = ['All', 'Connectivity', 'Healthcare', 'Education', 'Daily Life'];
  
  useEffect(() => {
    const Cesium = window.Cesium;
    const viewer = viewerRef.current;
    if (!Cesium || !viewer || status !== 'ready') return;
    
    viewer.imageryLayers.removeAll();
    if (mapMode === 'satellite') {
      viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      }));
    } else {
      viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({ 
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
        subdomains: ['a', 'b', 'c'] 
      }));
    }
  }, [mapMode, status]);

  return (
    <section className="spatial-explorer" aria-label="3D spatial explorer" style={{ height: '100%', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: 'rgba(21, 27, 35, 0.9)', padding: '15px', borderRadius: '8px', border: '1px solid #27303b', width: '220px', pointerEvents: 'auto' }}>
        <div style={{ marginBottom: '10px' }}>
          <span className="eyebrow" style={{ color: '#62d4e4', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>3D Spatial Web</span>
          <b style={{ display: 'block', color: '#fff', fontSize: '14px' }}>{demo ? 'Demonstration property context' : '3D building context'}</b>
        </div>
        
        {/* Map View Toggle */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', background: '#0e1217', padding: '4px', borderRadius: '6px', border: '1px solid #27303b' }}>
          <button 
            onClick={() => setMapMode('standard')} 
            style={{ flex: 1, padding: '4px', borderRadius: '4px', background: mapMode === 'standard' ? '#27303b' : 'transparent', color: mapMode === 'standard' ? '#fff' : '#8d9aa8', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
            Street
          </button>
          <button 
            onClick={() => setMapMode('satellite')} 
            style={{ flex: 1, padding: '4px', borderRadius: '4px', background: mapMode === 'satellite' ? '#27303b' : 'transparent', color: mapMode === 'satellite' ? '#fff' : '#8d9aa8', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
            Satellite
          </button>
        </div>

        <div className="explorer-filters" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '100%', justifyContent: 'flex-start' }}>
          {displayCategories.map((category) => (
            <button 
              key={category} 
              className={filter === category ? 'selected' : ''} 
              onClick={() => setFilter(category)}
              style={{ padding: '6px 12px', background: filter === category ? '#62d4e4' : '#27303b', color: filter === category ? '#06242b' : '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {status === 'loading' && <div className="explorer-message" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, color: '#fff', background: '#151b23', padding: '1rem', borderRadius: '8px' }}>Loading 3D building context…</div>}
      {status === 'data-error' && <div className="explorer-message" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, color: '#f37e7e', background: '#151b23', padding: '1rem', borderRadius: '8px' }}>3D view is available, but nearby-place data did not load.</div>}
      {status === 'scene-error' && <div className="explorer-message" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, color: '#f37e7e', background: '#151b23', padding: '1rem', borderRadius: '8px' }}>3D view unavailable.</div>}
      
      <div ref={host} className="cesium-host" style={{ flex: 1, width: '100%' }} />
    </section>
  );
}
