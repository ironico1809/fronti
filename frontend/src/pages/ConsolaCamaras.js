import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { obtenerCamaras } from '../services/camaras';
import AgregarCamaraForm from '../components/AgregarCamaraForm';
import CamaraLocal from '../components/CamaraLocal';
import CamarasLocalesGrid from '../components/CamarasLocalesGrid';
import ReconocimientoFacial from '../components/ReconocimientoFacial';
import RegistrarRostro from '../components/RegistrarRostro';
import './ConsolaCamaras.css';
import '../components/CamarasLocalesGrid.css';

const tiposEvento = ['TODOS', 'MOVIMIENTO_SOSPECHOSO', 'PERSONA_DETECTADA', 'VISITANTE_NUEVO', 'VEHICULO_DESCONOCIDO'];
const estadosCamara = ['TODAS', 'ACTIVA', 'INACTIVA', 'MANTENIMIENTO'];

const ConsolaCamaras = () => {
  const [vistaActual, setVistaActual] = useState('mosaico');
  const [camaraSeleccionada, setCamaraSeleccionada] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  const [filtroEvento, setFiltroEvento] = useState('TODOS');
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [alertasActivas, setAlertasActivas] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [camaras, setCamaras] = useState([]);

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Contar alertas activas
  useEffect(() => {
    const alertas = camaras.filter(camara => 
      camara.alert_level === 'warning' || camara.alert_level === 'high'
    ).length;
    setAlertasActivas(alertas);
  }, [camaras]);

  // Obtener cámaras del backend
  const recargarCamaras = async () => {
    try {
      const data = await obtenerCamaras();
      setCamaras(data);
    } catch {
      setCamaras([]);
    }
  };

  useEffect(() => {
    recargarCamaras();
  }, []);

  const camarasFiltradas = camaras.filter(camara => {
    const estadoMatch = filtroEstado === 'TODAS' || (filtroEstado === 'ACTIVA' && camara.activa) || (filtroEstado === 'INACTIVA' && !camara.activa);
    return estadoMatch;
  });

  const abrirStreaming = (camara) => {
    if (camara.estado !== 'ACTIVA') {
      alert('La cámara no está disponible para streaming');
      return;
    }
    setCamaraSeleccionada(camara);
    setShowStreamModal(true);
  };

  const verEvento = (evento) => {
    setEventoSeleccionado(evento);
    setShowEventModal(true);
  };

  const getAlertIcon = (level) => {
    switch (level) {
      case 'high': return '🚨';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '✅';
    }
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'high': return 'alert-high';
      case 'warning': return 'alert-warning';
      case 'error': return 'alert-error';
      default: return 'alert-normal';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'ACTIVA': return 'estado-activa';
      case 'INACTIVA': return 'estado-inactiva';
      case 'MANTENIMIENTO': return 'estado-mantenimiento';
      default: return 'estado-unknown';
    }
  };

  return (
    <DashboardLayout>
      <AgregarCamaraForm onCamaraAgregada={recargarCamaras} />
      <div className="consola-camaras-page">
        {/* Header */}
        <div className="consola-camaras-header">
          <div className="consola-header-content">
            <div className="consola-header-title">
              <h1>Consola de Cámaras de Seguridad</h1>
              <p>Monitoreo y administración en tiempo real del sistema de videovigilancia</p>
            </div>
            <div className="consola-header-time">
              <div className="time-display">
                <span className="time-label">Hora del Sistema:</span>
                <span className="time-value">{currentTime.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Control */}
        <div className="consola-control-panel">
          <div className="control-stats">
            <div className="control-stat-card">
              <div className="stat-icon">📹</div>
              <div className="stat-info">
                <h3>{camaras.filter(c => c.estado === 'ACTIVA').length}</h3>
                <span>Cámaras Activas</span>
            {/* Reconocimiento facial */}
            <ReconocimientoFacial />
              </div>
            </div>
            <div className="control-stat-card">
              <div className="stat-icon">🚨</div>
              <div className="stat-info">
                <h3>{alertasActivas}</h3>
                <span>Alertas Activas</span>
              </div>
            </div>
            <div className="control-stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{camaras.length}</h3>
                <span>Total de Cámaras</span>
              </div>
            </div>
            <div className="control-stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <h3>{camaras.filter(c => c.estado === 'INACTIVA').length}</h3>
                <span>Fuera de Línea</span>
              </div>
            </div>
          </div>

          <div className="control-filters">
            <div className="filter-group">
              <label className="filter-label">Estado:</label>
              <select
                className="filter-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                {estadosCamara.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Vista:</label>
              <div className="vista-toggle">
                <button
                  className={`toggle-btn ${vistaActual === 'mosaico' ? 'active' : ''}`}
                  onClick={() => setVistaActual('mosaico')}
                >
                  🔳 Mosaico
                </button>
                <button
                  className={`toggle-btn ${vistaActual === 'lista' ? 'active' : ''}`}
                  onClick={() => setVistaActual('lista')}
                >
                  📋 Lista
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vista Principal */}
        <div className="consola-main-content">
          {/* Registro de rostro */}
          <RegistrarRostro />
          {/* Reconocimiento facial */}
          <ReconocimientoFacial />
          {/* Cámaras locales abajo */}
          <CamarasLocalesGrid cantidad={2} />
          {vistaActual === 'mosaico' ? (
            <div className="camaras-mosaico">
              {camarasFiltradas.map(camara => (
                <div key={camara.id_camara} className="camara-card">
                  <div className="camara-header">
                    <h4 className="camara-titulo">{camara.ubicacion}</h4>
                    <div className="camara-status">
                      <span className={`estado-badge ${getEstadoColor(camara.estado)}`}>
                        {camara.estado}
                      </span>
                      <span className={`alert-badge ${getAlertColor(camara.alert_level)}`}>
                        {getAlertIcon(camara.alert_level)}
                      </span>
                    </div>
                  </div>

                  <div className="camara-preview" onClick={() => abrirStreaming(camara)}>
                    {camara.estado === 'ACTIVA' ? (
                      <div className="streaming-placeholder">
                        <div className="streaming-icon">📹</div>
                        <p>Click para ver en vivo</p>
                      </div>
                    ) : (
                      <div className="streaming-offline">
                        <div className="offline-icon">📵</div>
                        <p>{camara.estado === 'MANTENIMIENTO' ? 'En Mantenimiento' : 'Fuera de Línea'}</p>
                      </div>
                    )}
                  </div>

                  <div className="camara-info">
                    <p className="camara-descripcion">{camara.descripcion}</p>
                    <div className="camara-stats">
                      <span className="stat-item">
                        🔔 {camara.events_today} eventos
                      </span>
                      <span className="stat-item">
                        🕐 {camara.last_event.split(' ')[1]}
                      </span>
                    </div>
                  </div>

                  <div className="camara-actions">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => abrirStreaming(camara)}
                      disabled={camara.estado !== 'ACTIVA'}
                    >
                      📺 Ver Stream
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="camaras-lista">
              <div className="lista-header">
                <div>Ubicación</div>
                <div>Estado</div>
                <div>Eventos Hoy</div>
                <div>Último Evento</div>
                <div>Alert Level</div>
                <div>Acciones</div>
              </div>
              {camarasFiltradas.map(camara => (
                <div key={camara.id_camara} className="lista-row">
                  <div className="lista-ubicacion">
                    <strong>{camara.ubicacion}</strong>
                    <p>{camara.descripcion}</p>
                  </div>
                  <div>
                    <span className={`estado-badge ${getEstadoColor(camara.estado)}`}>
                      {camara.estado}
                    </span>
                  </div>
                  <div className="lista-eventos">{camara.events_today}</div>
                  <div className="lista-tiempo">{camara.last_event}</div>
                  <div>
                    <span className={`alert-badge ${getAlertColor(camara.alert_level)}`}>
                      {getAlertIcon(camara.alert_level)}
                    </span>
                  </div>
                  <div>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => abrirStreaming(camara)}
                      disabled={camara.estado !== 'ACTIVA'}
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel de Eventos */}
        <div className="eventos-panel">
          <div className="eventos-header">
            <h3>Eventos Recientes</h3>
            <div className="eventos-filter">
              <select
                className="filter-select"
                value={filtroEvento}
                onChange={(e) => setFiltroEvento(e.target.value)}
              >
                {tiposEvento.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="eventos-lista">
            {camarasFiltradas.map(evento => (
              <div key={evento.id_evento} className="evento-item" onClick={() => verEvento(evento)}>
                <div className="evento-tiempo">
                  {evento.fecha_hora.split(' ')[1]}
                </div>
                <div className="evento-info">
                  <h5>{evento.tipo_evento.replace('_', ' ')}</h5>
                  <p>{evento.descripcion}</p>
                  <span className="evento-ubicacion">📍 {evento.ubicacion}</span>
                </div>
                <div className="evento-confianza">
                  {evento.confianza}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Streaming */}
      {showStreamModal && camaraSeleccionada && (
        <Modal
          title={`Streaming: ${camaraSeleccionada.ubicacion}`}
          onClose={() => setShowStreamModal(false)}
          size="large"
        >
          <div className="streaming-modal-content">
            <div className="streaming-video">
              <div className="video-placeholder">
                <div className="video-icon">📹</div>
                <p>Streaming en tiempo real</p>
                <p className="video-url">{camaraSeleccionada.streaming_url}</p>
              </div>
            </div>
            <div className="streaming-controls">
              <Button variant="primary">📸 Captura</Button>
              <Button variant="secondary">🔍 Zoom</Button>
              <Button variant="secondary">🎥 Grabar</Button>
            </div>
            <div className="streaming-info">
              <p><strong>Descripción:</strong> {camaraSeleccionada.descripcion}</p>
              <p><strong>Eventos hoy:</strong> {camaraSeleccionada.events_today}</p>
              <p><strong>Último evento:</strong> {camaraSeleccionada.last_event}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Evento */}
      {showEventModal && eventoSeleccionado && (
        <Modal
          title="Detalle del Evento"
          onClose={() => setShowEventModal(false)}
        >
          <div className="evento-modal-content">
            <div className="evento-imagen">
              <div className="imagen-placeholder">
                <div className="imagen-icon">🖼️</div>
                <p>Captura del evento</p>
                <p className="imagen-url">{eventoSeleccionado.url_imagen}</p>
              </div>
            </div>
            <div className="evento-detalles">
              <div className="detalle-field">
                <label>Tipo:</label>
                <span>{eventoSeleccionado.tipo_evento.replace('_', ' ')}</span>
              </div>
              <div className="detalle-field">
                <label>Fecha y Hora:</label>
                <span>{eventoSeleccionado.fecha_hora}</span>
              </div>
              <div className="detalle-field">
                <label>Ubicación:</label>
                <span>{eventoSeleccionado.ubicacion}</span>
              </div>
              <div className="detalle-field">
                <label>Descripción:</label>
                <span>{eventoSeleccionado.descripcion}</span>
              </div>
              <div className="detalle-field">
                <label>Confianza:</label>
                <span>{eventoSeleccionado.confianza}%</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default ConsolaCamaras;