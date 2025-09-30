import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrarUsuario from './pages/RegistrarUsuario';
import RecuperarContrasena from './pages/RecuperarContrasena';
import Dashboard from './pages/Dashboard';
import GestionarUsuarios from './pages/GestionarUsuarios';
import GestionarRoles from './pages/GestionarRoles';
import CuotasServicios from './pages/CuotasServicios';
import Pagos from './pages/Pagos';
import HistorialPagos from './pages/HistorialPagos';
import ConfigPrecios from './pages/ConfigPrecios';
import PublicarAvisos from './pages/PublicarAvisos';
import ReservarAreas from './pages/ReservarAreas';
import ConfigurarDisponibilidad from './pages/ConfigurarDisponibilidad';
import GenerarReportes from './pages/GenerarReportes';
import AsignarTareas from './pages/AsignarTareas';
import SeguimientoMantenimiento from './pages/SeguimientoMantenimiento';
import ReportesCostos from './pages/ReportesCostos';
import ConsolaCamaras from './pages/ConsolaCamaras';
import ReconocimientoFacial from './pages/ReconocimientoFacial';
import DeteccionVisitantes from './pages/DeteccionVisitantes';
import IdentificacionVehiculos from './pages/IdentificacionVehiculos';
import ReportesFinancieros from './pages/ReportesFinancieros';
import EstadisticasSeguridad from './pages/EstadisticasSeguridad';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
  <Route path="/registrar" element={<RegistrarUsuario />} />
  <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/usuarios" element={<GestionarUsuarios />} />
  <Route path="/roles" element={<GestionarRoles />} />
  <Route path="/finanzas/cuotas-servicios" element={<CuotasServicios />} />
  <Route path="/finanzas/pagos" element={<Pagos />} />
  <Route path="/finanzas/historial" element={<HistorialPagos />} />
  <Route path="/finanzas/config-precios" element={<ConfigPrecios />} />
  <Route path="/comunicacion/anuncios" element={<PublicarAvisos />} />
  <Route path="/areas-comunes/reservas" element={<ReservarAreas />} />
  <Route path="/areas-comunes/configurar" element={<ConfigurarDisponibilidad />} />
  <Route path="/areas-comunes/reportes" element={<GenerarReportes />} />
  <Route path="/mantenimiento/asignar-tareas" element={<AsignarTareas />} />
  <Route path="/mantenimiento/seguimiento-preventivo" element={<SeguimientoMantenimiento />} />
  <Route path="/mantenimiento/reportes-costos" element={<ReportesCostos />} />
  <Route path="/seguridad/consola-camaras" element={<ConsolaCamaras />} />
  <Route path="/seguridad/reconocimiento-facial" element={<ReconocimientoFacial />} />
  <Route path="/seguridad/deteccion-visitantes" element={<DeteccionVisitantes />} />
  <Route path="/seguridad/identificacion-vehiculos" element={<IdentificacionVehiculos />} />
  <Route path="/reportes/estadisticas" element={<EstadisticasSeguridad />} />
  <Route path="/finanzas/reportes-financieros" element={<ReportesFinancieros />} />
  <Route path="/reportes/generar-reportes" element={<GenerarReportes />} />
    </Routes>
  </Router>
);

export default AppRouter;
