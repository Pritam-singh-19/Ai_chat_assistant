import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://ai-chat-assistant-j6r6.onrender.com/api/auth/login",
        form
      );

      console.log("Login response:", res.data);

      // Save data in localStorage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // Store username separately for easy access
        if (res.data.user.username) {
          localStorage.setItem("username", res.data.user.username);
          console.log("Stored username:", res.data.user.username);
        }
      }

      setMsg("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="bg-glow glow1"></div>
      <div className="bg-glow glow2"></div>

      <form className="auth-card" onSubmit={handleLogin}>
        <h2 className="auth-title">Welcome Back</h2>

        {msg && <p className="auth-msg">{msg}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="auth-input"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="auth-input"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div
          className="admin-login-link"
          onClick={() => navigate("/admin-login")}
        >
          Admin Login
        </div>

        <button type="submit" className="auth-btn">Login</button>

        <p className="auth-switch">
          Don’t have an account?{" "}
          <span
            className="auth-link"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}
