import { useState, useEffect, useRef, useCallback } from 'react';
import * as tus from 'tus-js-client';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Upload, CheckCircle, Trash2, Play, ChevronDown, ChevronRight,
  Video, AlertCircle, Loader2, RefreshCw, ArrowLeft, Film, FolderOpen,
  CloudUpload, X, Eye, Link, ExternalLink
} from 'lucide-react';
import { COURSES } from '../data/courses';
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
      await new Promise((resolve, reject) => {
        const upload = new tus.Upload(file, {
          endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
          retryDelays: [0, 1000, 3000, 5000],
          headers: {
            Authorization: `Bearer ${token}`,
            'x-upsert': 'true',
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
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
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
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
