import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ExportButtons from '../components/ExportButtons';
import './EstadisticasSeguridad.css';

// Datos simulados basados en la BD real - tablas: camara_evento, reconocimiento_facial, deteccion_visitante, ocr_vehiculo
const tiposEventos = [
  { id: 'TODOS', nombre: 'Todos los Eventos' },
  { id: 'MOVIMIENTO', nombre: 'Detección de Movimiento' },
  { id: 'INTRUSION', nombre: 'Intrusión Detectada' },
  { id: 'RECONOCIMIENTO_FACIAL', nombre: 'Reconocimiento Facial' },
  { id: 'VEHICULO_DETECTADO', nombre: 'Vehículo Detectado' },
  { id: 'VISITANTE_NO_AUTORIZADO', nombre: 'Visitante No Autorizado' },
  { id: 'ACCESO_DENEGADO', nombre: 'Acceso Denegado' },
  { id: 'SISTEMA_OFFLINE', nombre: 'Sistema Offline' }
];

const camarasDisponibles = [
  { id_camara: 1, ubicacion: 'Entrada Principal', descripcion: 'Cámara de acceso principal', estado: 'ACTIVA' },
  { id_camara: 2, ubicacion: 'Parqueadero Norte', descripcion: 'Vigilancia de vehículos', estado: 'ACTIVA' },
  { id_camara: 3, ubicacion: 'Lobby Edificio A', descripcion: 'Control de acceso edificio A', estado: 'ACTIVA' },
  { id_camara: 4, ubicacion: 'Área de Piscina', descripcion: 'Seguridad en zona recreativa', estado: 'ACTIVA' },
  { id_camara: 5, ubicacion: 'Salida de Emergencia', descripcion: 'Monitoreo salida emergencia', estado: 'MANTENIMIENTO' },
  { id_camara: 6, ubicacion: 'Azotea', descripcion: 'Vigilancia perímetro superior', estado: 'ACTIVA' }
];

// Datos simulados de eventos de seguridad
const eventosSeguridad = [
  {
    id_evento: 1,
    id_camara: 1,
    ubicacion: 'Entrada Principal',
    tipo_evento: 'RECONOCIMIENTO_FACIAL',
    descripcion: 'Reconocimiento exitoso - Usuario autorizado',
    fecha_hora: '2024-09-24 14:30:15',
    nivel_confianza: 95.5,
    resultado: 'AUTORIZADO'
  },
  {
    id_evento: 2,
    id_camara: 2,
    ubicacion: 'Parqueadero Norte',
    tipo_evento: 'VEHICULO_DETECTADO',
    descripcion: 'Vehículo ABC-123 detectado',
    fecha_hora: '2024-09-24 13:45:22',
    nivel_confianza: 98.2,
    resultado: 'AUTORIZADO'
  },
  {
    id_evento: 3,
    id_camara: 3,
    ubicacion: 'Lobby Edificio A',
    tipo_evento: 'VISITANTE_NO_AUTORIZADO',
    descripcion: 'Persona desconocida detectada',
    fecha_hora: '2024-09-24 12:15:33',
    nivel_confianza: 87.3,
    resultado: 'ALERTA'
  },
  {
    id_evento: 4,
    id_camara: 4,
    ubicacion: 'Área de Piscina',
    tipo_evento: 'MOVIMIENTO',
    descripcion: 'Movimiento detectado fuera de horario',
    fecha_hora: '2024-09-24 02:30:44',
    nivel_confianza: 92.1,
    resultado: 'SOSPECHOSO'
  },
  {
    id_evento: 5,
    id_camara: 1,
    ubicacion: 'Entrada Principal',
    tipo_evento: 'ACCESO_DENEGADO',
    descripcion: 'Intento de acceso con credencial expirada',
    fecha_hora: '2024-09-24 09:20:11',
    nivel_confianza: 99.8,
    resultado: 'BLOQUEADO'
  }
];

// Estadísticas por tipo de evento
const estadisticasPorTipo = [
  { tipo: 'RECONOCIMIENTO_FACIAL', total: 1245, autorizados: 1198, denegados: 47, porcentaje_exito: 96.2 },
  { tipo: 'VEHICULO_DETECTADO', total: 892, autorizados: 856, denegados: 36, porcentaje_exito: 95.9 },
  { tipo: 'MOVIMIENTO', total: 2156, normales: 2089, sospechosos: 67, porcentaje_normal: 96.9 },
  { tipo: 'VISITANTE_NO_AUTORIZADO', total: 45, resueltos: 38, pendientes: 7, porcentaje_resuelto: 84.4 },
  { tipo: 'INTRUSION', total: 12, confirmadas: 3, falsas_alarmas: 9, porcentaje_real: 25.0 },
  { tipo: 'ACCESO_DENEGADO', total: 156, correctos: 152, errores: 4, porcentaje_correcto: 97.4 }
];

// Estadísticas mensuales de seguridad
const estadisticasMensuales = [
  { mes: 'Enero', total_eventos: 3890, incidentes: 23, falsas_alarmas: 8, tiempo_respuesta: 4.2 },
  { mes: 'Febrero', total_eventos: 4156, incidentes: 18, falsas_alarmas: 12, tiempo_respuesta: 3.8 },
  { mes: 'Marzo', total_eventos: 4523, incidentes: 31, falsas_alarmas: 9, tiempo_respuesta: 4.1 },
  { mes: 'Abril', total_eventos: 4289, incidentes: 25, falsas_alarmas: 7, tiempo_respuesta: 3.9 },
  { mes: 'Mayo', total_eventos: 4678, incidentes: 29, falsas_alarmas: 11, tiempo_respuesta: 4.0 },
  { mes: 'Junio', total_eventos: 4892, incidentes: 34, falsas_alarmas: 13, tiempo_respuesta: 4.3 },
  { mes: 'Julio', total_eventos: 5234, incidentes: 28, falsas_alarmas: 10, tiempo_respuesta: 3.7 },
  { mes: 'Agosto', total_eventos: 5156, incidentes: 22, falsas_alarmas: 15, tiempo_respuesta: 4.1 },
  { mes: 'Septiembre', total_eventos: 4945, incidentes: 26, falsas_alarmas: 8, tiempo_respuesta: 3.6 }
];

// Rendimiento de cámaras
const rendimientoCamaras = [
  { id_camara: 1, ubicacion: 'Entrada Principal', eventos_detectados: 1847, uptime: 99.2, precision: 97.8, alertas_generadas: 12 },
  { id_camara: 2, ubicacion: 'Parqueadero Norte', eventos_detectados: 1234, uptime: 98.7, precision: 95.4, alertas_generadas: 8 },
  { id_camara: 3, ubicacion: 'Lobby Edificio A', eventos_detectados: 982, uptime: 99.5, precision: 96.1, alertas_generadas: 15 },
  { id_camara: 4, ubicacion: 'Área de Piscina', eventos_detectados: 567, uptime: 97.8, precision: 94.2, alertas_generadas: 22 },
  { id_camara: 5, ubicacion: 'Salida de Emergencia', eventos_detectados: 234, uptime: 85.3, precision: 91.7, alertas_generadas: 3 },
  { id_camara: 6, ubicacion: 'Azotea', eventos_detectados: 445, uptime: 98.9, precision: 93.8, alertas_generadas: 7 }
];

const EstadisticasSeguridad = () => {
  const [filtros, setFiltros] = useState({
    tipoEvento: 'TODOS',
    camaraSeleccionada: 'TODAS',
    fechaInicio: '2024-09-01',
    fechaFin: '2024-09-30',
    nivelConfianza: 80
  });

  const [estadisticasActuales, setEstadisticasActuales] = useState({
    totalEventos: 4945,
    incidentesReales: 26,
    falsasAlarmas: 8,
    tiempoRespuesta: 3.6,
    camarasActivas: 5,
    camarasOffline: 1
  });

  const [eventosFiltrados, setEventosFiltrados] = useState(eventosSeguridad);
  const [mostrarGraficos, setMostrarGraficos] = useState(true);
  const [tipoGrafico, setTipoGrafico] = useState('barras');

  // Simular filtrado de eventos
  useEffect(() => {
    let eventosFiltrados = eventosSeguridad;

    if (filtros.tipoEvento !== 'TODOS') {
      eventosFiltrados = eventosFiltrados.filter(evento => evento.tipo_evento === filtros.tipoEvento);
    }

    if (filtros.camaraSeleccionada !== 'TODAS') {
      eventosFiltrados = eventosFiltrados.filter(evento => evento.id_camara === parseInt(filtros.camaraSeleccionada));
    }

    setEventosFiltrados(eventosFiltrados);
  }, [filtros]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const generarReporte = () => {
    alert('Generando reporte de estadísticas de seguridad...\n\nArchivo: estadisticas_seguridad_' + new Date().toISOString().split('T')[0] + '.pdf');
  };

  const exportarDatos = (formato) => {
    alert(`Exportando datos en formato ${formato.toUpperCase()}...`);
  };

  const limpiarFiltros = () => {
    setFiltros({
      tipoEvento: 'TODOS',
      camaraSeleccionada: 'TODAS',
      fechaInicio: '2024-09-01',
      fechaFin: '2024-09-30',
      nivelConfianza: 80
    });
  };

  const getResultadoBadge = (resultado) => {
    const variants = {
      'AUTORIZADO': 'success',
      'BLOQUEADO': 'danger',
      'ALERTA': 'warning',
      'SOSPECHOSO': 'danger',
      'PENDIENTE': 'neutral'
    };
    return <Badge variant={variants[resultado] || 'neutral'} label={resultado} />;
  };

  return (
    <DashboardLayout>
      <div className="estadisticas-seguridad-container">
        
        {/* Header */}
        <div className="stats-header">
          <div className="stats-title-section">
            <h1>📊 Estadísticas de Seguridad</h1>
            <p>Análisis y métricas de eventos de seguridad del condominio</p>
          </div>
          
          <div className="stats-actions">
            <ExportButtons
              data={eventosFiltrados}
              fileName="estadisticas_seguridad"
              reportTitle="Estadísticas de Seguridad - Smart Condominium"
              disabled={eventosFiltrados.length === 0}
              onExportStart={(format) => console.log(`Iniciando exportación ${format}...`)}
              onExportComplete={(format, fileName) => {
                console.log(`✅ Exportación ${format} completada: ${fileName}`);
                alert(`✅ Reporte exportado exitosamente como ${fileName}`);
              }}
              onExportError={(format, error) => {
                console.error(`❌ Error en exportación ${format}:`, error);
              }}
            />
            <Button onClick={generarReporte} className="primary">
              � Generar Reporte Detallado
            </Button>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="stats-metrics-grid">
          <div className="metric-card total-eventos">
            <div className="metric-icon">🛡️</div>
            <div className="metric-content">
              <div className="metric-value">{estadisticasActuales.totalEventos.toLocaleString()}</div>
              <div className="metric-label">Eventos Totales</div>
              <div className="metric-trend positive">+12.5% vs mes anterior</div>
            </div>
          </div>

          <div className="metric-card incidentes-reales">
            <div className="metric-icon">🚨</div>
            <div className="metric-content">
              <div className="metric-value">{estadisticasActuales.incidentesReales}</div>
              <div className="metric-label">Incidentes Reales</div>
              <div className="metric-trend negative">-8.3% vs mes anterior</div>
            </div>
          </div>

          <div className="metric-card falsas-alarmas">
            <div className="metric-icon">⚠️</div>
            <div className="metric-content">
              <div className="metric-value">{estadisticasActuales.falsasAlarmas}</div>
              <div className="metric-label">Falsas Alarmas</div>
              <div className="metric-trend positive">-20.0% vs mes anterior</div>
            </div>
          </div>

          <div className="metric-card tiempo-respuesta">
            <div className="metric-icon">⏱️</div>
            <div className="metric-content">
              <div className="metric-value">{estadisticasActuales.tiempoRespuesta}min</div>
              <div className="metric-label">Tiempo Respuesta</div>
              <div className="metric-trend positive">-15.2% vs mes anterior</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="stats-filters-panel">
          <h3>🔍 Filtros de Búsqueda</h3>
          
          <div className="filters-row">
            <div className="filter-group">
              <label>Tipo de Evento</label>
              <select 
                value={filtros.tipoEvento}
                onChange={(e) => handleFiltroChange('tipoEvento', e.target.value)}
              >
                {tiposEventos.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Cámara</label>
              <select 
                value={filtros.camaraSeleccionada}
                onChange={(e) => handleFiltroChange('camaraSeleccionada', e.target.value)}
              >
                <option value="TODAS">Todas las Cámaras</option>
                {camarasDisponibles.map(camara => (
                  <option key={camara.id_camara} value={camara.id_camara}>
                    {camara.ubicacion}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Fecha Inicio</label>
              <Input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Fecha Fin</label>
              <Input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
              />
            </div>
          </div>

          <div className="filters-actions">
            <Button onClick={limpiarFiltros} className="outline">
              🗑️ Limpiar Filtros
            </Button>
            <span className="results-count">
              Mostrando {eventosFiltrados.length} eventos
            </span>
          </div>
        </div>

        {/* Gráficos y Estadísticas */}
        {mostrarGraficos && (
          <div className="stats-charts-section">
            <h3>📈 Análisis Gráfico</h3>
            
            {/* Placeholder para gráficos - En implementación real usaría Chart.js */}
            <div className="charts-grid">
              <div className="chart-container">
                <div className="chart-header">
                  <h4>Eventos por Tipo</h4>
                  <div className="chart-controls">
                    <button 
                      className={tipoGrafico === 'barras' ? 'active' : ''}
                      onClick={() => setTipoGrafico('barras')}
                    >📊</button>
                    <button 
                      className={tipoGrafico === 'dona' ? 'active' : ''}
                      onClick={() => setTipoGrafico('dona')}
                    >🍩</button>
                  </div>
                </div>
                <div className="chart-placeholder">
                  <div className="chart-mock">
                    {estadisticasPorTipo.slice(0, 4).map((stat, index) => (
                      <div key={stat.tipo} className="chart-bar" style={{height: `${50 + index * 20}px`}}>
                        <span className="bar-label">{stat.tipo.replace('_', ' ')}</span>
                        <span className="bar-value">{stat.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="chart-container">
                <div className="chart-header">
                  <h4>Tendencia Mensual</h4>
                </div>
                <div className="chart-placeholder">
                  <div className="trend-chart-mock">
                    {estadisticasMensuales.slice(-6).map((stat, index) => (
                      <div key={stat.mes} className="trend-point">
                        <div className="trend-line" style={{height: `${30 + (stat.incidentes * 2)}px`}}></div>
                        <span className="trend-label">{stat.mes.substring(0,3)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de Eventos Recientes */}
        <div className="stats-events-table">
          <div className="table-header">
            <h3>📋 Eventos Recientes</h3>
            <div className="table-actions">
              <Button onClick={() => setMostrarGraficos(!mostrarGraficos)} className="outline">
                {mostrarGraficos ? '👁️ Ocultar Gráficos' : '📈 Mostrar Gráficos'}
              </Button>
            </div>
          </div>

          {eventosFiltrados.length === 0 ? (
            <div className="no-data-message">
              <div className="no-data-icon">📊</div>
              <h3>Sin datos en el período seleccionado</h3>
              <p>No hay eventos de seguridad que coincidan con los filtros aplicados.</p>
              <Button onClick={limpiarFiltros} className="primary">
                Limpiar Filtros
              </Button>
            </div>
          ) : (
            <div className="events-table-container">
              <table className="events-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha/Hora</th>
                    <th>Ubicación</th>
                    <th>Tipo de Evento</th>
                    <th>Descripción</th>
                    <th>Confianza</th>
                    <th>Resultado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {eventosFiltrados.map(evento => (
                    <tr key={evento.id_evento}>
                      <td>#{evento.id_evento.toString().padStart(4, '0')}</td>
                      <td>{new Date(evento.fecha_hora).toLocaleString()}</td>
                      <td>{evento.ubicacion}</td>
                      <td>
                        <span className="event-type">{evento.tipo_evento.replace('_', ' ')}</span>
                      </td>
                      <td>{evento.descripcion}</td>
                      <td>
                        <span className={`confidence ${evento.nivel_confianza >= 90 ? 'high' : evento.nivel_confianza >= 70 ? 'medium' : 'low'}`}>
                          {evento.nivel_confianza}%
                        </span>
                      </td>
                      <td>{getResultadoBadge(evento.resultado)}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-action view">👁️</button>
                          <button className="btn-action download">📥</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Estadísticas por Cámaras */}
        <div className="camera-performance-section">
          <h3>📹 Rendimiento de Cámaras</h3>
          <div className="cameras-grid">
            {rendimientoCamaras.map(camara => (
              <div key={camara.id_camara} className="camera-card">
                <div className="camera-header">
                  <div className="camera-icon">📹</div>
                  <div>
                    <h4>{camara.ubicacion}</h4>
                    <span className="camera-id">Cámara #{camara.id_camara}</span>
                  </div>
                </div>
                <div className="camera-stats">
                  <div className="stat-item">
                    <span className="stat-label">Eventos</span>
                    <span className="stat-value">{camara.eventos_detectados}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Uptime</span>
                    <span className={`stat-value ${camara.uptime >= 95 ? 'success' : camara.uptime >= 85 ? 'warning' : 'danger'}`}>
                      {camara.uptime}%
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Precisión</span>
                    <span className="stat-value">{camara.precision}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Alertas</span>
                    <span className="stat-value">{camara.alertas_generadas}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default EstadisticasSeguridad;