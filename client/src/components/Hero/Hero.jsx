import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const openMapPage = () => {
    navigate("/map");
  };

  const openLiveSermon = () => {
    window.open("https://livingseed.org/", "_blank");
  };

  return (
    <div className="hero-container">
      <div className="hero-left">
        <div className="hero-title">Jesus House</div>
        <div className="hero-verse">
          Jesus the same yesterday, today and forever (John 14:6)
        </div>
      </div>

      <div className="hero-right">
        <button className="hero-button" onClick={openLiveSermon}>
          Live Sermons
        </button>
        <button className="hero-button" onClick={openMapPage}>
          On-site Sermons
        </button>
      </div>
    </div>
  );
};

export default Hero;
