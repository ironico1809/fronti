import React from 'react';
import './DashboardMetric.css';

const DashboardMetric = ({ icon, value, label, trend, trendType = 'neutral' }) => (
  <div className={`dashboard-metric dashboard-metric-${trendType}`}>
    <div className="dashboard-metric-header">
      <span className="dashboard-metric-icon">{icon}</span>
      {trend && <span className={`dashboard-metric-trend dashboard-metric-trend-${trendType}`}>{trend}</span>}
    </div>
    <div className="dashboard-metric-value">{value}</div>
    <div className="dashboard-metric-label">{label}</div>
  </div>
);

export default DashboardMetric;
