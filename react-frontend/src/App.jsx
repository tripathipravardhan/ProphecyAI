import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { CircleHelp, Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';

import Overview from './pages/Overview';
import Analyze from './pages/Analyze';
import Properties from './pages/Properties';
import PropertyIntelligence from './pages/PropertyIntelligence';
import SpatialExplore from './pages/SpatialExplore';
import Compare from './pages/Compare';
import Insights from './pages/Insights';

import logoImg from './assets/logo.jpg';
import './App.css';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Dynamic user email state initialized from localStorage or default
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('prophecy_user_email') || 'pravardhantripathi@gmail.com';
  });

  const avatarInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'P';

  return (
    <div className="app-shell">
      <header className="topbar">
        {/* Brand logo & gradient glowing title */}
        <Link to="/" className="brand" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              position: 'relative', 
              width: '38px', 
              height: '38px', 
              borderRadius: '10px', 
              overflow: 'hidden', 
              border: '1px solid rgba(98, 212, 228, 0.4)', 
              boxShadow: '0 0 16px rgba(98, 212, 228, 0.35)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: '#0e151d' 
            }}
          >
            <img 
              src={logoImg} 
              alt="ProphecyAI Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span 
              style={{ 
                fontSize: '21px', 
                fontWeight: 900, 
                letterSpacing: '-0.03em', 
                background: 'linear-gradient(135deg, #ffffff 30%, #62d4e4 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(98, 212, 228, 0.25)'
              }}
            >
              Prophecy<span style={{ color: '#62d4e4', WebkitTextFillColor: '#62d4e4' }}>AI</span>
            </span>
            <span 
              style={{ 
                fontSize: '9px', 
                fontWeight: 700, 
                color: '#62d4e4', 
                letterSpacing: '1.5px', 
                textTransform: 'uppercase',
                opacity: 0.85
              }}
            >
              Spatial Intelligence
            </span>
          </div>
        </Link>

        <div className="top-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Clickable Help Button opening Gmail compose directly */}
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=pravardhantripathi@gmail.com&su=ProphecyAI%20Help%20%26%20Support%20Query" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-button"
            style={{ 
              textDecoration: 'none', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: '#8d9aa8', 
              fontSize: '13px', 
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
            onClick={(e) => {
              // Open Gmail web compose in a new tab reliably
              window.open(
                'https://mail.google.com/mail/?view=cm&fs=1&to=pravardhantripathi@gmail.com&su=ProphecyAI%20Help%20%26%20Support%20Query',
                '_blank'
              );
              e.preventDefault();
            }}
            title="Open Gmail to send query to pravardhantripathi@gmail.com"
          >
            <CircleHelp size={17} color="#62d4e4" /> Help
          </a>

          {/* User Profile Badge showing Avatar Initial Symbol + Email ID */}
          <div 
            className="user-profile-badge" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: '#151b23', 
              border: '1px solid #27303b', 
              padding: '4px 12px 4px 4px', 
              borderRadius: '20px', 
              fontSize: '12px', 
              color: '#fff',
              cursor: 'pointer'
            }}
            onClick={() => {
              const newEmail = prompt('Enter your Gmail / Email ID:', userEmail);
              if (newEmail && newEmail.includes('@')) {
                const cleaned = newEmail.trim();
                setUserEmail(cleaned);
                localStorage.setItem('prophecy_user_email', cleaned);
              }
            }}
            title="Click to change active account email"
          >
            <span 
              className="profile-avatar" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '26px', 
                height: '26px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #62d4e4, #1b7a8a)', 
                color: '#06242b', 
                fontWeight: 800, 
                fontSize: '13px',
                textTransform: 'uppercase'
              }}
            >
              {avatarInitial}
            </span>
            <span style={{ fontWeight: 600, color: '#dce2e8', fontSize: '12px' }}>
              {userEmail}
            </span>
          </div>

          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      
      <main>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:propertyId" element={<PropertyIntelligence />} />
          <Route path="/explore" element={<SpatialExplore />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </main>
    </div>
  );
}
