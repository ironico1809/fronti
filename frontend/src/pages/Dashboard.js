import React from 'react';

import Card from '../components/Card';
import DashboardLayout from '../components/DashboardLayout';
import DashboardQuickAction from '../components/dashboard/DashboardQuickAction';
import DashboardMetric from '../components/dashboard/DashboardMetric';
import DashboardActivity from '../components/dashboard/DashboardActivity';
import DashboardAlert from '../components/dashboard/DashboardAlert';
import './Dashboard.css';

// SVG ICONS
const iconPagos = (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="8" fill="#ffb902"/><path d="M8 12.5l2.5 2.5 5-5" stroke="#23213a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const iconReservas = (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="8" fill="#ffb902"/><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" stroke="#23213a" strokeWidth="2" strokeLinejoin="round"/></svg>
);
const iconReportes = (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="8" fill="#ffb902"/><rect x="7" y="4" width="10" height="16" rx="2" stroke="#23213a" strokeWidth="2"/><path d="M9 8h6M9 12h6M9 16h2" stroke="#23213a" strokeWidth="2" strokeLinecap="round"/></svg>
);
const iconAvisos = (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="8" fill="#ffb902"/><rect x="5" y="4" width="14" height="16" rx="2" stroke="#23213a" strokeWidth="2"/><path d="M9 8h6M9 12h6M9 16h2" stroke="#23213a" strokeWidth="2" strokeLinecap="round"/><path d="M15 16l2 2" stroke="#23213a" strokeWidth="2" strokeLinecap="round"/></svg>
);
const iconIngresos = (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="8" fill="#39365a"/><text x="7" y="18" fontSize="18" fill="#ffb902">$</text></svg>
);
const iconSeguridad = (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="8" fill="#39365a"/><path d="M12 17a5 5 0 0 0 5-5V9a5 5 0 0 0-10 0v3a5 5 0 0 0 5 5z" stroke="#ffb902" strokeWidth="2"/></svg>
);
const iconTareas = (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="8" fill="#39365a"/><path d="M8 17l8-8M8 9h8v8" stroke="#ffb902" strokeWidth="2"/></svg>
);

const quickActions = [
  { icon: iconPagos, label: 'Pagos', onClick: () => {} },
  { icon: iconReservas, label: 'Reservas', onClick: () => {} },
  { icon: iconReportes, label: 'Reportes', onClick: () => {} },
  { icon: iconAvisos, label: 'Avisos', onClick: () => {} }
];

const metrics = [
  { icon: iconIngresos, value: '$45,280', label: 'Ingresos del Mes', trend: '+5.2%', trendType: 'positive' },
  { icon: iconSeguridad, value: '98.5%', label: 'Seguridad IA', trend: '+2.1%', trendType: 'positive' },
  { icon: iconTareas, value: '12', label: 'Tareas Pendientes', trend: '-1.3%', trendType: 'negative' }
];

const activities = [
  { icon: iconPagos, desc: 'IA detectó movimiento en área común', time: 'Hace 8 minutos', type: 'info' },
  { icon: iconPagos, desc: 'Nuevo pago recibido - Apto 102', time: 'Hace 5 minutos', type: 'success' },
  { icon: iconPagos, desc: 'Pago de expensas recibido - Apto 301', time: 'Hace 15 minutos', type: 'success' },
  { icon: iconPagos, desc: 'IA detectó visitante no registrado en el lobby', time: 'Hace 32 minutos', type: 'warning' },
  { icon: iconReportes, desc: 'Nueva reserva de salón de eventos para el 25/09', time: 'Hace 1 hora', type: 'info' },
  { icon: iconTareas, desc: 'Mantenimiento programado - Sistema de bombas', time: 'Hace 2 horas', type: 'danger' }
];

const alerts = [
  { icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e53e3e"/><path d="M12 8v4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="#fff"/></svg>, desc: 'Vehículo sin autorización detectado en parqueadero', time: 'Hace 20 minutos', type: 'danger' },
  { icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e53e3e"/><path d="M12 8v4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="#fff"/></svg>, desc: 'Persona desconocida en área restringida - Azotea', time: 'Hace 45 minutos', type: 'danger' },
  { icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffb902"/><path d="M12 8v4" stroke="#23213a" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="#23213a"/></svg>, desc: 'Predicción IA: Posible morosidad en Apto 205', time: 'Hace 1 hora', type: 'warning' },
  { icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#38b000"/><path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, desc: 'Sistema de seguridad funcionando correctamente', time: 'Hace 2 horas', type: 'success' }
];


const Dashboard = () => (
  <DashboardLayout>
    <Card className="dashboard-welcome-card">
      <div className="dashboard-welcome-title">¡Bienvenido, Juan!</div>
      <div className="dashboard-welcome-subtitle">Gestiona tu condominio de manera inteligente con IA</div>
      <div className="dashboard-quick-actions-row">
        {quickActions.map((action, idx) => (
          <DashboardQuickAction key={idx} {...action} />
        ))}
      </div>
    </Card>
    <div className="dashboard-metrics-row">
      {metrics.map((metric, idx) => (
        <DashboardMetric key={idx} {...metric} />
      ))}
    </div>
    <div className="dashboard-bottom-row">
      <div className="dashboard-bottom-left">
        <DashboardActivity activities={activities} />
      </div>
      <div className="dashboard-bottom-right">
        <DashboardAlert alerts={alerts} />
      </div>
    </div>
  </DashboardLayout>
);

export default Dashboard;
