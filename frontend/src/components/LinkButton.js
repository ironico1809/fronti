import React from 'react';
import './LinkButton.css';

const LinkButton = ({ children, href, onClick, className = '', ...props }) => {
  return (
    <a
      className={`link-button ${className}`}
      href={href}
      onClick={onClick}
      {...props}
    >
      {children}
    </a>
  );
};

export default LinkButton;
