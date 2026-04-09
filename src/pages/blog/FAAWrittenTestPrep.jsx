import { BlogLayout, BottomCTA, prose } from '../../components/BlogLayout';
import { CheckCircle, Zap, Target, Clock, Award } from 'lucide-react';

export default function FAAWrittenTestPrep() {
  return (
    <BlogLayout
      title="FAA Written Test Prep — Pass the FAA Knowledge Test First Time"
      description="Complete FAA written test prep guide. Study strategies, exam format, topic breakdown, and the fastest way to pass your FAA knowledge test first attempt."
      slug="/faa-written-test-prep"
    >
      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        <div style={prose.meta}>
          <span style={prose.tag}>FAA Written Test</span>
          <span style={prose.tag}>Ground School</span>
          <span>10 min read</span>
          <span>Updated April 2026</span>
        </div>
        <h1 style={prose.h1}>FAA Written Test Prep: Pass the Knowledge Test First Time</h1>
        <p style={{ ...prose.p, fontSize: 18, color: '#cbd5e1' }}>
          The FAA Airman Knowledge Test (AKT) is the written exam every pilot must pass before their checkride.
          With the right prep strategy, most students pass with a score above 90% on their first attempt.
          Here's everything you need to know — format, topics, study plan, and the fastest path to your passing score.
        </p>
      </div>

      <hr style={prose.divider} />

      <h2 style={prose.h2}>What Is the FAA Written Test?</h2>
      <p style={prose.p}>
        The FAA written test — officially called the Airman Knowledge Test (AKT) — is a computer-based, multiple-choice exam
        administered at FAA-approved testing centers (CATS, PSI). It's a prerequisite for every certificate and rating:
        Private Pilot (PAR), Instrument Rating (IRA), Commercial Pilot (CAX), and CFI.
      </p>
      <div style={prose.infoBox}>
        <p style={{ ...prose.p, marginBottom: 8, color: '#38bdf8', fontWeight: 700 }}>📋 Quick Facts — PAR (Private Pilot)</p>
        <ul style={prose.ul}>
          <li style={prose.li}><strong>Questions:</strong> 60 multiple-choice</li>
          <li style={prose.li}><strong>Time limit:</strong> 2.5 hours</li>
          <li style={prose.li}><strong>Passing score:</strong> 70% (42 correct)</li>
          <li style={prose.li}><strong>Average score:</strong> 82–88% with proper preparation</li>
          <li style={prose.li}><strong>Cost:</strong> ~$175–$200 at testing centers</li>
          <li style={prose.li}><strong>Validity:</strong> 24 months from test date</li>
        </ul>
      </div>

      <h2 style={prose.h2}>Topics Covered on the FAA Written Test</h2>
      <p style={prose.p}>
        The FAA tests knowledge across 12 subject areas. Here's a breakdown of what appears most frequently
        on the Private Pilot Airman Knowledge Test:
      </p>
      {[
        { topic: 'Weather Theory & Reports (METARs, TAFs, PIREPs)', weight: '20–25%', color: '#0ea5e9' },
        { topic: 'FAA Regulations (14 CFR Parts 61, 91)', weight: '15–20%', color: '#818cf8' },
        { topic: 'Navigation (VFR charts, pilotage, dead reckoning)', weight: '12–18%', color: '#34d399' },
        { topic: 'Aerodynamics (forces, stalls, load factors)', weight: '10–15%', color: '#f59e0b' },
        { topic: 'Airspace (classes A–G, special use)', weight: '10–12%', color: '#f87171' },
        { topic: 'Aircraft Systems (engine, electrical, pitot-static)', weight: '8–12%', color: '#a78bfa' },
        { topic: 'Weight & Balance', weight: '5–8%', color: '#38bdf8' },
        { topic: 'Flight Performance & Charts', weight: '5–8%', color: '#fb923c' },
      ].map(({ topic, weight, color }) => (
        <div key={topic} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', marginBottom: 8,
          background: 'rgba(255,255,255,0.03)', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ color: '#e2e8f0', fontSize: 15 }}>{topic}</span>
          <span style={{ color, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', marginLeft: 12 }}>{weight}</span>
        </div>
      ))}

      <h2 style={prose.h2}>The Fastest Study Strategy That Actually Works</h2>
      <p style={prose.p}>
        Most students waste 60–80% of their study time on inefficient methods — re-reading textbooks, watching
        hour-long videos, and memorizing random facts. Here's the strategy that consistently produces 85%+ scores:
      </p>

      <h3 style={prose.h3}>1. Learn Concepts First, Then Drill Questions</h3>
      <p style={prose.p}>
        Don't start with practice questions. Spend your first week building conceptual understanding through
        structured ground school. The FAA tests your ability to apply knowledge — not regurgitate facts.
        Understanding <em>why</em> a density altitude reduces performance is infinitely more valuable than
        memorizing "high density altitude = reduced performance."
      </p>

      <h3 style={prose.h3}>2. Use Spaced Repetition</h3>
      <p style={prose.p}>
        After each topic, review it again after 24 hours, then 3 days, then 7 days. This technique —
        spaced repetition — is proven to increase long-term retention by 2–4x versus cramming.
      </p>

      <h3 style={prose.h3}>3. Do Timed Practice Tests</h3>
      <p style={prose.p}>
        In the final week before your exam, take full 60-question timed practice tests. Review every
        wrong answer and understand the reasoning. Target 85%+ on practice exams before scheduling
        your real test.
      </p>

      <div style={prose.warningBox}>
        <p style={{ ...prose.p, color: '#f59e0b', fontWeight: 700, marginBottom: 8 }}>⚠️ The #1 Mistake Students Make</p>
        <p style={{ ...prose.p, marginBottom: 0 }}>
          Scheduling the real test before consistently scoring 85%+ on full practice exams.
          The FAA question bank has ~900 questions. You need broad topic mastery, not question memorization.
        </p>
      </div>

      <h2 style={prose.h2}>Your 30-Day FAA Written Test Study Plan</h2>
      {[
        { week: 'Week 1', focus: 'Aerodynamics, Aircraft Systems, Flight Instruments', goal: 'Build foundational understanding' },
        { week: 'Week 2', focus: 'Weather Theory, Weather Reports (METARs, TAFs, SIGMETs)', goal: 'Master weather — highest test weight' },
        { week: 'Week 3', focus: 'Navigation, Airspace, FAA Regulations', goal: 'Work through CFR Parts 61 & 91' },
        { week: 'Week 4', focus: 'Weight & Balance, Performance, Full Practice Tests', goal: 'Drill weak areas, score 85%+ consistently' },
      ].map(({ week, focus, goal }) => (
        <div key={week} style={{
          display: 'flex', gap: 16, padding: '16px 20px', marginBottom: 12,
          background: 'rgba(255,255,255,0.03)', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{
            minWidth: 72, height: 36, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 12,
          }}>{week}</div>
          <div>
            <p style={{ ...prose.p, marginBottom: 4, color: '#e2e8f0', fontWeight: 600 }}>{focus}</p>
            <p style={{ ...prose.p, marginBottom: 0, fontSize: 13 }}>{goal}</p>
          </div>
        </div>
      ))}

      <h2 style={prose.h2}>What Makes Pilot Essentials Different</h2>
      <p style={prose.p}>
        Unlike generic aviation apps that give you question banks without context, Pilot Essentials
        is a structured 17-chapter ground school mapped directly to the FAA Private Pilot ACS.
        Every lesson includes video instruction, an AI-powered study guide, concept quizzes, and
        end-of-chapter tests.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, margin: '24px 0' }}>
        {[
          { icon: '📚', title: '17 Structured Chapters', desc: 'FAA ACS-aligned curriculum from aerodynamics to checkride prep' },
          { icon: '🤖', title: 'AI Study Guides', desc: 'Per-lesson AI summaries with key facts, formulas, and FAA test tips' },
          { icon: '📝', title: '1,000+ Practice Questions', desc: 'Topic-specific quizzes plus 60-question timed final exams' },
          { icon: '🏆', title: 'Gamified Progress', desc: 'XP, badges, and streaks keep you motivated to finish' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '20px 18px',
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
            <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 700, marginBottom: 6, fontSize: 15 }}>{title}</p>
            <p style={{ ...prose.p, marginBottom: 0, fontSize: 14 }}>{desc}</p>
          </div>
        ))}
      </div>

      <h2 style={prose.h2}>Frequently Asked Questions</h2>
      {[
        { q: 'How long does it take to study for the FAA written test?', a: 'Most students pass with 40–60 hours of focused study spread over 3–6 weeks. With a structured course, you can compress this to 3–4 weeks studying 1–2 hours per day.' },
        { q: 'Do I need an instructor endorsement to take the test?', a: 'Yes. Before scheduling your FAA knowledge test, you need a sign-off from a CFI or an approved self-study course (like King Schools or Pilot Essentials) that qualifies under 14 CFR 61.35.' },
        { q: 'Can I retake the test if I fail?', a: 'Yes. After a failing score, you must wait at least 30 days and get another instructor endorsement before retesting. Additional test fees apply.' },
        { q: 'How do I schedule the FAA knowledge test?', a: 'Register online at either CATS (1800airtesting.com) or PSI (faa.psiexams.com). Bring a government-issued photo ID and your instructor endorsement.' },
      ].map(({ q, a }) => (
        <div key={q} style={{ marginBottom: 20 }}>
          <h3 style={{ ...prose.h3, marginTop: 0 }}>{q}</h3>
          <p style={prose.p}>{a}</p>
        </div>
      ))}

      <BottomCTA
        headline="Start Your FAA Written Test Prep Today"
        sub="Pilot Essentials gives you everything you need to pass your FAA knowledge test on the first attempt — structured curriculum, AI study guides, and 1,000+ practice questions."
      />
    </BlogLayout>
  );
}
