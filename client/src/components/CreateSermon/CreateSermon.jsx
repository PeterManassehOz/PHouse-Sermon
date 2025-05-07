import { useState } from "react";
import { useCreateSermonMutation } from "../../redux/sermonsAttribute/sermonAuthApi";
import "./CreateSermon.css"; // Importing CSS file
import { toast } from 'react-toastify';

const CreateSermon = () => {
  const [createSermon, { isLoading }] = useCreateSermonMutation();
  const [sermonData, setSermonData] = useState({
    title: "",
    preacher: "",
    date: "",
    category: "",
    description: "",
    duration: "",
  });
  const [audioFile, setAudioFile] = useState(null);
  const [image, setImage] = useState(null);
 // const [submittedDescription, setSubmittedDescription] = useState(""); // Stores submitted description for display

  const handleChange = (e) => {
    setSermonData({ ...sermonData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "audioFile") {
      setAudioFile(e.target.files[0]);
    } else if (e.target.name === "image") {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audioFile || !image) {
      alert("Please upload both an audio file and an image.");
      return;
    }

    const formData = {
      ...sermonData,
      audioFile,
      image,
    };

    try {
      const response = await createSermon(formData).unwrap();
      console.log("Sermon created successfully:", response);
      toast.success("Sermon created successfully!");

      // Store submitted description for proper display
    //  setSubmittedDescription(sermonData.description);

      // **Reset form fields**
      setSermonData({
        title: "",
        preacher: "",
        date: "",
        category: "",
        description: "",
        duration: "",
      });
      setAudioFile(null);
      setImage(null);
    } catch (error) {
      console.error("Error creating sermon:", error);
      toast.error("Error creating sermon. Please try again.");
    }
  };

  return (
    <div className="sermon-container">
      <h2>Create a Sermon</h2>
      <form onSubmit={handleSubmit} className="sermon-form">
        <input type="text" name="title" placeholder="Title" value={sermonData.title} onChange={handleChange} required />
        <input type="text" name="preacher" placeholder="Preacher" value={sermonData.preacher} onChange={handleChange} required />
        <input type="date" name="date" value={sermonData.date} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" value={sermonData.category} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={sermonData.description} onChange={handleChange} required></textarea>
        <input type="text" name="duration" placeholder="Duration (e.g., 45 min)" value={sermonData.duration} onChange={handleChange} required />

        {/* Audio File Upload */}
        <label className="custom-file-upload">
          Upload Audio
          <input type="file" name="audioFile" accept="audio/*" onChange={handleFileChange} required />
        </label>
        {audioFile && <p className="file-name">Audio: {audioFile.name}</p>} {/* Show audio file name */}

        {/* Image File Upload */}
        <label className="custom-file-upload">
          Upload Image
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} required />
        </label>
        {image && <p className="file-name">Image: {image.name}</p>} {/* Show image file name */}

        <button type="submit">{isLoading ? "Creating..." : "Create Sermon"}</button>
      </form>

      {/* Display the sermon description properly formatted 
      {submittedDescription && (
        <div className="sermon-description">
          {submittedDescription}
        </div>
      )}*/}
    </div>
  );
};

export default CreateSermon;
