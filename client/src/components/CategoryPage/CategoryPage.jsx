import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './CategoryPage.css';
import { IoIosArrowBack } from 'react-icons/io';
import Loader from '../Loader/Loader';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [filteredSermons, setFilteredSermons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/sermons/')
      .then((response) => response.json())
      .then((data) => {
        setFilteredSermons(data.filter((sermon) => sermon.category.toLowerCase() === categoryName.toLowerCase()));
      })
      .catch((error) => console.error('Error fetching sermons:', error));
  }, [categoryName]);

  return (
    <div className='category-page-container'>
      <button className="back-button" onClick={() => navigate('/home')}>
        <IoIosArrowBack />
      </button>

      <h2 className="category-title">{categoryName}</h2>

      <div className="cards-container">
        {filteredSermons.length > 0 ? (
        filteredSermons.map((sermon) => (
          <div
            key={sermon.id}
            className="card"
            onClick={() => navigate(`/audio/${sermon._id}`, { state: sermon })}
          >
            <img src={`http://localhost:5000/${sermon.image}`} alt={sermon.title} className="card-image" />
            <h3 className="card-title">{sermon.title}</h3>
            {/*<p className="card-description">{sermon.description}</p>*/}
          </div>
        )) ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
