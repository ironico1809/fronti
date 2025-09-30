// Servicio para reportes de uso de áreas
export async function getReporteUsoAreas({ fechaInicio, fechaFin, areaId }) {
  const params = [];
  if (fechaInicio) params.push(`fecha_inicio=${fechaInicio}`);
  if (fechaFin) params.push(`fecha_fin=${fechaFin}`);
  if (areaId && areaId !== 'TODAS') params.push(`area_id=${areaId}`);
  const url = `http://127.0.0.1:8000/api/reportes/uso-areas/?${params.join('&')}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al obtener reporte de uso de áreas');
  return response.json();
}
