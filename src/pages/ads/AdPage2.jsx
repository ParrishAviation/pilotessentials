import AdLandingTemplate from './AdLandingTemplate';

export default function AdPage2() {
  return (
    <AdLandingTemplate
      heroTag="The Only Guarantee That Matters"
      headline={<>We guarantee you pass.<br />Not "probably." Not "most students." <span style={{ color: '#38bdf8' }}>You.</span></>}
      subheadline="Every other course throws statistics at you. We make a personal commitment — complete Pilot Essentials and if you don't pass your FAA written, we work with you one-on-one until you do. No asterisks. No expiration date. You."
      guaranteeCopy="A guarantee that names you, not a statistic. Your pass. Your timeline. Our commitment."
    />
  );
}
