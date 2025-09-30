import React from 'react';
import './DashboardQuickAction.css';

const DashboardQuickAction = ({ icon, label, onClick }) => (
  <button className="dashboard-quick-action" onClick={onClick}>
    <span className="dashboard-quick-action-icon">{icon}</span>
    <span className="dashboard-quick-action-label">{label}</span>
  </button>
);

export default DashboardQuickAction;
