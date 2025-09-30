import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { 
  obtenerAreasComunes, 
  crearAreaComun, 
  editarAreaComun, 
  eliminarAreaComun,
  obtenerHorariosAreas,
  crearHorarioArea,
  editarHorarioArea,
  eliminarHorarioArea,
  saveHorariosArea,
  obtenerFechasEspeciales,
  crearFechaEspecial,
  editarFechaEspecial,
  eliminarFechaEspecial
} from '../services/areas';
import './ConfigurarDisponibilidad.css';

const diasSemana = [
  { id: 'lunes', nombre: 'Lunes' },
  { id: 'martes', nombre: 'Martes' },
  { id: 'miercoles', nombre: 'Miércoles' },
  { id: 'jueves', nombre: 'Jueves' },
  { id: 'viernes', nombre: 'Viernes' },
  { id: 'sabado', nombre: 'Sábado' },
  { id: 'domingo', nombre: 'Domingo' }
];

const horariosBase = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

const ConfigurarDisponibilidad = () => {
  const [activeTab, setActiveTab] = useState('areas');
  const [loading, setLoading] = useState(false);
  
  const [areas, setAreas] = useState([]);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [areaForm, setAreaForm] = useState({
    nombre: '',
    descripcion: '',
    aforoMaximo: 1,
    tarifa: 0,
    reglas: '',
    estado: 'ACTIVO'
  });

  const [selectedArea, setSelectedArea] = useState(null);
  const [horarios, setHorarios] = useState([]);

  const [fechasEspeciales, setFechasEspeciales] = useState([]);
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState(null);
  const [specialForm, setSpecialForm] = useState({
    fecha: '',
    tipo: 'FERIADO',
    descripcion: '',
    afectaAreas: 'TODAS',
    areasSeleccionadas: []
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAreas(),
        loadHorarios(),
        loadFechasEspeciales()
      ]);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAreas = async () => {
    try {
      const areasData = await obtenerAreasComunes();
      const areasWithHorarios = areasData.map(area => ({
        ...area,
        horarios: area.horarios || {
          lunes: { activo: true, apertura: '08:00', cierre: '18:00', slots: 1 },
          martes: { activo: true, apertura: '08:00', cierre: '18:00', slots: 1 },
          miercoles: { activo: true, apertura: '08:00', cierre: '18:00', slots: 1 },
          jueves: { activo: true, apertura: '08:00', cierre: '18:00', slots: 1 },
          viernes: { activo: true, apertura: '08:00', cierre: '18:00', slots: 1 },
          sabado: { activo: true, apertura: '08:00', cierre: '18:00', slots: 1 },
          domingo: { activo: false, apertura: '', cierre: '', slots: 1 }
        }
      }));
      setAreas(areasWithHorarios);
      if (areasWithHorarios.length > 0) {
        setSelectedArea(areasWithHorarios[0]);
      }
    } catch (error) {
      console.error('Error cargando áreas:', error);
    }
  };

  const loadHorarios = async () => {
    try {
      const horariosData = await obtenerHorariosAreas();
      setHorarios(horariosData);
    } catch (error) {
      console.error('Error cargando horarios:', error);
    }
  };

  const loadFechasEspeciales = async () => {
    try {
      const fechasData = await obtenerFechasEspeciales();
      setFechasEspeciales(fechasData);
    } catch (error) {
      console.error('Error cargando fechas:', error);
    }
  };

  const resetAreaForm = () => {
    setAreaForm({
      nombre: '',
      descripcion: '',
      aforoMaximo: 1,
      tarifa: 0,
      reglas: '',
      estado: 'ACTIVO'
    });
    setEditingArea(null);
  };

  const resetSpecialForm = () => {
    setSpecialForm({
      fecha: '',
      tipo: 'FERIADO',
      descripcion: '',
      afectaAreas: 'TODAS',
      areasSeleccionadas: []
    });
    setEditingSpecial(null);
  };

  const showConfirmation = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  const handleAreaChange = (field, value) => {
    setAreaForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialChange = (field, value) => {
    setSpecialForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHorarioChange = (areaId, dia, field, value) => {
    setAreas(prev => prev.map(area => {
      if (area.id === areaId) {
        const currentHorario = area.horarios[dia];
        let newHorario = { ...currentHorario };
        
        // Si se está activando el día y no tiene horarios configurados
        if (field === 'activo' && value === true) {
          newHorario = {
            activo: true,
            apertura: currentHorario.apertura || '08:00',
            cierre: currentHorario.cierre || '18:00',
            slots: currentHorario.slots || 1
          };
        } 
        // Si se está desactivando el día
        else if (field === 'activo' && value === false) {
          newHorario = {
            ...currentHorario,
            activo: false
          };
        }
        // Para otros campos
        else {
          newHorario[field] = value;
        }

        return {
          ...area,
          horarios: {
            ...area.horarios,
            [dia]: newHorario
          }
        };
      }
      return area;
    }));

    // Actualizar selectedArea si es el área que se está editando
    setSelectedArea(prev => {
      if (prev && prev.id === areaId) {
        const currentHorario = prev.horarios[dia];
        let newHorario = { ...currentHorario };
        
        if (field === 'activo' && value === true) {
          newHorario = {
            activo: true,
            apertura: currentHorario.apertura || '08:00',
            cierre: currentHorario.cierre || '18:00',
            slots: currentHorario.slots || 1
          };
        } else if (field === 'activo' && value === false) {
          newHorario = {
            ...currentHorario,
            activo: false
          };
        } else {
          newHorario[field] = value;
        }

        return {
          ...prev,
          horarios: {
            ...prev.horarios,
            [dia]: newHorario
          }
        };
      }
      return prev;
    });
  };

  const saveArea = async () => {
    if (!areaForm.nombre.trim()) {
      alert('El nombre del área es obligatorio');
      return;
    }

    setLoading(true);
    try {
      if (editingArea) {
        await editarAreaComun(editingArea.id, areaForm);
        setAreas(prev => prev.map(area => 
          area.id === editingArea.id 
            ? { ...area, ...areaForm }
            : area
        ));
      } else {
        const newArea = await crearAreaComun(areaForm);
        setAreas(prev => [...prev, newArea]);
      }
      
      setShowAreaModal(false);
      resetAreaForm();
      alert(`Área ${editingArea ? 'actualizada' : 'creada'} exitosamente`);
    } catch (error) {
      console.error('Error al guardar área:', error);
      alert('Error al guardar el área. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const deleteArea = (id) => {
    showConfirmation(
      'Estás seguro de eliminar esta área? Esta acción no se puede deshacer.',
      async () => {
        try {
          await eliminarAreaComun(id);
          setAreas(prev => prev.filter(area => area.id !== id));
          alert('Área eliminada exitosamente');
        } catch (error) {
          console.error('Error al eliminar área:', error);
          alert('Error al eliminar el área. Intenta nuevamente.');
        }
      }
    );
  };

  const saveSpecialDate = async () => {
    if (!specialForm.fecha || !specialForm.descripcion.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    try {
      if (editingSpecial) {
        await editarFechaEspecial(editingSpecial.id, specialForm);
        setFechasEspeciales(prev => prev.map(fecha => 
          fecha.id === editingSpecial.id 
            ? { ...fecha, ...specialForm }
            : fecha
        ));
      } else {
        const newFecha = await crearFechaEspecial(specialForm);
        setFechasEspeciales(prev => [...prev, newFecha]);
      }
      
      setShowSpecialModal(false);
      resetSpecialForm();
      alert(`Fecha especial ${editingSpecial ? 'actualizada' : 'creada'} exitosamente`);
    } catch (error) {
      console.error('Error al guardar fecha:', error);
      alert('Error al guardar la fecha. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const deleteSpecialDate = (id) => {
    showConfirmation(
      'Estás seguro de eliminar esta fecha especial?',
      async () => {
        try {
          await eliminarFechaEspecial(id);
          setFechasEspeciales(prev => prev.filter(fecha => fecha.id !== id));
          alert('Fecha especial eliminada exitosamente');
        } catch (error) {
          console.error('Error al eliminar fecha:', error);
          alert('Error al eliminar la fecha. Intenta nuevamente.');
        }
      }
    );
  };

  const editArea = (area) => {
    setAreaForm({
      nombre: area.nombre,
      descripcion: area.descripcion,
      aforoMaximo: area.aforoMaximo,
      tarifa: area.tarifa,
      reglas: area.reglas,
      estado: area.estado
    });
    setEditingArea(area);
    setShowAreaModal(true);
  };

  const editSpecialDate = (fecha) => {
    setSpecialForm({
      fecha: fecha.fecha,
      tipo: fecha.tipo,
      descripcion: fecha.descripcion,
      afectaAreas: fecha.afectaAreas,
      areasSeleccionadas: fecha.areasSeleccionadas || []
    });
    setEditingSpecial(fecha);
    setShowSpecialModal(true);
  };

  const saveHorarios = async () => {
    if (!selectedArea) {
      alert('Seleccione un área para guardar los horarios');
      return;
    }

    setLoading(true);
    try {
      // Transformar el formato de horarios para el backend (objeto, no array)
      const horariosParaBackend = {};
      diasSemana.forEach(dia => {
        const horario = selectedArea.horarios[dia.id];
        horariosParaBackend[dia.id] = {
          activo: horario.activo,
          apertura: horario.activo ? horario.apertura : null,
          cierre: horario.activo ? horario.cierre : null,
          slots: horario.slots || 1
        };
      });

      await saveHorariosArea(selectedArea.id, horariosParaBackend);
      alert(`Horarios de ${selectedArea.nombre} guardados exitosamente`);
      // Recargar las áreas para obtener los datos actualizados
      await loadAreas();
    } catch (error) {
      console.error('Error al guardar horarios:', error);
      alert('Error al guardar los horarios. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="configurar-disponibilidad">
        <div className="page-header">
          <div className="header-content">
            <h1>Configurar Disponibilidad y Horarios</h1>
            <p className="header-subtitle">
              Gestione áreas comunes, horarios de funcionamiento y fechas especiales
            </p>
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'areas' ? 'active' : ''}`}
              onClick={() => setActiveTab('areas')}
            >
              <div className="tab-icon"></div>
              <span>Gestión de Áreas</span>
            </button>
            <button 
              className={`tab ${activeTab === 'horarios' ? 'active' : ''}`}
              onClick={() => setActiveTab('horarios')}
            >
              <div className="tab-icon"></div>
              <span>Horarios y Slots</span>
            </button>
            <button 
              className={`tab ${activeTab === 'fechas' ? 'active' : ''}`}
              onClick={() => setActiveTab('fechas')}
            >
              <div className="tab-icon"></div>
              <span>Fechas Especiales</span>
            </button>
          </div>
        </div>

        <div className="tab-content-wrapper">
          {activeTab === 'areas' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Áreas Comunes</h2>
                <Button onClick={() => { resetAreaForm(); setShowAreaModal(true); }}>
                  + Nueva Área
                </Button>
              </div>
              <div className="areas-grid">
                {areas.map(area => (
                  <div key={area.id} className="area-card">
                    <div className="area-header">
                      <div className="area-info">
                        <h3>{area.nombre}</h3>
                        <p className="area-description">{area.descripcion}</p>
                      </div>
                      <span className={`status-badge ${area.estado}`}>{area.estado}</span>
                    </div>
                    
                    <div className="area-details">
                      <div className="detail-item">
                        <span> {area.aforoMaximo} personas</span>
                      </div>
                      <div className="detail-item">
                        <span> {area.tarifa} Bs/hora</span>
                      </div>
                    </div>

                    <div className="area-actions">
                      <Button variant="outline" onClick={() => editArea(area)} size="small">
                         Editar
                      </Button>
                      <Button variant="danger" onClick={() => deleteArea(area.id)} size="small">
                         Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'horarios' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Configuración de Horarios</h2>
                <p>Configure los horarios por área y día</p>
              </div>

              <div className="area-selector">
                <label>Seleccione un área:</label>
                <select 
                  value={selectedArea?.id || ''} 
                  onChange={(e) => {
                    const area = areas.find(a => a.id === parseInt(e.target.value));
                    setSelectedArea(area);
                  }}
                >
                  <option value="">-- Seleccionar área --</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>{area.nombre}</option>
                  ))}
                </select>
              </div>

              {selectedArea && (
                <div className="horarios-configuration">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <h3>Horarios para: {selectedArea.nombre}</h3>
                    <Button onClick={saveHorarios} disabled={loading}>
                      {loading ? 'Guardando...' : '💾 Guardar Horarios'}
                    </Button>
                  </div>
                  <div className="horarios-grid">
                    {diasSemana.map(dia => {
                      const horario = selectedArea.horarios[dia.id];
                      return (
                        <div key={dia.id} className={`horario-card ${!horario.activo ? 'inactive' : ''}`}>
                          <div className="horario-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h4>{dia.nombre}</h4>
                              <span className={`status-indicator ${horario.activo ? 'active' : 'inactive'}`}>
                                {horario.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={horario.activo}
                                onChange={(e) => handleHorarioChange(
                                  selectedArea.id, dia.id, 'activo', e.target.checked
                                )}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>

                          {horario.activo ? (
                            <div className="horario-content">
                              <div className="time-inputs">
                                <div className="time-group">
                                  <label>Apertura:</label>
                                  <select
                                    value={horario.apertura}
                                    onChange={(e) => handleHorarioChange(
                                      selectedArea.id, dia.id, 'apertura', e.target.value
                                    )}
                                  >
                                    {horariosBase.map(hora => (
                                      <option key={hora} value={hora}>{hora}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="time-group">
                                  <label>Cierre:</label>
                                  <select
                                    value={horario.cierre}
                                    onChange={(e) => handleHorarioChange(
                                      selectedArea.id, dia.id, 'cierre', e.target.value
                                    )}
                                  >
                                    {horariosBase.map(hora => (
                                      <option key={hora} value={hora}>{hora}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="slots-input">
                                <label>Slots por hora:</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={horario.slots}
                                  onChange={(e) => handleHorarioChange(
                                    selectedArea.id, dia.id, 'slots', parseInt(e.target.value)
                                  )}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="horario-inactive-message">
                              <span>Día desactivado</span>
                              <div className="activate-hint">
                                Active el interruptor para configurar horarios
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!selectedArea && (
                <div className="empty-state">
                  <div className="empty-state-content">
                    <div className="empty-icon"></div>
                    <h3>Seleccione un área</h3>
                    <p>Escoja un área para configurar sus horarios</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'fechas' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Fechas Especiales</h2>
                <Button onClick={() => { resetSpecialForm(); setShowSpecialModal(true); }}>
                  + Nueva Fecha
                </Button>
              </div>

              <div className="fechas-grid">
                {fechasEspeciales.map(fecha => (
                  <div key={fecha.id} className="fecha-card">
                    <div className="fecha-header">
                      <div className="fecha-info">
                        <h3>{fecha.descripcion}</h3>
                        <p className="fecha-date"> {fecha.fecha}</p>
                      </div>
                      <span className={`type-badge ${fecha.tipo}`}>{fecha.tipo}</span>
                    </div>
                    
                    <div className="fecha-details">
                      <p>Afecta: {fecha.afectaAreas === 'TODAS' 
                        ? 'Todas las áreas' 
                        : `${fecha.areasSeleccionadas.length} área(s)`
                      }</p>
                    </div>

                    <div className="fecha-actions">
                      <Button variant="outline" onClick={() => editSpecialDate(fecha)} size="small">
                         Editar
                      </Button>
                      <Button variant="danger" onClick={() => deleteSpecialDate(fecha.id)} size="small">
                         Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showAreaModal && (
          <Modal
            onClose={() => setShowAreaModal(false)}
            title={editingArea ? 'Editar Área' : 'Nueva Área'}
          >
            <form onSubmit={(e) => { e.preventDefault(); saveArea(); }}>
              <Input
                label="Nombre del área"
                value={areaForm.nombre}
                onChange={(e) => handleAreaChange('nombre', e.target.value)}
                placeholder="Ej: Salón de eventos"
                required
              />

              <Input
                label="Descripción"
                value={areaForm.descripcion}
                onChange={(e) => handleAreaChange('descripcion', e.target.value)}
                as="textarea"
                placeholder="Describe las características del área"
              />

              <Input
                label="Aforo máximo"
                type="number"
                min="1"
                value={areaForm.aforoMaximo}
                onChange={(e) => handleAreaChange('aforoMaximo', parseInt(e.target.value))}
                required
              />

              <Input
                label="Tarifa por hora (Bs)"
                type="number"
                min="0"
                step="0.01"
                value={areaForm.tarifa}
                onChange={(e) => handleAreaChange('tarifa', parseFloat(e.target.value))}
                placeholder="Ej: 50"
              />

              <Input
                label="Reglas"
                value={areaForm.reglas}
                onChange={(e) => handleAreaChange('reglas', e.target.value)}
                as="textarea"
                placeholder="Reglas específicas para el uso del área"
              />

              <div className="form-group">
                <label>Estado</label>
                <select
                  value={areaForm.estado}
                  onChange={(e) => handleAreaChange('estado', e.target.value)}
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="MANTENIMIENTO">En mantenimiento</option>
                </select>
              </div>

              <div className="modal-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAreaModal(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : (editingArea ? 'Actualizar' : 'Crear')}
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {showSpecialModal && (
          <Modal
            onClose={() => setShowSpecialModal(false)}
            title={editingSpecial ? 'Editar Fecha Especial' : 'Nueva Fecha Especial'}
          >
            <form onSubmit={(e) => { e.preventDefault(); saveSpecialDate(); }}>
              <Input
                label="Fecha"
                type="date"
                value={specialForm.fecha}
                onChange={(e) => handleSpecialChange('fecha', e.target.value)}
                required
              />

              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={specialForm.tipo}
                  onChange={(e) => handleSpecialChange('tipo', e.target.value)}
                >
                  <option value="FERIADO">Feriado</option>
                  <option value="MANTENIMIENTO">Mantenimiento</option>
                  <option value="EVENTO_ESPECIAL">Evento especial</option>
                </select>
              </div>

              <Input
                label="Descripción"
                value={specialForm.descripcion}
                onChange={(e) => handleSpecialChange('descripcion', e.target.value)}
                as="textarea"
                placeholder="Describe el evento o razón"
                required
              />

              <div className="form-group">
                <label>Áreas afectadas</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="afectaAreas"
                      value="TODAS"
                      checked={specialForm.afectaAreas === 'TODAS'}
                      onChange={(e) => handleSpecialChange('afectaAreas', e.target.value)}
                    />
                    <span>Todas las áreas</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="afectaAreas"
                      value="SELECCIONADAS"
                      checked={specialForm.afectaAreas === 'SELECCIONADAS'}
                      onChange={(e) => handleSpecialChange('afectaAreas', e.target.value)}
                    />
                    <span>Áreas específicas</span>
                  </label>
                </div>
              </div>

              {specialForm.afectaAreas === 'SELECCIONADAS' && (
                <div className="areas-selection">
                  <label>Seleccionar áreas:</label>
                  <div className="checkbox-group">
                    {areas.map(area => (
                      <label key={area.id} className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={specialForm.areasSeleccionadas.includes(area.id)}
                          onChange={(e) => {
                            const selected = [...specialForm.areasSeleccionadas];
                            if (e.target.checked) {
                              selected.push(area.id);
                            } else {
                              const index = selected.indexOf(area.id);
                              if (index > -1) selected.splice(index, 1);
                            }
                            handleSpecialChange('areasSeleccionadas', selected);
                          }}
                        />
                        <span>{area.nombre}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSpecialModal(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : (editingSpecial ? 'Actualizar' : 'Crear')}
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {showConfirmModal && (
          <Modal onClose={handleCancel} title="Confirmar acción">
            <div className="confirm-content">
              <div className="confirm-icon"></div>
              <p>{confirmMessage}</p>
              <div className="confirm-actions">
                <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
                <Button variant="danger" onClick={handleConfirm}>
                  {loading ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConfigurarDisponibilidad;
