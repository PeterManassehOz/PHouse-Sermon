import { useState, useEffect } from 'react';
import './AdminDashboard.css';
import CreateSermon from '../../components/CreateSermon/CreateSermon';
import ManageSermons from '../../components/ManageSermons/ManageSermons';
import Aggregator from '../../components/Aggregator/Aggregator';
import { MdAddShoppingCart, MdOutlineManageHistory, MdSubscriptions } from "react-icons/md";
import { GrAggregate } from "react-icons/gr";
import { IoLogOut, IoHome, IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminAuthApi } from '../../redux/adminAttribute/adminAuthApi';
import Subscribers from '../../components/Subscribers/Subscribers';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  const goBack = () => {
    setSelectedComponent(null);
  };

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    dispatch(adminAuthApi.util.resetApiState());
    navigate('/admin-login');
  };

  return (
    <div className="dashboard">
      {/* Sidebar (Visible only when no component is selected on small screens) */}
      {(!isSmallScreen || selectedComponent === null) && (
        <div className="sidebar">
          <div onClick={() => navigate('/home')} className="dashboard-title">
            <IoHome className="icon-home" />
            PHouse Sermons
          </div>
          <hr className="title-divider" />
          <ul>
            <li onClick={() => handleComponentChange('aggregator')}>
              <GrAggregate /> Aggregate
            </li>
            <li onClick={() => handleComponentChange('createSermon')}>
              <MdAddShoppingCart /> Create
            </li>
            <li onClick={() => handleComponentChange('manageSermons')}>
              <MdOutlineManageHistory /> Manage
            </li>
            <li onClick={() => handleComponentChange('subscribers')}>
              <MdSubscriptions /> Subscribers
            </li>
          </ul>
          <button className="admin-logout" onClick={logOut}>
            <IoLogOut className="logout-icon" /> Log out
          </button>
        </div>
      )}

      {/* Dashboard Content */}
      <div className={`dashboard-content ${selectedComponent ? 'show' : ''}`}>
        {selectedComponent && isSmallScreen && (
          <button className="back-button" onClick={goBack}>
            <IoArrowBack className="back-icon" />
          </button>
        )}
        {!selectedComponent && !isSmallScreen && <Aggregator />} {/* Default on larger screens */}
        {selectedComponent === 'aggregator' && <Aggregator />}
        {selectedComponent === 'createSermon' && <CreateSermon />}
        {selectedComponent === 'manageSermons' && <ManageSermons />}
        {selectedComponent === 'subscribers' && <Subscribers />}
      </div>
    </div>
  );
};

export default AdminDashboard;
