import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { demoProperties } from '../data/demoProperties';
import Spotlight from '../components/ui/Spotlight';
import BackgroundBeams from '../components/ui/BackgroundBeams';

export default function Overview() {
  return (
    <section className="overview" style={{ position: 'relative', overflow: 'hidden', padding: '2rem' }}>
      {/* Background Visual Effects (Hero Only) */}
      <BackgroundBeams />
      <Spotlight fill="#62d4e4" />

      {/* Left Hero Area */}
      <div className="hero-copy" style={{ position: 'relative', zIndex: 2, maxWidth: '800px', marginBottom: '4rem' }}>
        <span className="eyebrow" style={{ display: 'block', color: '#62d4e4', marginBottom: '1rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
          Property intelligence platform
        </span>
        <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 700 }}>
          Understand the property <br />
          <em style={{ color: '#8ab4f8', fontStyle: 'normal' }}>before you commit.</em>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#8d9aa8', marginBottom: '2rem', lineHeight: 1.6 }}>
          ProphecyAI brings together the property, surroundings, accessibility, 
          environmental context and available market evidence to help you understand 
          overall suitability. Built for India.
        </p>
        
        <div className="hero-actions" style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
          <Link to="/analyze" className="primary-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#62d4e4', color: '#06242b', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Analyze a property <ArrowRight size={17} />
          </Link>
          <Link to="/properties" className="secondary-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgba(98, 212, 228, 0.1)', color: '#62d4e4', border: '1px solid rgba(98, 212, 228, 0.2)', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Explore Properties
          </Link>
        </div>

        <div className="hero-stat" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#8d9aa8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <b style={{ color: '#fff' }}>01</b><span>Discover</span>
          </div>
          <ChevronRight size={16} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <b style={{ color: '#fff' }}>02</b><span>Analyze</span>
          </div>
          <ChevronRight size={16} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <b style={{ color: '#fff' }}>03</b><span>Explore 3D</span>
          </div>
        </div>
      </div>

      {/* Right Side Cards Area (Kept visually clean and uncluttered) */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: '4rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#fff' }}>Featured Demonstrations</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {demoProperties.slice(0, 3).map((demo) => (
            <div key={demo.id} style={{ background: '#151b23', border: '1px solid #27303b', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 4px 0' }}>{demo.name}</h4>
                  <p style={{ color: '#8d9aa8', margin: 0, fontSize: '0.9rem' }}>{demo.city}</p>
                </div>
                <div style={{ background: 'rgba(98,212,228,0.1)', color: '#62d4e4', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                  82 / 100
                </div>
              </div>
              <p style={{ color: '#8d9aa8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {demo.scenario}
              </p>
              <Link to={`/properties/${demo.id}`} className="secondary-button" style={{ display: 'inline-flex', width: '100%', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', textDecoration: 'none' }}>
                Explore <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
