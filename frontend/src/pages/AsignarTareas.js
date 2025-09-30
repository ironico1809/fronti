import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import './AsignarTareas.css';
import { 
  obtenerTareas, 
  crearTarea, 
  actualizarTarea, 
  obtenerUsuarios, 
  obtenerUsuariosPersonal, 
  obtenerActivos 
} from '../services/api';

const prioridades = ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'];
const estados = ['PENDIENTE', 'ASIGNADA', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'];

const AsignarTareas = () => {
  const [activos, setActivos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  const [filtroPrioridad, setFiltroPrioridad] = useState('TODAS');
  const [filtroPersonal, setFiltroPersonal] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [editingTarea, setEditingTarea] = useState(null);
  const [tareaParaAsignar, setTareaParaAsignar] = useState(null);
  
  const [formTarea, setFormTarea] = useState({
    titulo: '',
    descripcion: '',
    id_activo: '',
    prioridad: 'MEDIA',
    fecha_programada: '',
    fecha_limite: '',
    responsable: '' // Nuevo campo para el responsable
  });

  const [formAsignacion, setFormAsignacion] = useState({
    id_responsable: '',
    notas: ''
  });

  const [usuarios, setUsuarios] = useState([]); // usuarios reales
  const [usuariosPersonal, setUsuariosPersonal] = useState([]); // solo personal

  // Cargar usuarios reales al montar
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const data = await obtenerUsuarios();
        setUsuarios(data);
      } catch (e) {
        setUsuarios([]);
      }
    }
    fetchUsuarios();
  }, []);

  // Cargar solo personal al montar
  useEffect(() => {
    async function fetchUsuariosPersonal() {
      try {
        const data = await obtenerUsuariosPersonal();
        setUsuariosPersonal(data);
      } catch (e) {
        setUsuariosPersonal([]);
      }
    }
    fetchUsuariosPersonal();
  }, []);

  // Hook para cargar activos reales
  useEffect(() => {
    async function fetchActivos() {
      try {
        const data = await obtenerActivos();
        setActivos(data);
      } catch (e) {
        setActivos([]);
      }
    }
    fetchActivos();
  }, []);

  // Cargar tareas reales al montar
  useEffect(() => {
    async function fetchTareas() {
      try {
        const data = await obtenerTareas();
        setTareas(data.map(t => ({
          id_tarea: t.id,
          titulo: t.titulo,
          descripcion: t.descripcion,
          prioridad: t.prioridad || 'MEDIA',
          activo: t.activo,
          activo_nombre: t.activo_nombre || '',
          fecha_programada: t.fecha_asignacion || '',
          fecha_limite: t.fecha_limite || '',
          estado: t.estado ? t.estado.toUpperCase() : 'PENDIENTE',
          id_responsable: t.responsable || null,
          responsable_nombre: t.responsable_nombre || null
        })));
      } catch (e) {
        setTareas([]);
      }
    }
    fetchTareas();
  }, []);

  const limpiarFiltros = () => {
    setFiltroEstado('TODAS');
    setFiltroPrioridad('TODAS');
    setFiltroPersonal('TODOS');
    setBusqueda('');
  };

  const tareasFiltradas = tareas.filter(tarea => {
    const cumpleBusqueda = !busqueda || 
      tarea.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      tarea.activo_nombre.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleEstado = filtroEstado === 'TODAS' || tarea.estado === filtroEstado;
    const cumplePrioridad = filtroPrioridad === 'TODAS' || tarea.prioridad === filtroPrioridad;
    const cumplePersonal = filtroPersonal === 'TODOS' || 
      (filtroPersonal === 'SIN_ASIGNAR' && !tarea.id_responsable) ||
      (filtroPersonal !== 'SIN_ASIGNAR' && tarea.id_responsable === parseInt(filtroPersonal));

    return cumpleBusqueda && cumpleEstado && cumplePrioridad && cumplePersonal;
  });

  const abrirModalTarea = (tarea = null) => {
    if (tarea) {
      setEditingTarea(tarea);
      setFormTarea({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        id_activo: tarea.id_activo,
        prioridad: tarea.prioridad,
        fecha_programada: tarea.fecha_programada,
        fecha_limite: tarea.fecha_limite,
        responsable: tarea.id_responsable || '' // Asegurarse de que el campo responsable esté presente
      });
    } else {
      setEditingTarea(null);
      setFormTarea({
        titulo: '',
        descripcion: '',
        id_activo: '',
        prioridad: 'MEDIA',
        fecha_programada: '',
        fecha_limite: '',
        responsable: ''
      });
    }
    setOpenModal(true);
  };

  const abrirModalAsignar = (tarea) => {
    setTareaParaAsignar(tarea);
    setFormAsignacion({
      id_responsable: tarea.id_responsable || '',
      notas: ''
    });
    setModalAsignar(true);
  };

  const guardarTarea = async () => {
    const hoy = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
    if (!formTarea.titulo || !formTarea.descripcion || !formTarea.fecha_limite || !formTarea.responsable) {
      alert('Completa todos los campos obligatorios');
      return;
    }
    const tareaPayload = {
      titulo: formTarea.titulo,
      descripcion: formTarea.descripcion,
      activo: formTarea.id_activo ? parseInt(formTarea.id_activo) : null,
      prioridad: formTarea.prioridad,
      fecha_asignacion: hoy,
      fecha_limite: formTarea.fecha_limite,
      estado: 'pendiente',
      responsable: formTarea.responsable // Enviar responsable
    };
    try {
      if (editingTarea) {
        await actualizarTarea(editingTarea.id_tarea, tareaPayload);
      } else {
        await crearTarea(tareaPayload);
      }
      setOpenModal(false);
      alert(editingTarea ? 'Tarea actualizada exitosamente' : 'Tarea creada exitosamente');
      // Recargar tareas
      const data = await obtenerTareas();
      setTareas(data.map(t => ({
        id_tarea: t.id,
        titulo: t.titulo,
        descripcion: t.descripcion,
        prioridad: t.prioridad || 'MEDIA',
        fecha_programada: t.fecha_asignacion || '',
        fecha_limite: t.fecha_limite || '',
        estado: t.estado ? t.estado.toUpperCase() : 'PENDIENTE',
        id_responsable: t.responsable || null,
        responsable_nombre: t.responsable_nombre || null
      })));
    } catch (e) {
      if (e instanceof Response) {
        const errorData = await e.json();
        alert('Error al guardar la tarea: ' + JSON.stringify(errorData));
      } else {
        alert('Error al guardar la tarea');
      }
    }
  };

  const asignarTarea = () => {
    const personalSeleccionado = usuariosPersonal.find(p => p.id_usuario === parseInt(formAsignacion.id_responsable));
    
    if (!personalSeleccionado) {
      alert('Debe seleccionar un responsable');
      return;
    }

    if (!personalSeleccionado.disponible) {
      alert('El personal seleccionado no está disponible. Carga actual: ' + personalSeleccionado.carga_actual + ' tareas');
      return;
    }

    // Actualizar tarea
    setTareas(prev => prev.map(t => 
      t.id_tarea === tareaParaAsignar.id_tarea 
        ? {
            ...t,
            id_responsable: parseInt(formAsignacion.id_responsable),
            responsable_nombre: personalSeleccionado.nombre,
            estado: 'ASIGNADA'
          }
        : t
    ));

    setModalAsignar(false);
    alert(`Tarea asignada a ${personalSeleccionado.nombre}. Notificación enviada.`);
  };

  const cambiarEstadoTarea = (id_tarea, nuevoEstado) => {
    setTareas(prev => prev.map(t => 
      t.id_tarea === id_tarea ? { ...t, estado: nuevoEstado } : t
    ));
    alert(`Estado de tarea cambiado a: ${nuevoEstado}`);
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

  const getEstadoClass = (estado) => {
    switch(estado) {
      case 'PENDIENTE': return 'estado-pendiente';
      case 'ASIGNADA': return 'estado-asignada';
      case 'EN_PROGRESO': return 'estado-progreso';
      case 'COMPLETADA': return 'estado-completada';
      case 'CANCELADA': return 'estado-cancelada';
      default: return 'estado-pendiente';
    }
  };

  return (
    <DashboardLayout>
      <div className="tareas-card">
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1>Asignar Tareas de Mantenimiento</h1>
              <p className="tareas-subtitle">
                Crear y asignar tareas de mantenimiento a personal designado
              </p>
            </div>
            <div className="header-actions">
              <Button 
                onClick={() => abrirModalTarea()}
                className="btn-primary"
              >
                ➕ Nueva Tarea
              </Button>
            </div>
          </div>
        </div>

        {/* Panel de filtros */}
        <div className="filtros-panel">
          <div className="filtros-grid">
            <div className="filtro-group">
              <label>Buscar tarea o activo</label>
              <Input
                type="text"
                placeholder="Buscar por título o activo..."
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
                <option value="TODAS">Todos los estados</option>
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            <div className="filtro-group">
              <label>Prioridad</label>
              <select 
                value={filtroPrioridad} 
                onChange={(e) => setFiltroPrioridad(e.target.value)}
                className="filtro-select"
              >
                <option value="TODAS">Todas las prioridades</option>
                {prioridades.map(prioridad => (
                  <option key={prioridad} value={prioridad}>{prioridad}</option>
                ))}
              </select>
            </div>

            <div className="filtro-group">
              <label>Personal</label>
              <select 
                value={filtroPersonal} 
                onChange={(e) => setFiltroPersonal(e.target.value)}
                className="filtro-select"
              >
                <option value="TODOS">Todo el personal</option>
                <option value="SIN_ASIGNAR">Sin asignar</option>
                {usuariosPersonal.map(personal => (
                  <option key={personal.id_usuario} value={personal.id_usuario}>
                    {personal.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filtros-actions">
            <span className="resultados-count">
              {tareasFiltradas.length} tarea{tareasFiltradas.length !== 1 ? 's' : ''} encontrada{tareasFiltradas.length !== 1 ? 's' : ''}
            </span>
            <Button onClick={limpiarFiltros} className="btn-secondary">
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="stats-grid">
          <div className="stat-card stat-pendientes">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{tareas.filter(t => t.estado === 'PENDIENTE').length}</h3>
              <span>Pendientes</span>
            </div>
          </div>
          <div className="stat-card stat-asignadas">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>{tareas.filter(t => t.estado === 'ASIGNADA').length}</h3>
              <span>Asignadas</span>
            </div>
          </div>
          <div className="stat-card stat-progreso">
            <div className="stat-icon">🔧</div>
            <div className="stat-info">
              <h3>{tareas.filter(t => t.estado === 'EN_PROGRESO').length}</h3>
              <span>En Progreso</span>
            </div>
          </div>
          <div className="stat-card stat-urgentes">
            <div className="stat-icon">🚨</div>
            <div className="stat-info">
              <h3>{tareas.filter(t => t.prioridad === 'URGENTE').length}</h3>
              <span>Urgentes</span>
            </div>
          </div>
        </div>

        {/* Lista de tareas */}
        <div className="tareas-lista">
          <div className="lista-header">
            <h2>Tareas de Mantenimiento</h2>
          </div>

          <div className="tabla-container">
            <table className="tabla-tareas">
              <thead>
                <tr>
                  <th>Tarea</th>
                  <th>Activo</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Responsable</th>
                  <th>Fecha Límite</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tareasFiltradas.map(tarea => (
                  <tr key={tarea.id_tarea}>
                    <td>
                      <div className="tarea-info">
                        <strong>{tarea.titulo}</strong>
                        <div className="tarea-descripcion">{tarea.descripcion}</div>
                      </div>
                    </td>
                    <td className="activo-nombre">{tarea.activo_nombre}</td>
                    <td>
                      <span className={`badge-prioridad ${getPrioridadClass(tarea.prioridad)}`}>
                        {tarea.prioridad}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-estado ${getEstadoClass(tarea.estado)}`}>
                        {tarea.estado}
                      </span>
                    </td>
                    <td>
                      {tarea.responsable_nombre || (
                        <span className="sin-asignar">Sin asignar</span>
                      )}
                    </td>
                    <td className="fecha-limite">{tarea.fecha_limite}</td>
                    <td>
                      <div className="acciones-tarea">
                        {!tarea.id_responsable && (
                          <Button 
                            onClick={() => abrirModalAsignar(tarea)}
                            className="btn-asignar"
                            size="small"
                          >
                            Asignar
                          </Button>
                        )}
                        <Button 
                          onClick={() => abrirModalTarea(tarea)}
                          className="btn-editar"
                          size="small"
                        >
                          Editar
                        </Button>
                        {tarea.estado === 'ASIGNADA' && (
                          <Button 
                            onClick={() => cambiarEstadoTarea(tarea.id_tarea, 'EN_PROGRESO')}
                            className="btn-iniciar"
                            size="small"
                          >
                            Iniciar
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

        {/* Modal Nueva/Editar Tarea */}
        {openModal && (
          <Modal 
            onClose={() => setOpenModal(false)}
            title={editingTarea ? 'Editar Tarea' : 'Nueva Tarea de Mantenimiento'}
          >
            <div className="modal-form">
              <div className="form-group">
                <label>Título de la tarea *</label>
                <Input
                  type="text"
                  placeholder="Ej: Mantenimiento preventivo..."
                  value={formTarea.titulo}
                  onChange={(e) => setFormTarea({...formTarea, titulo: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  placeholder="Descripción detallada de la tarea..."
                  value={formTarea.descripcion}
                  onChange={(e) => setFormTarea({...formTarea, descripcion: e.target.value})}
                  className="form-textarea"
                  rows="3"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Activo *</label>
                  <select
                    value={formTarea.id_activo}
                    onChange={(e) => setFormTarea({...formTarea, id_activo: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="">Seleccionar activo</option>
                    {activos.map(activo => (
                      <option key={activo.id} value={activo.id}>
                        {activo.nombre} - {activo.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Responsable *</label>
                  <select
                    value={formTarea.responsable}
                    onChange={e => setFormTarea({ ...formTarea, responsable: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="">Seleccionar responsable</option>
                    {usuariosPersonal.map(usuario => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre_completo} ({usuario.correo})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha Programada *</label>
                  <Input
                    type="date"
                    value={formTarea.fecha_programada}
                    onChange={(e) => setFormTarea({...formTarea, fecha_programada: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Límite *</label>
                  <Input
                    type="date"
                    value={formTarea.fecha_limite}
                    onChange={(e) => setFormTarea({...formTarea, fecha_limite: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Prioridad *</label>
                  <select
                    value={formTarea.prioridad}
                    onChange={e => setFormTarea({ ...formTarea, prioridad: e.target.value })}
                    className="form-select"
                    required
                  >
                    {prioridades.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <Button onClick={() => setOpenModal(false)} className="btn-secondary">
                  Cancelar
                </Button>
                <Button onClick={guardarTarea} className="btn-primary">
                  {editingTarea ? 'Actualizar' : 'Crear'} Tarea
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Asignar Tarea */}
        {modalAsignar && (
          <Modal 
            onClose={() => setModalAsignar(false)}
            title="Asignar Tarea de Mantenimiento"
          >
            <div className="modal-form">
              {tareaParaAsignar && (
                <div className="tarea-asignar-info">
                  <h3>{tareaParaAsignar.titulo}</h3>
                  <p><strong>Activo:</strong> {tareaParaAsignar.activo_nombre}</p>
                  <p><strong>Prioridad:</strong> <span className={`badge-prioridad ${getPrioridadClass(tareaParaAsignar.prioridad)}`}>
                    {tareaParaAsignar.prioridad}
                  </span></p>
                </div>
              )}
              <div className="form-group">
                <label>Personal Responsable *</label>
                <select
                value={formAsignacion.id_responsable}
                onChange={(e) => setFormAsignacion({...formAsignacion, id_responsable: e.target.value})}
                className="form-select"
                required
              >
                <option value="">Seleccionar responsable</option>
                {usuariosPersonal.map(personal => (
                  <option 
                    key={personal.id} 
                    value={personal.id}
                  >
                    {personal.nombre_completo} ({personal.correo})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Notas adicionales</label>
              <textarea
                placeholder="Instrucciones especiales o comentarios..."
                value={formAsignacion.notas}
                onChange={(e) => setFormAsignacion({...formAsignacion, notas: e.target.value})}
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="modal-actions">
              <Button onClick={() => setModalAsignar(false)} className="btn-secondary">
                Cancelar
              </Button>
              <Button onClick={asignarTarea} className="btn-primary">
                Asignar Tarea
              </Button>
            </div>
          </div>
        </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AsignarTareas;