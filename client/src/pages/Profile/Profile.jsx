import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import ProfileLeft from '../../components/profilePage/profileLeft/profileLeft';
import ProfileRight from '../../components/profilePage/profileRight/profileRight';
import ResetPassword from '../../components/resetPassword/resetPassword';
import { setActiveComponent } from '../../redux/activeComponentSlice'; 
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const activeComponent = useSelector((state) => state.activeComponent.value);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [visibleComponent, setVisibleComponent] = useState(
    isMobile ? null : 'ProfileRight' // Default to ProfileRight on large screens
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 1024;
      setIsMobile(mobileView);

      // Ensure ProfileRight is visible on larger screens
      if (!mobileView && !activeComponent) {
        setVisibleComponent('ProfileRight');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeComponent]);

  // Immediately update visibleComponent without delay
  useEffect(() => {
    if (activeComponent !== visibleComponent) {
      setIsTransitioning(true);
      setVisibleComponent(activeComponent);
      setIsTransitioning(false);
    }
  }, [activeComponent, visibleComponent]);

  // Function to handle going back
  const handleBack = () => {
    dispatch(setActiveComponent(null)); // Instantly reset active component
  };

  // Render selected component
  const renderComponent = () => {
    if (!isMobile && (visibleComponent === 'ProfileRight' || !visibleComponent)) {
      return <ProfileRight />; // Always show ProfileRight by default on large screens
    }
  
    switch (visibleComponent) {
      case 'ResetPassword':
        return <ResetPassword onBack={isMobile ? handleBack : undefined} />;
      case 'ProfileRight':
        return <ProfileRight onBack={isMobile ? handleBack : undefined} />;
      default:
        return null;
    }
  };
  
  return (
    <div className={`profile ${isMobile && activeComponent ? 'hide-left' : ''}`}>
      {!isMobile || !activeComponent ? <ProfileLeft /> : null}
      <div className={`transition-wrapper ${isTransitioning ? 'transitioning' : 'visible'}`}>
        {renderComponent()}
      </div>
    </div>
  );
};

export default Profile;
