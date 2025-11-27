import React, { useState } from "react";
import axios from "axios";
import "./Styles/AdminLogin.css";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Authenticate with backend
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log("Admin login response:", res.data);

      // Check if user is admin
      if (res.data.user.role !== "admin") {
        setErrorMsg("Access denied. Admin only.");
        setLoading(false);
        return;
      }

      // Save token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("username", res.data.user.username);

      setErrorMsg("");
      setLoading(false);

      // Navigate to admin dashboard
      navigate("/admin");
    } catch (err) {
      console.error("Admin login error:", err);
      setErrorMsg(err.response?.data?.message || "Invalid admin credentials!");
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="bg-glow glow1"></div>
      <div className="bg-glow glow2"></div>

      <div className="admin-login-box">
        <h2 className="admin-title">Admin Login</h2>

        <form onSubmit={handleAdminLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-input"
            required
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input"
            required
          />

          {errorMsg && <p className="admin-error">{errorMsg}</p>}

          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
