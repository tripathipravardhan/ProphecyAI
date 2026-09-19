import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Activity } from 'lucide-react';
import { demoProperties } from '../data/demoProperties';

export default function Properties() {
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const [state, setState] = useState('idle'); // idle, loading, success
  const [listings, setListings] = useState([]);
  const [isDemo, setIsDemo] = useState(false);

  const API_URL = 'http://127.0.0.1:8000/search-properties';

  const search = async (e) => {
    e.preventDefault();
    if (!term.trim()) return;
    setState('loading');
    setIsDemo(false);
    
    // Geocode search query to sync location globally
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(term + ', India')}`, {
        headers: { Accept: 'application/json' }
      });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData?.length) {
          const loc = {
            lat: Number(geoData[0].lat),
            lng: Number(geoData[0].lon),
            label: geoData[0].display_name.split(',').slice(0, 3).join(',')
          };
          localStorage.setItem('prophecy_active_location', JSON.stringify(loc));
        }
      }
    } catch {
      // ignore
    }

    try {
      const response = await fetch(`${API_URL}?query=${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setListings(data.listings || []);
      setState('success');
    } catch {
      // Fallback if API fails
      setListings([
        { 
          name: `${term} Prime Enclave`, 
          type: 'Apartment', 
          city: `${term}, India`, 
          rate_sqft: '₹8,500 / sqft', 
          total_price: '₹127.50 Lakhs', 
          profit_2028: '+₹53.30 Lakhs', 
          profit_2032: '+₹114.11 Lakhs', 
          external_link: `https://www.google.com/search?q=buy+property+in+${encodeURIComponent(term)}` 
        }
      ]);
      setIsDemo(true);
      setState('success');
    }
  };

  return (
    <section className="properties-page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <span className="eyebrow" style={{ display: 'block', color: '#62d4e4', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
        Property search
      </span>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Explore local market signals.</h1>
      <p style={{ color: '#8d9aa8', fontSize: '1.1rem', marginBottom: '2rem' }}>
        Search a city or locality to retrieve benchmark property opportunities.
      </p>

      <form onSubmit={search} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#0e1217', border: '1px solid #27303b', borderRadius: '8px', padding: '0 1rem' }}>
          <Search size={18} color="#8d9aa8" />
          <input 
            value={term} 
            onChange={e => setTerm(e.target.value)} 
            placeholder="Search a city, locality, or project (e.g. Noida)" 
            style={{ flex: 1, padding: '16px', background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '1rem' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={!term.trim() || state === 'loading'}
          style={{ padding: '0 24px', background: term.trim() ? '#62d4e4' : '#27303b', color: term.trim() ? '#06242b' : '#8d9aa8', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: term.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {state === 'loading' ? 'Searching...' : <>Search <ArrowRight size={16} /></>}
        </button>
      </form>

      {state === 'idle' && (
        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#fff' }}>Demonstration Properties</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {demoProperties.map((demo) => (
              <div key={demo.id} style={{ background: '#151b23', border: '1px solid #27303b', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 4px 0' }}>{demo.name}</h4>
                    <p style={{ color: '#8d9aa8', margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {demo.city}</p>
                  </div>
                  <div style={{ background: 'rgba(98,212,228,0.1)', color: '#62d4e4', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                    82 / 100
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: '#0e1217', borderRadius: '8px' }}>
                  <div>
                    <span style={{ display: 'block', color: '#8d9aa8', fontSize: '0.8rem', marginBottom: '4px' }}>Connectivity</span>
                    <strong style={{ color: '#fff' }}>91</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', color: '#8d9aa8', fontSize: '0.8rem', marginBottom: '4px' }}>Healthcare</span>
                    <strong style={{ color: '#fff' }}>84</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link to={`/properties/${demo.id}`} style={{ flex: 1, padding: '10px', background: '#62d4e4', color: '#06242b', borderRadius: '6px', textDecoration: 'none', textAlign: 'center', fontWeight: 'bold' }}>
                    Analyze
                  </Link>
                  <Link to={`/explore?property=${demo.id}`} style={{ flex: 1, padding: '10px', background: '#27303b', color: '#fff', borderRadius: '6px', textDecoration: 'none', textAlign: 'center', fontWeight: 'bold' }}>
                    Explore 3D
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {state === 'success' && (
        <div className="search-results">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ color: '#8d9aa8' }}>{listings.length} opportunities near <b style={{ color: '#fff' }}>{term}</b></span>
            {isDemo && <span style={{ background: 'rgba(243,126,126,0.1)', color: '#f37e7e', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Demo data · API unavailable</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {listings.map((item, index) => (
              <div key={index} style={{ background: '#151b23', border: '1px solid #27303b', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8d9aa8', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <MapPin size={14} /> {item.type}
                </div>
                <h2 style={{ color: '#fff', fontSize: '1.25rem', margin: '0 0 4px 0' }}>{item.name}</h2>
                <p style={{ color: '#8d9aa8', margin: '0 0 1.5rem 0', fontSize: '0.9rem' }}>{item.city}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #27303b', marginBottom: '1rem' }}>
                  <div>
                    <small style={{ display: 'block', color: '#8d9aa8', fontSize: '0.8rem', marginBottom: '4px' }}>Benchmark rate</small>
                    <b style={{ color: '#fff' }}>{item.rate_sqft}</b>
                  </div>
                  <div>
                    <small style={{ display: 'block', color: '#8d9aa8', fontSize: '0.8rem', marginBottom: '4px' }}>Indicative price</small>
                    <b style={{ color: '#fff' }}>{item.total_price}</b>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => navigate('/analyze')} style={{ flex: 1, padding: '8px 10px', background: '#27303b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                    Analyze
                  </button>
                  <Link to="/explore" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '8px 10px', background: '#62d4e4', color: '#06242b', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                    Explore 3D
                  </Link>
                  <a href={item.external_link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flex: 1, padding: '8px 10px', background: 'transparent', color: '#62d4e4', border: '1px solid #62d4e4', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                    Source <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
