import { useNavigate } from 'react-router-dom';
import { useDeleteSermonMutation, useGetAllSermonsQuery } from '../../redux/sermonsAttribute/sermonAuthApi';
import Loader from '../Loader/Loader';
import './ManageSermons.css';
import { toast } from 'react-toastify';

const ManageSermons = () => {
  const { data: sermons, refetch, isLoading } = useGetAllSermonsQuery();
  const [deleteSermon] = useDeleteSermonMutation();
  const navigate = useNavigate(); // Hook for navigation

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sermon?')) {
      try {
        await deleteSermon(id).unwrap();
        toast.success('Sermon deleted successfully');
        refetch(); // Refresh data
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete sermon');
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="manage-sermons-container">
      <h2>Manage Sermons</h2>
      {sermons?.map((sermon) => (
        <div key={sermon._id} className="sermon-card">
          <div className="sermon-info">
            <h3>{sermon.title}</h3>
            <p>{sermon.description}</p>
          </div>
          <div className="sermon-actions">
            <button className="edit-button" onClick={() => navigate(`/edit-sermon/${sermon._id}`)}>
              Edit
            </button>
            <button className="delete-button" onClick={() => handleDelete(sermon._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageSermons;
