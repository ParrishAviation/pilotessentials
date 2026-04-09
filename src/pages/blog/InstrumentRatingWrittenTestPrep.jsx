import { BlogLayout, BottomCTA, prose } from '../../components/BlogLayout';

export default function InstrumentRatingWrittenTestPrep() {
  return (
    <BlogLayout
      title="Instrument Rating Written Test Prep — Pass the IRA First Attempt"
      description="Master IFR knowledge and pass your instrument rating written test (IRA) first attempt. Topics, study strategy, and a 4-week IFR ground school plan."
      slug="/instrument-rating-written-test-prep"
    >
      <div style={{ marginBottom: 48 }}>
        <div style={prose.meta}>
          <span style={prose.tag}>Instrument Rating</span>
          <span style={prose.tag}>IRA Exam</span>
          <span>11 min read</span>
          <span>Updated April 2026</span>
        </div>
        <h1 style={prose.h1}>Instrument Rating Written Test Prep: Master IFR Knowledge & Pass IRA First Attempt</h1>
        <p style={{ ...prose.p, fontSize: 18, color: '#cbd5e1' }}>
          The Instrument Rating Airman Knowledge Test (IRA) is significantly more technical than the Private Pilot exam.
          It tests your ability to fly in instrument meteorological conditions (IMC) — interpreting charts,
          flying approaches, and making real-time weather decisions. Here's how to prep smart and pass first attempt.
        </p>
      </div>

      <hr style={prose.divider} />

      <h2 style={prose.h2}>IRA Exam Overview</h2>
      <div style={prose.infoBox}>
        <p style={{ ...prose.p, marginBottom: 8, color: '#38bdf8', fontWeight: 700 }}>📋 IRA Exam Facts</p>
        <ul style={prose.ul}>
          <li style={prose.li}><strong>Questions:</strong> 60 multiple-choice</li>
          <li style={prose.li}><strong>Time limit:</strong> 2 hours 30 minutes</li>
          <li style={prose.li}><strong>Passing score:</strong> 70%</li>
          <li style={prose.li}><strong>Question bank:</strong> ~900 questions (substantially different from PAR)</li>
          <li style={prose.li}><strong>Cost:</strong> ~$175–$200</li>
          <li style={prose.li}><strong>Prerequisite:</strong> Private pilot certificate or concurrent enrollment in combined course</li>
        </ul>
      </div>

      <h2 style={prose.h2}>IRA Topic Areas — Where to Focus</h2>
      <p style={prose.p}>
        The IRA covers everything from IFR flight planning to holding patterns to precision approach minima.
        Here's what you need to master:
      </p>
      {[
        { area: 'IFR Weather & Weather Services', pct: '~25%', detail: 'AIRMET/SIGMET interpretation, icing analysis, turbulence, instrument met conditions' },
        { area: 'IFR En Route Navigation', pct: '~20%', detail: 'Victor airways, IFR charts, MEA/MOCA, OROCA, DPs and STARs' },
        { area: 'IFR Approaches', pct: '~18%', detail: 'ILS, VOR, RNAV, LOC — reading approach plates, minima, missed approach' },
        { area: 'FAA Regulations (Parts 61 & 91 — IFR)', pct: '~15%', detail: 'IFR currency, alternate minimums, equipment requirements, ATC clearances' },
        { area: 'IFR Flight Planning', pct: '~10%', detail: 'Alternate airport requirements, fuel planning, TEC routes, NOTAM interpretation' },
        { area: 'Instrument Flying — Aircraft Systems', pct: '~8%', detail: 'Gyroscopic instruments, pitot-static errors, autopilot, FMS/GPS fundamentals' },
        { area: 'Aeromedical & Human Factors', pct: '~4%', detail: 'Spatial disorientation, vestibular illusions, hypoxia at altitude' },
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
            alignSelf: 'center', background: 'rgba(129,140,248,0.15)',
            color: '#818cf8', borderRadius: 6, padding: '3px 10px',
            fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
          }}>{pct}</span>
        </div>
      ))}

      <h2 style={prose.h2}>The Hardest Parts of the IRA (And How to Conquer Them)</h2>

      <h3 style={prose.h3}>Reading IFR En Route Charts</h3>
      <p style={prose.p}>
        IFR low-altitude (L) and high-altitude (H) charts are dense with information. Master
        the difference between MEA (Minimum En Route Altitude), MOCA (Minimum Obstruction Clearance Altitude),
        and MRA (Minimum Reception Altitude). Know how to identify off-route obstruction clearance altitude (OROCA)
        and when you can and cannot accept a lower altitude from ATC.
      </p>

      <h3 style={prose.h3}>Approach Plate Reading</h3>
      <p style={prose.p}>
        Approach plates are tested heavily. For each instrument approach procedure, you need to identify:
        the final approach fix (FAF), minimum descent altitude (MDA) vs. decision altitude/height (DA/DH),
        missed approach point (MAP), and alternate minimums. Practice reading both precision (ILS) and
        non-precision (VOR, RNAV LNAV) approaches.
      </p>

      <h3 style={prose.h3}>Holding Pattern Entry & Timing</h3>
      <p style={prose.p}>
        Holding entries — direct, teardrop, and parallel — trip up many students. Draw them.
        Practice the timing rules (1-minute legs below 14,000 ft MSL, 1.5 minutes above).
        Know when to use wind correction and how ATC expects you to report over the fix.
      </p>

      <h3 style={prose.h3}>Alternate Airport Requirements</h3>
      <p style={prose.p}>
        The "1-2-3 rule" for filing alternates is critical: if at your destination from 1 hour before
        to 1 hour after your ETA, the ceiling will be less than 2,000 ft AGL or visibility less than
        3 SM, you must file an alternate. Know the standard and non-standard alternate minimums cold.
      </p>

      <div style={prose.warningBox}>
        <p style={{ ...prose.p, color: '#f59e0b', fontWeight: 700, marginBottom: 8 }}>⚠️ Key IRA Pitfalls</p>
        <ul style={{ ...prose.ul, marginBottom: 0 }}>
          <li style={prose.li}>Confusing IFR and VFR weather minimums — they're completely different</li>
          <li style={prose.li}>Forgetting that GPS RAIM checks are required for IFR operations</li>
          <li style={prose.li}>Not knowing the required IFR equipment list (GRABCARD mnemonic)</li>
          <li style={prose.li}>Mixing up DA (precision) vs. MDA (non-precision) and when each applies</li>
        </ul>
      </div>

      <h2 style={prose.h2}>4-Week IRA Study Plan</h2>
      {[
        { week: 'Week 1', topics: 'IFR regulations, currency requirements, equipment, flight planning basics', hrs: '10–12 hrs' },
        { week: 'Week 2', topics: 'En route charts, airways, MEA/MOCA/OROCA, DPs, STARs, holding patterns', hrs: '10–12 hrs' },
        { week: 'Week 3', topics: 'Approach plates (ILS, VOR, RNAV), missed approach, alternate requirements', hrs: '10–12 hrs' },
        { week: 'Week 4', topics: 'IFR weather services, icing/turbulence, human factors, full practice tests', hrs: '10–12 hrs' },
      ].map(({ week, topics, hrs }) => (
        <div key={week} style={{
          display: 'flex', gap: 16, padding: '14px 18px', marginBottom: 10,
          background: 'rgba(255,255,255,0.03)', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{
            minWidth: 72, background: 'linear-gradient(135deg, #818cf8, #6366f1)',
            borderRadius: 8, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: '#fff',
            fontWeight: 800, fontSize: 11, padding: '8px 6px', textAlign: 'center',
          }}>
            <span>{week}</span>
            <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.85 }}>{hrs}</span>
          </div>
          <div>
            <p style={{ ...prose.p, color: '#e2e8f0', marginBottom: 0 }}>{topics}</p>
          </div>
        </div>
      ))}

      <h2 style={prose.h2}>Resources for IRA Prep</h2>
      <ul style={prose.ul}>
        <li style={prose.li}><strong>FAA Instrument Flying Handbook (AFH)</strong> — authoritative source for all IFR procedures; free on faa.gov</li>
        <li style={prose.li}><strong>Instrument Procedures Handbook (IPH)</strong> — detailed guide to instrument approaches and departure procedures</li>
        <li style={prose.li}><strong>AIM (Aeronautical Information Manual)</strong> — ATC procedures, phraseology, and IFR operations chapters</li>
        <li style={prose.li}><strong>14 CFR Parts 61 & 91</strong> — instrument currency, equipment requirements, IFR flight rules</li>
        <li style={prose.li}><strong>FAA-CT-8080-3H</strong> — the official instrument rating test supplement (available at testing centers and free download)</li>
      </ul>

      <BottomCTA
        headline="Master IFR Knowledge & Pass the IRA"
        sub="Our instrument rating ground school curriculum breaks down every IFR topic — from en route charts to approach plates — with AI study guides and targeted practice questions."
      />
    </BlogLayout>
  );
}
