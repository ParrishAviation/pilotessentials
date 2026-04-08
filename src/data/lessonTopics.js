/**
 * Lesson topic metadata for AI study guide generation.
 * Maps each lesson ID to its PHAK chapter, AFH chapter, CFR references,
 * FAA supplement figures, and key topics to include in the study guide.
 */

export const LESSON_TOPICS = {
  // ─── CHAPTER 1: AERODYNAMICS ─────────────────────────────────────────────
  'ppl-ch1-l1': {
    phak: 'Chapter 5: Aerodynamics of Flight',
    topics: ['four aerodynamic forces (lift, weight, thrust, drag)', "Bernoulli's principle and venturi effect", 'angle of attack and relative wind', 'Newton\'s third law applied to lift', 'induced drag vs parasite drag', 'lift equation: L = CL × ½ρV²S'],
  },
  'ppl-ch1-l2': {
    phak: 'Chapter 5: Aerodynamics of Flight',
    topics: ['longitudinal stability (pitch) — horizontal stabilizer', 'lateral stability (roll) — dihedral, keel effect', 'directional stability (yaw) — vertical stabilizer', 'CG effects on stability', 'static vs dynamic stability', 'phugoid oscillation'],
  },
  'ppl-ch1-l3': {
    phak: 'Chapter 5: Aerodynamics of Flight',
    figures: ['Figure 1 (angle of attack indicator)'],
    topics: ['critical angle of attack (~18°)', 'how stall is caused by AOA not airspeed', 'accelerated stalls', 'stall speed varies with load factor: Vs × √Load Factor', 'stall warning indicators', 'stall recovery: PARE (Power-push-roll-execute)'],
  },
  'ppl-ch1-l4': {
    phak: 'Chapter 5: Aerodynamics of Flight',
    topics: ['ground effect occurs within one wingspan of ground', 'induced drag decreases, lift increases in ground effect', 'floating tendency on landing', 'premature rotation on takeoff in ground effect', 'practical implications for short field operations'],
  },
  'ppl-ch1-l5': {
    phak: 'Chapter 5: Aerodynamics of Flight',
    topics: ['spin = stall + yaw', 'four phases: incipient, fully developed, recovery, pullout', 'spin entry causes', 'PARE recovery procedure: Power-Ailerons neutral-Rudder opposite-Elevator forward', 'prohibited spin maneuvers in normal category'],
  },
  'ppl-ch1-l6': {
    phak: 'Chapter 5: Aerodynamics of Flight',
    topics: ['torque reaction (rotation opposite propeller)', 'P-factor (asymmetric thrust at high AOA)', 'spiraling slipstream hits vertical stabilizer', 'gyroscopic precession (90° ahead in direction of rotation)', 'left-turning tendency critical on takeoff', 'right rudder correction'],
  },
  'ppl-ch1-l7': {
    phak: 'Chapter 5: Aerodynamics of Flight',
    figures: ['Figure 2 (load factor chart)'],
    topics: ['load factor = lift / weight', 'load factor in banks: 60° bank = 2 Gs, 75° = 3.9 Gs', 'normal category limit: +3.8 G / -1.52 G', 'load factor increases stall speed', 'maneuvering speed (Va) definition', 'structural damage from turbulence at high speed'],
  },
  'ppl-ch1-l8': {
    phak: 'Chapter 5: Aerodynamics of Flight',
    figures: ['Figure 2 (VG diagram / velocity-load factor diagram)'],
    topics: ['V-G diagram axes (airspeed vs G-load)', 'maneuvering speed (Va): full control input safe below Va', 'design maneuvering speed vs published Va', 'structural failure zones on V-G diagram', 'turbulence penetration speed', 'reducing Va with reduced weight'],
  },

  // ─── CHAPTER 2: AIRCRAFT SYSTEMS ─────────────────────────────────────────
  'ppl-ch2-l1': {
    phak: 'Chapter 7: Aircraft Systems',
    topics: ['four-stroke cycle: intake-compression-power-exhaust', 'reciprocating engine operation', 'mixture control: rich for cooling/takeoff, lean for cruise', 'manifold pressure and RPM relationship', 'engine oil system: lubrication and cooling', 'oil pressure and temperature limits'],
  },
  'ppl-ch2-l2': {
    phak: 'Chapter 7: Aircraft Systems',
    topics: ['carburetor uses venturi to mix fuel/air', 'carburetor ice: forms when temp 20°-70°F with high humidity', 'symptoms: RPM drop, rough engine', 'carburetor heat application: full on to clear', 'fuel-injected engines do not use carburetor', 'alternate air for fuel-injected engines'],
  },
  'ppl-ch2-l3': {
    phak: 'Chapter 7: Aircraft Systems',
    topics: ['detonation: uncontrolled fuel ignition causing knock', 'pre-ignition: fuel ignites before spark', 'causes: too lean mixture, low octane fuel, overheating', 'prevention: correct fuel grade, proper mixture, cooling', 'rich mixture prevents detonation during high-power operations'],
  },
  'ppl-ch2-l4': {
    phak: 'Chapter 7: Aircraft Systems',
    topics: ['dual magneto system: independent of electrical system', 'magneto check: 75 RPM max drop, 125 RPM max difference', 'left mag fires right cylinder plugs and vice versa', 'why two magnetos improve combustion efficiency', 'ignition switch positions: OFF-R-L-BOTH-START'],
  },
  'ppl-ch2-l5': {
    phak: 'Chapter 7: Aircraft Systems',
    topics: ['100LL Avgas: blue, low-lead, most common', 'Avgas 100: green, high-lead', 'Jet-A: clear/straw, turbine only — DO NOT USE in piston', 'mogas (auto gas): use only with STC', 'sumping for water: 3-lobe collar indicates water', 'GATS jar for fuel sampling', 'fuel grades must meet or exceed engine requirement'],
  },
  'ppl-ch2-l6': {
    phak: 'Chapter 7: Aircraft Systems',
    topics: ['fixed-pitch propeller: one blade angle for all conditions', 'variable-pitch propeller: adjustable blade angle', 'constant-speed propeller: governor maintains RPM', 'prop lever controls RPM; throttle controls manifold pressure', 'high RPM = low pitch (climb), low RPM = high pitch (cruise)', 'propeller efficiency: thrust generated per HP'],
  },

  // ─── CHAPTER 3: FLIGHT CONTROLS ──────────────────────────────────────────
  'ppl-ch3-l1': {
    phak: 'Chapter 6: Flight Controls',
    figures: ['Figure 9 (crosswind taxi flight control positions)'],
    topics: ['ailerons: roll control, work differentially', 'elevator/stabilator: pitch control', 'rudder: yaw control (not turn initiator)', 'adverse yaw: aileron drag causes yaw opposite turn', 'aileron drag causes: frise ailerons, differential ailerons', 'proper crosswind taxi technique using Figure 9'],
  },
  'ppl-ch3-l2': {
    phak: 'Chapter 6: Flight Controls',
    topics: ['flaps: increase lift and drag, lower stall speed', 'flap types: plain, split, slotted, Fowler', 'trim tabs: relieve control pressure', 'anti-servo tab vs servo tab', 'leading edge devices: slats increase critical AOA', 'spoilers: reduce lift for descent', 'flap extension speeds (Vfe)'],
  },

  // ─── CHAPTER 4: PRINCIPLES OF FLIGHT (ALTITUDES) ─────────────────────────
  'ppl-ch4-l1': {
    phak: 'Chapter 4: Principles of Flight',
    figures: ['Figure 3 (altimeter diagrams)', 'Figure 4 (airspeed indicator color arcs)'],
    topics: ['indicated altitude: altimeter reading', 'pressure altitude: altimeter set to 29.92', 'density altitude: pressure alt corrected for non-standard temp', 'true altitude: actual height above MSL', 'absolute altitude: height above ground (AGL)', 'calibrated altitude: IAS corrected for instrument error'],
  },
  'ppl-ch4-l2': {
    phak: 'Chapter 4: Principles of Flight',
    topics: ['standard atmosphere: 29.92 inHg, 15°C at sea level', 'pressure decreases 1 inHg per 1,000 ft (approx)', 'altimeter Kollsman window: set local altimeter setting', 'if altimeter set too high: aircraft is lower than indicated (dangerous)', 'altimeter error: 1 inch Hg = ~1,000 ft', 'transition level: above 18,000 MSL set 29.92'],
  },
  'ppl-ch4-l3': {
    phak: 'Chapter 4: Principles of Flight',
    figures: ['Figure 8 (density altitude chart)'],
    topics: ['density altitude = pressure altitude + temp correction', 'high density altitude: hot, high, humid reduces performance', 'density altitude chart: use Figure 8 — enter OAT and pressure alt', 'ISA standard: 15°C - (2°C × altitude in thousands)', 'density alt increases ~120 ft per 1°C above standard', 'takeoff roll, climb rate, engine power all decrease with high DA'],
  },

  // ─── CHAPTER 5: FLIGHT MANUALS & DOCUMENTS ───────────────────────────────
  'ppl-ch5-l1': {
    phak: 'Chapter 8: Flight Manuals and Other Documents',
    cfr: '14 CFR 91.9, 91.203',
    topics: ['ARROW acronym: Airworthiness certificate, Registration, Radio station license, Operating limitations (POH/AFM), Weight & balance data', 'airworthiness certificate: must display, no expiration', 'registration: must be onboard, expires every 3 years', 'operating handbook (POH) must be aboard aircraft'],
  },
  'ppl-ch5-l2': {
    phak: 'Chapter 8: Flight Manuals and Other Documents',
    cfr: '14 CFR 91.409, 91.411, 91.413',
    topics: ['annual inspection: every 12 calendar months', '100-hour inspection: for-hire aircraft', 'pitot-static system: every 24 calendar months (IFR)', 'altimeter: every 24 calendar months (IFR)', 'transponder: every 24 calendar months', 'ELT: battery replacement at 50% useful life or 1 cumulative hour use', 'progressive inspection alternative to 100-hour'],
  },
  'ppl-ch5-l3': {
    phak: 'Chapter 8: Flight Manuals and Other Documents',
    cfr: '14 CFR 91.207',
    topics: ['ELT required for most US aircraft', 'frequencies: 121.5 MHz (analog) and 406 MHz (digital GPS)', '406 MHz ELTs: registered with NOAA, GPS position', 'ELT test: first 5 minutes of any hour, max 3 audio sweeps', 'battery replacement: 50% of useful life, or 1 hour cumulative', 'ELT must be checked every 12 months'],
  },
  'ppl-ch5-l4': {
    phak: 'Chapter 8: Flight Manuals and Other Documents',
    cfr: '14 CFR 91.103',
    topics: ['preflight must review: NOTAMs, weather, runway lengths, takeoff/landing distances, fuel requirements, known ATC delays, alternate airports', 'VFR fuel requirement: day = 30 min reserve, night = 45 min', 'check TFRs via 1800wxbrief.com or flight service', 'NOTAM types: FDC, domestic, international, SAA'],
  },
  'ppl-ch5-l5': {
    cfr: '14 CFR 43.3, 43 Appendix A',
    topics: ['pilots may perform preventive maintenance on aircraft they own or operate', 'includes: oil change, tire replacement, safety wire, landing light bulb', 'must log the work: maintenance record entry required', 'cannot perform work requiring return to airworthy status', 'A&P required for all other maintenance'],
  },

  // ─── CHAPTER 6: FLIGHT INSTRUMENTS ──────────────────────────────────────
  'ppl-ch6-l1': {
    phak: 'Chapter 8: Flight Instruments',
    figures: ['Figure 3 (altimeter)', 'Figure 4 (airspeed indicator)'],
    topics: ['pitot-static instruments: ASI, altimeter, VSI', 'pitot tube: measures total pressure (ram + static)', 'static port: measures ambient static pressure', 'blocked pitot: ASI reads zero or constant', 'blocked static port: altimeter freezes, ASI reads wrong', 'alternate static source: cockpit air (slightly positive pressure)'],
  },
  'ppl-ch6-l2': {
    phak: 'Chapter 8: Flight Instruments',
    topics: ['gyroscopic principles: rigidity in space and precession', 'heading indicator: powered by vacuum/pressure or electric', 'heading indicator precesses ~3°/hour, reset to compass', 'attitude indicator: vacuum-powered, shows pitch and bank', 'turn coordinator: electric, shows bank and rate of turn', 'inclinometer (ball): indicates coordinated flight'],
  },
  'ppl-ch6-l3': {
    phak: 'Chapter 8: Flight Instruments',
    figures: ['Figure 4 (airspeed indicator color arcs)'],
    topics: ['white arc: Vso to Vfe (flap operating range)', 'green arc: Vs1 to Vno (normal operating range)', 'yellow arc: Vno to Vne (caution/smooth air only)', 'red line: Vne (never exceed)', 'Vso: stall speed with flaps extended', 'Vs1: stall speed clean', 'Vno: max structural cruise speed'],
  },
  'ppl-ch6-l4': {
    phak: 'Chapter 8: Flight Instruments',
    figures: ['Figure 3 (altimeter diagrams — reading 3 hands)'],
    topics: ['altimeter has 3 hands: 100s, 1000s, 10,000s', 'Kollsman window: set QNH (local altimeter setting)', 'high to low, look out below (pressure drops, alt drops)', 'each 1 inHg = approximately 1,000 ft error', 'standard day: 29.92 inHg = 15°C at sea level', 'reading a 3-pointer altimeter from Figure 3'],
  },
  'ppl-ch6-l5': {
    phak: 'Chapter 8: Flight Instruments',
    topics: ['magnetic compass errors — OSUN/UNOS', 'Oscillation: turns and bumps cause swinging', 'Magnetic Dip: compass dips toward north magnetic pole', 'UNOS (acceleration errors): accelerate Undershoot North, decelerate Overshoot North (Northern hemisphere)', 'ANDS (bank errors): Accelerate North, Decelerate South', 'Northerly turning errors: lead north turns, lag south turns', 'compass reliable in straight and level, unaccelerated flight'],
  },

  // ─── CHAPTER 7: WEIGHT & BALANCE ─────────────────────────────────────────
  'ppl-ch7-l1': {
    phak: 'Chapter 9: Weight and Balance',
    figures: ['Figure 33 (W&B data table)', 'Figure 34 (loading graph)'],
    topics: ['weight terminology: basic empty weight, useful load, gross weight, zero-fuel weight', 'standard weights: fuel 6 lb/gal, oil 7.5 lb/quart, person 170 lb', 'maximum gross weight vs maximum ramp weight', 'CG formula: CG = Total Moment / Total Weight', 'moment = weight × arm (inches from datum)', 'datum: manufacturer-defined reference point'],
  },
  'ppl-ch7-l2': {
    phak: 'Chapter 9: Weight and Balance',
    figures: ['Figure 34 (loading graph)', 'Figure 35 (moment envelope)'],
    topics: ['loading graph: find moment from weight of each item', 'moment envelope: check if weight/moment falls within limits', 'forward CG: stable but higher stall speed, requires more elevator', 'aft CG: less stable, dangerous, reduced stall speed', 'effects of overloading: higher stall speed, longer takeoff, reduced climb, longer landing', 'working a sample W&B problem step by step'],
  },
  'ppl-ch7-l3': {
    phak: 'Chapter 9: Weight and Balance',
    figures: ['Figure 35 (moment envelope)'],
    topics: ['completing a full W&B calculation', 'CG shift formula when moving weight: ΔCG = (weight moved × distance) / total weight', 'how fuel burn affects CG', 'W&B at different loading conditions', 'CG limits: forward and aft limits from AFM/POH', 'ensuring CG remains within limits throughout flight'],
  },

  // ─── CHAPTER 8: AIRCRAFT PERFORMANCE ─────────────────────────────────────
  'ppl-ch8-l1': {
    phak: 'Chapter 10: Aircraft Performance',
    figures: ['Figure 36 (cruise performance chart)'],
    topics: ['density altitude is the primary factor in performance', 'performance charts in POH/AFM', 'interpolation between chart values', 'non-standard conditions require pilot calculation', 'cruise performance: TAS, fuel flow, range vs altitude', 'using Figure 36 to find cruise TAS and fuel burn'],
  },
  'ppl-ch8-l2': {
    phak: 'Chapter 10: Aircraft Performance',
    topics: ['factors increasing takeoff distance: high altitude, high temperature, high gross weight, tailwind, uphill slope, soft/wet runway', 'obstacle clearance vs ground roll distinction', 'short field technique vs normal technique', 'rule of thumb: 10% increase density alt = ~20% longer takeoff roll', 'headwind 10% = ~19% shorter takeoff roll'],
  },
  'ppl-ch8-l3': {
    phak: 'Chapter 10: Aircraft Performance',
    topics: ['landing distance factors: same as takeoff (opposite direction for headwind/tailwind)', 'flap configuration effect on landing distance', 'approach speed critical for landing distance', '50% more airspeed = 125% more stopping distance (V²)', 'overweight landing hazards', 'hydroplaning speed: 8.6 × √tire pressure (PSI)'],
  },
  'ppl-ch8-l4': {
    phak: 'Chapter 10: Aircraft Performance',
    topics: ['Vx: best angle of climb — most altitude per distance — obstacle clearance', 'Vy: best rate of climb — most altitude per time', 'Vx < Vy always; they converge at absolute ceiling', 'Va: maneuvering speed — full deflection allowed below this speed', 'Vno: max structural cruising speed — do not exceed in turbulence', 'Vne: never exceed — red line on ASI', 'Vfe: max flap extended speed'],
  },
  'ppl-ch8-l5': {
    phak: 'Chapter 10: Aircraft Performance',
    figures: ['Figure 37 (crosswind component chart)'],
    topics: ['crosswind component = wind speed × sin(wind angle)', 'headwind component = wind speed × cos(wind angle)', 'using Figure 37: draw arc at wind speed, read components', 'demonstrated crosswind component in POH (not a limit — advisory)', 'maximum demonstrated crosswind component', 'wind sock and wind indicator interpretation'],
  },

  // ─── CHAPTER 9: WEATHER THEORY ───────────────────────────────────────────
  'ppl-ch9-l1': {
    phak: 'Chapter 12: Aviation Weather',
    topics: ['atmosphere composition: 78% N, 21% O, 1% other', 'temperature lapse rate standard: 2°C per 1,000 ft', 'pressure and temperature decrease with altitude', 'Coriolis effect causes wind to curve right in Northern Hemisphere', 'pressure gradient force: wind from high to low pressure', 'sea breeze: land heats faster, wind blows from sea to land during day'],
  },
  'ppl-ch9-l2': {
    phak: 'Chapter 12: Aviation Weather',
    topics: ['stable air: resists vertical movement, smooth ride, poor visibility, stratus clouds', 'unstable air: promotes convection, turbulence, good visibility, cumulus clouds', 'dry adiabatic lapse rate: 3°C/1,000 ft (unsaturated)', 'moist adiabatic lapse rate: 1.5°C/1,000 ft (saturated)', 'air mass types: maritime vs continental, polar vs tropical', 'fronts: cold, warm, stationary, occluded'],
  },
  'ppl-ch9-l3': {
    phak: 'Chapter 12: Aviation Weather',
    topics: ['dew point: temperature at which air becomes saturated', 'relative humidity 100% = at dew point', 'cloud base estimate: (temp - dew point) / 4.4 × 1,000 ft', '3°C dew point spread = cloud base approximately 1,000 AGL', 'frost: dew point below freezing and surface below dew point', 'precipitation types and formation'],
  },
  'ppl-ch9-l4': {
    phak: 'Chapter 12: Aviation Weather',
    topics: ['cloud classification: low (stratus), middle (alto), high (cirro)', 'prefix cumulo = vertical development', 'cumulonimbus = thunderstorm cloud, most hazardous', 'stratus: stable, grey, IFR conditions', 'cumulus: unstable, puffy, turbulence', 'cloud clearance requirements by airspace class', 'lenticular clouds = mountain wave turbulence'],
  },
  'ppl-ch9-l5': {
    phak: 'Chapter 12: Aviation Weather',
    topics: ['radiation fog: ground cools, needs clear sky, calm winds, high moisture', 'advection fog: warm moist air moves over cold surface (coastal)', 'upslope fog: moist air forced uphill, cools adiabatically', 'steam fog: cold air over warm water — most hazardous type', 'fog dissipation: wind, heating of surface', 'fog vs mist: visibility under 5/8 mile = fog'],
  },
  'ppl-ch9-l6': {
    phak: 'Chapter 12: Aviation Weather',
    topics: ['temperature inversion: warm air over cold air', 'inversion traps pollutants and haze near surface', 'low-level wind shear common with inversion', 'inversion associated with smooth air above, turbulence below', 'visual illusions in haze under inversion', 'common over valleys and in coastal areas overnight'],
  },
  'ppl-ch9-l7': {
    phak: 'Chapter 12: Aviation Weather',
    topics: ['structural icing: rime (white, rough, from freezing drizzle), clear (transparent, dense, from large drops)', 'most dangerous: clear ice (heaviest, hardest to remove)', 'induction icing: carburetor ice, filter ice', 'frost: reduces lift by disrupting airflow over wings', 'take off with frost is prohibited', 'icing conditions: visible moisture + temp at or below freezing', 'PIREPs critical for icing information'],
  },
  'ppl-ch9-l8': {
    phak: 'Chapter 12: Aviation Weather',
    topics: ['mechanical turbulence: surface friction, buildings, terrain', 'thermal turbulence: convective heating, cumulus development', 'wind shear turbulence: rapid wind speed/direction change', 'clear air turbulence (CAT): jet stream, above 15,000 ft', 'mountain wave: lee side of mountain ridges', 'maneuvering speed (Va) for turbulence penetration', 'turbulence intensity: light, moderate, severe, extreme'],
  },
  'ppl-ch9-l9': {
    phak: 'Chapter 12: Aviation Weather',
    topics: ['thunderstorm requirements: lifting action, unstable air, moisture', 'stages: cumulus (building), mature (most dangerous), dissipating', 'hazards: lightning, hail, turbulence, microburst, wind shear, icing', 'microburst: concentrated downburst, +/-45 knots wind shear', 'avoid thunderstorms: 20 miles minimum', 'never fly under CB anvil', 'SIGMET issued for severe/extreme turbulence and icing'],
  },

  // ─── CHAPTER 10: AVIATION WEATHER SERVICES ───────────────────────────────
  'ppl-ch10-l1': {
    phak: 'Chapter 13: Aviation Weather Services',
    aim: 'AIM Chapter 7, Section 1',
    topics: ['standard weather briefing: for unfamiliar flight, first call', 'abbreviated briefing: to update or supplement previous briefing', 'outlook briefing: for flights 6+ hours away, general planning', '1800wxbrief.com: free FAA weather briefing service', 'file flight plans through briefing service', 'PIREPs should be reported to FSS'],
  },
  'ppl-ch10-l2': {
    phak: 'Chapter 13: Aviation Weather Services',
    figures: ['Figure 12 (METAR weather reports)'],
    topics: ['METAR decode: METAR KDTO 121753Z 18015G25KT 10SM -RA FEW040 SCT070 24/16 A2992', 'type/station/time/wind/visibility/weather/sky/temp-dew point/altimeter', 'sky cover: SKC, FEW, SCT, BKN, OVC', 'SPECI: special report for rapidly changing conditions', 'Automatic (AUTO) vs manual observation', 'decoding wind: direction in magnetic, speed in knots'],
  },
  'ppl-ch10-l3': {
    phak: 'Chapter 13: Aviation Weather Services',
    figures: ['Figure 14 (PIREP format)'],
    topics: ['PIREP provides actual conditions from other pilots', 'UA = routine PIREP, UUA = urgent PIREP', 'PIREP format: /OV location /TM time /FL altitude /TP aircraft type /SK clouds /WX weather /TA air temp /WV wind /TB turbulence /IC icing /RM remarks', 'turbulence intensities: NEG, LGT, MDT, SEV, EXTRM', 'icing intensities: NEG, TRC, LGT, MDT, HVY'],
  },
  'ppl-ch10-l4': {
    phak: 'Chapter 13: Aviation Weather Services',
    topics: ['TAF: Terminal Aerodrome Forecast — 5SM radius, issued 4x daily', 'TAF valid period: 24 or 30 hours', 'TAF decode: KDTO 121720Z 1218/1318 18012KT P6SM FEW060', 'FM (from), TEMPO (temporary 30-60 min), BECMG (becoming)', 'PROB: probability of condition occurring', 'Area Forecast (FA): broader area, 12 hours, issued 3x daily'],
  },
  'ppl-ch10-l5': {
    phak: 'Chapter 13: Aviation Weather Services',
    topics: ['SIGMET: severe weather affecting all aircraft — mandatory avoid', 'conditions for SIGMET: severe turbulence, severe icing, dust storms, volcanic ash', 'valid: 4 hours (6 for typhoons)', 'AIRMET Sierra (S): IFR/mountain obscuration', 'AIRMET Tango (T): moderate turbulence, sustained wind >30 kts', 'AIRMET Zulu (Z): moderate icing, freezing level', 'Convective SIGMET (WST): thunderstorms, issued every 55 min'],
  },
  'ppl-ch10-l6': {
    phak: 'Chapter 13: Aviation Weather Services',
    figures: ['Figure 18 (winds and temperatures aloft forecast)'],
    topics: ['winds aloft forecast (FB): issued twice daily', 'decode: 2714-02 = wind from 270° at 14 knots, -2°C', '7500+ = no significant wind', '9900 = light and variable', 'missing level = not available', 'find most favorable altitude for flight (tailwind, temperature)', 'no winds below 1,500 ft or within 1,500 ft of surface elevation'],
  },
  'ppl-ch10-l7': {
    phak: 'Chapter 13: Aviation Weather Services',
    figures: ['Figure 20 (surface analysis chart)', 'Figure 15 (weather depiction chart)'],
    topics: ['surface analysis chart: current conditions, isobars, fronts, pressure systems', 'wind barbs: each full barb = 10 kts, half barb = 5 kts', 'weather depiction chart: IFR/MVFR/VFR areas, issued every 3 hours', 'IFR = ceiling < 1,000 AGL or visibility < 3 SM', 'MVFR = ceiling 1,000-3,000 AGL or visibility 3-5 SM', 'low pressure = bad weather, rising; high pressure = good weather'],
  },
  'ppl-ch10-l8': {
    phak: 'Chapter 13: Aviation Weather Services',
    figures: ['Figure 16 (prognostic chart)'],
    topics: ['low-altitude prog chart: surface to 24,000 ft MSL', 'panels: 12-hour and 24-hour forecasts side by side', 'solid lines = IFR areas, dashed = MVFR', 'hatching = turbulence areas, symbols = weather types', 'fronts shown with standard symbols', 'used for flight planning 12-24 hours ahead'],
  },

  // ─── CHAPTER 11: AIRPORT OPERATIONS ──────────────────────────────────────
  'ppl-ch11-l1': {
    phak: 'Chapter 14: Airport Operations',
    figures: ['Figure 53 (Lincoln Municipal airport diagram)'],
    topics: ['runway numbering: magnetic direction ÷ 10 (rounded)', 'parallel runways: L, R, C designation', 'taxiway markings: yellow centerline, edge, holding position', 'runway markings: white — centerline, threshold, TDZ, aiming point', 'hold short: ILS critical area markings (double yellow bars)', 'hot spots: areas of runway incursion risk'],
  },
  'ppl-ch11-l2': {
    phak: 'Chapter 14: Airport Operations',
    topics: ['Chart Supplement (formerly A/FD): published every 56 days', 'information: communication frequencies, runways, services, hours', 'ATIS: automated weather/airport information, updated hourly', 'airport class designations: public, private, military', 'facility data: fuel types, lighting, services, hazards', 'NOTAMs supplement the chart supplement with current info'],
  },
  'ppl-ch11-l3': {
    phak: 'Chapter 14: Airport Operations',
    topics: ['runway edge lights: white (lighted runways)', 'runway end identifier lights (REIL): flashing white at threshold', 'touchdown zone lights: white bars', 'centerline lights: white to yellow to red near end', 'taxiway lights: blue edge lights', 'rotating airport beacon: civil = white/green, military = white/white/green', 'beacon on day = IMC conditions at towered airport'],
  },
  'ppl-ch11-l4': {
    phak: 'Chapter 14: Airport Operations',
    topics: ['VASI (Visual Approach Slope Indicator): 3° glidepath', 'VASI: white/white = high, red/white = on path, red/red = too low', 'PAPI (Precision Approach Path Indicator): 4 lights', 'PAPI: 4 white = high, 3 white/1 red = slightly high, 2/2 = on, 1/3 = slightly low, 4 red = too low', 'tri-color VASI: green=on, amber=high, red=below', 'pulsating VASI: pulsating white=high, steady=on, pulsating red=below'],
  },
  'ppl-ch11-l5': {
    phak: 'Chapter 14: Airport Operations',
    aim: 'AIM Chapter 4',
    topics: ['phonetic alphabet (Alpha through Zulu)', 'readback requirements: altimeter, altitude, heading, frequency changes', 'ATIS: listen before calling, include information code', 'initial callup format: facility, aircraft type/N-number, position, request', 'radio failure procedures: squawk 7600, continue flight', '121.5 MHz emergency frequency'],
  },
  'ppl-ch11-l6': {
    phak: 'Chapter 14: Airport Operations',
    aim: 'AIM 4-3-13',
    topics: ['light gun signals from ATC tower', 'in flight: steady green = cleared to land, flashing green = return to land, steady red = give way continue circling, flashing red = airport unsafe, alternating = exercise extreme caution', 'on ground: steady green = cleared takeoff, flashing green = cleared to taxi, steady red = stop, flashing red = taxi clear, flashing white = return to start, alternating = exercise caution'],
  },
  'ppl-ch11-l7': {
    phak: 'Chapter 14: Airport Operations',
    topics: ['standard traffic pattern: left-hand turns', 'pattern altitude: 800-1,000 AGL (1,500 AGL for turbine)', 'pattern legs: upwind, crosswind, downwind, base, final', 'entry: 45° to midpoint of downwind', 'CTAF: Common Traffic Advisory Frequency', 'non-towered airport: self-announce on CTAF', 'segmented circle shows traffic pattern direction'],
  },
  'ppl-ch11-l8': {
    cfr: '14 CFR 91.113',
    topics: ['right-of-way hierarchy: balloon > glider > airship > aircraft towing > powered aircraft', 'converging: the aircraft with the other on its right has right-of-way', 'head-on: both turn right', 'overtaking: overtaken aircraft has right-of-way (pass on right)', 'landing has right-of-way over aircraft in flight', 'lower aircraft landing has right-of-way', 'emergency has right of way over all others'],
  },
  'ppl-ch11-l9': {
    phak: 'Chapter 14: Airport Operations',
    topics: ['scanning technique: 10° segments, pause each area', 'high-wing aircraft: blind spots below; low-wing: above', 'midair collisions: most occur VFR, daylight, within 5 miles of airport', 'clearing turns before any maneuver', 'TCAS/TAS for collision avoidance', 'night flight: limits of human vision, use averted vision', 'sky vs ground contrast for aircraft spotting'],
  },
  'ppl-ch11-l10': {
    phak: 'Chapter 14: Airport Operations',
    topics: ['wingtip vortices: generated from main wing in flight', 'strongest: heavy, clean, slow aircraft (B-757 most hazardous)', 'vortices sink at 300-500 ft/min and move with wind', 'landing behind heavy: touchdown past rotation point', 'departure behind heavy: rotate before rotation point and climb above flightpath', 'in flight: stay above heavy jet flightpath', '2-minute wake turbulence separation minimum (3 min if departing)'],
  },

  // ─── CHAPTER 12: AIRSPACE ─────────────────────────────────────────────────
  'ppl-ch12-l1': {
    phak: 'Chapter 15: Airspace',
    cfr: '14 CFR Part 71, 91.155, 91.215',
    topics: ['Class A: 18,000-60,000 MSL, IFR only, ATC clearance required', 'Class B: major airports, 0-10,000 AGL, ATC clearance required, Mode C required within 30 NM', 'Class C: busy airports, two-ring structure, 2-way radio, Mode C required', 'Class D: smaller towered airports, 2-way radio required, up to 2,500 AGL', 'Class E: controlled airspace without ATC services, starts at 1,200 AGL (or 700 in transition areas)', 'Class G: uncontrolled, no radio required'],
  },
  'ppl-ch12-l2': {
    phak: 'Chapter 15: Airspace',
    topics: ['Prohibited: no flight by any aircraft (P-40, P-56 Washington DC)', 'Restricted: hazardous activities, permission from controlling agency', 'Warning: hazardous activities outside US territory (non-binding to US civilians)', 'MOA (Military Operations Area): high-speed/low-level military — not prohibited but avoid', 'Alert Area: high volume of training — not prohibited, extra caution', 'CFA (Controlled Firing Area): suspended when aircraft detected'],
  },
  'ppl-ch12-l3': {
    phak: 'Chapter 15: Airspace',
    aim: 'AIM Chapter 3',
    topics: ['TFR (Temporary Flight Restriction): disaster areas, VIP movements, space launches', 'ADIZ: Air Defense Identification Zone — coastal boundaries, flight plan required', 'SFRA: DC area SFRA within 30 NM, FRZ within 15 NM', 'VFR transition routes through Class B corridors', 'Parachute jump areas on sectional charts', 'Mode C Veil: transponder required within 30 NM of Class B primary airport'],
  },
  'ppl-ch12-l4': {
    phak: 'Chapter 15: Airspace',
    cfr: '14 CFR 91.215',
    topics: ['Class A: Mode C transponder required', 'Class B: Mode C within 30 NM of primary airport', 'Class C: Mode C transponder and 2-way radio required', 'Class D: 2-way radio required, no transponder requirement', 'Above 10,000 MSL (except below 2,500 AGL): Mode C required', 'Flying VFR on top requires same equipment as aircraft type'],
  },
  'ppl-ch12-l5': {
    phak: 'Chapter 15: Airspace',
    cfr: '14 CFR 91.155',
    topics: ['Class A: IFR only — no VFR minima', 'Class B: 3 SM vis, clear of clouds', 'Class C: 3 SM vis, 500 below / 1,000 above / 2,000 horizontal', 'Class D: 3 SM vis, 500 below / 1,000 above / 2,000 horizontal', 'Class E < 10,000: 3 SM vis, 500 below / 1,000 above / 2,000 horizontal', 'Class E at or above 10,000: 5 SM vis, 1,000 below / 1,000 above / 1 SM horizontal', 'Class G: day 1 SM vis clear of clouds (below 1,200 AGL)'],
  },
  'ppl-ch12-l6': {
    cfr: '14 CFR 91.157',
    topics: ['Special VFR requires: ATC clearance, 1 SM visibility, clear of clouds', 'Special VFR only within Class B, C, D, E surface areas', 'Night Special VFR: pilot must have instrument rating, aircraft must be IFR equipped', 'Student pilots cannot fly Special VFR', 'SVFR allows flight when basic VFR minimums not met', 'ATC must have lower IFR traffic to approve SVFR'],
  },
  'ppl-ch12-l7': {
    phak: 'Chapter 15: Airspace',
    aim: 'AIM 4-1-20',
    topics: ['1200: VFR flight (squawk continuously when VFR)', '7500: hijacking in progress', '7600: two-way radio communications failure', '7700: emergency (activates all ATC alerts)', 'discrete code: 4-digit code assigned by ATC for IFR/radar', 'Mode C: transponder with altitude encoding', 'IDENT: makes transponder return brighter on radar (use only when requested)'],
  },

  // ─── CHAPTER 13: NAVIGATION ───────────────────────────────────────────────
  'ppl-ch13-l1': {
    phak: 'Chapter 16: Navigation',
    figures: ['Figure 21 (Norfolk/Hampton Roads sectional area)', 'Figure 22 (Minot sectional area)', 'Figure 23 (Priest River sectional area)'],
    topics: ['sectional charts: 1:500,000 scale, updated every 6 months', 'airport symbols: magenta = non-towered, blue = towered', 'control tower frequency in blue box', 'airspace depiction: solid blue = Class B, solid magenta = Class C, dashed blue = Class D', 'obstacles: depicted with altitude MSL and AGL', 'VOR shown as compass rose and symbol', 'reading sectional symbols from legend'],
  },
  'ppl-ch13-l2': {
    phak: 'Chapter 16: Navigation',
    topics: ['meridians: north-south lines of longitude', 'parallels: east-west lines of latitude', '1 degree latitude = 60 nautical miles', '1 minute latitude = 1 nautical mile', 'longitude varies with latitude (converges at poles)', 'sectional chart latitude/longitude grid', 'dead reckoning using lat/long coordinates'],
  },
  'ppl-ch13-l3': {
    phak: 'Chapter 16: Navigation',
    topics: ['true course: measured from true north', 'variation (isogonic lines): east variation = subtract, west variation = add', 'magnetic course = true course ± variation', 'magnetic heading = magnetic course ± wind correction angle', 'compass heading = magnetic heading ± deviation', 'memory: TVMDC (True Virgins Make Dull Companions)', 'E3B flight computer: wind correction triangle'],
  },
  'ppl-ch13-l4': {
    phak: 'Chapter 16: Navigation',
    topics: ['E3B (circular slide rule): wind side and calculator side', 'setting up wind triangle: TC, wind direction/speed, TAS', 'solving for groundspeed and wind correction angle (WCA)', 'steps: set TC under index, mark wind dot, rotate until wind dot aligns, read GS and WCA', 'pilotage: navigation by landmarks', 'dead reckoning: navigation by calculated position'],
  },
  'ppl-ch13-l5': {
    phak: 'Chapter 16: Navigation',
    topics: ['ETE = distance ÷ groundspeed (in hours)', 'ETE example: 120 NM at 90 KGS = 1h 20min', 'time-speed-distance wheel on E3B', 'converting time: minutes to decimal (30 min = 0.5 hr)', 'fuel remaining check at checkpoints', 'ETA = departure time + ETE', 'fuel burn = fuel flow × time (gallons/hour × hours)'],
  },
  'ppl-ch13-l6': {
    phak: 'Chapter 16: Navigation',
    cfr: '14 CFR 91.151',
    topics: ['VFR day: enough fuel to destination plus 30 minutes at normal cruise', 'VFR night: enough fuel to destination plus 45 minutes', 'fuel consumption calculation: GPH × time = gallons needed', 'fuel density: Avgas 6 lb/gal', 'unusable fuel must be subtracted from total', 'fuel consumption at cruise typically 8-12 GPH for trainer'],
  },
  'ppl-ch13-l7': {
    cfr: '14 CFR 91.159',
    topics: ['VFR cruising altitudes apply above 3,000 AGL', 'magnetic course 0-179°: odd thousands + 500 (3,500 / 5,500 / 7,500)', 'magnetic course 180-359°: even thousands + 500 (4,500 / 6,500 / 8,500)', 'memory: EAST = ODD, WEST = EVEN', '+500 ft to provide 500 ft separation from opposite traffic', 'does not apply below 3,000 AGL or in Class A (FL180+)'],
  },
  'ppl-ch13-l8': {
    phak: 'Chapter 16: Navigation',
    figures: ['Figure 29 (VOR CDI indicator)'],
    topics: ['VOR: very high frequency omnidirectional range', 'CDI (course deviation indicator): needle shows relationship to selected radial', 'TO/FROM flag: TO = heading TO station, FROM = heading FROM station', 'OBS: omnibearing selector — sets radial on CDI', 'cone of silence: directly overhead the VOR, unreliable', 'radial: magnetic course FROM the VOR station', 'tracking: center needle, fly heading toward CDI deflection'],
  },
  'ppl-ch13-l9': {
    phak: 'Chapter 16: Navigation',
    aim: 'AIM 5-1-4',
    topics: ['VFR flight plan: filed with FSS (1-800-WX-BRIEF)', 'flight plan fields: aircraft type, equipment suffix, departure/destination, route, altitude, fuel on board, persons aboard', 'activate flight plan: contact FSS after takeoff', 'close flight plan: contact FSS or arrival airport FSS within 30 min', 'overdue aircraft SAR begins 30 minutes after ETA if plan not closed', 'DVFR flight plan required in ADIZ'],
  },

  // ─── CHAPTER 14: AEROMEDICAL FACTORS ─────────────────────────────────────
  'ppl-ch14-l1': {
    phak: 'Chapter 17: Aeromedical Factors',
    topics: ['night vision: rod cells for low light, cone cells for color/detail', 'dark adaptation: full adaptation 30 min (avoid bright light)', 'empty field myopia: eyes focus at 6-9 ft in featureless sky — look for objects to focus on', 'motion sickness: inner ear — keep head still, fix on horizon', 'middle ear equalization: Valsalva maneuver', 'fatigue: reduce mental performance and vigilance'],
  },
  'ppl-ch14-l2': {
    phak: 'Chapter 17: Aeromedical Factors',
    topics: ['leans: rolling maneuver at sub-threshold rate — trust instruments', 'graveyard spiral: gradual spiral mistaken for level flight', 'coriolis illusion: head movement in prolonged turn', 'somatogravic illusion: rapid acceleration feels like pitch up — pushes nose down', 'elevator illusion: updraft feels like climb', 'solution: always trust flight instruments over sensations', 'visual scanning: cross-check attitude indicator frequently'],
  },
  'ppl-ch14-l3': {
    cfr: '14 CFR 91.17',
    topics: ['8 hours bottle to throttle minimum', '0.04% BAC maximum (about 2 drinks)', 'no flight within 8 hours AND while under influence', 'medications: avoid all prescription and OTC drugs without AME approval', 'common problematic drugs: antihistamines, tranquilizers, amphetamines, muscle relaxers', 'I\'M SAFE checklist: Illness, Medication, Stress, Alcohol, Fatigue, Emotion'],
  },
  'ppl-ch14-l4': {
    phak: 'Chapter 17: Aeromedical Factors',
    topics: ['hypoxia types: hypoxic (low O2), hypemic (CO poisoning/anemia), stagnant (circulatory), histotoxic (alcohol/drugs)', 'time of useful consciousness (TUC): 30,000 ft = ~1 min, 25,000 = ~3 min, 20,000 = ~5-12 min', 'FAA requirement: supplemental O2 above 12,500 MSL > 30 min', 'above 14,000 MSL: O2 required for crew at all times', 'above 15,000 MSL: O2 must be available for passengers', 'symptoms: headache, drowsiness, euphoria, impaired judgement'],
  },

  // ─── CHAPTER 15: REGULATIONS ──────────────────────────────────────────────
  'ppl-ch15-l1': {
    cfr: '14 CFR 91.3',
    topics: ['PIC is final authority for safe operation of aircraft', 'PIC may deviate from any rule to meet emergency', 'PIC must send written report if requested by FAA after emergency deviation', 'PIC is responsible for preflight inspection', 'in-flight emergency: declare Mayday, squawk 7700', 'PIC determines aircraft airworthiness before flight'],
  },
  'ppl-ch15-l2': {
    cfr: '14 CFR 91.119',
    topics: ['congested areas: 1,000 ft above highest obstacle within 2,000 ft horizontal radius', 'non-congested: 500 ft above surface (except over people, vessels, vehicles)', 'open water and sparsely populated areas: not below 500 ft from people/property', 'no altitude restrictions directly apply over open water outside congested/non-congested', 'helicopters: different (more flexible) altitude rules under 91.119', 'congested area example: cities, towns, settlements'],
  },
  'ppl-ch15-l3': {
    cfr: '14 CFR 91.117',
    topics: ['below 10,000 MSL: 250 KIAS maximum', 'within Class C or D airspace: 200 KIAS maximum', 'within 4 NM and 2,500 AGL of Class C or D primary airport: 200 KIAS', 'in VFR corridor through Class B: 200 KIAS maximum', 'above 10,000 MSL: no airspeed limit under FAR 91', 'speed limits apply to indicated airspeed (KIAS)'],
  },
  'ppl-ch15-l4': {
    cfr: '14 CFR 91.303',
    topics: ['aerobatic flight prohibited: over congested area, over open air assembly of people, within Class B/C/D/E surface area, within 4 NM of federal airway centerline, below 1,500 AGL, when flight visibility less than 3 SM', 'aerobatics definition: maneuver involving abrupt change in altitude/attitude or abnormal acceleration', 'parachute not required if within Normal category limits', 'aerobatic box: designated area specifically for aerobatics'],
  },
  'ppl-ch15-l5': {
    cfr: '14 CFR 91.205, 61.57',
    topics: ['night VFR equipment required (FLAPS): Fuses, Landing light (for hire), Anti-collision, Position lights, Spare fuses', 'night: 1 hour after sunset to 1 hour before sunrise', 'night currency: 3 takeoffs and landings to full stop in 90 days at night in same category/class/type', 'required position lights: red left wing, green right wing, white tail', 'anti-collision light: rotating beacon or strobe lights'],
  },
  'ppl-ch15-l6': {
    cfr: '49 CFR Part 830',
    topics: ['immediately notify nearest NTSB field office of accident', 'accident: death, serious injury, or substantial aircraft damage', 'incident: less severe occurrence affecting safety', 'preserve wreckage for 48 hours after notification (unless moved for safety)', 'written report within 10 days of accident', 'report: immediately for fatal/serious injury, within 7 days otherwise'],
  },

  // ─── CHAPTER 16: PILOT QUALIFICATION ─────────────────────────────────────
  'ppl-ch16-l1': {
    cfr: '14 CFR Part 61',
    topics: ['aircraft category: airplane, rotorcraft, glider, lighter-than-air, powered lift, powered parachute, weight shift control', 'aircraft class (airplane): ASEL (single-engine land), AMEL (multi-engine land), ASES (single-engine sea)', 'type rating required: large aircraft (>12,500 lbs), turbojet, special types', 'certificate levels: student, sport, recreational, private, commercial, ATP', 'CFI: flight instructor certificate separate from pilot cert'],
  },
  'ppl-ch16-l2': {
    cfr: '14 CFR 61.3',
    topics: ['must carry: valid pilot certificate, valid medical (if required), government-issued photo ID', 'all three documents required when operating as PIC or required crewmember', 'certificate must not be altered', 'BasicMed alternative to 3rd class medical for certain operations', 'student pilot certificate does not expire (issued after April 2016)', 'biennial/annual review documentation'],
  },
  'ppl-ch16-l3': {
    cfr: '14 CFR Part 67',
    topics: ['1st class medical: ATP, commercial operations; valid 12 months (under 40), 6 months (40+)', '2nd class medical: commercial pilot; valid 12 months', '3rd class medical: private/student/recreational; valid 60 months (under 40), 24 months (40+)', 'BasicMed: valid 48 months, requires AOPA medical course every 24 months', 'disqualifying conditions: heart disease, psychosis, epilepsy, substance dependence', 'special issuance for many conditions possible'],
  },
  'ppl-ch16-l4': {
    cfr: '14 CFR 61.31',
    topics: ['complex aircraft (retractable gear, controllable prop, flaps): requires endorsement + training', 'high performance aircraft (>200 HP engine): requires endorsement + training', 'pressurized aircraft (cabin altitude above 25,000): requires endorsement', 'tailwheel aircraft: requires endorsement (no solo without)', 'high altitude operations: requires training above 25,000 MSL', 'instructor endorsements recorded in logbook with date'],
  },
  'ppl-ch16-l5': {
    cfr: '14 CFR 61.89, 61.113',
    topics: ['private pilot: can carry passengers, can fly in pursuit of profession, CANNOT fly for hire/compensation', 'student pilot: solo only with instructor endorsement for specific aircraft/area', 'private pilot must have 40 total hours: 20 dual, 10 solo, 5 solo cross-country', 'solo cross-country: specific requirements for endorsement', 'cross-country definition: landing more than 50 NM from departure airport', 'private pilot can split costs with passengers (pro-rata share)'],
  },
  'ppl-ch16-l6': {
    cfr: '14 CFR 61.56, 61.57',
    topics: ['flight review (BFR): every 24 calendar months — 1 hour ground + 1 hour flight minimum', 'flight review does NOT expire — it resets the clock', 'currency for carrying passengers: 3 takeoffs and 3 landings in 90 days in same category/class/type', 'night currency (passengers at night): 3 full-stop night T&Ls in 90 days', 'instrument currency: 6 approaches, holds, intercepting/tracking in 6 months', 'logbook endorsement for BFR satisfactory completion'],
  },

  // ─── CHAPTER 17: MISCELLANEOUS ────────────────────────────────────────────
  'ppl-ch17-l1': {
    phak: 'Chapters 1-2: Introduction and Human Factors',
    topics: ['5 hazardous attitudes: Antiauthority ("don\'t tell me"), Impulsivity ("act now"), Invulnerability ("not me"), Macho ("I can do it"), Resignation ("what\'s the use")', 'antidotes for each attitude', 'IMSAFE checklist: Illness, Medication, Stress, Alcohol, Fatigue, Emotion', 'PAVE checklist: Pilot, Aircraft, enVironment, External pressures', '3-P model: Perceive-Process-Perform', 'Crew Resource Management (CRM) even for single-pilot ops'],
  },
  'ppl-ch17-l2': {
    topics: ['PHAK (FAA-H-8083-25): aerodynamics, systems, weather, navigation', 'AFH (FAA-H-8083-3): flight maneuvers, techniques', 'AIM (Aeronautical Information Manual): procedures and airspace', 'FAR/AIM: combined regulations and AIM', 'AC (Advisory Circular): supplemental guidance, not regulatory', 'Chart Supplement (AFD): airport information', 'NOTAMs: time-critical airport and airspace information'],
  },
  'ppl-ch17-l3': {
    afh: 'Chapters 3-9: Basic Maneuvers',
    topics: ['steep turns: bank angles > 45°, use back pressure to maintain altitude', 'slow flight: full flaps, near stall, high AOA — develop control feel', 'power-off stall: throttle idle, clean configuration', 'power-on stall: full power, simulate takeoff stall', 'emergency descent: maximum structural speed', 'forced landing: best glide, squawk 7700, checklist'],
  },
};

/**
 * Returns topic metadata for a lesson, or a generic fallback.
 */
export function getLessonTopics(lessonId) {
  return LESSON_TOPICS[lessonId] || null;
}
