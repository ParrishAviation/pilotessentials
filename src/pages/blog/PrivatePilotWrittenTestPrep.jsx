import { BlogLayout, BottomCTA, prose } from '../../components/BlogLayout';

export default function PrivatePilotWrittenTestPrep() {
  return (
    <BlogLayout
      title="Private Pilot Written Test Prep — Pass the PAR in 30 Days"
      description="Complete guide to private pilot written test prep. Study schedule, PAR exam topics, practice questions, and the fastest way to pass your private pilot knowledge test."
      slug="/private-pilot-written-test-prep"
    >
      <div style={{ marginBottom: 48 }}>
        <div style={prose.meta}>
          <span style={prose.tag}>Private Pilot</span>
          <span style={prose.tag}>PAR Exam</span>
          <span>12 min read</span>
          <span>Updated April 2026</span>
        </div>
        <h1 style={prose.h1}>Private Pilot Written Test Prep: Pass the PAR in 30 Days</h1>
        <p style={{ ...prose.p, fontSize: 18, color: '#cbd5e1' }}>
          The Private Pilot Airman Knowledge Test (PAR) is the first big milestone on your path to a pilot certificate.
          With the right preparation, you can pass with a score in the high 80s to low 90s — and be ready for
          your checkride in as little as 30 days of focused study.
        </p>
      </div>

      <hr style={prose.divider} />

      <h2 style={prose.h2}>What Is the PAR (Private Pilot) Written Test?</h2>
      <p style={prose.p}>
        The PAR is the FAA Airman Knowledge Test specific to the Private Pilot – Airplane (ASEL) certificate.
        It's a 60-question, multiple-choice exam drawn from a pool of approximately 900 questions maintained
        by the FAA. You have 2 hours and 30 minutes to complete it at any FAA-approved testing center nationwide.
      </p>
      <div style={prose.infoBox}>
        <p style={{ ...prose.p, marginBottom: 8, color: '#38bdf8', fontWeight: 700 }}>📋 PAR Exam At a Glance</p>
        <ul style={prose.ul}>
          <li style={prose.li}><strong>Test code:</strong> PAR</li>
          <li style={prose.li}><strong>Questions:</strong> 60 randomly selected from ~900-question bank</li>
          <li style={prose.li}><strong>Passing score:</strong> 70% (42/60 correct)</li>
          <li style={prose.li}><strong>Time allotted:</strong> 2 hours 30 minutes</li>
          <li style={prose.li}><strong>Test fee:</strong> ~$175–$200 depending on testing center</li>
          <li style={prose.li}><strong>Valid for:</strong> 24 calendar months</li>
          <li style={prose.li}><strong>Required before:</strong> Private pilot practical test (checkride)</li>
        </ul>
      </div>

      <h2 style={prose.h2}>PAR Exam Topic Breakdown</h2>
      <p style={prose.p}>
        The FAA Private Pilot ACS (Airman Certification Standards) defines the subject matter areas tested.
        Here's where your study time should go:
      </p>
      {[
        { area: 'Weather Theory', detail: 'Atmospheric pressure, fronts, stability, clouds, thunderstorms', pct: '~22%' },
        { area: 'Weather Services & Forecasts', detail: 'METARs, TAFs, PIREPs, SIGMETs, AIRMETs, winds aloft', pct: '~15%' },
        { area: 'FAA Regulations', detail: '14 CFR Parts 61, 71, 91 — certificates, privileges, operations', pct: '~18%' },
        { area: 'Navigation', detail: 'VFR sectional charts, pilotage, dead reckoning, E6B calculations', pct: '~14%' },
        { area: 'Aerodynamics', detail: 'Four forces, Bernoulli, angle of attack, stalls, spins, load factor', pct: '~10%' },
        { area: 'Airspace', detail: 'Classes A–G, Mode C veil, TFRs, special-use airspace', pct: '~10%' },
        { area: 'Aircraft Systems', detail: 'Powerplant, fuel, electrical, pitot-static, gyroscopic instruments', pct: '~6%' },
        { area: 'Weight & Balance + Performance', detail: 'CG calculations, takeoff/landing charts, density altitude', pct: '~5%' },
      ].map(({ area, detail, pct }) => (
        <div key={area} style={{
          padding: '14px 18px', marginBottom: 10,
          background: 'rgba(255,255,255,0.03)', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 700, marginBottom: 2, fontSize: 15 }}>{area}</p>
            <p style={{ ...prose.p, marginBottom: 0, fontSize: 13 }}>{detail}</p>
          </div>
          <span style={{
            alignSelf: 'center', background: 'rgba(56,189,248,0.12)',
            color: '#38bdf8', borderRadius: 6, padding: '3px 10px',
            fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
          }}>{pct}</span>
        </div>
      ))}

      <h2 style={prose.h2}>30-Day Private Pilot Study Plan</h2>
      <p style={prose.p}>
        This plan assumes 1.5–2 hours of study per day. Adjust the pace to your schedule —
        the key is consistent daily study, not marathon sessions.
      </p>
      {[
        { days: 'Days 1–3', topic: 'Aerodynamics & the Four Forces', tip: 'Master lift, weight, thrust, drag, stalls, and load factor' },
        { days: 'Days 4–6', topic: 'Aircraft Systems', tip: 'Engine, fuel system, pitot-static, electrical, vacuum instruments' },
        { days: 'Days 7–9', topic: 'Flight Instruments', tip: 'Airspeed indicator, altimeter, VSI, heading indicator, turn coordinator' },
        { days: 'Days 10–13', topic: 'Weather Theory', tip: 'Atmosphere, fronts, stability, clouds, thunderstorms, icing' },
        { days: 'Days 14–16', topic: 'Weather Services', tip: 'Decode METARs, TAFs, PIREPs, read prog charts' },
        { days: 'Days 17–19', topic: 'Airspace & AIRMETs/SIGMETs', tip: 'Class A–G, Mode C, special-use airspace, TFRs' },
        { days: 'Days 20–22', topic: 'FAA Regulations (Parts 61 & 91)', tip: 'Medical, currency, VFR minimums, right of way' },
        { days: 'Days 23–25', topic: 'Navigation & Charts', tip: 'Sectional reading, E6B, magnetic variation, time-speed-distance' },
        { days: 'Days 26–27', topic: 'Weight & Balance + Performance', tip: 'CG calculation, density altitude, takeoff/landing performance' },
        { days: 'Days 28–30', topic: 'Full Practice Tests & Review', tip: 'Take 3+ full 60-question timed tests, review every missed question' },
      ].map(({ days, topic, tip }, i) => (
        <div key={days} style={{
          display: 'flex', gap: 16, padding: '14px 18px', marginBottom: 10,
          background: 'rgba(255,255,255,0.03)', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{
            minWidth: 80, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 11, padding: '4px 8px', textAlign: 'center',
          }}>{days}</div>
          <div>
            <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 700, marginBottom: 3, fontSize: 15 }}>{topic}</p>
            <p style={{ ...prose.p, marginBottom: 0, fontSize: 13 }}>{tip}</p>
          </div>
        </div>
      ))}

      <h2 style={prose.h2}>High-Yield Topics to Master First</h2>
      <p style={prose.p}>
        If you're short on time, focus on these areas first — they consistently account for
        the most questions on the PAR exam:
      </p>
      <ul style={prose.ul}>
        <li style={prose.li}><strong>Weather interpretation</strong> — METARs, TAFs, and prog charts account for 20%+ of questions</li>
        <li style={prose.li}><strong>14 CFR Part 91 VFR minimums</strong> — know cloud clearances and visibility requirements for every airspace class cold</li>
        <li style={prose.li}><strong>VFR sectional chart reading</strong> — airport symbols, airspace depictions, obstructions, and terrain</li>
        <li style={prose.li}><strong>Density altitude calculations</strong> — understand how temperature and pressure altitude affect performance</li>
        <li style={prose.li}><strong>Weight and balance</strong> — compute CG and determine if within limits using moment tables</li>
      </ul>

      <h2 style={prose.h2}>Common PAR Exam Mistakes to Avoid</h2>
      <div style={prose.warningBox}>
        <ul style={{ ...prose.ul, marginBottom: 0 }}>
          <li style={prose.li}><strong>Skipping weather.</strong> Weather questions make up nearly a quarter of the exam. Don't underestimate them.</li>
          <li style={prose.li}><strong>Memorizing answers.</strong> The FAA updates its question bank. Learn the concepts so any variation of a question is answerable.</li>
          <li style={prose.li}><strong>Ignoring figures.</strong> Several questions require you to reference FAA sectional chart excerpts, weather depictions, and performance charts provided during the test.</li>
          <li style={prose.li}><strong>Not using an E6B.</strong> Practice weight & balance and time-speed-distance problems with an actual E6B or CX-3 — you can bring one to the test.</li>
          <li style={prose.li}><strong>Testing too early.</strong> Take practice tests. If you're below 80% consistently, keep studying.</li>
        </ul>
      </div>

      <h2 style={prose.h2}>How to Register for the PAR Exam</h2>
      <ol style={{ paddingLeft: 22, marginBottom: 18 }}>
        <li style={{ ...prose.li, marginBottom: 10 }}>Get your instructor endorsement (14 CFR 61.35 sign-off from a CFI, or approval via a self-study course)</li>
        <li style={{ ...prose.li, marginBottom: 10 }}>Register at <strong>1800airtesting.com (CATS)</strong> or <strong>faa.psiexams.com (PSI)</strong></li>
        <li style={{ ...prose.li, marginBottom: 10 }}>Choose a test center location and schedule your appointment</li>
        <li style={{ ...prose.li, marginBottom: 10 }}>Bring a valid government-issued photo ID and your endorsement on test day</li>
        <li style={{ ...prose.li, marginBottom: 10 }}>Receive your score immediately after completing the test</li>
      </ol>

      <h2 style={prose.h2}>What Happens After You Pass?</h2>
      <p style={prose.p}>
        Your PAR score is valid for 24 calendar months. During that window, you must complete your
        practical test (checkride) with an FAA Designated Pilot Examiner (DPE). Your score report
        will show which knowledge areas you missed — your CFI will review those with you before the checkride.
      </p>

      <BottomCTA
        headline="Pass Your Private Pilot Written Test in 30 Days"
        sub="Pilot Essentials walks you through all 17 chapters of private pilot ground school with structured video lessons, AI study guides, and 1,000+ PAR practice questions."
      />
    </BlogLayout>
  );
}
