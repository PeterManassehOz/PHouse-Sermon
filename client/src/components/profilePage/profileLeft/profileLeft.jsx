import './profileLeft.css';
import { FaUnlockKeyhole } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { IoIosPerson } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { setActiveComponent } from '../../../redux/activeComponentSlice';
import { IoHome } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Loader from '../../Loader/Loader';
import useProfileDetails from '../../../hooks/useProfileDetails';
import { profileUpdateApi } from '../../../redux/profileUpdateApi';


//import { useSelector } from 'react-redux';



 
const ProfileLeft = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { profile, profileImageUrl, error, isLoading } = useProfileDetails();

  if (isLoading) {
    return <div className="loader-container">{Loader()}</div>;
  }


  if (error) {
    return <div>Error loading profile.</div>;
  }


  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('phcode');
    dispatch(profileUpdateApi.util.resetApiState()); // Clears RTK Query cache
    navigate('/login');
  };

  return (
    <div className="profile-left">
      <div className="profile-details">
      <button className="home-icon" onClick={() => navigate('/home')}>
        <IoHome />
      </button>


        <div className="details">
        <img className="profile-image" src={profileImageUrl} alt="Profile picture" />
          <div className="name-church">
            <div className="name">
              <div className="firstname">{profile.firstname || ""}</div>
              <div className="lastname">{profile.lastname || ""}</div>
            </div>
            <div className="branch">{profile.churchbranch ||  ""}</div>
          </div>
        </div>

        <div className="profile-menu">

          <div className='menu-item'>
            <IoIosPerson className='menu-icon'/>
            <button onClick={() => dispatch(setActiveComponent('ProfileRight'))}>
              Personal Information
            </button>
          </div>

          <div className="menu-item">
            <FaUnlockKeyhole className="menu-icon" />
            <button onClick={() => dispatch(setActiveComponent('ResetPassword'))}>
              Password Reset
            </button>
          </div>

          <div className="menu-item">
            <IoLogOut className="menu-icon" />
            <button onClick={logOut}>
              Log out
            </button>
          </div>


        </div>

      </div>
    </div>
  );
};

export default ProfileLeft;
