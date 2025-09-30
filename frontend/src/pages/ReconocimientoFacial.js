// Archivo eliminado
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import './ReconocimientoFacial.css';

// Datos simulados basados en la BD real
const residentesMock = [
  {
    id_usuario: 1,
    nombre: 'Juan Carlos Pérez',
    unidad: 'Apt 101',
    estado: 'ACTIVO',
    foto_perfil: '/faces/juan_carlos.jpg',
    fecha_registro: '2024-01-15',
    ultimo_acceso: '2024-09-24 08:30:15',
    confianza_promedio: 95.7,
    accesos_total: 342,
    rostros_registrados: 3
  },
  {
    id_usuario: 2,
    nombre: 'María Elena García',
    unidad: 'Apt 205',
    estado: 'ACTIVO',
    foto_perfil: '/faces/maria_elena.jpg',
    fecha_registro: '2024-02-03',
    ultimo_acceso: '2024-09-24 09:15:22',
    confianza_promedio: 97.2,
    accesos_total: 298,
    rostros_registrados: 4
  },
  {
    id_usuario: 3,
    nombre: 'Carlos Rodríguez',
    unidad: 'Apt 312',
    estado: 'INACTIVO',
    foto_perfil: '/faces/carlos_rodriguez.jpg',
    fecha_registro: '2024-03-10',
    ultimo_acceso: '2024-09-20 18:45:33',
    confianza_promedio: 89.4,
    accesos_total: 156,
    rostros_registrados: 2
  },
  {
    id_usuario: 4,
    nombre: 'Ana Sofía Martín',
    unidad: 'Apt 408',
    estado: 'ACTIVO',
    foto_perfil: '/faces/ana_sofia.jpg',
    fecha_registro: '2024-01-28',
    ultimo_acceso: '2024-09-24 07:22:11',
    confianza_promedio: 92.8,
    accesos_total: 284,
    rostros_registrados: 3
  },
  {
    id_usuario: 5,
    nombre: 'Roberto Silva',
    unidad: 'Apt 515',
    estado: 'PENDIENTE',
    foto_perfil: '/faces/roberto_silva.jpg',
    fecha_registro: '2024-09-20',
    ultimo_acceso: null,
    confianza_promedio: 0,
    accesos_total: 0,
    rostros_registrados: 1
  }
];

// Historial de accesos recientes
const accesosRecientes = [
  {
    id_acceso: 1,
    id_usuario: 1,
    nombre: 'Juan Carlos Pérez',
    unidad: 'Apt 101',
    fecha_hora: '2024-09-24 09:45:12',
    punto_acceso: 'Entrada Principal',
    resultado: 'AUTORIZADO',
    confianza: 96.8,
    tiempo_procesamiento: 0.8,
    imagen_capturada: '/access/capture_001.jpg'
  },
  {
    id_acceso: 2,
    id_usuario: 2,
    nombre: 'María Elena García',
    unidad: 'Apt 205',
    fecha_hora: '2024-09-24 09:15:22',
    punto_acceso: 'Entrada Principal',
    resultado: 'AUTORIZADO',
    confianza: 97.2,
    tiempo_procesamiento: 0.6,
    imagen_capturada: '/access/capture_002.jpg'
  },
  {
    id_acceso: 3,
    id_usuario: null,
    nombre: 'DESCONOCIDO',
    unidad: 'N/A',
    fecha_hora: '2024-09-24 08:52:18',
    punto_acceso: 'Entrada Trasera',
    resultado: 'DENEGADO',
    confianza: 0,
    tiempo_procesamiento: 2.3,
    imagen_capturada: '/access/capture_003.jpg'
  },
  {
    id_acceso: 4,
    id_usuario: 4,
    nombre: 'Ana Sofía Martín',
    unidad: 'Apt 408',
    fecha_hora: '2024-09-24 07:22:11',
    punto_acceso: 'Entrada Principal',
    resultado: 'AUTORIZADO',
    confianza: 94.1,
    tiempo_procesamiento: 0.9,
    imagen_capturada: '/access/capture_004.jpg'
  },
  {
    id_acceso: 5,
    id_usuario: null,
    nombre: 'DESCONOCIDO',
    unidad: 'N/A',
    fecha_hora: '2024-09-24 06:18:45',
    punto_acceso: 'Entrada Principal',
    resultado: 'ALERTA',
    confianza: 0,
    tiempo_procesamiento: 1.8,
    imagen_capturada: '/access/capture_005.jpg'
  }
];

// Alertas del sistema
const alertasSistema = [
  {
    id_alerta: 1,
    tipo: 'ACCESO_DENEGADO',
    fecha_hora: '2024-09-24 08:52:18',
    descripcion: 'Rostro no reconocido en entrada trasera',
    punto_acceso: 'Entrada Trasera',
    estado: 'ACTIVA',
    imagen: '/alerts/alert_001.jpg'
  },
  {
    id_alerta: 2,
    tipo: 'BAJA_CONFIANZA',
    fecha_hora: '2024-09-24 06:35:22',
    descripcion: 'Reconocimiento con baja confianza (74.2%)',
    punto_acceso: 'Entrada Principal',
    estado: 'REVISADA',
    imagen: '/alerts/alert_002.jpg'
  },
  {
    id_alerta: 3,
    tipo: 'CAMARA_OFFLINE',
    fecha_hora: '2024-09-23 22:15:33',
    descripcion: 'Cámara de entrada trasera desconectada',
    punto_acceso: 'Entrada Trasera',
    estado: 'RESUELTA',
    imagen: null
  }
];

const estadosResidente = ['TODOS', 'ACTIVO', 'INACTIVO', 'PENDIENTE'];
const resultadosAcceso = ['TODOS', 'AUTORIZADO', 'DENEGADO', 'ALERTA'];

const ReconocimientoFacial = () => {
  const [vistaActual, setVistaActual] = useState('residentes');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroResultado, setFiltroResultado] = useState('TODOS');
  const [residenteSeleccionado, setResidenteSeleccionado] = useState(null);
  const [showResidenteModal, setShowResidenteModal] = useState(false);
  const [showAccesoModal, setShowAccesoModal] = useState(false);
  const [showAlertaModal, setShowAlertaModal] = useState(false);
  const [accesoSeleccionado, setAccesoSeleccionado] = useState(null);
  const [alertaSeleccionada, setAlertaSeleccionada] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtrar residentes
  const residentesFiltrados = residentesMock.filter(residente => {
    return filtroEstado === 'TODOS' || residente.estado === filtroEstado;
  });

  // Filtrar accesos
  const accesosFiltrados = accesosRecientes.filter(acceso => {
    return filtroResultado === 'TODOS' || acceso.resultado === filtroResultado;
  });

  const verDetalleResidente = (residente) => {
    setResidenteSeleccionado(residente);
    setShowResidenteModal(true);
  };

  const verDetalleAcceso = (acceso) => {
    setAccesoSeleccionado(acceso);
    setShowAccesoModal(true);
  };

  const verDetalleAlerta = (alerta) => {
    setAlertaSeleccionada(alerta);
    setShowAlertaModal(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'ACTIVO': return 'estado-activo';
      case 'INACTIVO': return 'estado-inactivo';
      case 'PENDIENTE': return 'estado-pendiente';
      default: return 'estado-unknown';
    }
  };

  const getResultadoColor = (resultado) => {
    switch (resultado) {
      case 'AUTORIZADO': return 'resultado-autorizado';
      case 'DENEGADO': return 'resultado-denegado';
      case 'ALERTA': return 'resultado-alerta';
      default: return 'resultado-unknown';
    }
  };

  const getAlertaColor = (estado) => {
    switch (estado) {
      case 'ACTIVA': return 'alerta-activa';
      case 'REVISADA': return 'alerta-revisada';
      case 'RESUELTA': return 'alerta-resuelta';
      default: return 'alerta-unknown';
    }
  };

  const getConfianzaColor = (confianza) => {
    if (confianza >= 95) return 'confianza-excelente';
    if (confianza >= 85) return 'confianza-buena';
    if (confianza >= 70) return 'confianza-regular';
    return 'confianza-baja';
  };

  return (
    <DashboardLayout>
      <div className="reconocimiento-facial-page">
        {/* Header */}
        <div className="reconocimiento-header">
          <div className="reconocimiento-header-content">
            <div className="reconocimiento-header-title">
              <h1>Reconocimiento Facial de Residentes</h1>
              <p>Acceso automático y control de seguridad mediante identificación facial</p>
            </div>
            <div className="reconocimiento-header-time">
              <div className="time-display">
                <span className="time-label">Sistema Activo:</span>
                <span className="time-value">{currentTime.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Estadísticas */}
        <div className="reconocimiento-stats-panel">
          <div className="stats-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{residentesMock.filter(r => r.estado === 'ACTIVO').length}</h3>
              <span>Residentes Activos</span>
            </div>
          </div>
          <div className="stats-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{accesosRecientes.filter(a => a.resultado === 'AUTORIZADO').length}</h3>
              <span>Accesos Hoy</span>
            </div>
          </div>
          <div className="stats-card">
            <div className="stat-icon">🚨</div>
            <div className="stat-info">
              <h3>{alertasSistema.filter(a => a.estado === 'ACTIVA').length}</h3>
              <span>Alertas Activas</span>
            </div>
          </div>
          <div className="stats-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>94.2%</h3>
              <span>Precisión Sistema</span>
            </div>
          </div>
        </div>

        {/* Navegación de Vistas */}
        <div className="reconocimiento-nav">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${vistaActual === 'residentes' ? 'active' : ''}`}
              onClick={() => setVistaActual('residentes')}
            >
              👥 Residentes Registrados
            </button>
            <button
              className={`nav-tab ${vistaActual === 'accesos' ? 'active' : ''}`}
              onClick={() => setVistaActual('accesos')}
            >
              🚪 Historial de Accesos
            </button>
            <button
              className={`nav-tab ${vistaActual === 'alertas' ? 'active' : ''}`}
              onClick={() => setVistaActual('alertas')}
            >
              ⚠️ Alertas del Sistema
            </button>
          </div>

          <div className="nav-filters">
            {vistaActual === 'residentes' && (
              <div className="filter-group">
                <label className="filter-label">Estado:</label>
                <select
                  className="filter-select"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  {estadosResidente.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
            )}

            {vistaActual === 'accesos' && (
              <div className="filter-group">
                <label className="filter-label">Resultado:</label>
                <select
                  className="filter-select"
                  value={filtroResultado}
                  onChange={(e) => setFiltroResultado(e.target.value)}
                >
                  {resultadosAcceso.map(resultado => (
                    <option key={resultado} value={resultado}>{resultado}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="reconocimiento-main-content">
          {vistaActual === 'residentes' && (
            <div className="residentes-grid">
              {residentesFiltrados.map(residente => (
                <div key={residente.id_usuario} className="residente-card">
                  <div className="residente-header">
                    <div className="residente-avatar">
                      <div className="avatar-placeholder">
                        🧑‍💼
                      </div>
                    </div>
                    <div className="residente-info">
                      <h4 className="residente-nombre">{residente.nombre}</h4>
                      <p className="residente-unidad">{residente.unidad}</p>
                      <span className={`estado-badge ${getEstadoColor(residente.estado)}`}>
                        {residente.estado}
                      </span>
                    </div>
                  </div>

                  <div className="residente-stats">
                    <div className="stat-row">
                      <span className="stat-label">Confianza:</span>
                      <span className={`stat-value ${getConfianzaColor(residente.confianza_promedio)}`}>
                        {residente.confianza_promedio}%
                      </span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Accesos:</span>
                      <span className="stat-value">{residente.accesos_total}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Rostros:</span>
                      <span className="stat-value">{residente.rostros_registrados}</span>
                    </div>
                  </div>

                  <div className="residente-actions">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => verDetalleResidente(residente)}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {vistaActual === 'accesos' && (
            <div className="accesos-lista">
              <div className="accesos-header">
                <div>Residente</div>
                <div>Fecha/Hora</div>
                <div>Punto de Acceso</div>
                <div>Resultado</div>
                <div>Confianza</div>
                <div>Tiempo</div>
                <div>Acciones</div>
              </div>
              {accesosFiltrados.map(acceso => (
                <div key={acceso.id_acceso} className="acceso-row">
                  <div className="acceso-residente">
                    <strong>{acceso.nombre}</strong>
                    <p>{acceso.unidad}</p>
                  </div>
                  <div className="acceso-fecha">{acceso.fecha_hora}</div>
                  <div className="acceso-punto">{acceso.punto_acceso}</div>
                  <div>
                    <span className={`resultado-badge ${getResultadoColor(acceso.resultado)}`}>
                      {acceso.resultado}
                    </span>
                  </div>
                  <div className={`acceso-confianza ${getConfianzaColor(acceso.confianza)}`}>
                    {acceso.confianza > 0 ? `${acceso.confianza}%` : 'N/A'}
                  </div>
                  <div className="acceso-tiempo">{acceso.tiempo_procesamiento}s</div>
                  <div>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => verDetalleAcceso(acceso)}
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {vistaActual === 'alertas' && (
            <div className="alertas-lista">
              {alertasSistema.map(alerta => (
                <div key={alerta.id_alerta} className="alerta-item">
                  <div className="alerta-icon">
                    {alerta.tipo === 'ACCESO_DENEGADO' && '🚫'}
                    {alerta.tipo === 'BAJA_CONFIANZA' && '⚠️'}
                    {alerta.tipo === 'CAMARA_OFFLINE' && '📵'}
                  </div>
                  <div className="alerta-info">
                    <h5 className="alerta-tipo">{alerta.tipo.replace('_', ' ')}</h5>
                    <p className="alerta-descripcion">{alerta.descripcion}</p>
                    <div className="alerta-meta">
                      <span className="alerta-fecha">{alerta.fecha_hora}</span>
                      <span className="alerta-punto">📍 {alerta.punto_acceso}</span>
                    </div>
                  </div>
                  <div className="alerta-estado">
                    <span className={`estado-badge ${getAlertaColor(alerta.estado)}`}>
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

      {/* Modal Detalle Residente */}
      {showResidenteModal && residenteSeleccionado && (
        <Modal
          title={`Residente: ${residenteSeleccionado.nombre}`}
          onClose={() => setShowResidenteModal(false)}
          size="large"
        >
          <div className="residente-modal-content">
            <div className="residente-foto">
              <div className="foto-placeholder">
                <div className="foto-icon">🧑‍💼</div>
                <p>Foto de perfil</p>
              </div>
            </div>
            <div className="residente-detalles">
              <div className="detalle-field">
                <label>Nombre Completo:</label>
                <span>{residenteSeleccionado.nombre}</span>
              </div>
              <div className="detalle-field">
                <label>Unidad:</label>
                <span>{residenteSeleccionado.unidad}</span>
              </div>
              <div className="detalle-field">
                <label>Estado:</label>
                <span className={`estado-badge ${getEstadoColor(residenteSeleccionado.estado)}`}>
                  {residenteSeleccionado.estado}
                </span>
              </div>
              <div className="detalle-field">
                <label>Fecha Registro:</label>
                <span>{residenteSeleccionado.fecha_registro}</span>
              </div>
              <div className="detalle-field">
                <label>Último Acceso:</label>
                <span>{residenteSeleccionado.ultimo_acceso || 'Nunca'}</span>
              </div>
              <div className="detalle-field">
                <label>Confianza Promedio:</label>
                <span className={getConfianzaColor(residenteSeleccionado.confianza_promedio)}>
                  {residenteSeleccionado.confianza_promedio}%
                </span>
              </div>
              <div className="detalle-field">
                <label>Total Accesos:</label>
                <span>{residenteSeleccionado.accesos_total}</span>
              </div>
              <div className="detalle-field">
                <label>Rostros Registrados:</label>
                <span>{residenteSeleccionado.rostros_registrados}</span>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <Button variant="primary">Actualizar Rostros</Button>
            <Button variant="secondary">Editar Perfil</Button>
            <Button variant="danger">Desactivar</Button>
          </div>
        </Modal>
      )}

      {/* Modal Detalle Acceso */}
      {showAccesoModal && accesoSeleccionado && (
        <Modal
          title="Detalle del Acceso"
          onClose={() => setShowAccesoModal(false)}
        >
          <div className="acceso-modal-content">
            <div className="acceso-imagen">
              <div className="imagen-placeholder">
                <div className="imagen-icon">📷</div>
                <p>Imagen capturada</p>
              </div>
            </div>
            <div className="acceso-detalles">
              <div className="detalle-field">
                <label>Residente:</label>
                <span>{accesoSeleccionado.nombre}</span>
              </div>
              <div className="detalle-field">
                <label>Unidad:</label>
                <span>{accesoSeleccionado.unidad}</span>
              </div>
              <div className="detalle-field">
                <label>Fecha y Hora:</label>
                <span>{accesoSeleccionado.fecha_hora}</span>
              </div>
              <div className="detalle-field">
                <label>Punto de Acceso:</label>
                <span>{accesoSeleccionado.punto_acceso}</span>
              </div>
              <div className="detalle-field">
                <label>Resultado:</label>
                <span className={`resultado-badge ${getResultadoColor(accesoSeleccionado.resultado)}`}>
                  {accesoSeleccionado.resultado}
                </span>
              </div>
              <div className="detalle-field">
                <label>Confianza:</label>
                <span className={getConfianzaColor(accesoSeleccionado.confianza)}>
                  {accesoSeleccionado.confianza > 0 ? `${accesoSeleccionado.confianza}%` : 'N/A'}
                </span>
              </div>
              <div className="detalle-field">
                <label>Tiempo de Procesamiento:</label>
                <span>{accesoSeleccionado.tiempo_procesamiento}s</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Detalle Alerta */}
      {showAlertaModal && alertaSeleccionada && (
        <Modal
          title="Detalle de la Alerta"
          onClose={() => setShowAlertaModal(false)}
        >
          <div className="alerta-modal-content">
            <div className="alerta-detalles">
              <div className="detalle-field">
                <label>Tipo:</label>
                <span>{alertaSeleccionada.tipo.replace('_', ' ')}</span>
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
                <label>Estado:</label>
                <span className={`estado-badge ${getAlertaColor(alertaSeleccionada.estado)}`}>
                  {alertaSeleccionada.estado}
                </span>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <Button variant="primary">Marcar como Revisada</Button>
            <Button variant="secondary">Resolver</Button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default ReconocimientoFacial;