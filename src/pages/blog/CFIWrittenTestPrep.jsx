import { BlogLayout, BottomCTA, prose } from '../../components/BlogLayout';

export default function CFIWrittenTestPrep() {
  return (
    <BlogLayout
      title="CFI Written Test Prep — Pass FOI & FIA Without Memorization"
      description="Complete guide to CFI written test prep. Pass the FOI and FIA exams for your flight instructor certificate. Study strategies, topic breakdown, and key concepts."
      slug="/cfi-written-test-prep"
    >
      <div style={{ marginBottom: 48 }}>
        <div style={prose.meta}>
          <span style={prose.tag}>CFI Certificate</span>
          <span style={prose.tag}>FOI + FIA Exams</span>
          <span>11 min read</span>
          <span>Updated April 2026</span>
        </div>
        <h1 style={prose.h1}>CFI Written Test Prep: Pass FOI + FIA Without Memorization</h1>
        <p style={{ ...prose.p, fontSize: 18, color: '#cbd5e1' }}>
          Becoming a Certified Flight Instructor requires passing two written knowledge tests: the
          Fundamentals of Instructing (FOI) and the Flight Instructor Airplane (FIA). Unlike other FAA exams,
          these tests focus heavily on teaching methodology and human behavior — topics that feel different
          from typical aviation study. Here's how to approach them strategically and pass both on your first attempt.
        </p>
      </div>

      <hr style={prose.divider} />

      <h2 style={prose.h2}>The Two CFI Written Tests Explained</h2>
      <p style={prose.p}>
        To earn your CFI certificate, you must pass two separate Airman Knowledge Tests:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, margin: '20px 0 32px' }}>
        {[
          {
            code: 'FOI', full: 'Fundamentals of Instructing',
            q: 50, time: '1.5 hrs', pct: '70%',
            focus: 'Learning theory, teaching methods, human behavior, instructor responsibilities, instructional aids',
            color: '#818cf8',
          },
          {
            code: 'FIA', full: 'Flight Instructor Airplane',
            q: 100, time: '2.5 hrs', pct: '70%',
            focus: 'Aeronautical knowledge from the private and commercial curriculum — as a teacher, not just a student',
            color: '#0ea5e9',
          },
        ].map(({ code, full, q, time, pct, focus, color }) => (
          <div key={code} style={{
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33`,
            borderRadius: 14, padding: '22px 20px',
          }}>
            <div style={{
              display: 'inline-block', background: color, color: '#fff',
              borderRadius: 8, padding: '4px 12px', fontSize: 14, fontWeight: 800, marginBottom: 10,
            }}>{code}</div>
            <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{full}</p>
            <ul style={{ ...prose.ul, marginBottom: 0 }}>
              <li style={{ ...prose.li, fontSize: 14 }}><strong>{q} questions</strong> — {time} — Pass: {pct}</li>
              <li style={{ ...prose.li, fontSize: 14 }}>{focus}</li>
            </ul>
          </div>
        ))}
      </div>

      <div style={prose.infoBox}>
        <p style={{ ...prose.p, color: '#38bdf8', fontWeight: 700, marginBottom: 8 }}>📋 Important: FOI Waiver</p>
        <p style={{ ...prose.p, marginBottom: 0 }}>
          If you hold a ground instructor certificate or a flight instructor certificate for another category/class,
          you may be eligible to waive the FOI test. Check with your FSDO or CFI to confirm eligibility.
          However, most candidates will need to take both FOI and FIA.
        </p>
      </div>

      <h2 style={prose.h2}>FOI: Fundamentals of Instructing — Topic Deep Dive</h2>
      <p style={prose.p}>
        The FOI is unique among FAA written tests — it's essentially an educational psychology exam.
        The source material comes almost entirely from the <em>Aviation Instructor's Handbook (FAA-H-8083-9)</em>.
        Here are the four main knowledge domains:
      </p>

      <h3 style={prose.h3}>1. Human Behavior & Effective Communication</h3>
      <p style={prose.p}>
        Understand Maslow's hierarchy of needs and how motivation affects learning. Know the difference
        between basic human needs and how anxiety, defense mechanisms, and instructor attitude impact
        student performance. The FAA tests communication theory: barriers to communication, levels of
        learning (rote, understanding, application, correlation), and the characteristics of adult learners.
      </p>

      <h3 style={prose.h3}>2. The Learning Process</h3>
      <p style={prose.p}>
        Laws of learning (REEPIR): Readiness, Effect, Exercise, Primacy, Intensity, Recency.
        Memory types (sensory, working, long-term) and how to move information through them.
        Perceptions, insights, and habit formation. How to recognize and address learning plateaus.
      </p>

      <h3 style={prose.h3}>3. Teaching Methods & Course Development</h3>
      <p style={prose.p}>
        The FAA expects you to know the difference between lecture, guided discussion, demonstration-performance,
        computer-aided, and cooperative learning methods. Know the four-step method of instruction:
        preparation, presentation, application, and review/evaluation. Course development follows a
        systematic instructional design model — objectives, standards, lessons, and evaluation.
      </p>

      <h3 style={prose.h3}>4. Instructor Responsibilities & Professionalism</h3>
      <p style={prose.p}>
        Flight instructor responsibilities to the aviation community: teaching judgment (ADM),
        maintaining instructional currency, avoiding instructor pitfalls (impatience, over-reliance
        on demonstration, criticizing other instructors). Know the requirements for endorsements and
        when you are required to provide them.
      </p>

      <h2 style={prose.h2}>FIA: Flight Instructor Airplane — Topic Breakdown</h2>
      <p style={prose.p}>
        The FIA is essentially the commercial/instrument syllabus — but tested from a teaching perspective.
        You're expected to know the <em>why</em> behind every concept so you can explain it to students.
        High-yield FIA topics:
      </p>
      {[
        { area: 'Aerodynamics & Flight Maneuvers', detail: 'Four forces, stalls, spins, slow flight, ground reference — at instructor depth' },
        { area: 'Weather Theory & Meteorology', detail: 'Frontal systems, turbulence, icing, thunderstorm avoidance — for student instruction' },
        { area: 'FAA Regulations (Parts 61 & 91)', detail: 'CFI endorsement requirements, student pilot reqs, logbook entries, training records' },
        { area: 'Navigation & Cross-Country Planning', detail: 'VFR/IFR charts, E6B, fuel planning, ATC services' },
        { area: 'Aircraft Performance & Systems', detail: 'High-performance, complex, technically advanced aircraft (TAA)' },
        { area: 'Airspace', detail: 'All classes, SVFR, TFRs — ability to teach airspace in context' },
        { area: 'Weight & Balance', detail: 'CG calculations, loading envelopes, limitations' },
      ].map(({ area, detail }) => (
        <div key={area} style={{
          padding: '12px 16px', marginBottom: 8,
          background: 'rgba(255,255,255,0.03)', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 700, marginBottom: 2, fontSize: 15 }}>{area}</p>
          <p style={{ ...prose.p, marginBottom: 0, fontSize: 13 }}>{detail}</p>
        </div>
      ))}

      <h2 style={prose.h2}>Key Memory Aids for FOI</h2>
      <div style={prose.infoBox}>
        <p style={{ ...prose.p, color: '#38bdf8', fontWeight: 700, marginBottom: 12 }}>🧠 FOI Mnemonics Worth Memorizing</p>
        {[
          { mnemonic: 'REEPIR', meaning: 'Laws of Learning: Readiness, Effect, Exercise, Primacy, Intensity, Recency' },
          { mnemonic: 'PPAR', meaning: 'Teaching method steps: Preparation, Presentation, Application, Review' },
          { mnemonic: 'HOTS', meaning: 'Higher Order Thinking Skills: Analysis, Synthesis, Evaluation (vs. rote/recall)' },
          { mnemonic: 'ADM', meaning: 'Aeronautical Decision Making — the CFI is responsible for teaching this from day one' },
        ].map(({ mnemonic, meaning }) => (
          <div key={mnemonic} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <span style={{
              minWidth: 70, background: 'rgba(129,140,248,0.2)', color: '#818cf8',
              borderRadius: 6, padding: '3px 10px', fontSize: 13, fontWeight: 800,
              textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{mnemonic}</span>
            <span style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{meaning}</span>
          </div>
        ))}
      </div>

      <h2 style={prose.h2}>Study Timeline for FOI + FIA</h2>
      <p style={prose.p}>
        Most candidates take 4–6 weeks to prepare for both exams. You can take them together or separately
        at the testing center — many candidates pass both on the same day.
      </p>
      {[
        { period: 'Week 1–2', task: 'FOI: Read Aviation Instructor\'s Handbook chapters 1–7, take chapter quizzes' },
        { period: 'Week 3', task: 'FOI: Full practice tests, review human behavior and learning theory sections' },
        { period: 'Week 4–5', task: 'FIA: Review commercial/instrument-level content from a teaching perspective' },
        { period: 'Week 6', task: 'FIA: Full 100-question timed practice tests, schedule both exams' },
      ].map(({ period, task }) => (
        <div key={period} style={{
          display: 'flex', gap: 14, padding: '12px 16px', marginBottom: 10,
          background: 'rgba(255,255,255,0.03)', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <span style={{
            minWidth: 76, background: 'rgba(129,140,248,0.15)', color: '#818cf8',
            borderRadius: 6, fontSize: 12, fontWeight: 700, padding: '4px 8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          }}>{period}</span>
          <p style={{ ...prose.p, marginBottom: 0, alignSelf: 'center' }}>{task}</p>
        </div>
      ))}

      <BottomCTA
        headline="Build the Knowledge to Become a Great Flight Instructor"
        sub="Pilot Essentials covers the full private pilot and commercial ground school curriculum you'll need to master before your FIA — and our AI study guides help you understand concepts at the depth required to teach them."
      />
    </BlogLayout>
  );
}
