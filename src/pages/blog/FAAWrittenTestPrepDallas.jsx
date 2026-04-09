import { BlogLayout, BottomCTA, prose } from '../../components/BlogLayout';
import { MapPin } from 'lucide-react';

const cities = [
  { name: 'Dallas', airports: ['KDAL – Love Field', 'KDFW – Dallas/Fort Worth International', 'KADD – Addison Airport'], testCenters: 'Multiple CATS and PSI centers in Dallas, Plano, and Garland' },
  { name: 'Fort Worth', airports: ['KFTW – Meacham International', 'KAFW – Alliance Fort Worth', 'KGPM – Grand Prairie Municipal'], testCenters: 'CATS/PSI locations in Fort Worth and Arlington' },
  { name: 'Irving / Las Colinas', airports: ['Near DFW International'], testCenters: 'Testing centers near DFW corridor' },
  { name: 'Plano / McKinney', airports: ['KTKI – McKinney National Airport'], testCenters: 'Suburban testing centers in Collin County' },
];

const flightSchools = [
  { name: 'Aviation Institute of Maintenance (AIM) – DFW', type: 'Professional aviation programs, also offers ground school' },
  { name: 'Doss Aviation (various TX locations)', type: 'Ab-initio through commercial training, includes ground school' },
  { name: 'Epic Flight Academy (regional programs in TX)', type: 'Private through ATP, structured ground school' },
  { name: 'Independent CFIs at Addison Airport', type: 'One-on-one ground school and checkride prep' },
  { name: 'Commemorative Air Force (Meacham)', type: 'Flight school and aviation education programs' },
];

export default function FAAWrittenTestPrepDallas() {
  return (
    <BlogLayout
      title="FAA Written Test Prep in Dallas & DFW — Study Online, Test Locally"
      description="FAA written test prep for Dallas, Fort Worth, and DFW area student pilots. Find testing centers near Dallas, top DFW flight schools, and start your online ground school today."
      slug="/faa-written-test-prep-dallas"
    >
      <div style={{ marginBottom: 48 }}>
        <div style={prose.meta}>
          <span style={prose.tag}>Dallas Pilots</span>
          <span style={prose.tag}>DFW Area</span>
          <span style={prose.tag}>Texas Aviation</span>
          <span>10 min read</span>
          <span>Updated April 2026</span>
        </div>
        <h1 style={prose.h1}>FAA Written Test Prep for Dallas & DFW Student Pilots: Study Online, Test Locally</h1>
        <p style={{ ...prose.p, fontSize: 18, color: '#cbd5e1' }}>
          The Dallas–Fort Worth metroplex is one of the most active aviation regions in the country —
          home to DFW International (the world's 4th busiest airport), dozens of general aviation airports,
          and a thriving community of student pilots. If you're training to fly in the DFW area, here's
          everything you need to know about FAA written test prep and where to take your knowledge test locally.
        </p>
      </div>

      <hr style={prose.divider} />

      <h2 style={prose.h2}>Why DFW is a Unique Training Environment</h2>
      <p style={prose.p}>
        Learning to fly in the Dallas–Fort Worth area means operating in some of the most complex airspace
        in the United States. DFW Class B airspace tops out at 8,000 feet and covers a massive swath
        of North Texas. Students training here get exposure to:
      </p>
      <ul style={prose.ul}>
        <li style={prose.li}><strong>Class B airspace</strong> surrounding DFW International — requires ATC clearance, Mode C transponder, and two-way radio</li>
        <li style={prose.li}><strong>Class C airspace</strong> at Dallas Love Field (KDAL) and Fort Worth Meacham (KFTW)</li>
        <li style={prose.li}><strong>Class D airspace</strong> at multiple satellite airports throughout the metroplex</li>
        <li style={prose.li}><strong>Terminal radar service areas (TRSAs)</strong> and the DFW TRACON coverage area</li>
        <li style={prose.li}><strong>Texas climate considerations</strong> — severe convective weather, thunderstorms, spring ice storms, and summer density altitude challenges</li>
      </ul>
      <div style={prose.infoBox}>
        <p style={{ ...prose.p, color: '#38bdf8', fontWeight: 700, marginBottom: 8 }}>🌡️ Texas-Specific Knowledge Areas</p>
        <p style={{ ...prose.p, marginBottom: 0 }}>
          If you're training in Texas, pay extra attention to density altitude (hot summers + elevation
          of 400–600 ft MSL at DFW area airports), severe convective weather avoidance, and the complex
          airspace around DFW International. These topics will be directly relevant to your checkride
          oral exam as well as the written test.
        </p>
      </div>

      <h2 style={prose.h2}>FAA Written Test Centers in the Dallas Area</h2>
      <p style={prose.p}>
        You can take the FAA Airman Knowledge Test at any CATS or PSI-approved testing center.
        In the DFW area, options include locations in:
      </p>
      {cities.map(({ name, airports, testCenters }) => (
        <div key={name} style={{
          padding: '16px 18px', marginBottom: 12,
          background: 'rgba(255,255,255,0.03)', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <MapPin size={15} color="#38bdf8" />
            <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 700, marginBottom: 0, fontSize: 16 }}>{name}</p>
          </div>
          <p style={{ ...prose.p, marginBottom: 4, fontSize: 14 }}>
            <strong style={{ color: '#94a3b8' }}>Nearby airports:</strong> {airports.join(', ')}
          </p>
          <p style={{ ...prose.p, marginBottom: 0, fontSize: 14 }}>
            <strong style={{ color: '#94a3b8' }}>Testing:</strong> {testCenters}
          </p>
        </div>
      ))}
      <p style={prose.p}>
        To find the exact address and schedule availability, visit <strong>1800airtesting.com</strong> (CATS)
        or <strong>faa.psiexams.com</strong> (PSI) and search by ZIP code or city.
      </p>

      <h2 style={prose.h2}>Flight Schools in the DFW Metroplex</h2>
      <p style={prose.p}>
        Many DFW-area flight schools provide ground school instruction alongside flight training.
        However, more and more student pilots are choosing online ground school for flexibility —
        study on your schedule, then do your flying at your local school.
      </p>
      {flightSchools.map(({ name, type }) => (
        <div key={name} style={{
          display: 'flex', gap: 12, padding: '12px 16px', marginBottom: 8,
          background: 'rgba(255,255,255,0.03)', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <span style={{ color: '#38bdf8', fontSize: 18, flexShrink: 0 }}>✈️</span>
          <div>
            <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 700, marginBottom: 2, fontSize: 15 }}>{name}</p>
            <p style={{ ...prose.p, marginBottom: 0, fontSize: 13 }}>{type}</p>
          </div>
        </div>
      ))}

      <h2 style={prose.h2}>Online Ground School for DFW Pilots — Study Anywhere</h2>
      <p style={prose.p}>
        One major advantage of online ground school: you can study from anywhere in the Dallas–Fort Worth
        area — at home, at your airport's pilot lounge, or between flights. Pilot Essentials is
        100% online and designed for self-paced learning, so you can work through the 17-chapter
        curriculum on your own schedule.
      </p>
      <p style={prose.p}>
        Your CFI at whatever DFW school you're training with will still provide your required
        endorsement and flight instruction — Pilot Essentials handles the ground knowledge portion
        so you can maximize your cockpit time.
      </p>

      <h2 style={prose.h2}>DFW Airspace You Must Know for the FAA Written Test</h2>
      <p style={prose.p}>
        Several PAR exam questions involve reading sectional chart excerpts that resemble the DFW area airspace.
        Even if your questions don't include DFW specifically, understanding the DFW airspace layout helps
        you master these concepts:
      </p>
      <ul style={prose.ul}>
        <li style={prose.li}><strong>Class B airspace depiction:</strong> Concentric rings on a sectional chart with altitude floors and ceilings labeled (e.g., "80/30" = 8,000 MSL top, 3,000 MSL floor)</li>
        <li style={prose.li}><strong>Class B entry requirements:</strong> ATC clearance required, not just radio contact — test questions frequently ask about this distinction</li>
        <li style={prose.li}><strong>VFR corridors and flyways:</strong> How to transit under or around Class B without clearance</li>
        <li style={prose.li}><strong>Mode C veil:</strong> Within 30 NM of DFW, all aircraft must have a Mode C transponder</li>
      </ul>

      <h2 style={prose.h2}>Frequently Asked Questions — Dallas Pilots</h2>
      {[
        {
          q: 'Can I take my FAA written test without a CFI if I use an online course?',
          a: 'Yes. An approved online ground school that provides an endorsement under 14 CFR 61.35 qualifies you to take the written test. You don\'t need a traditional CFI sign-off if your online course is FAA-approved.',
        },
        {
          q: 'Is there a testing center at Addison Airport (KADD)?',
          a: 'Testing center availability changes. Check 1800airtesting.com or faa.psiexams.com for current locations near Addison. There are typically multiple testing centers within 20 minutes of most DFW-area airports.',
        },
        {
          q: 'Does the weather in Texas affect my FAA knowledge test study plan?',
          a: 'It\'s a great idea to pay extra attention to severe convective weather, thunderstorm avoidance, and density altitude — these topics are highly testable and directly relevant to flying in Texas.',
        },
      ].map(({ q, a }) => (
        <div key={q} style={{ marginBottom: 20 }}>
          <h3 style={{ ...prose.h3, marginTop: 0 }}>{q}</h3>
          <p style={prose.p}>{a}</p>
        </div>
      ))}

      <BottomCTA
        headline="DFW Student Pilots: Start Your FAA Written Test Prep Today"
        sub="Study online with Pilot Essentials' 17-chapter ground school, then take your FAA written test at a convenient Dallas–Fort Worth area testing center. Start free — no credit card required."
      />
    </BlogLayout>
  );
}
