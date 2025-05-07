import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import Signup from './pages/Signup/Signup';
import About from './pages/About/About';
import Sermons from './pages/Sermons/Sermons';
import Navbar from './components/Navbar/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hero from './components/Hero/Hero';
import './App.css';
import CategoryPage from './components/CategoryPage/CategoryPage';
import SingleAudio from './components/SingleAudio/SingleAudio';
import MapPage from './components/MapPage/MapPage';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPasswordWithToken from './components/ResetPasswordWithToken/ResetPasswordWithToken';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminSignup from './pages/AdminSignup/AdminSignup';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import EditSermon from './components/EditSermon/EditSermon';




const App = () => {
  return (
      <Router>
        <ToastContainer />
        <Layout />
      </Router>
  );
};

const Layout = () => {
  const location = useLocation(); // Get the current route path

  const isHomePage = location.pathname === '/home'; // Show Navbar only on '/home' route

  return (
    <div className="App">
      {isHomePage && (
        <div className="hero-background"> {/* Shared container for Navbar and Hero */}
          <Navbar />
          <Hero />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sermons" element={<Sermons />} />
        <Route path="/about" element={<About />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/audio/:id" element={<SingleAudio />} />
        <Route path="/map" element={<MapPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPasswordWithToken />} />
        <Route path="/edit-sermon/:id" element={<EditSermon />} />
        <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/admin-signup' element={<AdminSignup />} />
      </Routes>
    </div>
  );
};

export default App;