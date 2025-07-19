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
import "bootstrap-icons/font/bootstrap-icons.css";
import AdminPanel from './components/features/admin/AdminPanel';
import AdmissionForm from './pages/public/AdmissionForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles/App.css';
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';
  const isAdmission=location.pathname === '/admission';
  return (
    <>
        {!isLoginPage && <Navbar />} {/* Hide Navbar on login/signup */}
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
          {isAdmission?null:<Route path="*" element={<div>404 Not Found</div>} />}
        </Routes>
    </>
  );
}

function App() {
  return (
    <>
    <AuthChecker>
      <AppContent />
    </AuthChecker>
    <Routes>
      <Route path='/admission' element={<AdmissionForm />} />
    </Routes>
    </>
  );
}


export default App;