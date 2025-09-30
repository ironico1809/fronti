// === ÁREAS COMUNES ===

// Obtener áreas comunes desde el backend
export async function getAreasComunes() {
  const response = await fetch('http://127.0.0.1:8000/api/areas-comunes/');
  if (!response.ok) throw new Error('Error al cargar áreas comunes');
  return response.json();
}

// Alias en español para compatibilidad
export const obtenerAreasComunes = getAreasComunes;

// Crear área común
export async function createAreaComun(data) {
  const response = await fetch('http://127.0.0.1:8000/api/areas-comunes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al crear área común');
  return response.json();
}

// Alias en español para compatibilidad
export const crearAreaComun = createAreaComun;

// Editar área común
export async function updateAreaComun(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/areas-comunes/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al actualizar área común');
  return response.json();
}

// Alias en español para compatibilidad
export const editarAreaComun = updateAreaComun;

// Eliminar área común
export async function deleteAreaComun(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/areas-comunes/${id}/`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al eliminar área común');
  return response;
}

// Alias en español para compatibilidad
export const eliminarAreaComun = deleteAreaComun;

// Guardar horarios de un área específica
export async function saveHorariosArea(areaId, horarios) {
  const response = await fetch(`http://127.0.0.1:8000/api/areas-comunes/${areaId}/guardar_horarios/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ horarios })
  });
  if (!response.ok) throw new Error('Error al guardar horarios');
  return response.json();
}

// Alias en español para compatibilidad
export const guardarHorariosArea = saveHorariosArea;

// Obtener horarios de un área específica
export async function getHorariosArea(areaId) {
  const response = await fetch(`http://127.0.0.1:8000/api/areas-comunes/${areaId}/obtener_horarios/`);
  if (!response.ok) throw new Error('Error al cargar horarios del área');
  return response.json();
}

// Alias en español para compatibilidad
export const obtenerHorariosArea = getHorariosArea;

// === HORARIOS DE ÁREAS ===

// Obtener horarios de áreas
export async function getHorariosAreas() {
  const response = await fetch('http://127.0.0.1:8000/api/horarios-areas/');
  if (!response.ok) throw new Error('Error al cargar horarios de áreas');
  return response.json();
}

// Alias en español para compatibilidad
export const obtenerHorariosAreas = getHorariosAreas;

// Crear horario de área
export async function createHorarioArea(data) {
  const response = await fetch('http://127.0.0.1:8000/api/horarios-areas/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al crear horario de área');
  return response.json();
}

// Alias en español para compatibilidad
export const crearHorarioArea = createHorarioArea;

// Editar horario de área
export async function updateHorarioArea(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/horarios-areas/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al actualizar horario de área');
  return response.json();
}

// Alias en español para compatibilidad
export const editarHorarioArea = updateHorarioArea;

// Eliminar horario de área
export async function deleteHorarioArea(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/horarios-areas/${id}/`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al eliminar horario de área');
  return response;
}

// Alias en español para compatibilidad
export const eliminarHorarioArea = deleteHorarioArea;

// === FECHAS ESPECIALES ===

// Obtener fechas especiales
export async function getFechasEspeciales() {
  const response = await fetch('http://127.0.0.1:8000/api/fechas-especiales/');
  if (!response.ok) throw new Error('Error al cargar fechas especiales');
  return response.json();
}

// Alias en español para compatibilidad
export const obtenerFechasEspeciales = getFechasEspeciales;

// Crear fecha especial
export async function createFechaEspecial(data) {
  const response = await fetch('http://127.0.0.1:8000/api/fechas-especiales/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al crear fecha especial');
  return response.json();
}

// Alias en español para compatibilidad
export const crearFechaEspecial = createFechaEspecial;

// Editar fecha especial
export async function updateFechaEspecial(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/fechas-especiales/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al actualizar fecha especial');
  return response.json();
}

// Alias en español para compatibilidad
export const editarFechaEspecial = updateFechaEspecial;

// Eliminar fecha especial
export async function deleteFechaEspecial(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/fechas-especiales/${id}/`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al eliminar fecha especial');
  return response;
}

// Alias en español para compatibilidad
export const eliminarFechaEspecial = deleteFechaEspecial;

// === FUNCIONES ADICIONALES ===

// Verificar disponibilidad de un área en una fecha
export async function verificarDisponibilidad(areaId, fecha) {
  const url = `http://127.0.0.1:8000/api/areas-comunes/${areaId}/disponibilidad/?fecha=${fecha}`;
  console.log('Consultando disponibilidad en:', url);
  const response = await fetch(url);
  if (!response.ok) {
    let msg = 'Error al verificar disponibilidad';
    try {
      const err = await response.json();
      if (err && err.error) msg += ': ' + err.error;
    } catch {}
    throw new Error(msg);
  }
  return response.json();
}
