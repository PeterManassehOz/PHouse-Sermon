import { useNavigate } from 'react-router-dom';
import './Recommended.css';
import { useEffect, useState } from 'react';

const Recommended = () => {
  const [sermons, setSermons] = useState([]);
  const [displaySermons, setDisplaySermons] = useState([]);
  const navigate = useNavigate(); // Use the `useNavigate` hook for navigation

  useEffect(() => {
    // Fetch sermons from JSON file
    fetch('http://localhost:5000/sermons/')
      .then((response) => response.json())
      .then((data) => {
        setSermons(data);
        // Display sermons with IDs 10 to 17
        setDisplaySermons(data.slice(0, 4));
      })
      .catch((error) => console.error('Error fetching sermons:', error));
  }, []);

  const handleAudioClick = (sermon) => {
    // Navigate to the single audio page
    navigate(`/audio/${sermon._id}`, { state: sermon });
  };

  console.log('Sermons:', sermons);
  return (
    <div className='recommended-container'>

      <h2 className='recommended-title'>Recommended Sermons</h2>

      {/* Sermons display */}
      <div className="cards-recommended">
        {displaySermons.length > 0 ? (
          displaySermons.map((sermon) => (
            <div
              key={sermon._id}
              className="category-recommended"
              onClick={() => handleAudioClick(sermon)}
            >
              <img
                src={`http://localhost:5000/${sermon.image}`}
                alt={sermon.title}
                className="recommended-card-image"
              />
              <h3 className="recommended-card-title">{sermon.title}</h3>
            </div>
          ))
        ) : (
          <p>Loading sermons...</p>
        )}
      </div>
    </div>
  );
};

export default Recommended;
