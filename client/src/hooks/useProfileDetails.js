import { useGetProfileQuery } from "../redux/profileUpdateApi";
import profileImage from '../assets/red-profile.jpeg';

const useProfileDetails = () => {
  const { data: profile, error, isLoading, refetch } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true, // Forces refetch on component mount
  });

  let profileImageUrl = profileImage;

  if (profile?.image) {
    const timestamp = new Date().getTime();
    profileImageUrl = `http://localhost:5000${profile.image}?t=${timestamp}`;
  }

  return { profile, profileImageUrl, error, isLoading, refetch };
};

export default useProfileDetails;
