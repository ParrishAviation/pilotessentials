import AdLandingTemplate from './AdLandingTemplate';

export default function AdPage4() {
  return (
    <AdLandingTemplate
      heroTag="Pass Guaranteed · 1-on-1 Coaching Included"
      headline={<>Pass the FAA Written —<br /><span style={{ color: '#38bdf8' }}>Guaranteed.</span></>}
      subheadline="Enroll today and get instant access to 17 structured chapters, an AI flight instructor, 1,000+ practice questions, and ACS checkride prep. And if you complete the course and still don't pass — we do 1-on-1 coaching with you until you do."
      guaranteeCopy="1-on-1 coaching included if you don't pass. No time limits. No extra fees. Enroll and we're with you until you're done."
    />
  );
}
