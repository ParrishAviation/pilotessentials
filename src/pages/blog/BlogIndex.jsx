import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { BlogLayout, BottomCTA, prose } from '../../components/BlogLayout';

const posts = [
  {
    slug: '/faa-written-test-prep',
    title: 'FAA Written Test Prep: Pass the Knowledge Test First Time',
    excerpt: 'Complete FAA written test prep guide. Study strategies, exam format, topic breakdown, and the fastest way to pass your FAA knowledge test first attempt.',
    tags: ['FAA Written Test', 'Ground School'],
    readTime: '10 min',
    featured: true,
  },
  {
    slug: '/private-pilot-written-test-prep',
    title: 'Private Pilot Written Test Prep: Pass the PAR in 30 Days',
    excerpt: 'Complete 30-day study plan for the Private Pilot Airman Knowledge Test (PAR). Topic breakdown, high-yield areas, common mistakes, and how to register.',
    tags: ['Private Pilot', 'PAR Exam'],
    readTime: '12 min',
  },
  {
    slug: '/how-to-pass-faa-written-test',
    title: 'How to Pass the FAA Written Test: Strategy, Plan & Tips',
    excerpt: 'A proven study strategy, 30-day schedule, the 10 most common mistakes that cause failures, and what to do on test day to maximize your score.',
    tags: ['Study Strategy', 'FAA Tips'],
    readTime: '13 min',
  },
  {
    slug: '/faa-written-practice-tests',
    title: 'FAA Written Test Practice: Free Exam-Style Questions',
    excerpt: 'Free FAA practice questions in real exam format across aerodynamics, weather, regulations, navigation, and airspace — with detailed explanations.',
    tags: ['Practice Questions', 'Free Resource'],
    readTime: '15 min',
  },
  {
    slug: '/faa-written-test-questions',
    title: 'FAA Written Test Questions by Topic: Real Q&A with Explanations',
    excerpt: 'FAA-style questions organized by topic — weather, aerodynamics, regulations, and weight & balance — with thorough concept-based explanations.',
    tags: ['Q&A', 'Topic Review'],
    readTime: '20 min',
  },
  {
    slug: '/faa-written-test-cost',
    title: 'FAA Written Test Cost, Registration & What to Expect',
    excerpt: 'How much does the FAA written test cost? Everything about test fees ($175–$200), how to register at CATS or PSI, what to bring, and post-test steps.',
    tags: ['Test Process', 'Logistics'],
    readTime: '9 min',
  },
  {
    slug: '/instrument-rating-written-test-prep',
    title: 'Instrument Rating Written Test Prep: Master IFR, Pass IRA First Attempt',
    excerpt: 'The IRA is the hardest FAA knowledge test. Master en route charts, approach plates, holding patterns, and alternate requirements with this complete IFR guide.',
    tags: ['Instrument Rating', 'IRA Exam'],
    readTime: '11 min',
  },
  {
    slug: '/commercial-pilot-written-test-prep',
    title: 'Commercial Pilot Written Test Prep: Pass Your CAX Exam',
    excerpt: 'Launch your aviation career. Complete guide to the Commercial Pilot knowledge test — advanced aerodynamics, Part 135, pressurization, and 6-week study plan.',
    tags: ['Commercial Pilot', 'CAX Exam'],
    readTime: '10 min',
  },
  {
    slug: '/cfi-written-test-prep',
    title: 'CFI Written Test Prep: Pass FOI + FIA Without Memorization',
    excerpt: 'Prepare for both CFI written tests (FOI and FIA) with concept-based study. Laws of learning, teaching methods, FIA topic breakdown, and 6-week timeline.',
    tags: ['CFI Certificate', 'FOI + FIA'],
    readTime: '11 min',
  },
  {
    slug: '/faa-written-test-prep-texas',
    title: 'FAA Written Test Prep for Texas Pilots: Study Online, Test Locally',
    excerpt: 'Texas student pilots: find testing centers in Dallas, Houston, Austin, and more. Understand Texas weather for the exam, and start your online ground school.',
    tags: ['Texas', 'Local Guide'],
    readTime: '10 min',
  },
];

export default function BlogIndex() {
  const navigate = useNavigate();
  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => !p.featured);

  return (
    <BlogLayout
      title="Pilot Essentials Blog — FAA Test Prep, Ground School Tips & Aviation Knowledge"
      description="Free aviation resources from Pilot Essentials. FAA written test prep guides, practice questions, study strategies, and ground school tips for student pilots."
      slug="/blog"
    >
      {/* Header */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', ...prose.tag, fontSize: 13, marginBottom: 16 }}>
          ✈️ Pilot Essentials Blog
        </div>
        <h1 style={{ ...prose.h1, textAlign: 'center' }}>
          FAA Written Test Prep<br />Resources & Guides
        </h1>
        <p style={{ ...prose.p, maxWidth: 600, margin: '0 auto', fontSize: 17, color: '#cbd5e1' }}>
          Free guides, practice questions, and study strategies from Pilot Essentials —
          helping student pilots pass their FAA knowledge tests on the first attempt.
        </p>
      </div>

      <hr style={prose.divider} />

      {/* Featured post */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}
        >
          <p style={{ color: '#38bdf8', fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>
            FEATURED GUIDE
          </p>
          <div
            onClick={() => navigate(featured.slug)}
            style={{
              background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(37,99,235,0.08))',
              border: '1px solid rgba(56,189,248,0.25)',
              borderRadius: 16, padding: '32px 28px', cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(14,165,233,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              {featured.tags.map(t => <span key={t} style={prose.tag}>{t}</span>)}
              <span style={{ color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> {featured.readTime}
              </span>
            </div>
            <h2 style={{ ...prose.h2, marginTop: 0, fontSize: 24 }}>{featured.title}</h2>
            <p style={prose.p}>{featured.excerpt}</p>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              Read Full Guide <ArrowRight size={14} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Post grid */}
      <h2 style={{ ...prose.h2, marginTop: 0 }}>All Aviation Guides</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {rest.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            onClick={() => navigate(post.slug)}
            style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '22px 20px', cursor: 'pointer',
              transition: 'transform 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'rgba(56,189,248,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
            }}
          >
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              {post.tags.slice(0, 1).map(t => <span key={t} style={{ ...prose.tag, fontSize: 11 }}>{t}</span>)}
              <span style={{ color: '#475569', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                <Clock size={11} /> {post.readTime}
              </span>
            </div>
            <h3 style={{ ...prose.h3, marginTop: 0, marginBottom: 10, fontSize: 16, lineHeight: 1.4 }}>
              {post.title}
            </h3>
            <p style={{ ...prose.p, fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>{post.excerpt}</p>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
              Read guide <ArrowRight size={12} />
            </div>
          </motion.div>
        ))}
      </div>

      <BottomCTA
        headline="Ready to Start? Get the Complete Ground School"
        sub="All 17 chapters, AI study guides, and 1,000+ practice questions — everything you need to pass your FAA written test. Start free today."
      />
    </BlogLayout>
  );
}
