import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar_fixed.css';

const Sidebar = ({ collapsed = false }) => {
  const location = useLocation();
  const asideRef = useRef(null);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768); // Abierto en desktop, cerrado en móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showHint, setShowHint] = useState(false); // No mostrar hint
  const [openUsers, setOpenUsers] = useState(
    location.pathname === '/usuarios' || location.pathname === '/roles'
  );
  const [openFinance, setOpenFinance] = useState(location.pathname.startsWith('/finanzas'));
  const [openCommunication, setOpenCommunication] = useState(location.pathname.startsWith('/comunicacion'));
  const [openCommonAreas, setOpenCommonAreas] = useState(
    location.pathname.startsWith('/areas-comunes')
  );
  const [openMaintenance, setOpenMaintenance] = useState(location.pathname.startsWith('/mantenimiento'));
  const [openAISecurity, setOpenAISecurity] = useState(location.pathname.startsWith('/ai-seguridad'));
  const [openReports, setOpenReports] = useState(location.pathname.startsWith('/reportes-analitica'));

  // Auto-open menus based on current path
  useEffect(() => {
    setOpenUsers(location.pathname === '/usuarios' || location.pathname === '/roles');
    setOpenFinance(location.pathname.startsWith('/finanzas'));
    setOpenCommunication(location.pathname.startsWith('/comunicacion'));
    setOpenCommonAreas(location.pathname.startsWith('/areas-comunes'));
    setOpenMaintenance(location.pathname.startsWith('/mantenimiento'));
    setOpenAISecurity(location.pathname.startsWith('/ai-seguridad') || location.pathname.startsWith('/seguridad'));
    setOpenReports(location.pathname.startsWith('/reportes-analitica'));
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // No auto-open sidebar on resize - let user control it
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide hint after a few seconds
  useEffect(() => {
    if (!isMobile && !isOpen && showHint) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 5000); // Hide after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isMobile, isOpen, showHint]);

  useEffect(() => {
    // Update collapsed state effect if needed
  }, [collapsed]);

  // Update app content margin based on sidebar state
  useEffect(() => {
    const appContent = document.querySelector('.app-content');
    if (appContent) {
      appContent.className = 'app-content';
      if (!isMobile) {
        // Always show sidebar on desktop
        if (collapsed) {
          appContent.classList.add('sidebar-collapsed');
        } else {
          appContent.classList.add('sidebar-open');
        }
      } else if (isOpen) {
        appContent.classList.add('sidebar-open');
      }
    }
  }, [isOpen, collapsed, isMobile]);

  const toggleSidebar = () => {
    // En desktop, no hacer nada - sidebar siempre visible
    // En mobile, controlar apertura/cierre
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const hideSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
    // On desktop, do nothing
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!asideRef.current) return;
      if (!asideRef.current.contains(e.target)) {
        setOpenUsers(false);
        setOpenFinance(false);
        setOpenCommunication(false);
        setOpenCommonAreas(false);
        setOpenMaintenance(false);
        setOpenAISecurity(false);
        setOpenReports(false);
        // Close sidebar on mobile when clicking outside
        if (isMobile && isOpen) {
          setIsOpen(false);
        }
      }
    };
    
    // Close sidebar on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (isMobile) {
          setIsOpen(false);
        } else {
          hideSidebar();
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isMobile]);

  const icons = {
    dashboard: <span className="sidebar-link-icon" role="img" aria-label="Dashboard">🏠</span>,
    users: <span className="sidebar-link-icon" role="img" aria-label="Usuarios">👥</span>,
    user: <span className="sidebar-link-icon" role="img" aria-label="Gestionar Usuarios">👤</span>,
    roles: <span className="sidebar-link-icon" role="img" aria-label="Roles">🛡️</span>,
    finance: <span className="sidebar-link-icon" role="img" aria-label="Finanzas">💰</span>,
    pay: <span className="sidebar-link-icon" role="img" aria-label="Pago">💳</span>,
    history: <span className="sidebar-link-icon" role="img" aria-label="Historial">🗾</span>,
    config: <span className="sidebar-link-icon" role="img" aria-label="Config">⚙️</span>,
    services: <span className="sidebar-link-icon" role="img" aria-label="Servicios">🛠️</span>,
    communication: <span className="sidebar-link-icon" role="img" aria-label="Comunicación">💬</span>,
    notifications: <span className="sidebar-link-icon" role="img" aria-label="Notificaciones">🔔</span>,
    announcements: <span className="sidebar-link-icon" role="img" aria-label="Anuncios">📢</span>,
    commonAreas: <span className="sidebar-link-icon" role="img" aria-label="Áreas Comunes">🏢</span>,
    reservations: <span className="sidebar-link-icon" role="img" aria-label="Reservas">📅</span>,  
    reports: <span className="sidebar-link-icon" role="img" aria-label="Reportes">📊</span>,
    maintenance: <span className="sidebar-link-icon" role="img" aria-label="Mantenimiento">🔧</span>,
    tasks: <span className="sidebar-link-icon" role="img" aria-label="Tareas">✅</span>,
    preventive: <span className="sidebar-link-icon" role="img" aria-label="Preventivo">🔄</span>,
    requests: <span className="sidebar-link-icon" role="img" aria-label="Solicitudes">📝</span>,
    schedule: <span className="sidebar-link-icon" role="img" aria-label="Programación">📋</span>,
    costs: <span className="sidebar-link-icon" role="img" aria-label="Costos">💰</span>,
    security: <span className="sidebar-link-icon" role="img" aria-label="Seguridad">🔒</span>,
    cameras: <span className="sidebar-link-icon" role="img" aria-label="Cámaras">📹</span>,
    access: <span className="sidebar-link-icon" role="img" aria-label="Control Acceso">🚪</span>,
    incidents: <span className="sidebar-link-icon" role="img" aria-label="Incidentes">🚨</span>,
    aiSecurity: <span className="sidebar-link-icon" role="img" aria-label="IA Seguridad">🤖</span>,
    faceRecognition: <span className="sidebar-link-icon" role="img" aria-label="Reconocimiento Facial">🧑‍💼</span>,
    objectDetection: <span className="sidebar-link-icon" role="img" aria-label="Detección Objetos">🔍</span>,
    reportsAnalytics: <span className="sidebar-link-icon" role="img" aria-label="Reportes Analytics">📊</span>,
    dashboard: <span className="sidebar-link-icon" role="img" aria-label="Dashboard">📋</span>,
    kpi: <span className="sidebar-link-icon" role="img" aria-label="KPIs">📈</span>,
    trends: <span className="sidebar-link-icon" role="img" aria-label="Tendencias">📉</span>,
    export: <span className="sidebar-link-icon" role="img" aria-label="Exportar">💾</span>,
  };

  // Determine sidebar CSS classes
  const sidebarClasses = [
    'sidebar',
    collapsed ? 'collapsed' : 'open',
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Toggle button - solo visible en mobile */}
      {isMobile && (
        <button
          className={`sidebar-mobile-toggle ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          title={isOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
          style={{padding: '7px', borderRadius: '8px'}}
        >
          <div className="hamburger" style={{width: '18px', height: '13px'}}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(false)}
        />
      )}

  <aside ref={asideRef} className={sidebarClasses + (!isMobile || isOpen ? ' open' : ' hidden')} style={!isMobile ? {top: 60} : {}}>
        {/* ...existing code... */}
        <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={`sidebar-link${location.pathname === '/dashboard' ? ' active' : ''}`}
        >
          {icons.dashboard}
          <span className="sidebar-link-label">Dashboard</span>
        </Link>

        <div
          className={`sidebar-link sidebar-link-dropdown${openUsers ? ' open' : ''}${['/usuarios', '/roles'].includes(location.pathname) ? ' active' : ''}`}
          onClick={() => {
            setOpenUsers((prev) => {
              const next = !prev;
              if (next) {
                setOpenFinance(false);
                setOpenCommunication(false);
                setOpenCommonAreas(false);
                setOpenMaintenance(false);
              }
              return next;
            });
          }}
          tabIndex={0}
          role="button"
          aria-expanded={openUsers}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpenUsers((prev) => {
                const next = !prev;
                if (next) {
                  setOpenFinance(false);
                  setOpenCommunication(false);
                  setOpenCommonAreas(false);
                  setOpenMaintenance(false);
                }
                return next;
              });
            }
          }}
        >
          {icons.users}
          <span className="sidebar-link-label">Administración de Usuarios</span>
          <span className={`sidebar-dropdown-arrow${openUsers ? ' open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className={`sidebar-dropdown-menu${openUsers ? ' open' : ''}`}>
          <Link
            to="/usuarios"
            className={`sidebar-sublink${location.pathname === '/usuarios' ? ' active' : ''}`}
            tabIndex={openUsers ? 0 : -1}
          >
            {icons.user}
            <span className="sidebar-link-label">Gestionar Usuarios</span>
          </Link>
          <Link
            to="/roles"
            className={`sidebar-sublink${location.pathname === '/roles' ? ' active' : ''}`}
            tabIndex={openUsers ? 0 : -1}
          >
            {icons.roles}
            <span className="sidebar-link-label">Roles y Permisos</span>
          </Link>
        </div>

        <div
          className={`sidebar-link sidebar-link-dropdown${openFinance ? ' open' : ''}${location.pathname.startsWith('/finanzas') ? ' active' : ''}`}
          onClick={() => {
            setOpenFinance((prev) => {
              const next = !prev;
              if (next) {
                setOpenUsers(false);
                setOpenCommunication(false);
                setOpenCommonAreas(false);
                setOpenMaintenance(false);
                setOpenAISecurity(false);
                setOpenReports(false);
              }
              return next;
            });
          }}
          tabIndex={0}
          role="button"
          aria-expanded={openFinance}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpenFinance((prev) => {
                const next = !prev;
                if (next) {
                  setOpenUsers(false);
                  setOpenCommunication(false);
                  setOpenCommonAreas(false);
                  setOpenMaintenance(false);
                  setOpenAISecurity(false);
                  setOpenReports(false);
                }
                return next;
              });
            }
          }}
        >
          {icons.finance}
          <span className="sidebar-link-label">Gestión Financiera</span>
          <span className={`sidebar-dropdown-arrow${openFinance ? ' open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className={`sidebar-dropdown-menu${openFinance ? ' open' : ''}`}>
          <Link
            to="/finanzas/pagos"
            className={`sidebar-sublink${location.pathname === '/finanzas/pagos' ? ' active' : ''}`}
            tabIndex={openFinance ? 0 : -1}
          >
            {icons.pay}
            <span className="sidebar-link-label">Pago en línea</span>
          </Link>
          <Link
            to="/finanzas/historial"
            className={`sidebar-sublink${location.pathname === '/finanzas/historial' ? ' active' : ''}`}
            tabIndex={openFinance ? 0 : -1}
          >
            {icons.history}
            <span className="sidebar-link-label">Historial &amp; comprobantes</span>
          </Link>
          <Link
            to="/finanzas/config-precios"
            className={`sidebar-sublink${location.pathname === '/finanzas/config-precios' ? ' active' : ''}`}
            tabIndex={openFinance ? 0 : -1}
          >
            {icons.config}
            <span className="sidebar-link-label">Configurar precios</span>
          </Link>
          <Link
            to="/finanzas/cuotas-servicios"
            className={`sidebar-sublink${location.pathname === '/finanzas/cuotas-servicios' ? ' active' : ''}`}
            tabIndex={openFinance ? 0 : -1}
          >
            {icons.services}
            <span className="sidebar-link-label">Cuotas y servicios</span>
          </Link>
         
        </div>

        {/* Nuevo menú: Comunicación y Notificaciones */}
        <div
          className={`sidebar-link sidebar-link-dropdown${openCommunication ? ' open' : ''}${location.pathname.startsWith('/comunicacion') ? ' active' : ''}`}
          onClick={() => {
            setOpenCommunication((prev) => {
              const next = !prev;
              if (next) {
                setOpenUsers(false);
                setOpenFinance(false);
                setOpenCommonAreas(false);
                setOpenMaintenance(false);
                setOpenAISecurity(false);
                setOpenReports(false);
              }
              return next;
            });
          }}
          tabIndex={0}
          role="button"
          aria-expanded={openCommunication}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpenCommunication((prev) => {
                const next = !prev;
                if (next) {
                  setOpenUsers(false);
                  setOpenFinance(false);
                  setOpenCommonAreas(false);
                  setOpenMaintenance(false);
                  setOpenAISecurity(false);
                  setOpenReports(false);
                }
                return next;
              });
            }
          }}
        >
          {icons.communication}
          <span className="sidebar-link-label">Comunicación y Notificaciones</span>
          <span className={`sidebar-dropdown-arrow${openCommunication ? ' open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className={`sidebar-dropdown-menu${openCommunication ? ' open' : ''}`}>
          <Link
            to="/comunicacion/anuncios"
            className={`sidebar-sublink${location.pathname === '/comunicacion/anuncios' ? ' active' : ''}`}
            tabIndex={openCommunication ? 0 : -1}
          >
            {icons.notifications}
            <span className="sidebar-link-label">Publicar avisos y comunicados</span>
          </Link>         
        </div>

        {/* Nuevo menú: Gestión de Áreas Comunes */}
        <div
          className={`sidebar-link sidebar-link-dropdown${openCommonAreas ? ' open' : ''}${location.pathname.startsWith('/areas-comunes') ? ' active' : ''}`}
          onClick={() => {
            setOpenCommonAreas((prev) => {
              const next = !prev;
              if (next) {
                setOpenUsers(false);
                setOpenFinance(false);
                setOpenCommunication(false);
                setOpenMaintenance(false);
                setOpenAISecurity(false);
                setOpenReports(false);
              }
              return next;
            });
          }}
          tabIndex={0}
          role="button"
          aria-expanded={openCommonAreas}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpenCommonAreas((prev) => {
                const next = !prev;
                if (next) {
                  setOpenUsers(false);
                  setOpenFinance(false);
                  setOpenCommunication(false);
                  setOpenMaintenance(false);
                  setOpenAISecurity(false);
                  setOpenReports(false);
                }
                return next;
              });
            }
          }}
        >
          {icons.commonAreas}
          <span className="sidebar-link-label">Gestión de Áreas Comunes</span>
          <span className={`sidebar-dropdown-arrow${openCommonAreas ? ' open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className={`sidebar-dropdown-menu${openCommonAreas ? ' open' : ''}`}>
          <Link
            to="/areas-comunes/reservas"
            className={`sidebar-sublink${location.pathname === '/areas-comunes/reservas' ? ' active' : ''}`}
            tabIndex={openCommonAreas ? 0 : -1}
          >
            {icons.reservations}
            <span className="sidebar-link-label">Reservar áreas comunes</span>
          </Link>
          <Link
            to="/areas-comunes/configurar"
            className={`sidebar-sublink${location.pathname === '/areas-comunes/configurar' ? ' active' : ''}`}
            tabIndex={openCommonAreas ? 0 : -1}
          >
            {icons.config}
            <span className="sidebar-link-label">Configurar disponibilidad y horarios</span>
          </Link>        
          <Link
            to="/areas-comunes/reportes"
            className={`sidebar-sublink${location.pathname === '/areas-comunes/reportes' ? ' active' : ''}`}
            tabIndex={openCommonAreas ? 0 : -1}
          >
            {icons.reports}
            <span className="sidebar-link-label">Generar reportes de uso</span>
          </Link>
        </div>

        {/* Nuevo menú: Gestión de Mantenimiento */}
        <div
          className={`sidebar-link sidebar-link-dropdown${openMaintenance ? ' open' : ''}${location.pathname.startsWith('/mantenimiento') ? ' active' : ''}`}
          onClick={() => {
            setOpenMaintenance((prev) => {
              const next = !prev;
              if (next) {
                setOpenUsers(false);
                setOpenFinance(false);
                setOpenCommunication(false);
                setOpenCommonAreas(false);
                setOpenAISecurity(false);
                setOpenReports(false);
              }
              return next;
            });
          }}
          tabIndex={0}
          role="button"
          aria-expanded={openMaintenance}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpenMaintenance((prev) => {
                const next = !prev;
                if (next) {
                  setOpenUsers(false);
                  setOpenFinance(false);
                  setOpenCommunication(false);
                  setOpenCommonAreas(false);
                  setOpenAISecurity(false);
                  setOpenReports(false);
                }
                return next;
              });
            }
          }}
        >
          {icons.maintenance}
          <span className="sidebar-link-label">Gestión de Mantenimiento</span>
          <span className={`sidebar-dropdown-arrow${openMaintenance ? ' open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className={`sidebar-dropdown-menu${openMaintenance ? ' open' : ''}`}>
          <Link
            to="/mantenimiento/asignar-tareas"
            className={`sidebar-sublink${location.pathname === '/mantenimiento/asignar-tareas' ? ' active' : ''}`}
            tabIndex={openMaintenance ? 0 : -1}
          >
            {icons.tasks}
            <span className="sidebar-link-label">Asignar tareas</span>
          </Link>
          <Link
            to="/mantenimiento/seguimiento-preventivo"
            className={`sidebar-sublink${location.pathname === '/mantenimiento/seguimiento-preventivo' ? ' active' : ''}`}
            tabIndex={openMaintenance ? 0 : -1}
          >
            {icons.preventive}
            <span className="sidebar-link-label">Seguimiento preventivo</span>
          </Link>         
          <Link
            to="/mantenimiento/reportes-costos"
            className={`sidebar-sublink${location.pathname === '/mantenimiento/reportes-costos' ? ' active' : ''}`}
            tabIndex={openMaintenance ? 0 : -1}
          >
            {icons.costs}
            <span className="sidebar-link-label">Reportes de costos</span>
          </Link>
        </div>

        {/* Nuevo menú: Seguridad con IA y Visión Artificial */}
        <div
          className={`sidebar-link sidebar-link-dropdown${openAISecurity ? ' open' : ''}${location.pathname.startsWith('/ai-seguridad') || location.pathname.startsWith('/seguridad') ? ' active' : ''}`}
          onClick={() => {
            setOpenAISecurity((prev) => {
              const next = !prev;
              if (next) {
                setOpenUsers(false);
                setOpenFinance(false);
                setOpenCommunication(false);
                setOpenCommonAreas(false);
                setOpenMaintenance(false);
                setOpenReports(false);
              }
              return next;
            });
          }}
          tabIndex={0}
          role="button"
          aria-expanded={openAISecurity}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpenAISecurity((prev) => {
                const next = !prev;
                if (next) {
                  setOpenUsers(false);
                  setOpenFinance(false);
                  setOpenCommunication(false);
                  setOpenCommonAreas(false);
                  setOpenMaintenance(false);
                  setOpenReports(false);
                }
                return next;
              });
            }
          }}
        >
          {icons.aiSecurity}
          <span className="sidebar-link-label">Seguridad con IA y Visión Artificial</span>
          <span className={`sidebar-dropdown-arrow${openAISecurity ? ' open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className={`sidebar-dropdown-menu${openAISecurity ? ' open' : ''}`}>
          <Link
            to="/seguridad/consola-camaras"
            className={`sidebar-sublink${location.pathname === '/seguridad/consola-camaras' ? ' active' : ''}`}
            tabIndex={openAISecurity ? 0 : -1}
          >
            {icons.cameras}
            <span className="sidebar-link-label">Consola de cámaras</span>
          </Link>
          <Link
            to="/seguridad/reconocimiento-facial"
            className={`sidebar-sublink${location.pathname === '/seguridad/reconocimiento-facial' ? ' active' : ''}`}
            tabIndex={openAISecurity ? 0 : -1}
          >
            {icons.faceRecognition}
            <span className="sidebar-link-label">Reconocimiento facial</span>
          </Link>
          <Link
            to="/seguridad/deteccion-visitantes"
            className={`sidebar-sublink${location.pathname === '/seguridad/deteccion-visitantes' ? ' active' : ''}`}
            tabIndex={openAISecurity ? 0 : -1}
          >
            {icons.objectDetection}
            <span className="sidebar-link-label">Detección de visitantes</span>
          </Link>
          <Link
            to="/seguridad/identificacion-vehiculos"
            className={`sidebar-sublink${location.pathname === '/seguridad/identificacion-vehiculos' ? ' active' : ''}`}
            tabIndex={openAISecurity ? 0 : -1}
          >
            {icons.aiSecurity}
            <span className="sidebar-link-label">Identificación de vehículos</span>
          </Link>               
        </div>

        {/* Nuevo menú: Reportes y Analítica */}
        <div
          className={`sidebar-link sidebar-link-dropdown${openReports ? ' open' : ''}${location.pathname.startsWith('/reportes-analitica') ? ' active' : ''}`}
          onClick={() => {
            setOpenReports((prev) => {
              const next = !prev;
              if (next) {
                setOpenUsers(false);
                setOpenFinance(false);
                setOpenCommunication(false);
                setOpenCommonAreas(false);
                setOpenMaintenance(false);
                setOpenAISecurity(false);
              }
              return next;
            });
          }}
          tabIndex={0}
          role="button"
          aria-expanded={openReports}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpenReports((prev) => {
                const next = !prev;
                if (next) {
                  setOpenUsers(false);
                  setOpenFinance(false);
                  setOpenCommunication(false);
                  setOpenCommonAreas(false);
                  setOpenMaintenance(false);
                  setOpenAISecurity(false);
                }
                return next;
              });
            }
          }}
        >
          {icons.reportsAnalytics}
          <span className="sidebar-link-label">Reportes y Analítica</span>
          <span className={`sidebar-dropdown-arrow${openReports ? ' open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className={`sidebar-dropdown-menu${openReports ? ' open' : ''}`}>
          <Link
            to="/finanzas/reportes-financieros"
            className={`sidebar-sublink${location.pathname === '/finanzas/reportes-financieros' ? ' active' : ''}`}
            tabIndex={openFinance ? 0 : -1}
          >
            {icons.reports}
            <span className="sidebar-link-label">Reportes financieros</span>
          </Link>          
          <Link
            to="/reportes/estadisticas"
            className={`sidebar-sublink${location.pathname === '/reportes/estadisticas' ? ' active' : ''}`}
            tabIndex={openReports ? 0 : -1}
          >
            {icons.security}
            <span className="sidebar-link-label">Generar estadísticas de seguridad</span>
          </Link>
        </div>
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;