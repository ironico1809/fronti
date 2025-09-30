// Archivo eliminado

import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import './RecuperarContrasena.css';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }
    // Aquí iría la llamada real al backend
    setMensaje('Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.');
    setEmail('');
  };

  return (
    <div className="recuperar-bg">
      <Card className="recuperar-card">
        <div className="recuperar-header">
          <span className="recuperar-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{color: 'var(--main-accent)'}}><rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <div className="recuperar-title">¿Olvidaste tu contraseña?</div>
          <div className="recuperar-subtitle">Te enviaremos instrucciones a tu correo electrónico registrado.</div>
        </div>
        <form className="recuperar-form" onSubmit={handleSubmit}>
          {error && <div className="recuperar-error">{error}</div>}
          {mensaje && <div className="recuperar-mensaje">{mensaje}</div>}
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{color: 'var(--main-accent)'}}><rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          />
          <Button type="submit" className="recuperar-btn">Enviar instrucciones</Button>
        </form>
        <div className="recuperar-footer">
          <Link to="/" className="recuperar-volver">&larr; Volver al inicio de sesión</Link>
        </div>
      </Card>
      <div className="recuperar-copyright">
        © 2025 SmartCondo — Seguridad • Finanzas • Comunidad
      </div>
    </div>
  );
};

export default RecuperarContrasena;
