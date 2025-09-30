import React, { useState, useEffect, useRef } from 'react';
import { registrarRostro, obtenerUsuarios } from '../services/rostros';
import './ReconocimientoFacial.css';

const RegistrarRostro = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [imagen, setImagen] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usandoCamara, setUsandoCamara] = useState(false);
  const [dispositivos, setDispositivos] = useState([]);
  const [dispositivoId, setDispositivoId] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    obtenerUsuarios().then(setUsuarios);
  }, []);

  const handleImagenChange = (e) => {
    setImagen(e.target.files[0]);
    setResultado(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioId || !imagen) {
      setError('Selecciona un usuario y una imagen');
      return;
    }
    setLoading(true);
    setResultado(null);
    setError(null);
    try {
      const data = await registrarRostro(usuarioId, imagen);
      setResultado(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar rostro');
    } finally {
      setLoading(false);
    }
  };

  // Obtener lista de cámaras disponibles
  useEffect(() => {
    if (!usandoCamara) return;
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videos = devices.filter(d => d.kind === 'videoinput');
      setDispositivos(videos);
      if (videos.length > 0 && !dispositivoId) {
        setDispositivoId(videos[0].deviceId);
      }
    });
  }, [usandoCamara]);

  const iniciarCamara = async () => {
    setUsandoCamara(true);
    setResultado(null);
    setError(null);
  };

  useEffect(() => {
    if (!usandoCamara || !dispositivoId) return;
    const iniciar = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: dispositivoId } } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        setError('No se pudo acceder a la cámara');
        setUsandoCamara(false);
      }
    };
    iniciar();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [usandoCamara, dispositivoId]);

  const capturarFoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setImagen(new File([blob], 'captura.jpg', { type: 'image/jpeg' }));
      setUsandoCamara(false);
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    }, 'image/jpeg');
  };

  const cancelarCamara = () => {
    setUsandoCamara(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="reconocimiento-facial-form">
      <h2>Registrar Rostro de Residente</h2>
      <form onSubmit={handleSubmit}>
        <select value={usuarioId} onChange={e => setUsuarioId(e.target.value)}>
          <option value="">Selecciona un usuario</option>
          {usuarios.map(u => (
            <option key={u.id} value={u.id}>{u.nombre_completo}</option>
          ))}
        </select>
        <input type="file" accept="image/*" onChange={handleImagenChange} />
        <div>
          <button type="button" onClick={iniciarCamara} disabled={usandoCamara}>Usar cámara</button>
          <button type="submit" disabled={loading || !usuarioId || !imagen}>{loading ? 'Registrando...' : 'Registrar'}</button>
        </div>
      </form>
      {usandoCamara && (
        <div>
          {dispositivos.length > 1 && (
            <select
              value={dispositivoId}
              onChange={e => setDispositivoId(e.target.value)}
              style={{ marginBottom: 8 }}
            >
              {dispositivos.map(d => (
                <option key={d.deviceId} value={d.deviceId}>{d.label || `Cámara ${d.deviceId}`}</option>
              ))}
            </select>
          )}
          <video ref={videoRef} autoPlay muted />
          <div>
            <button onClick={capturarFoto}>Capturar</button>
            <button onClick={cancelarCamara}>Cancelar</button>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}
      {imagen && !usandoCamara && (
        <div>
          <img src={URL.createObjectURL(imagen)} alt="captura" />
        </div>
      )}
      {resultado && (
        <div className="resultado">
          <strong>Registrado:</strong>
          <pre>{JSON.stringify(resultado, null, 2)}</pre>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default RegistrarRostro;
