import './Navbar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import useProfileDetails from '../../hooks/useProfileDetails';

const Navbar = () => {
  const { profile, profileImageUrl } = useProfileDetails();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className='navbar'>
      <div className='image-logo'>
        <img src={profileImageUrl} className='home-image' alt="" />
        <div className='nav-profile-name'>{profile?.firstname}</div>
      </div>

      {/* Hamburger Button (always visible) */}
      {!menuOpen && (
        <button className="hamburger-bar" onClick={() => setMenuOpen(true)}>
          <FaBars />
        </button>
      )}

      {/* Menu */}
      <div className={`menu ${menuOpen ? 'open' : ''}`}>
        {/* Close Button (inside menu) */}
        <button className="hamburger-cancel" onClick={() => setMenuOpen(false)}>
          <FaTimes />
        </button>

        {isAdmin && <Link to="/admin-dashboard">Admin</Link>}
        <Link to="/sermons">Sermons</Link>
        <Link to="/about">About</Link>
        {!isAdmin &&
          <Link to="/profile">Profile</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
