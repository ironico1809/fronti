import * as mockApi from './mockApi';
export const crearUsuarioRol = mockApi.crearUsuarioRol;
export const obtenerRoles = mockApi.obtenerRoles;
export const obtenerEvidenciasMantenimiento = mockApi.obtenerEvidenciasMantenimiento;
export const obtenerMultas = mockApi.obtenerMultas;
export const crearMulta = mockApi.crearMulta;
export const editarMulta = mockApi.editarMulta;
export const eliminarMulta = mockApi.eliminarMulta;
export const crearRolPermiso = mockApi.crearRolPermiso;
export const editarRolPermiso = mockApi.editarRolPermiso;
export const obtenerPlanesMantenimiento = mockApi.obtenerPlanesMantenimiento;
export const obtenerOrdenesMantenimiento = mockApi.obtenerOrdenesMantenimiento;
export const crearReservaArea = mockApi.crearReservaArea;
export const crearAvisoConAdjuntos = mockApi.crearAvisoConAdjuntos;
export const crearPagoConComprobante = mockApi.crearPagoConComprobante;
export const obtenerRolPermisos = mockApi.obtenerRolPermisos;
export const obtenerUsuarioRoles = mockApi.obtenerUsuarioRoles;
export const obtenerPermisos = mockApi.obtenerPermisos;
export const obtenerActivos = mockApi.obtenerActivos;

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

