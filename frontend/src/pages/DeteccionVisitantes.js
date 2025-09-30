import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import './DeteccionVisitantes.css';

// Datos simulados basados en la BD real
const visitantesDetectados = [
  {
    id_deteccion: 1,
    fecha_hora: '2024-09-24 10:32:18',
    punto_acceso: 'Entrada Principal',
    imagen_capturada: '/detections/visitor_001.jpg',
    estado: 'PENDIENTE',
    confianza_deteccion: 87.5,
    tiempo_procesamiento: 1.2,
    visitante_registrado: null,
    residente_contactado: null,
    motivo_visita: null,
    autorizado_por: null,
    notas: 'Persona no identificada en horario laboral'
  },
  {
    id_deteccion: 2,
    fecha_hora: '2024-09-24 09:45:33',
    punto_acceso: 'Entrada Trasera',
    imagen_capturada: '/detections/visitor_002.jpg',
    estado: 'AUTORIZADO',
    confianza_deteccion: 92.3,
    tiempo_procesamiento: 0.8,
    visitante_registrado: {
      nombre: 'Carlos Mendoza',
      cedula: '12345678',
      telefono: '+1234567890'
    },
    residente_contactado: 'María Elena García - Apt 205',
    motivo_visita: 'Visita familiar',
    autorizado_por: 'A3 - Personal de Seguridad',
    notas: 'Visitante autorizado y registrado correctamente'
  },
  {
    id_deteccion: 3,
    fecha_hora: '2024-09-24 08:15:22',
    punto_acceso: 'Entrada Principal',
    imagen_capturada: '/detections/visitor_003.jpg',
    estado: 'DENEGADO',
    confianza_deteccion: 95.1,
    tiempo_procesamiento: 1.5,
    visitante_registrado: null,
    residente_contactado: null,
    motivo_visita: 'No especificado',
    autorizado_por: null,
    notas: 'Acceso denegado - comportamiento sospechoso'
  },
  {
    id_deteccion: 4,
    fecha_hora: '2024-09-24 07:28:41',
    punto_acceso: 'Entrada Servicio',
    imagen_capturada: '/detections/visitor_004.jpg',
    estado: 'AUTORIZADO',
    confianza_deteccion: 89.7,
    tiempo_procesamiento: 0.9,
    visitante_registrado: {
      nombre: 'Ana Rodríguez',
      cedula: '87654321',
      telefono: '+0987654321'
    },
    residente_contactado: 'Juan Carlos Pérez - Apt 101',
    motivo_visita: 'Servicio técnico',
    autorizado_por: 'A1 - Administrador',
    notas: 'Técnico autorizado para mantenimiento'
  },
  {
    id_deteccion: 5,
    fecha_hora: '2024-09-24 06:52:15',
    punto_acceso: 'Entrada Principal',
    imagen_capturada: '/detections/visitor_005.jpg',
    estado: 'PENDIENTE',
    confianza_deteccion: 76.8,
    tiempo_procesamiento: 2.1,
    visitante_registrado: null,
    residente_contactado: null,
    motivo_visita: null,
    autorizado_por: null,
    notas: 'Detección con baja confianza - requiere verificación'
  }
];

// Visitantes registrados actualmente
const visitantesRegistrados = [
  {
    id_visitante: 1,
    nombre: 'Carlos Mendoza',
    cedula: '12345678',
    telefono: '+1234567890',
    fecha_registro: '2024-09-24 09:45:33',
    residente_anfitrion: 'María Elena García',
    unidad_anfitrion: 'Apt 205',
    motivo_visita: 'Visita familiar',
    fecha_inicio: '2024-09-24 10:00:00',
    fecha_fin: '2024-09-24 18:00:00',
    estado: 'ACTIVO',
    autorizaciones: 3,
    ultima_deteccion: '2024-09-24 09:45:33'
  },
  {
    id_visitante: 2,
    nombre: 'Ana Rodríguez',
    cedula: '87654321',
    telefono: '+0987654321',
    fecha_registro: '2024-09-24 07:28:41',
    residente_anfitrion: 'Juan Carlos Pérez',
    unidad_anfitrion: 'Apt 101',
    motivo_visita: 'Servicio técnico',
    fecha_inicio: '2024-09-24 08:00:00',
    fecha_fin: '2024-09-24 17:00:00',
    estado: 'ACTIVO',
    autorizaciones: 1,
    ultima_deteccion: '2024-09-24 07:28:41'
  },
  {
    id_visitante: 3,
    nombre: 'Luis González',
    cedula: '11223344',
    telefono: '+1122334455',
    fecha_registro: '2024-09-23 16:30:22',
    residente_anfitrion: 'Carlos Rodríguez',
    unidad_anfitrion: 'Apt 312',
    motivo_visita: 'Reunión de trabajo',
    fecha_inicio: '2024-09-23 17:00:00',
    fecha_fin: '2024-09-23 21:00:00',
    estado: 'EXPIRADO',
    autorizaciones: 2,
    ultima_deteccion: '2024-09-23 20:45:12'
  }
];

// Alertas de seguridad
const alertasSeguridad = [
  {
    id_alerta: 1,
    tipo: 'VISITANTE_NO_AUTORIZADO',
    fecha_hora: '2024-09-24 10:32:18',
    descripcion: 'Persona no registrada detectada en entrada principal',
    punto_acceso: 'Entrada Principal',
    estado: 'ACTIVA',
    prioridad: 'ALTA',
    imagen: '/alerts/security_001.jpg',
    acciones_tomadas: []
  },
  {
    id_alerta: 2,
    tipo: 'ACCESO_DENEGADO',
    fecha_hora: '2024-09-24 08:15:22',
    descripción: 'Acceso denegado por comportamiento sospechoso',
    punto_acceso: 'Entrada Principal',
    estado: 'RESUELTA',
    prioridad: 'CRITICA',
    imagen: '/alerts/security_002.jpg',
    acciones_tomadas: ['Contacto con seguridad', 'Registro de incidente']
  },
  {
    id_alerta: 3,
    tipo: 'BAJA_CONFIANZA',
    fecha_hora: '2024-09-24 06:52:15',
    descripción: 'Detección con confianza inferior al umbral (76.8%)',
    punto_acceso: 'Entrada Principal',
    estado: 'PENDIENTE',
    prioridad: 'MEDIA',
    imagen: '/alerts/security_003.jpg',
    acciones_tomadas: ['Verificación manual solicitada']
  }
];

const estadosDeteccion = ['TODOS', 'PENDIENTE', 'AUTORIZADO', 'DENEGADO'];
const estadosVisitante = ['TODOS', 'ACTIVO', 'EXPIRADO', 'SUSPENDIDO'];
const prioridadesAlerta = ['TODOS', 'CRITICA', 'ALTA', 'MEDIA', 'BAJA'];

const DeteccionVisitantes = () => {
  const [vistaActual, setVistaActual] = useState('detecciones');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroEstadoVisitante, setFiltroEstadoVisitante] = useState('TODOS');
  const [filtroPrioridad, setFiltroPrioridad] = useState('TODOS');
  const [deteccionSeleccionada, setDeteccionSeleccionada] = useState(null);
  const [visitanteSeleccionado, setVisitanteSeleccionado] = useState(null);
  const [alertaSeleccionada, setAlertaSeleccionada] = useState(null);
  const [showDeteccionModal, setShowDeteccionModal] = useState(false);
  const [showVisitanteModal, setShowVisitanteModal] = useState(false);
  const [showAlertaModal, setShowAlertaModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtrar detecciones
  const deteccionesFiltradas = visitantesDetectados.filter(deteccion => {
    return filtroEstado === 'TODOS' || deteccion.estado === filtroEstado;
  });

  // Filtrar visitantes registrados
  const visitantesFiltrados = visitantesRegistrados.filter(visitante => {
    return filtroEstadoVisitante === 'TODOS' || visitante.estado === filtroEstadoVisitante;
  });

  // Filtrar alertas
  const alertasFiltradas = alertasSeguridad.filter(alerta => {
    return filtroPrioridad === 'TODOS' || alerta.prioridad === filtroPrioridad;
  });

  const verDetalleDeteccion = (deteccion) => {
    setDeteccionSeleccionada(deteccion);
    setShowDeteccionModal(true);
  };

  const verDetalleVisitante = (visitante) => {
    setVisitanteSeleccionado(visitante);
    setShowVisitanteModal(true);
  };

  const verDetalleAlerta = (alerta) => {
    setAlertaSeleccionada(alerta);
    setShowAlertaModal(true);
  };

  const abrirRegistroVisitante = (deteccion) => {
    setDeteccionSeleccionada(deteccion);
    setShowRegistroModal(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'estado-pendiente';
      case 'AUTORIZADO': return 'estado-autorizado';
      case 'DENEGADO': return 'estado-denegado';
      case 'ACTIVO': return 'estado-activo';
      case 'EXPIRADO': return 'estado-expirado';
      case 'SUSPENDIDO': return 'estado-suspendido';
      default: return 'estado-unknown';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'CRITICA': return 'prioridad-critica';
      case 'ALTA': return 'prioridad-alta';
      case 'MEDIA': return 'prioridad-media';
      case 'BAJA': return 'prioridad-baja';
      default: return 'prioridad-unknown';
    }
  };

  const getConfianzaColor = (confianza) => {
    if (confianza >= 90) return 'confianza-excelente';
    if (confianza >= 80) return 'confianza-buena';
    if (confianza >= 70) return 'confianza-regular';
    return 'confianza-baja';
  };

  return (
    <DashboardLayout>
      <div className="deteccion-visitantes-page">
        {/* Header */}
        <div className="deteccion-header">
          <div className="deteccion-header-content">
            <div className="deteccion-header-title">
              <h1>Detección de Visitantes No Registrados</h1>
              <p>Monitoreo y control de acceso para personas no registradas en el sistema</p>
            </div>
            <div className="deteccion-header-time">
              <div className="time-display">
                <span className="time-label">Sistema Activo:</span>
                <span className="time-value">{currentTime.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Estadísticas */}
        <div className="deteccion-stats-panel">
          <div className="stats-card">
            <div className="stat-icon">🚨</div>
            <div className="stat-info">
              <h3>{visitantesDetectados.filter(d => d.estado === 'PENDIENTE').length}</h3>
              <span>Detecciones Pendientes</span>
            </div>
          </div>
          <div className="stats-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{visitantesDetectados.filter(d => d.estado === 'AUTORIZADO').length}</h3>
              <span>Visitantes Autorizados</span>
            </div>
          </div>
          <div className="stats-card">
            <div className="stat-icon">🚫</div>
            <div className="stat-info">
              <h3>{visitantesDetectados.filter(d => d.estado === 'DENEGADO').length}</h3>
              <span>Accesos Denegados</span>
            </div>
          </div>
          <div className="stats-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{visitantesRegistrados.filter(v => v.estado === 'ACTIVO').length}</h3>
              <span>Visitantes Activos</span>
            </div>
          </div>
        </div>

        {/* Navegación de Vistas */}
        <div className="deteccion-nav">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${vistaActual === 'detecciones' ? 'active' : ''}`}
              onClick={() => setVistaActual('detecciones')}
            >
              🎯 Detecciones Recientes
            </button>
            <button
              className={`nav-tab ${vistaActual === 'visitantes' ? 'active' : ''}`}
              onClick={() => setVistaActual('visitantes')}
            >
              👥 Visitantes Registrados
            </button>
            <button
              className={`nav-tab ${vistaActual === 'alertas' ? 'active' : ''}`}
              onClick={() => setVistaActual('alertas')}
            >
              ⚠️ Alertas de Seguridad
            </button>
          </div>

          <div className="nav-filters">
            {vistaActual === 'detecciones' && (
              <div className="filter-group">
                <label className="filter-label">Estado:</label>
                <select
                  className="filter-select"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  {estadosDeteccion.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
            )}

            {vistaActual === 'visitantes' && (
              <div className="filter-group">
                <label className="filter-label">Estado:</label>
                <select
                  className="filter-select"
                  value={filtroEstadoVisitante}
                  onChange={(e) => setFiltroEstadoVisitante(e.target.value)}
                >
                  {estadosVisitante.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
            )}

            {vistaActual === 'alertas' && (
              <div className="filter-group">
                <label className="filter-label">Prioridad:</label>
                <select
                  className="filter-select"
                  value={filtroPrioridad}
                  onChange={(e) => setFiltroPrioridad(e.target.value)}
                >
                  {prioridadesAlerta.map(prioridad => (
                    <option key={prioridad} value={prioridad}>{prioridad}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="deteccion-main-content">
          {vistaActual === 'detecciones' && (
            <div className="detecciones-lista">
              {deteccionesFiltradas.map(deteccion => (
                <div key={deteccion.id_deteccion} className="deteccion-item">
                  <div className="deteccion-imagen">
                    <div className="imagen-placeholder">
                      <div className="imagen-icon">📷</div>
                    </div>
                  </div>
                  <div className="deteccion-info">
                    <div className="deteccion-header-info">
                      <h4 className="deteccion-id">Detección #{deteccion.id_deteccion}</h4>
                      <span className={`estado-badge ${getEstadoColor(deteccion.estado)}`}>
                        {deteccion.estado}
                      </span>
                    </div>
                    <div className="deteccion-detalles">
                      <div className="detalle-row">
                        <span className="detalle-label">Fecha/Hora:</span>
                        <span className="detalle-valor">{deteccion.fecha_hora}</span>
                      </div>
                      <div className="detalle-row">
                        <span className="detalle-label">Punto de Acceso:</span>
                        <span className="detalle-valor">{deteccion.punto_acceso}</span>
                      </div>
                      <div className="detalle-row">
                        <span className="detalle-label">Confianza:</span>
                        <span className={`detalle-valor ${getConfianzaColor(deteccion.confianza_deteccion)}`}>
                          {deteccion.confianza_deteccion}%
                        </span>
                      </div>
                      <div className="detalle-row">
                        <span className="detalle-label">Tiempo:</span>
                        <span className="detalle-valor">{deteccion.tiempo_procesamiento}s</span>
                      </div>
                    </div>
                    <div className="deteccion-notas">
                      <p>{deteccion.notas}</p>
                    </div>
                  </div>
                  <div className="deteccion-actions">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => verDetalleDeteccion(deteccion)}
                    >
                      Ver Detalles
                    </Button>
                    {deteccion.estado === 'PENDIENTE' && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => abrirRegistroVisitante(deteccion)}
                      >
                        Registrar Visitante
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {vistaActual === 'visitantes' && (
            <div className="visitantes-grid">
              {visitantesFiltrados.map(visitante => (
                <div key={visitante.id_visitante} className="visitante-card">
                  <div className="visitante-header">
                    <div className="visitante-avatar">
                      <div className="avatar-placeholder">
                        👤
                      </div>
                    </div>
                    <div className="visitante-info">
                      <h4 className="visitante-nombre">{visitante.nombre}</h4>
                      <p className="visitante-cedula">ID: {visitante.cedula}</p>
                      <span className={`estado-badge ${getEstadoColor(visitante.estado)}`}>
                        {visitante.estado}
                      </span>
                    </div>
                  </div>

                  <div className="visitante-detalles">
                    <div className="detalle-row">
                      <span className="detalle-label">Anfitrión:</span>
                      <span className="detalle-valor">{visitante.residente_anfitrion}</span>
                    </div>
                    <div className="detalle-row">
                      <span className="detalle-label">Unidad:</span>
                      <span className="detalle-valor">{visitante.unidad_anfitrion}</span>
                    </div>
                    <div className="detalle-row">
                      <span className="detalle-label">Motivo:</span>
                      <span className="detalle-valor">{visitante.motivo_visita}</span>
                    </div>
                    <div className="detalle-row">
                      <span className="detalle-label">Autorizaciones:</span>
                      <span className="detalle-valor">{visitante.autorizaciones}</span>
                    </div>
                  </div>

                  <div className="visitante-actions">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => verDetalleVisitante(visitante)}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {vistaActual === 'alertas' && (
            <div className="alertas-lista">
              {alertasFiltradas.map(alerta => (
                <div key={alerta.id_alerta} className="alerta-item">
                  <div className="alerta-icon">
                    {alerta.tipo === 'VISITANTE_NO_AUTORIZADO' && '🚨'}
                    {alerta.tipo === 'ACCESO_DENEGADO' && '🚫'}
                    {alerta.tipo === 'BAJA_CONFIANZA' && '⚠️'}
                  </div>
                  <div className="alerta-info">
                    <div className="alerta-header-info">
                      <h5 className="alerta-tipo">{alerta.tipo.replace(/_/g, ' ')}</h5>
                      <span className={`prioridad-badge ${getPrioridadColor(alerta.prioridad)}`}>
                        {alerta.prioridad}
                      </span>
                    </div>
                    <p className="alerta-descripcion">{alerta.descripcion}</p>
                    <div className="alerta-meta">
                      <span className="alerta-fecha">{alerta.fecha_hora}</span>
                      <span className="alerta-punto">📍 {alerta.punto_acceso}</span>
                    </div>
                  </div>
                  <div className="alerta-estado">
                    <span className={`estado-badge ${getEstadoColor(alerta.estado)}`}>
                      {alerta.estado}
                    </span>
                  </div>
                  <div className="alerta-actions">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => verDetalleAlerta(alerta)}
                    >
                      Revisar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Detalle Detección */}
      {showDeteccionModal && deteccionSeleccionada && (
        <Modal
          title={`Detección #${deteccionSeleccionada.id_deteccion}`}
          onClose={() => setShowDeteccionModal(false)}
          size="large"
        >
          <div className="deteccion-modal-content">
            <div className="deteccion-imagen-grande">
              <div className="imagen-placeholder-grande">
                <div className="imagen-icon">📷</div>
                <p>Imagen capturada</p>
              </div>
            </div>
            <div className="deteccion-detalles-modal">
              <div className="detalle-field">
                <label>Fecha y Hora:</label>
                <span>{deteccionSeleccionada.fecha_hora}</span>
              </div>
              <div className="detalle-field">
                <label>Punto de Acceso:</label>
                <span>{deteccionSeleccionada.punto_acceso}</span>
              </div>
              <div className="detalle-field">
                <label>Estado:</label>
                <span className={`estado-badge ${getEstadoColor(deteccionSeleccionada.estado)}`}>
                  {deteccionSeleccionada.estado}
                </span>
              </div>
              <div className="detalle-field">
                <label>Confianza:</label>
                <span className={getConfianzaColor(deteccionSeleccionada.confianza_deteccion)}>
                  {deteccionSeleccionada.confianza_deteccion}%
                </span>
              </div>
              <div className="detalle-field">
                <label>Tiempo de Procesamiento:</label>
                <span>{deteccionSeleccionada.tiempo_procesamiento}s</span>
              </div>
              {deteccionSeleccionada.visitante_registrado && (
                <>
                  <div className="detalle-field">
                    <label>Visitante:</label>
                    <span>{deteccionSeleccionada.visitante_registrado.nombre}</span>
                  </div>
                  <div className="detalle-field">
                    <label>Residente Contactado:</label>
                    <span>{deteccionSeleccionada.residente_contactado}</span>
                  </div>
                  <div className="detalle-field">
                    <label>Motivo:</label>
                    <span>{deteccionSeleccionada.motivo_visita}</span>
                  </div>
                </>
              )}
              <div className="detalle-field">
                <label>Autorizado por:</label>
                <span>{deteccionSeleccionada.autorizado_por || 'N/A'}</span>
              </div>
              <div className="detalle-field">
                <label>Notas:</label>
                <span>{deteccionSeleccionada.notas}</span>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            {deteccionSeleccionada.estado === 'PENDIENTE' && (
              <>
                <Button variant="success">Autorizar</Button>
                <Button variant="danger">Denegar</Button>
                <Button variant="secondary">Registrar Visitante</Button>
              </>
            )}
            <Button variant="primary">Generar Reporte</Button>
          </div>
        </Modal>
      )}

      {/* Modal Detalle Visitante */}
      {showVisitanteModal && visitanteSeleccionado && (
        <Modal
          title={`Visitante: ${visitanteSeleccionado.nombre}`}
          onClose={() => setShowVisitanteModal(false)}
        >
          <div className="visitante-modal-content">
            <div className="visitante-detalles-modal">
              <div className="detalle-field">
                <label>Nombre Completo:</label>
                <span>{visitanteSeleccionado.nombre}</span>
              </div>
              <div className="detalle-field">
                <label>Cédula:</label>
                <span>{visitanteSeleccionado.cedula}</span>
              </div>
              <div className="detalle-field">
                <label>Teléfono:</label>
                <span>{visitanteSeleccionado.telefono}</span>
              </div>
              <div className="detalle-field">
                <label>Estado:</label>
                <span className={`estado-badge ${getEstadoColor(visitanteSeleccionado.estado)}`}>
                  {visitanteSeleccionado.estado}
                </span>
              </div>
              <div className="detalle-field">
                <label>Anfitrión:</label>
                <span>{visitanteSeleccionado.residente_anfitrion}</span>
              </div>
              <div className="detalle-field">
                <label>Unidad:</label>
                <span>{visitanteSeleccionado.unidad_anfitrion}</span>
              </div>
              <div className="detalle-field">
                <label>Motivo de Visita:</label>
                <span>{visitanteSeleccionado.motivo_visita}</span>
              </div>
              <div className="detalle-field">
                <label>Fecha de Registro:</label>
                <span>{visitanteSeleccionado.fecha_registro}</span>
              </div>
              <div className="detalle-field">
                <label>Vigencia:</label>
                <span>{visitanteSeleccionado.fecha_inicio} - {visitanteSeleccionado.fecha_fin}</span>
              </div>
              <div className="detalle-field">
                <label>Autorizaciones:</label>
                <span>{visitanteSeleccionado.autorizaciones}</span>
              </div>
              <div className="detalle-field">
                <label>Última Detección:</label>
                <span>{visitanteSeleccionado.ultima_deteccion}</span>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <Button variant="primary">Extender Vigencia</Button>
            <Button variant="secondary">Editar Información</Button>
            <Button variant="danger">Suspender Acceso</Button>
          </div>
        </Modal>
      )}

      {/* Modal Detalle Alerta */}
      {showAlertaModal && alertaSeleccionada && (
        <Modal
          title="Detalle de Alerta de Seguridad"
          onClose={() => setShowAlertaModal(false)}
        >
          <div className="alerta-modal-content">
            <div className="alerta-detalles-modal">
              <div className="detalle-field">
                <label>Tipo:</label>
                <span>{alertaSeleccionada.tipo.replace(/_/g, ' ')}</span>
              </div>
              <div className="detalle-field">
                <label>Descripción:</label>
                <span>{alertaSeleccionada.descripcion}</span>
              </div>
              <div className="detalle-field">
                <label>Fecha y Hora:</label>
                <span>{alertaSeleccionada.fecha_hora}</span>
              </div>
              <div className="detalle-field">
                <label>Punto de Acceso:</label>
                <span>{alertaSeleccionada.punto_acceso}</span>
              </div>
              <div className="detalle-field">
                <label>Prioridad:</label>
                <span className={`prioridad-badge ${getPrioridadColor(alertaSeleccionada.prioridad)}`}>
                  {alertaSeleccionada.prioridad}
                </span>
              </div>
              <div className="detalle-field">
                <label>Estado:</label>
                <span className={`estado-badge ${getEstadoColor(alertaSeleccionada.estado)}`}>
                  {alertaSeleccionada.estado}
                </span>
              </div>
              <div className="detalle-field">
                <label>Acciones Tomadas:</label>
                <span>{alertaSeleccionada.acciones_tomadas.join(', ') || 'Ninguna'}</span>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <Button variant="primary">Marcar como Resuelta</Button>
            <Button variant="secondary">Asignar Personal</Button>
            <Button variant="warning">Escalar Alerta</Button>
          </div>
        </Modal>
      )}

      {/* Modal Registro de Visitante */}
      {showRegistroModal && deteccionSeleccionada && (
        <Modal
          title="Registrar Nuevo Visitante"
          onClose={() => setShowRegistroModal(false)}
          size="large"
        >
          <div className="registro-modal-content">
            <div className="registro-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Nombre Completo:</label>
                  <input type="text" className="form-input" placeholder="Ingrese el nombre completo" />
                </div>
                <div className="form-field">
                  <label>Cédula:</label>
                  <input type="text" className="form-input" placeholder="Número de cédula" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Teléfono:</label>
                  <input type="tel" className="form-input" placeholder="Número de teléfono" />
                </div>
                <div className="form-field">
                  <label>Residente Anfitrión:</label>
                  <select className="form-select">
                    <option value="">Seleccione un residente</option>
                    <option value="1">Juan Carlos Pérez - Apt 101</option>
                    <option value="2">María Elena García - Apt 205</option>
                    <option value="3">Carlos Rodríguez - Apt 312</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Motivo de Visita:</label>
                  <input type="text" className="form-input" placeholder="Describa el motivo de la visita" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Fecha de Inicio:</label>
                  <input type="datetime-local" className="form-input" />
                </div>
                <div className="form-field">
                  <label>Fecha de Fin:</label>
                  <input type="datetime-local" className="form-input" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Observaciones:</label>
                  <textarea className="form-textarea" rows="3" placeholder="Observaciones adicionales"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <Button variant="primary">Registrar y Autorizar</Button>
            <Button variant="secondary">Guardar como Borrador</Button>
            <Button variant="danger">Cancelar</Button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default DeteccionVisitantes;