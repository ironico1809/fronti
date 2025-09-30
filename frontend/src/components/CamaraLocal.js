import React, { useRef, useEffect, useState } from 'react';
import './CamaraLocal.css';

const CamaraLocal = ({ seleccionada, onSeleccionar }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(seleccionada || '');
  const [camaraActiva, setCamaraActiva] = useState(true);

  // Sincroniza con el prop seleccionada
  useEffect(() => {
    if (seleccionada && seleccionada !== selectedDeviceId) {
      setSelectedDeviceId(seleccionada);
    }
  }, [seleccionada]);

  useEffect(() => {
    async function getDevices() {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId);
          if (onSeleccionar) onSeleccionar(videoDevices[0].deviceId);
        }
      } catch (err) {
        setError('No se pudieron obtener las cámaras: ' + err.message);
      }
    }
    getDevices();
  }, []);

  useEffect(() => {
    if (!selectedDeviceId || !camaraActiva) return;
    let currentStream;
    async function getCamara() {
      setLoading(true);
      setError('');
      // Liberar cualquier stream anterior ANTES de pedir uno nuevo
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: selectedDeviceId } } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        currentStream = stream;
        setLoading(false);
      } catch (err) {
        setError('No se pudo acceder a la cámara: ' + err.message);
        setLoading(false);
      }
    }
    getCamara();
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedDeviceId, camaraActiva]);

  const handleSelect = e => {
    setSelectedDeviceId(e.target.value);
    if (onSeleccionar) onSeleccionar(e.target.value);
  };

  const handleToggle = () => {
    setCamaraActiva(prev => {
      if (prev && videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      return !prev;
    });
  };

  return (
    <div className="camara-local-card">
      <div className="camara-local-header">
        <span className="camara-local-icon">💻</span>
        <div>
          <h3 className="camara-local-title">Vista previa de tu cámara local</h3>
          <p className="camara-local-desc">Solo tú puedes ver este video. Tu cámara nunca se sube a la nube.</p>
        </div>
      </div>
      <div className="camara-local-video-wrap">
        {devices.length > 1 && (
          <select
            className="camara-local-select"
            value={selectedDeviceId}
            onChange={handleSelect}
            style={{ marginBottom: 12 }}
          >
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Cámara ${device.deviceId.slice(-4)}`}
              </option>
            ))}
          </select>
        )}
        <button className="camara-local-toggle" onClick={handleToggle} style={{ marginBottom: 12 }}>
          {camaraActiva ? 'Desactivar cámara' : 'Activar cámara'}
        </button>
        {loading && camaraActiva && <div className="camara-local-loading">Cargando cámara...</div>}
        {error && camaraActiva && <div className="camara-local-error">{error}</div>}
        <video ref={videoRef} autoPlay playsInline muted className="camara-local-video" style={{ display: camaraActiva && !loading && !error ? 'block' : 'none' }} />
        {!camaraActiva && <div className="camara-local-off">Cámara desactivada</div>}
      </div>
    </div>
  );
};

export default CamaraLocal;
