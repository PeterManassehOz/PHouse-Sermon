import './BodySermons.css';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Walking with God', image: '/images/arome1.jpeg' },
  { name: 'New creation man', image: '/images/gbileAkanni1.jpeg' },
  { name: 'Getting it right in marriage', image: '/images/orokpoMike.jpeg' },
  { name: 'Dealing with systems', image: '/images/femiLaz1.jpeg' },
];

const BodySermons = () => {
  const navigate = useNavigate();

  // Navigate to the category page
  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className="body-container">

      <h2 className='title'>Categories</h2>

      <div className="category-cards-container">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-card"
            onClick={() => handleCategoryClick(category.name)}
          >
            <img
              src={category.image}
              alt={category.name}
              className="category-card-image"
            />
            <h3 className="category-card-title">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BodySermons;
