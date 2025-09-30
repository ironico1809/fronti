import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { crearReservaArea } from '../services/api';
import { obtenerAreasComunes } from '../services/areas';
import './ReservarAreas.css';


// Hook para cargar áreas desde el backend
const useAreasComunes = () => {
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  useEffect(() => {
    obtenerAreasComunes().then(data => {
      setAreas(data);
      setLoadingAreas(false);
    });
  }, []);
  return { areas, loadingAreas };
};

const horariosDisponibles = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

const ReservarAreas = () => {
  const { areas, loadingAreas } = useAreasComunes();
  const [selectedArea, setSelectedArea] = useState(null);
  const [formData, setFormData] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    cantidadPersonas: 1,
    detalles: '',
    aceptaTerminos: false,
    comprobante_pago: null
  });
  const [disponibilidad, setDisponibilidad] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Seleccionar área, 2: Fecha y hora, 3: Detalles, 4: Pago
  const [paymentData, setPaymentData] = useState({
    metodoPago: 'tarjeta',
    numeroTarjeta: '',
    fechaVencimiento: '',
    cvv: '',
    nombreTitular: '',
    tipoDocumento: 'cedula',
    numeroDocumento: ''
  });
  const [paymentStep, setPaymentStep] = useState('form'); // form, processing, success, error

  useEffect(() => {
    if (selectedArea && formData.fecha) {
      loadDisponibilidad();
    }
  }, [selectedArea, formData.fecha]);

  // Cargar horarios y disponibilidad reales del backend
  const loadDisponibilidad = async () => {
    setLoading(true);
  try {
      // --- DEBUG LOGS ---
      console.log('Solicitando horarios y disponibilidad para:', selectedArea, formData.fecha);
      const horariosResp = await import('../services/areas');
      const { obtenerHorariosArea, verificarDisponibilidad } = horariosResp;
      const horariosData = await obtenerHorariosArea(selectedArea.id);
      console.log('Respuesta de obtenerHorariosArea:', horariosData);
      let disponibilidadData;
      try {
        disponibilidadData = await verificarDisponibilidad(selectedArea.id, formData.fecha);
      } catch (apiError) {
        // Mostrar el error real del backend si existe
        if (apiError instanceof Error && apiError.message) {
          alert('Error al verificar disponibilidad: ' + apiError.message);
        } else {
          alert('Error desconocido al verificar disponibilidad.');
        }
        throw apiError;
      }
      console.log('Respuesta de verificarDisponibilidad:', disponibilidadData);

      // Obtener el día de la semana en formato backend (lunes, martes, ...)
      const diasMap = {
        'monday': 'lunes',
        'tuesday': 'martes',
        'wednesday': 'miercoles',
        'thursday': 'jueves',
        'friday': 'viernes',
        'saturday': 'sabado',
        'sunday': 'domingo',
      };
      const jsDay = new Date(formData.fecha + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const diaSemana = diasMap[jsDay];
      console.log('Día de la semana (frontend -> backend):', jsDay, '->', diaSemana);
      const horarioDia = horariosData.horarios[diaSemana];
      console.log('Horario para el día seleccionado:', horarioDia);
      // Si no hay horario para el día, o está inactivo, o apertura/cierre es nulo/vacío, marcar como inactivo
      const apertura = horarioDia && horarioDia.activo && horarioDia.apertura ? horarioDia.apertura : null;
      const cierre = horarioDia && horarioDia.activo && horarioDia.cierre ? horarioDia.cierre : null;
      const disponible = {};

      // Función para comparar horas tipo "HH:MM"
      const horaToMinutes = (h) => {
        if (!h || typeof h !== 'string' || !h.includes(':')) return null;
        const [hh, mm] = h.split(':');
        return parseInt(hh, 10) * 60 + parseInt(mm, 10);
      };

      if (apertura && cierre && horarioDia.activo) {
        const aperturaMin = horaToMinutes(apertura);
        const cierreMin = horaToMinutes(cierre);
        horariosDisponibles.forEach(hora => {
          const horaMin = horaToMinutes(hora);
          if (horaMin === null) {
            disponible[hora] = false;
            return;
          }
          // Solo marcar como disponible si está dentro del rango de apertura/cierre
          if (horaMin >= aperturaMin && horaMin < cierreMin) {
            // Verificar si la hora está ocupada
            const ocupada = disponibilidadData.ocupadas.some(o => {
              const ini = horaToMinutes(o.inicio);
              const fin = horaToMinutes(o.fin);
              return horaMin >= ini && horaMin < fin;
            });
            disponible[hora] = !ocupada;
          } else {
            disponible[hora] = false;
          }
        });
      } else {
        // Día inactivo o sin horario válido: todas las horas no disponibles
        horariosDisponibles.forEach(hora => {
          disponible[hora] = false;
        });
      }
      setDisponibilidad(disponible);
    } catch (error) {
      console.error('Error cargando disponibilidad:', error);
      const disponible = {};
      horariosDisponibles.forEach(hora => {
        disponible[hora] = false;
      });
      setDisponibilidad(disponible);
    } finally {
      setLoading(false);
    }
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setStep(2);
    setFormData(prev => ({
      ...prev,
      cantidadPersonas: Math.min(prev.cantidadPersonas, area.aforoMaximo)
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep2 = () => {
    if (!formData.fecha || !formData.horaInicio || !formData.horaFin) {
      alert('Debe seleccionar fecha, hora de inicio y hora de fin');
      return false;
    }
    
    if (formData.horaInicio >= formData.horaFin) {
      alert('La hora de fin debe ser posterior a la hora de inicio');
      return false;
    }
    
    return true;
  };

  const validateStep3 = () => {
    if (formData.cantidadPersonas > selectedArea.aforoMaximo) {
      alert(`El aforo máximo para ${selectedArea.nombre} es de ${selectedArea.aforoMaximo} personas`);
      return false;
    }
    
    if (formData.cantidadPersonas < 1) {
      alert('Debe indicar al menos 1 persona');
      return false;
    }
    
    if (!formData.aceptaTerminos) {
      alert('Debe aceptar los términos y condiciones');
      return false;
    }
    
    return true;
  };

  const validatePayment = () => {
    if (paymentData.metodoPago === 'tarjeta') {
      if (!paymentData.numeroTarjeta || paymentData.numeroTarjeta.length < 16) {
        alert('Número de tarjeta inválido');
        return false;
      }
      if (!paymentData.fechaVencimiento) {
        alert('Fecha de vencimiento requerida');
        return false;
      }
      if (!paymentData.cvv || paymentData.cvv.length < 3) {
        alert('CVV inválido');
        return false;
      }
      if (!paymentData.nombreTitular.trim()) {
        alert('Nombre del titular requerido');
        return false;
      }
    }
    if (!paymentData.numeroDocumento.trim()) {
      alert('Número de documento requerido');
      return false;
    }
    return true;
  };

  const processPayment = async () => {
    if (!validatePayment()) return;
    setPaymentStep('processing');
    setLoading(true);
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 3000));
      // Simular posible fallo (20% de probabilidad)
      if (Math.random() < 0.2) {
        throw new Error('Pago rechazado por el banco');
      }

      // Guardar reserva en la base de datos
      const usuario = 1; // Cambia esto por el id real del usuario logueado
      const formReserva = new FormData();
      formReserva.append('usuario', usuario);
      formReserva.append('area', selectedArea.id);
      formReserva.append('fecha', formData.fecha);
      formReserva.append('hora_inicio', formData.horaInicio);
      formReserva.append('hora_fin', formData.horaFin);
      formReserva.append('cantidad_personas', formData.cantidadPersonas);
      formReserva.append('detalles', formData.detalles);
      formReserva.append('monto', calcularMontoTotal());
      if (formData.comprobante_pago) {
        formReserva.append('comprobante_pago', formData.comprobante_pago);
      }
      await crearReservaArea(formReserva, true);

      setPaymentStep('success');
    } catch (error) {
      console.error('Error procesando pago o guardando reserva:', error);
      setPaymentStep('error');
    } finally {
      setLoading(false);
    }
  };

  const resetProcess = () => {
    setSelectedArea(null);
    setFormData({
      fecha: '',
      horaInicio: '',
      horaFin: '',
      cantidadPersonas: 1,
      detalles: '',
      aceptaTerminos: false
    });
    setPaymentData({
      metodoPago: 'tarjeta',
      numeroTarjeta: '',
      fechaVencimiento: '',
      cvv: '',
      nombreTitular: '',
      tipoDocumento: 'cedula',
      numeroDocumento: ''
    });
    setPaymentStep('form');
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setLoading(true);
    try {
      const usuario = 1; // Cambia esto por el id real del usuario logueado
      const formReserva = new FormData();
      formReserva.append('usuario', usuario);
      formReserva.append('area', selectedArea.id);
      formReserva.append('fecha', formData.fecha);
      formReserva.append('hora_inicio', formData.horaInicio);
      formReserva.append('hora_fin', formData.horaFin);
      formReserva.append('cantidad_personas', formData.cantidadPersonas);
      formReserva.append('detalles', formData.detalles);
      formReserva.append('monto', calcularMonto());
      if (formData.comprobante_pago) {
        formReserva.append('comprobante_pago', formData.comprobante_pago);
      }
      const reserva = await crearReservaArea(formReserva, true);
      alert('¡Reserva creada exitosamente! Se ha guardado en la base, pe.');
      setSelectedArea(null);
      setFormData({
        fecha: '',
        horaInicio: '',
        horaFin: '',
        cantidadPersonas: 1,
        detalles: '',
        aceptaTerminos: false,
        comprobante_pago: null
      });
      setStep(1);
    } catch (error) {
      console.error('Error creando reserva:', error);
      alert('Error al crear la reserva. Intenta nuevamente, causa.');
    } finally {
      setLoading(false);
    }
  };

  const calcularMonto = () => {
    if (!selectedArea || !formData.horaInicio || !formData.horaFin) return 0;
    
    const inicio = parseInt(formData.horaInicio.split(':')[0]);
    const fin = parseInt(formData.horaFin.split(':')[0]);
    const horas = fin - inicio;
    
    return selectedArea.tarifa * horas;
  };

  const calcularMontoTotal = () => {
    const subtotal = calcularMonto();
    const impuestos = subtotal * 0.12; // 12% IVA
    const servicios = 5.00; // Tarifa fija de servicios
    return subtotal + impuestos + servicios;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const goNext = () => {
    if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  return (
    <DashboardLayout>
      <div className="reservas-container">
        <div className="reservas-card">
          <div className="page-header">
            <h1>Reservar Áreas Comunes</h1>
            <p className="reservas-subtitle">
              Reserve espacios comunes del condominio de forma rápida y sencilla
            </p>
          </div>

          {/* Navegación por pasos */}
          <div className="steps-nav">
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Seleccionar Área</span>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Fecha y Hora</span>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Detalles</span>
            </div>
            <div className={`step ${step >= 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}`}>
              <span className="step-number">4</span>
              <span className="step-label">Pago</span>
            </div>
          </div>

          {/* Paso 1: Seleccionar Área */}
          {step === 1 && (
            <div className="step-content">
              <h2>Seleccione el área a reservar</h2>
              {loadingAreas ? (
                <div>Cargando áreas...</div>
              ) : (
                <div className="areas-grid">
                  {areas.map(area => (
                    <div 
                      key={area.id} 
                      className="area-card"
                      onClick={() => handleAreaSelect(area)}
                    >
                      <div className="area-image">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="area-info">
                        <h3>{area.nombre}</h3>
                        <p className="area-description">{area.descripcion}</p>
                        <div className="area-details">
                          <span className="area-capacity">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {area.aforo_maximo} personas max
                          </span>
                          <span className="area-price">
                            ${area.precio_hora}/hora
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Paso 2: Fecha y Hora */}
          {step === 2 && selectedArea && (
            <div className="step-content">
              <h2>Seleccione fecha y horario</h2>
              <div className="selected-area-info">
                <h3>{selectedArea.nombre}</h3>
                <p>{selectedArea.descripcion}</p>
              </div>
              <div className="datetime-form">
                <div className="form-group">
                  <label className="form-label">Fecha de reserva</label>
                  <Input
                    type="date"
                    value={formData.fecha}
                    onChange={e => handleInputChange('fecha', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hora de inicio</label>
                  <select
                    value={formData.horaInicio}
                    onChange={e => handleInputChange('horaInicio', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Seleccionar hora</option>
                    {horariosDisponibles.map(hora => (
                      <option 
                        key={hora} 
                        value={hora}
                        disabled={disponibilidad[hora] === false}
                      >
                        {hora} {disponibilidad[hora] === false ? '(Ocupado)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Hora de fin</label>
                  <select
                    value={formData.horaFin}
                    onChange={e => handleInputChange('horaFin', e.target.value)}
                    className="form-select"
                    disabled={!formData.horaInicio}
                  >
                    <option value="">Seleccionar hora</option>
                    {horariosDisponibles
                      .filter(hora => hora > formData.horaInicio)
                      .map(hora => (
                        <option 
                          key={hora} 
                          value={hora}
                          disabled={disponibilidad[hora] === false}
                        >
                          {hora} {disponibilidad[hora] === false ? '(Ocupado)' : ''}
                        </option>
                    ))}
                  </select>
                </div>
                {loading && (
                  <div className="loading-availability">
                    <svg className="spinner" width="24" height="24" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    Verificando disponibilidad...
                  </div>
                )}
              </div>
              <div className="step-actions">
                <Button variant="outline" onClick={goBack}>
                  Atrás
                </Button>
                <Button onClick={goNext} disabled={!formData.fecha || !formData.horaInicio || !formData.horaFin}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* Paso 3: Detalles */}
          {step === 3 && selectedArea && (
            <div className="step-content">
              <h2>Detalles de la reserva</h2>

              <div className="reservation-summary">
                <h3>Resumen de la reserva</h3>
                <div className="summary-item">
                  <strong>{selectedArea.nombre}</strong>
                </div>
                <div className="summary-item">
                  <span>Fecha:</span>
                  <span>{formatDate(formData.fecha)}</span>
                </div>
                <div className="summary-item">
                  <span>Horario:</span>
                  <span>{formData.horaInicio} - {formData.horaFin}</span>
                </div>
                <div className="summary-item">
                  <span>Duración:</span>
                  <span>{parseInt(formData.horaFin.split(':')[0]) - parseInt(formData.horaInicio.split(':')[0])} horas</span>
                </div>
                <div className="summary-item total">
                  <span>Total a pagar:</span>
                  <span>${calcularMonto().toFixed(2)}</span>
                </div>
              </div>

              <div className="details-form">
                <div className="form-group">
                  <label className="form-label">Cantidad de personas</label>
                  <Input
                    type="number"
                    value={formData.cantidadPersonas}
                    onChange={(e) => handleInputChange('cantidadPersonas', parseInt(e.target.value))}
                    min={1}
                    max={selectedArea.aforoMaximo}
                  />
                  <small>Máximo: {selectedArea.aforoMaximo} personas</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Detalles adicionales (opcional)</label>
                  <textarea
                    value={formData.detalles}
                    onChange={(e) => handleInputChange('detalles', e.target.value)}
                    placeholder="Descripción del evento, contactos adicionales, etc."
                    className="form-textarea"
                    rows={4}
                  />
                </div>

                <div className="terms-section">
                  <h4>Reglas del área</h4>
                  <div className="rules-text">
                    {selectedArea.reglas}
                  </div>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.aceptaTerminos}
                      onChange={(e) => handleInputChange('aceptaTerminos', e.target.checked)}
                    />
                    <span>Acepto las reglas del área y los términos de uso</span>
                  </label>
                </div>
              </div>

              <div className="step-actions">
                <Button variant="outline" onClick={goBack}>
                  Atrás
                </Button>
                <Button 
                  onClick={goNext}
                  disabled={!formData.aceptaTerminos}
                >
                  Continuar al Pago
                </Button>
              </div>
            </div>
          )}

          {/* Paso 4: Pago y Confirmación */}
          {step === 4 && selectedArea && (
            <div className="step-content">
              {paymentStep === 'form' && (
                <>
                  <h2>Pago y confirmación</h2>

                  {/* Resumen final */}
                  <div className="final-summary">
                    <h3>Resumen de la reserva</h3>
                    <div className="summary-details">
                      <div className="detail-row">
                        <span>Área:</span>
                        <span>{selectedArea.nombre}</span>
                      </div>
                      <div className="detail-row">
                        <span>Fecha:</span>
                        <span>{formatDate(formData.fecha)}</span>
                      </div>
                      <div className="detail-row">
                        <span>Horario:</span>
                        <span>{formData.horaInicio} - {formData.horaFin}</span>
                      </div>
                      <div className="detail-row">
                        <span>Personas:</span>
                        <span>{formData.cantidadPersonas}</span>
                      </div>
                    </div>

                    <div className="cost-breakdown">
                      <div className="cost-row">
                        <span>Subtotal ({parseInt(formData.horaFin.split(':')[0]) - parseInt(formData.horaInicio.split(':')[0])} horas):</span>
                        <span>${calcularMonto().toFixed(2)}</span>
                      </div>
                      <div className="cost-row">
                        <span>IVA (12%):</span>
                        <span>${(calcularMonto() * 0.12).toFixed(2)}</span>
                      </div>
                      <div className="cost-row">
                        <span>Tarifa de servicios:</span>
                        <span>$5.00</span>
                      </div>
                      <div className="cost-row total-row">
                        <span>Total a pagar:</span>
                        <span>${calcularMontoTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Métodos de pago */}
                  <div className="payment-section">
                    <h3>Método de pago</h3>
                    <div className="payment-methods">
                      <label className="payment-method">
                        <input
                          type="radio"
                          name="metodoPago"
                          value="tarjeta"
                          checked={paymentData.metodoPago === 'tarjeta'}
                          onChange={(e) => handlePaymentChange('metodoPago', e.target.value)}
                        />
                        <div className="method-info">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span>Tarjeta de crédito/débito</span>
                        </div>
                      </label>
                      <label className="payment-method">
                        <input
                          type="radio"
                          name="metodoPago"
                          value="transferencia"
                          checked={paymentData.metodoPago === 'transferencia'}
                          onChange={(e) => handlePaymentChange('metodoPago', e.target.value)}
                        />
                        <div className="method-info">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2"/>
                            <path d="M16 13H8" stroke="currentColor" strokeWidth="2"/>
                            <path d="M16 17H8" stroke="currentColor" strokeWidth="2"/>
                            <path d="M10 9H8" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span>Transferencia bancaria</span>
                        </div>
                      </label>
                    </div>

                    {/* Formulario de tarjeta */}
                    {paymentData.metodoPago === 'tarjeta' && (
                      <div className="card-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Número de tarjeta</label>
                            <Input
                              type="text"
                              value={paymentData.numeroTarjeta}
                              onChange={(e) => handlePaymentChange('numeroTarjeta', e.target.value.replace(/\D/g, '').slice(0, 16))}
                              placeholder="1234 5678 9012 3456"
                              maxLength={16}
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Fecha vencimiento</label>
                            <Input
                              type="text"
                              value={paymentData.fechaVencimiento}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                }
                                handlePaymentChange('fechaVencimiento', value);
                              }}
                              placeholder="MM/AA"
                              maxLength={5}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">CVV</label>
                            <Input
                              type="text"
                              value={paymentData.cvv}
                              onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                              placeholder="123"
                              maxLength={3}
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Nombre del titular</label>
                            <Input
                              type="text"
                              value={paymentData.nombreTitular}
                              onChange={(e) => handlePaymentChange('nombreTitular', e.target.value.toUpperCase())}
                              placeholder="NOMBRE COMPLETO"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Información de transferencia */}
                    {paymentData.metodoPago === 'transferencia' && (
                      <div className="transfer-info">
                        <div className="bank-details">
                          <h4>Datos para transferencia:</h4>
                          <div className="bank-data">
                            <div className="data-row">
                              <span>Banco:</span>
                              <span>Banco Nacional</span>
                            </div>
                            <div className="data-row">
                              <span>Cuenta:</span>
                              <span>1234567890</span>
                            </div>
                            <div className="data-row">
                              <span>Titular:</span>
                              <span>Smart Condominium S.A.</span>
                            </div>
                            <div className="data-row">
                              <span>Monto:</span>
                              <span className="amount">${calcularMontoTotal().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Datos de facturación */}
                    <div className="billing-section">
                      <h4>Datos de facturación</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Tipo de documento</label>
                          <select
                            value={paymentData.tipoDocumento}
                            onChange={(e) => handlePaymentChange('tipoDocumento', e.target.value)}
                            className="form-select"
                          >
                            <option value="cedula">Cédula</option>
                            <option value="ruc">RUC</option>
                            <option value="pasaporte">Pasaporte</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Número de documento</label>
                          <Input
                            type="text"
                            value={paymentData.numeroDocumento}
                            onChange={(e) => handlePaymentChange('numeroDocumento', e.target.value)}
                            placeholder="Número de identificación"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="step-actions">
                    <Button variant="outline" onClick={goBack}>
                      Atrás
                    </Button>
                    <Button 
                      onClick={processPayment}
                      disabled={loading}
                    >
                      {paymentData.metodoPago === 'tarjeta' ? 'Pagar Ahora' : 'Confirmar Reserva'}
                    </Button>
                  </div>
                </>
              )}

              {paymentStep === 'processing' && (
                <div className="payment-processing">
                  <div className="processing-animation">
                    <svg className="spinner" width="64" height="64" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                  </div>
                  <h3>Procesando pago...</h3>
                  <p>Por favor espere mientras procesamos su pago de forma segura</p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="payment-success">
                  <div className="success-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4905 2.02168 11.3363C2.16356 9.18219 2.99721 7.13677 4.39828 5.49707C5.79935 3.85738 7.69279 2.71266 9.79619 2.24618C11.8996 1.77969 14.1003 1.01462 16.07 2.02002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>¡Pago exitoso!</h3>
                  <p>Su reserva ha sido confirmada y pagada correctamente</p>
                  
                  <div className="reservation-details">
                    <h4>Detalles de la reserva:</h4>
                    <div className="detail-item">
                      <strong>Número de reserva:</strong> RS-{Date.now().toString().slice(-6)}
                    </div>
                    <div className="detail-item">
                      <strong>Área:</strong> {selectedArea.nombre}
                    </div>
                    <div className="detail-item">
                      <strong>Fecha:</strong> {formatDate(formData.fecha)}
                    </div>
                    <div className="detail-item">
                      <strong>Horario:</strong> {formData.horaInicio} - {formData.horaFin}
                    </div>
                    <div className="detail-item">
                      <strong>Monto pagado:</strong> ${calcularMontoTotal().toFixed(2)}
                    </div>
                  </div>

                  <div className="success-actions">
                    <Button onClick={resetProcess}>
                      Nueva Reserva
                    </Button>
                  </div>
                </div>
              )}

              {paymentStep === 'error' && (
                <div className="payment-error">
                  <div className="error-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3>Error en el pago</h3>
                  <p>No pudimos procesar su pago. Por favor intente nuevamente o use otro método de pago.</p>
                  
                  <div className="error-actions">
                    <Button variant="outline" onClick={() => setPaymentStep('form')}>
                      Intentar Nuevamente
                    </Button>
                    <Button onClick={goBack}>
                      Cambiar Detalles
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReservarAreas;