import { useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // where the user was headed before being sent to login; default "/"
  const from = location.state?.from || "/";

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData);
      login(res.data.user, res.data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }
  // ...rest stays the same

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14213D] px-6">
      <form onSubmit={handleSubmit} className="bg-[#fbfff1ea] rounded-2xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-serif text-center text-[#14213D] mb-6">Welcome Back</h2>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-[#C9A66B]"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:border-[#C9A66B]"
        />

        <button
          type="submit"
          className="w-full bg-[#162e61] text-[#fbfff1ea] py-2 rounded-full font-medium hover:bg-[#172a53] hover:text-[#fbfff1ea] transition"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#162e61] hover:text-[#C9A66B] hover:underline transition">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;