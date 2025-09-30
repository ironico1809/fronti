import React from 'react';
import './Badge.css';

const Badge = ({ label, variant = 'neutral', className = '' }) => {
  return <span className={`badge badge-${variant} ${className}`.trim()}>{label}</span>;
};

export default Badge;
