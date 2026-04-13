import { useState, useEffect, useRef, useCallback } from 'react';
import * as tus from 'tus-js-client';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Upload, CheckCircle, Trash2, Play, ChevronDown, ChevronRight,
  Video, AlertCircle, Loader2, RefreshCw, ArrowLeft, Film, FolderOpen,
  CloudUpload, X, Eye, Link, ExternalLink, BookOpen, Edit3, Save, Plus, RotateCcw,
  Users, Search, TrendingUp, Award, Zap, Calendar, Mail, ChevronUp
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
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' | 'quizzes' | 'students'

  // Students tab state
  const [students, setStudents] = useState(null); // null = not loaded yet
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [studentSort, setStudentSort] = useState('xp'); // 'xp' | 'name' | 'lessons' | 'joined'

  // Quiz bank editor state
  const QUIZ_KEYS = Object.keys(QUIZ_BANK).filter(k => QUIZ_BANK[k].questions);
  const [selectedQuizKey, setSelectedQuizKey] = useState(QUIZ_KEYS[0] || '');
  const [overrides, setOverrides] = useState({}); // { quizKey: { questionId: {...} } }
  const [editingQ, setEditingQ] = useState(null); // { quizKey, questionId }
  const [editForm, setEditForm] = useState(null);
  const [quizSaving, setQuizSaving] = useState(false);
  const [quizMsg, setQuizMsg] = useState(null);

  // New question state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQForm, setNewQForm] = useState({ question: '', options: ['', '', ''], correct: 0, explanation: '' });
  const [addingSaving, setAddingSaving] = useState(false);

  // AI parse state
  const [showParseZone, setShowParseZone] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState([]); // preview before saving
  const [parseLoading, setParseLoading] = useState(false);
  const [parseMsg, setParseMsg] = useState(null);
  const [parseDragging, setParseDragging] = useState(false);

  // Responsive breakpoints
  const getBreakpoint = () => {
    const w = window.innerWidth;
    if (w <= 768) return 'mobile';
    if (w <= 1024) return 'tablet';
    return 'desktop';
  };
  const [breakpoint, setBreakpoint] = useState(getBreakpoint);
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isTouch = isMobile || isTablet; // shared touch-friendly sizing
  const [mobileView, setMobileView] = useState('list'); // mobile only: 'list' | 'detail'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // mobile videos tab only
  useEffect(() => {
    const handler = () => setBreakpoint(getBreakpoint());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

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

  // Load students when Students tab is opened
  const loadStudents = async () => {
    setStudentsLoading(true);
    try {
      const [profilesRes, enrolledRes, lessonsRes, quizScoresRes, purchasesRes] = await Promise.all([
        supabase.from('profiles').select('id, username, full_name, xp, level, streak, created_at').order('xp', { ascending: false }),
        supabase.from('enrolled_courses').select('user_id, course_id, enrolled_at'),
        supabase.from('completed_lessons').select('user_id, lesson_id, completed_at'),
        supabase.from('quiz_scores').select('user_id, quiz_id, score, total, percent, is_perfect, updated_at'),
        supabase.from('purchases').select('user_id, plan, amount_cents, created_at'),
      ]);

      const profiles = profilesRes.data || [];
      const enrolled = enrolledRes.data || [];
      const lessons = lessonsRes.data || [];
      const quizScores = quizScoresRes.data || [];
      const purchases = purchasesRes.data || [];

      // Build per-user maps
      const enrolledMap = {};
      enrolled.forEach(r => { if (!enrolledMap[r.user_id]) enrolledMap[r.user_id] = []; enrolledMap[r.user_id].push(r); });
      const lessonsMap = {};
      lessons.forEach(r => { if (!lessonsMap[r.user_id]) lessonsMap[r.user_id] = []; lessonsMap[r.user_id].push(r); });
      const scoresMap = {};
      quizScores.forEach(r => { if (!scoresMap[r.user_id]) scoresMap[r.user_id] = []; scoresMap[r.user_id].push(r); });
      const purchasesMap = {};
      purchases.forEach(r => { if (!purchasesMap[r.user_id]) purchasesMap[r.user_id] = []; purchasesMap[r.user_id].push(r); });

      const enriched = profiles.map(p => ({
        ...p,
        enrolledCourses: enrolledMap[p.id] || [],
        completedLessons: lessonsMap[p.id] || [],
        quizScores: scoresMap[p.id] || [],
        purchases: purchasesMap[p.id] || [],
      }));

      setStudents(enriched);
    } catch (err) {
      console.error('Failed to load students:', err);
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'students' && students === null) loadStudents();
  }, [activeTab]);

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

  // Generate a unique question ID that won't collide with static bank IDs (use timestamp-based)
  const genQuestionId = () => Date.now() + Math.floor(Math.random() * 1000);

  const resetNewQForm = () => setNewQForm({ question: '', options: ['', '', ''], correct: 0, explanation: '' });

  const saveNewQuestion = async (formData) => {
    if (!selectedQuizKey) return;
    setAddingSaving(true);
    const newId = genQuestionId();
    const payload = {
      quiz_key: selectedQuizKey,
      question_id: newId,
      question: formData.question.trim(),
      options: formData.options,
      correct: formData.correct,
      explanation: formData.explanation.trim(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('quiz_overrides').upsert(payload, { onConflict: 'quiz_key,question_id' });
    setAddingSaving(false);
    if (error) {
      setQuizMsg({ type: 'error', text: error.message });
    } else {
      setOverrides(prev => ({
        ...prev,
        [selectedQuizKey]: {
          ...(prev[selectedQuizKey] || {}),
          [newId]: { question: formData.question.trim(), options: formData.options, correct: formData.correct, explanation: formData.explanation.trim() },
        },
      }));
      setQuizMsg({ type: 'success', text: 'Question added!' });
    }
  };

  const handleAddSubmit = async () => {
    if (!newQForm.question.trim() || newQForm.options.some(o => !o.trim())) {
      setQuizMsg({ type: 'error', text: 'Please fill in the question and all answer choices.' });
      return;
    }
    await saveNewQuestion(newQForm);
    resetNewQForm();
    setShowAddForm(false);
  };

  // Compress + resize an image file to JPEG, max 1200px on longest side, 80% quality
  const compressImage = (file) => new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width >= height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      resolve(dataUrl.split(',')[1]); // return base64 only
    };
    img.onerror = reject;
    img.src = url;
  });

  const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => { resolve(reader.result.split(',')[1]); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleParseFile = async (file) => {
    setParseLoading(true);
    setParsedQuestions([]);
    setParseMsg(null);

    let body;
    const mime = file.type;

    if (mime.startsWith('image/')) {
      // Compress before sending — phone photos can be 5MB+
      const base64 = await compressImage(file).catch(() => null);
      if (!base64) {
        setParseMsg({ type: 'error', text: 'Could not process image.' });
        setParseLoading(false);
        return;
      }
      body = { type: 'image', mediaType: 'image/jpeg', data: base64 };
    } else if (mime === 'application/pdf') {
      const base64 = await readFileAsBase64(file);
      body = { type: 'document', mediaType: 'application/pdf', data: base64 };
    } else {
      const text = await file.text().catch(() => null);
      if (!text) {
        setParseMsg({ type: 'error', text: 'Could not read file. Use an image, PDF, or plain text file.' });
        setParseLoading(false);
        return;
      }
      body = { type: 'text', data: text };
    }

    try {
      const res = await fetch('/api/parse-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      // Guard against non-JSON responses (e.g. 413 Entity Too Large)
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); }
      catch { data = { error: `Server error ${res.status}: ${text.slice(0, 120)}` }; }

      if (!res.ok || data.error) {
        setParseMsg({ type: 'error', text: data.error || 'Parsing failed' });
      } else if (!data.questions.length) {
        setParseMsg({ type: 'error', text: 'No questions found. Make sure the image clearly shows questions and answers.' });
      } else {
        setParsedQuestions(data.questions.map((q, i) => ({ ...q, _tempId: Date.now() + i, _selected: true })));
        setParseMsg({ type: 'success', text: `Found ${data.questions.length} question${data.questions.length > 1 ? 's' : ''} — review and confirm below.` });
      }
    } catch (err) {
      setParseMsg({ type: 'error', text: 'Request failed. Check your connection and try again.' });
    }
    setParseLoading(false);
  };

  const handleParseDrop = (e) => {
    e.preventDefault();
    setParseDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleParseFile(file);
  };

  const saveAllParsed = async () => {
    const toSave = parsedQuestions.filter(q => q._selected);
    if (!toSave.length) return;
    setAddingSaving(true);
    let saved = 0;
    for (const q of toSave) {
      const newId = genQuestionId() + saved; // ensure unique
      const payload = {
        quiz_key: selectedQuizKey,
        question_id: newId,
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation || '',
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('quiz_overrides').upsert(payload, { onConflict: 'quiz_key,question_id' });
      if (!error) {
        setOverrides(prev => ({
          ...prev,
          [selectedQuizKey]: {
            ...(prev[selectedQuizKey] || {}),
            [newId]: { question: q.question, options: q.options, correct: q.correct, explanation: q.explanation || '' },
          },
        }));
        saved++;
      }
    }
    setAddingSaving(false);
    setParsedQuestions([]);
    setShowParseZone(false);
    setParseMsg(null);
    setQuizMsg({ type: 'success', text: `${saved} question${saved > 1 ? 's' : ''} added to the bank!` });
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
        padding: isMobile ? '12px 16px' : isTablet ? '14px 20px' : '18px 32px',
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
            padding: isTouch ? '8px 10px' : '7px 14px', borderRadius: 8, cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={14} /> {!isMobile && 'Dashboard'}
        </button>
        {!isTouch && <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />}
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #818cf8, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={15} color="#fff" />
        </div>
        {!isMobile && (
          <div>
            <div style={{ fontSize: isTablet ? 14 : 16, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
              Admin Panel
            </div>
            {!isTablet && <div style={{ fontSize: 11, color: '#475569' }}>Content Manager</div>}
          </div>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 3 }}>
            {[
              { key: 'videos', label: 'Videos', icon: <Video size={13} /> },
              { key: 'quizzes', label: 'Quiz Bank', icon: <BookOpen size={13} /> },
              { key: 'students', label: 'Students', icon: <Users size={13} /> },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setMobileView('list'); setMobileSidebarOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: isTouch ? '8px 12px' : '6px 14px',
                  borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer',
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
          {!isTouch && (
            <div style={{
              padding: '5px 14px', borderRadius: 20,
              background: 'rgba(129,140,248,0.12)',
              border: '1px solid rgba(129,140,248,0.25)',
              fontSize: 12, fontWeight: 700, color: '#818cf8',
            }}>
              {user.email}
            </div>
          )}
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
            {/* Left: quiz key list — full screen on mobile, narrow sidebar on tablet/desktop */}
            <div style={{
              width: isMobile ? '100%' : isTablet ? 220 : 260,
              flexShrink: 0,
              display: isMobile && mobileView !== 'list' ? 'none' : 'flex',
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.02)',
              borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.06)',
              overflow: 'auto', padding: isTouch ? '16px 10px' : '12px 8px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, padding: '4px 8px 10px' }}>
                Quiz Banks
              </div>
              {QUIZ_KEYS.map(key => {
                const hasOverrides = Object.keys(overrides[key] || {}).length > 0;
                return (
                  <button
                    key={key}
                    onClick={() => { setSelectedQuizKey(key); setEditingQ(null); setEditForm(null); if (isMobile) setMobileView('detail'); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: isTouch ? '13px 10px' : '8px 10px',
                      borderRadius: 10, cursor: 'pointer', marginBottom: 4,
                      background: selectedQuizKey === key && !isMobile ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedQuizKey === key && !isMobile ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.07)'}`,
                      textAlign: 'left',
                    }}
                  >
                    <BookOpen size={isTouch ? 14 : 12} color={selectedQuizKey === key && !isMobile ? '#38bdf8' : '#475569'} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: isTouch ? 13 : 12, fontWeight: 500, color: selectedQuizKey === key && !isMobile ? '#38bdf8' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {QUIZ_BANK[key].title}
                    </span>
                    {hasOverrides && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', flexShrink: 0 }}>
                        edited
                      </span>
                    )}
                    {isMobile && <ChevronRight size={16} color="#475569" />}
                  </button>
                );
              })}
            </div>

            {/* Right: question list + editor */}
            <div style={{
              flex: 1, overflow: 'auto',
              padding: isMobile ? '16px 14px 100px' : isTablet ? '20px 22px 80px' : '28px 36px',
              display: isMobile && mobileView !== 'detail' ? 'none' : 'block',
            }}>
              {/* Mobile back button */}
              {isMobile && mobileView === 'detail' && (
                <button
                  onClick={() => { setMobileView('list'); setEditingQ(null); setEditForm(null); setShowAddForm(false); setShowParseZone(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8', fontSize: 14, fontWeight: 600,
                    padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
                  }}
                >
                  <ArrowLeft size={15} /> All Quiz Banks
                </button>
              )}

              {selectedQuizKey && QUIZ_BANK[selectedQuizKey] && (() => {
                const bank = QUIZ_BANK[selectedQuizKey];
                const baseQuestions = bank.questions;
                const baseIds = new Set(baseQuestions.map(q => q.id));
                // New questions added via admin (not in static bank)
                const addedQuestions = Object.entries(overrides[selectedQuizKey] || {})
                  .filter(([id]) => !baseIds.has(Number(id)))
                  .map(([id, data]) => ({ id: Number(id), ...data, _isNew: true }));
                const questions = baseQuestions;
                return (
                  <div>
                    <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                      <div>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px', fontFamily: "'Space Grotesk', sans-serif" }}>
                          {bank.title}
                        </h2>
                        <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
                          {questions.length + addedQuestions.length} questions total · {addedQuestions.length} added · {Object.keys(overrides[selectedQuizKey] || {}).filter(id => baseIds.has(Number(id))).length} edited
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                        <button
                          onClick={() => { setShowParseZone(v => !v); setShowAddForm(false); setParsedQuestions([]); setParseMsg(null); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: isTouch ? '11px 14px' : '8px 16px',
                            borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            background: showParseZone ? 'rgba(129,140,248,0.2)' : 'rgba(129,140,248,0.08)',
                            border: `1px solid ${showParseZone ? 'rgba(129,140,248,0.5)' : 'rgba(129,140,248,0.25)'}`,
                            color: '#818cf8', flex: isMobile ? '1' : 'none',
                          }}
                        >
                          <Upload size={13} /> {isMobile ? 'Parse File' : 'Parse from File'}
                        </button>
                        <button
                          onClick={() => { setShowAddForm(v => !v); setShowParseZone(false); resetNewQForm(); setQuizMsg(null); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: isTouch ? '11px 14px' : '8px 16px',
                            borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            background: showAddForm ? 'rgba(56,189,248,0.2)' : 'rgba(56,189,248,0.08)',
                            border: `1px solid ${showAddForm ? 'rgba(56,189,248,0.5)' : 'rgba(56,189,248,0.25)'}`,
                            color: '#38bdf8', flex: isMobile ? '1' : 'none',
                          }}
                        >
                          <Plus size={13} /> Add Question
                        </button>
                      </div>
                    </div>

                    {/* ── PARSE FROM FILE ZONE ── */}
                    {showParseZone && (
                      <div style={{ marginBottom: 24, background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: 16, padding: '20px 24px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Upload size={15} /> Parse Questions from File
                        </div>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', lineHeight: 1.6 }}>
                          Drop a screenshot, PDF, or text file containing multiple-choice questions. AI will extract them automatically.
                          Supported: <strong style={{ color: '#94a3b8' }}>PNG, JPG, PDF, TXT</strong>
                        </p>

                        {/* Drop zone */}
                        {/* Hidden inputs */}
                        <input
                          id="parse-file-input"
                          type="file"
                          accept="image/*,.pdf,.txt,.text"
                          style={{ display: 'none' }}
                          onChange={e => { if (e.target.files[0]) handleParseFile(e.target.files[0]); e.target.value = ''; }}
                        />
                        <input
                          id="parse-camera-input"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          style={{ display: 'none' }}
                          onChange={e => { if (e.target.files[0]) handleParseFile(e.target.files[0]); e.target.value = ''; }}
                        />

                        {parseLoading ? (
                          <div style={{
                            border: '2px dashed rgba(129,140,248,0.3)', borderRadius: 12,
                            padding: '40px 24px', textAlign: 'center',
                            background: 'rgba(255,255,255,0.02)',
                          }}>
                            <Loader2 size={28} color="#818cf8" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
                            <div style={{ fontSize: 14, color: '#818cf8', fontWeight: 600 }}>Parsing with AI…</div>
                          </div>
                        ) : isTouch ? (
                          /* Mobile/tablet: big camera button on top, browse below */
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <button
                              onClick={() => document.getElementById('parse-camera-input').click()}
                              style={{
                                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
                                padding: '22px 16px', borderRadius: 14, cursor: 'pointer',
                                border: '2px solid rgba(129,140,248,0.4)',
                                background: 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(99,102,241,0.1))',
                              }}
                            >
                              <div style={{ fontSize: 36 }}>📷</div>
                              <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 16, fontWeight: 800, color: '#a78bfa' }}>Take a Photo</div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Point camera at question sheet</div>
                              </div>
                            </button>
                            <div
                              onDrop={handleParseDrop}
                              onClick={() => document.getElementById('parse-file-input').click()}
                              style={{
                                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
                                padding: '16px', borderRadius: 12, cursor: 'pointer',
                                border: '1px dashed rgba(129,140,248,0.3)',
                                background: 'rgba(129,140,248,0.04)',
                              }}
                            >
                              <div style={{ fontSize: 26 }}>📂</div>
                              <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#818cf8' }}>Upload a File</div>
                                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>PDF, screenshot, or text</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Desktop: side by side */
                          <div style={{ display: 'flex', gap: 10 }}>
                            <button
                              onClick={() => document.getElementById('parse-camera-input').click()}
                              style={{
                                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                gap: 10, padding: '28px 16px', borderRadius: 12, cursor: 'pointer',
                                border: '2px dashed rgba(129,140,248,0.35)',
                                background: 'rgba(129,140,248,0.04)',
                                transition: 'all 0.15s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(129,140,248,0.1)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'rgba(129,140,248,0.04)'}
                            >
                              <div style={{ fontSize: 30 }}>📷</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa' }}>Take a Photo</div>
                              <div style={{ fontSize: 11, color: '#475569' }}>Open camera</div>
                            </button>
                            <div
                              onDragOver={e => { e.preventDefault(); setParseDragging(true); }}
                              onDragLeave={() => setParseDragging(false)}
                              onDrop={handleParseDrop}
                              onClick={() => document.getElementById('parse-file-input').click()}
                              style={{
                                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                gap: 10, padding: '28px 16px', borderRadius: 12, cursor: 'pointer',
                                border: `2px dashed ${parseDragging ? '#818cf8' : 'rgba(129,140,248,0.35)'}`,
                                background: parseDragging ? 'rgba(129,140,248,0.1)' : 'rgba(129,140,248,0.04)',
                                transition: 'all 0.15s',
                              }}
                            >
                              <div style={{ fontSize: 30 }}>📂</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa' }}>Drop or Browse</div>
                              <div style={{ fontSize: 11, color: '#475569' }}>Screenshot, PDF, or text</div>
                            </div>
                          </div>
                        )}

                        {/* Parse message */}
                        {parseMsg && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                            borderRadius: 9, marginTop: 12,
                            background: parseMsg.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
                            border: `1px solid ${parseMsg.type === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
                          }}>
                            {parseMsg.type === 'error' ? <AlertCircle size={14} color="#f87171" /> : <CheckCircle size={14} color="#4ade80" />}
                            <span style={{ fontSize: 13, color: parseMsg.type === 'error' ? '#fca5a5' : '#86efac' }}>{parseMsg.text}</span>
                          </div>
                        )}

                        {/* Parsed question preview */}
                        {parsedQuestions.length > 0 && (
                          <div style={{ marginTop: 20 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>
                              Review & select questions to add:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflow: 'auto', paddingRight: 4 }}>
                              {parsedQuestions.map((q, idx) => (
                                <div key={q._tempId} style={{
                                  background: q._selected ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)',
                                  border: `1px solid ${q._selected ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.07)'}`,
                                  borderRadius: 10, padding: '14px 16px',
                                  display: 'flex', gap: 12, alignItems: 'flex-start',
                                }}>
                                  <button
                                    onClick={() => setParsedQuestions(prev => prev.map((pq, pi) => pi === idx ? { ...pq, _selected: !pq._selected } : pq))}
                                    style={{
                                      flexShrink: 0, width: 22, height: 22, borderRadius: 6, cursor: 'pointer', marginTop: 1,
                                      background: q._selected ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                                      border: `2px solid ${q._selected ? '#4ade80' : 'rgba(255,255,255,0.15)'}`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                  >
                                    {q._selected && <CheckCircle size={12} color="#4ade80" />}
                                  </button>
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', margin: '0 0 8px', lineHeight: 1.5 }}>{q.question}</p>
                                    {q.options.map((opt, oi) => (
                                      <div key={oi} style={{
                                        fontSize: 12, padding: '4px 10px', borderRadius: 6, marginBottom: 4,
                                        background: q.correct === oi ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${q.correct === oi ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
                                        color: q.correct === oi ? '#4ade80' : '#94a3b8',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                      }}>
                                        {q.correct === oi ? <CheckCircle size={10} /> : <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />}
                                        {opt}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => { setParsedQuestions([]); setParseMsg(null); }}
                                style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
                              >Clear</button>
                              <button
                                onClick={saveAllParsed}
                                disabled={addingSaving || !parsedQuestions.some(q => q._selected)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 8,
                                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                  background: 'linear-gradient(135deg, #818cf8, #6366f1)', border: 'none', color: '#fff',
                                  opacity: parsedQuestions.some(q => q._selected) ? 1 : 0.4,
                                }}
                              >
                                {addingSaving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                                Add {parsedQuestions.filter(q => q._selected).length} Questions
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── ADD QUESTION FORM ── */}
                    {showAddForm && (
                      <div style={{ marginBottom: 24, background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 16, padding: '20px 24px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#38bdf8', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Plus size={15} /> New Question
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Question</label>
                            <textarea
                              value={newQForm.question}
                              onChange={e => setNewQForm(f => ({ ...f, question: e.target.value }))}
                              placeholder="Enter the question text…"
                              rows={3}
                              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 12px', color: '#f1f5f9', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>
                              Answer Choices <span style={{ color: '#475569', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(click circle to mark correct)</span>
                            </label>
                            {newQForm.options.map((opt, oi) => (
                              <div key={oi} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                                <button
                                  onClick={() => setNewQForm(f => ({ ...f, correct: oi }))}
                                  style={{
                                    flexShrink: 0, width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
                                    background: newQForm.correct === oi ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                                    border: `2px solid ${newQForm.correct === oi ? '#4ade80' : 'rgba(255,255,255,0.15)'}`,
                                  }}
                                  title="Mark as correct"
                                />
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={e => setNewQForm(f => { const opts = [...f.options]; opts[oi] = e.target.value; return { ...f, options: opts }; })}
                                  placeholder={`Answer ${String.fromCharCode(65 + oi)}`}
                                  style={{
                                    flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${newQForm.correct === oi ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.12)'}`,
                                    borderRadius: 8, padding: '8px 12px', color: '#f1f5f9', fontSize: 13, outline: 'none', fontFamily: 'inherit',
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Explanation (optional)</label>
                            <textarea
                              value={newQForm.explanation}
                              onChange={e => setNewQForm(f => ({ ...f, explanation: e.target.value }))}
                              placeholder="Why is the correct answer correct?"
                              rows={2}
                              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 12px', color: '#f1f5f9', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button onClick={() => { setShowAddForm(false); resetNewQForm(); }} style={{ padding: '9px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>Cancel</button>
                            <button
                              onClick={handleAddSubmit}
                              disabled={addingSaving}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', border: 'none', color: '#fff' }}
                            >
                              {addingSaving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                              Add Question
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

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

                      {/* Added questions (not in static bank) */}
                      {addedQuestions.length > 0 && (
                        <div style={{ marginTop: 24 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                            Added Questions ({addedQuestions.length})
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {addedQuestions.map((q, idx) => (
                              <div key={q.id} style={{
                                background: 'rgba(129,140,248,0.04)',
                                border: '1px solid rgba(129,140,248,0.2)',
                                borderRadius: 14, overflow: 'hidden',
                              }}>
                                <div style={{ padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                  <span style={{
                                    flexShrink: 0, width: 26, height: 26, borderRadius: 7,
                                    background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 800, color: '#818cf8',
                                  }}>+</span>
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', margin: '0 0 12px', lineHeight: 1.5 }}>{q.question}</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                      {q.options.map((opt, oi) => (
                                        <div key={oi} style={{
                                          display: 'flex', alignItems: 'center', gap: 8,
                                          padding: '7px 12px', borderRadius: 8, fontSize: 13,
                                          background: q.correct === oi ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
                                          border: `1px solid ${q.correct === oi ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)'}`,
                                          color: q.correct === oi ? '#4ade80' : '#94a3b8',
                                        }}>
                                          {q.correct === oi ? <CheckCircle size={12} /> : <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />}
                                          {opt}
                                        </div>
                                      ))}
                                    </div>
                                    {q.explanation && (
                                      <p style={{ fontSize: 12, color: '#64748b', margin: '10px 0 0', fontStyle: 'italic' }}>{q.explanation}</p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => revertQuestion(selectedQuizKey, q.id)}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
                                      padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171',
                                    }}
                                    title="Delete this question"
                                  >
                                    <Trash2 size={12} /> Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
        {/* ── END QUIZ BANK TAB ── */}

        {/* ── STUDENTS TAB ── */}
        {activeTab === 'students' && (() => {
          const allLessons = COURSES.flatMap(c => c.modules.flatMap(m => m.lessons));
          const totalLessons = allLessons.length;

          const filtered = (students || []).filter(s => {
            if (!studentSearch.trim()) return true;
            const q = studentSearch.toLowerCase();
            return (
              (s.full_name || '').toLowerCase().includes(q) ||
              (s.username || '').toLowerCase().includes(q)
            );
          });

          const sorted = [...filtered].sort((a, b) => {
            if (studentSort === 'xp') return (b.xp || 0) - (a.xp || 0);
            if (studentSort === 'lessons') return b.completedLessons.length - a.completedLessons.length;
            if (studentSort === 'name') return (a.full_name || a.username || '').localeCompare(b.full_name || b.username || '');
            if (studentSort === 'joined') return new Date(b.created_at) - new Date(a.created_at);
            return 0;
          });

          const totalStudents = (students || []).length;
          const activeStudents = (students || []).filter(s => s.completedLessons.length > 0).length;
          const totalXP = (students || []).reduce((sum, s) => sum + (s.xp || 0), 0);
          const avgProgress = totalStudents > 0
            ? Math.round((students || []).reduce((sum, s) => sum + s.completedLessons.length, 0) / totalStudents / totalLessons * 100)
            : 0;

          const planLabel = plan => {
            if (plan === 'cfi_mentorship') return 'CFI';
            if (plan === 'full_access') return 'Full';
            if (plan === 'basic_access') return 'Basic';
            return plan;
          };
          const planColor = plan => {
            if (plan === 'cfi_mentorship') return '#f59e0b';
            if (plan === 'full_access') return '#38bdf8';
            if (plan === 'basic_access') return '#a78bfa';
            return '#64748b';
          };

          return (
            <div style={{ flex: 1, overflow: 'auto', padding: isMobile ? '16px' : '28px 32px' }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                    Students
                  </h2>
                  <div style={{ fontSize: 13, color: '#475569', marginTop: 3 }}>
                    {studentsLoading ? 'Loading...' : `${totalStudents} registered · ${activeStudents} active`}
                  </div>
                </div>
                <button
                  onClick={loadStudents}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={13} /> Refresh
                </button>
              </div>

              {/* Summary stats */}
              {!studentsLoading && students && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
                  {[
                    { label: 'Total Students', value: totalStudents, icon: <Users size={16} />, color: '#38bdf8' },
                    { label: 'Active Learners', value: activeStudents, icon: <TrendingUp size={16} />, color: '#4ade80' },
                    { label: 'Avg Progress', value: `${avgProgress}%`, icon: <Award size={16} />, color: '#a78bfa' },
                    { label: 'Total XP Earned', value: totalXP.toLocaleString(), icon: <Zap size={16} />, color: '#f59e0b' },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      padding: '14px 16px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, color: stat.color }}>
                        {stat.icon}
                        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.7 }}>{stat.label}</span>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Search + Sort */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    placeholder="Search by name or username…"
                    style={{
                      width: '100%', padding: '9px 12px 9px 32px', borderRadius: 9,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#f1f5f9', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <select
                  value={studentSort}
                  onChange={e => setStudentSort(e.target.value)}
                  style={{
                    padding: '9px 12px', borderRadius: 9,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8', fontSize: 13, cursor: 'pointer', outline: 'none',
                  }}
                >
                  <option value="xp">Sort: Most XP</option>
                  <option value="lessons">Sort: Most Lessons</option>
                  <option value="name">Sort: Name A–Z</option>
                  <option value="joined">Sort: Recently Joined</option>
                </select>
              </div>

              {/* Student list */}
              {studentsLoading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
                  <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
                  <div style={{ fontSize: 14 }}>Loading student data…</div>
                </div>
              ) : sorted.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569', fontSize: 14 }}>
                  {studentSearch ? 'No students match your search.' : 'No students yet.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sorted.map((student, idx) => {
                    const isExpanded = expandedStudent === student.id;
                    const lessonPct = totalLessons > 0 ? Math.round(student.completedLessons.length / totalLessons * 100) : 0;
                    const bestQuiz = student.quizScores.length > 0
                      ? Math.max(...student.quizScores.map(q => q.percent))
                      : null;
                    const latestPurchase = student.purchases.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
                    const displayName = student.full_name || student.username || 'Unknown';
                    const initials = displayName.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

                    return (
                      <div key={student.id} style={{
                        borderRadius: 12,
                        background: isExpanded ? 'rgba(56,189,248,0.05)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isExpanded ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.07)'}`,
                        overflow: 'hidden',
                        transition: 'border-color 0.2s',
                      }}>
                        {/* Row */}
                        <div
                          onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '14px 16px', cursor: 'pointer',
                            flexWrap: isMobile ? 'wrap' : 'nowrap',
                          }}
                        >
                          {/* Avatar */}
                          <div style={{
                            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #0ea5e9, #818cf8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 700, color: '#fff',
                          }}>{initials}</div>

                          {/* Name + username */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {displayName}
                              {latestPurchase && (
                                <span style={{
                                  marginLeft: 8, padding: '2px 8px', borderRadius: 20,
                                  background: `${planColor(latestPurchase.plan)}18`,
                                  color: planColor(latestPurchase.plan),
                                  fontSize: 11, fontWeight: 700,
                                }}>
                                  {planLabel(latestPurchase.plan)}
                                </span>
                              )}
                            </div>
                            {student.username && student.full_name && (
                              <div style={{ fontSize: 12, color: '#475569' }}>@{student.username}</div>
                            )}
                          </div>

                          {/* Progress bar */}
                          {!isMobile && (
                            <div style={{ width: 120, flexShrink: 0 }}>
                              <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>
                                {student.completedLessons.length}/{totalLessons} lessons
                              </div>
                              <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.07)' }}>
                                <div style={{
                                  height: '100%', borderRadius: 3,
                                  width: `${lessonPct}%`,
                                  background: lessonPct >= 80 ? '#4ade80' : lessonPct >= 40 ? '#38bdf8' : '#818cf8',
                                  transition: 'width 0.4s',
                                }} />
                              </div>
                            </div>
                          )}

                          {/* XP */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                            <Zap size={13} color="#f59e0b" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>{(student.xp || 0).toLocaleString()}</span>
                          </div>

                          {/* Level badge */}
                          <div style={{
                            padding: '3px 10px', borderRadius: 20, flexShrink: 0,
                            background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.2)',
                            fontSize: 12, fontWeight: 700, color: '#818cf8',
                          }}>
                            Lv {student.level || 1}
                          </div>

                          {/* Expand chevron */}
                          <div style={{ color: '#475569', flexShrink: 0 }}>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <div style={{ padding: '0 16px 18px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 16 }}>

                              {/* Overview */}
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Overview</div>
                                {[
                                  { label: 'Streak', value: `🔥 ${student.streak || 0} days`, show: true },
                                  { label: 'Lessons Done', value: `${student.completedLessons.length} / ${totalLessons}`, show: true },
                                  { label: 'Progress', value: `${lessonPct}%`, show: true },
                                  { label: 'Quizzes Taken', value: student.quizScores.length, show: true },
                                  { label: 'Best Quiz', value: bestQuiz !== null ? `${bestQuiz}%` : '—', show: true },
                                  { label: 'Joined', value: student.created_at ? new Date(student.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—', show: true },
                                ].map(row => (
                                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                                    <span style={{ fontSize: 12, color: '#475569' }}>{row.label}</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{row.value}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Courses + Purchases */}
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Plan & Courses</div>
                                {student.purchases.length === 0 ? (
                                  <div style={{ fontSize: 12, color: '#334155', marginBottom: 8 }}>No purchase on record</div>
                                ) : student.purchases.map((p, i) => (
                                  <div key={i} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    marginBottom: 7,
                                  }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: planColor(p.plan), padding: '2px 8px', borderRadius: 20, background: `${planColor(p.plan)}15` }}>
                                      {planLabel(p.plan)}
                                    </span>
                                    <span style={{ fontSize: 11, color: '#475569' }}>
                                      ${(p.amount_cents / 100).toFixed(0)} · {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </span>
                                  </div>
                                ))}
                                <div style={{ marginTop: 12, fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Enrolled Courses</div>
                                {student.enrolledCourses.length === 0 ? (
                                  <div style={{ fontSize: 12, color: '#334155' }}>Not enrolled in any course</div>
                                ) : student.enrolledCourses.map(e => {
                                  const course = COURSES.find(c => c.id === e.course_id);
                                  const courseLessons = course ? course.modules.flatMap(m => m.lessons) : [];
                                  const doneInCourse = student.completedLessons.filter(l =>
                                    courseLessons.some(cl => cl.id === l.lesson_id)
                                  ).length;
                                  const coursePct = courseLessons.length > 0 ? Math.round(doneInCourse / courseLessons.length * 100) : 0;
                                  return (
                                    <div key={e.course_id} style={{ marginBottom: 10 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{course?.title || e.course_id}</span>
                                        <span style={{ fontSize: 12, color: '#64748b' }}>{doneInCourse}/{courseLessons.length}</span>
                                      </div>
                                      <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.07)' }}>
                                        <div style={{
                                          height: '100%', borderRadius: 3, width: `${coursePct}%`,
                                          background: coursePct >= 80 ? '#4ade80' : coursePct >= 40 ? '#38bdf8' : '#818cf8',
                                        }} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Quiz scores */}
                              {student.quizScores.length > 0 && (
                                <div>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
                                    Quiz Scores ({student.quizScores.length})
                                  </div>
                                  <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
                                    {student.quizScores
                                      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                                      .map((q, i) => {
                                        const color = q.percent >= 70 ? '#4ade80' : '#f87171';
                                        return (
                                          <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '6px 10px', borderRadius: 7,
                                            background: 'rgba(255,255,255,0.03)',
                                          }}>
                                            <span style={{ fontSize: 11, color: '#64748b', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                              {q.quiz_id}
                                            </span>
                                            <span style={{
                                              fontSize: 12, fontWeight: 700, color,
                                              marginLeft: 8, flexShrink: 0,
                                            }}>
                                              {q.percent}% {q.is_perfect ? '🏆' : ''}
                                            </span>
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}
        {/* ── END STUDENTS TAB ── */}

        {activeTab === 'videos' && <>
        {/* Mobile-only overlay backdrop */}
        {isMobile && mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
          />
        )}
        {/* Left: Course Tree */}
        <div style={{
          width: isMobile ? 280 : isTablet ? 230 : 300,
          flexShrink: 0,
          background: '#0a1628',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          overflow: 'auto',
          display: 'flex', flexDirection: 'column',
          ...(isMobile ? {
            position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
            transform: mobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease',
            paddingTop: 60,
          } : {}),
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
                          onClick={() => { setSelectedLesson(lesson); if (isMobile) setMobileSidebarOpen(false); }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                            padding: isTouch ? '12px 10px 12px 24px' : '7px 10px 7px 24px',
                            borderRadius: 8, cursor: 'pointer',
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
        <div style={{ flex: 1, overflow: 'auto', padding: isMobile ? '16px 14px 80px' : isTablet ? '20px 24px 60px' : '32px 40px' }}>
          {/* Mobile only: floating "Select Lesson" button */}
          {isMobile && (
            <button
              onClick={() => setMobileSidebarOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '13px 16px', borderRadius: 12, cursor: 'pointer', marginBottom: 16,
                background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)',
                color: '#38bdf8', fontSize: 14, fontWeight: 600,
              }}
            >
              <FolderOpen size={16} />
              {selectedLesson ? selectedLesson.title : 'Select a Lesson'}
              <ChevronRight size={15} style={{ marginLeft: 'auto' }} />
            </button>
          )}
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
                  minHeight: 300,
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
