
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import './SeguimientoMantenimiento.css';
import { obtenerPlanesMantenimiento, obtenerOrdenesMantenimiento, obtenerEvidenciasMantenimiento } from '../services/api';

// Constantes para selects y filtros
const estados = ['TODAS', 'PROGRAMADA', 'EN_EJECUCION', 'COMPLETADA', 'REPROGRAMADA', 'CANCELADA'];
const frecuencias = ['SEMANAL', 'QUINCENAL', 'MENSUAL', 'BIMESTRAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'];

const SeguimientoMantenimiento = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [evidencias, setEvidencias] = useState([]);
  const [vistaActual, setVistaActual] = useState('ordenes'); // 'ordenes' o 'planes'
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  const [filtroPlan, setFiltroPlan] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(''); // 'ejecutar', 'completar', 'evidencia', 'plan'
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

  const [formEjecucion, setFormEjecucion] = useState({
    observaciones_inicio: '',
    tiempo_estimado_real: ''
  });

  const [formCompletar, setFormCompletar] = useState({
    tiempo_real: '',
    costo_real: '',
    observaciones: '',
    requiere_reprogramacion: false,
    proxima_fecha: ''
  });

  const [formEvidencia, setFormEvidencia] = useState({
    tipo: 'FOTO',
    descripcion: '',
    archivo: null
  });

  const [formPlan, setFormPlan] = useState({
    nombre: '',
    descripcion: '',
    frecuencia: 'MENSUAL',
    activos: [],
    proxima_ejecucion: '',
    tiempo_estimado: '',
    costo_estimado: ''
  });

  // Cargar datos reales al montar
  useEffect(() => {
    async function fetchData() {
      try {
        const [ordenesData, planesData, evidenciasData] = await Promise.all([
          obtenerOrdenesMantenimiento(),
          obtenerPlanesMantenimiento(),
          obtenerEvidenciasMantenimiento()
        ]);
        setOrdenes(ordenesData);
        setPlanes(planesData);
        setEvidencias(evidenciasData);
      } catch (e) {
        setOrdenes([]);
        setPlanes([]);
        setEvidencias([]);
      }
    }
    fetchData();
  }, []);

  const limpiarFiltros = () => {
    setFiltroEstado('TODAS');
    setFiltroPlan('TODOS');
    setBusqueda('');
  };

  const ordenesFiltradas = ordenes.filter(orden => {
    const cumpleBusqueda = !busqueda || 
      orden.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      orden.activo.toLowerCase().includes(busqueda.toLowerCase()) ||
      orden.plan_nombre.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleEstado = filtroEstado === 'TODAS' || orden.estado === filtroEstado;
    const cumplePlan = filtroPlan === 'TODOS' || orden.id_plan === parseInt(filtroPlan);

    return cumpleBusqueda && cumpleEstado && cumplePlan;
  });

  const iniciarEjecucion = (orden) => {
    setOrdenSeleccionada(orden);
    setFormEjecucion({
      observaciones_inicio: '',
      tiempo_estimado_real: orden.tiempo_estimado || ''
    });
    setModalTipo('ejecutar');
    setModalOpen(true);
  };

  const completarOrden = (orden) => {
    setOrdenSeleccionada(orden);
    setFormCompletar({
      tiempo_real: orden.tiempo_real || '',
      costo_real: orden.costo_real || '',
      observaciones: '',
      requiere_reprogramacion: false,
      proxima_fecha: ''
    });
    setModalTipo('completar');
    setModalOpen(true);
  };

  const abrirEvidencias = (orden) => {
    setOrdenSeleccionada(orden);
    setFormEvidencia({
      tipo: 'FOTO',
      descripcion: '',
      archivo: null
    });
    setModalTipo('evidencia');
    setModalOpen(true);
  };

  const crearPlan = () => {
    setPlanSeleccionado(null);
    setFormPlan({
      nombre: '',
      descripcion: '',
      frecuencia: 'MENSUAL',
      activos: [],
      proxima_ejecucion: '',
      tiempo_estimado: '',
      costo_estimado: ''
    });
    setModalTipo('plan');
    setModalOpen(true);
  };

  const guardarEjecucion = () => {
    setOrdenes(prev => prev.map(o => 
      o.id_orden === ordenSeleccionada.id_orden 
        ? {
            ...o,
            estado: 'EN_EJECUCION',
            fecha_inicio: new Date().toISOString(),
            observaciones: formEjecucion.observaciones_inicio
          }
        : o
    ));
    setModalOpen(false);
    alert('Ejecución iniciada exitosamente');
  };

  const guardarComplecion = () => {
    // Validaciones
    if (!formCompletar.tiempo_real || isNaN(formCompletar.tiempo_real) || Number(formCompletar.tiempo_real) <= 0) {
      alert('Por favor ingresa un tiempo real válido (> 0)');
      return;
    }
    if (!formCompletar.costo_real || isNaN(formCompletar.costo_real) || Number(formCompletar.costo_real) < 0) {
      alert('Por favor ingresa un costo real válido (>= 0)');
      return;
    }
    if (formCompletar.observaciones.trim().length < 5) {
      alert('Por favor ingresa observaciones (mínimo 5 caracteres)');
      return;
    }
    if (formCompletar.requiere_reprogramacion && (!formCompletar.proxima_fecha || isNaN(Date.parse(formCompletar.proxima_fecha)))) {
      alert('Debes ingresar una fecha válida para la reprogramación');
      return;
    }

    const ahora = new Date().toISOString();

    setOrdenes(prev => prev.map(o => 
      o.id_orden === ordenSeleccionada.id_orden 
        ? {
            ...o,
            estado: formCompletar.requiere_reprogramacion ? 'REPROGRAMADA' : 'COMPLETADA',
            fecha_completado: formCompletar.requiere_reprogramacion ? null : ahora,
            tiempo_real: parseInt(formCompletar.tiempo_real) || o.tiempo_real,
            costo_real: parseFloat(formCompletar.costo_real) || o.costo_real,
            observaciones: formCompletar.observaciones
          }
        : o
    ));

    // Si requiere reprogramación, generar nueva orden
    if (formCompletar.requiere_reprogramacion && formCompletar.proxima_fecha) {
      const nuevaOrden = {
        ...ordenSeleccionada,
        id_orden: Math.max(...ordenes.map(o => o.id_orden)) + 1,
        fecha_programada: formCompletar.proxima_fecha,
        fecha_limite: new Date(new Date(formCompletar.proxima_fecha).getTime() + 2*24*60*60*1000).toISOString().split('T')[0],
        estado: 'PROGRAMADA',
        fecha_inicio: null,
        fecha_completado: null,
        tiempo_real: null,
        costo_real: null,
        observaciones: null
      };
      setOrdenes(prev => [nuevaOrden, ...prev]);
    }

    setModalOpen(false);
    alert(formCompletar.requiere_reprogramacion ? 'Orden reprogramada exitosamente' : 'Orden completada exitosamente');
  };

  const subirEvidencia = () => {
    const nuevaEvidencia = {
      id_evidencia: Math.max(...evidencias.map(e => e.id_evidencia)) + 1,
      id_orden: ordenSeleccionada.id_orden,
      tipo: formEvidencia.tipo,
      descripcion: formEvidencia.descripcion,
      archivo: formEvidencia.archivo ? formEvidencia.archivo.name : 'archivo_ejemplo.jpg',
      fecha_subida: new Date().toISOString()
    };
    
    setEvidencias(prev => [nuevaEvidencia, ...prev]);
    setModalOpen(false);
    alert('Evidencia subida exitosamente');
  };

  const guardarPlan = () => {
    const nuevoPlan = {
      id_plan: Math.max(...planes.map(p => p.id_plan)) + 1,
      nombre: formPlan.nombre,
      descripcion: formPlan.descripcion,
      frecuencia: formPlan.frecuencia,
      activos: formPlan.activos,
      proxima_ejecucion: formPlan.proxima_ejecucion,
      activo: true
    };

    setPlanes(prev => [nuevoPlan, ...prev]);
    setModalOpen(false);
    alert('Plan preventivo creado exitosamente');
  };

  const generarOrdenDesdePlan = (plan) => {
    const nuevaOrden = {
      id_orden: Math.max(...ordenes.map(o => o.id_orden)) + 1,
      id_plan: plan.id_plan,
      plan_nombre: plan.nombre,
      titulo: `${plan.nombre} - ${new Date().toLocaleDateString()}`,
      descripcion: plan.descripcion,
      activo: plan.activos[0] || 'Activo no especificado',
      fecha_programada: plan.proxima_ejecucion,
      fecha_limite: new Date(new Date(plan.proxima_ejecucion).getTime() + 2*24*60*60*1000).toISOString().split('T')[0],
      estado: 'PROGRAMADA',
      prioridad: 'MEDIA',
      id_responsable: null,
      responsable_nombre: null,
      fecha_inicio: null,
      fecha_completado: null,
      tiempo_estimado: 240,
      tiempo_real: null,
      costo_estimado: 150.00,
      costo_real: null,
      observaciones: null
    };

    setOrdenes(prev => [nuevaOrden, ...prev]);
    alert('Orden generada exitosamente desde el plan preventivo');
  };

  const calcularKPIs = () => {
    const completadas = ordenes.filter(o => o.estado === 'COMPLETADA');
    const enTiempo = completadas.filter(o => 
      new Date(o.fecha_completado) <= new Date(o.fecha_limite)
    );
    
    return {
      cumplimiento: completadas.length > 0 ? Math.round((enTiempo.length / completadas.length) * 100) : 0,
      ordenes_activas: ordenes.filter(o => ['PROGRAMADA', 'EN_EJECUCION'].includes(o.estado)).length,
      completadas_mes: completadas.filter(o => {
        const fecha = new Date(o.fecha_completado);
        const ahora = new Date();
        return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
      }).length,
      planes_activos: planes.filter(p => p.activo).length
    };
  };

  const kpis = calcularKPIs();

  const getEstadoClass = (estado) => {
    switch(estado) {
      case 'PROGRAMADA': return 'estado-programada';
      case 'EN_EJECUCION': return 'estado-ejecucion';
      case 'COMPLETADA': return 'estado-completada';
      case 'REPROGRAMADA': return 'estado-reprogramada';
      case 'CANCELADA': return 'estado-cancelada';
      default: return 'estado-programada';
    }
  };

  const getPrioridadClass = (prioridad) => {
    switch(prioridad) {
      case 'BAJA': return 'prioridad-baja';
      case 'MEDIA': return 'prioridad-media';
      case 'ALTA': return 'prioridad-alta';
      case 'URGENTE': return 'prioridad-urgente';
      default: return 'prioridad-media';
    }
  };

  // Handler para cerrar el modal y limpiar estados relacionados
  const handleCloseModal = () => {
    setModalOpen(false);
    setOrdenSeleccionada(null);
    setModalTipo('');
    setPlanSeleccionado(null);
  };

  return (
    <DashboardLayout>
      <div className="seguimiento-card">
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1>Seguimiento de Mantenimientos Preventivos</h1>
              <p className="seguimiento-subtitle">
                Registrar y controlar la ejecución de mantenimientos preventivos
              </p>
            </div>
            <div className="header-actions">
              <div className="vista-toggle">
                <button 
                  className={`toggle-btn ${vistaActual === 'ordenes' ? 'active' : ''}`}
                  onClick={() => setVistaActual('ordenes')}
                >
                  📋 Órdenes
                </button>
                <button 
                  className={`toggle-btn ${vistaActual === 'planes' ? 'active' : ''}`}
                  onClick={() => setVistaActual('planes')}
                >
                  📅 Planes
                </button>
              </div>
              <Button onClick={crearPlan} className="btn-primary">
                ➕ Nuevo Plan
              </Button>
            </div>
          </div>
        </div>

        {/* KPIs Dashboard */}
        <div className="kpis-grid">
          <div className="kpi-card kpi-cumplimiento">
            <div className="kpi-icon">📊</div>
            <div className="kpi-info">
              <h3>{kpis.cumplimiento}%</h3>
              <span>Cumplimiento</span>
            </div>
          </div>
          <div className="kpi-card kpi-activas">
            <div className="kpi-icon">⚡</div>
            <div className="kpi-info">
              <h3>{kpis.ordenes_activas}</h3>
              <span>Órdenes Activas</span>
            </div>
          </div>
          <div className="kpi-card kpi-completadas">
            <div className="kpi-icon">✅</div>
            <div className="kpi-info">
              <h3>{kpis.completadas_mes}</h3>
              <span>Completadas Mes</span>
            </div>
          </div>
          <div className="kpi-card kpi-planes">
            <div className="kpi-icon">🔄</div>
            <div className="kpi-info">
              <h3>{kpis.planes_activos}</h3>
              <span>Planes Activos</span>
            </div>
          </div>
        </div>

        {vistaActual === 'ordenes' ? (
          <>
            {/* Filtros para órdenes */}
            <div className="filtros-panel">
              <div className="filtros-grid">
                <div className="filtro-group">
                  <label>Buscar orden</label>
                  <Input
                    type="text"
                    placeholder="Buscar por título, activo o plan..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                <div className="filtro-group">
                  <label>Estado</label>
                  <select 
                    value={filtroEstado} 
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="filtro-select"
                  >
                    {estados.map(estado => (
                      <option key={estado} value={estado}>
                        {estado === 'TODAS' ? 'Todos los estados' : estado}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filtro-group">
                  <label>Plan Preventivo</label>
                  <select 
                    value={filtroPlan} 
                    onChange={(e) => setFiltroPlan(e.target.value)}
                    className="filtro-select"
                  >
                    <option value="TODOS">Todos los planes</option>
                    {planes.map(plan => (
                      <option key={plan.id_plan} value={plan.id_plan}>
                        {plan.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="filtros-actions">
                <span className="resultados-count">
                  {ordenesFiltradas.length} orden{ordenesFiltradas.length !== 1 ? 'es' : ''} encontrada{ordenesFiltradas.length !== 1 ? 's' : ''}
                </span>
                <Button onClick={limpiarFiltros} className="btn-secondary">
                  Limpiar Filtros
                </Button>
              </div>
            </div>

            {/* Tabla de órdenes */}
            <div className="ordenes-lista">
              <div className="lista-header">
                <h2>Órdenes de Mantenimiento Preventivo</h2>
              </div>

              <div className="tabla-container">
                <table className="tabla-ordenes">
                  <thead>
                    <tr>
                      <th>Orden</th>
                      <th>Plan</th>
                      <th>Activo</th>
                      <th>Estado</th>
                      <th>Responsable</th>
                      <th>Programada</th>
                      <th>Progreso</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenesFiltradas.map(orden => (
                      <tr key={orden.id_orden}>
                        <td>
                          <div className="orden-info">
                            <strong>{orden.titulo}</strong>
                            <div className="orden-descripcion">{orden.descripcion}</div>
                          </div>
                        </td>
                        <td className="plan-nombre">{orden.plan_nombre}</td>
                        <td className="activo-nombre">{orden.activo_nombre || orden.activo || 'No especificado'}</td>
                        <td>
                          <span className={`badge-estado ${getEstadoClass(orden.estado)}`}>
                            {orden.estado}
                          </span>
                        </td>
                        <td>
                          {orden.responsable_nombre || (
                            <span className="sin-asignar">Sin asignar</span>
                          )}
                        </td>
                        <td className="fecha-programada">{orden.fecha_programada}</td>
                        <td>
                          <div className="progreso-info">
                            {orden.tiempo_real && orden.tiempo_estimado && (
                              <div className="tiempo-progreso">
                                {orden.tiempo_real}/{orden.tiempo_estimado} min
                              </div>
                            )}
                            {orden.costo_real && orden.costo_estimado && (
                              <div className="costo-progreso">
                                ${orden.costo_real}/${orden.costo_estimado}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="acciones-orden">
                            {orden.estado === 'PROGRAMADA' && (
                              <Button 
                                onClick={() => iniciarEjecucion(orden)}
                                className="btn-iniciar"
                                size="small"
                              >
                                Iniciar
                              </Button>
                            )}
                            {orden.estado === 'EN_EJECUCION' && (
                              <>
                                <Button 
                                  onClick={() => completarOrden(orden)}
                                  className="btn-completar"
                                  size="small"
                                >
                                  Completar
                                </Button>
                                <Button 
                                  onClick={() => abrirEvidencias(orden)}
                                  className="btn-evidencia"
                                  size="small"
                                >
                                  Evidencias
                                </Button>
                              </>
                            )}
                            {orden.estado === 'COMPLETADA' && (
                              <Button 
                                onClick={() => abrirEvidencias(orden)}
                                className="btn-ver"
                                size="small"
                              >
                                Ver Evidencias
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Vista de Planes Preventivos */
          <div className="planes-lista">
            <div className="lista-header">
              <h2>Planes de Mantenimiento Preventivo</h2>
            </div>

            <div className="planes-grid">
              {planes.map(plan => (
                <div key={plan.id_plan} className="plan-card">
                  <div className="plan-header">
                    <h3>{plan.nombre}</h3>
                    <span className={`frecuencia-badge frecuencia-${plan.frecuencia.toLowerCase()}`}>
                      {plan.frecuencia}
                    </span>
                  </div>
                  
                  <div className="plan-body">
                    <p>{plan.descripcion}</p>
                    
                    <div className="plan-activos">
                      <strong>Activos:</strong>
                      <ul>
                        {(plan.activos_nombres && plan.activos_nombres.length > 0
                          ? plan.activos_nombres
                          : plan.activos
                        ).map((nombre, idx) => (
                          <li key={idx}>{typeof nombre === 'string' ? nombre : (nombre && nombre.nombre ? nombre.nombre : String(nombre))}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="plan-proxima">
                      <strong>Próxima ejecución:</strong> {plan.proxima_ejecucion}
                    </div>
                  </div>
                  
                  <div className="plan-actions">
                    <Button 
                      onClick={() => generarOrdenDesdePlan(plan)}
                      className="btn-generar"
                      size="small"
                    >
                      Generar Orden
                    </Button>
                    <Button 
                      onClick={() => {/* editar plan */}}
                      className="btn-editar"
                      size="small"
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modales */}
        {modalOpen && (
          <Modal 
            onClose={handleCloseModal}
            title={
              modalTipo === 'ejecutar' ? 'Iniciar Ejecución' :
              modalTipo === 'completar' ? 'Completar Orden' :
              modalTipo === 'evidencia' ? 'Gestionar Evidencias' :
              modalTipo === 'plan' ? 'Nuevo Plan Preventivo' : ''
            }
          >
            {/* Modal Iniciar Ejecución */}
            {modalTipo === 'ejecutar' && ordenSeleccionada && (
              <div className="modal-form">
                <div className="orden-info-modal">
                  <h3>{ordenSeleccionada.titulo}</h3>
                  <p><strong>Activo:</strong> {ordenSeleccionada.activo}</p>
                  <p><strong>Tiempo estimado:</strong> {ordenSeleccionada.tiempo_estimado} minutos</p>
                </div>
                <div className="form-group">
                  <label>Observaciones iniciales</label>
                  <textarea
                    placeholder="Condiciones iniciales, herramientas necesarias..."
                    value={formEjecucion.observaciones_inicio}
                    onChange={(e) => setFormEjecucion({...formEjecucion, observaciones_inicio: e.target.value})}
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                <div className="modal-actions">
                <Button onClick={() => setModalOpen(false)} className="btn-secondary">
                  Cancelar
                </Button>
                <Button onClick={guardarEjecucion} className="btn-primary">
                  Iniciar Ejecución
                </Button>
              </div>
            </div>
          )}

          {/* Modal Completar */}
          {modalTipo === 'completar' && ordenSeleccionada && (
            <div className="modal-form">
              <div className="orden-info-modal">
                <h3>{ordenSeleccionada.titulo}</h3>
                <p><strong>Iniciado:</strong> {new Date(ordenSeleccionada.fecha_inicio).toLocaleString()}</p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tiempo real (minutos)</label>
                  <Input
                    type="number"
                    placeholder="Tiempo total empleado"
                    value={formCompletar.tiempo_real}
                    onChange={(e) => setFormCompletar({...formCompletar, tiempo_real: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Costo real</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Costo total"
                    value={formCompletar.costo_real}
                    onChange={(e) => setFormCompletar({...formCompletar, costo_real: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Observaciones finales</label>
                <textarea
                  placeholder="Trabajo realizado, hallazgos, recomendaciones..."
                  value={formCompletar.observaciones}
                  onChange={(e) => setFormCompletar({...formCompletar, observaciones: e.target.value})}
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formCompletar.requiere_reprogramacion}
                    onChange={(e) => setFormCompletar({...formCompletar, requiere_reprogramacion: e.target.checked})}
                  />
                  Requiere reprogramación (falta de repuestos u otros)
                </label>
              </div>

              {formCompletar.requiere_reprogramacion && (
                <div className="form-group">
                  <label>Próxima fecha programada</label>
                  <Input
                    type="date"
                    value={formCompletar.proxima_fecha}
                    onChange={(e) => setFormCompletar({...formCompletar, proxima_fecha: e.target.value})}
                  />
                </div>
              )}

              <div className="modal-actions">
                <Button onClick={() => setModalOpen(false)} className="btn-secondary">
                  Cancelar
                </Button>
                <Button onClick={guardarComplecion} className="btn-primary">
                  {formCompletar.requiere_reprogramacion ? 'Reprogramar' : 'Completar'}
                </Button>
              </div>
            </div>
          )}

          {/* Modal Evidencias */}
          {modalTipo === 'evidencia' && ordenSeleccionada && (
            <div className="modal-form">
              <div className="orden-info-modal">
                <h3>{ordenSeleccionada.titulo}</h3>
              </div>

              {/* Lista de evidencias existentes */}
              <div className="evidencias-existentes">
                <h4>Evidencias subidas:</h4>
                {evidencias
                  .filter(e => e.id_orden === ordenSeleccionada.id_orden)
                  .map(evidencia => (
                    <div key={evidencia.id_evidencia} className="evidencia-item">
                      <div className="evidencia-tipo">
                        {evidencia.tipo === 'FOTO' ? '📷' : '📄'} {evidencia.tipo}
                      </div>
                      <div className="evidencia-info">
                        <strong>{evidencia.descripcion}</strong>
                        <div className="evidencia-archivo">{evidencia.archivo}</div>
                        <small>{new Date(evidencia.fecha_subida).toLocaleString()}</small>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Subir nueva evidencia */}
              <div className="nueva-evidencia">
                <h4>Subir nueva evidencia:</h4>
                
                <div className="form-group">
                  <label>Tipo de evidencia</label>
                  <select
                    value={formEvidencia.tipo}
                    onChange={(e) => setFormEvidencia({...formEvidencia, tipo: e.target.value})}
                    className="form-select"
                  >
                    <option value="FOTO">Fotografía</option>
                    <option value="DOCUMENTO">Documento</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <Input
                    type="text"
                    placeholder="Describe la evidencia..."
                    value={formEvidencia.descripcion}
                    onChange={(e) => setFormEvidencia({...formEvidencia, descripcion: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Archivo</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf,.doc,.docx"
                    onChange={(e) => setFormEvidencia({...formEvidencia, archivo: e.target.files[0]})}
                    className="file-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <Button onClick={() => setModalOpen(false)} className="btn-secondary">
                  Cerrar
                </Button>
                <Button onClick={subirEvidencia} className="btn-primary">
                  Subir Evidencia
                </Button>
              </div>
            </div>
          )}

          {/* Modal Nuevo Plan */}
          {modalTipo === 'plan' && (
            <div className="modal-form">
              <div className="form-group">
                <label>Nombre del plan *</label>
                <Input
                  type="text"
                  placeholder="Ej: Mantenimiento HVAC Mensual"
                  value={formPlan.nombre}
                  onChange={(e) => setFormPlan({...formPlan, nombre: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  placeholder="Descripción del plan preventivo..."
                  value={formPlan.descripcion}
                  onChange={(e) => setFormPlan({...formPlan, descripcion: e.target.value})}
                  className="form-textarea"
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Frecuencia</label>
                  <select
                    value={formPlan.frecuencia}
                    onChange={(e) => setFormPlan({...formPlan, frecuencia: e.target.value})}
                    className="form-select"
                  >
                    {frecuencias.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Próxima ejecución *</label>
                  <Input
                    type="date"
                    value={formPlan.proxima_ejecucion}
                    onChange={(e) => setFormPlan({...formPlan, proxima_ejecucion: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <Button onClick={() => setModalOpen(false)} className="btn-secondary">
                  Cancelar
                </Button>
                <Button onClick={guardarPlan} className="btn-primary">
                  Crear Plan
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
      </div>
    </DashboardLayout>
  );
}

export default SeguimientoMantenimiento;