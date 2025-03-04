import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, FormTypes } from "../../model/types";
import "./clientDashboard.css";

const ClientDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("forms");
  const [forms, setForms] = useState<Form[]>([]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="client-dashboard">
      <nav className="client-navbar">
        <div className="client-logo">Client Portal</div>
        <div className="nav-links">
          <button 
            className={`nav-link ${activeTab === 'forms' ? 'active' : ''}`}
            onClick={() => setActiveTab('forms')}
          >
            My Forms
          </button>
          <button 
            className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button 
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="client-content">
        {activeTab === 'forms' && (
          <div className="forms-section">
            <h2>My Forms</h2>
            <div className="forms-grid">
              {FormTypes.map((formType) => (
                <div key={formType} className="form-card">
                  <h3>{formType}</h3>
                  <button className="fill-form-btn">Fill Form</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard; 