// === CAMARAS ===
const API_URL = 'http://127.0.0.1:8000/api/camaras/';

export async function obtenerCamaras() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al cargar cámaras');
  return response.json();
}

export async function crearCamara(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al crear cámara');
  return response.json();
}

export async function actualizarCamara(id, data) {
  const response = await fetch(`${API_URL}${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al actualizar cámara');
  return response.json();
}

export async function eliminarCamara(id) {
  const response = await fetch(`${API_URL}${id}/`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al eliminar cámara');
  return true;
}
