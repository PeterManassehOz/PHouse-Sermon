import './sermons.css'
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

const Sermons = () => {
  const [sermons, setSermons] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/sermons/')
      .then((response) => response.json())
      .then((data) => setSermons(data))

      .catch((error) => console.error("Error fetching sermons:", error));
  }, []);

  return (
    <div>
      <button className="back-button">
        <IoIosArrowBack onClick={() => navigate('/home')}/>
      </button>
      <h2 className='all-sermons-title'>All Sermons</h2>
      <div className="all-sermons">
        {sermons.length > 0 ? (
        sermons.map((sermon) => (
           <div
           key={sermon._id}
           className="all-sermons-card"
           onClick={() => navigate(`/audio/${sermon._id}`, { state: sermon })}
         >
           <img src={`http://localhost:5000/${sermon.image}`} alt={sermon.title} className="all-sermons-card-image" />
           <h3 className="all-sermons-card-title">{sermon.title}</h3>
         </div>
        ))) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default Sermons;
