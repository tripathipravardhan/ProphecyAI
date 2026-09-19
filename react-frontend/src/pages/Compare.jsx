import { Layers3, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { demoProperties } from '../data/demoProperties';

export default function Compare() {
  const [propA, propB] = demoProperties.slice(0, 2);

  return (
    <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <span className="eyebrow" style={{ display: 'block', color: '#62d4e4', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Property Comparison</span>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Compare Spatial Context.</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {[propA, propB].map((prop, i) => (
          <div key={prop.id} style={{ background: '#151b23', border: '1px solid #27303b', borderRadius: '12px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#fff' }}>Property {i === 0 ? 'A' : 'B'}</h2>
            <p style={{ color: '#8d9aa8', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={16} /> {prop.name}
            </p>
            
            <div style={{ background: 'rgba(98, 212, 228, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <b style={{ color: '#62d4e4' }}>Recommendation</b>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#62d4e4' }}>{i === 0 ? '82' : '77'} / 100</span>
            </div>
            
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff', borderBottom: '1px solid #27303b', paddingBottom: '8px' }}>Nearby Amenities</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#8d9aa8' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1a222c' }}>
                <span>Metro</span> <b style={{ color: '#fff' }}>{i === 0 ? '650 m' : '1.4 km'}</b>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1a222c' }}>
                <span>Hospital</span> <b style={{ color: '#fff' }}>{i === 0 ? '1.2 km' : '600 m'}</b>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1a222c' }}>
                <span>School</span> <b style={{ color: '#fff' }}>{i === 0 ? '800 m' : '1.1 km'}</b>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span>Park</span> <b style={{ color: '#fff' }}>{i === 0 ? '350 m' : '200 m'}</b>
              </li>
            </ul>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to={`/properties/${prop.id}`} style={{ flex: 1, padding: '10px', background: '#27303b', color: '#fff', borderRadius: '6px', textDecoration: 'none', textAlign: 'center', fontWeight: 'bold' }}>
                View Property
              </Link>
              <Link to={`/explore?property=${prop.id}`} style={{ flex: 1, padding: '10px', background: '#62d4e4', color: '#06242b', borderRadius: '6px', textDecoration: 'none', textAlign: 'center', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Layers3 size={16} /> 3D Context
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
