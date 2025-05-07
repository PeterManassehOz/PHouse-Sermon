import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  useGetSermonByIdQuery, 
  useLikeSermonMutation, 
  useAddCommentMutation, 
  useDeleteCommentMutation, 
  useIncrementViewMutation,
  useIncrementDownloadMutation 
} from "../../redux/sermonsAttribute/sermonAuthApi";
import Loader from "../Loader/Loader";
import { IoIosArrowBack } from "react-icons/io";
import "./SingleAudio.css";
import { MdDownload } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";
import getCommenterImage from "../getCommenterImage";
import { format, differenceInDays } from "date-fns";




const SingleAudio = () => {
  const location = useLocation();
  const sermonId = location.state?._id;
  const { data: sermon, refetch } = useGetSermonByIdQuery(sermonId);
  const [likeSermon] = useLikeSermonMutation();
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [incrementView] = useIncrementViewMutation();
  const [incrementDownload] = useIncrementDownloadMutation();
  const [comment, setComment] = useState("");
  const [showDelete, setShowDelete] = useState(null);
  const navigate = useNavigate();
  const [deleteTimeout, setDeleteTimeout] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  


  useEffect(() => {
    if (sermonId) {
      incrementView(sermonId);
    }
  }, [sermonId, incrementView]);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedSermons")) || {};
    if (storedLikes[sermonId]) {
      setIsLiked(true);
    }
  }, [sermonId]);

  const handleLike = async () => {
    await likeSermon(sermonId);
    setIsLiked((prev) => {
      const updatedLikedState = !prev;
      const storedLikes = JSON.parse(localStorage.getItem("likedSermons")) || {};
      storedLikes[sermonId] = updatedLikedState; // Store liked status per sermon ID
      localStorage.setItem("likedSermons", JSON.stringify(storedLikes));
      return updatedLikedState;
    });
    refetch();
  };
  

  const handleComment = async () => {
    if (comment.trim()) {
      await addComment({ id: sermonId, text: comment });
      setComment("");
      refetch();
    }
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment({ sermonId, commentId });
    setShowDelete(null);
    clearTimeout(deleteTimeout);
    refetch();
  };

  const handleDownload = async () => {
    console.log(`Attempting to increment download count for sermon ID: ${sermonId}`);
    await incrementDownload(sermonId);

    const link = document.createElement("a");
    link.href = `http://localhost:5000/${sermon.audioFile}`;
    link.download = `${sermon.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    refetch();
  };

  let timer;
  const handleMouseDown = (commentId) => {
    timer = setTimeout(() => {
      setShowDelete(commentId);
      const timeout = setTimeout(() => {
        setShowDelete(null);
      }, 10000); 
      setDeleteTimeout(timeout);
    }, 1000);
  };

  const handleMouseUp = () => {
    clearTimeout(timer);
  };

  // Function to format comment timestamps
 
  const formatCommentTime = (timestamp) => {
    const commentDate = new Date(timestamp);
    const now = new Date();
    const daysDifference = differenceInDays(now, commentDate);
  
    if (daysDifference === 0) {
      return format(commentDate, "h:mm a"); // Show hour and minute for today
    } else if (daysDifference === 1) {
      return `Yesterday, ${format(commentDate, "h:mm a")}`; // Show "Yesterday" and time
    } else if (daysDifference < 7) {
      return `${format(commentDate, "EEEE, h:mm a")}`; // Show weekday and time
    } else {
      return format(commentDate, "EEEE, dd/MM/yyyy, h:mm a"); // Show day, date, and time
    }
  };

  return (
    <div>
      {sermon ? (
        <>
          <button className="back-button" onClick={() => navigate(-1)}>
            <IoIosArrowBack />
          </button>
          <div className="audio-container">
            <h2 className="audio-title">{sermon.title}</h2>
            <p className="audio-category">{sermon.category}</p>

            {/* Fetching from backend */}
            <img src={`http://localhost:5000/${sermon.image}`} alt={sermon.title} className="audio-image" />

            <audio controls className="audio-player">
              <source src={`http://localhost:5000/${sermon.audioFile}`} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>

            <p className="audio-preacher">{sermon.preacher}</p>
          </div>

          <div className="sermon-body">
            <div className="action-buttons">
              <div className="view-count">{sermon.views} views</div>     
              <div className="like-icon" onClick={handleLike}>
                {isLiked ? "❤️" : "🤍"}
                <div className="like-count">{sermon.likes?.length || 0}</div>
              </div>

              <div onClick={handleDownload}>
                <MdDownload className="download-icon" />
              </div>
            </div>

            <div className="comment-section">
              <h3>Comments ({sermon.comments?.length || 0})</h3>
              <div className="comment-input-container">
                <textarea
                  className="comment-input"
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                />
                <div className="comment-button" onClick={handleComment}>
                  <RiSendPlaneFill className="send-icon" />
                </div>
              </div>
              
              {sermon.comments?.length > 0 ? (
                  [...sermon.comments].reverse().map((c) => ( // Reverse the comments array
                    <div
                      className="comment"
                      key={c._id}
                      onMouseDown={() => handleMouseDown(c._id)}
                      onMouseUp={handleMouseUp}
                    >
                      <div className="comment-content">
                        {/* Display Commenter's Image */}
                        <img
                          src={getCommenterImage(c.userId)}
                          alt={c.userId?.username}
                          className="commenter-image"
                        />
                        <div className="comment-details">
                          <div className="comment-username">{c.userId?.username ? c.userId.username : "Admin"}:</div>
                          <div className="comment-text">{c.text}</div>
                        </div>
                        <div className="comment-time">
                          {formatCommentTime(c.createdAt)}
                        </div>
                      </div>

                      {showDelete === c._id && (
                        <button onClick={() => handleDeleteComment(c._id)}>Delete</button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}

            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default SingleAudio;
