import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BADGES } from '../data/courses';

const UserContext = createContext(null);

const DEFAULT_STATE = {
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
  const thresholds = [500, 1200, 2500, 4500, 7000, 10000, 14000, 19000, 25000, Infinity];
  return thresholds[level - 1];
}

function getXpForCurrentLevel(level) {
  const thresholds = [0, 500, 1200, 2500, 4500, 7000, 10000, 14000, 19000, 25000];
  return thresholds[level - 1];
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skyace_user');
      return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  const [notifications, setNotifications] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    localStorage.setItem('skyace_user', JSON.stringify(user));
  }, [user]);

  const addNotification = useCallback((msg, type = 'xp') => {
    const id = Date.now();
    setNotifications(n => [...n, { id, msg, type }]);
    setTimeout(() => setNotifications(n => n.filter(x => x.id !== id)), 3500);
  }, []);

  const checkBadges = useCallback((nextUser) => {
    const newBadges = [];
    BADGES.forEach(badge => {
      if (nextUser.earnedBadges.includes(badge.id)) return;
      let earned = false;
      if (badge.lessonsRequired && nextUser.completedLessons.length >= badge.lessonsRequired) earned = true;
      if (badge.xpRequired && badge.xpRequired > 0 && nextUser.xp >= badge.xpRequired) earned = true;
      if (badge.streakRequired && nextUser.streak >= badge.streakRequired) earned = true;
      if (badge.moduleRequired && nextUser.completedModules.includes(badge.moduleRequired)) earned = true;
      if (badge.courseRequired && nextUser.completedCourses.includes(badge.courseRequired)) earned = true;
      if (badge.perfect && nextUser.perfectQuizzes.length > 0) earned = true;
      if (earned) newBadges.push(badge.id);
    });
    return newBadges;
  }, []);

  const completeLesson = useCallback((lessonId, xpAmount) => {
    setUser(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const nextXp = prev.xp + xpAmount;
      const prevLevel = getLevel(prev.xp);
      const nextLevel = getLevel(nextXp);
      const nextUser = {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        completedLessons: [...prev.completedLessons, lessonId],
      };
      const newBadges = checkBadges(nextUser);
      if (newBadges.length) {
        nextUser.earnedBadges = [...nextUser.earnedBadges, ...newBadges];
        newBadges.forEach(bid => {
          const badge = BADGES.find(b => b.id === bid);
          if (badge) setTimeout(() => addNotification(`Badge Unlocked: ${badge.icon} ${badge.title}`, 'badge'), 500);
        });
      }
      if (nextLevel > prevLevel) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
        setTimeout(() => addNotification(`Level Up! You're now Level ${nextLevel} 🚀`, 'levelup'), 200);
      }
      addNotification(`+${xpAmount} XP`, 'xp');
      return nextUser;
    });
  }, [addNotification, checkBadges]);

  const completeModule = useCallback((moduleId) => {
    setUser(prev => {
      if (prev.completedModules.includes(moduleId)) return prev;
      const nextUser = { ...prev, completedModules: [...prev.completedModules, moduleId] };
      const newBadges = checkBadges(nextUser);
      if (newBadges.length) {
        nextUser.earnedBadges = [...nextUser.earnedBadges, ...newBadges];
        newBadges.forEach(bid => {
          const badge = BADGES.find(b => b.id === bid);
          if (badge) setTimeout(() => addNotification(`Badge Unlocked: ${badge.icon} ${badge.title}`, 'badge'), 500);
        });
      }
      return nextUser;
    });
  }, [addNotification, checkBadges]);

  const completeCourse = useCallback((courseId) => {
    setUser(prev => {
      if (prev.completedCourses.includes(courseId)) return prev;
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      const nextUser = { ...prev, completedCourses: [...prev.completedCourses, courseId] };
      const newBadges = checkBadges(nextUser);
      if (newBadges.length) {
        nextUser.earnedBadges = [...nextUser.earnedBadges, ...newBadges];
      }
      return nextUser;
    });
  }, [checkBadges]);

  const saveQuizScore = useCallback((quizId, score, total, isPerfect) => {
    setUser(prev => {
      const nextUser = {
        ...prev,
        quizScores: { ...prev.quizScores, [quizId]: { score, total, percent: Math.round((score / total) * 100) } },
        perfectQuizzes: isPerfect && !prev.perfectQuizzes.includes(quizId)
          ? [...prev.perfectQuizzes, quizId]
          : prev.perfectQuizzes,
      };
      const newBadges = checkBadges(nextUser);
      if (newBadges.length) {
        nextUser.earnedBadges = [...nextUser.earnedBadges, ...newBadges];
        newBadges.forEach(bid => {
          const badge = BADGES.find(b => b.id === bid);
          if (badge) setTimeout(() => addNotification(`Badge Unlocked: ${badge.icon} ${badge.title}`, 'badge'), 1000);
        });
      }
      return nextUser;
    });
  }, [addNotification, checkBadges]);

  const enrollInCourse = useCallback((courseId) => {
    setUser(prev => {
      if (prev.enrolledCourses.includes(courseId)) return prev;
      addNotification('Enrolled! Your journey begins 🛫', 'info');
      return { ...prev, enrolledCourses: [...prev.enrolledCourses, courseId] };
    });
  }, [addNotification]);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    setUser(prev => {
      if (prev.lastActiveDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = prev.lastActiveDate === yesterday ? prev.streak + 1 : 1;
      return { ...prev, streak: newStreak, lastActiveDate: today };
    });
  }, []);

  const xpForNextLevel = getXpForNextLevel(user.level);
  const xpForCurrentLevel = getXpForCurrentLevel(user.level);
  const xpProgress = user.xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const levelPercent = Math.min(100, Math.round((xpProgress / xpNeeded) * 100));

  return (
    <UserContext.Provider value={{
      user,
      notifications,
      showConfetti,
      xpForNextLevel,
      xpForCurrentLevel,
      levelPercent,
      completeLesson,
      completeModule,
      completeCourse,
      saveQuizScore,
      enrollInCourse,
      updateStreak,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
