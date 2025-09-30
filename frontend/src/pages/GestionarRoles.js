import React, { useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import './GestionarRoles.css';
import { obtenerUsuarios, obtenerRoles, obtenerPermisos, obtenerUsuarioRoles, obtenerRolPermisos, crearUsuarioRol, editarUsuarioRol, crearRolPermiso, editarRolPermiso } from '../services/api';

const GestionarRoles = () => {
  const [filtro, setFiltro] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [permisosList, setPermisosList] = useState([]);
  const [usuarioRoles, setUsuarioRoles] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [rol, setRol] = useState('');
  const [permisosBase, setPermisosBase] = useState('');
  const [permisosTotales, setPermisosTotales] = useState('');
  const [overrides, setOverrides] = useState([]);

  React.useEffect(() => {
    obtenerUsuarios().then(data => setUsuarios(Array.isArray(data) ? data : []));
    obtenerRoles().then(data => setRolesList(Array.isArray(data) ? data : []));
    obtenerPermisos().then(data => setPermisosList(Array.isArray(data) ? data : []));
    obtenerUsuarioRoles().then(data => setUsuarioRoles(Array.isArray(data) ? data : []));
  }, []);

  React.useEffect(() => {
    if (usuarios.length > 0 && !seleccionado) {
      setSeleccionado(usuarios[0]);
      setRol(usuarios[0]?.rol || '');
    }
  }, [usuarios]);

  // Mapea el rol actual de cada usuario
  const usuariosConRol = useMemo(() => {
    return usuarios.map(u => {
      const ur = usuarioRoles.find(ur => ur.usuario === u.id);
      const rolObj = ur ? rolesList.find(r => r.id === ur.rol) : null;
      return { ...u, rolNombre: rolObj ? rolObj.nombre : '' };
    });
  }, [usuarios, usuarioRoles, rolesList]);

  const lista = useMemo(() => {
    return usuariosConRol.filter(u =>
      `${u.nombre_completo || u.nombre} ${u.correo}`.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [usuariosConRol, filtro]);

  const toggleOverride = (key) => {
    setOverrides(arr => arr.includes(key) ? arr.filter(k => k !== key) : [...arr, key]);
  };

  const guardar = async () => {
    if (!seleccionado || !rol) {
      alert('Selecciona un usuario y un rol');
      return;
    }
    // Buscar el ID real del rol
    const rolObj = rolesList.find(r => r.nombre === rol);
    if (!rolObj) {
      alert('Rol no válido');
      return;
    }
    try {
      await crearUsuarioRol({ usuario: seleccionado.id, rol: rolObj.id });
      alert('Rol asignado correctamente');
    } catch (e) {
      alert('Error al asignar rol');
    }
    // Aquí podrías guardar overrides de permisos si tienes endpoint para ello
  };

  // Actualiza permisos base cuando cambia el rol
  React.useEffect(() => {
    if (!rol || !permisosList.length) { setPermisosBase(''); return; }
    // Busca los permisos base del rol seleccionado usando el ID del rol
    obtenerRolPermisos().then(data => {
      const rolObj = rolesList.find(r => r.nombre === rol);
      if (!rolObj) { setPermisosBase('—'); return; }
      const permisosRol = Array.isArray(data) ? data.filter(rp => rp.rol === rolObj.id) : [];
      const nombres = permisosRol.map(rp => {
        const p = permisosList.find(p => p.id === rp.permiso);
        return p ? p.descripcion || p.nombre : '';
      }).filter(Boolean);
      setPermisosBase(nombres.length ? nombres.join(', ') : '—');
    });
  }, [rol, permisosList]);

  React.useEffect(() => {
    // Permisos totales = base + overrides
    let baseArr = permisosBase ? permisosBase.split(',').map(x => x.trim()) : [];
    let overridesArr = overrides.map(key => {
      const p = permisosList.find(p => p.nombre === key);
      return p ? p.descripcion || p.nombre : key;
    });
    let todos = baseArr.concat(overridesArr).filter((v, i, a) => a.indexOf(v) === i);
    setPermisosTotales(todos.length ? todos.join(', ') : '—');
  }, [permisosBase, overrides, permisosList]);

  return (
    <DashboardLayout>
      <div className="roles-container">
        <div className="roles-card">
          <div className="page-header">
            <h1>Gestionar Roles y Permisos</h1>
            <p className="roles-subtitle">Selecciona un usuario, asigna un rol y ajusta permisos adicionales si es necesario.</p>
          </div>

          <div className="roles-grid">
            <section className="roles-panel users-list">
              <h2>Usuarios</h2>
              <p className="panel-subtitle">Buscar y seleccionar</p>
              <Input placeholder="Buscar por nombre o correo" value={filtro} onChange={e => setFiltro(e.target.value)} />
              <div className="users-scroll">
                {lista.map(u => (
                  <div
                    key={u.id}
                    className={`user-item${seleccionado?.id === u.id ? ' selected' : ''}`}
                    onClick={() => { setSeleccionado(u); setRol(u.rolNombre || ''); setOverrides([]); }}
                  >
                    <div className="user-name">{u.nombre_completo || u.nombre}</div>
                    <div className="user-email">{u.correo}</div>
                    <div className="user-role">Rol: {u.rolNombre || ''}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="roles-panel assignment">
              <h2>Asignación</h2>
              <div className="two-cols">
                <div>
                  <label className="field-label">Usuario seleccionado:</label>
                  <div className="pill">{seleccionado?.nombre_completo || seleccionado?.nombre || '—'}</div>
                </div>
                <div>
                  <label className="field-label">Permisos base del rol</label>
                  <div className="pill">{permisosBase}</div>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Rol</label>
                <select className="select" value={rol} onChange={e => setRol(e.target.value)}>
                  {rolesList.map(r => <option key={r.id} value={r.nombre}>{r.nombre}</option>)}
                </select>
                <p className="hint">Permisos efectivos = Permisos del rol + Permisos adicionales asignados al usuario (overrides).</p>
              </div>

              <div className="field">
                <label className="field-label">Permisos totales asignados</label>
                <div className="pill">{permisosTotales}</div>
              </div>

              <div className="permissions-grid">
                {permisosList.map(p => (
                  <div className="perm-item" key={p.id}>
                    <Checkbox
                      checked={overrides.includes(p.nombre)}
                      onChange={() => toggleOverride(p.nombre)}
                      label={<span className="perm-label">{p.descripcion || p.nombre}</span>}
                    />
                  </div>
                ))}
              </div>

              <div className="actions-row">
                <Button className="outline" onClick={() => { setRol(seleccionado?.rol || ''); setOverrides([]); }}>Cancelar</Button>
                <Button onClick={guardar}>Guardar cambios</Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GestionarRoles;
