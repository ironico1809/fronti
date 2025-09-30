import React, { useState } from 'react';
import { crearCamara } from '../services/camaras';

const AgregarCamaraForm = ({ onCamaraAgregada }) => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [url_stream, setUrlStream] = useState('');
  const [activa, setActiva] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await crearCamara({ nombre, ubicacion, url_stream, activa });
      setMensaje('Cámara agregada correctamente');
      setNombre('');
      setUbicacion('');
      setUrlStream('');
      setActiva(true);
      if (onCamaraAgregada) onCamaraAgregada();
    } catch (err) {
      setError('Error al agregar cámara');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: '#f7f7f7', padding: 16, borderRadius: 8 }}>
      <h3>Agregar Nueva Cámara</h3>
      <div>
        <label>Nombre:</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)} required />
      </div>
      <div>
        <label>Ubicación:</label>
        <input value={ubicacion} onChange={e => setUbicacion(e.target.value)} required />
      </div>
      <div>
        <label>URL de Stream:</label>
        <input value={url_stream} onChange={e => setUrlStream(e.target.value)} required />
      </div>
      <div>
        <label>Activa:</label>
        <input type="checkbox" checked={activa} onChange={e => setActiva(e.target.checked)} />
      </div>
      <button type="submit">Agregar Cámara</button>
      {mensaje && <div style={{ color: 'green' }}>{mensaje}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default AgregarCamaraForm;
