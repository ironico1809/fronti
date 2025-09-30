// === EVIDENCIAS MANTENIMIENTO ===
export async function obtenerEvidenciasMantenimiento() {
  await delay(200);
  return [
    { id: 1, orden: 'Orden 1', evidencia: 'Foto1.jpg' },
    { id: 2, orden: 'Orden 2', evidencia: 'Foto2.jpg' }
  ];
}

// === MULTAS ===
export async function obtenerMultas() {
  await delay(200);
  return [
    { id: 1, concepto: 'Multa por ruido', monto: 10000 },
    { id: 2, concepto: 'Multa por mascotas', monto: 5000 }
  ];
}
export async function crearMulta(data) {
  await delay(200);
  return { success: true };
}
export async function editarMulta(id, data) {
  await delay(200);
  return { success: true };
}
export async function eliminarMulta(id) {
  await delay(200);
  return { success: true };
}

// === ROL PERMISO ===
export async function crearRolPermiso(data) {
  await delay(200);
  return { success: true };
}
export async function editarRolPermiso(id, data) {
  await delay(200);
  return { success: true };
}
// === PLANES DE MANTENIMIENTO ===
export async function obtenerPlanesMantenimiento() {
  await delay(200);
  return [
    { id: 1, nombre: 'Plan General', descripcion: 'Mantenimiento general anual' },
    { id: 2, nombre: 'Plan Piscina', descripcion: 'Limpieza mensual piscina' }
  ];
}
// === ORDENES DE MANTENIMIENTO ===
export async function obtenerOrdenesMantenimiento() {
  await delay(200);
  return [
    { id: 1, descripcion: 'Revisión ascensor', estado: 'Pendiente' },
    { id: 2, descripcion: 'Limpieza piscina', estado: 'Completada' }
  ];
}
// === RESERVAS ÁREA ===
export async function crearReservaArea(data, isForm = false) {
  await delay(300);
  return { success: true, ...data };
}
// === AVISOS CON ADJUNTOS ===
export async function crearAvisoConAdjuntos({ titulo, cuerpo, segmento, id_admin, adjuntos }) {
  await delay(300);
  return { success: true, id: 999, titulo, cuerpo, segmento, id_admin, adjuntos };
}
// === PAGOS ===
export async function crearPagoConComprobante(data) {
  await delay(300);
  return { success: true, message: 'Pago con comprobante registrado (mock)' };
}
// === ROL PERMISOS ===
export async function obtenerRolPermisos() {
  await delay(200);
  return [
    { id: 1, rol: 'Administrador', permiso: 'VER_TODO' },
    { id: 2, rol: 'Propietario', permiso: 'GESTIONAR_TAREAS' }
  ];
}
// === USUARIO ROLES ===
export async function obtenerUsuarioRoles() {
  await delay(200);
  return [
    { id: 1, usuario: 'Juan Pérez', rol: 'Administrador' },
    { id: 2, usuario: 'María García', rol: 'Propietario' }
  ];
}
// === PERMISOS ===
export async function obtenerPermisos() {
  await delay(200);
  return [
    { id: 1, nombre: 'VER_TODO' },
    { id: 2, nombre: 'EDITAR_USUARIOS' },
    { id: 3, nombre: 'GESTIONAR_TAREAS' }
  ];
}
// === ACTIVOS ===
export async function obtenerActivos() {
  // Reutiliza las áreas comunes como activos para el mock
  return obtenerAreasComunes();
}
// Mock API data para funcionar sin backend
const mockUsuarios = [
  { id: 1, nombre_completo: 'Juan Pérez', correo: 'juan@email.com', telefono: '123456789', estado: 'ACTIVO' },
  { id: 2, nombre_completo: 'María García', correo: 'maria@email.com', telefono: '987654321', estado: 'ACTIVO' },
  { id: 3, nombre_completo: 'Carlos López', correo: 'carlos@email.com', telefono: '555666777', estado: 'INACTIVO' }
];

const mockRoles = [
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Propietario' },
  { id: 3, nombre: 'Conserje' }
];

const mockTareas = [
  { id: 1, titulo: 'Revisión de ascensor', descripcion: 'Mantenimiento preventivo', estado: 'Pendiente', fecha_vencimiento: '2025-10-15' },
  { id: 2, titulo: 'Limpieza de piscina', descripcion: 'Limpieza semanal', estado: 'En Progreso', fecha_vencimiento: '2025-10-10' }
];

const mockCuotasGeneradas = [
  { id: 1, unidad: 'Apto 101', concepto: 'Administración', monto: 50000, vencimiento: '2025-10-15' },
  { id: 2, unidad: 'Apto 201', concepto: 'Administración', monto: 50000, vencimiento: '2025-10-15' }
];

const mockPagos = [
  { id: 1, unidad: 'Apto 101', concepto: 'Administración', monto: 50000, fecha_pago: '2025-09-15', estado: 'Pagado' },
  { id: 2, unidad: 'Apto 201', concepto: 'Administración', monto: 50000, fecha_pago: '2025-09-20', estado: 'Pagado' }
];

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// === USUARIOS ===
export async function obtenerUsuarios() {
  await delay(500);
  return mockUsuarios;
}

export async function registrarUsuario(datos) {
  await delay(500);
  const nuevoUsuario = {
    id: Math.max(...mockUsuarios.map(u => u.id)) + 1,
    ...datos
  };
  mockUsuarios.push(nuevoUsuario);
  return nuevoUsuario;
}

export async function editarUsuario(id, datos) {
  await delay(500);
  const index = mockUsuarios.findIndex(u => u.id === id);
  if (index !== -1) {
    mockUsuarios[index] = { ...mockUsuarios[index], ...datos };
  }
  return mockUsuarios[index];
}

export async function eliminarUsuario(id) {
  await delay(500);
  const index = mockUsuarios.findIndex(u => u.id === id);
  if (index !== -1) {
    mockUsuarios.splice(index, 1);
  }
  return { success: true };
}

export async function obtenerUsuariosPersonal() {
  await delay(500);
  return mockUsuarios.filter(u => u.correo.includes('admin') || u.correo.includes('conserje'));
}

export async function obtenerUsuario(id) {
  await delay(500);
  return mockUsuarios.find(u => u.id === id);
}

// === ROLES ===
export async function obtenerRoles() {
  await delay(300);
  return mockRoles;
}

export async function crearUsuarioRol(data) {
  await delay(500);
  return { success: true };
}

export async function editarUsuarioRol(id, data) {
  await delay(500);
  return { success: true };
}

export async function eliminarUsuarioRol(id) {
  await delay(500);
  return { success: true };
}

// === TAREAS ===
export async function obtenerTareas() {
  await delay(500);
  return mockTareas;
}

export async function crearTarea(data) {
  await delay(500);
  const nuevaTarea = {
    id: Math.max(...mockTareas.map(t => t.id)) + 1,
    ...data
  };
  mockTareas.push(nuevaTarea);
  return nuevaTarea;
}

export async function actualizarTarea(id, data) {
  await delay(500);
  const index = mockTareas.findIndex(t => t.id === id);
  if (index !== -1) {
    mockTareas[index] = { ...mockTareas[index], ...data };
  }
  return mockTareas[index];
}

export async function eliminarTarea(id) {
  await delay(500);
  const index = mockTareas.findIndex(t => t.id === id);
  if (index !== -1) {
    mockTareas.splice(index, 1);
  }
  return { success: true };
}

// === FINANZAS ===
export async function obtenerCuotasGeneradas() {
  await delay(500);
  return mockCuotasGeneradas;
}

export async function obtenerPagos() {
  await delay(500);
  return mockPagos;
}

export async function procesarPago(formData) {
  await delay(500);
  return { success: true, message: 'Pago procesado correctamente' };
}

export async function obtenerCuotasServicio() {
  await delay(500);
  return [
    { id: 1, concepto: 'Administración', monto: 50000 },
    { id: 2, concepto: 'Aseo', monto: 15000 },
    { id: 3, concepto: 'Vigilancia', monto: 25000 }
  ];
}

export async function crearCuotaServicio(data) {
  await delay(500);
  return { success: true };
}

export async function editarCuotaServicio(id, data) {
  await delay(500);
  return { success: true };
}

export async function eliminarCuotaServicio(id) {
  await delay(500);
  return { success: true };
}

// === ÁREAS COMUNES ===
export async function obtenerAreasComunes() {
  await delay(500);
  return [
    { id: 1, nombre: 'Piscina', capacidad: 20, disponible: true },
    { id: 2, nombre: 'Salón Social', capacidad: 50, disponible: true },
    { id: 3, nombre: 'Gimnasio', capacidad: 10, disponible: false }
  ];
}

export async function crearAreaComun(data) {
  await delay(500);
  return { success: true };
}

export async function editarAreaComun(id, data) {
  await delay(500);
  return { success: true };
}

export async function eliminarAreaComun(id) {
  await delay(500);
  return { success: true };
}

// === RESERVAS ===
export async function obtenerReservas() {
  await delay(500);
  return [
    { id: 1, area: 'Piscina', unidad: 'Apto 101', fecha: '2025-10-15', estado: 'Confirmada' },
    { id: 2, area: 'Salón Social', unidad: 'Apto 201', fecha: '2025-10-20', estado: 'Pendiente' }
  ];
}

export async function crearReserva(data) {
  await delay(500);
  return { success: true };
}

export async function editarReserva(id, data) {
  await delay(500);
  return { success: true };
}

export async function eliminarReserva(id) {
  await delay(500);
  return { success: true };
}

// === AVISOS ===
export async function obtenerAvisos() {
  await delay(500);
  return [
    { id: 1, titulo: 'Corte de agua programado', contenido: 'El corte será el viernes de 9am a 2pm', fecha: '2025-10-01', importante: true },
    { id: 2, titulo: 'Reunión de copropietarios', contenido: 'Reunión el sábado a las 10am en el salón social', fecha: '2025-10-05', importante: false }
  ];
}

export async function crearAviso(data) {
  await delay(500);
  return { success: true };
}

export async function editarAviso(id, data) {
  await delay(500);
  return { success: true };
}

export async function eliminarAviso(id) {
  await delay(500);
  return { success: true };
}

// Funciones adicionales que podrían necesitarse
export async function generarReporte(tipo, parametros) {
  await delay(1000);
  return {
    success: true,
    url: '/mock-report.pdf',
    mensaje: `Reporte ${tipo} generado correctamente`
  };
}

export async function subirComprobante(formData) {
  await delay(800);
  return {
    success: true,
    mensaje: 'Comprobante subido correctamente'
  };
}