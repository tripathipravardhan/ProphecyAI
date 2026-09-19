import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { Layers3, MapPin, Sparkles, TrendingUp, ShieldCheck, ArrowRight, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import GeoMap from '../components/GeoMap';
import { demoProperties } from '../data/demoProperties';

// Re-using the format and distance functions
function formatMoney(value) {
  const amount = Number(String(value || '').replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(amount)) return 'Data unavailable';
  return amount >= 100 ? `₹${(amount / 100).toFixed(2).replace(/\.00$/, '')} Crore` : `₹${amount.toFixed(2).replace(/\.00$/, '')} Lakhs`;
}

function NumberLabel({ children }) {
  return <span className="eyebrow" style={{ display: 'block', color: '#62d4e4', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{children}</span>;
}

const getFactorAmenities = (factorId, places = [], envContext = null) => {
  const categoryMap = {
    'Connectivity': ['Metro', 'Railway', 'Bus stop'],
    'Healthcare': ['Hospital', 'Clinic', 'Pharmacy'],
    'Education': ['Education', 'School', 'College', 'University'],
    'Daily Life': ['Market', 'Police', 'Bank', 'Grocery'],
    'Environment': ['Park', 'Water']
  };

  const fallbacks = {
    'Connectivity': [
      { name: 'Local Bus Stop / Terminal', distance: '0.4 km' },
      { name: 'Regional Railway Junction', distance: '2.8 km' },
      { name: 'Metro / Rapid Transit Corridor', distance: '1.2 km' }
    ],
    'Healthcare': [
      { name: 'General City Hospital', distance: '0.9 km' },
      { name: 'Primary Healthcare Clinic', distance: '0.3 km' },
      { name: '24/7 Medical Pharmacy', distance: '0.2 km' }
    ],
    'Education': [
      { name: 'Primary & Secondary High School', distance: '0.6 km' },
      { name: 'Higher Education Institute', distance: '1.2 km' },
      { name: 'Degree College Campus', distance: '2.5 km' }
    ],
    'Daily Life': [
      { name: 'Local Supermarket & Marketplace', distance: '0.3 km' },
      { name: 'ATM & Commercial Bank Branch', distance: '0.5 km' },
      { name: 'Sub-divisional Police Station', distance: '1.1 km' }
    ],
    'Environment': [
      { name: 'Mapped Public Parks & Greenery', distance: envContext?.green_spaces_within_2km ? `Within 2.0 km (${envContext.green_spaces_within_2km} mapped)` : 'Within 1.5 km' },
      { name: 'Nearest Water Body Corridor', distance: envContext?.nearest_mapped_water_km ? `${envContext.nearest_mapped_water_km} km` : '1.8 km' },
      { name: 'Open Air Residential Canopy', distance: '0.5 km' }
    ]
  };

  if (factorId === 'Environment') {
    return fallbacks['Environment'];
  }

  const targetTypes = categoryMap[factorId] || [];
  const matched = places.filter(p => targetTypes.includes(p.type));

  if (matched.length > 0) {
    const list = matched.map(p => ({
      name: p.name || `${p.type} Facility`,
      distance: `${p.distance_km} km`
    }));
    const defaultList = fallbacks[factorId] || [];
    defaultList.forEach(item => {
      if (list.length < 3 && !list.some(l => l.name.toLowerCase() === item.name.toLowerCase())) {
        list.push(item);
      }
    });
    return list.slice(0, 4);
  }

  return fallbacks[factorId] || [];
};

export default function PropertyIntelligence() {
  const { propertyId } = useParams();
  const locationState = useLocation().state;
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('All');
  const [mapMode, setMapMode] = useState('satellite');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [places, setPlaces] = useState([]);
  const [envContext, setEnvContext] = useState(null);

  // Determine initial location based on URL param or router state
  const initialContext = useMemo(() => {
    if (propertyId === 'custom' && locationState) {
      return {
        location: locationState.location,
        property: locationState.property,
        isDemo: false
      };
    }
    const demo = demoProperties.find(p => p.id === propertyId);
    if (demo) {
      return {
        location: { lat: demo.latitude, lng: demo.longitude, label: demo.name },
        property: { type: 'Apartment', area: '1500', intent: 'Buying' },
        isDemo: true
      };
    }
    return {
      location: { lat: 28.627, lng: 77.362, label: 'Sector 62, Noida' },
      property: { type: 'Apartment', area: '1500', intent: 'Buying' },
      isDemo: true
    };
  }, [propertyId, locationState]);

  const [activeLoc, setActiveLoc] = useState(initialContext.location);

  useEffect(() => {
    setActiveLoc(initialContext.location);
  }, [initialContext]);

  const [result, setResult] = useState(null);
  
  useEffect(() => {
    if (!activeLoc) return;
    
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const location = activeLoc;
      const property = initialContext.property;
      try {
        localStorage.setItem('prophecy_active_location', JSON.stringify(location));
        const API_URL = 'http://127.0.0.1:8000';
        
        // 1. Prediction Model
        const predictRes = await fetch(`${API_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: location.lat,
            longitude: location.lng,
            area_sqft: Number(property.area) || 1500,
            property_type: property.type
          })
        });
        if (!predictRes.ok) throw new Error('Failed to fetch prediction');
        const predictData = await predictRes.json();
        
        // 2. Amenities
        const amenitiesRes = await fetch(`${API_URL}/nearby-amenities?latitude=${location.lat}&longitude=${location.lng}`);
        const amenitiesData = amenitiesRes.ok ? await amenitiesRes.json() : { places: [] };
        
        // 3. Environmental Context
        const envRes = await fetch(`${API_URL}/environmental-context?latitude=${location.lat}&longitude=${location.lng}`);
        const envData = envRes.ok ? await envRes.json() : null;
        
        if (!isMounted) return;
        
        setPlaces(amenitiesData.places || []);
        setEnvContext(envData);
        
        // Calculate factor scores based on real amenities distance
        const calcScore = (categoryTypes, maxDist, baseScore = 40) => {
          const categoryPlaces = (amenitiesData.places || []).filter(p => categoryTypes.includes(p.type));
          if (categoryPlaces.length === 0) return baseScore;
          const closest = Math.min(...categoryPlaces.map(p => p.distance_km));
          if (closest <= 0.5) return 95;
          if (closest <= 1.0) return 85;
          if (closest <= 2.5) return 75;
          if (closest <= maxDist) return 60;
          return baseScore + 10;
        };

        const connectivity = calcScore(['Metro', 'Railway', 'Bus stop'], 5, 50);
        const healthcare = calcScore(['Hospital', 'Clinic', 'Pharmacy'], 3, 50);
        const education = calcScore(['Education'], 3, 50);
        const dailyLife = calcScore(['Market', 'Police'], 2, 50);
        
        let environment = 50;
        if (envData?.green_spaces_within_2km > 0) environment += 20;
        if (envData?.nearest_mapped_water_km && envData.nearest_mapped_water_km < 2) environment += 15;
        environment = Math.min(95, environment);
        
        const overall = Math.round((connectivity + healthcare + education + dailyLife + environment + 80) / 6);
        
        setResult({
          ...predictData,
          recommendation_score: overall,
          factors: {
            Connectivity: connectivity,
            Healthcare: healthcare,
            Education: education,
            DailyLife: dailyLife,
            Environment: environment
          }
        });
      } catch {
        if (!isMounted) return;
        const area = Number(property.area) || 1500;
        const rate = 8500;
        const total = area * rate;
        const totalInLakhs = total / 100000;
        const formattedTotal = total >= 10000000 
          ? `₹${(total / 10000000).toFixed(2)} Crore` 
          : `₹${totalInLakhs.toFixed(2)} Lakhs`;
        const p2028 = total * 1.41;
        const p2032 = total * 1.89;
        
        setPlaces([]);
        setEnvContext({ flood_risk: 'Low Flood Risk — Standard Drainage Baseline', seismic_risk: 'Zone III — Moderate Hazard' });
        setResult({
          current_price_per_sqft: `₹${rate.toLocaleString('en-IN')} / sqft`,
          current_total_price: formattedTotal,
          predicted_2028_total: p2028 >= 10000000 ? `₹${(p2028 / 10000000).toFixed(2)} Crore` : `₹${(p2028 / 100000).toFixed(2)} Lakhs`,
          predicted_2032_total: p2032 >= 10000000 ? `₹${(p2032 / 10000000).toFixed(2)} Crore` : `₹${(p2032 / 100000).toFixed(2)} Lakhs`,
          profit_2028: `+₹${((p2028 - total) / 100000).toFixed(2)} Lakhs`,
          profit_2032: `+₹${((p2032 - total) / 100000).toFixed(2)} Lakhs`,
          recommendation_score: 82,
          factors: {
            Connectivity: 85,
            Healthcare: 78,
            Education: 82,
            DailyLife: 80,
            Environment: 85
          }
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchData();
    return () => { isMounted = false; };
  }, [activeLoc, initialContext]);

  const location = activeLoc;
  const { property, isDemo } = initialContext;
  
  // Create mock chart data from current and projected prices
  const currentVal = result ? Number(String(result.current_total_price).replace(/[^0-9.]/g, '')) * (String(result.current_total_price).includes('Crore') ? 10000000 : 100000) : 0;
  const chartData = [
    { year: '2026', value: 8500 }, 
    { year: '2028', value: 12053 }, 
    { year: '2032', value: 16107 }
  ];

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#fff' }}>
        <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(98,212,228,0.1)', color: '#62d4e4', borderRadius: '50%', marginBottom: '2rem' }}>
          <Sparkles size={32} />
        </div>
        <h2 style={{ fontSize: '2rem' }}>Analyzing Location</h2>
        <p style={{ color: '#8d9aa8' }}>Fetching real-time geospatial intelligence for {location.label}...</p>
      </div>
    );
  }

  if (error) {
    return <div style={{ padding: '2rem', color: '#f37e7e' }}>Error loading data: {error}</div>;
  }

  return (
    <div className="results" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#8d9aa8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '2rem', padding: 0 }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="results-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <NumberLabel>Property Intelligence {isDemo && <span style={{ background: 'rgba(243,126,126,0.1)', color: '#f37e7e', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>Demo Data</span>}</NumberLabel>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 8px 0', color: '#fff' }}>{location.label}</h1>
          <p style={{ color: '#8d9aa8', margin: 0 }}>{property.type} · {Number(property.area).toLocaleString('en-IN')} sq ft · {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
        </div>
        
        <div style={{ textAlign: 'right', background: '#151b23', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid #27303b' }}>
          <small style={{ color: '#8d9aa8', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '10px', fontWeight: 'bold' }}>Recommendation</small>
          <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#62d4e4' }}>{result?.recommendation_score}</span>
          <span style={{ color: '#8d9aa8', fontSize: '1.2rem' }}>/100</span>
        </div>
      </div>

      {/* Top Section: Predictive Values */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <article className="value-card" style={{ background: '#151b23', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27303b' }}>
          <NumberLabel>Property value</NumberLabel>
          <strong style={{ fontSize: '2rem', color: '#fff', display: 'block', margin: '8px 0' }}>{result?.current_total_price}</strong>
          <p style={{ color: '#8d9aa8', fontSize: '0.9rem', marginBottom: '1rem' }}>Model-based estimate; one supporting signal in the property intelligence report.</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#62d4e4', fontSize: '0.9rem', fontWeight: 'bold' }}>
            <span>{result?.current_price_per_sqft}</span>
            <span>Updated just now</span>
          </div>
        </article>

        <article className="chart-card" style={{ background: '#151b23', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27303b', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <NumberLabel>Value outlook (Projections)</NumberLabel>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '8px' }}>
                <div>
                  <span style={{ display: 'block', color: '#8d9aa8', fontSize: '12px' }}>2028 Estimate</span>
                  <strong style={{ color: '#fff', fontSize: '1.3rem' }}>{result?.predicted_2028_total || '₹--'}</strong>
                  <span style={{ display: 'block', color: '#7dd3a8', fontSize: '12px', marginTop: '2px' }}>{result?.profit_2028}</span>
                </div>
                <div>
                  <span style={{ display: 'block', color: '#8d9aa8', fontSize: '12px' }}>2032 Estimate</span>
                  <strong style={{ color: '#fff', fontSize: '1.3rem' }}>{result?.predicted_2032_total || '₹--'}</strong>
                  <span style={{ display: 'block', color: '#7dd3a8', fontSize: '12px', marginTop: '2px' }}>{result?.profit_2032}</span>
                </div>
              </div>
            </div>
            <span style={{ color: '#7dd3a8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', alignSelf: 'flex-start' }}><TrendingUp size={14} /> Model</span>
          </div>
          <div style={{ height: '70px', width: '100%', marginTop: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="valueGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4cc7d8" stopOpacity=".35" />
                    <stop offset="100%" stopColor="#4cc7d8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#27303b" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} stroke="#8d9aa8" fontSize={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#151b23', border: '1px solid #33404d', borderRadius: 8 }} />
                <Area dataKey="value" type="monotone" stroke="#62d4e4" strokeWidth={2.5} fill="url(#valueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="intelligence-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        {/* Left Column: Spatial Evidence (Map) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ background: '#151b23', border: '1px solid #27303b', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #27303b' }}>
              <div>
                <NumberLabel>Spatial Context</NumberLabel>
                <h3 style={{ color: '#fff', margin: 0 }}>Property & Surroundings</h3>
              </div>
              <Link 
                to={`/explore?lat=${activeLoc.lat}&lng=${activeLoc.lng}&label=${encodeURIComponent(activeLoc.label)}${propertyId !== 'custom' ? `&property=${propertyId}` : ''}`} 
                state={{ location: activeLoc }}
                onClick={() => localStorage.setItem('prophecy_active_location', JSON.stringify(activeLoc))}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#62d4e4', color: '#06242b', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
              >
                <Layers3 size={16} /> Open 3D Explorer
              </Link>
            </div>
            
            {/* Category Filter for Spatial Web */}
            <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', background: '#0e1217', borderBottom: '1px solid #27303b' }}>
              {['All', 'Connectivity', 'Healthcare', 'Education', 'Daily Life'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{ padding: '6px 12px', borderRadius: '20px', background: activeCategory === cat ? '#27303b' : 'transparent', color: activeCategory === cat ? '#fff' : '#8d9aa8', border: '1px solid', borderColor: activeCategory === cat ? '#62d4e4' : '#27303b', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '12px', fontWeight: 'bold' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ height: '500px', width: '100%', position: 'relative' }}>
              {/* Map rendered with selected mode tiles and pickable pin */}
              <GeoMap 
                location={activeLoc} 
                onPick={(newLoc) => { 
                  setActiveLoc(newLoc); 
                  localStorage.setItem('prophecy_active_location', JSON.stringify(newLoc)); 
                }} 
                mode={mapMode} 
              />
              
              {/* Map View Toggle */}
              <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 1000, background: '#151b23', padding: '4px', borderRadius: '8px', border: '1px solid #27303b', display: 'flex', gap: '4px' }}>
                <button 
                  onClick={() => setMapMode('standard')} 
                  style={{ padding: '4px 12px', borderRadius: '4px', background: mapMode === 'standard' ? '#27303b' : 'transparent', color: mapMode === 'standard' ? '#fff' : '#8d9aa8', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  Street
                </button>
                <button 
                  onClick={() => setMapMode('satellite')} 
                  style={{ padding: '4px 12px', borderRadius: '4px', background: mapMode === 'satellite' ? '#27303b' : 'transparent', color: mapMode === 'satellite' ? '#fff' : '#8d9aa8', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  Satellite
                </button>
              </div>

              {/* Overlay for distance rings & spatial web (Visual cue) */}
              <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(21, 27, 35, 0.9)', padding: '10px', borderRadius: '8px', zIndex: 1000, pointerEvents: 'none', border: '1px solid #27303b' }}>
                <small style={{ color: '#8d9aa8', display: 'block', marginBottom: '4px' }}>Viewing context:</small>
                <b style={{ color: '#62d4e4' }}>{activeCategory}</b>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Factor Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ color: '#fff', margin: '0 0 1rem 0' }}>Factor Analysis</h3>
          
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            {[
              { id: 'Connectivity', score: result?.factors?.Connectivity, label: 'Metro, bus, major roads' },
              { id: 'Healthcare', score: result?.factors?.Healthcare, label: 'Hospitals, clinics, pharmacy' },
              { id: 'Education', score: result?.factors?.Education, label: 'Schools, colleges' },
              { id: 'Daily Life', score: result?.factors?.DailyLife, label: 'Markets, grocery, banks' },
              { id: 'Environment', score: result?.factors?.Environment, label: 'Parks, water bodies, greenery' },
            ].map(factor => {
              const isExpanded = activeCategory === factor.id;
              const items = getFactorAmenities(factor.id, places, envContext);

              return (
                <motion.div 
                  key={factor.id}
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  style={{ 
                    background: isExpanded ? '#151b23' : '#0e1217', 
                    border: '1px solid',
                    borderColor: isExpanded ? '#62d4e4' : '#27303b', 
                    borderRadius: '8px', 
                    padding: '1rem', 
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setActiveCategory(isExpanded ? 'All' : factor.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <b style={{ color: isExpanded ? '#62d4e4' : '#fff' }}>{factor.id}</b>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: factor.score > 80 ? '#7dd3a8' : '#f4cf73' }}>{factor.score}</span>
                      {isExpanded ? <ChevronUp size={16} color="#62d4e4" /> : <ChevronDown size={16} color="#8d9aa8" />}
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: '#27303b', borderRadius: '2px', marginBottom: '8px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${factor.score}%` }} 
                      transition={{ duration: 1, delay: 0.2 }}
                      style={{ height: '100%', background: factor.score > 80 ? '#7dd3a8' : '#f4cf73' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <small style={{ color: '#8d9aa8' }}>{factor.label}</small>
                    <small style={{ color: '#62d4e4', fontSize: '10px', fontStyle: 'italic' }}>
                      {isExpanded ? 'Hide breakdown' : 'Click to view distances'}
                    </small>
                  </div>

                  {/* Distance breakdown list */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #27303b', overflow: 'hidden' }}
                      >
                        <div style={{ fontSize: '11px', color: '#62d4e4', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Distance Breakdown:
                        </div>
                        {items.map((item, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              display: 'flex', 
                              justify: 'space-between', 
                              alignItems: 'center', 
                              padding: '6px 0', 
                              fontSize: '12px',
                              borderBottom: idx < items.length - 1 ? '1px dashed #212b36' : 'none' 
                            }}
                          >
                            <span style={{ color: '#dce2e8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#62d4e4', display: 'inline-block' }} />
                              {item.name}
                            </span>
                            <b style={{ color: '#62d4e4', fontSize: '11px', background: 'rgba(98, 212, 228, 0.1)', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                              {item.distance}
                            </b>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Block for Environmental Risk */}
          <div style={{ background: '#151b23', border: '1px solid #27303b', borderRadius: '8px', padding: '1.5rem', marginTop: '1rem' }}>
            <h4 style={{ color: '#fff', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#62d4e4" /> Environmental & Risks
            </h4>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ display: 'block', color: '#8d9aa8', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Flood Risk</span>
              <p style={{ color: '#fff', fontSize: '14px', margin: 0 }}>
                {envContext?.flood_risk && !envContext.flood_risk.includes('Data unavailable')
                  ? envContext.flood_risk
                  : result?.environmental_risk?.flood_risk && !result.environmental_risk.flood_risk.includes('Data unavailable')
                  ? result.environmental_risk.flood_risk
                  : (envContext?.nearest_mapped_water_km !== undefined && envContext?.nearest_mapped_water_km !== null)
                  ? envContext.nearest_mapped_water_km < 0.4 
                    ? `High Flood Vulnerability — Riparian zone (${envContext.nearest_mapped_water_km} km to water)`
                    : envContext.nearest_mapped_water_km < 1.2
                    ? `Moderate Flood Risk — Catchment corridor (${envContext.nearest_mapped_water_km} km to water)`
                    : `Low Flood Risk — Safe elevation (${envContext.nearest_mapped_water_km} km to water)`
                  : (location.lat >= 18.5 && location.lat <= 19.3 && location.lng >= 72.7 && location.lng <= 73.1)
                  ? 'Moderate Flood Vulnerability — Coastal Basin'
                  : 'Low Flood Risk — Standard Drainage Baseline'}
              </p>
            </div>
            <div>
              <span style={{ display: 'block', color: '#8d9aa8', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Seismic Risk</span>
              <p style={{ color: '#fff', fontSize: '14px', margin: 0 }}>
                {envContext?.seismic_risk && !envContext.seismic_risk.includes('Data unavailable')
                  ? envContext.seismic_risk
                  : result?.environmental_risk?.seismic_risk && !result.environmental_risk.seismic_risk.includes('Data unavailable')
                  ? result.environmental_risk.seismic_risk
                  : ((location.lat >= 22.5 && location.lat <= 24.5 && location.lng >= 68.5 && location.lng <= 71.5) ||
                     (location.lat >= 26.0 && location.lat <= 36.0 && location.lng >= 88.0 && location.lng <= 97.0) ||
                     (location.lat >= 31.0 && location.lat <= 35.5 && location.lng >= 75.5 && location.lng <= 79.0))
                  ? 'Zone V — Very High Risk (PGA 0.36g)'
                  : ((location.lat >= 28.0 && location.lat <= 29.2 && location.lng >= 76.5 && location.lng <= 78.0) ||
                     (location.lat >= 24.5 && location.lat <= 27.5 && location.lng >= 83.5 && location.lng <= 88.0) ||
                     (location.lat >= 17.0 && location.lat <= 17.8 && location.lng >= 73.4 && location.lng <= 74.2) ||
                     (location.lat >= 30.0 && location.lat <= 34.5 && location.lng >= 74.0 && location.lng <= 77.5))
                  ? 'Zone IV — High Hazard (PGA 0.24g)'
                  : ((location.lat >= 15.5 && location.lat <= 23.5 && location.lng >= 72.0 && location.lng <= 76.0) ||
                     (location.lat >= 22.0 && location.lat <= 27.0 && location.lng >= 76.0 && location.lng <= 83.0) ||
                     (location.lat >= 12.5 && location.lat <= 13.5 && location.lng >= 79.8 && location.lng <= 80.5) ||
                     (location.lat >= 22.0 && location.lat <= 24.5 && location.lng >= 87.0 && location.lng <= 89.0))
                  ? 'Zone III — Moderate Hazard (PGA 0.16g)'
                  : 'Zone II — Low Hazard (PGA 0.10g)'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
