import React, { useState, useEffect } from "react";
import axios from "axios";
import DocumentManager from "../components/DocumentManager";
import "./Styles/AdminPage.css";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalChats: 0,
    modelUsage: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview or documents

  const token = localStorage.getItem("token");

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh data
      fetchUsers();
      fetchAnalytics();
      alert("User deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleClearAllChats = async () => {
    if (!window.confirm("Are you sure you want to clear all chat sessions?")) return;

    try {
      await axios.delete("http://localhost:5000/api/admin/clear-chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchAnalytics();
      fetchUsers();
      alert("All chats cleared successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to clear chats");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      window.location.href = "/admin-login";
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <h2>Error: {error}</h2>
        <p>Make sure you're logged in as an admin.</p>
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper">
      <div className="bg-glow glow1"></div>
      <div className="bg-glow glow2"></div>

      <div className="admin-container">
        <div className="admin-header">
        <h1 className="admin-title">🛡️ Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === "documents" ? "active" : ""}`}
          onClick={() => setActiveTab("documents")}
        >
          📚 Documents
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          {/* Analytics Cards */}
          <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Users</h3>
          <p className="stat-number">{analytics.totalUsers}</p>
        </div>

        <div className="analytics-card">
          <h3>Active Users</h3>
          <p className="stat-number">{analytics.activeUsers}</p>
        </div>

        <div className="analytics-card">
          <h3>Total Chats</h3>
          <p className="stat-number">{analytics.totalChats}</p>
        </div>
      </div>

      {/* Model Usage Stats */}
      <div className="card">
        <h3>📊 Model Usage Statistics</h3>
        {analytics.modelUsage.length > 0 ? (
          <div className="model-stats">
            {analytics.modelUsage.map((model) => (
              <div key={model.model} className="model-stat-row">
                <span className="model-name">{model.model.toUpperCase()}</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${model.percentage}%` }}
                  ></div>
                </div>
                <span className="model-percentage">{model.percentage}%</span>
                <span className="model-count">({model.count} sessions)</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No chat sessions yet</p>
        )}
      </div>

      {/* Users List */}
      <div className="card">
        <h3>👥 Registered Users</h3>

        {users.length > 0 ? (
          <div className="users-table">
            <div className="table-header">
              <span>Username</span>
              <span>Email</span>
              <span>Role</span>
              <span>Chats</span>
              <span>Action</span>
            </div>

            {users.map((user) => (
              <div key={user.id} className="table-row">
                <span>{user.username}</span>
                <span>{user.email}</span>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
                <span>{user.chats}</span>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={user.role === "admin"}
                >
                  {user.role === "admin" ? "Protected" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No users found</p>
        )}
      </div>

          {/* System Controls */}
          <div className="card">
            <h3>⚙️ System Controls</h3>
            <button className="action-btn danger" onClick={handleClearAllChats}>
              Clear All Chat Sessions
            </button>
          </div>
        </>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <DocumentManager />
      )}
      </div>
    </div>
  );
}
