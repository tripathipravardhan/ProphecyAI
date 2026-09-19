import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, MapPin, LocateFixed, Zap, Database, Check, Activity } from 'lucide-react';
import GeoMap from '../components/GeoMap';

const defaultLocation = { lat: 28.627, lng: 77.362, label: 'Sector 62, Noida' };

function NumberLabel({ children }) {
  return <span className="eyebrow" style={{ display: 'block', color: '#62d4e4', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{children}</span>;
}

export default function Analyze() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(defaultLocation);
  const [query, setQuery] = useState('');
  const [searchState, setSearchState] = useState('idle');
  const [searchError, setSearchError] = useState('');
  const [property, setProperty] = useState({ type: 'Apartment', area: '1500', intent: 'Buying' });
  const [analysisState, setAnalysisState] = useState('idle');
  const [mapMode, setMapMode] = useState('satellite');

  const findLocation = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchState('loading');
    setSearchError('');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query + ', India')}`, {
        headers: { Accept: 'application/json' },
      });
      const data = await response.json();
      if (!data?.length) throw new Error();
      setLocation({
        lat: Number(data[0].lat),
        lng: Number(data[0].lon),
        label: data[0].display_name.split(',').slice(0, 3).join(','),
      });
      setSearchState('success');
    } catch {
      setSearchState('error');
      setSearchError("We couldn't find that location in India. Try a more specific address or locality.");
    }
  };

  const runAnalysis = () => {
    if (!property.area || Number(property.area) <= 0) return;
    setStep(3);
    setAnalysisState('loading');
    
    // Simulate analysis time, then redirect to the deep property intelligence page
    setTimeout(() => {
      // Pass state via router
      navigate('/properties/custom', { 
        state: { location, property } 
      });
    }, 1500);
  };

  const valid = Number(property.area) > 0;

  return (
    <section className="workflow" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="workflow-intro" style={{ marginBottom: '3rem' }}>
        <NumberLabel>Property analysis</NumberLabel>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Build your property intelligence report.</h1>
        <p style={{ color: '#8d9aa8', fontSize: '1.1rem' }}>Choose a location, add the essentials, and get a clear view of price, context, and spatial signals.</p>
      </div>

      <ol className="stepper" aria-label="Analysis progress" style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', listStyle: 'none', padding: 0 }}>
        {['Location', 'Property', 'Analysis'].map((item, index) => (
          <li key={item} style={{ display: 'flex', gap: '12px', opacity: step >= index + 1 ? 1 : 0.4 }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: step > index + 1 ? '#62d4e4' : '#27303b', color: step > index + 1 ? '#000' : '#fff', fontSize: '12px', fontWeight: 'bold' }}>
              {step > index + 1 ? <Check size={14} /> : `0${index + 1}`}
            </span>
            <div>
              <b style={{ display: 'block', color: '#fff' }}>{item}</b>
              <small style={{ color: '#8d9aa8' }}>{step > index + 1 ? 'Complete' : step === index + 1 ? 'In progress' : 'Up next'}</small>
            </div>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="step-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="form-card location-form" style={{ background: '#151b23', padding: '2rem', borderRadius: '12px', border: '1px solid #27303b' }}>
            <NumberLabel>01 · Location</NumberLabel>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>Where is the property?</h2>
            <p style={{ color: '#8d9aa8', marginBottom: '1.5rem' }}>Search an address or place a pin directly on the map.</p>
            
            <form onSubmit={findLocation} style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: '#8d9aa8', marginBottom: '8px' }}>
                Search location in India
                <div className="input-with-icon" style={{ display: 'flex', marginTop: '8px', background: '#0e1217', border: '1px solid #27303b', borderRadius: '8px', padding: '4px' }}>
                  <span style={{ padding: '8px', color: '#8d9aa8' }}><Search size={17} /></span>
                  <input 
                    value={query} 
                    onChange={e => setQuery(e.target.value)} 
                    placeholder="Try Sector 62 Noida" 
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}
                  />
                  <button type="submit" style={{ background: '#27303b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                    {searchState === 'loading' ? '...' : <ArrowRight size={17} />}
                  </button>
                </div>
              </label>
            </form>
            
            {searchError && <p style={{ color: '#f37e7e', marginBottom: '1rem' }}>{searchError}</p>}
            
            <div className="selected-location" style={{ background: '#0e1217', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
              <MapPin size={24} color="#62d4e4" />
              <div>
                <small style={{ color: '#8d9aa8', display: 'block' }}>Selected location</small>
                <b style={{ color: '#fff', display: 'block', margin: '4px 0' }}>{location.label}</b>
                <code style={{ color: '#62d4e4', fontSize: '12px' }}>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</code>
              </div>
            </div>
            
            <button 
              onClick={() => setStep(2)}
              style={{ width: '100%', padding: '12px', background: '#62d4e4', color: '#06242b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              Continue <ArrowRight size={17} />
            </button>
          </div>
          
          <div className="map-card" style={{ background: '#151b23', padding: '1rem', borderRadius: '12px', border: '1px solid #27303b', display: 'flex', flexDirection: 'column' }}>
            <div className="map-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <b style={{ color: '#fff', display: 'block' }}>Choose on map</b>
                <small style={{ color: '#8d9aa8' }}>Click anywhere to reposition the marker</small>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', background: '#0e1217', padding: '3px', borderRadius: '6px', border: '1px solid #27303b' }}>
                  <button 
                    onClick={() => setMapMode('satellite')} 
                    style={{ padding: '4px 10px', borderRadius: '4px', background: mapMode === 'satellite' ? '#27303b' : 'transparent', color: mapMode === 'satellite' ? '#62d4e4' : '#8d9aa8', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                    Satellite
                  </button>
                  <button 
                    onClick={() => setMapMode('standard')} 
                    style={{ padding: '4px 10px', borderRadius: '4px', background: mapMode === 'standard' ? '#27303b' : 'transparent', color: mapMode === 'standard' ? '#62d4e4' : '#8d9aa8', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                    Street
                  </button>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#62d4e4', fontSize: '12px' }}>
                  <LocateFixed size={15} />
                </span>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: '400px', borderRadius: '8px', overflow: 'hidden' }}>
              <GeoMap location={location} onPick={setLocation} mode={mapMode} />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="property-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div className="form-card" style={{ background: '#151b23', padding: '2rem', borderRadius: '12px', border: '1px solid #27303b' }}>
            <NumberLabel>02 · Property</NumberLabel>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>Add the essentials.</h2>
            <p style={{ color: '#8d9aa8', marginBottom: '2rem' }}>We only ask for inputs used by the valuation model.</p>
            
            <div className="selection-summary" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#0e1217', borderRadius: '8px', marginBottom: '2rem' }}>
              <Check size={16} color="#62d4e4" />
              <div>
                <small style={{ color: '#8d9aa8', display: 'block' }}>Location selected</small>
                <b style={{ color: '#fff' }}>{location.label}</b>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: '#8d9aa8' }}>
                Property type
                <select 
                  value={property.type} 
                  onChange={e => setProperty({ ...property, type: e.target.value })}
                  style={{ display: 'block', width: '100%', marginTop: '8px', padding: '12px', background: '#0e1217', border: '1px solid #27303b', color: '#fff', borderRadius: '8px', outline: 'none' }}
                >
                  <option>Apartment</option>
                  <option>Residential Plot</option>
                  <option>Commercial</option>
                </select>
              </label>
              
              <label style={{ display: 'block', color: '#8d9aa8' }}>
                Intent
                <select 
                  value={property.intent} 
                  onChange={e => setProperty({ ...property, intent: e.target.value })}
                  style={{ display: 'block', width: '100%', marginTop: '8px', padding: '12px', background: '#0e1217', border: '1px solid #27303b', color: '#fff', borderRadius: '8px', outline: 'none' }}
                >
                  <option>Buying</option>
                  <option>Renting</option>
                </select>
              </label>

              <label style={{ display: 'block', color: '#8d9aa8', gridColumn: '1 / -1' }}>
                Area (sq ft)
                <input 
                  value={property.area} 
                  onChange={e => setProperty({ ...property, area: e.target.value.replace(/[^0-9]/g, '') })} 
                  inputMode="numeric"
                  style={{ display: 'block', width: '100%', marginTop: '8px', padding: '12px', background: '#0e1217', border: '1px solid #27303b', color: '#fff', borderRadius: '8px', outline: 'none' }}
                />
              </label>
            </div>
            
            <div className="button-row" style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setStep(1)} style={{ padding: '12px 24px', background: '#27303b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Back
              </button>
              <button 
                disabled={!valid} 
                onClick={runAnalysis}
                style={{ flex: 1, padding: '12px', background: valid ? '#62d4e4' : '#27303b', color: valid ? '#06242b' : '#8d9aa8', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: valid ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                Analyze property <Zap size={16} />
              </button>
            </div>
          </div>
          
          <aside className="model-note" style={{ background: 'rgba(98,212,228,0.05)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(98,212,228,0.1)', height: 'fit-content' }}>
            <Database size={24} color="#62d4e4" style={{ marginBottom: '1rem' }} />
            <NumberLabel>Model inputs</NumberLabel>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Clear inputs, clear output.</h3>
            <p style={{ color: '#8d9aa8', lineHeight: 1.5 }}>
              Location, property type, and area are passed to the prediction service. Geographic context is presented separately from the model result.
            </p>
          </aside>
        </div>
      )}

      {step === 3 && (
        <div className="analysis-card" style={{ background: '#151b23', padding: '4rem 2rem', borderRadius: '12px', border: '1px solid #27303b', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(98,212,228,0.1)', color: '#62d4e4', borderRadius: '50%', marginBottom: '2rem' }}>
            <Activity size={32} />
          </div>
          <NumberLabel>Preparing intelligence</NumberLabel>
          <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>Analyzing this property.</h2>
          <p style={{ color: '#8d9aa8', marginBottom: '2rem' }}>We're assembling the available model and location context...</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', maxWidth: '300px', margin: '0 auto' }}>
            <div style={{ color: '#62d4e4', display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={18} /> Location identified</div>
            <div style={{ color: '#62d4e4', display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={18} /> Property features prepared</div>
            <div style={{ color: '#fff', display: 'flex', gap: '12px', alignItems: 'center' }}><span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Running valuation model</div>
          </div>
        </div>
      )}
    </section>
  );
}
