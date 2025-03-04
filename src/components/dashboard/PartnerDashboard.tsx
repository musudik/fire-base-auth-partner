import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ClientService } from "../../db-services/clientService";
import { Client } from "../../model/types";
import "./partnerDashboard.css";

const PartnerDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState("clients");
  const clientService = new ClientService();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    if (currentUser) {
      const clientsList = await clientService.getClientsByPartnerId(currentUser.uid);
      setClients(clientsList);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="partner-dashboard">
      <nav className="partner-navbar">
        <div className="partner-logo">Partner Portal</div>
        <div className="nav-links">
          <button 
            className={`nav-link ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            Client Management
          </button>
          <button 
            className={`nav-link ${activeTab === 'forms' ? 'active' : ''}`}
            onClick={() => setActiveTab('forms')}
          >
            Forms Review
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

      <div className="partner-content">
        {activeTab === 'clients' && (
          <div className="clients-section">
            <h2>Client Management</h2>
            <button className="add-client-btn">Add New Client</button>
            <div className="clients-grid">
              {clients.map((client) => (
                <div key={client.clientId} className="client-card">
                  <h3>{client.personalInformation.firstName} {client.personalInformation.lastName}</h3>
                  <p>Status: {client.personalInformation.status}</p>
                  <div className="client-actions">
                    <button>Edit</button>
                    <button>Delete</button>
                    <button>View Forms</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerDashboard; 