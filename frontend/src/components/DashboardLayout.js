
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import '../pages/Dashboard.css';

// Header bar del Dashboard con nombres propios y elementos estables
const DashboardHeaderBar = ({ sidebarCollapsed }) => (
  <div className="dashboard-header-bar">
    <div className="dashboard-logo">
      <span className="dashboard-logo-icon">
        <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo Smart Condominium" style={{width:'40px',height:'40px',borderRadius:'8px'}} />
      </span>
      <span className="dashboard-logo-title">Smart Condominium</span>
    </div>
    <div className="dashboard-user-info">
      <div className="dashboard-user-details">
        <div className="dashboard-user-name">Juan Pérez</div>
        <div className="dashboard-user-role">Administrador</div>
      </div>
    </div>
  </div>
);

// Botón Hamburguesa con posicionamiento fijo
const HamburgerButton = ({ isCollapsed, onClick }) => (
  <button 
    className={`hamburger-menu ${isCollapsed ? 'sidebar-closed' : ''}`}
    onClick={onClick}
    aria-label="Alternar menú lateral"
  >
    <div className="hamburger-line"></div>
    <div className="hamburger-line"></div>
    <div className="hamburger-line"></div>
  </button>
);

// Layout principal del dashboard
const DashboardLayout = ({ children }) => {
  // Estado para el control del menú lateral
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Función para alternar la visibilidad del menú lateral
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  return (
    <div className={`dashboard-bg ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <HamburgerButton 
        isCollapsed={sidebarCollapsed}
        onClick={toggleSidebar}
      />
      
      <Sidebar 
        collapsed={sidebarCollapsed}
      />
      
      <div className="app-content">
        <DashboardHeaderBar sidebarCollapsed={sidebarCollapsed} />
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
