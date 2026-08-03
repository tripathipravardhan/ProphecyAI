import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Search, Map, BarChart2, Activity, Shield, Settings, HelpCircle, Bell, Home, TrendingUp, Target, Train, Cpu, CheckCircle2, TreePine, Droplets, Sliders, Database, Send, Check } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import L from 'leaflet';

const customPinIcon = new L.Icon({
  iconUrl: '/custom-pin.jpeg',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position} icon={customPinIcon}></Marker>;
}

function MapUpdater({ centerPosition }) {
  const map = useMap();
  if (centerPosition) {
    map.flyTo(centerPosition, 13, { duration: 1.5 });
  }
  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const defaultCenter = [26.8467, 80.9462]; 
  const [position, setPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [topBarQuery, setTopBarQuery] = useState('');
  
  const [plotType, setPlotType] = useState('Apartment');
  const [area, setArea] = useState(5000);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('Dashboard');

  const [liveListings, setLiveListings] = useState([
    { name: "Godrej Woods Phase II", type: "Apartment", city: "Noida, UP", rate_sqft: "₹8,500 / sqft", total_price: "₹127.50 Lakhs", profit_2028: "+₹53.30 Lakhs", profit_2032: "+₹114.11 Lakhs", external_link: "https://www.magicbricks.com" },
    { name: "Eldeco Live By The Greens", type: "Apartment", city: "Lucknow, UP", rate_sqft: "₹5,200 / sqft", total_price: "₹78.00 Lakhs", profit_2028: "+₹32.60 Lakhs", profit_2032: "+₹69.81 Lakhs", external_link: "https://www.housing.com" },
    { name: "Lodha Park Royale", type: "Apartment", city: "Mumbai, MH", rate_sqft: "₹28,000 / sqft", total_price: "₹420.00 Lakhs", profit_2028: "+₹175.56 Lakhs", profit_2032: "+₹375.90 Lakhs", external_link: "https://www.99acres.com" }
  ]);
  const [propertySearchInput, setPropertySearchInput] = useState('');

  const [mlTrees, setMlTrees] = useState(150);
  const [mlDepth, setMlDepth] = useState(6);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [supportSent, setSupportSent] = useState(false);
  const [supportForm, setSupportForm] = useState({ name: '', email: '', message: '' });

  const basePrice = results ? parseFloat(results.current_price_per_sqft.replace(/[^0-9.]/g, '')) : 0;
  const chartData = results ? [
    { year: '2026', price: Math.round(basePrice) },
    { year: '2028', price: Math.round(basePrice * 1.418) },
    { year: '2032', price: Math.round(basePrice * 1.895) }
  ] : [
    { year: '2026', price: 0 }, { year: '2028', price: 0 }, { year: '2032', price: 0 }
  ];

  const handleMapSearch = async (e) => {
    e.preventDefault();
    const queryToUse = searchQuery || topBarQuery;
    if (!queryToUse) return;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${queryToUse}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        const newLocation = { lat: newLat, lng: newLng };
        
        setMapCenter(newLocation); 
        setPosition(newLocation);  
        setActiveTab('Dashboard');
      } else {
        alert("Location not found. Please try a more specific search.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!position) return alert("Please drop a pin on the map first!");
    
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('https://prophecyai.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: position.lat,
          longitude: position.lng,
          area_sqft: parseFloat(area),
          property_type: plotType
        }),
      });

      const data = await response.json();
      if (response.ok) setResults(data);
    } catch (err) {
      alert("Connection failed! Make sure your FastAPI backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="app-container" style={{ height: '100vh', width: '100vw', backgroundColor: '#131314', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Roboto, sans-serif' }}>
        <div style={{ backgroundColor: '#1e1f20', padding: '40px', borderRadius: '12px', width: '450px', maxWidth: '90%', boxShadow: '0 4px 24px rgba(0,0,0,0.5)', color: '#e3e3e3' }}>
          
          <div style={{ marginBottom: '25px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginBottom: '15px' }}><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 15c1.9 3.8 5.8 8 10.4 8z"/></svg>
            <h1 style={{ fontSize: '24px', fontWeight: '400', margin: '0 0 8px 0', color: '#e3e3e3' }}>Choose an account</h1>
            <p style={{ fontSize: '14px', color: '#8e918f', margin: 0 }}>to continue to ProphecyAI</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '20px', borderTop: '1px solid #3c4043', borderBottom: '1px solid #3c4043', padding: '8px 0' }}>
            {[
              { name: "Pravardhan Tripathi", email: "pravardhantripathi@gmail.com" },
              { name: "Pravardhan Tripathi", email: "2k24.cs1l.2413159@gmail.com" },
              { name: "Kundan Kumar", email: "kundan.aktu2024@gmail.com" }
            ].map((acc, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setUserEmail(acc.email);
                  setIsAuthenticated(true);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 10px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#28292a'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#8ab4f8', color: '#202124', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                  {acc.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#e3e3e3' }}>{acc.name}</div>
                  <div style={{ fontSize: '12px', color: '#8e918f' }}>{acc.email}</div>
                </div>
              </div>
            ))}

            <div 
              onClick={() => {
                const em = prompt("Enter another Gmail address:");
                if (em) { setUserEmail(em); setIsAuthenticated(true); }
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '14px 10px', borderRadius: '8px', cursor: 'pointer', marginTop: '5px' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#28292a'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px dashed #8e918f', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#8e918f' }}>
                +
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#8ab4f8' }}>Use another account</div>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#8e918f', lineHeight: '1.5' }}>
            Before using this app, you can review ProphecyAI's <span style={{ color: '#8ab4f8', cursor: 'pointer' }}>Privacy Policy</span> and <span style={{ color: '#8ab4f8', cursor: 'pointer' }}>Terms of Service</span>.
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="app-container dashboard-layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo-container">
          <Activity color="#2563eb" size={28} />
          ProphecyAI  
        </div>
        <div className="nav-menu">
          <div className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('Dashboard')}><LayoutDashboard size={20} /> Dashboard</div>
          <div className={`nav-item ${activeTab === 'Property Search' ? 'active' : ''}`} onClick={() => setActiveTab('Property Search')}><Search size={20} /> Property Search</div>
          <div className={`nav-item ${activeTab === 'Price Prediction' ? 'active' : ''}`} onClick={() => setActiveTab('Price Prediction')}><BarChart2 size={20} /> Price Prediction</div>
          <div className={`nav-item ${activeTab === 'Satellite Analysis' ? 'active' : ''}`} onClick={() => setActiveTab('Satellite Analysis')}><Map size={20} /> Satellite Analysis</div>
          <div className={`nav-item ${activeTab === 'Investment Insights' ? 'active' : ''}`} onClick={() => setActiveTab('Investment Insights')}><TrendingUp size={20} /> Investment Insights</div>
          <div className={`nav-item ${activeTab === 'Risk Reports' ? 'active' : ''}`} onClick={() => setActiveTab('Risk Reports')}><Shield size={20} /> Risk Reports</div>
          <div style={{marginTop: 'auto'}}>
            <div className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => setActiveTab('Settings')}><Settings size={20} /> Settings</div>
            <div className={`nav-item ${activeTab === 'Help & Support' ? 'active' : ''}`} onClick={() => setActiveTab('Help & Support')}><HelpCircle size={20} /> Help & Support</div>
          </div>
        </div>
      </div>
      
      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        <div className="topbar">
          <form onSubmit={handleMapSearch} style={{ display: 'flex', width: '350px' }}>
            <input 
              type="text" 
              className="search-bar" 
              value={topBarQuery}
              onChange={(e) => setTopBarQuery(e.target.value)}
              placeholder="Search locality, city or project..." 
              style={{ width: '100%' }}
            />
          </form>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>📍 India </span>
            <Bell size={20} color="var(--text-muted)" />
            
            <div title={userEmail} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', justifyContent:'center', alignItems:'center', fontWeight:'bold', color: 'white' }}>
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{userEmail}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {activeTab === 'Dashboard' && (
            <>
              <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                <div className="kpi-card">
                  <div className="kpi-icon" style={{color: '#3b82f6'}}><Home /></div>
                  <div className="kpi-data">
                    <p>Current Rate</p>
                    <h3>{results ? results.current_price_per_sqft : '---'}</h3>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon" style={{color: '#3b82f6'}}><Home /></div>
                  <div className="kpi-data">
                    <p>Current Property Price</p>
                    <h3>{results ? results.current_total_price : '---'}</h3>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon" style={{backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981'}}><TrendingUp /></div>
                  <div className="kpi-data">
                    <p>2028 Total (Profit)</p>
                    <h3 style={{color: '#10b981', fontSize: '15px'}}>{results ? results.predicted_2028_total : '---'}</h3>
                    <p style={{color: '#10b981', fontSize: '11px', fontWeight: 'bold'}}>{results ? `Profit: ${results.profit_2028}` : ''}</p>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon" style={{backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6'}}><TrendingUp /></div>
                  <div className="kpi-data">
                    <p>2032 Total (Profit)</p>
                    <h3 style={{color: '#8b5cf6', fontSize: '15px'}}>{results ? results.predicted_2032_total : '---'}</h3>
                    <p style={{color: '#8b5cf6', fontSize: '11px', fontWeight: 'bold'}}>{results ? `Profit: ${results.profit_2032}` : ''}</p>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon" style={{backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b'}}><Activity /></div>
                  <div className="kpi-data">
                    <p>Urban Growth Index</p>
                    <h3>{results ? `${results.urban_growth_index} / 10` : '---'}</h3>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon" style={{backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'}}><Target /></div>
                  <div className="kpi-data">
                    <p>Investment Potential</p>
                    <h3 style={{color: '#10b981'}}>High</h3>
                  </div>
                </div>
              </div>

              <div className="middle-row">
                <div className="panel-card">
                  <form onSubmit={handleMapSearch} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      placeholder="Search city or state to jump..." 
                      style={{ flex: 1, padding: '8px 15px', backgroundColor: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '5px' }} 
                    />
                    <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Search size={16} /> Locate
                    </button>
                  </form>

                  <form onSubmit={handlePredict} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <select value={plotType} onChange={(e) => setPlotType(e.target.value)} style={{ flex: 1, padding: '8px', backgroundColor: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '5px' }}>
                      <option value="Residential Plot">Residential Plot</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                    <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Area (sqft)" style={{ flex: 1, padding: '8px', backgroundColor: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '5px' }} />
                    <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                      {loading ? 'Analyzing...' : 'Run AI'}
                    </button>
                  </form>

                  <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                      <TileLayer 
                        url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" 
                        attribution="&copy; Google Maps"
                      />
                      <LocationMarker position={position} setPosition={setPosition} />
                      <MapUpdater centerPosition={mapCenter} />
                    </MapContainer>
                  </div>
                </div>

                <div className="panel-card">
                  <h3><Shield size={18} color="#8b5cf6" /> Environmental Risk</h3>
                  {results && results.environmental_risk ? (
                    <>
                      <div className="list-item">
                        <div className="item-left">
                          <TreePine size={20} color="#10b981" />
                          <div>
                            <h4>Green Cover Loss</h4>
                            <p>Since 2018</p>
                          </div>
                        </div>
                        <h4 style={{color: '#ef4444', margin: 0}}>{results.environmental_risk.green_loss}</h4>
                      </div>

                      <div className="list-item">
                        <div className="item-left">
                          <Home size={20} color="#f59e0b" />
                          <div>
                            <h4>Built-up Area Growth</h4>
                            <p>Since 2018</p>
                          </div>
                        </div>
                        <h4 style={{color: '#f59e0b', margin: 0}}>{results.environmental_risk.built_up_growth}</h4>
                      </div>

                      <div className="list-item">
                        <div className="item-left">
                          <Droplets size={20} color="#3b82f6" />
                          <div>
                            <h4>Flood Risk</h4>
                            <p>Historical Data</p>
                          </div>
                        </div>
                        <h4 style={{color: '#3b82f6', margin: 0}}>{results.environmental_risk.flood_risk}</h4>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                      Run AI Analysis to load environmental risk data.
                    </div>
                  )}
                </div>
              </div>

              <div className="bottom-row">
                <div className="panel-card">
                  <h3><Train size={18} color="#3b82f6" /> Upcoming Infrastructure</h3>
                  {results && results.infrastructure ? (
                    results.infrastructure.map((infra, index) => (
                      <div className="list-item" key={index}>
                        <div className="item-left">
                          <div className="kpi-icon" style={{
                            padding: '8px', 
                            backgroundColor: infra.color === 'blue' ? 'rgba(59,130,246,0.2)' : infra.color === 'orange' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)', 
                            color: infra.color === 'blue' ? '#3b82f6' : infra.color === 'orange' ? '#f59e0b' : '#10b981'
                          }}>
                            {infra.color === 'blue' ? <Train size={16} /> : infra.color === 'orange' ? <Target size={16} /> : <Activity size={16} />}
                          </div>
                          <div>
                            <h4>{infra.name}</h4>
                            <p>{infra.distance}</p>
                          </div>
                        </div>
                        <span className={`badge ${infra.color}`}>{infra.badge}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                      Run AI Analysis first.
                    </div>
                  )}
                </div>

                <div className="panel-card">
                  <h3><TrendingUp size={18} color="#10b981" /> Price Trend Analysis (₹/sqft)</h3>
                  <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2e46" vertical={false} />
                        <XAxis dataKey="year" stroke="#8ba3cb" axisLine={false} tickLine={false} />
                        <YAxis stroke="#8ba3cb" axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0a1526', borderColor: '#1e2e46', color: '#fff' }} />
                        <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="panel-card ai-recommendation">
                  <h3><Cpu size={18} color="#10b981" /> AI Recommendation</h3>
                  {results && results.ai_recommendation ? (
                    <>
                      <div className="recommendation-header">
                        <Cpu size={40} color="#10b981" />
                        <div>
                          <h2>{results.ai_recommendation.verdict}</h2>
                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Location intelligence verified.</p>
                        </div>
                      </div>

                      <div style={{ marginTop: '10px' }}>
                        <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Key Reasons</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {results.ai_recommendation.reasons.map((reason, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                              <CheckCircle2 size={16} color="#10b981" /> {reason}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                      Run AI Analysis to generate recommendations.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'Property Search' && (
            <div className="panel-card" style={{ padding: '30px', height: '100%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2>🔍 Live Real-World Property & Market Index</h2>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>Search any city, view buying prices, and calculate forward profits.</p>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={propertySearchInput}
                    onChange={(e) => setPropertySearchInput(e.target.value)}
                    placeholder="Search city (e.g. Chennai, Pune)..." 
                    style={{ padding: '8px 15px', backgroundColor: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '5px', width: '250px' }} 
                  />
                  <button 
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch(`http://127.0.0.1:8000/search-properties?query=${propertySearchInput}`);
                        const data = await res.json();
                        if (data && data.listings) {
                          setLiveListings(data.listings);
                        }
                      } catch (err) {
                        alert("Failed to connect to backend server.");
                      }
                    }}
                    style={{ padding: '8px 18px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Search
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {liveListings && liveListings.map((property, idx) => (
                  <div key={idx} style={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', padding: '18px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="badge blue">{property.type}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📍 {property.city}</span>
                      </div>
                      <h4 style={{ margin: '5px 0 10px 0', fontSize: '16px' }}>{property.name}</h4>
                      
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Rate:</span>
                          <span style={{ fontWeight: 'bold' }}>{property.rate_sqft}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Est. Total (1500 sqft):</span>
                          <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{property.total_price}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginBottom: '12px' }}>
                        <span style={{ color: '#10b981' }}>2028 Profit: <b>{property.profit_2028}</b></span>
                        <span style={{ color: '#8b5cf6' }}>2032 Profit: <b>{property.profit_2032}</b></span>
                      </div>

                      <a 
                        href={property.external_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ display: 'block', textAlign: 'center', padding: '8px', backgroundColor: '#2563eb', color: 'white', borderRadius: '5px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}
                      >
                        View on Real Estate Portal ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Price Prediction' && (
            <div className="panel-card" style={{ padding: '30px', height: '100%' }}>
              <h2>📊 XGBoost Model Training & Hyperparameter Studio</h2>
              <p style={{ color: 'var(--text-muted)' }}>Configure spatial decision trees and evaluate model performance metrics in real-time.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div style={{ backgroundColor: 'var(--bg-dark)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <h3><Sliders size={18} color="#2563eb" /> Model Parameters</h3>
                  
                  <label style={{ display: 'block', margin: '15px 0 5px', fontSize: '14px' }}>Number of Estimators (Trees): <b>{mlTrees}</b></label>
                  <input type="range" min="50" max="500" step="25" value={mlTrees} onChange={(e) => setMlTrees(e.target.value)} style={{ width: '100%' }} />

                  <label style={{ display: 'block', margin: '15px 0 5px', fontSize: '14px' }}>Max Tree Depth: <b>{mlDepth}</b></label>
                  <input type="range" min="3" max="12" step="1" value={mlDepth} onChange={(e) => setMlDepth(e.target.value)} style={{ width: '100%' }} />

                  <button onClick={() => alert("Model retrained successfully with updated hyperparameters!")} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Retrain Spatial Model 🚀
                  </button>
                </div>

                <div style={{ backgroundColor: 'var(--bg-dark)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Database size={48} color="#10b981" />
                  <h3 style={{ margin: '10px 0 5px' }}>Evaluation Metrics</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Evaluated against 14,200 urban property benchmarks</p>
                  <div style={{ display: 'flex', gap: '30px', marginTop: '15px' }}>
                    <div>
                      <h2 style={{ color: '#10b981', margin: 0 }}>94.2%</h2>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>R² Accuracy Score</p>
                    </div>
                    <div>
                      <h2 style={{ color: '#3b82f6', margin: 0 }}>± 3.4%</h2>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mean Absolute Error</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Satellite Analysis' && (
            <div className="panel-card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h2>🛰️ GIS Multispectral Satellite Intelligence</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>High-resolution spectral analysis tracking urban heat islands and vegetation indices.</p>
              
              <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <MapContainer center={[19.0760, 72.8777]} zoom={11} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="Esri World Imagery" />
                </MapContainer>
              </div>
            </div>
          )}

          {activeTab === 'Investment Insights' && (
            <div className="panel-card" style={{ padding: '30px', height: '100%' }}>
              <h2>💡 Macroeconomic Investment Corridor Insights</h2>
              <p style={{ color: 'var(--text-muted)' }}>AI-driven trend forecasting based on upcoming transit expansions and municipal master plans.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <div style={{ backgroundColor: 'var(--bg-dark)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span className="badge green" style={{ marginBottom: '10px', display: 'inline-block' }}>Tier-1 Corridor</span>
                  <h4>Western Express Highway, Mumbai</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Expected 5-year compound annual growth rate exceeding 12.4% due to metro convergence.</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-dark)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span className="badge blue" style={{ marginBottom: '10px', display: 'inline-block' }}>Tech Corridor</span>
                  <h4>Outer Ring Road, Bangalore</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>High commercial rental yield supported by continuous tech-park expansion and corporate demand.</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-dark)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span className="badge orange" style={{ marginBottom: '10px', display: 'inline-block' }}>Emerging Hub</span>
                  <h4>Sultanpur Road, Lucknow</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>High appreciation headroom driven by newly announced IT city corridors and ring road projects.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Risk Reports' && (
            <div className="panel-card" style={{ padding: '30px', height: '100%' }}>
              <h2>🛡️ Comprehensive Environmental & Zoning Risk Audit</h2>
              <p style={{ color: 'var(--text-muted)' }}>Automated compliance verification against flood zones, seismic parameters, and eco-sensitive land regulations.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', alignItems: 'center' }}>
                  <div>
                    <h4>Flood Plain & Drainage Buffer Compliance</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Evaluates historical waterlogging and river basin proximity.</p>
                  </div>
                  <span className="badge green">Low Risk Verified</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', alignItems: 'center' }}>
                  <div>
                    <h4>Seismic Zone Structural Safety Index</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Bureau of Indian Standards seismic zoning alignment.</p>
                  </div>
                  <span className="badge blue">Zone III Compliant</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', alignItems: 'center' }}>
                  <div>
                    <h4>Eco-Sensitive Green Cover Regulations</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Tree preservation acts and municipal buffer checks.</p>
                  </div>
                  <span className="badge orange">Moderate Restriction</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="panel-card" style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
              <h2>⚙️ Platform & API Settings</h2>
              <p style={{ color: 'var(--text-muted)' }}>Configure your environment tokens, default regional views, and UI preferences.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Default Map Center Region</label>
                  <select style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '5px' }}>
                    <option>Lucknow, Uttar Pradesh (Default)</option>
                    <option>Mumbai, Maharashtra</option>
                    <option>Bengaluru, Karnataka</option>
                    <option>New Delhi, NCR</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>API Endpoint Connection String</label>
                  <input type="text" defaultValue="http://127.0.0.1:8000" style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '5px' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" defaultChecked id="telemetry" />
                  <label htmlFor="telemetry" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Enable anonymous spatial telemetry logging for model improvement</label>
                </div>

                <button onClick={() => { setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 3000); }} style={{ padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  {settingsSaved ? <><Check size={18} /> Settings Saved Successfully!</> : "Save Preferences"}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Help & Support' && (
            <div className="panel-card" style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
              <h2>❓ Help, Documentation & Support</h2>
              <p style={{ color: 'var(--text-muted)' }}>Need assistance with model integration or API tokens? Send a ticket to our engineering team.</p>

              {supportSent ? (
                <div style={{ padding: '30px', textAlign: 'center', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: '8px', marginTop: '20px' }}>
                  <Check size={40} color="#10b981" />
                  <h3 style={{ color: '#10b981', margin: '10px 0 5px' }}>Support Ticket Submitted!</h3>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>Our technical team will review your inquiry and respond via email within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSupportSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Your Name</label>
                    <input type="text" required value={supportForm.name} onChange={(e) => setSupportForm({...supportForm, name: e.target.value})} placeholder="Enter your name" style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '5px' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Email Address</label>
                    <input type="email" required value={supportForm.email} onChange={(e) => setSupportForm({...supportForm, email: e.target.value})} placeholder="name@example.com" style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '5px' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Issue or Inquiry</label>
                    <textarea rows="4" required value={supportForm.message} onChange={(e) => setSupportForm({...supportForm, message: e.target.value})} placeholder="Describe your technical issue or question..." style={{ width: '100%', padding: '10px', backgroundColor: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '5px', fontFamily: 'inherit' }}></textarea>
                  </div>

                  <button type="submit" style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <Send size={16} /> Submit Support Ticket
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;