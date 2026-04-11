export const COURSES = [
  {
    id: 'private-pilot',
    title: 'Private Pilot (PPL)',
    subtitle: 'FAA Part 61 Written Exam Prep',
    description: 'Master the fundamentals of aviation including aerodynamics, weather, navigation, and FAA regulations to ace your Private Pilot written exam.',
    icon: '✈️',
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'rgba(14,165,233,0.12)',
    borderColor: 'rgba(14,165,233,0.3)',
    glowColor: 'rgba(14,165,233,0.2)',
    badge: 'Most Popular',
    badgeColor: '#0ea5e9',
    totalLessons: 100,
    totalHours: 28,
    xpReward: 4000,
    difficulty: 'Beginner',
    students: 12840,
    rating: 4.9,
    modules: [
      {
        id: 'ppl-intro',
        title: 'Introduction',
        lessons: [
          { id: 'ppl-intro-meet', title: 'Meet Your Instructor: Tim Martin-Vegue', duration: '--:--', xp: 25, type: 'video', skipGuide: true },
        ]
      },
      {
        id: 'ppl-ch1',
        title: 'Chapter 1: Aerodynamics',
        lessons: [
          { id: 'ppl-ch1-l1', title: '1 — Forces of Flight', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch1-l2', title: '2 — Stability', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch1-l3', title: '3 — Angle of Attack and Stalls', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch1-l4', title: '4 — Ground Effect', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch1-l5', title: '5 — Spins', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch1-l6', title: '6 — Left Turning Tendencies', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch1-l7', title: '7 — Load Factor', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch1-l8', title: '8 — Velocity vs. G-loads', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch1-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
          { id: 'ppl-ch1-schedule', title: 'Schedule Your FAA Written Exam', duration: '1 min', xp: 0, type: 'info' },
        ]
      },
      {
        id: 'ppl-ch2',
        title: 'Chapter 2: Aircraft Systems',
        lessons: [
          { id: 'ppl-ch2-l1', title: '1 — Engine', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch2-l2', title: '2 — Carburetor', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch2-l3', title: '3 — Combustion', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch2-l4', title: '4 — Ignition System', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch2-l5', title: '5 — Fuel Types', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch2-l6', title: '6 — Propellers', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch2-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch3',
        title: 'Chapter 3: Flight Controls',
        lessons: [
          { id: 'ppl-ch3-l1', title: '1 — Primary Flight Controls', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch3-l2', title: '2 — Secondary Flight Controls', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch3-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 100, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch4',
        title: 'Chapter 4: Principles of Flight',
        lessons: [
          { id: 'ppl-ch4-l1', title: '1 — Altitudes', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch4-l2', title: '2 — Pressure Altitude', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch4-l3', title: '3 — Density Altitude', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch4-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 100, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch5',
        title: 'Chapter 5: Flight Manuals & Documents',
        lessons: [
          { id: 'ppl-ch5-l1', title: '1 — Aircraft Documents', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch5-l2', title: '2 — Aircraft Inspections', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch5-l3', title: '3 — Emergency Locator Transmitter', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch5-l4', title: '4 — Preflight Action', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch5-l5', title: '5 — Preventative Maintenance', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch5-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch6',
        title: 'Chapter 6: Flight Instruments',
        lessons: [
          { id: 'ppl-ch6-l1', title: '1 — Pitot Static System', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch6-l2', title: '2 — Gyroscopic Instruments', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch6-l3', title: '3 — Airspeed Indicator', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch6-l4', title: '4 — Altimeter', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch6-l5', title: '5 — Compass Errors (V.D.M.O.N.A.)', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch6-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch7',
        title: 'Chapter 7: Weight & Balance',
        lessons: [
          { id: 'ppl-ch7-l1', title: '1 — Weight and Balance 1', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch7-l2', title: '2 — Weight and Balance 2', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch7-l3', title: '3 — Weight and Balance 3', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch7-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 100, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch8',
        title: 'Chapter 8: Aircraft Performance',
        lessons: [
          { id: 'ppl-ch8-l1', title: '1 — General Aircraft Performance', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch8-l2', title: '2 — Takeoff Performance', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch8-l3', title: '3 — Landing Distance', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch8-l4', title: '4 — V Speeds', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch8-l5', title: '5 — Headwind Crosswind Component', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch8-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch9',
        title: 'Chapter 9: Weather Theory',
        lessons: [
          { id: 'ppl-ch9-l1', title: '1 — Intro to Weather', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch9-l2', title: '2 — Atmospheric Stability and Air Masses', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch9-l3', title: '3 — Dew Point', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch9-l4', title: '4 — Clouds', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch9-l5', title: '5 — Fog', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch9-l6', title: '6 — Temperature Inversion', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch9-l7', title: '7 — Structural Icing and Frost', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch9-l8', title: '8 — Turbulence', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch9-l9', title: '9 — Thunderstorms', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch9-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch10',
        title: 'Chapter 10: Aviation Weather Services',
        lessons: [
          { id: 'ppl-ch10-l1', title: '1 — Service Outlets and Weather Briefings', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch10-l2', title: '2 — M.E.T.A.R.', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch10-l3', title: '3 — P.I.R.E.P.', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch10-l4', title: '4 — T.A.F. and F.A.', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch10-l5', title: '5 — Inflight Weather Advisories', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch10-l6', title: '6 — Winds and Temperature Aloft Charts', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch10-l7', title: '7 — Surface Analysis and Weather Depiction Charts', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch10-l8', title: '8 — Prognostic Charts', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch10-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch11',
        title: 'Chapter 11: Airport Operations',
        lessons: [
          { id: 'ppl-ch11-l1', title: '1 — Airport Diagram', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch11-l2', title: '2 — Chart Supplement', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch11-l3', title: '3 — Airport Lights and Markings', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch11-l4', title: '4 — Visual Glideslope Indicators', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch11-l5', title: '5 — ATC Communication', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch11-l6', title: '6 — ATC Light Signals', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch11-l7', title: '7 — Traffic Patterns', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch11-l8', title: '8 — Right of Way', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch11-l9', title: '9 — Collision Avoidance', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch11-l10', title: '10 — Wake Turbulence', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch11-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch12',
        title: 'Chapter 12: Airspace',
        lessons: [
          { id: 'ppl-ch12-l1', title: '1 — General Airspace', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch12-l2', title: '2 — Special Use Airspace', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch12-l3', title: '3 — Other Airspace', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch12-l4', title: '4 — Equipment Required for Airspaces', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch12-l5', title: '5 — V.F.R. Weather Minimums', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch12-l6', title: '6 — Special V.F.R.', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch12-l7', title: '7 — Transponder Codes', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch12-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch13',
        title: 'Chapter 13: Navigation',
        lessons: [
          { id: 'ppl-ch13-l1', title: '1 — Sectional Chart', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch13-l2', title: '2 — Latitude and Longitude', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch13-l3', title: '3 — Wind Triangle', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch13-l4', title: '4 — Plotting a Course', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch13-l5', title: '5 — Estimated Time En Route', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch13-l6', title: '6 — Fuel Consumption', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch13-l7', title: '7 — V.F.R. Cruise Altitudes', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch13-l8', title: '8 — V.O.R.', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch13-l9', title: '9 — V.F.R. Flight Plan', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch13-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch14',
        title: 'Chapter 14: Aeromedical Factors',
        lessons: [
          { id: 'ppl-ch14-l1', title: '1 — General Aeromedical Factors', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch14-l2', title: '2 — Spatial Disorientation', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch14-l3', title: '3 — Alcohol and Drugs', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch14-l4', title: '4 — Hypoxia', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch14-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 100, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch15',
        title: 'Chapter 15: Regulations',
        lessons: [
          { id: 'ppl-ch15-l1', title: '1 — P.I.C. Authority', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch15-l2', title: '2 — Minimum Safe Altitude', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch15-l3', title: '3 — Maximum Airspeed', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch15-l4', title: '4 — Aerobatic Flight', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch15-l5', title: '5 — Nighttime', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch15-l6', title: '6 — N.T.S.B.', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch15-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch16',
        title: 'Chapter 16: Pilot Qualification',
        lessons: [
          { id: 'ppl-ch16-l1', title: '1 — Categories and Classes', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch16-l2', title: '2 — Pilot Documents', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch16-l3', title: '3 — Medical Certificate', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch16-l4', title: '4 — Endorsements', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch16-l5', title: '5 — Privileges & Limitations', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch16-l6', title: '6 — Currency', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch16-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-ch17',
        title: 'Chapter 17: Miscellaneous',
        lessons: [
          { id: 'ppl-ch17-l1', title: '1 — Aeronautical Decision Making', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch17-l2', title: '2 — FAA Publications', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch17-l3', title: '3 — Inflight Maneuvers', duration: '--:--', xp: 50, type: 'video' },
          { id: 'ppl-ch17-quiz', title: 'End of Section Quiz', duration: '10 questions', xp: 100, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-final',
        title: 'End of Course Test',
        lessons: [
          { id: 'ppl-final-test', title: 'Private Pilot Test', duration: '60 questions', xp: 500, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-bonus',
        title: 'Bonus Practice — All Topics',
        lessons: [
          { id: 'ppl-extra-intro',      title: 'FAA Rules & Certificates Quiz', duration: '15 questions', xp: 150, type: 'quiz' },
          { id: 'ppl-extra-adm',        title: 'Aeronautical Decision Making Quiz', duration: '6 questions', xp: 75, type: 'quiz' },
          { id: 'ppl-extra-aero',       title: 'Aerodynamics of Flight Quiz', duration: '15 questions', xp: 150, type: 'quiz' },
          { id: 'ppl-extra-controls',   title: 'Flight Controls Quiz', duration: '9 questions', xp: 100, type: 'quiz' },
          { id: 'ppl-extra-instruments',title: 'Flight Instruments Quiz', duration: '15 questions', xp: 150, type: 'quiz' },
          { id: 'ppl-extra-manuals',    title: 'Flight Manuals & POH Quiz', duration: '15 questions', xp: 150, type: 'quiz' },
          { id: 'ppl-extra-wb',         title: 'Weight & Balance Quiz', duration: '15 questions', xp: 150, type: 'quiz' },
          { id: 'ppl-extra-perf',       title: 'Aircraft Performance Quiz', duration: '15 questions', xp: 150, type: 'quiz' },
          { id: 'ppl-extra-wx-svcs',    title: 'Aviation Weather Services Quiz', duration: '20 questions', xp: 200, type: 'quiz' },
          { id: 'ppl-extra-airport',    title: 'Airport Operations Quiz', duration: '20 questions', xp: 200, type: 'quiz' },
          { id: 'ppl-extra-aeromedical',title: 'Aeromedical Factors Quiz', duration: '10 questions', xp: 100, type: 'quiz' },
        ]
      }
    ]
  },
  {
    id: 'instrument-rating',
    underConstruction: true,
    title: 'Instrument Rating (IFR)',
    subtitle: 'FAA Instrument Written Exam Prep',
    description: 'Conquer IFR procedures, approach charts, holding patterns, and instrument meteorological conditions for your Instrument Rating.',
    icon: '🎯',
    color: 'from-purple-500 to-pink-400',
    bgColor: 'rgba(139,92,246,0.12)',
    borderColor: 'rgba(139,92,246,0.3)',
    glowColor: 'rgba(139,92,246,0.2)',
    badge: 'Intermediate',
    badgeColor: '#8b5cf6',
    totalLessons: 38,
    totalHours: 22,
    xpReward: 3000,
    difficulty: 'Intermediate',
    students: 6420,
    rating: 4.8,
    modules: [
      {
        id: 'ifr-m1',
        title: 'IFR Fundamentals',
        lessons: [
          { id: 'ifr-l1', title: 'Introduction to IFR Flight', duration: '16:40', xp: 75, type: 'video' },
          { id: 'ifr-l2', title: 'Flight Instruments Deep Dive', duration: '22:15', xp: 75, type: 'video' },
          { id: 'ifr-l3', title: 'Gyroscopic Instruments', duration: '18:30', xp: 75, type: 'video' },
          { id: 'ifr-l4', title: 'Module 1 Quiz', duration: '10 questions', xp: 200, type: 'quiz' },
        ]
      },
      {
        id: 'ifr-m2',
        title: 'IFR Navigation',
        lessons: [
          { id: 'ifr-l5', title: 'Enroute Charts', duration: '25:10', xp: 75, type: 'video' },
          { id: 'ifr-l6', title: 'Holding Patterns', duration: '20:45', xp: 75, type: 'video' },
          { id: 'ifr-l7', title: 'Approach Plates & Procedures', duration: '28:00', xp: 75, type: 'video' },
          { id: 'ifr-l8', title: 'Module 2 Quiz', duration: '12 questions', xp: 200, type: 'quiz' },
        ]
      },
      {
        id: 'ifr-m3',
        title: 'IFR Procedures',
        lessons: [
          { id: 'ifr-l9', title: 'Departure Procedures', duration: '19:20', xp: 75, type: 'video' },
          { id: 'ifr-l10', title: 'Arrival Procedures (STARs)', duration: '21:35', xp: 75, type: 'video' },
          { id: 'ifr-l11', title: 'ILS & Precision Approaches', duration: '24:50', xp: 75, type: 'video' },
          { id: 'ifr-l12', title: 'Final Exam Prep Quiz', duration: '20 questions', xp: 400, type: 'quiz' },
        ]
      }
    ]
  },
  {
    id: 'commercial-pilot',
    underConstruction: true,
    title: 'Commercial Pilot (CPL)',
    subtitle: 'FAA Commercial Written Exam Prep',
    description: 'Advance your aeronautical knowledge with complex aircraft systems, advanced maneuvers, and commercial operating rules.',
    icon: '🏆',
    color: 'from-amber-500 to-orange-400',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.3)',
    glowColor: 'rgba(245,158,11,0.2)',
    badge: 'Advanced',
    badgeColor: '#f59e0b',
    totalLessons: 35,
    totalHours: 20,
    xpReward: 4000,
    difficulty: 'Advanced',
    students: 3210,
    rating: 4.9,
    modules: [
      {
        id: 'cpl-m1',
        title: 'Commercial Aerodynamics',
        lessons: [
          { id: 'cpl-l1', title: 'Advanced Aerodynamics', duration: '22:00', xp: 100, type: 'video' },
          { id: 'cpl-l2', title: 'High-Performance Aircraft', duration: '20:30', xp: 100, type: 'video' },
          { id: 'cpl-l3', title: 'Complex Aircraft Systems', duration: '18:15', xp: 100, type: 'video' },
          { id: 'cpl-l4', title: 'Module 1 Quiz', duration: '10 questions', xp: 250, type: 'quiz' },
        ]
      },
      {
        id: 'cpl-m2',
        title: 'Commercial Operations',
        lessons: [
          { id: 'cpl-l5', title: 'FAR Part 135 Operations', duration: '24:40', xp: 100, type: 'video' },
          { id: 'cpl-l6', title: 'Weight & Balance Advanced', duration: '19:55', xp: 100, type: 'video' },
          { id: 'cpl-l7', title: 'Performance Charts & POH', duration: '26:10', xp: 100, type: 'video' },
          { id: 'cpl-l8', title: 'Final Exam Prep Quiz', duration: '20 questions', xp: 500, type: 'quiz' },
        ]
      }
    ]
  },
  {
    id: 'flight-instructor',
    underConstruction: true,
    title: 'Flight Instructor (CFI)',
    subtitle: 'FAA CFI Written Exam Prep',
    description: 'Learn the fundamentals of teaching flight, lesson planning, student evaluation, and the fundamentals of flight instruction.',
    icon: '🎓',
    color: 'from-green-500 to-teal-400',
    bgColor: 'rgba(34,197,94,0.12)',
    borderColor: 'rgba(34,197,94,0.3)',
    glowColor: 'rgba(34,197,94,0.2)',
    badge: 'Expert',
    badgeColor: '#22c55e',
    totalLessons: 30,
    totalHours: 16,
    xpReward: 5000,
    difficulty: 'Expert',
    students: 1840,
    rating: 4.7,
    modules: [
      {
        id: 'cfi-m1',
        title: 'Fundamentals of Instruction',
        lessons: [
          { id: 'cfi-l1', title: 'Learning Theory', duration: '18:00', xp: 125, type: 'video' },
          { id: 'cfi-l2', title: 'Teaching Methods', duration: '22:15', xp: 125, type: 'video' },
          { id: 'cfi-l3', title: 'Lesson Planning', duration: '15:30', xp: 125, type: 'video' },
          { id: 'cfi-l4', title: 'Module 1 Quiz', duration: '10 questions', xp: 300, type: 'quiz' },
        ]
      },
      {
        id: 'cfi-m2',
        title: 'Flight Instruction Techniques',
        lessons: [
          { id: 'cfi-l5', title: 'Demonstration-Performance Method', duration: '20:40', xp: 125, type: 'video' },
          { id: 'cfi-l6', title: 'Student Evaluation', duration: '17:55', xp: 125, type: 'video' },
          { id: 'cfi-l7', title: 'Common Student Errors', duration: '19:20', xp: 125, type: 'video' },
          { id: 'cfi-l8', title: 'Final Exam Prep Quiz', duration: '20 questions', xp: 600, type: 'quiz' },
        ]
      }
    ]
  }
];

export const QUIZ_BANK = {
  'ppl-l5': {
    title: "Principles of Flight Quiz",
    questions: [
      {
        id: 1,
        question: "If an altimeter setting is not available before flight, to which altitude should the pilot adjust the altimeter",
        options: ["Pressure altitude corrected for nonstandard temperature.", "The elevation of the nearest airport corrected to mean sea level.", "The elevation of the departure area."],
        correct: 2,
        explanation: "The correct answer is: The elevation of the departure area."
      },
      {
        id: 2,
        question: "Prior to takeoff, the altimeter should be set to which altitude or altimeter setting",
        options: ["The current local altimeter setting, if available, or the departure airport elevation.", "The corrected density altitude of the departure airport.", "The corrected pressure altitude for the departure airport."],
        correct: 0,
        explanation: "The correct answer is: The current local altimeter setting, if available, or the departure airport elevation."
      },
      {
        id: 3,
        question: "At what altitude shall the altimeter be set to 29.92, when climbing to cruising flight level",
        options: ["24,000 feet MSL.", "18,000 feet MSL.", "14,500 feet MSL."],
        correct: 1,
        explanation: "The correct answer is: 18,000 feet MSL."
      },
      {
        id: 4,
        question: "What effect does high density altitude, as compared to low density altitude, have on propeller efficiency and why",
        options: ["Efficiency is reduced due to the increased force of the propeller in the thinner air.", "Efficiency is reduced because the propeller exerts less force at high density altitudes than at low density altitudes.", "Efficiency is increased due to less friction on the propeller blades."],
        correct: 1,
        explanation: "The correct answer is: Efficiency is reduced because the propeller exerts less force at high density altitudes than at low density altitudes."
      },
      {
        id: 5,
        question: "Altimeter setting is the value to which the barometric pressure scale of the altimeter is set so the altimeter indicates",
        options: ["absolute altitude at field elevation.", "calibrated altitude at field elevation.", "true altitude at field elevation."],
        correct: 2,
        explanation: "The correct answer is: true altitude at field elevation."
      },
      {
        id: 6,
        question: "How do variations in temperature affect the altimeter",
        options: ["Pressure levels are raised on warm days and the indicated altitude is lower than true altitude.", "Higher temperatures expand the pressure levels and the indicated altitude is higher than true altitude.", "Lower temperatures lower the pressure levels and the indicated altitude is lower than true altitude."],
        correct: 0,
        explanation: "The correct answer is: Pressure levels are raised on warm days and the indicated altitude is lower than true altitude."
      },
      {
        id: 7,
        question: "What is true altitude",
        options: ["The vertical distance of the aircraft above the surface.", "The vertical distance of the aircraft above sea level.", "The height above the standard datum plane."],
        correct: 1,
        explanation: "The correct answer is: The vertical distance of the aircraft above sea level."
      },
      {
        id: 8,
        question: "What is absolute altitude",
        options: ["The altitude read directly from the altimeter.", "The vertical distance of the aircraft above the surface.", "The height above the standard datum plane."],
        correct: 1,
        explanation: "The correct answer is: The vertical distance of the aircraft above the surface."
      },
      {
        id: 9,
        question: "What is density altitude",
        options: ["The height above the standard datum plane.", "The altitude read directly from the altimeter.", "The pressure altitude corrected for nonstandard temperature."],
        correct: 2,
        explanation: "The correct answer is: The pressure altitude corrected for nonstandard temperature."
      },
      {
        id: 10,
        question: "What is pressure altitude",
        options: ["The altitude indicated when the barometric pressure scale is set to 29.92.", "The indicated altitude corrected for nonstandard temperature and pressure.", "The indicated altitude corrected for position and installation error."],
        correct: 0,
        explanation: "The correct answer is: The altitude indicated when the barometric pressure scale is set to 29.92."
      },
      {
        id: 11,
        question: "Under what condition is indicated altitude the same as true altitude",
        options: ["If the altimeter has no mechanical error.", "When at 18,000 feet MSL with the altimeter set at 29.92.", "When at sea level under standard conditions."],
        correct: 2,
        explanation: "The correct answer is: When at sea level under standard conditions."
      },
      {
        id: 12,
        question: "If it is necessary to set the altimeter from 29.15 to 29.85, what change occurs",
        options: ["700-foot increase in indicated altitude.", "70-foot increase in density altitude.", "70-foot increase in indicated altitude."],
        correct: 0,
        explanation: "The correct answer is: 700-foot increase in indicated altitude."
      },
      {
        id: 13,
        question: "If the outside air temperature (OAT) at a given altitude is warmer than standard, the density altitude is",
        options: ["lower than pressure altitude.", "higher than pressure altitude.", "equal to pressure altitude."],
        correct: 1,
        explanation: "The correct answer is: higher than pressure altitude."
      },
      {
        id: 14,
        question: "Which combination of atmospheric conditions will reduce aircraft takeoff and climb performance",
        options: ["High temperature, low relative humidity, and low density altitude.", "Low temperature, low relative humidity, and low density altitude.", "High temperature, high relative humidity, and high density altitude."],
        correct: 2,
        explanation: "The correct answer is: High temperature, high relative humidity, and high density altitude."
      },
      {
        id: 15,
        question: "What effect does high density altitude have on aircraft performance",
        options: ["It increases takeoff performance.", "It increases engine performance.", "It reduces climb performance."],
        correct: 2,
        explanation: "The correct answer is: It reduces climb performance."
      },
      {
        id: 16,
        question: "(Refer to figure 8.) What is the effect of a temperature increase from 25 to 50 °F on the density altitude if the pressure altitude remains at 5,000 feet",
        options: ["1,650-foot increase.", "1,200-foot increase.", "1,400-foot increase."],
        correct: 0,
        explanation: "The correct answer is: 1,650-foot increase."
      },
      {
        id: 17,
        question: "(Refer to figure 8.) Determine the pressure altitude with an indicated altitude of 1,380 feet MSL with an altimeter setting of 28.22 at standard temperature.",
        options: ["3,010 feet MSL.", "2,991 feet MSL.", "2,913 feet MSL."],
        correct: 0,
        explanation: "The correct answer is: 3,010 feet MSL."
      },
      {
        id: 18,
        question: "(Refer to figure 8.) Determine the density altitude for these conditions:Altimeter setting 29.25Runway temperature +81 °FAirport elevation 5,250 ft MSL",
        options: ["8,500 feet MSL.", "5,877 feet MSL.", "4,600 feet MSL."],
        correct: 0,
        explanation: "The correct answer is: 8,500 feet MSL."
      },
      {
        id: 19,
        question: "(Refer to figure 8.) Determine the pressure altitude at an airport that is 3,563 feet MSL with an altimeter setting of 29.96.",
        options: ["3,556 feet MSL.", "3,527 feet MSL.", "3,639 feet MSL."],
        correct: 1,
        explanation: "The correct answer is: 3,527 feet MSL."
      },
      {
        id: 20,
        question: "(Refer to figure 8.) What is the effect of a temperature increase from 30 to 50 °F on the density altitude if the pressure altitude remains at 3,000 feet MSL",
        options: ["1,100-foot decrease.", "1,300-foot increase.", "900-foot increase."],
        correct: 1,
        explanation: "The correct answer is: 1,300-foot increase."
      },
    ]
  },
  'ppl-l10': {
    title: "Aircraft Systems Quiz",
    questions: [
      {
        id: 1,
        question: "Excessively high engine temperatures will",
        options: ["not appreciably affect an aircraft engine.", "cause loss of power, excessive oil consumption, and possible permanent internal engine damage.", "cause damage to heat-conducting hoses and warping of the cylinder cooling fins."],
        correct: 1,
        explanation: "The correct answer is: cause loss of power, excessive oil consumption, and possible permanent internal engine damage."
      },
      {
        id: 2,
        question: "If the engine oil temperature and cylinder head temperature gauges have exceeded their normal operating range, the pilot may have been operating with",
        options: ["higher-than-normal oil pressure.", "the mixture set too rich.", "too much power and with the mixture set too lean."],
        correct: 2,
        explanation: "The correct answer is: too much power and with the mixture set too lean."
      },
      {
        id: 3,
        question: "One purpose of the dual ignition system on an aircraft engine is to provide for",
        options: ["balanced cylinder head pressure.", "improved engine performance.", "uniform heat distribution."],
        correct: 1,
        explanation: "The correct answer is: improved engine performance."
      },
      {
        id: 4,
        question: "The operating principle of float-type carburetors is based on the",
        options: ["difference in air pressure at the venturi throat and the air inlet.", "increase in air velocity in the throat of a venturi causing an increase in air pressure.", "automatic metering of air at the venturi as the aircraft gains altitude."],
        correct: 0,
        explanation: "The correct answer is: difference in air pressure at the venturi throat and the air inlet."
      },
      {
        id: 5,
        question: "The basic purpose of adjusting the fuel/air mixture at altitude is to",
        options: ["increase the amount of fuel in the mixture to compensate for the decrease in pressure and density of the air.", "decrease the amount of fuel in the mixture in order to compensate for increased air density.", "decrease the fuel flow in order to compensate for decreased air density."],
        correct: 2,
        explanation: "The correct answer is: decrease the fuel flow in order to compensate for decreased air density."
      },
      {
        id: 6,
        question: "During the run-up at a high-elevation airport, a pilot notes a slight engine roughness that is not affected by the magneto check but grows worse during the carburetor heat check. Under these circumstances, what would be the most logical initial action",
        options: ["Check the results obtained with a leaner setting of the mixture.", "Taxi back to the flight line for a maintenance check.", "Reduce manifold pressure to control detonation."],
        correct: 0,
        explanation: "The correct answer is: Check the results obtained with a leaner setting of the mixture."
      },
      {
        id: 7,
        question: "While cruising at 9,500 feet MSL, the fuel/air mixture is properly adjusted. What will occur if a descent to 4,500 feet MSL is made without readjusting the mixture",
        options: ["The fuel/air mixture may become excessively lean.", "There will be more fuel in the cylinders than is needed for normal combustion, and the excess fuel will absorb heat and cool the engine.", "The excessively rich mixture will create higher cylinder head temperatures and may cause detonation."],
        correct: 0,
        explanation: "The correct answer is: The fuel/air mixture may become excessively lean."
      },
      {
        id: 8,
        question: "Which condition is most favorable to the development of carburetor icing",
        options: ["Temperature between 20 and 70 °F and high humidity.", "Temperature between 32 and 50 °F and low humidity.", "Any temperature below freezing and a relative humidity of less than 50 percent."],
        correct: 0,
        explanation: "The correct answer is: Temperature between 20 and 70 °F and high humidity."
      },
      {
        id: 9,
        question: "The possibility of carburetor icing exists even when the ambient air temperature is as",
        options: ["high as 70 °F and the relative humidity is high.", "high as 95 °F and there is visible moisture.", "low as 0 °F and the relative humidity is high."],
        correct: 0,
        explanation: "The correct answer is: high as 70 °F and the relative humidity is high."
      },
      {
        id: 10,
        question: "If an aircraft is equipped with a fixed-pitch propeller and a float-type carburetor, the first indication of carburetor ice would most likely be",
        options: ["engine roughness.", "a drop in oil temperature and cylinder head temperature.", "loss of RPM."],
        correct: 2,
        explanation: "The correct answer is: loss of RPM."
      },
      {
        id: 11,
        question: "Applying carburetor heat will",
        options: ["not affect the fuel/air mixture.", "result in more air going through the carburetor.", "enrich the fuel/air mixture."],
        correct: 2,
        explanation: "The correct answer is: enrich the fuel/air mixture."
      },
      {
        id: 12,
        question: "What change occurs in the fuel/air mixture when carburetor heat is applied",
        options: ["The fuel/air mixture becomes leaner.", "A decrease in RPM results from the lean mixture.", "The fuel/air mixture becomes richer."],
        correct: 2,
        explanation: "The correct answer is: The fuel/air mixture becomes richer."
      },
      {
        id: 13,
        question: "Generally speaking, the use of carburetor heat tends to",
        options: ["have no effect on engine performance.", "increase engine performance.", "decrease engine performance."],
        correct: 2,
        explanation: "The correct answer is: decrease engine performance."
      },
      {
        id: 14,
        question: "The presence of carburetor ice in an aircraft equipped with a fixed-pitch propeller can be verified by applying carburetor heat and noting",
        options: ["a decrease in RPM and then a gradual increase in RPM.", "a decrease in RPM and then a constant RPM indication.", "an increase in RPM and then a gradual decrease in RPM."],
        correct: 0,
        explanation: "The correct answer is: a decrease in RPM and then a gradual increase in RPM."
      },
      {
        id: 15,
        question: "With regard to carburetor ice, float-type carburetor systems in comparison to fuel injection systems are generally considered to be",
        options: ["more susceptible to icing.", "equally susceptible to icing.", "susceptible to icing only when visible moisture is present."],
        correct: 0,
        explanation: "The correct answer is: more susceptible to icing."
      },
      {
        id: 16,
        question: "If the grade of fuel used in an aircraft engine is lower than specified for the engine, it will most likely cause",
        options: ["detonation.", "lower cylinder head temperatures.", "a mixture of fuel and air that is not uniform in all cylinders."],
        correct: 0,
        explanation: "The correct answer is: detonation."
      },
      {
        id: 17,
        question: "Detonation occurs in a reciprocating aircraft engine when",
        options: ["hot spots in the combustion chamber ignite the fuel/air mixture in advance of normal ignition.", "the spark plugs are fouled or shorted out or the wiring is defective.", "the unburned charge in the cylinders explodes instead of burning normally."],
        correct: 2,
        explanation: "The correct answer is: the unburned charge in the cylinders explodes instead of burning normally."
      },
      {
        id: 18,
        question: "If a pilot suspects that the engine (with a fixed-pitch propeller) is detonating during climb-out after takeoff, the initial corrective action to take would be to",
        options: ["lower the nose slightly to increase airspeed.", "lean the mixture.", "apply carburetor heat."],
        correct: 0,
        explanation: "The correct answer is: lower the nose slightly to increase airspeed."
      },
      {
        id: 19,
        question: "The uncontrolled firing of the fuel/air charge in advance of normal spark ignition is known as",
        options: ["pre-ignition.", "detonation.", "combustion."],
        correct: 0,
        explanation: "The correct answer is: pre-ignition."
      },
      {
        id: 20,
        question: "Which would most likely cause the cylinder head temperature and engine oil temperature gauges to exceed their normal operating ranges",
        options: ["Using fuel that has a lower-than-specified fuel rating.", "Using fuel that has a higher-than-specified fuel rating.", "Operating with higher-than-normal oil pressure."],
        correct: 0,
        explanation: "The correct answer is: Using fuel that has a lower-than-specified fuel rating."
      },
    ]
  },
  'ppl-l15': {
    title: "Weather & Meteorology Quiz",
    questions: [
      {
        id: 1,
        question: "Every physical process of weather is accompanied by, or is the result of, a",
        options: ["heat exchange.", "pressure differential.", "movement of air."],
        correct: 0,
        explanation: "The correct answer is: heat exchange."
      },
      {
        id: 2,
        question: "What causes variations in altimeter settings between weather reporting points",
        options: ["Coriolis force.", "Unequal heating of the Earth's surface.", "Variation of terrain elevation."],
        correct: 1,
        explanation: "The correct answer is: Unequal heating of the Earth's surface."
      },
      {
        id: 3,
        question: "A temperature inversion would most likely result in which weather condition",
        options: ["Good visibility in the lower levels of the atmosphere and poor visibility above an inversion aloft.", "An increase in temperature as altitude is increased.", "Clouds with extensive vertical development above an inversion aloft."],
        correct: 1,
        explanation: "The correct answer is: An increase in temperature as altitude is increased."
      },
      {
        id: 4,
        question: "The most frequent type of ground or surface-based temperature inversion is that which is produced by",
        options: ["terrestrial radiation on a clear, relatively still night.", "warm air being lifted rapidly aloft in the vicinity of mountainous terrain.", "the movement of colder air under warm air, or the movement of warm air over cold air."],
        correct: 0,
        explanation: "The correct answer is: terrestrial radiation on a clear, relatively still night."
      },
      {
        id: 5,
        question: "Which weather conditions should be expected beneath a low-level temperature inversion layer when the relative humidity is high",
        options: ["Smooth air, poor visibility, fog, haze, or low clouds.", "Light wind shear, poor visibility, haze, and light rain.", "Turbulent air, poor visibility, fog, low stratus type clouds, and showery precipitation."],
        correct: 0,
        explanation: "The correct answer is: Smooth air, poor visibility, fog, haze, or low clouds."
      },
      {
        id: 6,
        question: "What are the standard temperature and pressure values for sea level",
        options: ["59 °F and 29.92 millibars.", "59 °C and 1013.2 millibars.", "15 °C and 29.92\" Hg."],
        correct: 2,
        explanation: "The correct answer is: 15 °C and 29.92\" Hg."
      },
      {
        id: 7,
        question: "If a pilot changes the altimeter setting from 30.11 to 29.96, what is the approximate change in indication",
        options: ["Altimeter will indicate 150 feet higher.", "Altimeter will indicate 150 feet lower.", "Altimeter will indicate .15\" Hg higher."],
        correct: 1,
        explanation: "The correct answer is: Altimeter will indicate 150 feet lower."
      },
      {
        id: 8,
        question: "Under which condition will pressure altitude be equal to true altitude",
        options: ["When standard atmospheric conditions exist.", "When the atmospheric pressure is 29.92\" Hg.", "When indicated altitude is equal to the pressure altitude."],
        correct: 0,
        explanation: "The correct answer is: When standard atmospheric conditions exist."
      },
      {
        id: 9,
        question: "Under what condition is pressure altitude and density altitude the same value",
        options: ["At standard temperature.", "At sea level, when the temperature is 0 °F.", "When the altimeter has no installation error."],
        correct: 0,
        explanation: "The correct answer is: At standard temperature."
      },
      {
        id: 10,
        question: "If a flight is made from an area of low pressure into an area of high pressure without the altimeter setting being adjusted, the altimeter will indicate",
        options: ["lower than the actual altitude above sea level.", "higher than the actual altitude above sea level.", "the actual altitude above sea level."],
        correct: 0,
        explanation: "The correct answer is: lower than the actual altitude above sea level."
      },
      {
        id: 11,
        question: "If a flight is made from an area of high pressure into an area of lower pressure without the altimeter setting being adjusted, the altimeter will indicate",
        options: ["the actual altitude above sea level.", "lower than the actual altitude above sea level.", "higher than the actual altitude above sea level."],
        correct: 2,
        explanation: "The correct answer is: higher than the actual altitude above sea level."
      },
      {
        id: 12,
        question: "Under what condition will true altitude be lower than indicated altitude",
        options: ["When density altitude is higher than indicated altitude.", "In warmer than standard air temperature.", "In colder than standard air temperature."],
        correct: 2,
        explanation: "The correct answer is: In colder than standard air temperature."
      },
      {
        id: 13,
        question: "Which condition would cause the altimeter to indicate a lower altitude than true altitude",
        options: ["Air temperature lower than standard.", "Atmospheric pressure lower than standard.", "Air temperature warmer than standard."],
        correct: 2,
        explanation: "The correct answer is: Air temperature warmer than standard."
      },
      {
        id: 14,
        question: "Which factor would tend to increase the density altitude at a given airport",
        options: ["An increase in barometric pressure.", "An increase in ambient temperature.", "A decrease in relative humidity."],
        correct: 1,
        explanation: "The correct answer is: An increase in ambient temperature."
      },
      {
        id: 15,
        question: "The wind at 5,000 feet AGL is southwesterly while the surface wind is southerly. This difference in direction is primarily due to",
        options: ["stronger Coriolis force at the surface.", "stronger pressure gradient at higher altitudes.", "friction between the wind and the surface."],
        correct: 2,
        explanation: "The correct answer is: friction between the wind and the surface."
      },
      {
        id: 16,
        question: "What is meant by the term \"dewpoint''",
        options: ["The temperature at which condensation and evaporation are equal.", "The temperature to which air must be cooled to become saturated.", "The temperature at which dew will always form."],
        correct: 1,
        explanation: "The correct answer is: The temperature to which air must be cooled to become saturated."
      },
      {
        id: 17,
        question: "The amount of water vapor which air can hold depends on the",
        options: ["stability of the air.", "dewpoint.", "air temperature."],
        correct: 2,
        explanation: "The correct answer is: air temperature."
      },
      {
        id: 18,
        question: "Clouds, fog, or dew will always form when",
        options: ["relative humidity reaches 100 percent.", "water vapor is present.", "water vapor condenses."],
        correct: 2,
        explanation: "The correct answer is: water vapor condenses."
      },
      {
        id: 19,
        question: "What are the processes by which moisture is added to unsaturated air",
        options: ["Evaporation and sublimation.", "Heating and condensation.", "Supersaturation and evaporation."],
        correct: 0,
        explanation: "The correct answer is: Evaporation and sublimation."
      },
      {
        id: 20,
        question: "Which conditions result in the formation of frost",
        options: ["The temperature of the surrounding air is at or below freezing when small drops of moisture fall on the collecting surface.", "The temperature of the collecting surface is at or below freezing when small droplets of moisture fall on the surface.", "The temperature of the collecting surface is at or below the dewpoint of the adjacent air and the dewpoint is below freezing."],
        correct: 2,
        explanation: "The correct answer is: The temperature of the collecting surface is at or below the dewpoint of the adjacent air and the dewpoint is below freezing."
      },
    ]
  },
  'ppl-l20': {
    title: "Navigation Quiz",
    questions: [
      {
        id: 1,
        question: "The letters VHF/DF appearing in the Airport/Facility Directory for a certain airport indicate that",
        options: ["this airport is designated as an airport of entry.", "the Flight Service Station has equipment with which to determine your direction from the station.", "this airport has a direct-line phone to the Flight Service Station."],
        correct: 1,
        explanation: "The correct answer is: the Flight Service Station has equipment with which to determine your direction from the station."
      },
      {
        id: 2,
        question: "Which cruising altitude is appropriate for a VFR flight on a magnetic course of 135°",
        options: ["Even thousandths plus 500 feet.", "Even thousandths.", "Odd thousandths plus 500 feet."],
        correct: 2,
        explanation: "The correct answer is: Odd thousandths plus 500 feet."
      },
      {
        id: 3,
        question: "Which VFR cruising altitude is acceptable for a flight on a Victor Airway with a magnetic course of 175°? The terrain is less than 1,000 feet.",
        options: ["5,000 feet.", "4,500 feet.", "5,500 feet."],
        correct: 2,
        explanation: "The correct answer is: 5,500 feet."
      },
      {
        id: 4,
        question: "Which VFR cruising altitude is appropriate when flying above 3,000 feet AGL on a magnetic course of 185°",
        options: ["4,500 feet.", "4,000 feet.", "5,000 feet."],
        correct: 0,
        explanation: "The correct answer is: 4,500 feet."
      },
      {
        id: 5,
        question: "Each person operating an aircraft at a VFR cruising altitude shall maintain an odd-thousand plus 500-foot altitude while on a",
        options: ["true course of 0° through 179°.", "magnetic course of 0° through 179°.", "magnetic heading of 0° through 179°."],
        correct: 1,
        explanation: "The correct answer is: magnetic course of 0° through 179°."
      },
      {
        id: 6,
        question: "(Refer to figure 53.) Where is Loup City Municipal located with relation to the city",
        options: ["Northeast approximately 3 miles.", "Northwest approximately 1 mile.", "East approximately 10 miles."],
        correct: 1,
        explanation: "The correct answer is: Northwest approximately 1 mile."
      },
      {
        id: 7,
        question: "(Refer to figure 21.) En route to First Flight Airport (area 5), your flight passes over Hampton Roads Airport (area 2) at 1456 and then over Chesapeake Municipal at 1501. At what time should your flight arrive at First Flight",
        options: ["1526.", "1521.", "1516."],
        correct: 0,
        explanation: "The correct answer is: 1526."
      },
      {
        id: 8,
        question: "(Refer to figure 21, area 3.) Determine the approximate latitude and longitude of Currituck County Airport.",
        options: ["47°24'N - 75°58'W.", "36°48'N - 76°01'W.", "36°24'N - 76°01'W."],
        correct: 2,
        explanation: "The correct answer is: 36°24'N - 76°01'W."
      },
      {
        id: 9,
        question: "(Refer to figure 21.) Determine the magnetic course from First Flight Airport (area 5) to Hampton Roads Airport (area 2).",
        options: ["321°.", "330°.", "312°."],
        correct: 1,
        explanation: "The correct answer is: 330°."
      },
      {
        id: 10,
        question: "(Refer to figure 21.) What is your approximate position on low altitude airway Victor 1, southwest of Norfolk (area 1), if the VOR receiver indicates you are on the 340° radial of Elizabeth City VOR (area 3)",
        options: ["23 nautical miles from Norfolk VORTAC.", "18 nautical miles from Norfolk VORTAC.", "15 nautical miles from Norfolk VORTAC."],
        correct: 1,
        explanation: "The correct answer is: 18 nautical miles from Norfolk VORTAC."
      },
      {
        id: 11,
        question: "(Refer to figure 21, area 3; and figure 29.) The VOR is tuned to Elizabeth City VOR, and the aircraft is positioned over Shawboro. Which VOR indication is correct",
        options: ["6.", "5.", "8."],
        correct: 2,
        explanation: "The correct answer is: 8."
      },
      {
        id: 12,
        question: "(Refer to figure 22.) What is the estimated time en route from Mercer County Regional Airport (area 3) to Minot International (area 1)? The wind is from 330° at 25 knots and the true airspeed is 100 knots. Add 3-1/2 minutes for departure and climb-out.",
        options: ["44 minutes.", "52 minutes.", "48 minutes."],
        correct: 2,
        explanation: "The correct answer is: 48 minutes."
      },
      {
        id: 13,
        question: "(Refer to figure 22, area 2.) Which airport is located at approximately 47°39'30\"N latitude and 100°53'00\"W longitude",
        options: ["Johnson.", "Linrud.", "Crooked Lake."],
        correct: 2,
        explanation: "The correct answer is: Crooked Lake."
      },
      {
        id: 14,
        question: "(Refer to figure 22, area 3.) Which airport is located at approximately 47°21'N latitude and 101°01'W longitude",
        options: ["Evenson.", "Washburn.", "Underwood."],
        correct: 1,
        explanation: "The correct answer is: Washburn."
      },
      {
        id: 15,
        question: "(Refer to figure 22.) An airship crosses over Minot VORTAC (area 1) at 1056 and over the creek 8 nautical miles south-southeast on Victor 15 at 1108. What should be the approximate position on Victor 15 at 1211",
        options: ["Crossing the road east of Underwood.", "Over Lake Nettie National Wildlife Refuge.", "Over the powerlines east of Washburn Airport."],
        correct: 0,
        explanation: "The correct answer is: Crossing the road east of Underwood."
      },
      {
        id: 16,
        question: "(Refer to figure 22.) Determine the magnetic heading for a flight from Mercer County Regional Airport (area 3) to Minot International (area 1). The wind is from 330° at 25 knots, the true airspeed is 100 knots, and the magnetic variation is 10° east.",
        options: ["012°.", "002°.", "352°."],
        correct: 2,
        explanation: "The correct answer is: 352°."
      },
      {
        id: 17,
        question: "(Refer to figure 22.) What course should be selected on the omnibearing selector (OBS) to make a direct flight from Mercer County Regional Airport (area 3) to the Minot VORTAC (area 1) with a TO indication",
        options: ["177°.", "357°.", "001°."],
        correct: 2,
        explanation: "The correct answer is: 001°."
      },
      {
        id: 18,
        question: "(Refer to figure 23.) What is the estimated time en route from Wall Airport (area 1) to St. Maries Airport (area 4)? The wind is from 215° at 25 knots, and the true airspeed is 125 knots.",
        options: ["30 minutes.", "38 minutes.", "34 minutes."],
        correct: 2,
        explanation: "The correct answer is: 34 minutes."
      },
      {
        id: 19,
        question: "(Refer to figure 23.) Determine the estimated time en route for a flight from Priest River Airport (area 1) to Shoshone County Airport (area 3). The wind is from 030 at 12 knots and the true airspeed is 95 knots. Add 2 minutes for climb-out.",
        options: ["27 minutes.", "23 minutes.", "31 minutes."],
        correct: 2,
        explanation: "The correct answer is: 31 minutes."
      },
      {
        id: 20,
        question: "(Refer to figure 23.) What is the estimated time en route for a flight from St. Maries Airport (area 4) to Priest River Airport (area 1)? The wind is from 300° at 14 knots and the true airspeed is 90 knots. Add 3 minutes for climb-out.",
        options: ["38 minutes.", "48 minutes.", "43 minutes."],
        correct: 2,
        explanation: "The correct answer is: 43 minutes."
      },
    ]
  },
  'ppl-l25': {
    title: "FAA Regulations & Airspace — Final Exam",
    questions: [
      {
        id: 1,
        question: "The width of a Federal Airway from either side of the centerline is",
        options: ["6 nautical miles.", "4 nautical miles.", "8 nautical miles."],
        correct: 1,
        explanation: "The correct answer is: 4 nautical miles."
      },
      {
        id: 2,
        question: "Unless otherwise specified, Federal Airways include that Class E airspace extending upward from",
        options: ["1,200 feet above the surface up to and including 17,999 feet MSL.", "the surface up to and including 18,000 feet MSL.", "700 feet above the surface up to and including 17,999 feet MSL."],
        correct: 0,
        explanation: "The correct answer is: 1,200 feet above the surface up to and including 17,999 feet MSL."
      },
      {
        id: 3,
        question: "Normal VFR operations in Class D airspace with an operating control tower require the ceiling and visibility to be at least",
        options: ["1,000 feet and 3 miles.", "2,500 feet and 3 miles.", "1,000 feet and 1 mile."],
        correct: 0,
        explanation: "The correct answer is: 1,000 feet and 3 miles."
      },
      {
        id: 4,
        question: "A blue segmented circle on a Sectional Chart depicts which class airspace",
        options: ["Class B.", "Class C.", "Class D."],
        correct: 2,
        explanation: "The correct answer is: Class D."
      },
      {
        id: 5,
        question: "Airspace at an airport with a part-time control tower is classified as Class D airspace only",
        options: ["when the associated control tower is in operation.", "when the associated Flight Service Station is in operation.", "when the weather minimums are below basic VFR."],
        correct: 0,
        explanation: "The correct answer is: when the associated control tower is in operation."
      },
      {
        id: 6,
        question: "An operable 4096-code transponder and Mode C encoding altimeter are required in",
        options: ["Class B airspace and within 30 miles of the Class B primary airport.", "Class D airspace.", "Class E airspace below 10,000 feet MSL."],
        correct: 0,
        explanation: "The correct answer is: Class B airspace and within 30 miles of the Class B primary airport."
      },
      {
        id: 7,
        question: "In which type of airspace are VFR flights prohibited",
        options: ["Class A.", "Class B.", "Class C."],
        correct: 0,
        explanation: "The correct answer is: Class A."
      },
      {
        id: 8,
        question: "What minimum visibility and clearance from clouds are required for a recreational pilot in Class G airspace at 1,200 feet AGL or below during daylight hours",
        options: ["3 miles visibility, 500 feet below the clouds.", "3 miles visibility and clear of clouds.", "1 mile visibility and clear of clouds."],
        correct: 1,
        explanation: "The correct answer is: 3 miles visibility and clear of clouds."
      },
      {
        id: 9,
        question: "Outside controlled airspace, the minimum flight visibility requirement for a recreational pilot flying VFR above 1,200 feet AGL and below 10,000 feet MSL during daylight hours is",
        options: ["1 mile.", "3 miles.", "5 miles."],
        correct: 1,
        explanation: "The correct answer is: 3 miles."
      },
      {
        id: 10,
        question: "During operations within controlled airspace at altitudes of less than 1,200 feet AGL, the minimum horizontal distance from clouds requirement for VFR flight is",
        options: ["2,000 feet.", "1,000 feet.", "1,500 feet."],
        correct: 0,
        explanation: "The correct answer is: 2,000 feet."
      },
      {
        id: 11,
        question: "What minimum visibility and clearance from clouds are required for VFR operations in Class G airspace at 700 feet AGL or below during daylight hours",
        options: ["3 miles visibility and clear of clouds.", "1 mile visibility and clear of clouds.", "1 mile visibility, 500 feet below, 1,000 feet above, and 2,000 feet horizontal clearance from clouds."],
        correct: 1,
        explanation: "The correct answer is: 1 mile visibility and clear of clouds."
      },
      {
        id: 12,
        question: "What minimum flight visibility is required for VFR flight operations on an airway below 10,000 feet MSL",
        options: ["1 mile.", "4 miles.", "3 miles."],
        correct: 2,
        explanation: "The correct answer is: 3 miles."
      },
      {
        id: 13,
        question: "The minimum distance from clouds required for VFR operations on an airway below 10,000 feet MSL is",
        options: ["remain clear of clouds.", "500 feet below, 1,000 feet above, and 2,000 feet horizontally.", "500 feet above, 1,000 feet below, and 2,000 feet horizontally."],
        correct: 1,
        explanation: "The correct answer is: 500 feet below, 1,000 feet above, and 2,000 feet horizontally."
      },
      {
        id: 14,
        question: "During operations within controlled airspace at altitudes of more than 1,200 feet AGL, but less than 10,000 feet MSL, the minimum distance above clouds requirement for VFR flight is",
        options: ["500 feet.", "1,000 feet.", "1,500 feet."],
        correct: 1,
        explanation: "The correct answer is: 1,000 feet."
      },
      {
        id: 15,
        question: "VFR flight in controlled airspace above 1,200 feet AGL and below 10,000 feet MSL requires a minimum visibility and vertical cloud clearance of",
        options: ["3 miles, and 500 feet below or 1,000 feet above the clouds in controlled airspace.", "5 miles, and 1,000 feet below or 1,000 feet above the clouds at all altitudes.", "5 miles, and 1,000 feet below or 1,000 feet above the clouds only in Class A airspace."],
        correct: 0,
        explanation: "The correct answer is: 3 miles, and 500 feet below or 1,000 feet above the clouds in controlled airspace."
      },
      {
        id: 16,
        question: "During operations outside controlled airspace at altitudes of more than 1,200 feet AGL, but less than 10,000 feet MSL, the minimum flight visibility for VFR flight at night is",
        options: ["1 mile.", "3 miles.", "5 miles."],
        correct: 1,
        explanation: "The correct answer is: 3 miles."
      },
      {
        id: 17,
        question: "Outside controlled airspace, the minimum flight visibility requirement for VFR flight above 1,200 feet AGL and below 10,000 feet MSL during daylight hours is",
        options: ["5 miles.", "3 miles.", "1 mile."],
        correct: 2,
        explanation: "The correct answer is: 1 mile."
      },
      {
        id: 18,
        question: "During operations outside controlled airspace at altitudes of more than 1,200 feet AGL, but less than 10,000 feet MSL, the minimum distance below clouds requirement for VFR flight at night is",
        options: ["500 feet.", "1,000 feet.", "1,500 feet."],
        correct: 0,
        explanation: "The correct answer is: 500 feet."
      },
      {
        id: 19,
        question: "The minimum flight visibility required for VFR flights above 10,000 feet MSL and more than 1,200 feet AGL in controlled airspace is",
        options: ["5 miles.", "3 miles.", "1 mile."],
        correct: 0,
        explanation: "The correct answer is: 5 miles."
      },
      {
        id: 20,
        question: "For VFR flight operations above 10,000 feet MSL and more than 1,200 feet AGL, the minimum horizontal distance from clouds required is",
        options: ["2,000 feet.", "1,000 feet.", "1 mile."],
        correct: 2,
        explanation: "The correct answer is: 1 mile."
      },
    ]
  },
  'ppl-extra-intro': {
    title: "FAA Rules & Certificates",
    questions: [
      {
        id: 1,
        question: "With respect to the certification of airmen, which is a category of aircraft? Gyroplane, helicopter, airship, free balloon. Airplane, rotorcraft, glider, lighter-than-air. Single-engine land and sea, multiengine land and sea. 3002[A]",
        options: ["With respect to the certification of airmen, which is a class of aircraft", "Single-engine land and sea, multiengine land and sea.", "Lighter-than-air, airship, hot air balloon, gas balloon."],
        correct: 1,
        explanation: "The correct answer is: Single-engine land and sea, multiengine land and sea."
      },
      {
        id: 2,
        question: "With respect to the certification of aircraft, which is a category of aircraft?",
        options: ["Airplane, rotorcraft, glider.", "Landplane, seaplane.", "Normal, utility, acrobatic."],
        correct: 2,
        explanation: "The correct answer is: Normal, utility, acrobatic."
      },
      {
        id: 3,
        question: "With respect to the certification of aircraft, which is a class of aircraft",
        options: ["Airplane, rotorcraft, glider, balloon.", "Transport, restricted, provisional.", "Normal, utility, acrobatic, limited."],
        correct: 0,
        explanation: "The correct answer is: Airplane, rotorcraft, glider, balloon."
      },
      {
        id: 4,
        question: "FAA advisory circulars (some free, others at cost) are available to all pilots and are obtained by",
        options: ["distribution from the nearest FAA district office.", "subscribing to the Federal Register.", "ordering those desired from the Government Printing Office."],
        correct: 2,
        explanation: "The correct answer is: ordering those desired from the Government Printing Office."
      },
      {
        id: 5,
        question: "FAA advisory circulars containing subject matter specifically related to Airspace are issued under which subject number?",
        options: ["60.", "70.", "90."],
        correct: 1,
        explanation: "The correct answer is: 70."
      },
      {
        id: 6,
        question: "FAA advisory circulars containing subject matter specifically related to Airmen are issued under which subject number",
        options: ["70.", "90.", "60."],
        correct: 2,
        explanation: "The correct answer is: 60."
      },
      {
        id: 7,
        question: "When must a current pilot certificate be in the pilot's personal possession or readily accessible in the aircraft?",
        options: ["Only when passengers are carried.", "Anytime when acting as pilot in command or as a required crewmember.", "When acting as a crew chief during launch and recovery."],
        correct: 1,
        explanation: "The correct answer is: Anytime when acting as pilot in command or as a required crewmember."
      },
      {
        id: 8,
        question: "Each person who holds a pilot certificate or a medical certificate shall present it for inspection upon the request of the Administrator, the National Transportation Safety Board, or any",
        options: ["person in a position of authority.", "authorized representative of the Department of Transportation.", "federal, state, or local law enforcement officer."],
        correct: 2,
        explanation: "The correct answer is: federal, state, or local law enforcement officer."
      },
      {
        id: 9,
        question: "A Third-Class Medical Certificate is issued to a 51-year-old pilot on May 3, this year. To exercise the privileges of a Private Pilot Certificate, the medical certificate will be valid until midnight on",
        options: ["May 31, 2 years later.", "May 31, 1 year later.", "May 3, 1 year later."],
        correct: 0,
        explanation: "The correct answer is: May 31, 2 years later."
      },
      {
        id: 10,
        question: "For private pilot operations, a Second-Class Medical Certificate issued to a 42-year-old pilot on July 15, this year, will expire at midnight on",
        options: ["July 31, 1 year later.", "July 31, 2 years later.", "July 15, 2 years later."],
        correct: 1,
        explanation: "The correct answer is: July 31, 2 years later."
      },
      {
        id: 11,
        question: "The pilot in command is required to hold a type rating in which aircraft?",
        options: ["Aircraft involved in ferry flights, training flights, or test flights.", "Aircraft operated under an authorization issued by the Administrator.", "Aircraft having a gross weight of more than 12,500 pounds."],
        correct: 2,
        explanation: "The correct answer is: Aircraft having a gross weight of more than 12,500 pounds."
      },
      {
        id: 12,
        question: "What is the definition of a high-performance airplane?",
        options: ["An airplane with a normal cruise speed in excess of 200 knots.", "An airplane with 180 horsepower, or retractable landing gear, flaps, and a fixed-pitch propeller.", "An airplane with an engine of more than 200 horsepower."],
        correct: 2,
        explanation: "The correct answer is: An airplane with an engine of more than 200 horsepower."
      },
      {
        id: 13,
        question: "Before a person holding a private pilot certificate may act as pilot in command of a high-performance airplane, that person must have",
        options: ["received ground and flight instruction from an authorized flight instructor who then endorses that person's logbook.", "an endorsement in that person's logbook that he or she is competent to act as pilot in command.", "passed a flight test in that airplane from an FAA inspector."],
        correct: 0,
        explanation: "The correct answer is: received ground and flight instruction from an authorized flight instructor who then endorses that person's logbook."
      },
      {
        id: 14,
        question: "In order to act as pilot in command of a high-performance airplane, a pilot must have",
        options: ["received and logged ground and flight instruction in an airplane that has more than 200 horsepower.", "made and logged three solo takeoffs and landings in a high-performance airplane.", "passed a flight test in a high-performance airplane."],
        correct: 0,
        explanation: "The correct answer is: received and logged ground and flight instruction in an airplane that has more than 200 horsepower."
      },
      {
        id: 15,
        question: "To act as pilot in command of an aircraft carrying passengers, a pilot must show by logbook endorsement the satisfactory completion of a flight review or completion of a pilot proficiency check within the preceding",
        options: ["24 calendar months.", "6 calendar months.", "12 calendar months."],
        correct: 0,
        explanation: "The correct answer is: 24 calendar months."
      },
    ]
  },
  'ppl-extra-adm': {
    title: "Aeronautical Decision Making",
    questions: [
      {
        id: 1,
        question: "Flight crewmembers are required to keep their safety belts and shoulder harnesses fastened during",
        options: ["flight in turbulent air.", "takeoffs and landings.", "all flight conditions."],
        correct: 1,
        explanation: "The correct answer is: takeoffs and landings."
      },
      {
        id: 2,
        question: "Which best describes the flight conditions under which flight crewmembers are specifically required to keep their safety belts and shoulder harnesses fastened",
        options: ["Safety belts during takeoff and landing and while en route; shoulder harnesses during takeoff and landing.", "Safety belts during takeoff and landing; shoulder harnesses during takeoff and landing and while en route.", "Safety belts during takeoff and landing; shoulder harnesses during takeoff and landing."],
        correct: 0,
        explanation: "The correct answer is: Safety belts during takeoff and landing and while en route; shoulder harnesses during takeoff and landing."
      },
      {
        id: 3,
        question: "With respect to passengers, what obligation, if any, does a pilot in command have concerning the use of safety belts",
        options: ["The pilot in command has no obligation in regard to passengers' use of safety belts.", "The pilot in command must brief the passengers on the use of safety belts and notify them to fasten their safety belts during taxi, takeoff, and landing.", "The pilot in command must instruct the passengers to keep their safety belts fastened for the entire flight."],
        correct: 1,
        explanation: "The correct answer is: The pilot in command must brief the passengers on the use of safety belts and notify them to fasten their safety belts during taxi, takeoff, and landing."
      },
      {
        id: 4,
        question: "With certain exceptions, safety belts are required to be secured about passengers during",
        options: ["all flight conditions.", "flight in turbulent air.", "taxi, takeoffs, and landings."],
        correct: 2,
        explanation: "The correct answer is: taxi, takeoffs, and landings."
      },
      {
        id: 5,
        question: "Safety belts are required to be properly secured about which persons in an aircraft and when",
        options: ["Pilots only, during takeoffs and landings.", "Passengers, during taxi, takeoffs, and landings only.", "Each person on board the aircraft during the entire flight."],
        correct: 1,
        explanation: "The correct answer is: Passengers, during taxi, takeoffs, and landings only."
      },
      {
        id: 6,
        question: "No person may operate an aircraft in formation flight",
        options: ["in Class D airspace under special VFR.", "over a densely populated area.", "except by prior arrangement with the pilot in command of each aircraft."],
        correct: 2,
        explanation: "The correct answer is: except by prior arrangement with the pilot in command of each aircraft."
      },
    ]
  },
  'ppl-extra-aero': {
    title: "Aerodynamics of Flight",
    questions: [
      {
        id: 1,
        question: "The four forces acting on an airplane in flight are",
        options: ["lift, weight, thrust, and drag.", "lift, weight, gravity, and thrust.", "lift, gravity, power, and friction."],
        correct: 0,
        explanation: "The correct answer is: lift, weight, thrust, and drag."
      },
      {
        id: 2,
        question: "When are the four forces that act on an airplane in equilibrium",
        options: ["During unaccelerated flight.", "When the aircraft is at rest on the ground.", "When the aircraft is accelerating."],
        correct: 0,
        explanation: "The correct answer is: During unaccelerated flight."
      },
      {
        id: 3,
        question: "(Refer to figure 1.) The acute angle A is the angle of",
        options: ["dihedral.", "incidence.", "attack."],
        correct: 2,
        explanation: "The correct answer is: attack."
      },
      {
        id: 4,
        question: "The term \"angle of attack'' is defined as the angle",
        options: ["formed by the longitudinal axis of the airplane and the chord line of the wing.", "between the wing chord line and the relative wind.", "between the airplane's climb angle and the horizon."],
        correct: 1,
        explanation: "The correct answer is: between the wing chord line and the relative wind."
      },
      {
        id: 5,
        question: "What is the relationship of lift, drag, thrust, and weight when the airplane is in straight-and-level flight",
        options: ["Lift, drag, and weight equal thrust.", "Lift equals weight and thrust equals drag.", "Lift and weight equal thrust and drag."],
        correct: 1,
        explanation: "The correct answer is: Lift equals weight and thrust equals drag."
      },
      {
        id: 6,
        question: "How will frost on the wings of an airplane affect takeoff performance",
        options: ["Frost will disrupt the smooth flow of air over the wing, adversely affecting its lifting capability.", "Frost will change the camber of the wing, increasing its lifting capability.", "Frost will cause the airplane to become airborne with a higher angle of attack, decreasing the stall speed."],
        correct: 0,
        explanation: "The correct answer is: Frost will disrupt the smooth flow of air over the wing, adversely affecting its lifting capability."
      },
      {
        id: 7,
        question: "In what flight condition is torque effect the greatest in a single-engine airplane",
        options: ["Low airspeed, high power, high angle of attack.", "High airspeed, high power, high angle of attack.", "Low airspeed, low power, low angle of attack."],
        correct: 0,
        explanation: "The correct answer is: Low airspeed, high power, high angle of attack."
      },
      {
        id: 8,
        question: "The left turning tendency of an airplane caused by P-factor is the result of the",
        options: ["gyroscopic forces applied to the rotating propeller blades acting 90° in advance of the point the force was applied.", "clockwise rotation of the engine and the propeller turning the airplane counter-clockwise.", "propeller blade descending on the right, producing more thrust than the ascending blade on the left."],
        correct: 2,
        explanation: "The correct answer is: propeller blade descending on the right, producing more thrust than the ascending blade on the left."
      },
      {
        id: 9,
        question: "When does P-factor cause the airplane to yaw to the left",
        options: ["When at high angles of attack.", "When at high airspeeds.", "When at low angles of attack."],
        correct: 0,
        explanation: "The correct answer is: When at high angles of attack."
      },
      {
        id: 10,
        question: "An airplane said to be inherently stable will",
        options: ["require less effort to control.", "be difficult to stall.", "not spin."],
        correct: 0,
        explanation: "The correct answer is: require less effort to control."
      },
      {
        id: 11,
        question: "What determines the longitudinal stability of an airplane",
        options: ["The relationship of thrust and lift to weight and drag.", "The effectiveness of the horizontal stabilizer, rudder, and rudder trim tab.", "The location of the CG with respect to the center of lift."],
        correct: 2,
        explanation: "The correct answer is: The location of the CG with respect to the center of lift."
      },
      {
        id: 12,
        question: "What causes an airplane (except a T-tail) to pitch nosedown when power is reduced and controls are not adjusted",
        options: ["The downwash on the elevators from the propeller slipstream is reduced and elevator effectiveness is reduced.", "The CG shifts forward when thrust and drag are reduced.", "When thrust is reduced to less than weight, lift is also reduced and the wings can no longer support the weight."],
        correct: 0,
        explanation: "The correct answer is: The downwash on the elevators from the propeller slipstream is reduced and elevator effectiveness is reduced."
      },
      {
        id: 13,
        question: "What is the purpose of the rudder on an airplane",
        options: ["To control yaw.", "To control overbanking tendency.", "To control roll."],
        correct: 0,
        explanation: "The correct answer is: To control yaw."
      },
      {
        id: 14,
        question: "(Refer to figure 2.) If an airplane weighs 2,300 pounds, what approximate weight would the airplane structure be required to support during a 60° banked turn while maintaining altitude",
        options: ["4,600 pounds.", "2,300 pounds.", "3,400 pounds."],
        correct: 0,
        explanation: "The correct answer is: 4,600 pounds."
      },
      {
        id: 15,
        question: "(Refer to figure 2.) If an airplane weighs 3,300 pounds, what approximate weight would the airplane structure be required to support during a 30° banked turn while maintaining altitude",
        options: ["1,200 pounds.", "3,960 pounds.", "3,100 pounds."],
        correct: 1,
        explanation: "The correct answer is: 3,960 pounds."
      },
    ]
  },
  'ppl-extra-controls': {
    title: "Flight Controls",
    questions: [
      {
        id: 1,
        question: "When taxiing with strong quartering tailwinds, which aileron positions should be used",
        options: ["Ailerons neutral.", "Aileron down on the downwind side.", "Aileron down on the side from which the wind is blowing."],
        correct: 2,
        explanation: "The correct answer is: Aileron down on the side from which the wind is blowing."
      },
      {
        id: 2,
        question: "Which aileron positions should a pilot generally use when taxiing in strong quartering headwinds",
        options: ["Ailerons neutral.", "Aileron up on the side from which the wind is blowing.", "Aileron down on the side from which the wind is blowing."],
        correct: 1,
        explanation: "The correct answer is: Aileron up on the side from which the wind is blowing."
      },
      {
        id: 3,
        question: "Which wind condition would be most critical when taxiing a nosewheel equipped high-wing airplane",
        options: ["Quartering headwind.", "Direct crosswind.", "Quartering tailwind."],
        correct: 2,
        explanation: "The correct answer is: Quartering tailwind."
      },
      {
        id: 4,
        question: "(Refer to figure 9, area A.) How should the flight controls be held while taxiing a tricycle-gear equipped airplane into a left quartering headwind",
        options: ["Left aileron up, elevator down.", "Left aileron up, elevator neutral.", "Left aileron down, elevator neutral."],
        correct: 1,
        explanation: "The correct answer is: Left aileron up, elevator neutral."
      },
      {
        id: 5,
        question: "(Refer to figure 9, area B.) How should the flight controls be held while taxiing a tailwheel airplane into a right quartering headwind",
        options: ["Right aileron up, elevator down.", "Right aileron down, elevator neutral.", "Right aileron up, elevator up."],
        correct: 2,
        explanation: "The correct answer is: Right aileron up, elevator up."
      },
      {
        id: 6,
        question: "(Refer to figure 9, area C.) How should the flight controls be held while taxiing a tailwheel airplane with a left quartering tailwind",
        options: ["Left aileron up, elevator neutral.", "Left aileron down, elevator neutral.", "Left aileron down, elevator down."],
        correct: 2,
        explanation: "The correct answer is: Left aileron down, elevator down."
      },
      {
        id: 7,
        question: "(Refer to figure 9, area C.) How should the flight controls be held while taxiing a tricycle-gear equipped airplane with a left quartering tailwind",
        options: ["Left aileron up, elevator neutral.", "Left aileron down, elevator down.", "Left aileron up, elevator down."],
        correct: 1,
        explanation: "The correct answer is: Left aileron down, elevator down."
      },
      {
        id: 8,
        question: "Which basic flight maneuver increases the load factor on an airplane as compared to straight-and-level flight",
        options: ["Stalls.", "Climbs.", "Turns."],
        correct: 2,
        explanation: "The correct answer is: Turns."
      },
      {
        id: 9,
        question: "One of the main functions of flaps during approach and landing is to",
        options: ["increase the angle of descent without increasing the airspeed.", "decrease the angle of descent without increasing the airspeed.", "permit a touchdown at a higher indicated airspeed."],
        correct: 0,
        explanation: "The correct answer is: increase the angle of descent without increasing the airspeed."
      },
    ]
  },
  'ppl-extra-instruments': {
    title: "Flight Instruments",
    questions: [
      {
        id: 1,
        question: "If the pitot tube and outside static vents become clogged, which instruments would be affected",
        options: ["The altimeter, airspeed indicator, and vertical speed indicator.", "The altimeter, airspeed indicator, and turn-and-slip indicator.", "The altimeter, attitude indicator, and turn-and-slip indicator."],
        correct: 0,
        explanation: "The correct answer is: The altimeter, airspeed indicator, and vertical speed indicator."
      },
      {
        id: 2,
        question: "Which instrument will become inoperative if the pitot tube becomes clogged",
        options: ["Airspeed.", "Vertical speed.", "Altimeter."],
        correct: 0,
        explanation: "The correct answer is: Airspeed."
      },
      {
        id: 3,
        question: "Which instrument(s) will become inoperative if the static vents become clogged",
        options: ["Airspeed, altimeter, and vertical speed.", "Altimeter only.", "Airspeed only."],
        correct: 0,
        explanation: "The correct answer is: Airspeed, altimeter, and vertical speed."
      },
      {
        id: 4,
        question: "(Refer to figure 3.) Altimeter 1 indicates",
        options: ["10,500 feet.", "1,500 feet.", "500 feet."],
        correct: 0,
        explanation: "The correct answer is: 10,500 feet."
      },
      {
        id: 5,
        question: "(Refer to figure 3.) Altimeter 2 indicates",
        options: ["14,500 feet.", "1,500 feet.", "4,500 feet."],
        correct: 0,
        explanation: "The correct answer is: 14,500 feet."
      },
      {
        id: 6,
        question: "(Refer to figure 3.) Altimeter 3 indicates",
        options: ["15,940 feet.", "10,950 feet.", "9,500 feet."],
        correct: 2,
        explanation: "The correct answer is: 9,500 feet."
      },
      {
        id: 7,
        question: "(Refer to figure 3.) Which altimeter(s) indicate(s) more than 10,000 feet",
        options: ["1 only.", "1 and 2 only.", "1, 2, and 3."],
        correct: 1,
        explanation: "The correct answer is: 1 and 2 only."
      },
      {
        id: 8,
        question: "What does the red line on an airspeed indicator represent",
        options: ["Maneuvering speed.", "Turbulent or rough-air speed.", "Never-exceed speed."],
        correct: 2,
        explanation: "The correct answer is: Never-exceed speed."
      },
      {
        id: 9,
        question: "(Refer to figure 4.) What is the full flap operating range for the airplane",
        options: ["60 to 100 MPH.", "65 to 165 MPH.", "60 to 208 MPH."],
        correct: 0,
        explanation: "The correct answer is: 60 to 100 MPH."
      },
      {
        id: 10,
        question: "(Refer to figure 4.) What is the caution range of the airplane",
        options: ["100 to 165 MPH.", "165 to 208 MPH.", "0 to 60 MPH."],
        correct: 1,
        explanation: "The correct answer is: 165 to 208 MPH."
      },
      {
        id: 11,
        question: "(Refer to figure 4.) The maximum speed at which the airplane can be operated in smooth air is",
        options: ["165 MPH.", "208 MPH.", "100 MPH."],
        correct: 1,
        explanation: "The correct answer is: 208 MPH."
      },
      {
        id: 12,
        question: "(Refer to figure 4.) Which color identifies the never-exceed speed",
        options: ["Upper limit of the white arc.", "The red radial line.", "Lower limit of the yellow arc."],
        correct: 1,
        explanation: "The correct answer is: The red radial line."
      },
      {
        id: 13,
        question: "(Refer to figure 4.) Which color identifies the power-off stalling speed in a specified configuration",
        options: ["Upper limit of the white arc.", "Upper limit of the green arc.", "Lower limit of the green arc."],
        correct: 2,
        explanation: "The correct answer is: Lower limit of the green arc."
      },
      {
        id: 14,
        question: "(Refer to figure 4.) What is the maximum flaps-extended speed",
        options: ["165 MPH.", "65 MPH.", "100 MPH."],
        correct: 2,
        explanation: "The correct answer is: 100 MPH."
      },
      {
        id: 15,
        question: "(Refer to figure 4.) Which color identifies the normal flap operating range",
        options: ["The lower limit of the white arc to the upper limit of the green arc.", "The white arc.", "The green arc."],
        correct: 1,
        explanation: "The correct answer is: The white arc."
      },
    ]
  },
  'ppl-extra-manuals': {
    title: "Flight Manuals & POH",
    questions: [
      {
        id: 1,
        question: "Preventive maintenance has been performed on an aircraft. What paperwork is required?",
        options: ["The date the work was completed, and the name of the person who did the work must be entered in the airframe and engine logbook.", "The signature, certificate number, and kind of certificate held by the person approving the work and a description of the work must be entered in the aircraft maintenance records.", "A full, detailed description of the work done must be entered in the airframe logbook."],
        correct: 1,
        explanation: "The correct answer is: The signature, certificate number, and kind of certificate held by the person approving the work and a description of the work must be entered in the aircraft maintenance records."
      },
      {
        id: 2,
        question: "Which operation would be described as preventive maintenance?",
        options: ["Alteration of main seat support brackets.", "Engine adjustments to allow automotive gas to be used.", "Servicing landing gear wheel bearings."],
        correct: 2,
        explanation: "The correct answer is: Servicing landing gear wheel bearings."
      },
      {
        id: 3,
        question: "Which operation would be described as preventive maintenance?",
        options: ["Replenishing hydraulic fluid.", "Repair of landing gear brace struts.", "Repair of portions of skin sheets by making additional seams."],
        correct: 0,
        explanation: "The correct answer is: Replenishing hydraulic fluid."
      },
      {
        id: 4,
        question: "Where may an aircraft's operating limitations be found",
        options: ["In the current, FAA-approved flight manual, approved manual material, markings, and placards, or any combination thereof.", "On the Airworthiness Certificate.", "In the aircraft airframe and engine logbooks."],
        correct: 0,
        explanation: "The correct answer is: In the current, FAA-approved flight manual, approved manual material, markings, and placards, or any combination thereof."
      },
      {
        id: 5,
        question: "Which preflight action is specifically required of the pilot prior to each flight",
        options: ["Review wake turbulence avoidance procedures.", "Become familiar with all available information concerning the flight.", "Check the aircraft logbooks for appropriate entries."],
        correct: 1,
        explanation: "The correct answer is: Become familiar with all available information concerning the flight."
      },
      {
        id: 6,
        question: "Preflight action, as required for all flights away from the vicinity of an airport, shall include",
        options: ["a study of arrival procedures at airports/ heliports of intended use.", "an alternate course of action if the flight cannot be completed as planned.", "the designation of an alternate airport."],
        correct: 1,
        explanation: "The correct answer is: an alternate course of action if the flight cannot be completed as planned."
      },
      {
        id: 7,
        question: "In addition to other preflight actions for a VFR flight away from the vicinity of the departure airport, regulations specifically require the pilot in command to",
        options: ["check the accuracy of the navigation equipment and the emergency locator transmitter (ELT).", "review traffic control light signal procedures.", "determine runway lengths at airports of intended use and the aircraft's takeoff and landing distance data."],
        correct: 2,
        explanation: "The correct answer is: determine runway lengths at airports of intended use and the aircraft's takeoff and landing distance data."
      },
      {
        id: 8,
        question: "In addition to a valid Airworthiness Certificate, what documents or records must be aboard an aircraft during flight",
        options: ["Radio operator's permit, and repair and alteration forms.", "Aircraft engine and airframe logbooks, and owner's manual.", "Operating limitations and Registration Certificate."],
        correct: 2,
        explanation: "The correct answer is: Operating limitations and Registration Certificate."
      },
      {
        id: 9,
        question: "When must batteries in an emergency locator transmitter (ELT) be replaced or recharged, if rechargeable",
        options: ["When the ELT has been in use for more than 1 cumulative hour.", "When the ELT can no longer be heard over the airplane's communication radio receiver.", "After any inadvertent activation of the ELT."],
        correct: 0,
        explanation: "The correct answer is: When the ELT has been in use for more than 1 cumulative hour."
      },
      {
        id: 10,
        question: "When are non-rechargeable batteries of an emergency locator transmitter (ELT) required to be replaced",
        options: ["When 50 percent of their useful life expires.", "Every 24 months.", "At the time of each 100-hour or annual inspection."],
        correct: 0,
        explanation: "The correct answer is: When 50 percent of their useful life expires."
      },
      {
        id: 11,
        question: "Completion of an annual inspection and the return of the aircraft to service should always be indicated by",
        options: ["the relicensing date on the Registration Certificate.", "an appropriate notation in the aircraft maintenance records.", "an inspection sticker placed on the instrument panel that lists the annual inspection completion date."],
        correct: 1,
        explanation: "The correct answer is: an appropriate notation in the aircraft maintenance records."
      },
      {
        id: 12,
        question: "If an alteration or repair substantially affects an aircraft's operation in flight, that aircraft must be test flown by an appropriately-rated pilot and approved for return to service prior to being operated",
        options: ["by any private pilot.", "with passengers aboard.", "for compensation or hire."],
        correct: 1,
        explanation: "The correct answer is: with passengers aboard."
      },
      {
        id: 13,
        question: "Before passengers can be carried in an aircraft that has been altered in a manner that may have appreciably changed its flight characteristics, it must be flight tested by an appropriately-rated pilot who holds at least a",
        options: ["Commercial Pilot Certificate with an instrument rating.", "Private Pilot Certificate.", "Commercial Pilot Certificate and a mechanic's certificate."],
        correct: 1,
        explanation: "The correct answer is: Private Pilot Certificate."
      },
      {
        id: 14,
        question: "An aircraft's annual inspection was performed on July 12, this year. The next annual inspection will be due no later than",
        options: ["July 31, next year.", "July 13, next year.", "July 1, next year."],
        correct: 0,
        explanation: "The correct answer is: July 31, next year."
      },
      {
        id: 15,
        question: "To determine the expiration date of the last annual aircraft inspection, a person should refer to the",
        options: ["Airworthiness Certificate.", "Registration Certificate.", "aircraft maintenance records."],
        correct: 2,
        explanation: "The correct answer is: aircraft maintenance records."
      },
    ]
  },
  'ppl-extra-wb': {
    title: "Weight & Balance",
    questions: [
      {
        id: 1,
        question: "An airplane has been loaded in such a manner that the CG is located aft of the aft CG limit. One undesirable flight characteristic a pilot might experience with this airplane would be",
        options: ["stalling at higher-than-normal airspeed.", "a longer takeoff run.", "difficulty in recovering from a stalled condition."],
        correct: 2,
        explanation: "The correct answer is: difficulty in recovering from a stalled condition."
      },
      {
        id: 2,
        question: "Loading an airplane to the most aft CG will cause the airplane to be",
        options: ["less stable at high speeds, but more stable at low speeds.", "less stable at slow speeds, but more stable at high speeds.", "less stable at all speeds."],
        correct: 2,
        explanation: "The correct answer is: less stable at all speeds."
      },
      {
        id: 3,
        question: "Which items are included in the empty weight of an aircraft",
        options: ["Full fuel tanks and engine oil to capacity.", "Only the airframe, powerplant, and optional equipment.", "Unusable fuel and undrainable oil."],
        correct: 2,
        explanation: "The correct answer is: Unusable fuel and undrainable oil."
      },
      {
        id: 4,
        question: "An aircraft is loaded 110 pounds over maximum certificated gross weight. If fuel (gasoline) is drained to bring the aircraft weight within limits, how much fuel should be drained",
        options: ["18.4 gallons.", "15.7 gallons.", "16.2 gallons."],
        correct: 0,
        explanation: "The correct answer is: 18.4 gallons."
      },
      {
        id: 5,
        question: "If an aircraft is loaded 90 pounds over maximum certificated gross weight and fuel (gasoline) is drained to bring the aircraft weight within limits, how much fuel should be drained",
        options: ["12 gallons.", "15 gallons.", "10 gallons."],
        correct: 1,
        explanation: "The correct answer is: 15 gallons."
      },
      {
        id: 6,
        question: "GIVEN: WEIGHT ARM MOMENT (LB) (IN) (LB-IN)Empty weight 1,495.0101.4151,593.0Pilot and passengers 380.064.0Fuel (30 gal usable no reserve) 96.0The CG is located how far aft of datum",
        options: ["CG 92.44.", "CG 94.01.", "CG 119.8."],
        correct: 1,
        explanation: "The correct answer is: CG 94.01."
      },
      {
        id: 7,
        question: "(Refer to figures 33 and 34.) Determine if the airplane weight and balance is within limits. Front seat occupants 340 lbRear seat occupants 295 lbFuel (main wing tanks) 44 galBaggage 56 lb",
        options: ["20 pounds overweight, CG aft of aft limits.", "20 pounds overweight, CG within limits.", "20 pounds overweight, CG forward of forward limits."],
        correct: 1,
        explanation: "The correct answer is: 20 pounds overweight, CG within limits."
      },
      {
        id: 8,
        question: "(Refer to figures 33 and 34.) What is the maximum amount of baggage that can be carried when the airplane is loaded as follows? Front seat occupants 387 lb Rear seat occupants 293 lbFuel 35 gal",
        options: ["220 pounds.", "45 pounds.", "63 pounds."],
        correct: 1,
        explanation: "The correct answer is: 45 pounds."
      },
      {
        id: 9,
        question: "(Refer to figures 33 and 34.) Calculate the weight and balance and determine if the CG and the weight of the airplane are within limits.Front seat occupants 350 lbRear seat occupants 325 lbBaggage 27 lbFuel 35 gal",
        options: ["CG 84.1, within limits.", "CG 81.7, out of limits forward.", "CG 83.4, within limits."],
        correct: 2,
        explanation: "The correct answer is: CG 83.4, within limits."
      },
      {
        id: 10,
        question: "(Refer to figures 33 and 34.) Determine if the airplane weight and balance is within limits.Front seat occupants 415 lbRear seat occupants 110 lbFuel, main tanks 44 galFuel, aux. tanks 19 galBaggage 32 lb",
        options: ["19 pounds overweight, CG out of limits forward.", "Weight within limits, CG out of limits.", "19 pounds overweight, CG within limits."],
        correct: 1,
        explanation: "The correct answer is: Weight within limits, CG out of limits."
      },
      {
        id: 11,
        question: "(Refer to figure 35.) What is the maximum amount of baggage that may be loaded aboard the airplane for the CG to remain within the moment envelope? WEIGHT (LB) MOM/1000Empty weight 1,350 51.5Pilot and front passenger 250 ---Rear passengers 400 ---Baggage --- ---Fuel, 30 gal --- ---Oil, 8 qt --- -0.2",
        options: ["110 pounds.", "105 pounds.", "120 pounds."],
        correct: 1,
        explanation: "The correct answer is: 105 pounds."
      },
      {
        id: 12,
        question: "(Refer to figure 35.) Calculate the moment of the airplane and determine which category is applicable. WEIGHT (LB) MOM/1000Empty weight 1,350 51.5Pilot and front passenger 310 ---Rear passengers 96 ---Fuel, 38 gal --- ---Oil, 8 qt --- -0.2",
        options: ["81.2, normal category.", "79.2, utility category.", "80.8, utility category."],
        correct: 2,
        explanation: "The correct answer is: 80.8, utility category."
      },
      {
        id: 13,
        question: "(Refer to figure 35.) What is the maximum amount of fuel that may be aboard the airplane on takeoff if loaded as follows? WEIGHT (LB) MOM/1000Empty weight 1,350 51.5Pilot and front passenger 340 ---Rear passengers 310 ---Baggage 45 ---Oil, 8 qt --- ---",
        options: ["40 gallons.", "32 gallons.", "24 gallons."],
        correct: 0,
        explanation: "The correct answer is: 40 gallons."
      },
      {
        id: 14,
        question: "(Refer to figure 35.) Determine the moment with the following data: WEIGHT (LB) MOM/1000Empty weight 1,350 51.5Pilot and front passenger 340 ---Fuel (std tanks) Capacity ---Oil, 8 qt --- ---",
        options: ["74.9 pound-inches.", "77.6 pound-inches.", "69.9 pound-inches."],
        correct: 0,
        explanation: "The correct answer is: 74.9 pound-inches."
      },
      {
        id: 15,
        question: "(Refer to figure 35.) Determine the aircraft loaded moment and the aircraft category. WEIGHT (LB) MOM/1000Empty weight 1,350 51.5Pilot and front passenger 380 ---Fuel, 48 gal 288 ---Oil, 8 qt --- ---",
        options: ["80.4, utility category.", "78.2, normal category.", "79.2, normal category."],
        correct: 2,
        explanation: "The correct answer is: 79.2, normal category."
      },
    ]
  },
  'ppl-extra-perf': {
    title: "Aircraft Performance",
    questions: [
      {
        id: 1,
        question: "Which V-speed represents maneuvering speed",
        options: ["VLO.", "VNE.", "VA."],
        correct: 2,
        explanation: "The correct answer is: VA."
      },
      {
        id: 2,
        question: "Which V-speed represents maximum flap extended speed?",
        options: ["VFE.", "VLOF.", "VFC."],
        correct: 0,
        explanation: "The correct answer is: VFE."
      },
      {
        id: 3,
        question: "Which V-speed represents maximum landing gear extended speed?",
        options: ["VLE.", "VLO.", "VFE."],
        correct: 0,
        explanation: "The correct answer is: VLE."
      },
      {
        id: 4,
        question: "VNO is defined as the",
        options: ["normal operating range.", "maximum structural cruising speed.", "never-exceed speed."],
        correct: 1,
        explanation: "The correct answer is: maximum structural cruising speed."
      },
      {
        id: 5,
        question: "VSO is defined as the",
        options: ["stalling speed or minimum steady flight speed in a specified configuration.", "stalling speed or minimum takeoff safety speed.", "stalling speed or minimum steady flight speed in the landing configuration."],
        correct: 2,
        explanation: "The correct answer is: stalling speed or minimum steady flight speed in the landing configuration."
      },
      {
        id: 6,
        question: "Which would provide the greatest gain in altitude in the shortest distance during climb after takeoff?",
        options: ["VY.", "VX.", "VA."],
        correct: 1,
        explanation: "The correct answer is: VX."
      },
      {
        id: 7,
        question: "After takeoff, which airspeed would the pilot use to gain the most altitude in a given period of time?",
        options: ["VA.", "VX.", "VY."],
        correct: 2,
        explanation: "The correct answer is: VY."
      },
      {
        id: 8,
        question: "(Refer to figure 36.) Approximately what true airspeed should a pilot expect with 65 percent maximum continuous power at 9,500 feet with a temperature of 36 °F below standard",
        options: ["178 MPH.", "183 MPH.", "181 MPH."],
        correct: 1,
        explanation: "The correct answer is: 183 MPH."
      },
      {
        id: 9,
        question: "(Refer to figure 36.) What is the expected fuel consumption for a 1,000-nautical mile flight under the following conditions?Pressure altitude 8,000 ftTemperature 22 °CManifold pressure 20.8\" HgWind Calm",
        options: ["70.1 gallons.", "60.2 gallons.", "73.2 gallons."],
        correct: 0,
        explanation: "The correct answer is: 70.1 gallons."
      },
      {
        id: 10,
        question: "(Refer to figure 36.) What is the expected fuel consumption for a 500-nautical mile flight under the following conditions?Pressure altitude 4,000 ftTemperature +29 °CManifold pressure 21.3\" HgWind Calm",
        options: ["40.1 gallons.", "36.1 gallons.", "31.4 gallons."],
        correct: 1,
        explanation: "The correct answer is: 36.1 gallons."
      },
      {
        id: 11,
        question: "(Refer to figure 36.) What fuel flow should a pilot expect at 11,000 feet on a standard day with 65 percent maximum continuous power",
        options: ["11.2 gallons per hour.", "10.6 gallons per hour.", "11.8 gallons per hour."],
        correct: 0,
        explanation: "The correct answer is: 11.2 gallons per hour."
      },
      {
        id: 12,
        question: "(Refer to figure 36.) Determine the approximate manifold pressure setting with 2,450 RPM to achieve 65 percent maximum continuous power at 6,500 feet with a temperature of 36 °F higher than standard.",
        options: ["20.8\" Hg.", "19.8\" Hg.", "21.0\" Hg."],
        correct: 2,
        explanation: "The correct answer is: 21.0\" Hg."
      },
      {
        id: 13,
        question: "(Refer to figure 37.) What is the headwind component for a landing on Runway 18 if the tower reports the wind as 220° at 30 knots",
        options: ["26 knots.", "23 knots.", "19 knots."],
        correct: 1,
        explanation: "The correct answer is: 23 knots."
      },
      {
        id: 14,
        question: "(Refer to figure 37.) Determine the maximum wind velocity for a 45° crosswind if the maximum crosswind component for the airplane is 25 knots.",
        options: ["25 knots.", "35 knots.", "29 knots."],
        correct: 1,
        explanation: "The correct answer is: 35 knots."
      },
      {
        id: 15,
        question: "(Refer to figure 37.) What is the maximum wind velocity for a 30° crosswind if the maximum crosswind component for the airplane is 12 knots",
        options: ["16 knots.", "20 knots.", "24 knots."],
        correct: 2,
        explanation: "The correct answer is: 24 knots."
      },
    ]
  },
  'ppl-extra-wx-svcs': {
    title: "Aviation Weather Services",
    questions: [
      {
        id: 1,
        question: "Below FL180, en route weather advisories should be obtained from an FSS on",
        options: ["122.1 MHz.", "122.0 MHz.", "123.6 MHz."],
        correct: 1,
        explanation: "The correct answer is: 122.0 MHz."
      },
      {
        id: 2,
        question: "Transcribed Weather Broadcasts (TWEB's) may be monitored by tuning the appropriate radio receiver to certain",
        options: ["VOR and NDB frequencies.", "airport advisory frequencies.", "ATIS frequencies."],
        correct: 0,
        explanation: "The correct answer is: VOR and NDB frequencies."
      },
      {
        id: 3,
        question: "When telephoning a weather briefing facility for preflight weather information, pilots should state",
        options: ["fuel on board.", "true airspeed.", "the aircraft identification or the pilot's name."],
        correct: 2,
        explanation: "The correct answer is: the aircraft identification or the pilot's name."
      },
      {
        id: 4,
        question: "To get a complete weather briefing for the planned flight, the pilot should request",
        options: ["a standard briefing.", "a general briefing.", "an abbreviated briefing."],
        correct: 0,
        explanation: "The correct answer is: a standard briefing."
      },
      {
        id: 5,
        question: "Which type weather briefing should a pilot request, when departing within the hour, if no preliminary weather information has been received",
        options: ["Outlook briefing.", "Standard briefing.", "Abbreviated briefing."],
        correct: 1,
        explanation: "The correct answer is: Standard briefing."
      },
      {
        id: 6,
        question: "Which type of weather briefing should a pilot request to supplement mass disseminated data",
        options: ["An abbreviated briefing.", "An outlook briefing.", "A supplemental briefing."],
        correct: 0,
        explanation: "The correct answer is: An abbreviated briefing."
      },
      {
        id: 7,
        question: "To update a previous weather briefing, a pilot should request",
        options: ["a standard briefing.", "an abbreviated briefing.", "an outlook briefing."],
        correct: 1,
        explanation: "The correct answer is: an abbreviated briefing."
      },
      {
        id: 8,
        question: "A weather briefing that is provided when the information requested is 6 or more hours in advance of the proposed departure time is",
        options: ["an outlook briefing.", "a prognostic briefing.", "a forecast briefing."],
        correct: 0,
        explanation: "The correct answer is: an outlook briefing."
      },
      {
        id: 9,
        question: "When requesting weather information for the following morning, a pilot should request",
        options: ["an outlook briefing.", "a standard briefing.", "an abbreviated briefing."],
        correct: 0,
        explanation: "The correct answer is: an outlook briefing."
      },
      {
        id: 10,
        question: "(Refer to figure 12.) Which of the reporting stations have VFR weather",
        options: ["KINK, KBOI, and KLAX.", "KINK, KBOI, and KJFK.", "All."],
        correct: 0,
        explanation: "The correct answer is: KINK, KBOI, and KLAX."
      },
      {
        id: 11,
        question: "For aviation purposes, ceiling is defined as the height above the Earth's surface of the",
        options: ["lowest layer of clouds reported as scattered, broken, or thin.", "lowest reported obscuration and the highest layer of clouds reported as overcast.", "lowest broken or overcast layer or vertical visibility into an obscuration."],
        correct: 2,
        explanation: "The correct answer is: lowest broken or overcast layer or vertical visibility into an obscuration."
      },
      {
        id: 12,
        question: "(Refer to figure 12.) The wind direction and velocity at KJFK is from",
        options: ["180° true at 4 knots.", "040° true at 18 knots.", "180° magnetic at 4 knots."],
        correct: 0,
        explanation: "The correct answer is: 180° true at 4 knots."
      },
      {
        id: 13,
        question: "(Refer to figure 12.) What are the wind conditions at Wink, Texas (KINK)",
        options: ["Calm.", "111° at 2 knots, gusts 18 knots.", "110° at 12 knots, gusts 18 knots."],
        correct: 2,
        explanation: "The correct answer is: 110° at 12 knots, gusts 18 knots."
      },
      {
        id: 14,
        question: "(Refer to figure 12.) The remarks section for KMDW has RAB35 listed. This entry means",
        options: ["blowing mist has reduced the visibility to 1-1/2 SM.", "the barometer has risen .35\" Hg.", "rain began at 1835Z."],
        correct: 2,
        explanation: "The correct answer is: rain began at 1835Z."
      },
      {
        id: 15,
        question: "(Refer to figure 12.) What are the current conditions depicted for Chicago Midway Airport (KMDW)",
        options: ["Sky 700 feet overcast, visibility 1-1/2SM, rain.", "Sky 700 feet overcast, visibility 11, occasionally 2SM, with rain.", "Sky 7000 feet overcast, visibility 1-1/2SM, heavy rain."],
        correct: 0,
        explanation: "The correct answer is: Sky 700 feet overcast, visibility 1-1/2SM, rain."
      },
      {
        id: 16,
        question: "(Refer to figure 14.) The base and tops of the overcast layer reported by a pilot are",
        options: ["7,200 feet MSL and 8,900 feet MSL.", "1,800 feet MSL and 5,500 feet MSL.", "5,500 feet AGL and 7,200 feet MSL."],
        correct: 0,
        explanation: "The correct answer is: 7,200 feet MSL and 8,900 feet MSL."
      },
      {
        id: 17,
        question: "(Refer to figure 14.) The wind and temperature at 12,000 feet MSL as reported by a pilot are",
        options: ["009° at 121 MPH and 90 °F.", "090° at 21 knots and -9 °C.", "090° at 21 knots and -9 °F."],
        correct: 1,
        explanation: "The correct answer is: 090° at 21 knots and -9 °C."
      },
      {
        id: 18,
        question: "(Refer to figure 14.) If the terrain elevation is 1,295 feet MSL, what is the height above ground level of the base of the ceiling",
        options: ["1,295 feet AGL.", "505 feet AGL.", "6,586 feet AGL."],
        correct: 1,
        explanation: "The correct answer is: 505 feet AGL."
      },
      {
        id: 19,
        question: "(Refer to figure 14.) The intensity of the turbulence reported at a specific altitude is",
        options: ["moderate at 5,500 feet and at 7,200 feet.", "moderate from 5,500 feet to 7,200 feet.", "light to moderate from 7,200 feet to 8,900 feet."],
        correct: 1,
        explanation: "The correct answer is: moderate from 5,500 feet to 7,200 feet."
      },
      {
        id: 20,
        question: "(Refer to figure 14.) The intensity and type of icing reported by a pilot is",
        options: ["light to moderate.", "moderate rime.", "light to moderate clear."],
        correct: 2,
        explanation: "The correct answer is: light to moderate clear."
      },
    ]
  },
  'ppl-extra-airport': {
    title: "Airport Operations",
    questions: [
      {
        id: 1,
        question: "A steady green light signal directed from the control tower to an aircraft in flight is a signal that the pilot",
        options: ["should give way to other aircraft and continue circling.", "should return for landing.", "is cleared to land."],
        correct: 2,
        explanation: "The correct answer is: is cleared to land."
      },
      {
        id: 2,
        question: "Which light signal from the control tower clears a pilot to taxi",
        options: ["Flashing green.", "Flashing white.", "Steady green."],
        correct: 0,
        explanation: "The correct answer is: Flashing green."
      },
      {
        id: 3,
        question: "If the control tower uses a light signal to direct a pilot to give way to other aircraft and continue circling, the light will be",
        options: ["steady red.", "flashing red.", "alternating red and green."],
        correct: 0,
        explanation: "The correct answer is: steady red."
      },
      {
        id: 4,
        question: "A flashing white light signal from the control tower to a taxiing aircraft is an indication to",
        options: ["taxi only on taxiways and not cross runways.", "taxi at a faster speed.", "return to the starting point on the airport."],
        correct: 2,
        explanation: "The correct answer is: return to the starting point on the airport."
      },
      {
        id: 5,
        question: "An alternating red and green light signal directed from the control tower to an aircraft in flight is a signal to",
        options: ["exercise extreme caution.", "hold position.", "not land; the airport is unsafe."],
        correct: 0,
        explanation: "The correct answer is: exercise extreme caution."
      },
      {
        id: 6,
        question: "While on final approach for landing, an alternating green and red light followed by a flashing red light is received from the control tower. Under these circumstances, the pilot should",
        options: ["exercise extreme caution and abandon the approach, realizing the airport is unsafe for landing.", "abandon the approach, circle the airport to the right, and expect a flashing white light when the airport is safe for landing.", "discontinue the approach, fly the same traffic pattern and approach again, and land."],
        correct: 0,
        explanation: "The correct answer is: exercise extreme caution and abandon the approach, realizing the airport is unsafe for landing."
      },
      {
        id: 7,
        question: "Unless otherwise authorized, two-way radio communications with Air Traffic Control are required for landings or takeoffs",
        options: ["at all tower controlled airports only when weather conditions are less than VFR.", "at all tower controlled airports regardless of weather conditions.", "at all tower controlled airports within Class D airspace only when weather conditions are less than VFR."],
        correct: 1,
        explanation: "The correct answer is: at all tower controlled airports regardless of weather conditions."
      },
      {
        id: 8,
        question: "Each pilot of an aircraft approaching to land on a runway served by a visual approach slope indicator (VASI) shall",
        options: ["maintain a 3° glide to the runway.", "maintain an altitude at or above the glide slope.", "stay high until the runway can be reached in a power-off landing."],
        correct: 1,
        explanation: "The correct answer is: maintain an altitude at or above the glide slope."
      },
      {
        id: 9,
        question: "When approaching to land on a runway served by a visual approach slope indicator (VASI), the pilot shall",
        options: ["maintain an altitude at or above the glide slope.", "maintain an altitude that captures the glide slope at least 2 miles downwind from the runway threshold.", "remain on the glide slope and land between the two-light bar."],
        correct: 0,
        explanation: "The correct answer is: maintain an altitude at or above the glide slope."
      },
      {
        id: 10,
        question: "Which is the correct traffic pattern departure procedure to use at a noncontrolled airport",
        options: ["Make all turns to the left.", "Comply with any FAA traffic pattern established for the airport.", "Depart in any direction consistent with safety, after crossing the airport boundary."],
        correct: 1,
        explanation: "The correct answer is: Comply with any FAA traffic pattern established for the airport."
      },
      {
        id: 11,
        question: "Two-way radio communication must be established with the Air Traffic Control facility having jurisdiction over the area prior to entering which class airspace",
        options: ["Class E.", "Class C.", "Class G."],
        correct: 1,
        explanation: "The correct answer is: Class C."
      },
      {
        id: 12,
        question: "What minimum radio equipment is required for operation within Class C airspace",
        options: ["Two-way radio communications equipment, a 4096-code transponder, and an encoding altimeter.", "Two-way radio communications equipment and a 4096-code transponder.", "Two-way radio communications equipment, a 4096-code transponder, and DME."],
        correct: 0,
        explanation: "The correct answer is: Two-way radio communications equipment, a 4096-code transponder, and an encoding altimeter."
      },
      {
        id: 13,
        question: "What minimum pilot certification is required for operation within Class B airspace",
        options: ["Private Pilot Certificate with an instrument rating.", "Private Pilot Certificate or Student Pilot Certificate with appropriate logbook endorsements.", "Recreational Pilot Certificate."],
        correct: 1,
        explanation: "The correct answer is: Private Pilot Certificate or Student Pilot Certificate with appropriate logbook endorsements."
      },
      {
        id: 14,
        question: "What minimum pilot certification is required for operation within Class B airspace",
        options: ["Private Pilot Certificate with an instrument rating.", "Private Pilot Certificate or Student Pilot Certificate with appropriate logbook endorsements.", "Commercial Pilot Certificate."],
        correct: 1,
        explanation: "The correct answer is: Private Pilot Certificate or Student Pilot Certificate with appropriate logbook endorsements."
      },
      {
        id: 15,
        question: "What minimum radio equipment is required for VFR operation within Class B airspace",
        options: ["Two-way radio communications equipment, a 4096-code transponder, an encoding altimeter, and a VOR or TACAN receiver.", "Two-way radio communications equipment, a 4096-code transponder, and an encoding altimeter.", "Two-way radio communications equipment and a 4096-code transponder."],
        correct: 1,
        explanation: "The correct answer is: Two-way radio communications equipment, a 4096-code transponder, and an encoding altimeter."
      },
      {
        id: 16,
        question: "(Refer to figure 53.) Traffic patterns in effect at Lincoln Municipal are",
        options: ["to the right on Runway 17L and Runway 35L; to the left on Runway 17R and Runway 35R.", "to the right on Runways 14 - 32.", "to the left on Runway 17L and Runway 35L; to the right on Runway 17R and Runway 35R."],
        correct: 2,
        explanation: "The correct answer is: to the left on Runway 17L and Runway 35L; to the right on Runway 17R and Runway 35R."
      },
      {
        id: 17,
        question: "(Refer to figure 53.) What is the recommended communications procedure for landing at Lincoln Municipal during the hours when the tower is not in operation",
        options: ["Monitor ATIS for airport conditions, then announce your position on 122.95 MHz.", "Contact UNICOM on 122.95 MHz for traffic advisories.", "Monitor airport traffic and announce your position and intentions on 118.5 MHz."],
        correct: 2,
        explanation: "The correct answer is: Monitor airport traffic and announce your position and intentions on 118.5 MHz."
      },
      {
        id: 18,
        question: "(Refer to figure 53.) Which type radar service is provided to VFR aircraft at Lincoln Municipal",
        options: ["Sequencing to the primary Class C airport and standard separation.", "Sequencing to the primary Class C airport, traffic advisories, conflict resolution, and safety alerts.", "Sequencing to the primary Class C airport and conflict resolution so that radar targets do not touch, or 1,000 feet vertical separation."],
        correct: 1,
        explanation: "The correct answer is: Sequencing to the primary Class C airport, traffic advisories, conflict resolution, and safety alerts."
      },
      {
        id: 19,
        question: "(Refer to figure 53.) When approaching Lincoln Municipal from the west at noon for the purpose of landing, initial communications should be with",
        options: ["Lincoln Approach Control on 124.0 MHz.", "Minneapolis Center on 128.75 MHz.", "Lincoln Tower on 118.5 MHz."],
        correct: 0,
        explanation: "The correct answer is: Lincoln Approach Control on 124.0 MHz."
      },
      {
        id: 20,
        question: "How can you determine if another aircraft is on a collision course with your aircraft",
        options: ["The other aircraft will always appear to get larger and closer at a rapid rate.", "There will be no apparent relative motion between your aircraft and the other aircraft.", "The nose of each aircraft is pointed at the same point in space."],
        correct: 1,
        explanation: "The correct answer is: There will be no apparent relative motion between your aircraft and the other aircraft."
      },
    ]
  },
  'ppl-extra-aeromedical': {
    title: "Aeromedical Factors",
    questions: [
      {
        id: 1,
        question: "Which statement best defines hypoxia",
        options: ["An abnormal increase in the volume of air breathed.", "A state of oxygen deficiency in the body.", "A condition of gas bubble formation around the joints or muscles."],
        correct: 1,
        explanation: "The correct answer is: A state of oxygen deficiency in the body."
      },
      {
        id: 2,
        question: "Rapid or extra deep breathing while using oxygen can cause a condition known as",
        options: ["aerosinusitis.", "hyperventilation.", "aerotitis."],
        correct: 1,
        explanation: "The correct answer is: hyperventilation."
      },
      {
        id: 3,
        question: "Which would most likely result in hyperventilation",
        options: ["The excessive consumption of alcohol.", "An extremely slow rate of breathing and insufficient oxygen.", "Emotional tension, anxiety, or fear."],
        correct: 2,
        explanation: "The correct answer is: Emotional tension, anxiety, or fear."
      },
      {
        id: 4,
        question: "A pilot should be able to overcome the symptoms or avoid future occurrences of hyperventilation by",
        options: ["closely monitoring the flight instruments to control the airplane.", "increasing the breathing rate in order to increase lung ventilation.", "slowing the breathing rate, breathing into a bag, or talking aloud."],
        correct: 2,
        explanation: "The correct answer is: slowing the breathing rate, breathing into a bag, or talking aloud."
      },
      {
        id: 5,
        question: "Susceptibility to carbon monoxide poisoning increases as",
        options: ["altitude decreases.", "altitude increases.", "air pressure increases."],
        correct: 1,
        explanation: "The correct answer is: altitude increases."
      },
      {
        id: 6,
        question: "What preparation should a pilot make to adapt the eyes for night flying",
        options: ["Avoid red lights at least 30 minutes before the flight.", "Avoid bright white lights at least 30 minutes before the flight.", "Wear sunglasses after sunset until ready for flight."],
        correct: 1,
        explanation: "The correct answer is: Avoid bright white lights at least 30 minutes before the flight."
      },
      {
        id: 7,
        question: "The danger of spatial disorientation during flight in poor visual conditions may be reduced by",
        options: ["shifting the eyes quickly between the exterior visual field and the instrument panel.", "having faith in the instruments rather than taking a chance on the sensory organs.", "leaning the body in the opposite direction of the motion of the aircraft."],
        correct: 1,
        explanation: "The correct answer is: having faith in the instruments rather than taking a chance on the sensory organs."
      },
      {
        id: 8,
        question: "A state of temporary confusion resulting from misleading information being sent to the brain by various sensory organs is defined as",
        options: ["hypoxia.", "spatial disorientation.", "hyperventilation."],
        correct: 1,
        explanation: "The correct answer is: spatial disorientation."
      },
      {
        id: 9,
        question: "Pilots are more subject to spatial disorientation if",
        options: ["eyes are moved often in the process of cross-checking the flight instruments.", "they ignore the sensations of muscles and inner ear.", "body signals are used to interpret flight attitude."],
        correct: 2,
        explanation: "The correct answer is: body signals are used to interpret flight attitude."
      },
      {
        id: 10,
        question: "If a pilot experiences spatial disorientation during flight in a restricted visibility condition, the best way to overcome the effect is to",
        options: ["concentrate on yaw, pitch, and roll sensations.", "consciously slow the breathing rate until symptoms clear and then resume normal breathing rate.", "rely upon the aircraft instrument indications."],
        correct: 2,
        explanation: "The correct answer is: rely upon the aircraft instrument indications."
      },
    ]
  },
};

// Chapter quiz aliases — map each end-of-section quiz ID to questions from the appropriate topic pool
const _chapterQuizMap = {
  'ppl-ch1-quiz':  { title: 'Chapter 1: Aerodynamics Quiz',          sourceKey: 'ppl-extra-aero',       slice: [0, 10] },
  'ppl-ch2-quiz':  { title: 'Chapter 2: Aircraft Systems Quiz',       sourceKey: 'ppl-l10',              slice: [0, 10] },
  'ppl-ch3-quiz':  { title: 'Chapter 3: Flight Controls Quiz',        sourceKey: 'ppl-extra-controls',   slice: [0, 9]  },
  'ppl-ch4-quiz':  { title: 'Chapter 4: Altitudes Quiz',              sourceKey: 'ppl-l5',               slice: [0, 10] },
  'ppl-ch5-quiz':  { title: 'Chapter 5: Aircraft Documents Quiz',     sourceKey: 'ppl-extra-manuals',    slice: [0, 10] },
  'ppl-ch6-quiz':  { title: 'Chapter 6: Flight Instruments Quiz',     sourceKey: 'ppl-extra-instruments',slice: [0, 10] },
  'ppl-ch7-quiz':  { title: 'Chapter 7: Weight & Balance Quiz',       sourceKey: 'ppl-extra-wb',         slice: [0, 10] },
  'ppl-ch8-quiz':  { title: 'Chapter 8: Aircraft Performance Quiz',   sourceKey: 'ppl-extra-perf',       slice: [0, 10] },
  'ppl-ch9-quiz':  { title: 'Chapter 9: Weather Theory Quiz',         sourceKey: 'ppl-l15',              slice: [0, 10] },
  'ppl-ch10-quiz': { title: 'Chapter 10: Weather Services Quiz',      sourceKey: 'ppl-extra-wx-svcs',    slice: [0, 10] },
  'ppl-ch11-quiz': { title: 'Chapter 11: Airport Operations Quiz',    sourceKey: 'ppl-extra-airport',    slice: [0, 10] },
  'ppl-ch12-quiz': { title: 'Chapter 12: Airspace Quiz',              sourceKey: 'ppl-l25',              slice: [0, 10] },
  'ppl-ch13-quiz': { title: 'Chapter 13: Navigation Quiz',            sourceKey: 'ppl-l20',              slice: [0, 10] },
  'ppl-ch14-quiz': { title: 'Chapter 14: Aeromedical Factors Quiz',   sourceKey: 'ppl-extra-aeromedical',slice: [0, 10] },
  'ppl-ch15-quiz': { title: 'Chapter 15: Regulations Quiz',           sourceKey: 'ppl-l25',              slice: [10, 20] },
  'ppl-ch16-quiz': { title: 'Chapter 16: Pilot Qualification Quiz',   sourceKey: 'ppl-extra-intro',      slice: [0, 10] },
  'ppl-ch17-quiz': { title: 'Chapter 17: Miscellaneous Quiz',         sourceKey: 'ppl-extra-adm',        slice: [0, 6]  },
};
for (const [key, cfg] of Object.entries(_chapterQuizMap)) {
  const src = QUIZ_BANK[cfg.sourceKey];
  if (src) {
    QUIZ_BANK[key] = {
      title: cfg.title,
      questions: src.questions.slice(cfg.slice[0], cfg.slice[1]),
    };
  }
}

export const BADGES = [
  { id: 'first-flight', icon: '🛫', title: 'First Flight', description: 'Complete your first lesson', xpRequired: 0, lessonsRequired: 1 },
  { id: 'sky-student', icon: '📚', title: 'Sky Student', description: 'Complete 10 lessons', xpRequired: 0, lessonsRequired: 10 },
  { id: 'quiz-ace', icon: '🎯', title: 'Quiz Ace', description: 'Score 100% on any quiz', xpRequired: 0, perfect: true },
  { id: 'on-fire', icon: '🔥', title: 'On Fire', description: 'Maintain a 7-day streak', xpRequired: 0, streakRequired: 7 },
  { id: 'navigator', icon: '🗺️', title: 'Navigator', description: 'Complete the Navigation module', xpRequired: 0, moduleRequired: 'ppl-m4' },
  { id: 'weather-wizard', icon: '⛈️', title: 'Weather Wizard', description: 'Complete the Weather module', xpRequired: 0, moduleRequired: 'ppl-m3' },
  { id: 'rule-keeper', icon: '📋', title: 'Rule Keeper', description: 'Complete FAA Regulations module', xpRequired: 0, moduleRequired: 'ppl-m5' },
  { id: 'bonus-grinder', icon: '💪', title: 'Bonus Grinder', description: 'Complete the Bonus Practice module', xpRequired: 0, moduleRequired: 'ppl-m6' },
  { id: 'xp-500', icon: '⚡', title: 'Power Up', description: 'Earn 500 XP', xpRequired: 500, lessonsRequired: 0 },
  { id: 'xp-1000', icon: '💎', title: 'Diamond Pilot', description: 'Earn 1,000 XP', xpRequired: 1000, lessonsRequired: 0 },
  { id: 'xp-2500', icon: '👑', title: 'Ace Pilot', description: 'Earn 2,500 XP', xpRequired: 2500, lessonsRequired: 0 },
  { id: 'ppl-complete', icon: '🏅', title: 'Private Pilot Ready', description: 'Complete the full PPL course', xpRequired: 0, courseRequired: 'private-pilot' },
  { id: 'ifr-complete', icon: '🥈', title: 'Instrument Rated', description: 'Complete the IFR course', xpRequired: 0, courseRequired: 'instrument-rating' },
];

// Maps FAA supplement figure numbers to PDF page numbers (FAA-CT-8080-2H)
// PDF: https://www.faa.gov/sites/faa.gov/files/training_testing/testing/supplements/sport_rec_private_akts.pdf
export const FIGURE_PAGES = {
  1:  4,   // Angle of attack diagram
  2:  5,   // Load factor in turns chart
  3:  8,   // Altimeter diagrams
  4:  9,   // Airspeed indicator color arcs
  6:  11,  // Aircraft lighting
  7:  13,  // Stability diagrams
  8:  14,  // Density altitude chart
  9:  17,  // Flight control positions (wind)
  10: 18,  // Airport traffic pattern
  11: 19,  // Runway markings
  12: 22,  // METAR weather reports
  13: 24,  // TAF terminal forecast
  14: 25,  // Pilot weather report (PIREP)
  15: 27,  // Weather depiction chart
  16: 28,  // Prognostic chart
  17: 29,  // Radar summary chart
  18: 30,  // Winds aloft forecast
  19: 31,  // Constant pressure analysis
  20: 32,  // Surface analysis chart
  21: 34,  // Norfolk/Hampton Roads sectional chart
  22: 36,  // Minot sectional chart
  23: 38,  // Priest River / St. Maries sectional
  24: 40,  // Sectional chart symbols
  25: 41,  // Low altitude enroute chart
  26: 42,  // High altitude enroute chart
  27: 43,  // Airport/facility directory (AFD)
  28: 44,  // VOR test signal
  29: 46,  // VOR CDI indicator
  30: 47,  // ADF/NDB indicator
  31: 48,  // RMI indicator
  32: 49,  // HSI indicator
  33: 54,  // Weight & balance data table
  34: 55,  // Weight & balance loading graph
  35: 56,  // Weight & balance moment envelope
  36: 58,  // Cruise performance chart
  37: 60,  // Crosswind component chart
  38: 61,  // Takeoff distance chart
  39: 62,  // Landing distance chart
  40: 63,  // Climb performance chart
  41: 64,  // Fuel consumption chart
  53: 80,  // Lincoln Municipal airport chart
};

export const FAA_SUPPLEMENT_PDF = 'https://www.faa.gov/sites/faa.gov/files/training_testing/testing/supplements/sport_rec_private_akts.pdf';

export const LEADERBOARD = [
  { rank: 1, name: 'Captain Sarah M.', xp: 8420, avatar: 'SM', streak: 45, badge: '👑' },
  { rank: 2, name: 'Jake T.', xp: 7150, avatar: 'JT', streak: 32, badge: '🥈' },
  { rank: 3, name: 'Priya K.', xp: 6890, avatar: 'PK', streak: 28, badge: '🥉' },
  { rank: 4, name: 'Marcus R.', xp: 5340, avatar: 'MR', streak: 21, badge: null },
  { rank: 5, name: 'Emily C.', xp: 4920, avatar: 'EC', streak: 19, badge: null },
  { rank: 6, name: 'You', xp: 0, avatar: 'ME', streak: 0, badge: null, isUser: true },
  { rank: 7, name: 'Chris B.', xp: 3210, avatar: 'CB', streak: 12, badge: null },
  { rank: 8, name: 'Ava H.', xp: 2840, avatar: 'AH', streak: 9, badge: null },
  { rank: 9, name: 'Noah W.', xp: 2100, avatar: 'NW', streak: 7, badge: null },
  { rank: 10, name: 'Luna P.', xp: 1750, avatar: 'LP', streak: 5, badge: null },
];
