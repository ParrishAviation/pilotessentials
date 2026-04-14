import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Zap, AlertTriangle, TrendingUp, Users, CheckCircle, XCircle,
  RefreshCw, ChevronDown, ChevronUp, BarChart2, Target, DollarSign,
  BookOpen, Activity, Clock, Star, ArrowRight, Shield, Eye, EyeOff,
  MessageSquare, Award, Loader2, Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAILS = ['jack@parrishaviation.com', 'titiusmclaughlin@gmail.com'];

const CATEGORY_META = {
  errors:     { label: 'Critical Errors',       icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.2)',   emoji: '🚨' },
  learning:   { label: 'Learning Optimization', icon: BookOpen,      color: '#38bdf8', bg: 'rgba(56,189,248,0.08)',   border: 'rgba(56,189,248,0.2)',  emoji: '📚' },
  engagement: { label: 'Engagement & Retention',icon: Users,         color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', emoji: '🎯' },
  revenue:    { label: 'Revenue & Growth',       icon: DollarSign,    color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  emoji: '💰' },
};

const PRIORITY_META = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'CRITICAL' },
  high:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'HIGH' },
  medium:   { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)',  label: 'MEDIUM' },
  low:      { color: '#475569', bg: 'rgba(71,85,105,0.15)',  label: 'LOW' },
};

function StatCard({ icon: Icon, label, value, sub, color = '#38bdf8', trend }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} color={color} />
        </div>
        {trend !== undefined && (
          <span style={{ fontSize: 11, fontWeight: 700, color: trend >= 0 ? '#4ade80' : '#f87171' }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function RecommendationCard({ rec, onAccept, onReject, onResolve }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const cat = CATEGORY_META[rec.category] || CATEGORY_META.learning;
  const pri = PRIORITY_META[rec.priority] || PRIORITY_META.medium;
  const recStatus = rec.status || 'open';
  const isOpen = recStatus === 'open';

  async function act(action) {
    setLoading(true);
    if (action === 'accept') await onAccept(rec.id);
    if (action === 'reject') await onReject(rec.id);
    if (action === 'resolve') await onResolve(rec.id);
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: cat.bg,
        border: `1px solid ${cat.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        opacity: recStatus !== 'open' ? 0.6 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {/* Header */}
      <div
        style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12 }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{cat.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: pri.color, background: pri.bg, padding: '2px 7px', borderRadius: 4, letterSpacing: 0.5 }}>
              {pri.label}
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: cat.color, background: `${cat.color}15`, padding: '2px 7px', borderRadius: 4 }}>
              {cat.label}
            </span>
            {recStatus !== 'open' && (
              <span style={{ fontSize: 10, fontWeight: 700, color: recStatus === 'resolved' ? '#4ade80' : recStatus === 'accepted' ? '#38bdf8' : '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: 4 }}>
                {recStatus.toUpperCase()}
              </span>
            )}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.35 }}>{rec.title}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: cat.color }}>{rec.impact_score}</div>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 600 }}>IMPACT</div>
          </div>
          {expanded ? <ChevronUp size={14} color="#475569" /> : <ChevronDown size={14} color="#475569" />}
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 18px 16px', borderTop: `1px solid ${cat.border}` }}>
              {/* Description */}
              <div style={{ paddingTop: 14, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>What We Found</div>
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>{rec.description}</p>
              </div>

              {/* Recommended Action */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: cat.color, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ArrowRight size={11} /> Recommended Action
                </div>
                <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{rec.action}</p>
              </div>

              {/* Action buttons */}
              {isOpen && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => act('accept')}
                    disabled={loading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                      background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)',
                      color: '#38bdf8', fontSize: 12, fontWeight: 700,
                    }}
                  >
                    <CheckCircle size={12} /> Accept & Track
                  </button>
                  <button
                    onClick={() => act('resolve')}
                    disabled={loading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                      background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)',
                      color: '#4ade80', fontSize: 12, fontWeight: 700,
                    }}
                  >
                    <CheckCircle size={12} /> Mark Resolved
                  </button>
                  <button
                    onClick={() => act('reject')}
                    disabled={loading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                      color: '#f87171', fontSize: 12, fontWeight: 700,
                    }}
                  >
                    <XCircle size={12} /> Dismiss
                  </button>
                </div>
              )}
              {!isOpen && rec.admin_note && (
                <p style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', margin: 0 }}>Note: {rec.admin_note}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AICommandCenter() {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const isAdmin = ADMIN_EMAILS.includes(authUser?.email);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate('/app'); return; }
    loadRecommendations(false);
  }, [isAdmin]);

  async function loadRecommendations(forceRefresh = false) {
    forceRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai-command-center', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: authUser?.email, forceRefresh }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setRecommendations(data.recommendations || []);
      setInsights(data.insights || null);
      setGeneratedAt(data.generatedAt);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from('ai_recommendations')
      .update({ status, resolved_at: status === 'resolved' ? new Date().toISOString() : null })
      .eq('id', id);
    if (!error) {
      setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    }
  }

  // Treat missing status as 'open' (fresh from Claude before DB save)
  const getStatus = (r) => r.status || 'open';

  const visibleRecs = recommendations.filter(r => {
    const s = getStatus(r);
    if (!showResolved && (s === 'rejected' || s === 'resolved')) return false;
    if (activeFilter !== 'all' && r.category !== activeFilter) return false;
    return true;
  });

  const criticalCount = recommendations.filter(r => r.priority === 'critical' && getStatus(r) === 'open').length;
  const openCount = recommendations.filter(r => getStatus(r) === 'open').length;
  const resolvedCount = recommendations.filter(r => getStatus(r) === 'resolved').length;

  const catCounts = {};
  recommendations.filter(r => getStatus(r) === 'open').forEach(r => {
    catCounts[r.category] = (catCounts[r.category] || 0) + 1;
  });

  if (!isAdmin) return null;

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13,
              background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(56,189,248,0.2))',
              border: '1px solid rgba(167,139,250,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(167,139,250,0.2)',
            }}>
              <Brain size={22} color="#a78bfa" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                AI Command Center
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                Ever-Learning Intelligence Engine · Powered by Claude
              </p>
            </div>
          </div>
          {generatedAt && (
            <div style={{ fontSize: 11, color: '#334155', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={11} />
              Last analyzed: {new Date(generatedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          )}
        </div>

        <button
          onClick={() => loadRecommendations(true)}
          disabled={refreshing || loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10, cursor: refreshing || loading ? 'default' : 'pointer',
            background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
            color: '#a78bfa', fontSize: 13, fontWeight: 700,
            opacity: refreshing || loading ? 0.6 : 1,
          }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          {refreshing ? 'Analyzing...' : 'Re-Analyze Now'}
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>🧠</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
            <Loader2 size={18} color="#a78bfa" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Analyzing platform data...</span>
          </div>
          <p style={{ color: '#475569', fontSize: 13 }}>Claude is reviewing student behavior, quiz performance, and engagement patterns</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={16} color="#ef4444" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f87171' }}>Analysis Error</span>
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{error}</p>
          {error.includes('SUPABASE_SERVICE_ROLE_KEY') && (
            <p style={{ fontSize: 12, color: '#64748b', margin: '8px 0 0' }}>
              Make sure SUPABASE_SERVICE_ROLE_KEY is set in your Vercel environment variables.
            </p>
          )}
        </div>
      )}

      {!loading && !error && recommendations.length > 0 && (
        <>
          {/* Alert banner for critical issues */}
          {criticalCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)',
                borderRadius: 14, padding: '14px 20px', marginBottom: 24,
                display: 'flex', alignItems: 'center', gap: 12,
              }}
            >
              <div style={{ fontSize: 22 }}>🚨</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fca5a5' }}>
                  {criticalCount} Critical Issue{criticalCount > 1 ? 's' : ''} Require Immediate Attention
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>These issues are impacting student learning or platform accuracy right now.</div>
              </div>
            </motion.div>
          )}

          {/* Stats row */}
          {insights && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
              <StatCard icon={Users} label="Total Students" value={insights.totalStudents} color="#38bdf8" />
              <StatCard icon={BookOpen} label="Lesson Completions" value={insights.totalLessonCompletions?.toLocaleString()} color="#a78bfa" />
              <StatCard icon={Target} label="Quiz Attempts" value={insights.totalQuizAttempts?.toLocaleString()} color="#818cf8" />
              <StatCard icon={DollarSign} label="Total Revenue" value={`$${Math.round(insights.totalRevenue || 0).toLocaleString()}`} color="#f59e0b" />
              <StatCard icon={AlertTriangle} label="At-Risk Students" value={insights.atRiskCount} sub="No activity 7+ days" color="#ef4444" />
              <StatCard icon={Activity} label="Avg Streak" value={`${insights.avgStreak}d`} sub={`${insights.zeroStreakStudents} at 0 days`} color="#4ade80" />
              <StatCard icon={TrendingUp} label="Conversion Rate" value={`${insights.conversionRate}%`} sub="Free → Paid" color="#f59e0b" />
              <StatCard icon={MessageSquare} label="Open Tickets" value={insights.openTickets} color="#94a3b8" />
            </div>
          )}

          {/* Summary bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
            padding: '12px 16px', background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
              {openCount} open · {resolvedCount} resolved
            </span>
            <div style={{ flex: 1 }} />
            <button
              onClick={() => setShowResolved(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 12, fontWeight: 600 }}
            >
              {showResolved ? <EyeOff size={13} /> : <Eye size={13} />}
              {showResolved ? 'Hide resolved' : 'Show resolved'}
            </button>
          </div>

          {/* Category filter tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {[{ key: 'all', label: 'All', color: '#94a3b8' }, ...Object.entries(CATEGORY_META).map(([k, v]) => ({ key: k, label: v.label, color: v.color }))].map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  background: activeFilter === f.key ? `${f.color}20` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${activeFilter === f.key ? `${f.color}50` : 'rgba(255,255,255,0.07)'}`,
                  color: activeFilter === f.key ? f.color : '#475569',
                  transition: 'all 0.15s',
                }}
              >
                {f.label}
                {f.key !== 'all' && catCounts[f.key] ? (
                  <span style={{ marginLeft: 6, background: `${f.color}25`, color: f.color, padding: '1px 6px', borderRadius: 10, fontSize: 10, fontWeight: 800 }}>
                    {catCounts[f.key]}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {/* Recommendations grid */}
          {['errors', 'learning', 'engagement', 'revenue'].map(cat => {
            if (activeFilter !== 'all' && activeFilter !== cat) return null;
            const catRecs = visibleRecs.filter(r => r.category === cat);
            if (catRecs.length === 0) return null;
            const meta = CATEGORY_META[cat];
            const CatIcon = meta.icon;

            return (
              <div key={cat} style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: meta.bg, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CatIcon size={15} color={meta.color} />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#e2e8f0' }}>{meta.label}</span>
                  <span style={{ fontSize: 11, color: meta.color, background: meta.bg, padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>{catRecs.length} recommendation{catRecs.length !== 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {catRecs
                    .sort((a, b) => (b.impact_score || 0) - (a.impact_score || 0))
                    .map(rec => (
                      <RecommendationCard
                        key={rec.id || rec.title}
                        rec={rec}
                        onAccept={id => updateStatus(id, 'accepted')}
                        onReject={id => updateStatus(id, 'rejected')}
                        onResolve={id => updateStatus(id, 'resolved')}
                      />
                    ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🧠</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Ready to Analyze</h3>
          <p style={{ color: '#475569', fontSize: 14, marginBottom: 24 }}>
            Click "Re-Analyze Now" to generate AI-powered recommendations based on your platform data.
          </p>
          <button
            onClick={() => loadRecommendations(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 12, cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(56,189,248,0.2))',
              border: '1px solid rgba(167,139,250,0.4)',
              color: '#a78bfa', fontSize: 14, fontWeight: 700,
            }}
          >
            <Brain size={16} /> Run First Analysis
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
