import { useGetAggregatedDataQuery } from '../../redux/sermonsAttribute/sermonAuthApi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './Aggregator.css';
import getCommenterImage from "../getCommenterImage";
import Loader from '../Loader/Loader';
import { useState, useEffect } from 'react';




const AggregatedData = () => {
  const { data, error, isLoading } = useGetAggregatedDataQuery();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);


  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    // Adjust pie chart size based on screen width
    const getPieSize = () => {
      if (screenWidth <= 480) {
        return { innerRadius: 20, outerRadius: 30, width: 70, height: 70 };
      } else if (screenWidth <= 768) {
        return { innerRadius: 25, outerRadius: 35, width: 80, height: 80 };
      } else {
        return { innerRadius: 30, outerRadius: 40, width: 90, height: 90 };
      }
    };
  
    const pieSize = getPieSize();
  


  console.log("Aggregated Data Response:", data);
  console.log("Error:", error);

  if (isLoading) return <Loader />;
  if (error) return <p className="error">Error fetching data: {error.message}</p>;

  const maxValue = 1000;

  const dataPoints = [
    { name: 'Views', value: data?.totalViews || 0 },
    { name: 'Likes', value: data?.totalLikes || 0 },
    { name: 'Downloads', value: data?.totalDownloads || 0 },
    { name: 'Sermons', value: data?.totalSermons || 0 },
    { name: 'Comments', value: data?.totalComments || 0 },
  ];

  const chartData = dataPoints.map(item => ({
    ...item,
    percentage: Math.min((item.value / maxValue) * 100, 100),
  }));

  const colors = ['#4F46E5', '#22C55E', '#FACC15', '#EF4444', '#06B6D4'];

  const lastFiveComments = data?.allComments?.slice(-5) || [];

  return (
    <div className="aggregator-container">
      <h2 className="title">Aggregated Sermon Data</h2>
      
      <div className="chart-section">
        {/* Pie Charts */}
        <div className="pie-charts">
            {chartData.map((item, index) => (
              <div key={item.name} className="pie-item">
              <PieChart width={pieSize.width} height={pieSize.height}>
                <Pie
                  data={[{ value: item.percentage }, { value: 100 - item.percentage }]}
                  cx="50%" cy="50%"
                  innerRadius={pieSize.innerRadius}
                  outerRadius={pieSize.outerRadius}
                  startAngle={90} endAngle={-270}
                  dataKey="value"
                >
                  <Cell fill={colors[index]} />
                  <Cell fill="#E5E7EB" />
                </Pie>
              </PieChart>
              <span className="pie-label">
                {item.name}: {item.value} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
            ))}
          </div>
          
        {/* Bar Chart */}
        <div className="bar-chart">
          <ResponsiveContainer width="90%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#555" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0A0A4A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="comments-section">
          <ul className="comments-list">
            {lastFiveComments.map((comment, index) => {
              const user = comment.user?.[0];

              return (
                <li key={index} className="comment-item">
                  <div className="comment-content">
                    {/* Avatar div */}
                    <div className="comment-avatar-container">
                      <img 
                        src={getCommenterImage(user)} 
                        alt={user?.username || "User"} 
                        className="comment-avatar" 
                      />
                    </div>

                    {/* Name & text div */}
                    <div className="comment-text-container">
                      <div className="comment-header">{user?.username || "Anonymous"}</div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

      </div>
    </div>
  );
};

export default AggregatedData;