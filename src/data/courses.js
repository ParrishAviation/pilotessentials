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
    totalLessons: 42,
    totalHours: 18,
    xpReward: 2000,
    difficulty: 'Beginner',
    students: 12840,
    rating: 4.9,
    modules: [
      {
        id: 'ppl-m1',
        title: 'Principles of Flight',
        lessons: [
          { id: 'ppl-l1', title: 'Four Forces of Flight', duration: '12:34', xp: 50, type: 'video' },
          { id: 'ppl-l2', title: 'Lift and Bernoulli\'s Principle', duration: '15:22', xp: 50, type: 'video' },
          { id: 'ppl-l3', title: 'Drag, Thrust & Weight', duration: '11:08', xp: 50, type: 'video' },
          { id: 'ppl-l4', title: 'Stability and Control Surfaces', duration: '18:45', xp: 50, type: 'video' },
          { id: 'ppl-l5', title: 'Module 1 Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-m2',
        title: 'Aircraft Systems',
        lessons: [
          { id: 'ppl-l6', title: 'Engine Types and Systems', duration: '20:15', xp: 50, type: 'video' },
          { id: 'ppl-l7', title: 'Fuel Systems', duration: '14:30', xp: 50, type: 'video' },
          { id: 'ppl-l8', title: 'Electrical & Hydraulic Systems', duration: '16:44', xp: 50, type: 'video' },
          { id: 'ppl-l9', title: 'Avionics and Instruments', duration: '22:10', xp: 50, type: 'video' },
          { id: 'ppl-l10', title: 'Module 2 Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-m3',
        title: 'Weather & Meteorology',
        lessons: [
          { id: 'ppl-l11', title: 'Atmosphere & Pressure', duration: '13:55', xp: 50, type: 'video' },
          { id: 'ppl-l12', title: 'Clouds and Precipitation', duration: '17:20', xp: 50, type: 'video' },
          { id: 'ppl-l13', title: 'Wind and Turbulence', duration: '15:40', xp: 50, type: 'video' },
          { id: 'ppl-l14', title: 'Weather Reports & METARs', duration: '21:05', xp: 50, type: 'video' },
          { id: 'ppl-l15', title: 'Module 3 Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-m4',
        title: 'Navigation',
        lessons: [
          { id: 'ppl-l16', title: 'Sectional Charts', duration: '24:18', xp: 50, type: 'video' },
          { id: 'ppl-l17', title: 'Dead Reckoning', duration: '18:30', xp: 50, type: 'video' },
          { id: 'ppl-l18', title: 'VOR Navigation', duration: '20:15', xp: 50, type: 'video' },
          { id: 'ppl-l19', title: 'GPS and Modern Navigation', duration: '16:45', xp: 50, type: 'video' },
          { id: 'ppl-l20', title: 'Module 4 Quiz', duration: '10 questions', xp: 150, type: 'quiz' },
        ]
      },
      {
        id: 'ppl-m5',
        title: 'FAA Regulations',
        lessons: [
          { id: 'ppl-l21', title: 'FAR Part 61 Overview', duration: '19:22', xp: 50, type: 'video' },
          { id: 'ppl-l22', title: 'FAR Part 91 Rules', duration: '23:40', xp: 50, type: 'video' },
          { id: 'ppl-l23', title: 'Airspace Classifications', duration: '25:00', xp: 50, type: 'video' },
          { id: 'ppl-l24', title: 'ATC Communications', duration: '17:55', xp: 50, type: 'video' },
          { id: 'ppl-l25', title: 'Final Exam Prep Quiz', duration: '20 questions', xp: 300, type: 'quiz' },
        ]
      }
    ]
  },
  {
    id: 'instrument-rating',
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
    title: 'Principles of Flight Quiz',
    questions: [
      {
        id: 1,
        question: 'Which of the four forces acts opposite to the direction of flight?',
        options: ['Lift', 'Thrust', 'Drag', 'Weight'],
        correct: 2,
        explanation: 'Drag acts opposite to the direction of flight and must be overcome by thrust for sustained flight.'
      },
      {
        id: 2,
        question: 'According to Bernoulli\'s principle, what happens to pressure as airflow velocity increases?',
        options: ['Pressure increases', 'Pressure decreases', 'Pressure stays the same', 'Pressure oscillates'],
        correct: 1,
        explanation: 'Bernoulli\'s principle states that as fluid velocity increases, pressure decreases. This creates lift on the wing.'
      },
      {
        id: 3,
        question: 'The angle of attack is defined as the angle between:',
        options: ['The chord line and the horizon', 'The chord line and the relative wind', 'The wing and the fuselage', 'The thrust vector and gravity'],
        correct: 1,
        explanation: 'Angle of attack is the angle between the chord line of the wing and the relative wind (incoming airflow).'
      },
      {
        id: 4,
        question: 'Which control surface controls roll?',
        options: ['Elevator', 'Rudder', 'Ailerons', 'Flaps'],
        correct: 2,
        explanation: 'Ailerons control roll. One aileron goes up while the other goes down, creating differential lift.'
      },
      {
        id: 5,
        question: 'What is the primary cause of a stall?',
        options: ['Low airspeed', 'Exceeding critical angle of attack', 'Engine failure', 'High altitude'],
        correct: 1,
        explanation: 'A stall occurs when the critical angle of attack is exceeded, causing airflow separation over the wing.'
      }
    ]
  },
  'ppl-l10': {
    title: 'Aircraft Systems Quiz',
    questions: [
      {
        id: 1,
        question: 'Most small aircraft use what type of engine?',
        options: ['Turbofan', 'Turboprop', 'Horizontally opposed piston', 'Radial piston'],
        correct: 2,
        explanation: 'Most small general aviation aircraft use horizontally-opposed (flat) piston engines for their light weight and low profile.'
      },
      {
        id: 2,
        question: 'Aviation fuel (100LL) is what color?',
        options: ['Red', 'Green', 'Blue', 'Clear'],
        correct: 2,
        explanation: '100LL (100 octane low lead) aviation fuel is dyed blue to distinguish it from other fuel grades.'
      },
      {
        id: 3,
        question: 'The pitot tube measures:',
        options: ['Static pressure only', 'Dynamic (ram) air pressure', 'Outside air temperature', 'Engine RPM'],
        correct: 1,
        explanation: 'The pitot tube faces into the airstream and measures dynamic (ram) pressure used to compute airspeed.'
      }
    ]
  },
  'ppl-l15': {
    title: 'Weather & Meteorology Quiz',
    questions: [
      {
        id: 1,
        question: 'A METAR observation is issued:',
        options: ['Every 6 hours', 'Every hour (or more frequently if conditions change)', 'Once daily', 'Every 30 minutes'],
        correct: 1,
        explanation: 'METARs are issued every hour at :55 past, and special METARs (SPECI) are issued when significant changes occur.'
      },
      {
        id: 2,
        question: 'VFR flight requires a minimum visibility of:',
        options: ['1 statute mile', '3 statute miles', '5 statute miles', '10 statute miles'],
        correct: 1,
        explanation: 'FAR 91.155 requires at least 3 statute miles visibility for VFR flight in Class G airspace below 1,200 ft AGL during the day.'
      },
      {
        id: 3,
        question: 'What weather phenomenon is most hazardous to aircraft?',
        options: ['Light rain', 'Thunderstorms', 'Fog', 'High winds'],
        correct: 1,
        explanation: 'Thunderstorms are considered the most hazardous weather for aircraft due to lightning, hail, severe turbulence, and wind shear.'
      }
    ]
  },
  'ppl-l20': {
    title: 'Navigation Quiz',
    questions: [
      {
        id: 1,
        question: 'On a sectional chart, what does a solid blue line represent?',
        options: ['Victor airways', 'Class E airspace', 'Class B airspace', 'International boundaries'],
        correct: 2,
        explanation: 'Solid blue lines on sectional charts outline Class B airspace.'
      },
      {
        id: 2,
        question: 'Magnetic variation is the difference between:',
        options: ['True north and magnetic north', 'Compass heading and magnetic heading', 'Ground speed and airspeed', 'True altitude and pressure altitude'],
        correct: 0,
        explanation: 'Magnetic variation (declination) is the angular difference between true north and magnetic north at a given location.'
      }
    ]
  },
  'ppl-l25': {
    title: 'FAA Regulations Final Exam',
    questions: [
      {
        id: 1,
        question: 'A student pilot may not carry passengers in a solo flight unless:',
        options: ['They have 10 hours solo time', 'They have their medical certificate', 'Never — student pilots cannot carry passengers', 'With instructor endorsement only'],
        correct: 2,
        explanation: 'Student pilots are never permitted to carry passengers. This privilege begins with the Private Pilot Certificate.'
      },
      {
        id: 2,
        question: 'Class D airspace typically extends from the surface to:',
        options: ['1,500 ft AGL', '2,500 ft AGL', '3,000 ft AGL', '4,000 ft AGL'],
        correct: 1,
        explanation: 'Class D airspace typically extends from the surface up to 2,500 ft AGL and surrounds airports with an operating control tower.'
      },
      {
        id: 3,
        question: 'The required documents that must be onboard an aircraft are remembered by the acronym:',
        options: ['ARROW', 'IMSAFE', 'PAVE', 'DECIDE'],
        correct: 0,
        explanation: 'ARROW: Airworthiness certificate, Registration, Radio station license (for international), Operating handbook (POH/AFM), Weight & balance data.'
      },
      {
        id: 4,
        question: 'How long must a private pilot have held their certificate before acting as PIC on a flight carrying passengers at night?',
        options: ['No additional requirement', '3 months', '6 months', '1 year'],
        correct: 0,
        explanation: 'There is no waiting period. However, a private pilot must have 3 take-offs and landings to a full stop at night within the preceding 90 days to carry passengers.'
      },
      {
        id: 5,
        question: 'The minimum altitude for aircraft over congested areas is:',
        options: ['500 ft AGL', '1,000 ft above the highest obstacle within 2,000 ft horizontal', '2,000 ft AGL', '1,500 ft AGL'],
        correct: 1,
        explanation: 'FAR 91.119 requires at least 1,000 ft above the highest obstacle within a horizontal radius of 2,000 ft over congested areas.'
      }
    ]
  }
};

export const BADGES = [
  { id: 'first-flight', icon: '🛫', title: 'First Flight', description: 'Complete your first lesson', xpRequired: 0, lessonsRequired: 1 },
  { id: 'sky-student', icon: '📚', title: 'Sky Student', description: 'Complete 10 lessons', xpRequired: 500, lessonsRequired: 10 },
  { id: 'quiz-ace', icon: '🎯', title: 'Quiz Ace', description: 'Score 100% on any quiz', xpRequired: 0, perfect: true },
  { id: 'on-fire', icon: '🔥', title: 'On Fire', description: 'Maintain a 7-day streak', xpRequired: 0, streakRequired: 7 },
  { id: 'navigator', icon: '🗺️', title: 'Navigator', description: 'Complete the Navigation module', xpRequired: 0, moduleRequired: 'ppl-m4' },
  { id: 'weather-wizard', icon: '⛈️', title: 'Weather Wizard', description: 'Complete the Weather module', xpRequired: 0, moduleRequired: 'ppl-m3' },
  { id: 'rule-keeper', icon: '📋', title: 'Rule Keeper', description: 'Complete FAA Regulations module', xpRequired: 0, moduleRequired: 'ppl-m5' },
  { id: 'xp-500', icon: '⚡', title: 'Power Up', description: 'Earn 500 XP', xpRequired: 500, lessonsRequired: 0 },
  { id: 'xp-1000', icon: '💎', title: 'Diamond Pilot', description: 'Earn 1,000 XP', xpRequired: 1000, lessonsRequired: 0 },
  { id: 'xp-2500', icon: '👑', title: 'Ace Pilot', description: 'Earn 2,500 XP', xpRequired: 2500, lessonsRequired: 0 },
  { id: 'ppl-complete', icon: '🏅', title: 'Private Pilot Ready', description: 'Complete the full PPL course', xpRequired: 0, courseRequired: 'private-pilot' },
  { id: 'ifr-complete', icon: '🥈', title: 'Instrument Rated', description: 'Complete the IFR course', xpRequired: 0, courseRequired: 'instrument-rating' },
];

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
