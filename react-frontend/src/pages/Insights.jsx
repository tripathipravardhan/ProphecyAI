import { Activity, ShieldCheck, TrendingUp, Zap } from 'lucide-react';

export default function Insights() {
  return (
    <section style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <span className="eyebrow" style={{ display: 'block', color: '#62d4e4', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Market Overview</span>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Spatial & Market Insights.</h1>
      
      <p style={{ color: '#8d9aa8', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: 1.6 }}>
        Understand what an area looks like from a property decision perspective, based on aggregate spatial data and historical trends.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ background: '#151b23', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27303b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#62d4e4', marginBottom: '1rem' }}>
            <Zap size={20} />
            <h3 style={{ margin: 0, color: '#fff' }}>Connectivity Trends</h3>
          </div>
          <p style={{ color: '#8d9aa8', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Emerging metro corridors show a 15-20% higher appreciation rate compared to locations relying solely on arterial road networks.
          </p>
        </div>

        <div style={{ background: '#151b23', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27303b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7dd3a8', marginBottom: '1rem' }}>
            <Activity size={20} />
            <h3 style={{ margin: 0, color: '#fff' }}>Healthcare Access</h3>
          </div>
          <p style={{ color: '#8d9aa8', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Proximity to multi-specialty diagnostic centers is the second highest requested amenity for residential buying decisions.
          </p>
        </div>

        <div style={{ background: '#151b23', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27303b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f37e7e', marginBottom: '1rem' }}>
            <ShieldCheck size={20} />
            <h3 style={{ margin: 0, color: '#fff' }}>Environmental Context</h3>
          </div>
          <p style={{ color: '#8d9aa8', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Green cover loss in rapidly developing zones correlates with increased localized flooding risk during monsoons.
          </p>
        </div>
        
        <div style={{ background: '#151b23', padding: '1.5rem', borderRadius: '12px', border: '1px solid #27303b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f4cf73', marginBottom: '1rem' }}>
            <TrendingUp size={20} />
            <h3 style={{ margin: 0, color: '#fff' }}>Value Trajectory</h3>
          </div>
          <p style={{ color: '#8d9aa8', fontSize: '0.9rem', lineHeight: 1.5 }}>
            The AI recommendation score heavily weights planned infrastructure (e.g. upcoming trade hubs) over existing saturated markets.
          </p>
        </div>
      </div>
    </section>
  );
}
