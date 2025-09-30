// Importar mock API para funcionar sin backend
import * as mockApi from './mockApi';

// Usar mock API en lugar de llamadas reales
export const obtenerTareas = mockApi.obtenerTareas;

export const crearTarea = mockApi.crearTarea;
export const actualizarTarea = mockApi.actualizarTarea;
export const eliminarTarea = mockApi.eliminarTarea;
export const obtenerCuotasGeneradas = mockApi.obtenerCuotasGeneradas;
export const obtenerPagos = mockApi.obtenerPagos;
export const procesarPago = mockApi.procesarPago;
export const registrarUsuario = mockApi.registrarUsuario;
export const obtenerUsuarios = mockApi.obtenerUsuarios;
export const obtenerUsuariosPersonal = mockApi.obtenerUsuariosPersonal;
export const obtenerUsuario = mockApi.obtenerUsuario;
export const editarUsuario = mockApi.editarUsuario;
export const eliminarUsuario = mockApi.eliminarUsuario;

// === Cuotas de Servicio y Multas ===
export const obtenerCuotasServicio = mockApi.obtenerCuotasServicio;

export async function crearCuotaServicio(data) {
  const response = await fetch('http://127.0.0.1:8000/api/cuotas-servicio/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function obtenerMultas() {
  const response = await fetch('http://127.0.0.1:8000/api/multas/');
  return response.json();
}

export async function crearMulta(data) {
  const response = await fetch('http://127.0.0.1:8000/api/multas/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function editarCuotaServicio(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/cuotas-servicio/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function eliminarCuotaServicio(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/cuotas-servicio/${id}/`, {
    method: 'DELETE'
  });
  return response;
}

export async function editarMulta(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/multas/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function eliminarMulta(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/multas/${id}/`, {
    method: 'DELETE'
  });
  return response;
}


// === Roles y Permisos y otros servicios ===
export const obtenerRoles = mockApi.obtenerRoles;
export const crearUsuarioRol = mockApi.crearUsuarioRol;
export const editarUsuarioRol = mockApi.editarUsuarioRol;
export const eliminarUsuarioRol = mockApi.eliminarUsuarioRol;
export const obtenerAvisos = mockApi.obtenerAvisos;
export const crearAviso = mockApi.crearAviso;
export const editarAviso = mockApi.editarAviso;
export const eliminarAviso = mockApi.eliminarAviso;
export const obtenerAreasComunes = mockApi.obtenerAreasComunes;
export const crearAreaComun = mockApi.crearAreaComun;
export const editarAreaComun = mockApi.editarAreaComun;
export const eliminarAreaComun = mockApi.eliminarAreaComun;
export const obtenerReservas = mockApi.obtenerReservas;
export const crearReserva = mockApi.crearReserva;
export const editarReserva = mockApi.editarReserva;
export const eliminarReserva = mockApi.eliminarReserva;
export const generarReporte = mockApi.generarReporte;
export const subirComprobante = mockApi.subirComprobante;
