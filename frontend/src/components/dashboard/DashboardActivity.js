import React from 'react';
import './DashboardActivity.css';

const DashboardActivity = ({ activities }) => (
  <div className="dashboard-activity">
    <div className="dashboard-activity-title">Actividad Reciente</div>
    <ul className="dashboard-activity-list">
      {activities.map((item, idx) => (
        <li key={idx} className={`dashboard-activity-item dashboard-activity-${item.type}`}>
          <span className="dashboard-activity-icon">{item.icon}</span>
          <span className="dashboard-activity-desc">{item.desc}</span>
          <span className="dashboard-activity-time">{item.time}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default DashboardActivity;
