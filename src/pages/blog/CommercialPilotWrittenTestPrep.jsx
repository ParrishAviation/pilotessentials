import { BlogLayout, BottomCTA, prose } from '../../components/BlogLayout';

export default function CommercialPilotWrittenTestPrep() {
  return (
    <BlogLayout
      title="Commercial Pilot Written Test Prep — Pass the CAX Exam"
      description="Complete guide to commercial pilot written test prep (CAX). Topics, regulations, study strategy, and everything you need to pass your commercial knowledge test first attempt."
      slug="/commercial-pilot-written-test-prep"
    >
      <div style={{ marginBottom: 48 }}>
        <div style={prose.meta}>
          <span style={prose.tag}>Commercial Pilot</span>
          <span style={prose.tag}>CAX Exam</span>
          <span>10 min read</span>
          <span>Updated April 2026</span>
        </div>
        <h1 style={prose.h1}>Commercial Pilot Written Test Prep: From Student to Professional — Pass Your CAX First Attempt</h1>
        <p style={{ ...prose.p, fontSize: 18, color: '#cbd5e1' }}>
          The Commercial Pilot Airman Knowledge Test (CAX) is your gateway to a professional aviation career.
          Unlike the Private Pilot exam, the CAX goes deeper into aerodynamics, high-performance aircraft systems,
          and commercial operating regulations. Here's how to prep efficiently and pass first try.
        </p>
      </div>

      <hr style={prose.divider} />

      <h2 style={prose.h2}>CAX Exam Overview</h2>
      <div style={prose.infoBox}>
        <p style={{ ...prose.p, marginBottom: 8, color: '#38bdf8', fontWeight: 700 }}>📋 CAX Exam Facts</p>
        <ul style={prose.ul}>
          <li style={prose.li}><strong>Questions:</strong> 100 multiple-choice</li>
          <li style={prose.li}><strong>Time limit:</strong> 3 hours</li>
          <li style={prose.li}><strong>Passing score:</strong> 70% (70/100 correct)</li>
          <li style={prose.li}><strong>Cost:</strong> ~$175–$200</li>
          <li style={prose.li}><strong>Prerequisite:</strong> Private pilot certificate + instrument rating (for ASEL/AMEL)</li>
          <li style={prose.li}><strong>Flight hours required:</strong> 250 total (150 for Part 141 programs)</li>
          <li style={prose.li}><strong>Valid for:</strong> 24 calendar months</li>
        </ul>
      </div>

      <h2 style={prose.h2}>How the CAX Differs From the Private Pilot Exam</h2>
      <p style={prose.p}>
        The CAX question bank is larger and the questions are more nuanced. The exam tests commercial-level
        knowledge including complex aircraft systems, turbocharged engines, pressurization, and
        the commercial privilege regulations (Part 135 basics). Key differences:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '20px 0' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '18px 16px' }}>
          <p style={{ ...prose.p, color: '#38bdf8', fontWeight: 700, marginBottom: 10 }}>PAR (Private)</p>
          <ul style={{ ...prose.ul, marginBottom: 0 }}>
            <li style={{ ...prose.li, fontSize: 14 }}>60 questions</li>
            <li style={{ ...prose.li, fontSize: 14 }}>Basic aerodynamics</li>
            <li style={{ ...prose.li, fontSize: 14 }}>Simple aircraft systems</li>
            <li style={{ ...prose.li, fontSize: 14 }}>VFR operations only</li>
            <li style={{ ...prose.li, fontSize: 14 }}>14 CFR Parts 61 & 91 basics</li>
          </ul>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, padding: '18px 16px' }}>
          <p style={{ ...prose.p, color: '#38bdf8', fontWeight: 700, marginBottom: 10 }}>CAX (Commercial)</p>
          <ul style={{ ...prose.ul, marginBottom: 0 }}>
            <li style={{ ...prose.li, fontSize: 14 }}>100 questions</li>
            <li style={{ ...prose.li, fontSize: 14 }}>Advanced aerodynamics (high-speed, swept wing)</li>
            <li style={{ ...prose.li, fontSize: 14 }}>Complex systems (turbocharger, retractable gear)</li>
            <li style={{ ...prose.li, fontSize: 14 }}>VFR & IFR operations</li>
            <li style={{ ...prose.li, fontSize: 14 }}>Part 135, commercial privileges & limitations</li>
          </ul>
        </div>
      </div>

      <h2 style={prose.h2}>CAX Topic Breakdown</h2>
      {[
        { area: 'Weather & Weather Services', pct: '~22%', detail: 'Advanced weather analysis, turbulence, icing, high-altitude weather' },
        { area: 'Navigation & IFR Charts', pct: '~18%', detail: 'En route charts, approach procedures, FMS/GPS operations' },
        { area: 'FAA Regulations', pct: '~18%', detail: 'Part 61 commercial privileges, Part 91 operations, Part 135 basics' },
        { area: 'Advanced Aerodynamics', pct: '~14%', detail: 'High-speed aerodynamics, swept wing effects, Mach tuck, Dutch roll' },
        { area: 'Aircraft Systems', pct: '~12%', detail: 'Turbocharged engines, pressurization, retractable gear, complex systems' },
        { area: 'Weight & Balance + Performance', pct: '~10%', detail: 'CG limits, performance planning, takeoff/landing data for high-performance aircraft' },
        { area: 'Aeromedical & Human Factors', pct: '~6%', detail: 'Hypoxia, hyperventilation, spatial disorientation, fatigue, IMSAFE' },
      ].map(({ area, pct, detail }) => (
        <div key={area} style={{
          padding: '14px 18px', marginBottom: 10,
          background: 'rgba(255,255,255,0.03)', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between',
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 700, marginBottom: 2, fontSize: 15 }}>{area}</p>
            <p style={{ ...prose.p, marginBottom: 0, fontSize: 13 }}>{detail}</p>
          </div>
          <span style={{
            alignSelf: 'center', background: 'rgba(52,211,153,0.12)',
            color: '#34d399', borderRadius: 6, padding: '3px 10px',
            fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
          }}>{pct}</span>
        </div>
      ))}

      <h2 style={prose.h2}>Commercial Pilot Regulations You Must Know Cold</h2>
      <p style={prose.p}>
        The commercial written test digs deep into FAA regulations. These are the highest-yield regulatory
        topics that appear frequently on the CAX:
      </p>
      <ul style={prose.ul}>
        <li style={prose.li}><strong>14 CFR 61.133</strong> — Commercial pilot privileges and limitations (who you can carry for compensation)</li>
        <li style={prose.li}><strong>14 CFR 61.129</strong> — Aeronautical experience requirements (250 hours, 100 PIC, 50 cross-country, etc.)</li>
        <li style={prose.li}><strong>14 CFR 91.409</strong> — Inspection requirements for complex/high-performance aircraft</li>
        <li style={prose.li}><strong>14 CFR 91.205</strong> — Required instruments and equipment (VFR day, VFR night, IFR)</li>
        <li style={prose.li}><strong>14 CFR 119 & 135</strong> — Introduction to air carrier operations and commercial air transport rules</li>
        <li style={prose.li}><strong>NTSB 830</strong> — Accident/incident reporting requirements and definitions</li>
      </ul>

      <h2 style={prose.h2}>Advanced Aerodynamics Concepts on the CAX</h2>
      <p style={prose.p}>
        This is where many commercial candidates struggle. The CAX tests aerodynamic concepts beyond what's in
        the PHAK — you'll need the Advanced Avionics Handbook and Pilot's Handbook of Aeronautical Knowledge.
        Focus on:
      </p>
      <ul style={prose.ul}>
        <li style={prose.li}><strong>Mach number and compressibility effects</strong> — what happens to lift and drag near critical Mach</li>
        <li style={prose.li}><strong>Swept wing aerodynamics</strong> — spanwise airflow, tip stall, pitch-up tendency</li>
        <li style={prose.li}><strong>Dutch roll</strong> — what causes it and how yaw dampers correct it</li>
        <li style={prose.li}><strong>Propeller efficiency</strong> — blade angle, P-factor, torque at high power settings</li>
        <li style={prose.li}><strong>Turbocharged engine operation</strong> — critical altitude, waste gate, deck pressure</li>
        <li style={prose.li}><strong>Pressurization systems</strong> — differential pressure, outflow valve, dump valve procedures</li>
      </ul>

      <div style={prose.infoBox}>
        <p style={{ ...prose.p, color: '#38bdf8', fontWeight: 700, marginBottom: 8 }}>💡 Pro Study Tip</p>
        <p style={{ ...prose.p, marginBottom: 0 }}>
          The CAX shares some question types with the IRA. If you already have your instrument rating,
          review your IRA prep material before starting CAX-specific study. You'll recognize 25–30%
          of the content immediately, letting you focus on new material faster.
        </p>
      </div>

      <h2 style={prose.h2}>6-Week CAX Study Timeline</h2>
      {[
        { wk: 'Wk 1–2', focus: 'Advanced aerodynamics, aircraft systems (turbo, pressurization, complex)', note: 'These are high-yield and unique to CAX' },
        { wk: 'Wk 3', focus: 'Commercial regulations: Parts 61, 91, 119, 135 basics', note: 'Know commercial privileges cold' },
        { wk: 'Wk 4', focus: 'Navigation, IFR charts, approach procedures (review if IRA-rated)', note: 'Build on instrument knowledge' },
        { wk: 'Wk 5', focus: 'Weather services, weight & balance, performance for complex aircraft', note: 'Dense but very testable material' },
        { wk: 'Wk 6', focus: 'Full 100-question timed practice tests, drill weak areas', note: 'Target 80%+ before scheduling real test' },
      ].map(({ wk, focus, note }) => (
        <div key={wk} style={{
          display: 'flex', gap: 16, padding: '14px 18px', marginBottom: 10,
          background: 'rgba(255,255,255,0.03)', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{
            minWidth: 64, background: 'linear-gradient(135deg, #34d399, #0d9488)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 12, padding: '4px 6px', textAlign: 'center',
          }}>{wk}</div>
          <div>
            <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 700, marginBottom: 3, fontSize: 15 }}>{focus}</p>
            <p style={{ ...prose.p, marginBottom: 0, fontSize: 13 }}>{note}</p>
          </div>
        </div>
      ))}

      <BottomCTA
        headline="Launch Your Commercial Aviation Career"
        sub="Pilot Essentials provides the structured ground school, advanced aerodynamics review, and CAX practice questions you need to pass your commercial written and take the next step in your aviation career."
      />
    </BlogLayout>
  );
}
