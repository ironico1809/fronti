// Archivo eliminado
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import './IdentificacionVehiculos.css';

// Datos simulados basados en la BD real
const accesosVehiculos = [
  {
    id_acceso: 1,
    fecha_hora: '2024-09-24 10:45:32',
    placa: 'ABC-123',
    punto_acceso: 'Entrada Principal Vehicular',
    imagen_capturada: '/vehicles/capture_001.jpg',
    estado: 'AUTORIZADO',
    confianza_ocr: 96.8,
    tiempo_procesamiento: 1.2,
    vehiculo_registrado: {
      id_vehiculo: 1,
      marca: 'Toyota',
      modelo: 'Corolla',
      color: 'Blanco',
      año: 2022
    },
    propietario: {
      nombre: 'Juan Carlos Pérez',
      unidad: 'Apt 101',
      telefono: '+1234567890'
    },
    accion_barrera: 'ABIERTA',
    tiempo_respuesta: 0.8,
    notas: 'Acceso autorizado automáticamente'
  },
  {
    id_acceso: 2,
    fecha_hora: '2024-09-24 09:32:18',
    placa: 'XYZ-789',
    punto_acceso: 'Entrada Visitantes',
    imagen_capturada: '/vehicles/capture_002.jpg',
    estado: 'PENDIENTE',
    confianza_ocr: 78.5,
    tiempo_procesamiento: 2.1,
    vehiculo_registrado: null,
    propietario: null,
    accion_barrera: 'CERRADA',
    tiempo_respuesta: null,
    notas: 'Placa no registrada - requiere validación manual'
  },
  {
    id_acceso: 3,
    fecha_hora: '2024-09-24 08:15:45',
    placa: 'DEF-456',
    punto_acceso: 'Entrada Principal Vehicular',
    imagen_capturada: '/vehicles/capture_003.jpg',
    estado: 'DENEGADO',
    confianza_ocr: 92.3,
    tiempo_procesamiento: 1.5,
    vehiculo_registrado: null,
    propietario: null,
    accion_barrera: 'CERRADA',
    tiempo_respuesta: 1.0,
    notas: 'Vehículo en lista negra - acceso denegado'
  },
  {
    id_acceso: 4,
    fecha_hora: '2024-09-24 07:48:22',
    placa: 'GHI-789',
    punto_acceso: 'Entrada Servicio',
    imagen_capturada: '/vehicles/capture_004.jpg',
    estado: 'AUTORIZADO',
    confianza_ocr: 88.9,
    tiempo_procesamiento: 1.8,
    vehiculo_registrado: {
      id_vehiculo: 2,
      marca: 'Chevrolet',
      modelo: 'Spark',
      color: 'Azul',
      año: 2020
    },
    propietario: {
      nombre: 'María Elena García',
      unidad: 'Apt 205',
      telefono: '+0987654321'
    },
    accion_barrera: 'ABIERTA',
    tiempo_respuesta: 0.6,
    notas: 'Acceso autorizado - vehículo de residente'
  },
  {
    id_acceso: 5,
    fecha_hora: '2024-09-24 06:25:11',
    placa: 'ERROR_OCR',
    punto_acceso: 'Entrada Principal Vehicular',
    imagen_capturada: '/vehicles/capture_005.jpg',
    estado: 'ERROR',
    confianza_ocr: 45.2,
    tiempo_procesamiento: 3.2,
    vehiculo_registrado: null,
    propietario: null,
    accion_barrera: 'CERRADA',
    tiempo_respuesta: null,
    notas: 'Error de lectura OCR - placa ilegible debido a condiciones climáticas'
  }
];

// Vehículos registrados en el sistema
const vehiculosRegistrados = [
  {
    id_vehiculo: 1,
    placa: 'ABC-123',
    marca: 'Toyota',
    modelo: 'Corolla',
    color: 'Blanco',
    año: 2022,
    propietario: {
      nombre: 'Juan Carlos Pérez',
      unidad: 'Apt 101',
      telefono: '+1234567890',
      id_usuario: 1
    },
    fecha_registro: '2024-01-15',
    estado: 'ACTIVO',
    tipo_vehiculo: 'AUTOMOVIL',
    accesos_totales: 186,
    ultimo_acceso: '2024-09-24 10:45:32',
    observaciones: 'Vehículo principal del residente'
  },
  {
    id_vehiculo: 2,
    placa: 'GHI-789',
    marca: 'Chevrolet',
    modelo: 'Spark',
    color: 'Azul',
    año: 2020,
    propietario: {
      nombre: 'María Elena García',
      unidad: 'Apt 205',
      telefono: '+0987654321',
      id_usuario: 2
    },
    fecha_registro: '2024-02-03',
    estado: 'ACTIVO',
    tipo_vehiculo: 'AUTOMOVIL',
    accesos_totales: 142,
    ultimo_acceso: '2024-09-24 07:48:22',
    observaciones: 'Segundo vehículo registrado'
  },
  {
    id_vehiculo: 3,
    placa: 'JKL-456',
    marca: 'Yamaha',
    modelo: 'FZ-25',
    color: 'Negro',
    año: 2021,
    propietario: {
      nombre: 'Carlos Rodríguez',
      unidad: 'Apt 312',
      telefono: '+1122334455',
      id_usuario: 3
    },
    fecha_registro: '2024-03-10',
    estado: 'SUSPENDIDO',
    tipo_vehiculo: 'MOTOCICLETA',
    accesos_totales: 89,
    ultimo_acceso: '2024-09-20 18:30:15',
    observaciones: 'Suspendido por incumplimiento de normas'
  },
  {
    id_vehiculo: 4,
    placa: 'MNO-789',
    marca: 'Ford',
    modelo: 'Transit',
    color: 'Blanco',
    año: 2019,
    propietario: {
      nombre: 'Servicio Técnico ABC',
      unidad: 'Proveedor Autorizado',
      telefono: '+5566778899',
      id_usuario: null
    },
    fecha_registro: '2024-01-20',
    estado: 'ACTIVO',
    tipo_vehiculo: 'VAN',
    accesos_totales: 45,
    ultimo_acceso: '2024-09-22 14:20:30',
    observaciones: 'Vehículo de servicio técnico autorizado'
  }
];

// Alertas del sistema OCR
const alertasOCR = [
  {
    id_alerta: 1,
    tipo: 'PLACA_NO_REGISTRADA',
    fecha_hora: '2024-09-24 09:32:18',
    descripcion: 'Vehículo con placa XYZ-789 no encontrado en base de datos',
    punto_acceso: 'Entrada Visitantes',
    placa_detectada: 'XYZ-789',
    confianza: 78.5,
    estado: 'ACTIVA',
    prioridad: 'MEDIA',
    imagen: '/alerts/ocr_001.jpg',
    acciones_tomadas: []
  },
  {
    id_alerta: 2,
    tipo: 'ERROR_LECTURA_OCR',
    fecha_hora: '2024-09-24 06:25:11',
    descripcion: 'Error en lectura de placa - confianza inferior al umbral (45.2%)',
    punto_acceso: 'Entrada Principal Vehicular',
    placa_detectada: 'ERROR_OCR',
    confianza: 45.2,
    estado: 'PENDIENTE',
    prioridad: 'ALTA',
    imagen: '/alerts/ocr_002.jpg',
    acciones_tomadas: ['Verificación manual solicitada']
  },
  {
    id_alerta: 3,
    tipo: 'VEHICULO_SUSPENDIDO',
    fecha_hora: '2024-09-23 16:45:20',
    descripcion: 'Intento de acceso con vehículo suspendido JKL-456',
    punto_acceso: 'Entrada Principal Vehicular',
    placa_detectada: 'JKL-456',
    confianza: 94.1,
    estado: 'RESUELTA',
    prioridad: 'ALTA',
    imagen: '/alerts/ocr_003.jpg',
    acciones_tomadas: ['Acceso denegado', 'Propietario contactado', 'Incidente registrado']
  },
  {
    id_alerta: 4,
    tipo: 'MULTIPLE_INTENTOS',
    fecha_hora: '2024-09-23 12:30:45',
    descripcion: 'Múltiples intentos de acceso con placa no registrada DEF-456',
    punto_acceso: 'Entrada Principal Vehicular',
    placa_detectada: 'DEF-456',
    confianza: 91.8,
    estado: 'RESUELTA',
    prioridad: 'CRITICA',
    imagen: '/alerts/ocr_004.jpg',
    acciones_tomadas: ['Seguridad notificada', 'Vehículo añadido a lista negra']
  }
];

const estadosAcceso = ['TODOS', 'AUTORIZADO', 'PENDIENTE', 'DENEGADO', 'ERROR'];
const estadosVehiculo = ['TODOS', 'ACTIVO', 'SUSPENDIDO', 'INACTIVO'];
const tiposVehiculo = ['TODOS', 'AUTOMOVIL', 'MOTOCICLETA', 'VAN', 'CAMION'];
const prioridadesAlerta = ['TODOS', 'CRITICA', 'ALTA', 'MEDIA', 'BAJA'];

const IdentificacionVehiculos = () => {
  const [vistaActual, setVistaActual] = useState('accesos');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroEstadoVehiculo, setFiltroEstadoVehiculo] = useState('TODOS');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroPrioridad, setFiltroPrioridad] = useState('TODOS');
  const [accesoSeleccionado, setAccesoSeleccionado] = useState(null);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [alertaSeleccionada, setAlertaSeleccionada] = useState(null);
  const [showAccesoModal, setShowAccesoModal] = useState(false);
  const [showVehiculoModal, setShowVehiculoModal] = useState(false);
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

  // Filtrar accesos
  const accesosFiltrados = accesosVehiculos.filter(acceso => {
    return filtroEstado === 'TODOS' || acceso.estado === filtroEstado;
  });

  // Filtrar vehículos
  const vehiculosFiltrados = vehiculosRegistrados.filter(vehiculo => {
    const coincideEstado = filtroEstadoVehiculo === 'TODOS' || vehiculo.estado === filtroEstadoVehiculo;
    const coincideTipo = filtroTipo === 'TODOS' || vehiculo.tipo_vehiculo === filtroTipo;
    return coincideEstado && coincideTipo;
  });

  // Filtrar alertas
  const alertasFiltradas = alertasOCR.filter(alerta => {
    return filtroPrioridad === 'TODOS' || alerta.prioridad === filtroPrioridad;
  });

  const verDetalleAcceso = (acceso) => {
    setAccesoSeleccionado(acceso);
    setShowAccesoModal(true);
  };

  const verDetalleVehiculo = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setShowVehiculoModal(true);
  };

  const verDetalleAlerta = (alerta) => {
    setAlertaSeleccionada(alerta);
    setShowAlertaModal(true);
  };

  const abrirRegistroVehiculo = () => {
    setShowRegistroModal(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'AUTORIZADO': return 'estado-autorizado';
      case 'PENDIENTE': return 'estado-pendiente';
      case 'DENEGADO': return 'estado-denegado';
      case 'ERROR': return 'estado-error';
      case 'ACTIVO': return 'estado-activo';
      case 'SUSPENDIDO': return 'estado-suspendido';
      case 'INACTIVO': return 'estado-inactivo';
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

  const getTipoVehiculoIcon = (tipo) => {
    switch (tipo) {
      case 'AUTOMOVIL': return '🚗';
      case 'MOTOCICLETA': return '🏍️';
      case 'VAN': return '🚐';
      case 'CAMION': return '🚛';
      default: return '🚙';
    }
  };

  return (
    <DashboardLayout>
      <div className="identificacion-vehiculos-page">
        {/* Header */}
        <div className="identificacion-header">
          <div className="identificacion-header-content">
            <div className="identificacion-header-title">
              <h1>Identificación de Vehículos (OCR)</h1>
              <p>Reconocimiento automático de placas vehiculares para control de acceso</p>
            </div>
            <div className="identificacion-header-time">
              <div className="time-display">
                <span className="time-label">Sistema OCR Activo:</span>
                <span className="time-value">{currentTime.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Estadísticas */}
        <div className="identificacion-stats-panel">
          <div className="stats-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{accesosVehiculos.filter(a => a.estado === 'AUTORIZADO').length}</h3>
              <span>Accesos Autorizados</span>
            </div>
          </div>
          <div className="stats-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{accesosVehiculos.filter(a => a.estado === 'PENDIENTE').length}</h3>
              <span>Pendientes Validación</span>
            </div>
          </div>
          <div className="stats-card">
            <div className="stat-icon">🚗</div>
            <div className="stat-info">
              <h3>{vehiculosRegistrados.filter(v => v.estado === 'ACTIVO').length}</h3>
              <span>Vehículos Registrados</span>
            </div>
          </div>
          <div className="stats-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>87.6%</h3>
              <span>Precisión OCR Promedio</span>
            </div>
          </div>
        </div>

        {/* Navegación de Vistas */}
        <div className="identificacion-nav">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${vistaActual === 'accesos' ? 'active' : ''}`}
              onClick={() => setVistaActual('accesos')}
            >
              🚪 Accesos Vehiculares
            </button>
            <button
              className={`nav-tab ${vistaActual === 'vehiculos' ? 'active' : ''}`}
              onClick={() => setVistaActual('vehiculos')}
            >
              🚗 Vehículos Registrados
            </button>
            <button
              className={`nav-tab ${vistaActual === 'alertas' ? 'active' : ''}`}
              onClick={() => setVistaActual('alertas')}
            >
              ⚠️ Alertas OCR
            </button>
          </div>

          <div className="nav-filters">
            {vistaActual === 'accesos' && (
              <div className="filter-group">
                <label className="filter-label">Estado:</label>
                <select
                  className="filter-select"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  {estadosAcceso.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
            )}

            {vistaActual === 'vehiculos' && (
              <>
                <div className="filter-group">
                  <label className="filter-label">Estado:</label>
                  <select
                    className="filter-select"
                    value={filtroEstadoVehiculo}
                    onChange={(e) => setFiltroEstadoVehiculo(e.target.value)}
                  >
                    {estadosVehiculo.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Tipo:</label>
                  <select
                    className="filter-select"
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                  >
                    {tiposVehiculo.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
              </>
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

            <Button
              variant="primary"
              size="small"
              onClick={abrirRegistroVehiculo}
            >
              + Registrar Vehículo
            </Button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="identificacion-main-content">
          {vistaActual === 'accesos' && (
            <div className="accesos-lista">
              <div className="accesos-header">
                <div>Placa</div>
                <div>Fecha/Hora</div>
                <div>Punto de Acceso</div>
                <div>Estado</div>
                <div>Confianza OCR</div>
                <div>Propietario</div>
                <div>Acciones</div>
              </div>
              {accesosFiltrados.map(acceso => (
                <div key={acceso.id_acceso} className="acceso-row">
                  <div className="acceso-placa">
                    <strong>{acceso.placa}</strong>
                    {acceso.vehiculo_registrado && (
                      <p>{acceso.vehiculo_registrado.marca} {acceso.vehiculo_registrado.modelo}</p>
                    )}
                  </div>
                  <div className="acceso-fecha">{acceso.fecha_hora}</div>
                  <div className="acceso-punto">{acceso.punto_acceso}</div>
                  <div>
                    <span className={`estado-badge ${getEstadoColor(acceso.estado)}`}>
                      {acceso.estado}
                    </span>
                  </div>
                  <div className={`acceso-confianza ${getConfianzaColor(acceso.confianza_ocr)}`}>
                    {acceso.confianza_ocr > 0 ? `${acceso.confianza_ocr}%` : 'ERROR'}
                  </div>
                  <div className="acceso-propietario">
                    {acceso.propietario ? (
                      <>
                        <strong>{acceso.propietario.nombre}</strong>
                        <p>{acceso.propietario.unidad}</p>
                      </>
                    ) : (
                      <span className="no-registrado">No registrado</span>
                    )}
                  </div>
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

          {vistaActual === 'vehiculos' && (
            <div className="vehiculos-grid">
              {vehiculosFiltrados.map(vehiculo => (
                <div key={vehiculo.id_vehiculo} className="vehiculo-card">
                  <div className="vehiculo-header">
                    <div className="vehiculo-icon">
                      {getTipoVehiculoIcon(vehiculo.tipo_vehiculo)}
                    </div>
                    <div className="vehiculo-info">
                      <h4 className="vehiculo-placa">{vehiculo.placa}</h4>
                      <p className="vehiculo-modelo">{vehiculo.marca} {vehiculo.modelo}</p>
                      <span className={`estado-badge ${getEstadoColor(vehiculo.estado)}`}>
                        {vehiculo.estado}
                      </span>
                    </div>
                  </div>

                  <div className="vehiculo-detalles">
                    <div className="detalle-row">
                      <span className="detalle-label">Propietario:</span>
                      <span className="detalle-valor">{vehiculo.propietario.nombre}</span>
                    </div>
                    <div className="detalle-row">
                      <span className="detalle-label">Unidad:</span>
                      <span className="detalle-valor">{vehiculo.propietario.unidad}</span>
                    </div>
                    <div className="detalle-row">
                      <span className="detalle-label">Año:</span>
                      <span className="detalle-valor">{vehiculo.año}</span>
                    </div>
                    <div className="detalle-row">
                      <span className="detalle-label">Color:</span>
                      <span className="detalle-valor">{vehiculo.color}</span>
                    </div>
                    <div className="detalle-row">
                      <span className="detalle-label">Accesos:</span>
                      <span className="detalle-valor">{vehiculo.accesos_totales}</span>
                    </div>
                  </div>

                  <div className="vehiculo-actions">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => verDetalleVehiculo(vehiculo)}
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
                    {alerta.tipo === 'PLACA_NO_REGISTRADA' && '❓'}
                    {alerta.tipo === 'ERROR_LECTURA_OCR' && '📷'}
                    {alerta.tipo === 'VEHICULO_SUSPENDIDO' && '🚫'}
                    {alerta.tipo === 'MULTIPLE_INTENTOS' && '🚨'}
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
                      <span className="alerta-placa">🚗 {alerta.placa_detectada}</span>
                      <span className={`alerta-confianza ${getConfianzaColor(alerta.confianza)}`}>
                        📊 {alerta.confianza}%
                      </span>
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

      {/* Modal Detalle Acceso */}
      {showAccesoModal && accesoSeleccionado && (
        <Modal
          title={`Acceso Vehicular - ${accesoSeleccionado.placa}`}
          onClose={() => setShowAccesoModal(false)}
          size="large"
        >
          <div className="acceso-modal-content">
            <div className="acceso-imagen">
              <div className="imagen-placeholder-grande">
                <div className="imagen-icon">📷</div>
                <p>Imagen de placa capturada</p>
              </div>
            </div>
            <div className="acceso-detalles-modal">
              <div className="detalle-field">
                <label>Placa:</label>
                <span className="placa-highlight">{accesoSeleccionado.placa}</span>
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
                <label>Estado:</label>
                <span className={`estado-badge ${getEstadoColor(accesoSeleccionado.estado)}`}>
                  {accesoSeleccionado.estado}
                </span>
              </div>
              <div className="detalle-field">
                <label>Confianza OCR:</label>
                <span className={getConfianzaColor(accesoSeleccionado.confianza_ocr)}>
                  {accesoSeleccionado.confianza_ocr}%
                </span>
              </div>
              <div className="detalle-field">
                <label>Tiempo Procesamiento:</label>
                <span>{accesoSeleccionado.tiempo_procesamiento}s</span>
              </div>
              <div className="detalle-field">
                <label>Acción Barrera:</label>
                <span className={accesoSeleccionado.accion_barrera === 'ABIERTA' ? 'barrera-abierta' : 'barrera-cerrada'}>
                  {accesoSeleccionado.accion_barrera}
                </span>
              </div>
              {accesoSeleccionado.vehiculo_registrado && (
                <>
                  <div className="detalle-field">
                    <label>Vehículo:</label>
                    <span>
                      {accesoSeleccionado.vehiculo_registrado.marca} {accesoSeleccionado.vehiculo_registrado.modelo} 
                      ({accesoSeleccionado.vehiculo_registrado.año})
                    </span>
                  </div>
                  <div className="detalle-field">
                    <label>Color:</label>
                    <span>{accesoSeleccionado.vehiculo_registrado.color}</span>
                  </div>
                </>
              )}
              {accesoSeleccionado.propietario && (
                <>
                  <div className="detalle-field">
                    <label>Propietario:</label>
                    <span>{accesoSeleccionado.propietario.nombre}</span>
                  </div>
                  <div className="detalle-field">
                    <label>Unidad:</label>
                    <span>{accesoSeleccionado.propietario.unidad}</span>
                  </div>
                </>
              )}
              <div className="detalle-field">
                <label>Notas:</label>
                <span>{accesoSeleccionado.notas}</span>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            {accesoSeleccionado.estado === 'PENDIENTE' && (
              <>
                <Button variant="success">Autorizar Acceso</Button>
                <Button variant="danger">Denegar Acceso</Button>
                <Button variant="secondary">Registrar Vehículo</Button>
              </>
            )}
            <Button variant="primary">Generar Reporte</Button>
          </div>
        </Modal>
      )}

      {/* Modal Detalle Vehículo */}
      {showVehiculoModal && vehiculoSeleccionado && (
        <Modal
          title={`Vehículo: ${vehiculoSeleccionado.placa}`}
          onClose={() => setShowVehiculoModal(false)}
        >
          <div className="vehiculo-modal-content">
            <div className="vehiculo-detalles-modal">
              <div className="detalle-field">
                <label>Placa:</label>
                <span className="placa-highlight">{vehiculoSeleccionado.placa}</span>
              </div>
              <div className="detalle-field">
                <label>Marca:</label>
                <span>{vehiculoSeleccionado.marca}</span>
              </div>
              <div className="detalle-field">
                <label>Modelo:</label>
                <span>{vehiculoSeleccionado.modelo}</span>
              </div>
              <div className="detalle-field">
                <label>Año:</label>
                <span>{vehiculoSeleccionado.año}</span>
              </div>
              <div className="detalle-field">
                <label>Color:</label>
                <span>{vehiculoSeleccionado.color}</span>
              </div>
              <div className="detalle-field">
                <label>Tipo:</label>
                <span>
                  {getTipoVehiculoIcon(vehiculoSeleccionado.tipo_vehiculo)} {vehiculoSeleccionado.tipo_vehiculo}
                </span>
              </div>
              <div className="detalle-field">
                <label>Estado:</label>
                <span className={`estado-badge ${getEstadoColor(vehiculoSeleccionado.estado)}`}>
                  {vehiculoSeleccionado.estado}
                </span>
              </div>
              <div className="detalle-field">
                <label>Propietario:</label>
                <span>{vehiculoSeleccionado.propietario.nombre}</span>
              </div>
              <div className="detalle-field">
                <label>Unidad:</label>
                <span>{vehiculoSeleccionado.propietario.unidad}</span>
              </div>
              <div className="detalle-field">
                <label>Teléfono:</label>
                <span>{vehiculoSeleccionado.propietario.telefono}</span>
              </div>
              <div className="detalle-field">
                <label>Fecha Registro:</label>
                <span>{vehiculoSeleccionado.fecha_registro}</span>
              </div>
              <div className="detalle-field">
                <label>Accesos Totales:</label>
                <span>{vehiculoSeleccionado.accesos_totales}</span>
              </div>
              <div className="detalle-field">
                <label>Último Acceso:</label>
                <span>{vehiculoSeleccionado.ultimo_acceso}</span>
              </div>
              <div className="detalle-field">
                <label>Observaciones:</label>
                <span>{vehiculoSeleccionado.observaciones}</span>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <Button variant="primary">Editar Información</Button>
            <Button variant="secondary">Ver Historial</Button>
            {vehiculoSeleccionado.estado === 'ACTIVO' ? (
              <Button variant="warning">Suspender</Button>
            ) : (
              <Button variant="success">Activar</Button>
            )}
          </div>
        </Modal>
      )}

      {/* Modal Detalle Alerta */}
      {showAlertaModal && alertaSeleccionada && (
        <Modal
          title="Detalle de Alerta OCR"
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
                <label>Placa Detectada:</label>
                <span className="placa-highlight">{alertaSeleccionada.placa_detectada}</span>
              </div>
              <div className="detalle-field">
                <label>Confianza:</label>
                <span className={getConfianzaColor(alertaSeleccionada.confianza)}>
                  {alertaSeleccionada.confianza}%
                </span>
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

      {/* Modal Registro de Vehículo */}
      {showRegistroModal && (
        <Modal
          title="Registrar Nuevo Vehículo"
          onClose={() => setShowRegistroModal(false)}
          size="large"
        >
          <div className="registro-modal-content">
            <div className="registro-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Placa:</label>
                  <input type="text" className="form-input" placeholder="Ej: ABC-123" />
                </div>
                <div className="form-field">
                  <label>Tipo de Vehículo:</label>
                  <select className="form-select">
                    <option value="">Seleccione un tipo</option>
                    <option value="AUTOMOVIL">Automóvil</option>
                    <option value="MOTOCICLETA">Motocicleta</option>
                    <option value="VAN">Van</option>
                    <option value="CAMION">Camión</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Marca:</label>
                  <input type="text" className="form-input" placeholder="Ej: Toyota" />
                </div>
                <div className="form-field">
                  <label>Modelo:</label>
                  <input type="text" className="form-input" placeholder="Ej: Corolla" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Año:</label>
                  <input type="number" className="form-input" placeholder="Ej: 2022" min="1990" max="2025" />
                </div>
                <div className="form-field">
                  <label>Color:</label>
                  <input type="text" className="form-input" placeholder="Ej: Blanco" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Propietario:</label>
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
                  <label>Observaciones:</label>
                  <textarea className="form-textarea" rows="3" placeholder="Observaciones adicionales sobre el vehículo"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <Button variant="primary">Registrar Vehículo</Button>
            <Button variant="secondary">Guardar como Borrador</Button>
            <Button variant="danger">Cancelar</Button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default IdentificacionVehiculos;