import profileImage from '../assets/profile-icon.jpeg'; // Default profile image

const getCommenterImage = (user) => {
  if (!user?.image) return profileImage; // If there's no image, return default

  const timestamp = new Date().getTime();
  return `http://localhost:5000${user.image}?t=${timestamp}`; // Otherwise, return the constructed URL
};

export default getCommenterImage;
