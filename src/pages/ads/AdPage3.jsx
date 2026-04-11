import AdLandingTemplate from './AdLandingTemplate';

export default function AdPage3() {
  return (
    <AdLandingTemplate
      heroTag="Ground School Built Different"
      headline={<>Other courses hope you pass.<br /><span style={{ color: '#38bdf8' }}>We make sure you do.</span></>}
      subheadline="Most ground school programs give you videos and wish you luck. Pilot Essentials gives you an AI instructor who answers your questions, study guides for every lesson, 1,000+ practice questions, and a personal coaching guarantee. There's a difference between hoping and making sure."
      guaranteeCopy="Not hope. Not probably. A real guarantee — we coach you 1-on-1 until you pass, included with every enrollment."
    />
  );
}
