import React from 'react';
import './DashboardAlert.css';

const DashboardAlert = ({ alerts }) => (
  <div className="dashboard-alert">
    <div className="dashboard-alert-title">Alertas IA</div>
    <ul className="dashboard-alert-list">
      {alerts.map((alert, idx) => (
        <li key={idx} className={`dashboard-alert-item dashboard-alert-${alert.type}`}>
          <span className="dashboard-alert-icon">{alert.icon}</span>
          <span className="dashboard-alert-desc">{alert.desc}</span>
          <span className="dashboard-alert-time">{alert.time}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default DashboardAlert;
