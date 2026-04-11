import AdLandingTemplate from './AdLandingTemplate';

export default function AdPage1() {
  return (
    <AdLandingTemplate
      heroTag="FAA Written Exam Prep"
      headline={<>Pass your FAA written exam —<br />or we coach you until you do.</>}
      subheadline="17 structured chapters, an AI flight instructor available 24/7, and 1,000+ practice questions pulled straight from the FAA question bank. Built for student pilots who want to pass the first time — and backed by a personal coaching guarantee if they don't."
      guaranteeCopy="Pass guarantee included. Complete the course and don't pass? We coach you 1-on-1 until you do — at no extra charge."
    />
  );
}
