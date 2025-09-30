import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import './ReportesFinancieros.css';

const ReportesFinancieros = () => {
  // Estados principales
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    tipoReporte: 'completo',
    departamento: '',
    categoria: ''
  });

  // Estados para modales
  const [modalGenerarVisible, setModalGenerarVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

  // Estados para configuración
  const [configuracion, setConfiguracion] = useState({
    incluirGraficos: true,
    formatoExportacion: 'pdf',
    enviarPorEmail: false,
    emailDestino: ''
  });

  // Datos mock para demostración
  const [datosFinancieros] = useState({
    ingresos: [
      { id: 1, concepto: 'Cuotas de mantenimiento', monto: 125000, fecha: '2024-01-15', departamento: 'A101' },
      { id: 2, concepto: 'Multas de tránsito', monto: 15000, fecha: '2024-01-18', departamento: 'B205' },
      { id: 3, concepto: 'Uso de áreas comunes', monto: 8500, fecha: '2024-01-20', departamento: 'C301' },
      { id: 4, concepto: 'Servicios adicionales', monto: 22000, fecha: '2024-01-22', departamento: 'A102' }
    ],
    egresos: [
      { id: 1, concepto: 'Mantenimiento ascensores', monto: 45000, fecha: '2024-01-10', categoria: 'Mantenimiento' },
      { id: 2, concepto: 'Servicios públicos', monto: 78000, fecha: '2024-01-12', categoria: 'Servicios' },
      { id: 3, concepto: 'Seguridad', monto: 95000, fecha: '2024-01-15', categoria: 'Personal' },
      { id: 4, concepto: 'Limpieza', monto: 35000, fecha: '2024-01-18', categoria: 'Servicios' }
    ],
    balance: {
      totalIngresos: 170500,
      totalEgresos: 253000,
      saldoActual: -82500,
      proyeccionMensual: 245000
    }
  });

  const [reportesGenerados] = useState([
    {
      id: 1,
      nombre: 'Reporte Enero 2024',
      fechaGeneracion: '2024-01-31',
      periodo: '01/01/2024 - 31/01/2024',
      tipo: 'Completo',
      estado: 'Completado',
      tamano: '2.4 MB',
      formato: 'PDF'
    },
    {
      id: 2,
      nombre: 'Balance Trimestral Q4',
      fechaGeneracion: '2023-12-31',
      periodo: '01/10/2023 - 31/12/2023',
      tipo: 'Balance',
      estado: 'Completado',
      tamano: '1.8 MB',
      formato: 'Excel'
    },
    {
      id: 3,
      nombre: 'Análisis de Gastos - Dic',
      fechaGeneracion: '2023-12-15',
      periodo: '01/12/2023 - 15/12/2023',
      tipo: 'Gastos',
      estado: 'Procesando',
      tamano: '---',
      formato: 'PDF'
    }
  ]);

  // Efectos
  useEffect(() => {
    // Configurar fechas por defecto (último mes)
    const hoy = new Date();
    const primerDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    
    setFiltros(prev => ({
      ...prev,
      fechaInicio: primerDiaDelMes.toISOString().split('T')[0],
      fechaFin: hoy.toISOString().split('T')[0]
    }));
  }, []);

  // Funciones de manejo
  const handleGenerarReporte = async () => {
    if (!filtros.fechaInicio || !filtros.fechaFin) {
      alert('Por favor seleccione un rango de fechas válido');
      return;
    }

    setLoading(true);
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const nuevoReporte = {
        id: reportesGenerados.length + 1,
        nombre: `Reporte ${filtros.tipoReporte} - ${new Date().toLocaleDateString()}`,
        fechaGeneracion: new Date().toISOString().split('T')[0],
        periodo: `${filtros.fechaInicio} - ${filtros.fechaFin}`,
        tipo: filtros.tipoReporte,
        estado: 'Completado',
        tamano: '1.2 MB',
        formato: configuracion.formatoExportacion.toUpperCase()
      };

      setReportes(prev => [nuevoReporte, ...prev]);
      setModalGenerarVisible(false);
      
      alert('Reporte generado exitosamente');
    } catch (error) {
      alert('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = (reporte) => {
    setReporteSeleccionado(reporte);
    setModalDetalleVisible(true);
  };

  const handleDescargarReporte = (reporte) => {
    // Simular descarga
    alert(`Descargando ${reporte.nombre}...`);
  };

  const calcularEstadisticas = () => {
    const { ingresos, egresos, balance } = datosFinancieros;
    
    return {
      totalIngresos: balance.totalIngresos,
      totalEgresos: balance.totalEgresos,
      balanceNeto: balance.saldoActual,
      transaccionesTotal: ingresos.length + egresos.length,
      promedioIngreso: balance.totalIngresos / ingresos.length,
      promedioEgreso: balance.totalEgresos / egresos.length
    };
  };

  const estadisticas = calcularEstadisticas();

  return (
    <DashboardLayout>
      <div className="reportes-financieros-container">
        {/* Header */}
        <div className="reportes-financieros-header">
          <div className="reportes-financieros-title-section">
            <h1 className="reportes-financieros-title">Reportes Financieros</h1>
            <p className="reportes-financieros-subtitle">
              Genere y gestione reportes de ingresos, egresos y estado financiero
            </p>
          </div>
          <Button 
            onClick={() => setModalGenerarVisible(true)}
            className="reportes-financieros-btn-primary"
          >
            <i className="fas fa-chart-line"></i>
            Generar Reporte
          </Button>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="reportes-financieros-stats-grid">
          <div className="reportes-financieros-stat-card">
            <div className="reportes-financieros-stat-icon ingresos">
              <i className="fas fa-arrow-up"></i>
            </div>
            <div className="reportes-financieros-stat-content">
              <h3>Total Ingresos</h3>
              <p className="reportes-financieros-stat-value positive">
                ${estadisticas.totalIngresos.toLocaleString()}
              </p>
              <span className="reportes-financieros-stat-label">Este período</span>
            </div>
          </div>

          <div className="reportes-financieros-stat-card">
            <div className="reportes-financieros-stat-icon egresos">
              <i className="fas fa-arrow-down"></i>
            </div>
            <div className="reportes-financieros-stat-content">
              <h3>Total Egresos</h3>
              <p className="reportes-financieros-stat-value negative">
                ${estadisticas.totalEgresos.toLocaleString()}
              </p>
              <span className="reportes-financieros-stat-label">Este período</span>
            </div>
          </div>

          <div className="reportes-financieros-stat-card">
            <div className="reportes-financieros-stat-icon balance">
              <i className="fas fa-balance-scale"></i>
            </div>
            <div className="reportes-financieros-stat-content">
              <h3>Balance Neto</h3>
              <p className={`reportes-financieros-stat-value ${estadisticas.balanceNeto >= 0 ? 'positive' : 'negative'}`}>
                ${Math.abs(estadisticas.balanceNeto).toLocaleString()}
              </p>
              <span className="reportes-financieros-stat-label">
                {estadisticas.balanceNeto >= 0 ? 'Superávit' : 'Déficit'}
              </span>
            </div>
          </div>

          <div className="reportes-financieros-stat-card">
            <div className="reportes-financieros-stat-icon transacciones">
              <i className="fas fa-exchange-alt"></i>
            </div>
            <div className="reportes-financieros-stat-content">
              <h3>Transacciones</h3>
              <p className="reportes-financieros-stat-value">
                {estadisticas.transaccionesTotal}
              </p>
              <span className="reportes-financieros-stat-label">Total registradas</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="reportes-financieros-filters">
          <div className="reportes-financieros-filter-group">
            <Input
              type="date"
              label="Fecha inicio"
              value={filtros.fechaInicio}
              onChange={(e) => setFiltros(prev => ({...prev, fechaInicio: e.target.value}))}
            />
            <Input
              type="date"
              label="Fecha fin"
              value={filtros.fechaFin}
              onChange={(e) => setFiltros(prev => ({...prev, fechaFin: e.target.value}))}
            />
            <div className="reportes-financieros-filter-item">
              <label>Tipo de Reporte</label>
              <select 
                value={filtros.tipoReporte}
                onChange={(e) => setFiltros(prev => ({...prev, tipoReporte: e.target.value}))}
                className="reportes-financieros-select"
              >
                <option value="completo">Reporte Completo</option>
                <option value="ingresos">Solo Ingresos</option>
                <option value="egresos">Solo Egresos</option>
                <option value="balance">Balance Neto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Reportes */}
        <div className="reportes-financieros-content">
          <div className="reportes-financieros-section-header">
            <h2>Reportes Generados</h2>
            <span className="reportes-financieros-count">
              {reportesGenerados.length} reportes disponibles
            </span>
          </div>

          <div className="reportes-financieros-table-container">
            <table className="reportes-financieros-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Período</th>
                  <th>Tipo</th>
                  <th>Fecha Generación</th>
                  <th>Estado</th>
                  <th>Tamaño</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reportesGenerados.map(reporte => (
                  <tr key={reporte.id}>
                    <td>
                      <div className="reportes-financieros-reporte-info">
                        <i className="fas fa-file-alt"></i>
                        <div>
                          <span className="reportes-financieros-reporte-nombre">
                            {reporte.nombre}
                          </span>
                          <span className="reportes-financieros-reporte-formato">
                            {reporte.formato}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{reporte.periodo}</td>
                    <td>
                      <span className={`reportes-financieros-badge tipo-${reporte.tipo.toLowerCase()}`}>
                        {reporte.tipo}
                      </span>
                    </td>
                    <td>{reporte.fechaGeneracion}</td>
                    <td>
                      <span className={`reportes-financieros-estado ${reporte.estado.toLowerCase()}`}>
                        <i className={`fas ${reporte.estado === 'Completado' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                        {reporte.estado}
                      </span>
                    </td>
                    <td>{reporte.tamano}</td>
                    <td>
                      <div className="reportes-financieros-actions">
                        <button 
                          onClick={() => handleVerDetalle(reporte)}
                          className="reportes-financieros-btn-action"
                          title="Ver detalles"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        {reporte.estado === 'Completado' && (
                          <button 
                            onClick={() => handleDescargarReporte(reporte)}
                            className="reportes-financieros-btn-action"
                            title="Descargar"
                          >
                            <i className="fas fa-download"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Generar Reporte */}
        {modalGenerarVisible && (
          <Modal
            title="Generar Nuevo Reporte"
            isOpen={modalGenerarVisible}
            onClose={() => setModalGenerarVisible(false)}
          >
            <div className="reportes-financieros-modal-content">
              <div className="reportes-financieros-form-grid">
                <Input
                  type="date"
                  label="Fecha inicio *"
                  value={filtros.fechaInicio}
                  onChange={(e) => setFiltros(prev => ({...prev, fechaInicio: e.target.value}))}
                  required
                />
                <Input
                  type="date"
                  label="Fecha fin *"
                  value={filtros.fechaFin}
                  onChange={(e) => setFiltros(prev => ({...prev, fechaFin: e.target.value}))}
                  required
                />
              </div>

              <div className="reportes-financieros-form-group">
                <label>Tipo de Reporte *</label>
                <select 
                  value={filtros.tipoReporte}
                  onChange={(e) => setFiltros(prev => ({...prev, tipoReporte: e.target.value}))}
                  className="reportes-financieros-select"
                >
                  <option value="completo">Reporte Completo</option>
                  <option value="ingresos">Solo Ingresos</option>
                  <option value="egresos">Solo Egresos</option>
                  <option value="balance">Balance Neto</option>
                </select>
              </div>

              <div className="reportes-financieros-form-group">
                <label>Configuración de Exportación</label>
                <div className="reportes-financieros-checkbox-group">
                  <label className="reportes-financieros-checkbox">
                    <input
                      type="checkbox"
                      checked={configuracion.incluirGraficos}
                      onChange={(e) => setConfiguracion(prev => ({...prev, incluirGraficos: e.target.checked}))}
                    />
                    Incluir gráficos y visualizaciones
                  </label>
                </div>
              </div>

              <div className="reportes-financieros-form-group">
                <label>Formato de exportación</label>
                <select 
                  value={configuracion.formatoExportacion}
                  onChange={(e) => setConfiguracion(prev => ({...prev, formatoExportacion: e.target.value}))}
                  className="reportes-financieros-select"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <div className="reportes-financieros-modal-actions">
                <Button 
                  onClick={() => setModalGenerarVisible(false)}
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleGenerarReporte}
                  disabled={loading}
                  className="reportes-financieros-btn-primary"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Generando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-chart-line"></i>
                      Generar Reporte
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Detalle Reporte */}
        {modalDetalleVisible && reporteSeleccionado && (
          <Modal
            title={`Detalles - ${reporteSeleccionado.nombre}`}
            isOpen={modalDetalleVisible}
            onClose={() => setModalDetalleVisible(false)}
          >
            <div className="reportes-financieros-detalle-content">
              <div className="reportes-financieros-detalle-info">
                <div className="reportes-financieros-detalle-item">
                  <label>Período:</label>
                  <span>{reporteSeleccionado.periodo}</span>
                </div>
                <div className="reportes-financieros-detalle-item">
                  <label>Tipo de reporte:</label>
                  <span>{reporteSeleccionado.tipo}</span>
                </div>
                <div className="reportes-financieros-detalle-item">
                  <label>Fecha de generación:</label>
                  <span>{reporteSeleccionado.fechaGeneracion}</span>
                </div>
                <div className="reportes-financieros-detalle-item">
                  <label>Estado:</label>
                  <span className={`reportes-financieros-estado ${reporteSeleccionado.estado.toLowerCase()}`}>
                    {reporteSeleccionado.estado}
                  </span>
                </div>
                <div className="reportes-financieros-detalle-item">
                  <label>Tamaño del archivo:</label>
                  <span>{reporteSeleccionado.tamano}</span>
                </div>
                <div className="reportes-financieros-detalle-item">
                  <label>Formato:</label>
                  <span>{reporteSeleccionado.formato}</span>
                </div>
              </div>

              <div className="reportes-financieros-detalle-resumen">
                <h4>Resumen del Período</h4>
                <div className="reportes-financieros-resumen-grid">
                  <div className="reportes-financieros-resumen-item">
                    <span className="reportes-financieros-resumen-label">Ingresos:</span>
                    <span className="reportes-financieros-resumen-valor positive">
                      ${estadisticas.totalIngresos.toLocaleString()}
                    </span>
                  </div>
                  <div className="reportes-financieros-resumen-item">
                    <span className="reportes-financieros-resumen-label">Egresos:</span>
                    <span className="reportes-financieros-resumen-valor negative">
                      ${estadisticas.totalEgresos.toLocaleString()}
                    </span>
                  </div>
                  <div className="reportes-financieros-resumen-item">
                    <span className="reportes-financieros-resumen-label">Balance:</span>
                    <span className={`reportes-financieros-resumen-valor ${estadisticas.balanceNeto >= 0 ? 'positive' : 'negative'}`}>
                      ${Math.abs(estadisticas.balanceNeto).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="reportes-financieros-modal-actions">
                <Button onClick={() => setModalDetalleVisible(false)}>
                  Cerrar
                </Button>
                {reporteSeleccionado.estado === 'Completado' && (
                  <Button 
                    onClick={() => handleDescargarReporte(reporteSeleccionado)}
                    className="reportes-financieros-btn-primary"
                  >
                    <i className="fas fa-download"></i>
                    Descargar
                  </Button>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportesFinancieros;