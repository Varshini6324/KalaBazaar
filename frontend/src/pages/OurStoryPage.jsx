import { Link } from 'react-router-dom';

const stats = [
  { value: '500+', label: 'Artisans Empowered' },
  { value: '20+', label: 'Craft Traditions' },
  { value: '15,000+', label: 'Handmade Products' },
  { value: '28', label: 'States Represented' },
];

const values = [
  {
    icon: '🪔',
    title: 'Preserving Heritage',
    description:
      'Every craft tradition we support carries centuries of cultural wisdom. We work to ensure these skills are passed to future generations.',
  },
  {
    icon: '🤝',
    title: 'Fair Trade Always',
    description:
      'Artisans on KalaBazaar earn what they deserve. We are committed to transparent pricing and direct payments with zero exploitation.',
  },
  {
    icon: '🌿',
    title: 'Sustainable Making',
    description:
      'Handmade is inherently sustainable. We encourage artisans to use natural, locally sourced materials that respect the earth.',
  },
  {
    icon: '✨',
    title: 'Stories Behind Objects',
    description:
      'We believe every handmade piece carries a story. When you buy from KalaBazaar, you connect with the human behind the craft.',
  },
];

const timeline = [
  {
    year: '2019',
    title: 'The Seed',
    description:
      'Founder Meera Iyer visited a pottery village in Rajasthan and met an 80-year-old craftsman whose work had never left his district. That moment sparked everything.',
  },
  {
    year: '2020',
    title: 'First 10 Artisans',
    description:
      "KalaBazaar launched with 10 artisans across 4 states. Orders were packed by hand in Meera's apartment.",
  },
  {
    year: '2022',
    title: 'Growing the Community',
    description:
      'We crossed 200 artisans and launched our vendor verification program to ensure quality and authenticity for every buyer.',
  },
  {
    year: '2024',
    title: 'A National Movement',
    description:
      "Today KalaBazaar is home to 500+ verified artisans from 28 states, bringing India's finest handmade crafts to doorsteps across the country.",
  },
];

const OurStoryPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1E2D1', fontFamily: 'Georgia, serif' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #5a0828 0%, #810B38 50%, #a0522d 100%)',
        padding: '5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 0, transparent 40px), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 0, transparent 40px)',
        }} />
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ color: '#f0b87a', letterSpacing: '0.25em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Est. 2019 · Made in India
          </p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 'bold', margin: '0 0 1.5rem', lineHeight: 1.1 }}>
            Crafted with Love.<br />Sold with Purpose.
          </h1>
          <p style={{ color: '#e8c9a0', fontSize: '1.1rem', lineHeight: 1.8, margin: 0 }}>
            KalaBazaar was born from a simple belief — that the most beautiful things in the world
            are made by human hands, and the people who make them deserve to be celebrated.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ backgroundColor: '#810B38', padding: '2rem' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem', textAlign: 'center',
        }}>
          {stats.map((s) => (
            <div key={s.label}>
              <p style={{ color: '#f0b87a', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{s.value}</p>
              <p style={{ color: '#e8c9a0', fontSize: '0.8rem', margin: '0.25rem 0 0', letterSpacing: '0.05em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#a0522d', letterSpacing: '0.15em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Our Mission
            </p>
            <h2 style={{ color: '#810B38', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 1.25rem', lineHeight: 1.3 }}>
              Connecting Makers with the World
            </h2>
            <p style={{ color: '#5a3e2b', lineHeight: 1.9, fontSize: '0.97rem', marginBottom: '1rem' }}>
              India is home to thousands of craft traditions — from Madhubani paintings to Banarasi
              weaves, Bidriware to Blue Pottery. Yet most artisans remain invisible, their work never
              reaching buyers who would truly value it.
            </p>
            <p style={{ color: '#5a3e2b', lineHeight: 1.9, fontSize: '0.97rem' }}>
              KalaBazaar bridges that gap. We are a marketplace built on trust, transparency, and a
              deep respect for the time and skill that goes into every handmade piece.
            </p>
          </div>
          <div style={{
            backgroundColor: '#fff', borderRadius: '16px', padding: '2.5rem',
            borderLeft: '5px solid #810B38', boxShadow: '0 4px 20px rgba(129,11,56,0.1)',
          }}>
            <p style={{ color: '#810B38', fontSize: '1.3rem', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
              "When you buy handmade, you are not just buying a product — you are buying hundreds of
              hours of passion, skill, and someone's legacy."
            </p>
            <p style={{ color: '#a0522d', fontSize: '0.85rem', marginTop: '1rem', fontWeight: 'bold' }}>
              — Meera Iyer, Founder
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ backgroundColor: '#fff', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ color: '#a0522d', letterSpacing: '0.15em', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.5rem' }}>
            How We Got Here
          </p>
          <h2 style={{ color: '#810B38', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', margin: '0 0 3rem' }}>
            Our Journey
          </h2>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '80px', top: 0, bottom: 0, width: '2px', backgroundColor: '#d4a574' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {timeline.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: '80px', textAlign: 'right', paddingRight: '1rem', position: 'relative' }}>
                    <span style={{ color: '#810B38', fontWeight: 'bold', fontSize: '1rem' }}>{item.year}</span>
                    <div style={{
                      position: 'absolute', right: '-6px', top: '4px',
                      width: '12px', height: '12px', borderRadius: '50%',
                      backgroundColor: '#810B38', border: '2px solid #fff',
                    }} />
                  </div>
                  <div style={{ paddingBottom: '0.5rem' }}>
                    <h3 style={{ color: '#2d0f06', fontSize: '1.05rem', fontWeight: 'bold', margin: '0 0 0.4rem' }}>{item.title}</h3>
                    <p style={{ color: '#5a3e2b', lineHeight: 1.8, fontSize: '0.9rem', margin: 0 }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
        <p style={{ color: '#a0522d', letterSpacing: '0.15em', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.5rem' }}>
          What We Stand For
        </p>
        <h2 style={{ color: '#810B38', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', margin: '0 0 2.5rem' }}>
          Our Values
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {values.map((v) => (
            <div key={v.title} style={{
              backgroundColor: '#fff', borderRadius: '12px', padding: '1.75rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderTop: '4px solid #810B38',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{v.icon}</div>
              <h3 style={{ color: '#2d0f06', fontSize: '1rem', fontWeight: 'bold', margin: '0 0 0.6rem' }}>{v.title}</h3>
              <p style={{ color: '#5a3e2b', fontSize: '0.875rem', lineHeight: 1.8, margin: 0 }}>{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #810B38, #5a0828)', padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 1rem' }}>
          Be Part of the Story
        </h2>
        <p style={{ color: '#e8c9a0', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Every purchase supports a real artisan family. Explore our marketplace and find something made just for you.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/shop" style={{
            backgroundColor: '#f0b87a', color: '#5a0828',
            padding: '0.85rem 2rem', borderRadius: '8px',
            fontFamily: 'Georgia, serif', fontWeight: 'bold',
            textDecoration: 'none', fontSize: '1rem',
          }}>
            Shop Handmade
          </Link>
          <Link to="/artisans" style={{
            backgroundColor: 'transparent', color: '#fff',
            padding: '0.85rem 2rem', borderRadius: '8px',
            border: '2px solid #fff',
            fontFamily: 'Georgia, serif', fontWeight: 'bold',
            textDecoration: 'none', fontSize: '1rem',
          }}>
            Meet Our Artisans
          </Link>
        </div>
      </div>

    </div>
  );
};

export default OurStoryPage;