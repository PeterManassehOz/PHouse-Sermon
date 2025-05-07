import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useGetSermonByIdQuery, useUpdateSermonMutation } from '../../redux/sermonsAttribute/sermonAuthApi';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import './EditSermon.css';

const studySchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  preacher: yup.string().required('Preacher is required'),
  date: yup.string().required('Date is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required'),
});

const EditSermon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sermon, isLoading, refetch } = useGetSermonByIdQuery(id);
  const [updateSermon] = useUpdateSermonMutation();

  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const imageRef = useRef();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studySchema),
  });

  const formatDate = (dateString) => dateString?.split("T")[0] || '';

  useEffect(() => {
    if (!sermon) return;
    const { title, preacher, date, category, description, image: imagePath } = sermon;

    reset({
      title: title || '',
      preacher: preacher || '',
      date: formatDate(date),
      category: category || '',
      description: description || '',
    });

    if (imagePath) {
      const imageUrl = `http://localhost:5000/${imagePath}`;
      setImage(imageUrl);
    }
  }, [sermon, reset]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setSelectedFile(null);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const onSubmit = async (data) => {
    try {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      await updateSermon({ id, sermonData: formDataToSend }).unwrap();
      toast.success('Sermon updated successfully');
      refetch();
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update sermon');
    }
  };

  if (isLoading) return <div className="loader-container">Loading...</div>;

  return (
    <form className="edit-sermon-container" onSubmit={handleSubmit(onSubmit)}>
      <label>Title:</label>
      <input className='edit-input' type="text" {...register("title")} />
      {errors.title && <p className="error">{errors.title.message}</p>}

      <label>Preacher:</label>
      <input className='edit-input' type="text" {...register("preacher")} />
      {errors.preacher && <p className="error">{errors.preacher.message}</p>}

      <label>Date:</label>
      <input className='edit-input' type="date" {...register("date")} />
      {errors.date && <p className="error">{errors.date.message}</p>}

      <label>Category:</label>
      <input className='edit-input' type="text" {...register("category")} />
      {errors.category && <p className="error">{errors.category.message}</p>}

      <label>Description:</label>
      <textarea className='edit-input' {...register("description")} />
      {errors.description && <p className="error">{errors.description.message}</p>}

      <div className="image-upload">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={imageRef}
          style={{ display: 'none' }}
        />
        <button type="button" onClick={() => imageRef.current.click()} className="upload-button">
          Choose Image
        </button>

        {image && (
          <div className="preview-image-container">
            <div className="preview-image">
              <img src={image} alt="Uploaded" />
              <FaTimes className="cancel-icon" size={20} color="red" onClick={handleRemoveImage} />
            </div>
          </div>
        )}
      </div>

      <button className="save-button" type="submit">Save</button>
      <button className="cancel-button" type="button" onClick={() => navigate('/admin-dashboard')}>Cancel</button>
    </form>
  );
};

export default EditSermon;
