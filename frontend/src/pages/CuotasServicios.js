import React, { useMemo, useState, useEffect } from 'react';
import { obtenerCuotasGeneradas } from '../services/api';
import Sidebar from '../components/Sidebar';
import Input from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ExportButtons from '../components/ExportButtons';
import './CuotasServicios.css';
import DashboardLayout from '../components/DashboardLayout';


const mapCuota = (c) => ({
  id: c.id,
  unidad: c.unidad?.nombre || '',
  tipo: c.cuota_servicio?.tipo || '',
  concepto: c.cuota_servicio?.nombre || '',
  periodo: c.periodo,
  vencimiento: c.vencimiento,
  monto: Number(c.monto),
  estado: c.estado
});

const tipos = ['Todos', 'EXPENSA', 'SERVICIO', 'MULTA'];
const estados = ['Todos', 'Pendiente', 'Pagado', 'Vencido'];

const estadoBadge = (estado) => {
  const variant = estado === 'Pagado' ? 'success' : estado === 'Vencido' ? 'danger' : 'neutral';
  return <Badge variant={variant} label={estado} />;
};


const CuotasServicios = () => {
  const [q, setQ] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [estado, setEstado] = useState('Todos');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    obtenerCuotasGeneradas().then(data => {
      setCuotas(Array.isArray(data) ? data.map(mapCuota) : []);
      setLoading(false);
    });
  }, []);

  const filtrados = useMemo(() => {
    return cuotas.filter(r => {
      const byQuery = q === '' || `${r.concepto} ${r.tipo}`.toLowerCase().includes(q.toLowerCase());
      const byTipo = tipo === 'Todos' || r.tipo === tipo;
      const byEstado = estado === 'Todos' || r.estado === estado;
      const vto = new Date(r.vencimiento).getTime();
      const okDesde = !desde || vto >= new Date(desde).getTime();
      const okHasta = !hasta || vto <= new Date(hasta).getTime();
      return byQuery && byTipo && byEstado && okDesde && okHasta;
    });
  }, [q, tipo, estado, desde, hasta, cuotas]);

  const totalPendiente = useMemo(() => filtrados
    .filter(r => r.estado !== 'Pagado')
    .reduce((acc, r) => acc + r.monto, 0), [filtrados]);

  const totalPagado = useMemo(() => filtrados
    .filter(r => r.estado === 'Pagado')
    .reduce((acc, r) => acc + r.monto, 0), [filtrados]);

  const limpiar = () => { setQ(''); setTipo('Todos'); setEstado('Todos'); setDesde(''); setHasta(''); };

  return (
    <DashboardLayout>
      <div className="cs-container">
          <div className="cs-header">
            <h1>Consultar cuotas y servicios</h1>
            <p>Visualiza montos, vencimientos y estado de pago de tu unidad.</p>
          </div>

          <div className="cs-summary">
            <div className="summary-card">
              <div className="summary-title">Total pendiente</div>
              <div className="summary-amount">Bs {totalPendiente.toFixed(2)}</div>
              <div className="summary-note">Incluye pendientes y vencidos</div>
            </div>
            <div className="summary-card">
              <div className="summary-title">Total pagado (vista)</div>
              <div className="summary-amount">Bs {totalPagado.toFixed(2)}</div>
              <div className="summary-note">Según filtros actuales</div>
            </div>
          </div>

          <div className="cs-filters">
            <Input placeholder="Buscar por concepto o periodo" value={q} onChange={e => setQ(e.target.value)} />
            <select className="cs-select" value={tipo} onChange={e => setTipo(e.target.value)}>
              {tipos.map(t => (<option key={t} value={t}>{t === 'Todos' ? 'Tipo' : t}</option>))}
            </select>
            <select className="cs-select" value={estado} onChange={e => setEstado(e.target.value)}>
              {estados.map(s => (<option key={s} value={s}>{s === 'Todos' ? 'Estado' : s}</option>))}
            </select>
            <div className="cs-dates">
              <input type="date" className="cs-date" value={desde} onChange={e => setDesde(e.target.value)} placeholder="Desde" />
              <span className="cs-date-sep">de</span>
              <input type="date" className="cs-date" value={hasta} onChange={e => setHasta(e.target.value)} placeholder="Hasta" />
            </div>
            <Button onClick={limpiar}>Limpiar</Button>
          </div>

          <div className="cs-export-section">
            <ExportButtons
              data={filtrados}
              fileName="cuotas_servicios"
              reportTitle="Reporte de Cuotas y Servicios - Smart Condominium"
              disabled={filtrados.length === 0}
              onExportStart={(format) => console.log(`Exportando cuotas en ${format}...`)}
              onExportComplete={(format, fileName) => {
                alert(`✅ Reporte de cuotas exportado como ${fileName}`);
              }}
              onExportError={(format, error) => {
                console.error(`Error exportando cuotas:`, error);
              }}
            />
          </div>

          <div className="cs-table">
            <div className="cs-thead">
              <div>Unidad</div><div>Tipo</div><div>Concepto</div><div>Periodo</div><div>Vencimiento</div><div>Monto (Bs)</div><div>Estado</div><div>Acciones</div>
            </div>
            {filtrados.map(r => (
              <div className="cs-row" key={r.id}>
                <div>{r.unidad}</div>
                <div>{r.tipo}</div>
                <div className="cs-concept" title={r.concepto}>{r.concepto}</div>
                <div>{r.periodo}</div>
                <div>{r.vencimiento}</div>
                <div className="cs-monto">{r.monto.toFixed(2)}</div>
                <div>{estadoBadge(r.estado)}</div>
                <div className="cs-actions">
                  <Button className="outline small">Detalle</Button>
                  {r.estado === 'Pagado' && <Button className="small">Comprobante</Button>}
                </div>
              </div>
            ))}
          </div>
      </div>
    </DashboardLayout>
  );
};

export default CuotasServicios;
