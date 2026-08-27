import { useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../services/api";

function ForgotPassword() {
  const [formData, setFormData] = useState({ email: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match!");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email: formData.email,
        newPassword: formData.newPassword,
      });

      setSuccess("Password reset successfully! Logging you in...");
      if (res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password. Please check your email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14213D] px-6 py-12">
      <form onSubmit={handleSubmit} className="bg-[#FBFFF1] rounded-3xl p-8 w-full max-w-md shadow-2xl border border-[#C9A66B]/20">
        <h2 className="text-2xl font-serif text-center text-[#14213D] mb-2">Reset Password</h2>
        <p className="text-xs text-gray-500 text-center mb-6">
          Enter your registered email and choose a new password.
        </p>

        {error && <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl mb-4 text-center border border-red-200">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 text-xs p-3 rounded-xl mb-4 text-center border border-green-200">{success}</div>}

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Registered Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A66B]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="At least 6 characters"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A66B]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A66B]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#162e61] text-[#FBFFF1] py-3 rounded-full font-medium hover:bg-[#14213D] transition shadow-md disabled:opacity-50 text-sm"
        >
          {loading ? "Resetting Password..." : "Update Password & Login"}
        </button>

        <div className="flex justify-between items-center text-xs text-center mt-6 text-gray-600 pt-4 border-t border-gray-200">
          <Link to="/login" state={{ from }} className="text-[#162e61] hover:underline font-medium">
            ← Back to Login
          </Link>
          <Link to="/signup" state={{ from }} className="text-[#162e61] hover:underline font-medium">
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
