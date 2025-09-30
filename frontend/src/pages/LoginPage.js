

import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import LinkButton from '../components/LinkButton';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import './LoginPage.css';
import { loginUsuario } from '../services/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setError('');
    const respuesta = await loginUsuario({ correo: email, contrasena: password });
    if (respuesta.access) {
      localStorage.setItem('token', respuesta.access);
      navigate('/dashboard');
    } else if (respuesta.detail) {
      setError(respuesta.detail);
    } else {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="login-container">
      <Card>
        <div className="login-header" style={{flexDirection: 'column', alignItems: 'center', gap: '0.5em'}}>
              <div className="login-icon" style={{marginBottom: '0.4em'}}>
                <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" style={{width: '220px', height: '220px', objectFit: 'contain', borderRadius: '32px'}} />
              </div>
              <div className="login-subtitle" style={{
                marginTop: '1.2em',
                marginBottom: '0.4em',
                fontSize: '1em',
                textAlign: 'center',
                color: 'var(--grey-light)',
                fontWeight: 500,
                letterSpacing: '0.01em',
                lineHeight: 1.2
              }}>
                Acceso seguro para residentes y administración
              </div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block', color: 'var(--main-accent)'}}>
                <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <Input
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block', color: 'var(--main-accent)'}}>
                <rect x="5" y="10" width="14" height="8" rx="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
            rightElement={
              <span
                className="show-password"
                onClick={() => setShowPassword(v => !v)}
                style={{userSelect: 'none', display: 'flex', alignItems: 'center', gap: '0.3em', cursor: 'pointer'}}
              >
                {showPassword ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block', color: 'var(--main-accent)'}}>
                    <path d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block', color: 'var(--main-accent)'}}>
                    <path d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2"/>
                    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </span>
            }
          />
          <div className="login-options">
            <Checkbox
              label="Recuérdame"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <Link to="/recuperar-contrasena" className="forgot-link" style={{color: 'var(--main-accent)', textDecoration: 'underline', fontWeight: 500}}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Button type="submit" className="login-btn">Ingresar</Button>
          <div style={{textAlign: 'center', marginTop: '1em', color: 'var(--grey-medium)', fontSize: '1em'}}>
            ¿No tienes cuenta?{' '}
            <Link to="/registrar" className="register-link" style={{color: 'var(--main-accent)', fontWeight: 600, textDecoration: 'underline'}}>
              Regístrate
            </Link>
          </div>
        </form>
        <div className="login-footer">Acceso con IA y seguridad reforzada del condominio</div>
      </Card>
      <div className="login-copyright">
        © 2025 SmartCondo — Seguridad • Finanzas • Comunidad
      </div>
    </div>
  );
};

export default LoginPage;
