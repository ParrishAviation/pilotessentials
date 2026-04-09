import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetail from './pages/CourseDetail';
import Quiz from './pages/Quiz';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import AIInstructor from './pages/AIInstructor';
import Checkout from './pages/Checkout';

// Blog pages
import BlogIndex from './pages/blog/BlogIndex';
import FAAWrittenTestPrep from './pages/blog/FAAWrittenTestPrep';
import PrivatePilotWrittenTestPrep from './pages/blog/PrivatePilotWrittenTestPrep';
import InstrumentRatingWrittenTestPrep from './pages/blog/InstrumentRatingWrittenTestPrep';
import CommercialPilotWrittenTestPrep from './pages/blog/CommercialPilotWrittenTestPrep';
import CFIWrittenTestPrep from './pages/blog/CFIWrittenTestPrep';
import HowToPassFAAWrittenTest from './pages/blog/HowToPassFAAWrittenTest';
import FAAWrittenPracticeTests from './pages/blog/FAAWrittenPracticeTests';
import FAAWrittenTestQuestions from './pages/blog/FAAWrittenTestQuestions';
import FAAWrittenTestCost from './pages/blog/FAAWrittenTestCost';
import FAAWrittenTestPrepDallas from './pages/blog/FAAWrittenTestPrepDallas';
import FAAWrittenTestPrepTexas from './pages/blog/FAAWrittenTestPrepTexas';

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: '#060f1e',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
    }}>
      <div style={{
        width: 56, height: 56,
        background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
        borderRadius: 16, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 28,
        boxShadow: '0 0 30px rgba(14,165,233,0.4)',
        animation: 'float 2s ease-in-out infinite',
      }}>✈️</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#38bdf8',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
}

// Wraps all authenticated app routes with UserProvider
function AuthenticatedApp() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/quiz/:courseId/:lessonId" element={<Quiz />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route element={<Layout />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/ai-instructor" element={<AIInstructor />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // Public routes (accessible without login)
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth />} />
        {/* Checkout — public so unauthenticated users can browse, login prompt inside */}
        <Route path="/checkout" element={<Checkout />} />
        {/* Blog routes — always public */}
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/faa-written-test-prep" element={<FAAWrittenTestPrep />} />
        <Route path="/private-pilot-written-test-prep" element={<PrivatePilotWrittenTestPrep />} />
        <Route path="/instrument-rating-written-test-prep" element={<InstrumentRatingWrittenTestPrep />} />
        <Route path="/commercial-pilot-written-test-prep" element={<CommercialPilotWrittenTestPrep />} />
        <Route path="/cfi-written-test-prep" element={<CFIWrittenTestPrep />} />
        <Route path="/how-to-pass-faa-written-test" element={<HowToPassFAAWrittenTest />} />
        <Route path="/faa-written-practice-tests" element={<FAAWrittenPracticeTests />} />
        <Route path="/faa-written-test-questions" element={<FAAWrittenTestQuestions />} />
        <Route path="/faa-written-test-cost" element={<FAAWrittenTestCost />} />
        <Route path="/faa-written-test-prep-dallas" element={<FAAWrittenTestPrepDallas />} />
        <Route path="/faa-written-test-prep-texas" element={<FAAWrittenTestPrepTexas />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Authenticated routes
  return (
    <Routes>
      {/* Redirect landing and login to the app if already logged in */}
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/login" element={<Navigate to="/app" replace />} />
      {/* Checkout accessible while logged in */}
      <Route path="/checkout" element={<Checkout />} />
      {/* Blog routes — accessible while logged in too */}
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/faa-written-test-prep" element={<FAAWrittenTestPrep />} />
      <Route path="/private-pilot-written-test-prep" element={<PrivatePilotWrittenTestPrep />} />
      <Route path="/instrument-rating-written-test-prep" element={<InstrumentRatingWrittenTestPrep />} />
      <Route path="/commercial-pilot-written-test-prep" element={<CommercialPilotWrittenTestPrep />} />
      <Route path="/cfi-written-test-prep" element={<CFIWrittenTestPrep />} />
      <Route path="/how-to-pass-faa-written-test" element={<HowToPassFAAWrittenTest />} />
      <Route path="/faa-written-practice-tests" element={<FAAWrittenPracticeTests />} />
      <Route path="/faa-written-test-questions" element={<FAAWrittenTestQuestions />} />
      <Route path="/faa-written-test-cost" element={<FAAWrittenTestCost />} />
      <Route path="/faa-written-test-prep-dallas" element={<FAAWrittenTestPrepDallas />} />
      <Route path="/faa-written-test-prep-texas" element={<FAAWrittenTestPrepTexas />} />
      {/* All other app routes */}
      <Route path="/*" element={<AuthenticatedApp />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
