import React, { useMemo, useState } from 'react';
import { crearPagoConComprobante } from '../services/api';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Badge from '../components/Badge';
import Input from '../components/Input';
import './Pagos.css';
import DashboardLayout from '../components/DashboardLayout';

const cargosMock = [
  { id: 1, tipo: 'EXPENSA', concepto: 'Expensa Septiembre', periodo: '2025-09', vence: '2025-09-10', monto: 350.00, estado: 'Pendiente' },
  { id: 2, tipo: 'SERVICIO', concepto: 'Agua Septiembre', periodo: '2025-09', vence: '2025-09-20', monto: 45.20, estado: 'Pendiente' },
  { id: 3, tipo: 'MULTA', concepto: 'Estacionamiento indebido', periodo: '2025-08', vence: '2025-08-31', monto: 100.00, estado: 'Vencido' },
];

const estadoBadge = (estado) => {
  const variant = estado === 'Pendiente' ? 'neutral' : estado === 'Vencido' ? 'danger' : 'success';
  return <Badge variant={variant} label={estado} />;
};

const Pagos = () => {
  const [seleccionados, setSeleccionados] = useState([]);
  const [tab, setTab] = useState('tarjeta');
  const [card, setCard] = useState({ numero: '', titular: '', venc: '', cvv: '' });
  const [comprobante, setComprobante] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => seleccionados
    .map(id => cargosMock.find(c => c.id === id))
    .filter(Boolean)
    .reduce((acc, c) => acc + c.monto, 0), [seleccionados]);

  const allSelected = seleccionados.length === cargosMock.length;

  const toggleItem = (id) => {
    setSeleccionados((arr) => arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  };
  const selectAll = () => {
    setSeleccionados(allSelected ? [] : cargosMock.map(c => c.id));
  };
  const clearSel = () => setSeleccionados([]);

  const onPay = async () => {
    if (total <= 0) { alert('Selecciona al menos un cargo.'); return; }
    if (tab === 'tarjeta') {
      const digits = card.numero.replace(/\s+/g, '');
      if (digits.length < 13 || digits.length > 19) { alert('Número de tarjeta inválido.'); return; }
      if (!card.titular.trim()) { alert('Ingresa el nombre del titular.'); return; }
      if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(card.venc)) { alert('Vencimiento inválido (MM/AA).'); return; }
      if (!/^\d{3,4}$/.test(card.cvv)) { alert('CVV inválido.'); return; }
      alert(`Pago procesado (mock). Monto: Bs ${total.toFixed(2)}`);
      setSeleccionados([]);
    } else if (tab === 'transferencia') {
      if (!comprobante) { alert('Por favor selecciona un comprobante para subir.'); return; }
      setLoading(true);
      try {
        // Aquí debes obtener el usuario y cuota_servicio reales
        // Por ahora, se usan valores de ejemplo:
        const usuario = 1; // Reemplaza con el ID real del usuario
        const cuota_servicio = 1; // Reemplaza con el ID real de la cuota seleccionada
        const monto_pagado = total;
        const res = await crearPagoConComprobante({ usuario, cuota_servicio, monto_pagado, comprobante });
        if (res && res.id) {
          alert('Pago registrado y comprobante subido correctamente.');
          setSeleccionados([]);
          setComprobante(null);
        } else {
          alert('Error al registrar el pago.');
        }
      } catch (e) {
        alert('Error al subir el comprobante.');
      }
      setLoading(false);
    } else {
      alert('Mostrando QR de pago (mock).');
    }
  };

  return (
    <DashboardLayout>
      <div className="pagos-container">
        <section className="panel">
          <div className="panel-header">
            <h2>Cargos pendientes</h2>
            <p>Unidad C-12</p>
          </div>
          <div className="panel-actions">
            <Button className={allSelected ? '' : 'outline'} onClick={selectAll}>Seleccionar todos</Button>
            <Button className="danger" onClick={clearSel}>Limpiar</Button>
          </div>
          <div className="pagos-thead pagos-grid">
            <div></div><div>Tipo</div><div>Concepto</div><div>Periodo</div><div>Vence</div><div>Monto (Bs)</div><div>Estado</div>
          </div>
          {cargosMock.map(c => (
            <div className="pagos-row pagos-grid" key={c.id}>
              <div>
                <Checkbox checked={seleccionados.includes(c.id)} onChange={() => toggleItem(c.id)} />
              </div>
              <div>{c.tipo}</div>
              <div className="pagos-concepto" title={c.concepto}>{c.concepto}</div>
              <div>{c.periodo}</div>
              <div>{c.vence}</div>
              <div className="pagos-monto">{c.monto.toFixed(2)}</div>
              <div>{estadoBadge(c.estado)}</div>
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Resumen y pago</h2>
            <p>Total seleccionado: <b>Bs {total.toFixed(2)}</b></p>
          </div>

          <div className="tabs">
            <button className={`tab ${tab==='tarjeta'?'active':''}`} onClick={()=>setTab('tarjeta')}>💳 Tarjeta</button>
            <button className={`tab ${tab==='transferencia'?'active':''}`} onClick={()=>setTab('transferencia')}>🏦 Transferencia</button>
            <button className={`tab ${tab==='qr'?'active':''}`} onClick={()=>setTab('qr')}>📱 QR</button>
          </div>

          {tab === 'tarjeta' && (
            <div className="pay-form">
              <Input placeholder="Número de tarjeta (16 dígitos)" value={card.numero} onChange={e=>setCard({...card, numero: e.target.value})} />
              <Input placeholder="Nombre del titular" value={card.titular} onChange={e=>setCard({...card, titular: e.target.value})} />
              <div className="two-cols">
                <Input placeholder="Vencimiento (MM/AA)" value={card.venc} onChange={e=>setCard({...card, venc: e.target.value})} />
                <Input placeholder="CVV" value={card.cvv} onChange={e=>setCard({...card, cvv: e.target.value})} />
              </div>
            </div>
          )}
          {tab === 'transferencia' && (
            <div className="bank-box">
              <div>Banco: Banco X</div>
              <div>Cuenta: 123-456-789</div>
              <div>Titular: SmartCondo SA</div>
              <div>Concepto: Pago expensas C-12</div>
              <div className="hint">Sube el comprobante de tu transferencia:</div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={e => setComprobante(e.target.files[0])}
                disabled={loading}
              />
              {comprobante && <div>Archivo seleccionado: {comprobante.name}</div>}
            </div>
          )}
          {tab === 'qr' && (
            <div className="qr-box">
              <div className="qr-placeholder">QR</div>
              <div className="hint">Escanea para pagar desde tu banca móvil (mock).</div>
            </div>
          )}

          <Button onClick={onPay} className="pay-btn" disabled={loading}>{loading ? 'Procesando...' : 'Pagar ahora'}</Button>
          <div className="legal-note">* Nunca guardamos datos sensibles de tu tarjeta en nuestros servidores.</div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Pagos;
