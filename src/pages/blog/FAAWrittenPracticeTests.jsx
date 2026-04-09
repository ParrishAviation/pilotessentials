import { BlogLayout, BottomCTA, prose } from '../../components/BlogLayout';
import { useNavigate } from 'react-router-dom';

export default function FAAWrittenPracticeTests() {
  const navigate = useNavigate();
  return (
    <BlogLayout
      title="FAA Written Test Practice — Free Sample Exam-Style Questions"
      description="Free FAA practice test questions in real exam format. Private pilot PAR practice questions covering weather, aerodynamics, regulations, navigation, and airspace."
      slug="/faa-written-practice-tests"
    >
      <div style={{ marginBottom: 48 }}>
        <div style={prose.meta}>
          <span style={prose.tag}>Practice Questions</span>
          <span style={prose.tag}>FAA Practice Test</span>
          <span>15 min read</span>
          <span>Updated April 2026</span>
        </div>
        <h1 style={prose.h1}>FAA Written Test Practice: Free Exam-Style Questions + Full Study Platform</h1>
        <p style={{ ...prose.p, fontSize: 18, color: '#cbd5e1' }}>
          The best way to prepare for the FAA Airman Knowledge Test is to practice with questions that mirror
          the real exam format. Below you'll find free sample questions across the major PAR test categories,
          with explanations. For a complete 1,000+ question practice bank with timed exams, sign up for
          Pilot Essentials below.
        </p>
      </div>

      {/* Inline CTA */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(37,99,235,0.1))',
        border: '1px solid rgba(56,189,248,0.25)',
        borderRadius: 14, padding: '20px 24px', margin: '0 0 40px',
        display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 700, marginBottom: 4, fontSize: 16 }}>
            Want 1,000+ practice questions with timed exams?
          </p>
          <p style={{ ...prose.p, marginBottom: 0, fontSize: 14 }}>
            Pilot Essentials includes topic-specific quizzes and full 60-question timed practice tests.
          </p>
        </div>
        <button onClick={() => navigate('/login')} style={{
          background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
          color: '#fff', border: 'none', borderRadius: 9, padding: '12px 24px',
          fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          Start Free →
        </button>
      </div>

      <hr style={prose.divider} />

      {/* Practice Questions */}
      {[
        {
          category: '✈️ Aerodynamics',
          questions: [
            {
              q: 'What is the primary cause of an aerodynamic stall?',
              opts: [
                'Insufficient engine power to maintain altitude',
                'Exceeding the critical angle of attack',
                'Flying at an airspeed below the green arc',
              ],
              answer: 1,
              explanation: 'A stall occurs when the wing exceeds its critical angle of attack and the smooth airflow separates from the upper surface, causing a dramatic loss of lift. Stalls can occur at any airspeed and any attitude — the only cause is the critical angle of attack.',
            },
            {
              q: 'During a 60° banked level turn, the load factor (G-force) on the aircraft is approximately:',
              opts: ['1.4 Gs', '2.0 Gs', '3.0 Gs'],
              answer: 1,
              explanation: 'At 60° of bank in a level turn, the load factor is 2.0 Gs. The formula is: LF = 1 / cos(bank angle). cos(60°) = 0.5, so 1/0.5 = 2.0. This doubles the effective weight of the aircraft and requires 41% more airspeed to maintain the same stall margin.',
            },
          ],
        },
        {
          category: '🌦️ Weather',
          questions: [
            {
              q: 'Interpret this METAR: METAR KORD 151553Z 27018KT 7SM OVC012 M02/M06 A2991 RMK AO2\nWhat is the ceiling?',
              opts: ['750 feet AGL', '1,200 feet AGL', '7 statute miles'],
              answer: 1,
              explanation: 'OVC012 indicates an overcast ceiling at 1,200 feet AGL (the number × 100). OVC = overcast (8/8 cloud coverage). The sky condition always reports height in hundreds of feet above the station elevation. M02/M06 indicates temperature -2°C and dewpoint -6°C.',
            },
            {
              q: 'An AIRMET SIERRA is issued for:',
              opts: [
                'Moderate or severe turbulence',
                'IFR conditions, mountain obscuration, and sustained surface winds over 30 knots',
                'Severe icing and freezing level advisories',
              ],
              answer: 1,
              explanation: 'AIRMETs come in three types: Sierra (IFR conditions and mountain obscuration), Tango (turbulence, strong surface winds, low-level wind shear), and Zulu (icing and freezing levels). SIGMETs are for more severe hazards affecting all aircraft.',
            },
          ],
        },
        {
          category: '📜 FAA Regulations',
          questions: [
            {
              q: 'Under 14 CFR Part 91, what are the VFR weather minimums in Class D airspace?',
              opts: [
                '1,000 ft ceiling, 3 SM visibility, 500 below/1,000 above/2,000 horizontal cloud clearance',
                '3 SM visibility, clear of clouds',
                '1,500 ft ceiling, 3 SM visibility, 500 below/500 above/2,000 horizontal',
              ],
              answer: 0,
              explanation: 'Class D airspace requires: 3 statute miles visibility, and cloud clearance of 500 feet below, 1,000 feet above, and 2,000 feet horizontal. A ceiling of at least 1,000 feet AGL is required (because you need 500 below a 1,000 ft cloud to maintain 500 ft clearance). These are the same as Class C and Class E below 10,000 ft.',
            },
            {
              q: 'How often must a private pilot complete a flight review to remain current?',
              opts: ['Every 12 calendar months', 'Every 24 calendar months', 'Every 36 calendar months'],
              answer: 1,
              explanation: 'Under 14 CFR 91.409, a flight review (formerly called biennial flight review or BFR) is required every 24 calendar months to act as pilot in command. It must include at least 1 hour of flight training and 1 hour of ground training with a CFI.',
            },
          ],
        },
        {
          category: '🗺️ Navigation',
          questions: [
            {
              q: 'When flying from a point of known magnetic variation of 10°W, what is the magnetic heading if the true heading is 090°?',
              opts: ['080°', '090°', '100°'],
              answer: 2,
              explanation: 'To convert True Heading to Magnetic Heading: apply variation. West variation is added (the phrase is "East is least, West is best"). 090° + 10° = 100° magnetic. Magnetic declination causes compass needles to point to magnetic north rather than true north.',
            },
          ],
        },
        {
          category: '🏙️ Airspace',
          questions: [
            {
              q: 'What equipment is required to operate within the Mode C veil (30 NM radius) of a Class B airport?',
              opts: [
                'Two-way radio only',
                'Two-way radio and transponder with altitude reporting (Mode C)',
                'ADS-B Out only',
              ],
              answer: 1,
              explanation: 'Within 30 NM of a Class B primary airport (the Mode C veil), all aircraft must be equipped with an operable transponder with automatic altitude reporting capability (Mode C). Note: ADS-B Out with altitude capability also satisfies this requirement in ADS-B Out rule airspace (which overlaps significantly).',
            },
          ],
        },
      ].map(({ category, questions }) => (
        <div key={category} style={{ marginBottom: 48 }}>
          <h2 style={prose.h2}>{category}</h2>
          {questions.map(({ q, opts, answer, explanation }, qi) => (
            <div key={qi} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '24px 22px', marginBottom: 20,
            }}>
              <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 600, marginBottom: 16, fontSize: 16, whiteSpace: 'pre-line' }}>
                Q{qi + 1}. {q}
              </p>
              {opts.map((opt, oi) => (
                <div key={oi} style={{
                  padding: '10px 16px', marginBottom: 8, borderRadius: 8,
                  background: oi === answer ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.02)',
                  border: oi === answer ? '1px solid rgba(52,211,153,0.35)' : '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <span style={{
                    minWidth: 24, height: 24, borderRadius: '50%',
                    background: oi === answer ? '#34d399' : 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, flexShrink: 0,
                    color: oi === answer ? '#fff' : '#64748b',
                  }}>
                    {oi === answer ? '✓' : String.fromCharCode(65 + oi)}
                  </span>
                  <span style={{ color: oi === answer ? '#d1fae5' : '#94a3b8', fontSize: 15, lineHeight: 1.5 }}>{opt}</span>
                </div>
              ))}
              <div style={{ ...prose.infoBox, marginTop: 16, marginBottom: 0 }}>
                <p style={{ ...prose.p, color: '#38bdf8', fontWeight: 700, marginBottom: 6, fontSize: 13 }}>💡 Explanation</p>
                <p style={{ ...prose.p, marginBottom: 0, fontSize: 14 }}>{explanation}</p>
              </div>
            </div>
          ))}
        </div>
      ))}

      <h2 style={prose.h2}>How to Use Practice Questions Effectively</h2>
      <p style={prose.p}>
        Sample questions like these are just a starting point. Here's how to maximize your practice sessions:
      </p>
      <ul style={prose.ul}>
        <li style={prose.li}><strong>Always read the explanation for wrong answers.</strong> Understanding why you were wrong is more valuable than knowing the right answer.</li>
        <li style={prose.li}><strong>Don't just memorize — understand.</strong> The FAA question bank has variations of every question. Understanding the principle means you can answer any variant.</li>
        <li style={prose.li}><strong>Track weak areas by topic.</strong> If you miss 2+ questions in weather, that's where to focus next study session.</li>
        <li style={prose.li}><strong>Take timed full exams in the final week.</strong> Simulate real test conditions — 60 questions, 2.5 hours, no breaks.</li>
      </ul>

      <BottomCTA
        headline="Get 1,000+ FAA Practice Questions + Full Timed Exams"
        sub="Pilot Essentials includes topic-specific quizzes after every lesson, plus 60-question timed practice tests that mirror the real FAA exam. Start free today."
      />
    </BlogLayout>
  );
}
