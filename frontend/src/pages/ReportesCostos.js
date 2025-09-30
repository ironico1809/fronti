import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import './ReportesCostos.css';

// Datos simulados basados en la BD real
const activos = [
  { id_activo: 1, nombre: 'Bomba de Piscina A1', categoria: 'Equipos de Piscina' },
  { id_activo: 2, nombre: 'Sistema de Aire Acondicionado Central', categoria: 'HVAC' },
  { id_activo: 3, nombre: 'Ascensor Principal', categoria: 'Transporte' },
  { id_activo: 4, nombre: 'Generador de Emergencia', categoria: 'Equipos Eléctricos' },
  { id_activo: 5, nombre: 'Sistema de Seguridad CCTV', categoria: 'Seguridad' },
  { id_activo: 6, nombre: 'Calentador de Agua Central', categoria: 'Plomería' },
  { id_activo: 7, nombre: 'Puerta Automática Lobby', categoria: 'Acceso' },
  { id_activo: 8, nombre: 'Sistema de Riego Jardines', categoria: 'Jardinería' }
];

const tiposReparacion = ['TODOS', 'PREVENTIVO', 'CORRECTIVO', 'EMERGENCIA'];

// Datos simulados de costos de reparación
const datosCostos = [
  { id_costo: 1, id_tarea: 1, activo: 'Bomba de Piscina A1', tipo: 'PREVENTIVO', monto: 450.00, descripcion: 'Cambio de filtros y limpieza general', fecha: '2024-09-15', estado: 'FINALIZADA' },
  { id_costo: 2, id_tarea: 2, activo: 'Sistema de Aire Acondicionado Central', tipo: 'CORRECTIVO', monto: 1250.00, descripcion: 'Reparación de compresor', fecha: '2024-09-10', estado: 'FINALIZADA' },
  { id_costo: 3, id_tarea: 3, activo: 'Ascensor Principal', tipo: 'PREVENTIVO', monto: 800.00, descripcion: 'Mantenimiento trimestral', fecha: '2024-09-08', estado: 'FINALIZADA' },
  { id_costo: 4, id_tarea: 4, activo: 'Generador de Emergencia', tipo: 'CORRECTIVO', monto: 2100.00, descripcion: 'Reemplazo de batería y revisión eléctrica', fecha: '2024-09-05', estado: 'FINALIZADA' },
  { id_costo: 5, id_tarea: 5, activo: 'Sistema de Seguridad CCTV', tipo: 'CORRECTIVO', monto: 750.00, descripcion: 'Reemplazo de cámaras dañadas', fecha: '2024-08-28', estado: 'FINALIZADA' },
  { id_costo: 6, id_tarea: 6, activo: 'Calentador de Agua Central', tipo: 'PREVENTIVO', monto: 320.00, descripcion: 'Limpieza y ajuste de termostato', fecha: '2024-08-25', estado: 'FINALIZADA' },
  { id_costo: 7, id_tarea: 7, activo: 'Puerta Automática Lobby', tipo: 'CORRECTIVO', monto: 650.00, descripcion: 'Reparación de sensor y motor', fecha: '2024-08-20', estado: 'FINALIZADA' },
  { id_costo: 8, id_tarea: 8, activo: 'Sistema de Riego Jardines', tipo: 'EMERGENCIA', monto: 180.00, descripcion: 'Reparación de fuga en tubería principal', fecha: '2024-08-18', estado: 'FINALIZADA' },
  { id_costo: 9, id_tarea: 9, activo: 'Bomba de Piscina A1', tipo: 'CORRECTIVO', monto: 290.00, descripcion: 'Reemplazo de motor pequeño', fecha: '2024-08-15', estado: 'FINALIZADA' },
  { id_costo: 10, id_tarea: 10, activo: 'Sistema de Aire Acondicionado Central', tipo: 'PREVENTIVO', monto: 380.00, descripcion: 'Cambio de filtros de aire', fecha: '2024-08-12', estado: 'FINALIZADA' },
  { id_costo: 11, id_tarea: 11, activo: 'Ascensor Principal', tipo: 'EMERGENCIA', monto: 1800.00, descripcion: 'Reparación urgente de sistema de frenado', fecha: '2024-08-08', estado: 'FINALIZADA' },
  { id_costo: 12, id_tarea: 12, activo: 'Generador de Emergencia', tipo: 'PREVENTIVO', monto: 520.00, descripcion: 'Cambio de aceite y filtros', fecha: '2024-08-05', estado: 'FINALIZADA' }
];

// Datos para advertencias de costos faltantes
const advertenciasCostos = [
  { id_tarea: 13, activo: 'Sistema de Seguridad CCTV', descripcion: 'Instalación de nueva cámara en lobby', tipo: 'CORRECTIVO', fecha: '2024-09-20', estado: 'EN_PROCESO' },
  { id_tarea: 14, activo: 'Calentador de Agua Central', descripcion: 'Revisión de válvulas de seguridad', tipo: 'PREVENTIVO', fecha: '2024-09-18', estado: 'FINALIZADA' }
];

const ReportesCostos = () => {
  const [filtros, setFiltros] = useState({
    activoSeleccionado: 'TODOS',
    tipoSeleccionado: 'TODOS',
    fechaInicio: '2024-08-01',
    fechaFin: '2024-09-30',
    mostrarAdvertencias: true
  });

  const [costosFiltrados, setCostosFiltrados] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [tendencias, setTendencias] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCosto, setSelectedCosto] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    aplicarFiltros();
  }, [filtros]);

  const aplicarFiltros = () => {
    let datos = [...datosCostos];
    
    // Filtrar por activo
    if (filtros.activoSeleccionado !== 'TODOS') {
      datos = datos.filter(costo => costo.activo === filtros.activoSeleccionado);
    }
    
    // Filtrar por tipo
    if (filtros.tipoSeleccionado !== 'TODOS') {
      datos = datos.filter(costo => costo.tipo === filtros.tipoSeleccionado);
    }
    
    // Filtrar por fechas
    datos = datos.filter(costo => {
      const fechaCosto = new Date(costo.fecha);
      const fechaInicioFiltro = new Date(filtros.fechaInicio);
      const fechaFinFiltro = new Date(filtros.fechaFin);
      return fechaCosto >= fechaInicioFiltro && fechaCosto <= fechaFinFiltro;
    });
    
    setCostosFiltrados(datos);
    calcularEstadisticas(datos);
    calcularTendencias(datos);
  };

  const calcularEstadisticas = (datos) => {
    const total = datos.reduce((sum, costo) => sum + costo.monto, 0);
    const promedio = datos.length > 0 ? total / datos.length : 0;
    
    const porTipo = {};
    tiposReparacion.slice(1).forEach(tipo => {
      const costosTipo = datos.filter(c => c.tipo === tipo);
      porTipo[tipo] = {
        cantidad: costosTipo.length,
        total: costosTipo.reduce((sum, c) => sum + c.monto, 0)
      };
    });

    const porActivo = {};
    activos.forEach(activo => {
      const costosActivo = datos.filter(c => c.activo === activo.nombre);
      if (costosActivo.length > 0) {
        porActivo[activo.nombre] = {
          cantidad: costosActivo.length,
          total: costosActivo.reduce((sum, c) => sum + c.monto, 0)
        };
      }
    });

    setEstadisticas({
      totalCostos: total,
      promedioCosto: promedio,
      cantidadReparaciones: datos.length,
      porTipo,
      porActivo,
      costoMasAlto: Math.max(...datos.map(c => c.monto), 0),
      costoMasBajo: Math.min(...datos.map(c => c.monto), 0)
    });
  };

  const calcularTendencias = (datos) => {
    const mesesMap = {};
    
    datos.forEach(costo => {
      const fecha = new Date(costo.fecha);
      const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      const mesNombre = fecha.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
      
      if (!mesesMap[mesKey]) {
        mesesMap[mesKey] = { mes: mesNombre, total: 0, cantidad: 0 };
      }
      
      mesesMap[mesKey].total += costo.monto;
      mesesMap[mesKey].cantidad += 1;
    });
    
    const tendenciasArray = Object.keys(mesesMap)
      .sort()
      .map(key => ({
        ...mesesMap[key],
        promedio: mesesMap[key].cantidad > 0 ? mesesMap[key].total / mesesMap[key].cantidad : 0
      }));
    
    setTendencias(tendenciasArray);
  };

  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const exportarReporte = (formato) => {
    console.log(`Exportando reporte en formato: ${formato}`);
    setShowExportModal(false);
  };

  const verDetalles = (costo) => {
    setSelectedCosto(costo);
    setShowDetailsModal(true);
  };

  return (
    <DashboardLayout>
      <div className="reportes-costos-page">
        <div className="reportes-costos-header">
          <h1 className="reportes-costos-title">Reportes de Costos de Reparaciones</h1>
          <p className="reportes-costos-subtitle">
            Genere reportes consolidados de costos de mantenimiento y reparaciones
          </p>
        </div>

        {/* Filtros */}
        <div className="reportes-costos-filters-card">
          <h3 className="reportes-costos-filters-title">Filtros de Búsqueda</h3>
          <div className="reportes-costos-filters-grid">
            <div className="reportes-costos-filter-group">
              <label className="reportes-costos-filter-label">Activo</label>
              <select
                className="reportes-costos-filter-select"
                value={filtros.activoSeleccionado}
                onChange={(e) => handleFiltroChange('activoSeleccionado', e.target.value)}
              >
                <option value="TODOS">Todos los activos</option>
                {activos.map(activo => (
                  <option key={activo.id_activo} value={activo.nombre}>
                    {activo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="reportes-costos-filter-group">
              <label className="reportes-costos-filter-label">Tipo de Reparación</label>
              <select
                className="reportes-costos-filter-select"
                value={filtros.tipoSeleccionado}
                onChange={(e) => handleFiltroChange('tipoSeleccionado', e.target.value)}
              >
                {tiposReparacion.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo === 'TODOS' ? 'Todos los tipos' : tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="reportes-costos-filter-group">
              <label className="reportes-costos-filter-label">Fecha Inicio</label>
              <Input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                className="reportes-costos-date-input"
              />
            </div>

            <div className="reportes-costos-filter-group">
              <label className="reportes-costos-filter-label">Fecha Fin</label>
              <Input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                className="reportes-costos-date-input"
              />
            </div>
          </div>

          <div className="reportes-costos-filter-actions">
            <label className="reportes-costos-checkbox-container">
              <input
                type="checkbox"
                checked={filtros.mostrarAdvertencias}
                onChange={(e) => handleFiltroChange('mostrarAdvertencias', e.target.checked)}
              />
              <span className="reportes-costos-checkbox-text">
                Mostrar advertencias de costos faltantes
              </span>
            </label>
            
            <Button
              variant="primary"
              onClick={() => setShowExportModal(true)}
              className="reportes-costos-export-btn"
            >
              📥 Exportar Reporte
            </Button>
          </div>
        </div>

        {/* Estadísticas Resumidas */}
        <div className="reportes-costos-stats-grid">
          <div className="reportes-costos-stat-card">
            <div className="reportes-costos-stat-icon">💰</div>
            <div className="reportes-costos-stat-info">
              <h4 className="reportes-costos-stat-title">Costo Total</h4>
              <p className="reportes-costos-stat-value">
                ${estadisticas.totalCostos?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          <div className="reportes-costos-stat-card">
            <div className="reportes-costos-stat-icon">📊</div>
            <div className="reportes-costos-stat-info">
              <h4 className="reportes-costos-stat-title">Promedio por Reparación</h4>
              <p className="reportes-costos-stat-value">
                ${estadisticas.promedioCosto?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          <div className="reportes-costos-stat-card">
            <div className="reportes-costos-stat-icon">🔧</div>
            <div className="reportes-costos-stat-info">
              <h4 className="reportes-costos-stat-title">Total Reparaciones</h4>
              <p className="reportes-costos-stat-value">
                {estadisticas.cantidadReparaciones || 0}
              </p>
            </div>
          </div>

          <div className="reportes-costos-stat-card">
            <div className="reportes-costos-stat-icon">📈</div>
            <div className="reportes-costos-stat-info">
              <h4 className="reportes-costos-stat-title">Costo Más Alto</h4>
              <p className="reportes-costos-stat-value">
                ${estadisticas.costoMasAlto?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Advertencias de Costos Faltantes */}
        {filtros.mostrarAdvertencias && advertenciasCostos.length > 0 && (
          <div className="reportes-costos-warnings-card">
            <h3 className="reportes-costos-warnings-title">
              ⚠️ Advertencias de Costos Faltantes
            </h3>
            <div className="reportes-costos-warnings-list">
              {advertenciasCostos.map(advertencia => (
                <div key={advertencia.id_tarea} className="reportes-costos-warning-item">
                  <div className="reportes-costos-warning-icon">⚠️</div>
                  <div className="reportes-costos-warning-content">
                    <h4 className="reportes-costos-warning-activo">{advertencia.activo}</h4>
                    <p className="reportes-costos-warning-desc">{advertencia.descripcion}</p>
                    <div className="reportes-costos-warning-meta">
                      <span className="reportes-costos-warning-type">{advertencia.tipo}</span>
                      <span className="reportes-costos-warning-date">{advertencia.fecha}</span>
                      <span className={`reportes-costos-warning-status status-${advertencia.estado.toLowerCase()}`}>
                        {advertencia.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tendencias Mensuales */}
        {tendencias.length > 0 && (
          <div className="reportes-costos-trends-card">
            <h3 className="reportes-costos-trends-title">Tendencias Mensuales</h3>
            <div className="reportes-costos-trends-chart">
              <div className="reportes-costos-chart-header">
                <div className="reportes-costos-chart-label">Mes</div>
                <div className="reportes-costos-chart-label">Total</div>
                <div className="reportes-costos-chart-label">Reparaciones</div>
                <div className="reportes-costos-chart-label">Promedio</div>
              </div>
              {tendencias.map(tendencia => (
                <div key={tendencia.mes} className="reportes-costos-chart-row">
                  <div className="reportes-costos-chart-cell">{tendencia.mes}</div>
                  <div className="reportes-costos-chart-cell">${tendencia.total.toFixed(2)}</div>
                  <div className="reportes-costos-chart-cell">{tendencia.cantidad}</div>
                  <div className="reportes-costos-chart-cell">${tendencia.promedio.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Costos por Tipo */}
        {Object.keys(estadisticas.porTipo || {}).length > 0 && (
          <div className="reportes-costos-breakdown-card">
            <h3 className="reportes-costos-breakdown-title">Desglose por Tipo de Reparación</h3>
            <div className="reportes-costos-breakdown-grid">
              {Object.entries(estadisticas.porTipo).map(([tipo, datos]) => (
                <div key={tipo} className="reportes-costos-breakdown-item">
                  <div className="reportes-costos-breakdown-header">
                    <h4 className="reportes-costos-breakdown-type">{tipo}</h4>
                    <span className="reportes-costos-breakdown-count">{datos.cantidad} reparaciones</span>
                  </div>
                  <div className="reportes-costos-breakdown-total">
                    ${datos.total.toFixed(2)}
                  </div>
                  <div className="reportes-costos-breakdown-avg">
                    Promedio: ${(datos.total / datos.cantidad).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista Detallada de Costos */}
        <div className="reportes-costos-details-card">
          <h3 className="reportes-costos-details-title">
            Detalle de Costos ({costosFiltrados.length} registros)
          </h3>
          <div className="reportes-costos-table-container">
            <table className="reportes-costos-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Activo</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {costosFiltrados.map(costo => (
                  <tr key={costo.id_costo}>
                    <td className="reportes-costos-table-date">{costo.fecha}</td>
                    <td className="reportes-costos-table-activo">{costo.activo}</td>
                    <td>
                      <span className={`reportes-costos-type-badge type-${costo.tipo.toLowerCase()}`}>
                        {costo.tipo}
                      </span>
                    </td>
                    <td className="reportes-costos-table-desc">{costo.descripcion}</td>
                    <td className="reportes-costos-table-amount">${costo.monto.toFixed(2)}</td>
                    <td>
                      <span className={`reportes-costos-status-badge status-${costo.estado.toLowerCase()}`}>
                        {costo.estado}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => verDetalles(costo)}
                        className="reportes-costos-details-btn"
                      >
                        👁️ Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {costosFiltrados.length === 0 && (
            <div className="reportes-costos-empty">
              <p>No se encontraron costos con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles */}
      {showDetailsModal && selectedCosto && (
        <Modal
          title="Detalles del Costo"
          onClose={() => setShowDetailsModal(false)}
        >
          <div className="reportes-costos-modal-content">
            <div className="reportes-costos-modal-field">
              <label>Activo:</label>
              <span>{selectedCosto.activo}</span>
            </div>
            <div className="reportes-costos-modal-field">
              <label>Tipo:</label>
              <span className={`reportes-costos-type-badge type-${selectedCosto.tipo.toLowerCase()}`}>
                {selectedCosto.tipo}
              </span>
            </div>
            <div className="reportes-costos-modal-field">
              <label>Monto:</label>
              <span className="reportes-costos-modal-amount">${selectedCosto.monto.toFixed(2)}</span>
            </div>
            <div className="reportes-costos-modal-field">
              <label>Fecha:</label>
              <span>{selectedCosto.fecha}</span>
            </div>
            <div className="reportes-costos-modal-field">
              <label>Estado:</label>
              <span className={`reportes-costos-status-badge status-${selectedCosto.estado.toLowerCase()}`}>
                {selectedCosto.estado}
              </span>
            </div>
            <div className="reportes-costos-modal-field">
              <label>Descripción:</label>
              <span>{selectedCosto.descripcion}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Exportación */}
      {showExportModal && (
        <Modal
          title="Exportar Reporte"
          onClose={() => setShowExportModal(false)}
        >
          <div className="reportes-costos-export-content">
            <p>Seleccione el formato para exportar el reporte:</p>
            <div className="reportes-costos-export-options">
              <Button
                variant="primary"
                onClick={() => exportarReporte('PDF')}
                className="reportes-costos-export-option"
              >
                📄 Exportar como PDF
              </Button>
              <Button
                variant="secondary"
                onClick={() => exportarReporte('Excel')}
                className="reportes-costos-export-option"
              >
                📊 Exportar como Excel
              </Button>
              <Button
                variant="secondary"
                onClick={() => exportarReporte('CSV')}
                className="reportes-costos-export-option"
              >
                📋 Exportar como CSV
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default ReportesCostos;