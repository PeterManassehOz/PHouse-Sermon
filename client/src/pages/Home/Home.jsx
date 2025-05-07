import BodySermons from '../../components/BodySermons/BodySermons';
import Footer from '../../components/Footer/Footer';
import Recommended from '../../components/Recommended/Recommended';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="body-section">
        <BodySermons />
      </div>

      <div className="recommended-section">
        <Recommended />
      </div>

      <div className="footer-section">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
