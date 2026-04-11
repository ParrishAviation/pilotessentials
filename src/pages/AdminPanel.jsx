import { useState, useEffect, useRef, useCallback } from 'react';
import * as tus from 'tus-js-client';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Upload, CheckCircle, Trash2, Play, ChevronDown, ChevronRight,
  Video, AlertCircle, Loader2, RefreshCw, ArrowLeft, Film, FolderOpen,
  CloudUpload, X, Eye, Link, ExternalLink, BookOpen, Edit3, Save, Plus, RotateCcw
} from 'lucide-react';
import { COURSES, QUIZ_BANK } from '../data/courses';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const ADMIN_EMAILS = ['jack@parrishaviation.com', 'titiusmclaughlin@gmail.com'];
const BUCKET = 'course-videos';

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(secs) {
  if (!secs) return '';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function UploadZone({ onFile, uploading, uploadProgress, disabled }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  return (
    <div
      onClick={() => !disabled && !uploading && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        border: `2px dashed ${dragging ? '#38bdf8' : 'rgba(255,255,255,0.15)'}`,
        borderRadius: 16,
        padding: '48px 32px',
        textAlign: 'center',
        cursor: disabled || uploading ? 'default' : 'pointer',
        background: dragging ? 'rgba(56,189,248,0.06)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={e => e.target.files[0] && onFile(e.target.files[0])}
      />

      {uploading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle
                cx="32" cy="32" r="28" fill="none" stroke="#38bdf8" strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - uploadProgress / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.3s' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#38bdf8'
            }}>
              {uploadProgress}%
            </div>
          </div>
          <div style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600 }}>Uploading video…</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'rgba(56,189,248,0.1)',
            border: '1px solid rgba(56,189,248,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CloudUpload size={28} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
              {disabled ? 'Select a lesson first' : 'Drop video here or click to browse'}
            </div>
            <div style={{ fontSize: 13, color: '#475569' }}>
              MP4, MOV, WebM — any video format supported
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VideoPreview({ url, onDelete, lessonTitle }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div style={{
      borderRadius: 14,
      overflow: 'hidden',
      border: '1px solid rgba(34,197,94,0.2)',
      background: 'rgba(34,197,94,0.04)',
    }}>
      <video
        src={url}
        controls
        style={{ width: '100%', display: 'block', maxHeight: 280, background: '#000' }}
      />
      <div style={{
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={14} color="#4ade80" />
          <span style={{ fontSize: 13, color: '#4ade80', fontWeight: 600 }}>
            Video uploaded for "{lessonTitle}"
          </span>
        </div>
        {showConfirm ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#f87171', alignSelf: 'center' }}>Remove?</span>
            <button
              onClick={onDelete}
              style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', cursor: 'pointer',
              }}
            >Yes</button>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 12,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8', cursor: 'pointer',
              }}
            >Cancel</button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171', cursor: 'pointer',
            }}
          >
            <Trash2 size={12} /> Remove Video
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [videoUrls, setVideoUrls] = useState({}); // lessonId → url
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbReady, setDbReady] = useState(null); // null=checking, true=ok, false=missing
  const [urlInput, setUrlInput] = useState('');
  const [savingUrl, setSavingUrl] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' | 'quizzes'

  // Quiz bank editor state
  const QUIZ_KEYS = Object.keys(QUIZ_BANK).filter(k => QUIZ_BANK[k].questions);
  const [selectedQuizKey, setSelectedQuizKey] = useState(QUIZ_KEYS[0] || '');
  const [overrides, setOverrides] = useState({}); // { quizKey: { questionId: {...} } }
  const [editingQ, setEditingQ] = useState(null); // { quizKey, questionId }
  const [editForm, setEditForm] = useState(null);
  const [quizSaving, setQuizSaving] = useState(false);
  const [quizMsg, setQuizMsg] = useState(null);

  // Admin gate
  const isAdmin = ADMIN_EMAILS.includes(user?.email);
  if (!isAdmin) {
    navigate('/');
    return null;
  }

  // Check if lesson_videos table exists
  useEffect(() => {
    supabase.from('lesson_videos').select('id').limit(1).then(({ error }) => {
      setDbReady(!error || !error.message?.includes('schema cache'));
    });
  }, []);

  // Expand first module by default
  useEffect(() => {
    if (selectedCourse?.modules?.length) {
      setExpandedModules({ [selectedCourse.modules[0].id]: true });
    }
  }, [selectedCourse?.id]);

  // Load video URLs when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    setLoading(true);
    supabase
      .from('lesson_videos')
      .select('lesson_id, video_url')
      .eq('course_id', selectedCourse.id)
      .then(({ data }) => {
        if (data) {
          const map = {};
          data.forEach(r => { map[r.lesson_id] = r.video_url; });
          setVideoUrls(map);
        }
        setLoading(false);
      });
  }, [selectedCourse?.id]);

  // Load quiz overrides from Supabase
  useEffect(() => {
    supabase.from('quiz_overrides').select('*').then(({ data }) => {
      if (!data) return;
      const map = {};
      data.forEach(row => {
        if (!map[row.quiz_key]) map[row.quiz_key] = {};
        map[row.quiz_key][row.question_id] = {
          question: row.question,
          options: row.options,
          correct: row.correct,
          explanation: row.explanation,
        };
      });
      setOverrides(map);
    });
  }, []);

  const startEditQuestion = (quizKey, q) => {
    setEditingQ({ quizKey, questionId: q.id });
    const override = overrides[quizKey]?.[q.id];
    setEditForm({
      question: override?.question ?? q.question,
      options: [...(override?.options ?? q.options)],
      correct: override?.correct ?? q.correct,
      explanation: override?.explanation ?? q.explanation ?? '',
    });
    setQuizMsg(null);
  };

  const cancelEdit = () => { setEditingQ(null); setEditForm(null); };

  const saveQuestion = async () => {
    if (!editingQ || !editForm) return;
    setQuizSaving(true);
    setQuizMsg(null);
    const payload = {
      quiz_key: editingQ.quizKey,
      question_id: editingQ.questionId,
      question: editForm.question.trim(),
      options: editForm.options,
      correct: editForm.correct,
      explanation: editForm.explanation.trim(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('quiz_overrides').upsert(payload, { onConflict: 'quiz_key,question_id' });
    setQuizSaving(false);
    if (error) {
      setQuizMsg({ type: 'error', text: error.message });
    } else {
      setOverrides(prev => ({
        ...prev,
        [editingQ.quizKey]: { ...(prev[editingQ.quizKey] || {}), [editingQ.questionId]: { ...editForm } },
      }));
      setQuizMsg({ type: 'success', text: 'Question saved!' });
      setEditingQ(null);
      setEditForm(null);
    }
  };

  const revertQuestion = async (quizKey, questionId) => {
    const { error } = await supabase.from('quiz_overrides')
      .delete().eq('quiz_key', quizKey).eq('question_id', questionId);
    if (!error) {
      setOverrides(prev => {
        const next = { ...prev };
        if (next[quizKey]) {
          next[quizKey] = { ...next[quizKey] };
          delete next[quizKey][questionId];
        }
        return next;
      });
    }
  };

  const clearMessage = () => setMessage(null);

  const handleFileUpload = async (file) => {
    if (!selectedLesson || !selectedCourse) return;
    if (!file.type.startsWith('video/')) {
      setMessage({ type: 'error', text: 'Please select a valid video file.' });
      return;
    }

    setUploading(true);
    setUploadProgress(2);
    setMessage(null);

    const ext = file.name.split('.').pop().toLowerCase() || 'mp4';
    const objectPath = `${selectedCourse.id}/${selectedLesson.id}/video.${ext}`;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error('Not authenticated — please sign in again.');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      // Use TUS resumable upload — handles any file size, real progress events
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      await new Promise((resolve, reject) => {
        const upload = new tus.Upload(file, {
          endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
          retryDelays: [0, 1000, 3000, 5000],
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: anonKey,
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: BUCKET,
            objectName: objectPath,
            contentType: file.type || 'video/mp4',
            cacheControl: '3600',
          },
          chunkSize: 6 * 1024 * 1024, // 6 MB chunks
          onError: (err) => reject(new Error(err.message || 'Upload failed')),
          onProgress: (bytesUploaded, bytesTotal) => {
            setUploadProgress(Math.round((bytesUploaded / bytesTotal) * 90));
          },
          onSuccess: resolve,
        });
        upload.start();
      });

      setUploadProgress(92);

      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);

      // Get video duration
      let durationSeconds = null;
      try {
        durationSeconds = await new Promise((resolve) => {
          const v = document.createElement('video');
          v.src = URL.createObjectURL(file);
          v.onloadedmetadata = () => resolve(Math.round(v.duration));
          v.onerror = () => resolve(null);
          setTimeout(() => resolve(null), 3000);
        });
      } catch (_) {}

      const { error: dbError } = await supabase
        .from('lesson_videos')
        .upsert({
          lesson_id: selectedLesson.id,
          course_id: selectedCourse.id,
          video_url: publicUrl,
          file_size: file.size,
          duration_seconds: durationSeconds,
          uploaded_by: user.id,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'lesson_id' });

      setUploadProgress(100);

      if (dbError) {
        const isTableMissing = dbError.message?.includes('schema cache') || dbError.message?.includes('does not exist');
        setMessage({
          type: 'error',
          text: isTableMissing
            ? 'Video file uploaded to storage but database table is missing. Run supabase/add_video_support.sql in your Supabase SQL Editor, then use "Paste Video URL" below with the uploaded file URL.'
            : 'Video uploaded but failed to save record: ' + dbError.message,
        });
        setDbReady(false);
      } else {
        setVideoUrls(prev => ({ ...prev, [selectedLesson.id]: publicUrl }));
        setMessage({ type: 'success', text: `"${selectedLesson.title}" video is live!` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }

    setUploading(false);
    setUploadProgress(0);
  };

  const handleDelete = async (lessonId) => {
    if (!selectedCourse) return;
    await supabase.from('lesson_videos').delete().eq('lesson_id', lessonId);
    // Also remove from storage
    const path = `${selectedCourse.id}/${lessonId}/`;
    await supabase.storage.from(BUCKET).remove([path]);
    setVideoUrls(prev => { const n = { ...prev }; delete n[lessonId]; return n; });
    setMessage({ type: 'success', text: 'Video removed.' });
  };

  const handleSaveUrl = async () => {
    if (!selectedLesson || !selectedCourse || !urlInput.trim()) return;
    setSavingUrl(true);
    setMessage(null);
    const { error } = await supabase.from('lesson_videos').upsert({
      lesson_id: selectedLesson.id,
      course_id: selectedCourse.id,
      video_url: urlInput.trim(),
      uploaded_by: user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'lesson_id' });
    if (error) {
      setMessage({ type: 'error', text: 'Failed to save URL: ' + error.message });
    } else {
      setVideoUrls(prev => ({ ...prev, [selectedLesson.id]: urlInput.trim() }));
      setMessage({ type: 'success', text: `Video URL saved for "${selectedLesson.title}"!` });
      setUrlInput('');
    }
    setSavingUrl(false);
  };

  const allLessons = selectedCourse?.modules?.flatMap(m => m.lessons) ?? [];
  const uploadedCount = allLessons.filter(l => l.type === 'video' && videoUrls[l.id]).length;
  const totalVideoLessons = allLessons.filter(l => l.type === 'video').length;

  return (
    <div style={{ minHeight: '100vh', background: '#060f1e', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '18px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(6,15,30,0.95)',
        display: 'flex', alignItems: 'center', gap: 16,
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', fontSize: 13, fontWeight: 600,
            padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
          }}
        >
          <ArrowLeft size={14} /> Dashboard
        </button>
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #818cf8, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
            Admin Panel
          </div>
          <div style={{ fontSize: 11, color: '#475569' }}>Video Content Manager</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
            {[
              { key: 'videos', label: 'Videos', icon: <Video size={13} /> },
              { key: 'quizzes', label: 'Quiz Bank', icon: <BookOpen size={13} /> },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: activeTab === tab.key ? 'rgba(56,189,248,0.15)' : 'transparent',
                  border: `1px solid ${activeTab === tab.key ? 'rgba(56,189,248,0.3)' : 'transparent'}`,
                  color: activeTab === tab.key ? '#38bdf8' : '#64748b',
                  transition: 'all 0.15s',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div style={{
            padding: '5px 14px', borderRadius: 20,
            background: 'rgba(129,140,248,0.12)',
            border: '1px solid rgba(129,140,248,0.25)',
            fontSize: 12, fontWeight: 700, color: '#818cf8',
          }}>
            {user.email}
          </div>
        </div>
      </div>

      {/* Setup banner when DB table is missing */}
      {dbReady === false && (
        <div style={{
          padding: '14px 32px',
          background: 'rgba(251,191,36,0.08)',
          borderBottom: '1px solid rgba(251,191,36,0.25)',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <AlertCircle size={18} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fde68a', marginBottom: 4 }}>
              Database setup required — lesson_videos table is missing
            </div>
            <div style={{ fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
              Go to{' '}
              <a href="https://supabase.com/dashboard/project/djesjwffqgiknfyvbrqn/sql/new" target="_blank" rel="noopener noreferrer"
                style={{ color: '#fbbf24', textDecoration: 'underline' }}>
                Supabase → SQL Editor
              </a>
              {' '}and run the contents of <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>supabase/add_video_support.sql</code>.
              Also create a public storage bucket named <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>course-videos</code>.
              Until then, use the "Paste Video URL" option below.
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* ── QUIZ BANK TAB ── */}
        {activeTab === 'quizzes' && (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left: quiz key list */}
            <div style={{
              width: 260, flexShrink: 0,
              background: 'rgba(255,255,255,0.02)',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              overflow: 'auto', padding: '12px 8px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, padding: '4px 8px 10px' }}>
                Quiz Banks
              </div>
              {QUIZ_KEYS.map(key => {
                const hasOverrides = Object.keys(overrides[key] || {}).length > 0;
                return (
                  <button
                    key={key}
                    onClick={() => { setSelectedQuizKey(key); setEditingQ(null); setEditForm(null); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2,
                      background: selectedQuizKey === key ? 'rgba(56,189,248,0.1)' : 'transparent',
                      border: `1px solid ${selectedQuizKey === key ? 'rgba(56,189,248,0.25)' : 'transparent'}`,
                      textAlign: 'left',
                    }}
                  >
                    <BookOpen size={12} color={selectedQuizKey === key ? '#38bdf8' : '#475569'} />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: selectedQuizKey === key ? '#38bdf8' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {QUIZ_BANK[key].title}
                    </span>
                    {hasOverrides && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                        edited
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: question list + editor */}
            <div style={{ flex: 1, overflow: 'auto', padding: '28px 36px' }}>
              {selectedQuizKey && QUIZ_BANK[selectedQuizKey] && (() => {
                const bank = QUIZ_BANK[selectedQuizKey];
                const questions = bank.questions;
                return (
                  <div>
                    <div style={{ marginBottom: 24 }}>
                      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px', fontFamily: "'Space Grotesk', sans-serif" }}>
                        {bank.title}
                      </h2>
                      <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>{questions.length} questions · {Object.keys(overrides[selectedQuizKey] || {}).length} edited</p>
                    </div>

                    {/* Global quiz message */}
                    {quizMsg && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                        borderRadius: 10, marginBottom: 20,
                        background: quizMsg.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
                        border: `1px solid ${quizMsg.type === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
                      }}>
                        {quizMsg.type === 'error'
                          ? <AlertCircle size={14} color="#f87171" />
                          : <CheckCircle size={14} color="#4ade80" />}
                        <span style={{ fontSize: 13, color: quizMsg.type === 'error' ? '#fca5a5' : '#86efac' }}>{quizMsg.text}</span>
                        <button onClick={() => setQuizMsg(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}><X size={13} /></button>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {questions.map((q, idx) => {
                        const override = overrides[selectedQuizKey]?.[q.id];
                        const isEditing = editingQ?.quizKey === selectedQuizKey && editingQ?.questionId === q.id;
                        const display = override || q;

                        return (
                          <div key={q.id} style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${override ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.07)'}`,
                            borderRadius: 14, overflow: 'hidden',
                          }}>
                            {/* Question header */}
                            <div style={{ padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                              <span style={{
                                flexShrink: 0, width: 26, height: 26, borderRadius: 7,
                                background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontWeight: 800, color: '#38bdf8',
                              }}>{idx + 1}</span>
                              <div style={{ flex: 1 }}>
                                {isEditing ? (
                                  /* EDIT MODE */
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {/* Question text */}
                                    <div>
                                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Question</label>
                                      <textarea
                                        value={editForm.question}
                                        onChange={e => setEditForm(f => ({ ...f, question: e.target.value }))}
                                        rows={3}
                                        style={{
                                          width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                                          borderRadius: 8, padding: '10px 12px', color: '#f1f5f9', fontSize: 14,
                                          outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
                                        }}
                                      />
                                    </div>
                                    {/* Options */}
                                    <div>
                                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>Answer Choices</label>
                                      {editForm.options.map((opt, oi) => (
                                        <div key={oi} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                                          <button
                                            onClick={() => setEditForm(f => ({ ...f, correct: oi }))}
                                            style={{
                                              flexShrink: 0, width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
                                              background: editForm.correct === oi ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                                              border: `2px solid ${editForm.correct === oi ? '#4ade80' : 'rgba(255,255,255,0.15)'}`,
                                            }}
                                            title="Mark as correct"
                                          />
                                          <input
                                            type="text"
                                            value={opt}
                                            onChange={e => setEditForm(f => {
                                              const opts = [...f.options];
                                              opts[oi] = e.target.value;
                                              return { ...f, options: opts };
                                            })}
                                            style={{
                                              flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${editForm.correct === oi ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.12)'}`,
                                              borderRadius: 8, padding: '8px 12px', color: '#f1f5f9', fontSize: 13,
                                              outline: 'none', fontFamily: 'inherit',
                                            }}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    {/* Explanation */}
                                    <div>
                                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Explanation</label>
                                      <textarea
                                        value={editForm.explanation}
                                        onChange={e => setEditForm(f => ({ ...f, explanation: e.target.value }))}
                                        rows={2}
                                        style={{
                                          width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                                          borderRadius: 8, padding: '10px 12px', color: '#f1f5f9', fontSize: 13,
                                          outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
                                        }}
                                      />
                                    </div>
                                    {/* Save / Cancel */}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                      <button
                                        onClick={saveQuestion}
                                        disabled={quizSaving}
                                        style={{
                                          display: 'flex', alignItems: 'center', gap: 6,
                                          padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', border: 'none', color: '#fff',
                                        }}
                                      >
                                        {quizSaving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                                        Save
                                      </button>
                                      <button onClick={cancelEdit} style={{
                                        padding: '9px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8',
                                      }}>Cancel</button>
                                    </div>
                                  </div>
                                ) : (
                                  /* VIEW MODE */
                                  <div>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', margin: '0 0 12px', lineHeight: 1.5 }}>{display.question}</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                      {display.options.map((opt, oi) => (
                                        <div key={oi} style={{
                                          display: 'flex', alignItems: 'center', gap: 8,
                                          padding: '7px 12px', borderRadius: 8, fontSize: 13,
                                          background: display.correct === oi ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
                                          border: `1px solid ${display.correct === oi ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)'}`,
                                          color: display.correct === oi ? '#4ade80' : '#94a3b8',
                                        }}>
                                          {display.correct === oi ? <CheckCircle size={12} /> : <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />}
                                          {opt}
                                        </div>
                                      ))}
                                    </div>
                                    {display.explanation && (
                                      <p style={{ fontSize: 12, color: '#64748b', margin: '10px 0 0', fontStyle: 'italic' }}>{display.explanation}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                              {/* Action buttons (view mode only) */}
                              {!isEditing && (
                                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                  <button
                                    onClick={() => startEditQuestion(selectedQuizKey, q)}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 5,
                                      padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                      background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8',
                                    }}
                                  >
                                    <Edit3 size={12} /> Edit
                                  </button>
                                  {override && (
                                    <button
                                      onClick={() => revertQuestion(selectedQuizKey, q.id)}
                                      style={{
                                        display: 'flex', alignItems: 'center', gap: 5,
                                        padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                        background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24',
                                      }}
                                      title="Revert to original"
                                    >
                                      <RotateCcw size={12} /> Revert
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
        {/* ── END QUIZ BANK TAB ── */}

        {activeTab === 'videos' && <>
        {/* Left: Course Tree */}
        <div style={{
          width: 300, flexShrink: 0,
          background: 'rgba(255,255,255,0.02)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          overflow: 'auto',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Course selector */}
          <div style={{ padding: '16px 12px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Select Course
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {COURSES.map(course => (
                <button
                  key={course.id}
                  onClick={() => { setSelectedCourse(course); setSelectedLesson(null); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                    background: selectedCourse?.id === course.id ? 'rgba(56,189,248,0.1)' : 'transparent',
                    border: `1px solid ${selectedCourse?.id === course.id ? 'rgba(56,189,248,0.25)' : 'transparent'}`,
                    textAlign: 'left', width: '100%',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{course.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {course.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          {selectedCourse && !loading && (
            <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>{uploadedCount}/{totalVideoLessons} videos uploaded</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>
                  {totalVideoLessons ? Math.round((uploadedCount / totalVideoLessons) * 100) : 0}%
                </span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  background: 'linear-gradient(90deg, #0ea5e9, #818cf8)',
                  width: `${totalVideoLessons ? (uploadedCount / totalVideoLessons) * 100 : 0}%`,
                  transition: 'width 0.4s',
                }} />
              </div>
            </div>
          )}

          {/* Module / Lesson tree */}
          <div style={{ padding: '8px', flex: 1, overflow: 'auto' }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 }}>
                <Loader2 size={16} color="#38bdf8" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: 13, color: '#64748b' }}>Loading…</span>
              </div>
            ) : (
              selectedCourse?.modules?.map(module => {
                const isOpen = expandedModules[module.id];
                const videoLessons = module.lessons.filter(l => l.type === 'video');
                const uploadedInModule = videoLessons.filter(l => videoUrls[l.id]).length;

                return (
                  <div key={module.id} style={{ marginBottom: 4 }}>
                    {/* Module header */}
                    <button
                      onClick={() => setExpandedModules(prev => ({ ...prev, [module.id]: !prev[module.id] }))}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 10px', borderRadius: 8,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer', marginBottom: 2,
                      }}
                    >
                      {isOpen ? <ChevronDown size={13} color="#64748b" /> : <ChevronRight size={13} color="#64748b" />}
                      <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: '#94a3b8', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {module.title}
                      </span>
                      {videoLessons.length > 0 && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                          background: uploadedInModule === videoLessons.length
                            ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                          color: uploadedInModule === videoLessons.length ? '#4ade80' : '#64748b',
                        }}>
                          {uploadedInModule}/{videoLessons.length}
                        </span>
                      )}
                    </button>

                    {/* Lessons */}
                    {isOpen && module.lessons.map(lesson => {
                      if (lesson.type === 'quiz') return null;
                      const hasVideo = !!videoUrls[lesson.id];
                      const isSelected = selectedLesson?.id === lesson.id;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                            padding: '7px 10px 7px 24px', borderRadius: 8, cursor: 'pointer',
                            background: isSelected ? 'rgba(56,189,248,0.1)' : 'transparent',
                            border: `1px solid ${isSelected ? 'rgba(56,189,248,0.25)' : 'transparent'}`,
                            textAlign: 'left', marginBottom: 1,
                          }}
                        >
                          <div style={{
                            width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: hasVideo ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${hasVideo ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                          }}>
                            {hasVideo
                              ? <CheckCircle size={11} color="#4ade80" />
                              : <Video size={11} color="#475569" />}
                          </div>
                          <span style={{
                            flex: 1, fontSize: 12, fontWeight: 500,
                            color: isSelected ? '#38bdf8' : '#94a3b8',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {lesson.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Upload Panel */}
        <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
          <AnimatePresence mode="wait">
            {!selectedLesson ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center',
                  minHeight: 400,
                }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: 20,
                  background: 'rgba(129,140,248,0.08)',
                  border: '1px solid rgba(129,140,248,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Film size={32} color="#818cf8" />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                    Select a lesson to upload video
                  </div>
                  <div style={{ fontSize: 13, color: '#334155' }}>
                    Choose a course and lesson from the left panel
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={selectedLesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ maxWidth: 740 }}
              >
                {/* Lesson header */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(56,189,248,0.1)',
                      border: '1px solid rgba(56,189,248,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Video size={16} color="#38bdf8" />
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
                        {selectedLesson.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#475569', marginTop: 1 }}>
                        {selectedCourse.title} • {selectedLesson.duration}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message banner */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px',
                        borderRadius: 12, marginBottom: 20,
                        background: message.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
                        border: `1px solid ${message.type === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
                      }}
                    >
                      {message.type === 'error'
                        ? <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                        : <CheckCircle size={16} color="#4ade80" style={{ flexShrink: 0, marginTop: 1 }} />}
                      <span style={{ fontSize: 13, color: message.type === 'error' ? '#fca5a5' : '#86efac', flex: 1 }}>
                        {message.text}
                      </span>
                      <button onClick={clearMessage} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                        <X size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Existing video or upload zone */}
                {videoUrls[selectedLesson.id] ? (
                  <VideoPreview
                    url={videoUrls[selectedLesson.id]}
                    lessonTitle={selectedLesson.title}
                    onDelete={() => handleDelete(selectedLesson.id)}
                  />
                ) : (
                  <UploadZone
                    onFile={handleFileUpload}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                    disabled={false}
                  />
                )}

                {/* Replace video option */}
                {videoUrls[selectedLesson.id] && !uploading && (
                  <div style={{ marginTop: 16 }}>
                    <UploadZone
                      onFile={handleFileUpload}
                      uploading={uploading}
                      uploadProgress={uploadProgress}
                      disabled={false}
                    />
                    <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#334155' }}>
                      Drop a new file above to replace the existing video
                    </div>
                  </div>
                )}

                {/* URL paste option */}
                {!videoUrls[selectedLesson.id] && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
                    }}>
                      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                      <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>OR PASTE A VIDEO URL</span>
                      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10, padding: '0 14px',
                      }}>
                        <Link size={14} color="#475569" style={{ flexShrink: 0 }} />
                        <input
                          type="url"
                          value={urlInput}
                          onChange={e => setUrlInput(e.target.value)}
                          placeholder="https://... (Supabase storage, S3, or any public URL)"
                          style={{
                            flex: 1, background: 'none', border: 'none', outline: 'none',
                            color: '#e2e8f0', fontSize: 13, padding: '12px 0',
                          }}
                          onKeyDown={e => e.key === 'Enter' && handleSaveUrl()}
                        />
                      </div>
                      <button
                        onClick={handleSaveUrl}
                        disabled={!urlInput.trim() || savingUrl}
                        style={{
                          padding: '0 20px', borderRadius: 10, cursor: urlInput.trim() ? 'pointer' : 'not-allowed',
                          background: urlInput.trim() ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : 'rgba(255,255,255,0.06)',
                          border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
                          opacity: urlInput.trim() ? 1 : 0.4, display: 'flex', alignItems: 'center', gap: 6,
                          flexShrink: 0,
                        }}
                      >
                        {savingUrl ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />}
                        Save
                      </button>
                    </div>
                    <div style={{ fontSize: 11, color: '#334155', marginTop: 6 }}>
                      Use this if Supabase storage isn't set up yet — paste any public video URL.
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </>}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
