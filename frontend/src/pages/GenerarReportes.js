import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import ExportButtons from '../components/ExportButtons';
import './GenerarReportes.css';
import { getReporteUsoAreas } from '../services/reportes';

import { obtenerAreasComunes } from '../services/areas';

// Los datos de reservas ahora vendrán del backend

const datosMensuales = [
  { mes: 'Enero', reservas: 89, ingresos: 4230 },
  { mes: 'Febrero', reservas: 95, ingresos: 4750 },
  { mes: 'Marzo', reservas: 112, ingresos: 5340 },
  { mes: 'Abril', reservas: 98, ingresos: 4890 },
  { mes: 'Mayo', reservas: 134, ingresos: 6270 },
  { mes: 'Junio', reservas: 156, ingresos: 7440 },
  { mes: 'Julio', reservas: 178, ingresos: 8230 },
  { mes: 'Agosto', reservas: 165, ingresos: 7825 },
  { mes: 'Septiembre', reservas: 142, ingresos: 6750 }
];

const usuariosActivos = [
  { usuario: 'María González', reservas: 28, gastado: 1400 },
  { usuario: 'Carlos Mendoza', reservas: 24, gastado: 1200 },
  { usuario: 'Ana Patricia Silva', reservas: 19, gastado: 950 },
  { usuario: 'Roberto Torres', reservas: 16, gastado: 800 },
  { usuario: 'Laura Jiménez', reservas: 14, gastado: 700 },
  { usuario: 'Diego Morales', reservas: 12, gastado: 600 },
  { usuario: 'Carmen Ruiz', reservas: 11, gastado: 550 },
  { usuario: 'Fernando López', reservas: 9, gastado: 450 }
];

const GenerarReportes = () => {
  const [filtros, setFiltros] = useState({
    areaSeleccionada: 'TODAS',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    tipoReporte: 'ocupacion'
  });
  const [areasComunes, setAreasComunes] = useState([]);
  const [datosReporte, setDatosReporte] = useState([]);
  const [resumen, setResumen] = useState({ total_reservas: 0, confirmadas: 0, canceladas: 0, ingresos: 0, tasa_confirmacion: 0 });
  const [cargando, setCargando] = useState(false);
  const [tipoVista, setTipoVista] = useState('tabla');

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const generarReporte = async () => {
    setCargando(true);
    try {
      const res = await getReporteUsoAreas({
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin,
        areaId: filtros.areaSeleccionada
      });
      setDatosReporte(res.reporte_areas.map(area => ({
        area: area.area,
        total_reservas: area.total_reservas,
        confirmadas: area.confirmadas,
        canceladas: area.canceladas,
        ingresos: area.ingresos,
        promedio: area.promedio_reserva
      })));
      setResumen({
        total_reservas: res.total_reservas,
        confirmadas: res.confirmadas,
        canceladas: res.canceladas,
        ingresos: res.ingresos,
        tasa_confirmacion: res.tasa_confirmacion
      });
    } catch (e) {
      alert('Error al obtener el reporte: ' + e.message);
    }
    setCargando(false);
  };

  useEffect(() => {
    // Cargar áreas comunes para el filtro
    obtenerAreasComunes().then(data => setAreasComunes(data));
    generarReporte();
    // eslint-disable-next-line
  }, []);

  return (
    <DashboardLayout>
      <div className="reportes-card">
        <div className="page-header">
          <h1>Reportes de Uso de Instalaciones</h1>
          <p className="reportes-subtitle">
            Genere reportes de ocupación, uso y estadísticas de áreas comunes
          </p>
        </div>

        {/* Panel de filtros */}
        <div className="filtros-panel">
          <div className="filtros-grid">
            <div className="filtro-group">
              <label>Tipo de reporte</label>
              <select
                value={filtros.tipoReporte}
                onChange={(e) => handleFiltroChange('tipoReporte', e.target.value)}
                className="filtro-select"
              >
                <option value="ocupacion">Ocupación por área</option>
                {/* Puedes agregar más tipos de reporte aquí */}
              </select>
            </div>

            <div className="filtro-group">
              <label>Área específica</label>
              <select
                value={filtros.areaSeleccionada}
                onChange={(e) => handleFiltroChange('areaSeleccionada', e.target.value)}
                className="filtro-select"
              >
                <option value="TODAS">Todas las áreas</option>
                {areasComunes.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-group">
              <label>Fecha inicio</label>
              <Input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
              />
            </div>

            <div className="filtro-group">
              <label>Fecha fin</label>
              <Input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
              />
            </div>
          </div>

          <div className="filtros-actions">
            <Button onClick={generarReporte} disabled={cargando}>
              {cargando ? 'Generando...' : 'Generar Reporte'}
            </Button>
            <div className="vista-toggle">
              <button
                className={`toggle-btn ${tipoVista === 'tabla' ? 'active' : ''}`}
                onClick={() => setTipoVista('tabla')}
              >
                📊 Tabla
              </button>
              <button
                className={`toggle-btn ${tipoVista === 'grafico' ? 'active' : ''}`}
                onClick={() => setTipoVista('grafico')}
              >
                📈 Gráfico
              </button>
            </div>
          </div>
        </div>

        {/* Métricas resumen */}
        <div className="metricas-resumen">
          <div className="metrica-card">
            <div className="metrica-icon">📊</div>
            <div className="metrica-info">
              <h3>{resumen.total_reservas}</h3>
              <span>Total Reservas</span>
            </div>
          </div>
          <div className="metrica-card">
            <div className="metrica-icon">✅</div>
            <div className="metrica-info">
              <h3>{resumen.confirmadas}</h3>
              <span>Confirmadas</span>
            </div>
          </div>
          <div className="metrica-card">
            <div className="metrica-icon">💰</div>
            <div className="metrica-info">
              <h3>${resumen.ingresos.toLocaleString()}</h3>
              <span>Ingresos Totales</span>
            </div>
          </div>
          <div className="metrica-card">
            <div className="metrica-icon">📈</div>
            <div className="metrica-info">
              <h3>{resumen.tasa_confirmacion}%</h3>
              <span>Tasa de Confirmación</span>
            </div>
          </div>
        </div>

          {/* Contenido del reporte */}
          <div className="reporte-contenido">
            {filtros.tipoReporte === 'ocupacion' && (
              <div className="reporte-seccion">
                <div className="seccion-header">
                  <h2>Reporte de Ocupación por Área</h2>
                  <ExportButtons
                    data={datosReporte}
                    fileName="reporte_ocupacion_areas"
                    reportTitle="Reporte de Ocupación por Área - Smart Condominium"
                    disabled={datosReporte.length === 0}
                    onExportStart={(format) => console.log(`Generando reporte de ocupación en ${format}...`)}
                    onExportComplete={(format, fileName) => {
                      alert(`✅ Reporte de ocupación exportado como ${fileName}`);
                    }}
                    onExportError={(format, error) => {
                      console.error(`Error exportando reporte de ocupación:`, error);
                    }}
                  />
                </div>

                {tipoVista === 'tabla' ? (
                  <div className="tabla-reporte">
                    <table>
                      <thead>
                        <tr>
                          <th>Área</th>
                          <th>Total Reservas</th>
                          <th>Confirmadas</th>
                          <th>Canceladas</th>
                          <th>Tasa Confirmación</th>
                          <th>Ingresos</th>
                          <th>Promedio/Reserva</th>
                        </tr>
                      </thead>
                      <tbody>
                        {datosReporte.map(area => (
                          <tr key={area.id_area}>
                            <td className="area-nombre">{area.area}</td>
                            <td>{area.total_reservas}</td>
                            <td className="confirmadas">{area.confirmadas}</td>
                            <td className="canceladas">{area.canceladas}</td>
                            <td>{((area.confirmadas / area.total_reservas) * 100).toFixed(1)}%</td>
                            <td className="ingresos">${area.ingresos.toLocaleString()}</td>
                            <td>${area.promedio}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grafico-placeholder">
                    <div className="chart-container">
                      <h3>Gráfico de Ocupación</h3>
                      <div className="chart-bars-enhanced">
                        <div className="y-axis">
                          <span>{Math.max(...datosReporte.map(d => d.total_reservas))}</span>
                          <span>0</span>
                        </div>
                        <div className="bars-wrapper">
                          {datosReporte.map((area, index) => {
                            const max = Math.max(...datosReporte.map(d => d.total_reservas)) || 1;
                            const height = (area.total_reservas / max) * 200;
                            return (
                              <div key={area.id_area} className="chart-bar-enhanced">
                                <span className="bar-value-top">{area.total_reservas}</span>
                                <div
                                  className="bar enhanced"
                                  style={{
                                    height: `${height}px`,
                                    background: `linear-gradient(180deg, hsl(${index * 60}, 80%, 60%) 0%, hsl(${index * 60}, 70%, 45%) 100%)`,
                                    transition: 'height 0.7s cubic-bezier(0.4,0,0.2,1)'
                                  }}
                                ></div>
                                <span className="bar-label">{area.area}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="x-axis"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {filtros.tipoReporte === 'temporal' && (
              <div className="reporte-seccion">
                <div className="seccion-header">
                  <h2>Tendencias Temporales</h2>
                  <ExportButtons
                    data={datosReporte}
                    fileName="reporte_tendencias_temporales"
                    reportTitle="Tendencias Temporales - Smart Condominium"
                    disabled={datosReporte.length === 0}
                    onExportStart={(format) => console.log(`Generando reporte temporal en ${format}...`)}
                    onExportComplete={(format, fileName) => {
                      alert(`✅ Reporte temporal exportado como ${fileName}`);
                    }}
                    onExportError={(format, error) => {
                      console.error(`Error exportando reporte temporal:`, error);
                    }}
                  />
                </div>

                <div className="tabla-reporte">
                  <table>
                    <thead>
                      <tr>
                        <th>Mes</th>
                        <th>Total Reservas</th>
                        <th>Ingresos</th>
                        <th>Promedio por Reserva</th>
                        <th>Tendencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosMensuales.map((mes, index) => (
                        <tr key={mes.mes}>
                          <td>{mes.mes}</td>
                          <td>{mes.reservas}</td>
                          <td className="ingresos">${mes.ingresos.toLocaleString()}</td>
                          <td>${(mes.ingresos / mes.reservas).toFixed(0)}</td>
                          <td>
                            {index > 0 ? (
                              mes.reservas > datosMensuales[index - 1].reservas ? 
                                <span className="tendencia-up">📈 +{mes.reservas - datosMensuales[index - 1].reservas}</span> :
                                <span className="tendencia-down">📉 {mes.reservas - datosMensuales[index - 1].reservas}</span>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filtros.tipoReporte === 'usuarios' && (
              <div className="reporte-seccion">
                <div className="seccion-header">
                  <h2>Usuarios Más Activos</h2>
                  <ExportButtons
                    data={datosReporte}
                    fileName="reporte_usuarios_activos"
                    reportTitle="Usuarios Más Activos - Smart Condominium"
                    disabled={datosReporte.length === 0}
                    onExportStart={(format) => console.log(`Generando reporte de usuarios en ${format}...`)}
                    onExportComplete={(format, fileName) => {
                      alert(`✅ Reporte de usuarios exportado como ${fileName}`);
                    }}
                    onExportError={(format, error) => {
                      console.error(`Error exportando reporte de usuarios:`, error);
                    }}
                  />
                </div>

                <div className="tabla-reporte">
                  <table>
                    <thead>
                      <tr>
                        <th>Posición</th>
                        <th>Usuario</th>
                        <th>Total Reservas</th>
                        <th>Total Gastado</th>
                        <th>Promedio por Reserva</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosActivos.map((usuario, index) => (
                        <tr key={index}>
                          <td className="posicion">#{index + 1}</td>
                          <td className="usuario-nombre">{usuario.usuario}</td>
                          <td>{usuario.reservas}</td>
                          <td className="ingresos">${usuario.gastado.toLocaleString()}</td>
                          <td>${(usuario.gastado / usuario.reservas).toFixed(0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
    </DashboardLayout>
  );
};

export default GenerarReportes;