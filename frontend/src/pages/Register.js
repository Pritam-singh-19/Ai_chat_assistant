import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Styles/Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://ai-chat-assistant-j6r6.onrender.com/api/auth/register",
        form
      );

      setMsg("Registration successful! Redirecting...");
      setMsgType("success");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed! Please try again.";

      setMsg(errorMessage);
      setMsgType("error");
    }
  };

  return (
    <div className="auth-page">
      <div className="bg-glow glow1"></div>
      <div className="bg-glow glow2"></div>

      <form className="auth-card" onSubmit={handleRegister}>
        <h2 className="auth-title">Create Account</h2>

        {/* Dynamic message */}
        {msg && (
          <p className={`auth-msg ${msgType === "success" ? "msg-success" : "msg-error"}`}>
            {msg}
          </p>
        )}

        <input
          name="username"
          type="text"
          placeholder="Full Name"
          className="auth-input"
          value={form.username}
          onChange={handleChange}
          required
        />

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

        <button type="submit" className="auth-btn">
          Register
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span
            className="auth-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
