import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordWithTokenMutation } from "../../redux/userAuthApi";
import "./ResetPasswordWithToken.css";
import { toast } from "react-toastify";

const ResetPasswordWithToken = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPasswordWithToken, { isLoading }] = useResetPasswordWithTokenMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!token) {
      toast.error(response.error?.data?.message || response.error?.error || "Invalid or missing token!");
      return;
    }

    const response = await resetPasswordWithToken({ token, password, confirmPassword });

    if ("error" in response) {
      toast.error(response.error.data?.message || "Something went wrong!");
    } else {
      toast.success(response.data.message || "Password reset successful!");
      navigate("/login");
    }
  };

  return (
    <div className="token">
      <form onSubmit={handleSubmit} className="token-form">
        <h2>Reset</h2>
        <input
          type="password"
          placeholder="Enter new password"
          className="token-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="token-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="token-button" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordWithToken;
