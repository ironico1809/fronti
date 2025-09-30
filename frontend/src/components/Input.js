import React from 'react';
import './Input.css';

const Input = ({ label, type = 'text', value, onChange, placeholder, icon, rightElement, ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          className="custom-input"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
        {rightElement && <span className="input-right">{rightElement}</span>}
      </div>
    </div>
  );
};

export default Input;
