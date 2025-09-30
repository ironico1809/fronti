import React, { useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';
import './HistoriaPagos.css';

const pagosMock = [
  { id: 'TX-00051', fecha: '2025-09-05', hora: '14:22', unidad: 'C-12', concepto: 'Expensa Septiembre', periodo: '2025-09', metodo: 'TARJETA', monto: 350.00, estado: 'Aprobada' },
  { id: 'TX-00042', fecha: '2025-08-21', hora: '09:10', unidad: 'C-12', concepto: 'Agua Agosto', periodo: '2025-08', metodo: 'TRANSFERENCIA', monto: 42.50, estado: 'Aprobada' },
  { id: 'TX-00039', fecha: '2025-08-19', hora: '17:45', unidad: 'C-12', concepto: 'Luz Agosto', periodo: '2025-08', metodo: 'QR', monto: 68.20, estado: 'Aprobada' },
  { id: 'TX-00033', fecha: '2025-08-01', hora: '11:05', unidad: 'C-12', concepto: 'Multa: Ruido nocturno', periodo: '2025-07', metodo: 'TARJETA', monto: 100.00, estado: 'Rechazada' },
  { id: 'TX-00028', fecha: '2025-07-30', hora: '15:12', unidad: 'C-12', concepto: 'Expensa Agosto', periodo: '2025-08', metodo: 'TARJETA', monto: 350.00, estado: 'Aprobada' },
];

const metodos = ['Todos', 'TARJETA', 'TRANSFERENCIA', 'QR'];
const estados = ['Todos', 'Aprobada', 'Rechazada'];

const estadoBadge = (estado) => {
  const variant = estado === 'Aprobada' ? 'success' : estado === 'Rechazada' ? 'danger' : 'neutral';
  return <Badge variant={variant} label={estado} />;
};


const HistorialPagos = () => {
  const [q, setQ] = useState('');
  const [metodo, setMetodo] = useState('Todos');
  const [estado, setEstado] = useState('Todos');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const filtrados = useMemo(() => {
    return pagosMock.filter(p => {
      const byQ = q === '' || `${p.concepto} ${p.periodo} ${p.id}`.toLowerCase().includes(q.toLowerCase());
      const byMetodo = metodo === 'Todos' || p.metodo === metodo;
      const byEstado = estado === 'Todos' || p.estado === estado;
      const ts = new Date(p.fecha).getTime();
      const okD = !desde || ts >= new Date(desde).getTime();
      const okH = !hasta || ts <= new Date(hasta).getTime();
      return byQ && byMetodo && byEstado && okD && okH;
    });
  }, [q, metodo, estado, desde, hasta]);

  const totalAprobado = useMemo(() => filtrados
    .filter(p => p.estado === 'Aprobada')
    .reduce((acc, p) => acc + p.monto, 0), [filtrados]);

  const currency = useMemo(() => new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }), []);

  const limpiar = () => { setQ(''); setMetodo('Todos'); setEstado('Todos'); setDesde(''); setHasta(''); };

  const download = (p) => {
    if (p.estado !== 'Aprobada') return;
    const content = `Comprobante de pago\nID: ${p.id}\nFecha: ${p.fecha} ${p.hora}\nUnidad: ${p.unidad}\nConcepto: ${p.concepto}\nPeriodo: ${p.periodo}\nMétodo: ${p.metodo}\nMonto: Bs ${p.monto.toFixed(2)}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `comprobante-${p.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };
  const preview = (p) => {
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`<pre>${JSON.stringify(p, null, 2)}</pre>`);
      w.document.close();
    }
  };

  return (
    <DashboardLayout>
      <div className="hp-container">
        <div className="hp-header">
          <h1>Historial de pagos y comprobantes</h1>
          <p>Revisa tus pagos realizados y descarga los comprobantes.</p>
        </div>
        <div className="hp-summary">
          <div className="hp-card" aria-live="polite">
            <div className="hp-title">Total aprobado (vista)</div>
            <div className="hp-amount">{currency.format(totalAprobado)}</div>
            <div className="hp-note">Según filtros aplicados</div>
          </div>
          <div className="hp-card">
            <div className="hp-title">Pagos listados</div>
            <div className="hp-count">{filtrados.length}</div>
            <div className="hp-note">Incluye aprobados y rechazados</div>
          </div>
        </div>
        <div className="hp-filters">
          <Input placeholder="Buscar por concepto, período o ID" value={q} onChange={e=>setQ(e.target.value)} />
          <select className="hp-select" value={metodo} onChange={e=>setMetodo(e.target.value)}>
            {metodos.map(m => <option key={m} value={m}>{m === 'Todos' ? 'Método' : m}</option>)}
          </select>
          <select className="hp-select" value={estado} onChange={e=>setEstado(e.target.value)}>
            {estados.map(s => <option key={s} value={s}>{s === 'Todos' ? 'Estado' : s}</option>)}
          </select>
          <input type="date" className="hp-date" value={desde} onChange={e=>setDesde(e.target.value)} placeholder="dd/mm/aaaa" />
          <input type="date" className="hp-date" value={hasta} onChange={e=>setHasta(e.target.value)} placeholder="dd/mm/aaaa" />
          <Button onClick={limpiar}>Limpiar</Button>
        </div>
        <div className="hp-table" role="table" aria-label="Historial de pagos">
          <div className="hp-thead">
            <div>Fecha</div><div>Hora</div><div>ID Pago</div><div>Unidad</div><div>Concepto</div><div>Periodo</div><div>Método</div><div>Monto (Bs)</div><div>Estado</div><div>Comprobante</div>
          </div>
          {filtrados.length === 0 && (
            <div className="hp-empty" role="row">
              <div className="hp-empty-inner">No hay pagos que coincidan con los filtros.</div>
            </div>
          )}
          {filtrados.map(p => (
            <div className="hp-row" key={p.id}>
              <div>{p.fecha}</div>
              <div>{p.hora}</div>
              <div>{p.id}</div>
              <div>{p.unidad}</div>
              <div className="hp-concept" title={p.concepto}>{p.concepto}</div>
              <div>{p.periodo}</div>
              <div>{p.metodo}</div>
              <div className="hp-amount-cell">{currency.format(p.monto)}</div>
              <div>{estadoBadge(p.estado)}</div>
              <div className="hp-actions">
                {p.estado === 'Aprobada' ? (
                  <>
                    <Button className="small" onClick={() => download(p)} aria-label={`Descargar comprobante ${p.id}`} title={`Descargar comprobante ${p.id}`}>Descargar</Button>
                    <Button className="outline small" onClick={() => preview(p)} aria-label={`Vista previa ${p.id}`} title={`Vista previa ${p.id}`}>Vista previa</Button>
                  </>
                ) : (
                  <span style={{color:'#8a87a9'}}>—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HistorialPagos;
