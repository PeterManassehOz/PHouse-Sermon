import { useEffect, useState } from "react";
import "./Footer.css";
import { FaFacebookF } from "react-icons/fa";
import { FaSquareYoutube } from "react-icons/fa6";import { 
  useGetSubscriptionStatusQuery, 
  useSubscribeNewsletterMutation 
} from "../../redux/newsletterAuthApi/newsletterAuthApi";
import { toast } from "react-toastify";

const Footer = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { data, isLoading: isCheckingStatus } = useGetSubscriptionStatusQuery();


  // Subscribe/Unsubscribe API mutation
  const [subscribeNewsletter, { isLoading: isSubscribing }] = useSubscribeNewsletterMutation();

  
  // Update subscription status when data changes
  useEffect(() => {
    if (data) {
      setIsSubscribed(data.subscribed);
    }
  }, [data]);


  const handleSubscription = async () => {
    try {
      await subscribeNewsletter().unwrap();
      setIsSubscribed((prev) => !prev);
      toast.success('Newsletter subscription updated!');
    } catch (err) {
      console.error("Subscription failed:", err);
      toast.error('Newsletter subscription failed');
    }
  };
  
 
  return (
    <footer className="footer-container">
      {/* Left Section */}
      <div className="footer-left">
        <h3 className="church-branch">Jesus House, Minna</h3>
        <div className="contact">Contact</div>
        <div className="phone">+234 80 456 789</div>
        <div className="email">example@example.com</div>
        <div className="footer-icons">
          <FaFacebookF className="footer-icon" />
          <FaSquareYoutube className="footer-icon" />
        </div>
      </div>

      {/* Center Section */}
      <div className="footer-center">
        <h3>Location</h3>
        <p>
          Jesus House Cathedral, Region 41 Headquarters, Broadcasting Road,
          Beside Radio Niger, Tunga, Minna, Niger State
        </p>
      </div>

      {/* Right Section */}
      <div className="footer-right">
        <h3>Stay Connected</h3>
        <div className="email-button">
        <p>Click below to {isSubscribed ? "unsubscribe" : "subscribe"} {isSubscribed ? "from" : "to"} our newsletter.</p>
           <button
              className="subscribe-button"
              onClick={handleSubscription}
              disabled={isSubscribing || isCheckingStatus}
            >
              {isCheckingStatus
                ? "Checking..."
                : isSubscribing
                ? "Processing..."
                : isSubscribed
                ? "Unsubscribe"
                : "Subscribe"}
            </button>
        </div>
        <div className="footer-text">
          <p>© {new Date().getFullYear()} Jesus House. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
