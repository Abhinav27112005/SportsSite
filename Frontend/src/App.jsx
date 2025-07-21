import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/public/Home';
import { Members } from './pages/member/Members';
import { Events } from './pages/member/Events';
import { Coaching } from './pages/member/Coaching';
import { Finances } from './pages/member/Finances';
import { Attendance } from './pages/member/Attendance';
import { Navbar } from './components/layout/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Signup from './pages/auth/Signup';
import AuthChecker from './context/AuthChecker';
import Profile from './components/common/Profile';
import AdminPanel from './components/features/admin/AdminPanel';
import AdmissionForm from './pages/public/AdmissionForm';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';
  return (
    <div style={{ paddingTop: !isLoginPage ? '90px' : 0, minHeight: '100vh' }}>
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/members" element={<Members />} />
        <Route path="/events" element={<Events />} />
        <Route path="/coaching" element={<Coaching />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admission" element={<AdmissionForm />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthChecker>
      <AppContent />
    </AuthChecker>
  );
}

export default App;