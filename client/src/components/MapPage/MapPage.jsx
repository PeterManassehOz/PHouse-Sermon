import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div>
       <button className="back-button">
              <IoIosArrowBack onClick={() => navigate('/home')}/>
            </button>
      <div className="map-container" style={{ textAlign: "center", marginTop: "60px" }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.9835733585132!2d6.54529977489133!3d9.596682390489093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104c71cc2dd9aecf%3A0x63640f62d2cc59db!2sRCCG%20Jesus%20House!5e0!3m2!1sen!2sng!4v1738229935638!5m2!1sen!2sng"
          width="100%"
          height="800"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default MapPage;
