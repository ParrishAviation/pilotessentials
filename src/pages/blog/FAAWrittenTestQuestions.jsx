import { BlogLayout, BottomCTA, prose } from '../../components/BlogLayout';

const Section = ({ id, icon, title, questions }) => (
  <div style={{ marginBottom: 48 }} id={id}>
    <h2 style={prose.h2}>{icon} {title}</h2>
    {questions.map(({ q, a, tip }, i) => (
      <div key={i} style={{
        padding: '20px 20px', marginBottom: 14,
        background: 'rgba(255,255,255,0.03)', borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <p style={{ ...prose.p, color: '#f1f5f9', fontWeight: 600, marginBottom: 10, fontSize: 15 }}>
          Q: {q}
        </p>
        <div style={{
          background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
          borderRadius: 8, padding: '10px 14px', marginBottom: tip ? 10 : 0,
        }}>
          <p style={{ ...prose.p, color: '#6ee7b7', marginBottom: 0, fontSize: 14 }}>
            <strong style={{ color: '#34d399' }}>A: </strong>{a}
          </p>
        </div>
        {tip && (
          <p style={{ ...prose.p, marginBottom: 0, fontSize: 13, color: '#64748b', marginTop: 8 }}>
            💡 <em>{tip}</em>
          </p>
        )}
      </div>
    ))}
  </div>
);

export default function FAAWrittenTestQuestions() {
  return (
    <BlogLayout
      title="FAA Written Test Questions by Topic — Real Questions & Explanations"
      description="FAA written test questions organized by topic: weather, aerodynamics, regulations, weight & balance, navigation. Real exam-style questions with detailed explanations."
      slug="/faa-written-test-questions"
    >
      <div style={{ marginBottom: 48 }}>
        <div style={prose.meta}>
          <span style={prose.tag}>Sample Questions</span>
          <span style={prose.tag}>Topic Review</span>
          <span>20 min read</span>
          <span>Updated April 2026</span>
        </div>
        <h1 style={prose.h1}>FAA Written Test Questions by Topic: Real Questions + Explanations (Not Memorization)</h1>
        <p style={{ ...prose.p, fontSize: 18, color: '#cbd5e1' }}>
          The most effective FAA test prep isn't memorizing answers — it's understanding the underlying concepts
          so deeply that any question phrasing becomes answerable. This guide covers real FAA-style questions
          across the four highest-tested topics, with explanations that build genuine knowledge.
        </p>
        {/* Jump links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
          {[
            ['#weather', '🌦️ Weather'],
            ['#aerodynamics', '✈️ Aerodynamics'],
            ['#regulations', '📜 Regulations'],
            ['#weight-balance', '⚖️ Weight & Balance'],
          ].map(([href, label]) => (
            <a key={href} href={href} style={{
              background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
              color: '#38bdf8', borderRadius: 8, padding: '6px 16px',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
            }}>{label}</a>
          ))}
        </div>
      </div>

      <hr style={prose.divider} />

      <Section
        id="weather"
        icon="🌦️"
        title="Weather Questions"
        questions={[
          {
            q: 'What type of clouds are associated with thunderstorm activity?',
            a: 'Cumulonimbus (Cb) clouds. These are convective clouds with vertical development that can reach 60,000+ feet. They are always associated with thunderstorms, severe turbulence, heavy precipitation, and lightning. Avoid by at least 20 NM.',
            tip: 'The FAA also asks about cumulus vs. cumulonimbus stages of a thunderstorm — know all three: cumulus, mature, and dissipating.',
          },
          {
            q: 'What is the difference between AIRMET Tango and SIGMET?',
            a: 'AIRMET Tango (WS...T) covers moderate turbulence, sustained surface winds 30+ knots, and non-convective low-level wind shear. SIGMETs cover severe or extreme turbulence, severe icing (non-convective), and widespread dust/sandstorms. Convective SIGMETs cover thunderstorms and tornados.',
            tip: 'Remember: SIGMETs are for all aircraft (not just smaller ones) and indicate more serious hazards than AIRMETs.',
          },
          {
            q: 'What sky condition does "BKN" indicate in a METAR, and what does it mean for VFR flight?',
            a: 'BKN stands for "broken" — 5/8 to 7/8 of the sky covered by clouds. Broken ceilings below 3,000 feet AGL constitute ceiling for weather purposes. If BKN is the lowest layer and it\'s at 1,500 ft AGL, that is your reported ceiling, and VFR flight may be limited or prohibited.',
            tip: 'Cloud coverage is reported in oktas: SKC=0, FEW=1–2, SCT=3–4, BKN=5–7, OVC=8 (all eighths of sky).',
          },
          {
            q: 'What causes a temperature inversion, and why is it important to pilots?',
            a: 'A temperature inversion occurs when a layer of warmer air sits above cooler air at the surface, reversing the normal lapse rate. It traps pollutants and moisture, creating smooth air above but poor visibility at the surface. Inversions are also associated with low-level wind shear and stable conditions that trap fog.',
            tip: 'Inversions explain why visibility near the ground can be poor (smog, haze, fog) while air above is clear and smooth.',
          },
          {
            q: 'What is a wind shear and where is it most commonly encountered?',
            a: 'Wind shear is a sudden change in wind speed or direction over a short distance. It is most hazardous during takeoff and landing. Most commonly encountered: near thunderstorms and microburst events, along frontal boundaries, near temperature inversions, and in mountain wave turbulence.',
            tip: 'Microburst wind shear can produce a 100-knot change in airspeed in seconds — this is one of the most dangerous weather phenomena for aircraft on approach.',
          },
        ]}
      />

      <Section
        id="aerodynamics"
        icon="✈️"
        title="Aerodynamics Questions"
        questions={[
          {
            q: 'How does increasing altitude affect the indicated stall speed (IAS) of an aircraft?',
            a: 'Indicated stall speed remains essentially constant regardless of altitude. As altitude increases, true airspeed (TAS) increases for the same indicated airspeed because air density decreases. The wing still stalls at the same angle of attack — and the airspeed indicator (which measures dynamic pressure) still shows the same IAS at stall.',
            tip: 'This is counterintuitive. Stall IAS is constant — stall TAS increases with altitude.',
          },
          {
            q: 'What is "P-factor" and when is it most pronounced?',
            a: 'P-factor (asymmetric propeller loading) is the left-turning tendency caused by the descending propeller blade (right side of the prop disc) having a higher angle of attack and producing more thrust than the ascending blade when the aircraft is at a high angle of attack. Most pronounced at high power, low airspeed (takeoff and climb).',
            tip: 'Left-turning tendencies combine four forces: P-factor, torque, gyroscopic precession, and spiraling slipstream.',
          },
          {
            q: 'Explain the relationship between angle of attack and lift coefficient (CL).',
            a: 'Lift coefficient (CL) increases proportionally with angle of attack up to the critical angle of attack (~15–18° for most wings), at which point it drops sharply (stall). The lift equation L = CL × ½ρV²S shows that increasing CL (by increasing AOA) increases lift — until the critical AOA triggers flow separation and stall.',
            tip: 'A common test question asks what happens to CL as you slow to maintain level flight — the pilot must increase AOA (and CL) to compensate for lower velocity.',
          },
          {
            q: 'What is "coffin corner" and which aircraft type is most susceptible?',
            a: 'Coffin corner is the altitude region where the low-speed buffet (stall speed) and high-speed buffet (critical Mach number) converge. At very high altitudes in high-speed jets, the margin between the two speeds becomes so narrow that the aircraft can simultaneously approach both limits. Most relevant for turbojet aircraft operating near their service ceiling.',
            tip: 'This is a CAX-level concept that appears on both the commercial and CFI written tests.',
          },
        ]}
      />

      <Section
        id="regulations"
        icon="📜"
        title="FAA Regulations Questions"
        questions={[
          {
            q: 'Under 14 CFR 91.155, what are the VFR visibility and cloud clearance requirements in Class G airspace below 1,200 feet AGL during the day?',
            a: '1 statute mile visibility and clear of clouds. This is the most permissive VFR requirement — Class G airspace below 1,200 ft AGL during daylight allows flight in just 1 SM visibility if you stay clear of clouds (no specified clearance distances). Note: night requires 3 SM and standard cloud clearances.',
            tip: 'Memorize the complete table: Class B (3 SM, clear of clouds), C & D (3 SM, 500-1000-2000), E above 10,000 (5 SM, 1000-1000-1 mile), G varies significantly.',
          },
          {
            q: 'What medical certificate is required for a student pilot to solo?',
            a: 'A third-class medical certificate (or BasicMed with certain restrictions) is required for a student pilot to conduct solo flights. The medical must be valid — third-class medicals are valid for 60 calendar months for pilots under age 40, and 24 calendar months for pilots 40 or older.',
            tip: 'BasicMed allows private pilot operations without a formal FAA medical as long as certain conditions are met (see 14 CFR 61.23).',
          },
          {
            q: 'When is a pilot required to file a NTSB accident report vs. an incident report?',
            a: 'An NTSB accident report (NTSB Form 6120.1) is required within 10 days when an aircraft accident results in fatal/serious injury or substantial damage. An incident (less serious occurrence) must be reported immediately by the most expeditious means, with a written report submitted within 10 days if requested by the NTSB.',
            tip: 'Key terms: "accident" involves fatalities, serious injury, or substantial damage. "Serious injury" has a specific FAA/NTSB definition (fractures, internal organs, blood loss, etc.).',
          },
        ]}
      />

      <Section
        id="weight-balance"
        icon="⚖️"
        title="Weight & Balance Questions"
        questions={[
          {
            q: 'An aircraft has a total weight of 2,950 lbs and a moment of 251,750 lb-in. What is the CG location?',
            a: 'CG = Total Moment ÷ Total Weight = 251,750 ÷ 2,950 = 85.3 inches aft of the datum. You then check this against the aircraft\'s allowable CG range (from the POH). If it falls outside the envelope, you must adjust loading before flight.',
            tip: 'Always double-check your answer against the CG envelope chart in the test supplement. The question usually asks whether the CG is within limits, not just its location.',
          },
          {
            q: 'What is the effect of an aft CG on aircraft performance and handling?',
            a: 'An aft CG moves the center of gravity behind the aerodynamic center, reducing static longitudinal stability. The aircraft becomes "lighter on the controls" (less stable, more pitch sensitive), and recovery from a stall may be more difficult. While aft CG slightly reduces drag and improves range, the stability reduction is a safety hazard.',
            tip: 'Forward CG = more stable, harder to control (high stick forces), reduced climb performance. Aft CG = less stable, easier to control, better range, but potentially dangerous.',
          },
          {
            q: 'Fuel burns during flight. How does fuel burn typically affect the CG?',
            a: 'It depends on the fuel tank location relative to the datum. For most single-engine aircraft with wing tanks near the CG, fuel burn shifts the CG slightly — usually aft as the wings empty. Check the POH to understand the direction for your specific aircraft. Always compute CG at takeoff AND estimated landing weight.',
            tip: 'The FAA regularly asks about CG shifts with fuel burn. Always think about the arm (distance from datum) of the fuel tank to determine the direction of CG movement.',
          },
        ]}
      />

      <BottomCTA
        headline="Master Every FAA Test Topic — From Concepts to Practice Exams"
        sub="Pilot Essentials covers all 17 chapters of private pilot ground school with structured video lessons, AI study guides, and 1,000+ practice questions organized by topic."
      />
    </BlogLayout>
  );
}
