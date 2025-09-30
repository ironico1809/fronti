import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button className={`custom-button ${className}`} type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
