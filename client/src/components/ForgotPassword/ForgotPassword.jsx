import { useState } from "react";
import { useForgotPasswordMutation } from "../../redux/userAuthApi";
import "./ForgotPassword.css";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await forgotPassword({ email });

    if ("error" in response) {
      toast.error(response.error?.data?.message || response.error?.error || "Something went wrong!");
    } else {
      toast.success(response.data.message || "Check your email for a reset link!");
    }
  };

  return (
    <div className="forgot">
      <form onSubmit={handleSubmit} className="forgot-form">
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="forgot-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="forgot-button" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
