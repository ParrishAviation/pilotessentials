import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { BADGES } from '../data/courses'; // fixed path

const UserContext = createContext(null);

const EMPTY_STATE = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  completedLessons: [],
  completedModules: [],
  completedCourses: [],
  earnedBadges: [],
  perfectQuizzes: [],
  enrolledCourses: [],
  quizScores: {},
  chatMessages: 0,
};

function getLevel(xp) {
  if (xp < 500) return 1;
  if (xp < 1200) return 2;
  if (xp < 2500) return 3;
  if (xp < 4500) return 4;
  if (xp < 7000) return 5;
  if (xp < 10000) return 6;
  if (xp < 14000) return 7;
  if (xp < 19000) return 8;
  if (xp < 25000) return 9;
  return 10;
}

function getXpForNextLevel(level) {
  const t = [500, 1200, 2500, 4500, 7000, 10000, 14000, 19000, 25000, Infinity];
  return t[level - 1];
}

function getXpForCurrentLevel(level) {
  const t = [0, 500, 1200, 2500, 4500, 7000, 10000, 14000, 19000, 25000];
  return t[level - 1];
}

export function UserProvider({ children }) {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState(EMPTY_STATE);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streakWarning, setStreakWarning] = useState(false); // show "train today!" warning
  const loadingRef = useRef(false);

  const loadUserData = useCallback(async (userId) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const [
        profileRes, enrolledRes, lessonsRes, modulesRes,
        coursesRes, scoresRes, badgesRes, perfectRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('enrolled_courses').select('course_id').eq('user_id', userId),
        supabase.from('completed_lessons').select('lesson_id, xp_earned').eq('user_id', userId),
        supabase.from('completed_modules').select('module_id').eq('user_id', userId),
        supabase.from('completed_courses').select('course_id').eq('user_id', userId),
        supabase.from('quiz_scores').select('quiz_id, score, total, percent').eq('user_id', userId),
        supabase.from('earned_badges').select('badge_id').eq('user_id', userId),
        supabase.from('perfect_quizzes').select('quiz_id').eq('user_id', userId),
      ]);

      const profile = profileRes.data || {};
      const quizScoresMap = {};
      (scoresRes.data || []).forEach(s => {
        quizScoresMap[s.quiz_id] = { score: s.score, total: s.total, percent: s.percent };
      });

      setUserData({
        xp: profile.xp || 0,
        level: profile.level || 1,
        streak: profile.streak || 0,
        lastActiveDate: profile.last_active_date || null,
        enrolledCourses: (enrolledRes.data || []).map(r => r.course_id),
        completedLessons: (lessonsRes.data || []).map(r => r.lesson_id),
        completedModules: (modulesRes.data || []).map(r => r.module_id),
        completedCourses: (coursesRes.data || []).map(r => r.course_id),
        quizScores: quizScoresMap,
        earnedBadges: (badgesRes.data || []).map(r => r.badge_id),
        perfectQuizzes: (perfectRes.data || []).map(r => r.quiz_id),
        chatMessages: profile.chat_messages || 0,
      });
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      loadingRef.current = false;
      setDataLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      setDataLoaded(false);
      loadUserData(authUser.id);
    } else {
      setUserData(EMPTY_STATE);
      setDataLoaded(true);
    }
  }, [authUser, loadUserData]);

  const addNotification = useCallback((msg, type = 'xp') => {
    const id = Date.now() + Math.random();
    setNotifications(n => [...n, { id, msg, type }]);
    setTimeout(() => setNotifications(n => n.filter(x => x.id !== id)), 3500);
  }, []);

  const checkAndAwardBadges = useCallback(async (nextState) => {
    const newBadges = [];
    BADGES.forEach(badge => {
      if (nextState.earnedBadges.includes(badge.id)) return;
      let earned = false;
      if (badge.lessonsRequired > 0 && nextState.completedLessons.length >= badge.lessonsRequired) earned = true;
      if (badge.xpRequired > 0 && nextState.xp >= badge.xpRequired) earned = true;
      if (badge.streakRequired && nextState.streak >= badge.streakRequired) earned = true;
      if (badge.moduleRequired && nextState.completedModules.includes(badge.moduleRequired)) earned = true;
      if (badge.courseRequired && nextState.completedCourses.includes(badge.courseRequired)) earned = true;
      if (badge.perfect && nextState.perfectQuizzes.length > 0) earned = true;
      if (badge.perfectCount && nextState.perfectQuizzes.length >= badge.perfectCount) earned = true;
      if (badge.chatRequired && (nextState.chatMessages || 0) >= badge.chatRequired) earned = true;
      if (badge.streakComeback && nextState.streak >= 1 && nextState._comeback) earned = true;
      if (earned) newBadges.push(badge.id);
    });

    if (newBadges.length && authUser) {
      await supabase.from('earned_badges').insert(
        newBadges.map(badge_id => ({ user_id: authUser.id, badge_id }))
      );
      newBadges.forEach(bid => {
        const badge = BADGES.find(b => b.id === bid);
        if (badge) setTimeout(() => addNotification(`Badge Unlocked: ${badge.icon} ${badge.title}`, 'badge'), 600);
      });
    }
    return newBadges;
  }, [authUser, addNotification]);

  const updateProfile = useCallback(async (updates) => {
    if (!authUser) return;
    await supabase.from('profiles').update(updates).eq('id', authUser.id);
  }, [authUser]);

  const completeLesson = useCallback(async (lessonId, xpAmount) => {
    if (!authUser || userData.completedLessons.includes(lessonId)) return;
    const newXp = userData.xp + xpAmount;
    const prevLevel = getLevel(userData.xp);
    const newLevel = getLevel(newXp);
    const newLessons = [...userData.completedLessons, lessonId];

    setUserData(prev => ({ ...prev, xp: newXp, level: newLevel, completedLessons: newLessons }));
    addNotification(`+${xpAmount} XP`, 'xp');

    if (newLevel > prevLevel) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setTimeout(() => addNotification(`Level Up! You're now Level ${newLevel} 🚀`, 'levelup'), 300);
    }

    await Promise.all([
      supabase.from('completed_lessons').upsert({ user_id: authUser.id, lesson_id: lessonId, xp_earned: xpAmount }),
      updateProfile({ xp: newXp, level: newLevel }),
    ]);

    const nextState = { ...userData, xp: newXp, level: newLevel, completedLessons: newLessons };
    const newBadges = await checkAndAwardBadges(nextState);
    if (newBadges.length) setUserData(prev => ({ ...prev, earnedBadges: [...prev.earnedBadges, ...newBadges] }));
  }, [authUser, userData, addNotification, updateProfile, checkAndAwardBadges]);

  const completeModule = useCallback(async (moduleId) => {
    if (!authUser || userData.completedModules.includes(moduleId)) return;
    const newModules = [...userData.completedModules, moduleId];
    setUserData(prev => ({ ...prev, completedModules: newModules }));
    addNotification('Module Complete! 🎓', 'badge');
    await supabase.from('completed_modules').upsert({ user_id: authUser.id, module_id: moduleId });
    const newBadges = await checkAndAwardBadges({ ...userData, completedModules: newModules });
    if (newBadges.length) setUserData(prev => ({ ...prev, earnedBadges: [...prev.earnedBadges, ...newBadges] }));
  }, [authUser, userData, checkAndAwardBadges, addNotification]);

  const completeCourse = useCallback(async (courseId) => {
    if (!authUser || userData.completedCourses.includes(courseId)) return;
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
    const newCourses = [...userData.completedCourses, courseId];
    setUserData(prev => ({ ...prev, completedCourses: newCourses }));
    await supabase.from('completed_courses').upsert({ user_id: authUser.id, course_id: courseId });
    const newBadges = await checkAndAwardBadges({ ...userData, completedCourses: newCourses });
    if (newBadges.length) setUserData(prev => ({ ...prev, earnedBadges: [...prev.earnedBadges, ...newBadges] }));
  }, [authUser, userData, checkAndAwardBadges]);

  const saveQuizScore = useCallback(async (quizId, score, total, isPerfect) => {
    if (!authUser) return;
    const percent = Math.round((score / total) * 100);
    const newScores = { ...userData.quizScores, [quizId]: { score, total, percent } };
    const newPerfect = isPerfect && !userData.perfectQuizzes.includes(quizId)
      ? [...userData.perfectQuizzes, quizId] : userData.perfectQuizzes;

    // XP for quiz performance
    let quizXp = 0;
    if (percent === 100) quizXp = 150;
    else if (percent >= 90) quizXp = 100;
    else if (percent >= 80) quizXp = 75;
    else if (percent >= 70) quizXp = 50;

    const newXp = userData.xp + quizXp;
    const prevLevel = getLevel(userData.xp);
    const newLevel = getLevel(newXp);

    setUserData(prev => ({ ...prev, quizScores: newScores, perfectQuizzes: newPerfect, xp: newXp, level: newLevel }));

    if (quizXp > 0) {
      addNotification(`+${quizXp} XP`, 'xp');
    }
    if (newLevel > prevLevel) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setTimeout(() => addNotification(`Level Up! You're now Level ${newLevel} 🚀`, 'levelup'), 300);
    }

    await Promise.all([
      supabase.from('quiz_scores').upsert({
        user_id: authUser.id, quiz_id: quizId, score, total, percent, is_perfect: isPerfect,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,quiz_id' }),
      supabase.from('quiz_attempts').insert({
        user_id: authUser.id, quiz_id: quizId, score, total, percent, is_perfect: isPerfect,
      }),
      quizXp > 0 && updateProfile({ xp: newXp, level: newLevel }),
    ]);

    if (isPerfect && !userData.perfectQuizzes.includes(quizId)) {
      await supabase.from('perfect_quizzes').upsert({ user_id: authUser.id, quiz_id: quizId });
    }

    const nextState = { ...userData, quizScores: newScores, perfectQuizzes: newPerfect, xp: newXp };
    const newBadges = await checkAndAwardBadges(nextState);
    if (newBadges.length) setUserData(prev => ({ ...prev, earnedBadges: [...prev.earnedBadges, ...newBadges] }));

    return quizXp;
  }, [authUser, userData, addNotification, updateProfile, checkAndAwardBadges]);

  const enrollInCourse = useCallback(async (courseId) => {
    if (!authUser || userData.enrolledCourses.includes(courseId)) return;
    setUserData(prev => ({ ...prev, enrolledCourses: [...prev.enrolledCourses, courseId] }));
    addNotification('Enrolled! Your journey begins 🛫', 'info');
    await supabase.from('enrolled_courses').upsert({ user_id: authUser.id, course_id: courseId });
  }, [authUser, userData, addNotification]);

  // Returns { isNew, isComeback, streakXp, newStreak } for use by callers
  const updateStreak = useCallback(async () => {
    if (!authUser) return {};
    const today = new Date().toISOString().split('T')[0];
    if (userData.lastActiveDate === today) {
      // Check if we should show warning (streak > 0 but already trained today = no warning)
      setStreakWarning(false);
      return {};
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const isComeback = userData.lastActiveDate !== yesterday && userData.lastActiveDate !== null && userData.streak > 0;
    const newStreak = userData.lastActiveDate === yesterday ? userData.streak + 1 : 1;

    // Streak XP bonus
    let streakXp = 0;
    if (newStreak === 3) streakXp = 50;
    else if (newStreak === 7) streakXp = 150;
    else if (newStreak === 14) streakXp = 300;
    else if (newStreak === 30) streakXp = 750;
    else if (newStreak > 1) streakXp = 25; // daily bonus for maintaining

    const newXp = userData.xp + streakXp;
    const prevLevel = getLevel(userData.xp);
    const newLevel = getLevel(newXp);

    setUserData(prev => ({ ...prev, streak: newStreak, lastActiveDate: today, xp: newXp, level: newLevel }));
    setStreakWarning(false);

    if (isComeback) {
      addNotification(`Welcome back! 2x XP today 🔥`, 'streak');
    } else if (newStreak === 7) {
      addNotification(`🔥 7-day streak! +${streakXp} XP`, 'streak');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (newStreak === 14 || newStreak === 30) {
      addNotification(`🔥 ${newStreak}-day streak! +${streakXp} XP`, 'streak');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (newStreak > 1 && streakXp > 0) {
      addNotification(`🔥 ${newStreak}-day streak! +${streakXp} XP`, 'streak');
    }

    if (newLevel > prevLevel) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setTimeout(() => addNotification(`Level Up! You're now Level ${newLevel} 🚀`, 'levelup'), 400);
    }

    await updateProfile({ streak: newStreak, last_active_date: today, xp: newXp, level: newLevel });

    // Check streak-based badges
    const nextState = { ...userData, streak: newStreak, xp: newXp, _comeback: isComeback };
    const newBadges = await checkAndAwardBadges(nextState);
    if (newBadges.length) setUserData(prev => ({ ...prev, earnedBadges: [...prev.earnedBadges, ...newBadges] }));

    return { isNew: true, isComeback, streakXp, newStreak };
  }, [authUser, userData, addNotification, updateProfile, checkAndAwardBadges]);

  // Check streak warning — call when user visits without having trained yet today
  const checkStreakWarning = useCallback(() => {
    if (!userData.streak || !userData.lastActiveDate) return;
    const today = new Date().toISOString().split('T')[0];
    if (userData.lastActiveDate === today) { setStreakWarning(false); return; }
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (userData.lastActiveDate === yesterday && userData.streak >= 2) {
      setStreakWarning(true);
    }
  }, [userData.streak, userData.lastActiveDate]);

  // Award XP for chat engagement
  const awardChatXp = useCallback(async () => {
    if (!authUser) return;
    const XP_PER_MESSAGE = 10;
    const MAX_CHAT_XP_PER_DAY = 50; // cap at 5 messages worth per day

    // Simple daily cap via profile field
    const newChatMessages = (userData.chatMessages || 0) + 1;
    const chatXpToday = Math.min(XP_PER_MESSAGE, Math.max(0, MAX_CHAT_XP_PER_DAY - ((userData.chatMessages || 0) * XP_PER_MESSAGE)));
    if (chatXpToday <= 0) return;

    const newXp = userData.xp + chatXpToday;
    const prevLevel = getLevel(userData.xp);
    const newLevel = getLevel(newXp);

    setUserData(prev => ({ ...prev, xp: newXp, level: newLevel, chatMessages: newChatMessages }));
    addNotification(`+${chatXpToday} XP`, 'xp');

    if (newLevel > prevLevel) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setTimeout(() => addNotification(`Level Up! You're now Level ${newLevel} 🚀`, 'levelup'), 300);
    }

    await updateProfile({ xp: newXp, level: newLevel, chat_messages: newChatMessages });

    const nextState = { ...userData, xp: newXp, chatMessages: newChatMessages };
    const newBadges = await checkAndAwardBadges(nextState);
    if (newBadges.length) setUserData(prev => ({ ...prev, earnedBadges: [...prev.earnedBadges, ...newBadges] }));
  }, [authUser, userData, addNotification, updateProfile, checkAndAwardBadges]);

  const xpForNextLevel = getXpForNextLevel(userData.level);
  const xpForCurrentLevel = getXpForCurrentLevel(userData.level);
  const levelPercent = Math.min(100, Math.round(
    ((userData.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
  ));

  const triggerConfetti = useCallback((duration = 3500) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), duration);
  }, []);

  return (
    <UserContext.Provider value={{
      user: userData,
      dataLoaded,
      notifications,
      showConfetti,
      streakWarning,
      xpForNextLevel,
      xpForCurrentLevel,
      levelPercent,
      completeLesson,
      completeModule,
      completeCourse,
      saveQuizScore,
      enrollInCourse,
      updateStreak,
      checkStreakWarning,
      awardChatXp,
      triggerConfetti,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
