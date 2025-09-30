import React, { useState, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { crearAvisoConAdjuntos } from '../services/api';
import './PublicarAvisos.css';

const segmentosDestino = [
  { value: 'TODOS', label: 'Todos los residentes' },
  { value: 'PROPIETARIOS', label: 'Solo propietarios' },
  { value: 'INQUILINOS', label: 'Solo inquilinos' },
  { value: 'ADMINISTRACION', label: 'Personal administrativo' },
  { value: 'MANTENIMIENTO', label: 'Personal de mantenimiento' },
];

const tiposAviso = [
  { value: 'INFORMATIVO', label: 'Informativo' },
  { value: 'URGENTE', label: 'Urgente' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { value: 'EVENTO', label: 'Evento' },
  { value: 'NORMATIVO', label: 'Normativo' },
];

const PublicarAvisos = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    cuerpo: '',
    segmento: 'TODOS',
    tipo: 'INFORMATIVO',
    fechaProgramada: '',
    horaProgramada: '',
    publicarAhora: true,
  });
  const [adjuntos, setAdjuntos] = useState([]);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`El archivo ${file.name} excede el límite de 5MB`);
        return false;
      }
      if (!validTypes.includes(file.type)) {
        alert(`El archivo ${file.name} no es un tipo válido`);
        return false;
      }
      return true;
    });

    if (adjuntos.length + validFiles.length > 3) {
      alert('Máximo 3 archivos adjuntos permitidos');
      return;
    }

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }));

    setAdjuntos(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setAdjuntos(prev => {
      const file = prev.find(f => f.id === id);
      if (file && file.url) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const validateForm = () => {
    if (!formData.titulo.trim()) {
      alert('El título es obligatorio');
      return false;
    }
    if (!formData.cuerpo.trim()) {
      alert('El contenido del aviso es obligatorio');
      return false;
    }
    if (!formData.publicarAhora && (!formData.fechaProgramada || !formData.horaProgramada)) {
      alert('Debe especificar fecha y hora para programar el aviso');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Aquí va la magia, pe
      const id_admin = 1; // Cambia esto por el id real del admin logueado si lo tienes
      const aviso = await crearAvisoConAdjuntos({
        titulo: formData.titulo,
        cuerpo: formData.cuerpo,
        segmento: formData.segmento,
        id_admin,
        adjuntos: adjuntos.map(adj => adj.file)
      });
      alert('Aviso publicado exitosamente, pe');
      setFormData({
        titulo: '',
        cuerpo: '',
        segmento: 'TODOS',
        tipo: 'INFORMATIVO',
        fechaProgramada: '',
        horaProgramada: '',
        publicarAhora: true,
      });
      setAdjuntos([]);
      setPreview(false);
    } catch (error) {
      console.error('Error al publicar aviso:', error);
      alert('Error al publicar el aviso. Intenta de nuevo, causa.');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="avisos-container">
        <div className="avisos-card">
          <div className="page-header">
            <h1>Publicar Avisos y Comunicados</h1>
            <p className="avisos-subtitle">
              Cree y publique avisos dirigidos a los residentes del condominio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="avisos-form">
            <div className="form-grid">
              {/* Título */}
              <div className="form-group">
                <label className="form-label">
                  Título del aviso <span className="required">*</span>
                </label>
                <Input
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  placeholder="Ej: Mantenimiento de elevadores"
                  maxLength={150}
                />
              </div>

              {/* Tipo de aviso */}
              <div className="form-group">
                <label className="form-label">Tipo de aviso</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className="form-select"
                >
                  {tiposAviso.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contenido */}
              <div className="form-group full-width">
                <label className="form-label">
                  Contenido del aviso <span className="required">*</span>
                </label>
                <textarea
                  value={formData.cuerpo}
                  onChange={(e) => handleInputChange('cuerpo', e.target.value)}
                  placeholder="Escriba aquí el contenido completo del aviso..."
                  className="form-textarea"
                  rows={6}
                />
              </div>

              {/* Segmento destino */}
              <div className="form-group">
                <label className="form-label">Destinatarios</label>
                <select
                  value={formData.segmento}
                  onChange={(e) => handleInputChange('segmento', e.target.value)}
                  className="form-select"
                >
                  {segmentosDestino.map(segmento => (
                    <option key={segmento.value} value={segmento.value}>
                      {segmento.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Programación */}
              <div className="form-group">
                <label className="form-label">Programación</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="programacion"
                      checked={formData.publicarAhora}
                      onChange={() => handleInputChange('publicarAhora', true)}
                    />
                    <span>Publicar inmediatamente</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="programacion"
                      checked={!formData.publicarAhora}
                      onChange={() => handleInputChange('publicarAhora', false)}
                    />
                    <span>Programar para más tarde</span>
                  </label>
                </div>
              </div>

              {/* Fecha y hora programada */}
              {!formData.publicarAhora && (
                <>
                  <div className="form-group">
                    <label className="form-label">Fecha programada</label>
                    <Input
                      type="date"
                      value={formData.fechaProgramada}
                      onChange={(e) => handleInputChange('fechaProgramada', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hora programada</label>
                    <Input
                      type="time"
                      value={formData.horaProgramada}
                      onChange={(e) => handleInputChange('horaProgramada', e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Adjuntos */}
              <div className="form-group full-width">
                <label className="form-label">Archivos adjuntos (opcional)</label>
                <div className="file-upload-section">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={adjuntos.length >= 3}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5V19M5 12L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Agregar archivos
                  </Button>
                  <small className="file-help">
                    Máximo 3 archivos. Formatos: JPG, PNG, PDF, DOC, DOCX. Tamaño máximo: 5MB por archivo.
                  </small>
                </div>

                {/* Lista de archivos adjuntos */}
                {adjuntos.length > 0 && (
                  <div className="attached-files">
                    {adjuntos.map(file => (
                      <div key={file.id} className="attached-file">
                        <div className="file-info">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <div>
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="remove-file-btn"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreview(!preview)}
                disabled={!formData.titulo || !formData.cuerpo}
              >
                {preview ? 'Ocultar vista previa' : 'Vista previa'}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={loading ? 'loading' : ''}
              >
                {loading ? 'Publicando...' : (formData.publicarAhora ? 'Publicar ahora' : 'Programar aviso')}
              </Button>
            </div>
          </form>

          {/* Vista previa */}
          {preview && formData.titulo && formData.cuerpo && (
            <div className="preview-section">
              <h3>Vista previa del aviso</h3>
              <div className="preview-card">
                <div className="preview-header">
                  <span className={`preview-type type-${formData.tipo.toLowerCase()}`}>
                    {tiposAviso.find(t => t.value === formData.tipo)?.label}
                  </span>
                  <span className="preview-segment">
                    Para: {segmentosDestino.find(s => s.value === formData.segmento)?.label}
                  </span>
                </div>
                <h4 className="preview-title">{formData.titulo}</h4>
                <p className="preview-content">{formData.cuerpo}</p>
                {adjuntos.length > 0 && (
                  <div className="preview-attachments">
                    <strong>Adjuntos:</strong>
                    <ul>
                      {adjuntos.map(file => (
                        <li key={file.id}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="preview-footer">
                  <small>
                    {formData.publicarAhora ? 
                      'Se publicará inmediatamente' : 
                      `Programado para: ${formData.fechaProgramada} a las ${formData.horaProgramada}`
                    }
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PublicarAvisos;