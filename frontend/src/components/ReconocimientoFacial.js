import React, { useState, useRef, useEffect } from 'react';
import { reconocerRostro } from '../services/reconocimiento';
import './ReconocimientoFacial.css';


const ReconocimientoFacial = () => {
  const [imagen, setImagen] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usandoCamara, setUsandoCamara] = useState(false);
  const [dispositivos, setDispositivos] = useState([]);
  const [dispositivoId, setDispositivoId] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [autoReconocimiento, setAutoReconocimiento] = useState(false);
  const autoIntervalRef = useRef(null);

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

  const handleImagenChange = (e) => {
    setImagen(e.target.files[0]);
    setResultado(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagen) return;
    setLoading(true);
    setResultado(null);
    setError(null);
    try {
      const data = await reconocerRostro(imagen);
      setResultado(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al reconocer rostro');
    } finally {
      setLoading(false);
    }
  };

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
    // Limpiar stream al desmontar
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [usandoCamara, dispositivoId]);

  const capturarFoto = async (auto = false) => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'captura.jpg', { type: 'image/jpeg' });
      if (auto) {
        setLoading(true);
        setResultado(null);
        setError(null);
        try {
          const data = await reconocerRostro(file);
          setResultado(data);
        } catch (err) {
          setError(err.response?.data?.error || 'Error al reconocer rostro');
        } finally {
          setLoading(false);
        }
      } else {
        setImagen(file);
        setUsandoCamara(false);
        // Detener la cámara
        if (video.srcObject) {
          video.srcObject.getTracks().forEach(track => track.stop());
        }
      }
    }, 'image/jpeg');
  };

  const cancelarCamara = () => {
    setUsandoCamara(false);
    setAutoReconocimiento(false);
    clearInterval(autoIntervalRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  // Manejar auto-reconocimiento
  useEffect(() => {
    if (autoReconocimiento && usandoCamara) {
      capturarFoto(true); // Primer reconocimiento inmediato
      autoIntervalRef.current = setInterval(() => {
        capturarFoto(true);
      }, 30000); // cada 30 segundos
    } else {
      clearInterval(autoIntervalRef.current);
    }
    return () => clearInterval(autoIntervalRef.current);
    // eslint-disable-next-line
  }, [autoReconocimiento, usandoCamara, dispositivoId]);

  return (
    <div className="reconocimiento-facial-form">
      <h2>Reconocimiento Facial</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImagenChange} />
        <div>
          <button type="button" onClick={iniciarCamara} disabled={usandoCamara}>
            Usar cámara
          </button>
          <button type="submit" disabled={loading || !imagen}>
            {loading ? 'Procesando...' : 'Reconocer'}
          </button>
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
            <button onClick={() => capturarFoto(false)}>Capturar</button>
            <button onClick={cancelarCamara}>Cancelar</button>
            <button
              style={{ marginLeft: 8 }}
              onClick={() => setAutoReconocimiento(a => !a)}
              type="button"
            >
              {autoReconocimiento ? 'Detener auto' : 'Auto cada 30s'}
            </button>
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
          <strong>Resultado:</strong>
          <pre>{JSON.stringify(resultado, null, 2)}</pre>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ReconocimientoFacial;
