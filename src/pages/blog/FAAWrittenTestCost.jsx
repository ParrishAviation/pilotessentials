import { BlogLayout, BottomCTA, prose } from '../../components/BlogLayout';

export default function FAAWrittenTestCost() {
  return (
    <BlogLayout
      title="FAA Written Test Cost, Registration & Process — What to Expect"
      description="How much does the FAA written test cost? Everything about FAA knowledge test fees ($175–$200), where to take it, how to register, and what to bring on test day."
      slug="/faa-written-test-cost"
    >
      <div style={{ marginBottom: 48 }}>
        <div style={prose.meta}>
          <span style={prose.tag}>FAA Exam Process</span>
          <span style={prose.tag}>Test Registration</span>
          <span>9 min read</span>
          <span>Updated April 2026</span>
        </div>
        <h1 style={prose.h1}>FAA Written Test Cost, Registration & Process: Everything You Need to Know Before Test Day</h1>
        <p style={{ ...prose.p, fontSize: 18, color: '#cbd5e1' }}>
          Before you sit down at a testing center, it helps to know exactly what to expect —
          the cost, the registration process, what you need to bring, and what happens after you finish.
          Here's the complete guide to the FAA Airman Knowledge Test logistics.
        </p>
      </div>

      <hr style={prose.divider} />

      <h2 style={prose.h2}>How Much Does the FAA Written Test Cost?</h2>
      <p style={prose.p}>
        The FAA itself does not administer written tests — it contracts with two private testing companies:
        <strong> CATS (Computer Assisted Testing Service)</strong> and <strong>PSI Exams</strong>.
        Both charge similar fees, which vary slightly by test type and location.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, margin: '20px 0 28px' }}>
        {[
          { test: 'Private Pilot (PAR)', fee: '$175–$185', notes: 'Most common test for student pilots' },
          { test: 'Instrument Rating (IRA)', fee: '$175–$185', notes: 'Required before instrument checkride' },
          { test: 'Commercial Pilot (CAX)', fee: '$175–$185', notes: '100 questions vs. 60 for PAR' },
          { test: 'CFI — FOI', fee: '$175–$185', notes: 'Fundamentals of Instructing' },
          { test: 'CFI — FIA', fee: '$175–$185', notes: 'Flight Instructor Airplane' },
          { test: 'ATP (ATM)', fee: '$185–$200', notes: 'Airline Transport Pilot' },
        ].map(({ test, fee, notes }) => (
          <div key={test} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '18px 16px',
          }}>
            <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 700, marginBottom: 4, fontSize: 15 }}>{test}</p>
            <p style={{ ...prose.p, color: '#38bdf8', fontWeight: 800, fontSize: 20, marginBottom: 4 }}>{fee}</p>
            <p style={{ ...prose.p, marginBottom: 0, fontSize: 13 }}>{notes}</p>
          </div>
        ))}
      </div>

      <div style={prose.warningBox}>
        <p style={{ ...prose.p, color: '#f59e0b', fontWeight: 700, marginBottom: 8 }}>💰 Retake Fees</p>
        <p style={{ ...prose.p, marginBottom: 0 }}>
          If you fail the exam, you must wait at least 30 days and obtain a new instructor endorsement before
          retesting. You will pay the full test fee again. Each retake adds $175–$200 to your training costs —
          strong incentive to prepare thoroughly the first time.
        </p>
      </div>

      <h2 style={prose.h2}>Where to Take the FAA Written Test</h2>
      <p style={prose.p}>
        FAA knowledge tests are administered at approved testing centers across the United States.
        Both CATS and PSI have hundreds of locations — you can find a convenient center near any major city.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, margin: '20px 0 28px' }}>
        {[
          {
            name: 'CATS (Computer Assisted Testing Service)',
            website: '1800airtesting.com',
            notes: 'Larger network of locations. Registration by phone or online.',
            color: '#0ea5e9',
          },
          {
            name: 'PSI Exams (formerly LaserGrade)',
            website: 'faa.psiexams.com',
            notes: 'Online registration with real-time seat availability calendar.',
            color: '#818cf8',
          },
        ].map(({ name, website, notes, color }) => (
          <div key={name} style={{
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33`,
            borderRadius: 12, padding: '20px 18px',
          }}>
            <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 700, marginBottom: 6, fontSize: 15 }}>{name}</p>
            <p style={{ ...prose.p, color, fontWeight: 600, marginBottom: 8, fontSize: 14 }}>{website}</p>
            <p style={{ ...prose.p, marginBottom: 0, fontSize: 13 }}>{notes}</p>
          </div>
        ))}
      </div>
      <p style={prose.p}>
        Many flight schools, aviation colleges, and FBOs (fixed-base operators) also host on-site testing
        through CATS or PSI. Ask your CFI — you may be able to test at your own airport.
      </p>

      <h2 style={prose.h2}>How to Register — Step by Step</h2>
      <ol style={{ paddingLeft: 22, marginBottom: 24 }}>
        {[
          'Get your instructor endorsement (14 CFR 61.35 sign-off from a CFI, or endorsement from an approved self-study course)',
          'Go to 1800airtesting.com (CATS) or faa.psiexams.com (PSI)',
          'Create an account and search for test centers near you',
          'Select your test type (e.g., "PAR – Private Pilot – Airplane")',
          'Choose your date, time, and location — most centers have daily availability',
          'Pay the test fee by credit card at time of registration',
          'Receive a confirmation email with your appointment details',
          'On test day, bring your ID and endorsement (see below)',
        ].map((step, i) => (
          <li key={i} style={{ ...prose.li, marginBottom: 10 }}>{step}</li>
        ))}
      </ol>

      <h2 style={prose.h2}>What to Bring on Test Day</h2>
      <div style={prose.infoBox}>
        <p style={{ ...prose.p, color: '#38bdf8', fontWeight: 700, marginBottom: 12 }}>✅ Required Items</p>
        {[
          { item: 'Government-issued photo ID', detail: 'Passport, driver\'s license, or military ID — must show name, address, DOB, and signature' },
          { item: 'Instructor endorsement', detail: 'Logbook entry or separate written sign-off from a CFI (or printed endorsement from approved online course)' },
          { item: 'Registration confirmation', detail: 'Your booking confirmation number from CATS or PSI' },
        ].map(({ item, detail }) => (
          <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <span style={{ color: '#34d399', fontSize: 18, flexShrink: 0 }}>✓</span>
            <div>
              <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>{item}</span>
              <p style={{ ...prose.p, marginBottom: 0, fontSize: 13 }}>{detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...prose.infoBox, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', marginTop: 16 }}>
        <p style={{ ...prose.p, color: '#f59e0b', fontWeight: 700, marginBottom: 12 }}>✅ Allowed Items (Bring These)</p>
        {[
          { item: 'E6B flight computer or CX-3', detail: 'For weight & balance, time-speed-distance, and fuel calculations' },
          { item: 'Plotter', detail: 'For navigation chart questions (optional — most students don\'t need one for PAR)' },
          { item: 'Scratch paper', detail: 'Provided by the testing center, but you can bring a pencil' },
        ].map(({ item, detail }) => (
          <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <span style={{ color: '#f59e0b', fontSize: 18, flexShrink: 0 }}>✓</span>
            <div>
              <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>{item}</span>
              <p style={{ ...prose.p, marginBottom: 0, fontSize: 13 }}>{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={prose.h2}>What to Expect During the Test</h2>
      <p style={prose.p}>
        Testing centers are quiet, professional computer lab environments. Here's the typical experience:
      </p>
      <ul style={prose.ul}>
        <li style={prose.li}><strong>Check-in:</strong> Arrive 15 minutes early. You'll be asked to sign in, show your ID and endorsement, and leave personal items in a locker.</li>
        <li style={prose.li}><strong>Test supplement:</strong> A printed booklet (FAA-CT-8080-2H for private pilot) with supplemental charts, figures, and tables is provided. This is the same supplement used on the real exam — study it in advance.</li>
        <li style={prose.li}><strong>Interface:</strong> Simple computer-based interface. You can flag questions to return to later. There's no partial credit — each question is worth 1 point.</li>
        <li style={prose.li}><strong>Timing:</strong> A countdown timer is displayed on screen. You have 2 hours 30 minutes for the Private Pilot test.</li>
        <li style={prose.li}><strong>Results:</strong> Your score is displayed immediately on screen when you submit. You receive a printed score report showing which question categories you missed.</li>
      </ul>

      <h2 style={prose.h2}>What Happens After You Pass?</h2>
      <p style={prose.p}>
        Your FAA knowledge test score report is valid for <strong>24 calendar months</strong> from the date you pass.
        You must complete your practical test (checkride) within that window. The score report will show
        which knowledge areas you answered incorrectly — your CFI is required to review those areas
        with you and log the review before your checkride.
      </p>
      <p style={prose.p}>
        After passing, you'll receive an <strong>Airman Knowledge Test Report</strong> with a unique identifier
        code. Keep this report safe — you'll present it to the Designated Pilot Examiner (DPE) at your checkride.
      </p>

      <h2 style={prose.h2}>Total Cost of Getting Your Private Pilot Certificate</h2>
      <p style={prose.p}>
        The written test is one of many costs in your pilot training journey. Here's a realistic overview:
      </p>
      {[
        { item: 'Ground school / online course', cost: '$0–$500', note: 'Free resources available; structured courses cost $99–$499' },
        { item: 'FAA written test (PAR)', cost: '$175–$200', note: 'One-time fee at CATS or PSI testing center' },
        { item: 'Flight training (40–70 hours)', cost: '$8,000–$15,000', note: 'Biggest variable — depends on aircraft rental + CFI rates' },
        { item: 'Medical certificate (3rd class)', cost: '$100–$200', note: 'One-time exam with an FAA Aviation Medical Examiner (AME)' },
        { item: 'Checkride (DPE fee + aircraft)', cost: '$700–$1,500', note: 'DPE fees vary by region ($400–$900); add aircraft rental' },
      ].map(({ item, cost, note }) => (
        <div key={item} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap',
          padding: '12px 16px', marginBottom: 8,
          background: 'rgba(255,255,255,0.03)', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.06)', gap: 8,
        }}>
          <div>
            <p style={{ ...prose.p, color: '#e2e8f0', fontWeight: 600, marginBottom: 2, fontSize: 15 }}>{item}</p>
            <p style={{ ...prose.p, marginBottom: 0, fontSize: 13 }}>{note}</p>
          </div>
          <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: 16, whiteSpace: 'nowrap' }}>{cost}</span>
        </div>
      ))}

      <BottomCTA
        headline="Invest in Quality Prep — Save on Retake Fees"
        sub="At $175–$200 per attempt, failing the FAA written test is expensive. Pilot Essentials gives you 17 chapters of structured ground school, AI study guides, and 1,000+ practice questions — so you pass first time."
      />
    </BlogLayout>
  );
}
