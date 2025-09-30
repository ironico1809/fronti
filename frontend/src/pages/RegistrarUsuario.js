
import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import Card from '../components/Card';
import LinkButton from '../components/LinkButton';
import { Link } from 'react-router-dom';
import './RegistrarUsuario.css';
import { registrarUsuario } from '../services/api';

const RegistrarUsuario = () => {
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    password: '',
    password2: '',
    acepta: false,
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nombre || !form.telefono || !form.email || !form.password || !form.password2 || !form.acepta) {
      setError('Por favor, completa todos los campos y acepta los términos.');
      return;
    }
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    setError('');
    // Llamar al backend
    const datos = {
      nombre_completo: form.nombre,
      correo: form.email,
      contrasena: form.password,
      telefono: form.telefono
    };
    try {
      const respuesta = await registrarUsuario(datos);
      if (respuesta.id) {
        alert('¡Registro exitoso!');
      } else if (respuesta.detail) {
        setError(respuesta.detail);
      } else {
        setError('Error al registrar usuario.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <div className="register-header">
          <div className="register-title">Crear Cuenta</div>
          <div className="register-subtitle">Únete a Smart Condominium</div>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          {error && <div className="register-error">{error}</div>}
          <div className="register-row">
            <Input
              label="Nombre Completo *"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{color: 'var(--main-accent)'}}><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="2"/></svg>}
            />
            <Input
              label="Teléfono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+591 12345678"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{color: 'var(--main-accent)'}}><rect x="4" y="2" width="16" height="20" rx="4" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>}
            />
          </div>
          <Input
            label="Correo Electrónico *"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="usuario@ejemplo.com"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{color: 'var(--main-accent)'}}><rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          />
          <div className="register-row">
            <Input
              label="Contraseña *"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{color: 'var(--main-accent)'}}><rect x="5" y="10" width="14" height="8" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
              rightElement={<span style={{color: 'var(--grey-medium)', fontSize: '0.95em'}}>&#9432;</span>}
            />
            <Input
              label="Confirmar Contraseña *"
              name="password2"
              type="password"
              value={form.password2}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{color: 'var(--main-accent)'}}><rect x="5" y="10" width="14" height="8" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
              rightElement={<span style={{color: 'var(--grey-medium)', fontSize: '0.95em'}}>&#9432;</span>}
            />
          </div>
          <div className="register-hint">Introduce una contraseña</div>
          <div className="register-terms">
            <Checkbox
              label={<span>Acepto los <a href="#" style={{color: 'var(--main-accent)', textDecoration: 'underline'}}>Términos y Condiciones</a> y la <a href="#" style={{color: 'var(--main-accent)', textDecoration: 'underline'}}>Política de Privacidad</a> de Smart Condominium. Entiendo que mis datos serán utilizados para la gestión del condominio y servicios de IA.</span>}
              checked={form.acepta}
              onChange={handleChange}
              name="acepta"
            />
          </div>
          <Button type="submit" className="register-btn">CREAR CUENTA</Button>
        </form>
        <div className="register-footer">Registro Seguro</div>
        <div className="register-login">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/" style={{color: 'var(--main-accent)', fontWeight: 600, textDecoration: 'underline'}}>Iniciar Sesión</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegistrarUsuario;
