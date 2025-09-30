import React, { useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import './GestionarUsuarios.css';
import { obtenerUsuarios, registrarUsuario, editarUsuario, eliminarUsuario, obtenerRoles, crearUsuarioRol } from '../services/api';

// roles se llenará dinámicamente desde la API
const estados = ['Todos','Activo','Inactivo'];

const GestionarUsuarios = () => {
  const [busqueda, setBusqueda] = useState('');
  const [rol, setRol] = useState('Todos');
  const [estado, setEstado] = useState('Todos');
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre_completo: '', correo: '', contrasena: '', telefono: '', estado: 'ACTIVO', rol: 'Propietario' });
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesList, setRolesList] = useState([]);
  const [asignarRolUser, setAsignarRolUser] = useState(null);
  const [asignarRolId, setAsignarRolId] = useState('');
  const [asignarRolLoading, setAsignarRolLoading] = useState(false);
  // Cargar roles desde la API
  React.useEffect(() => {
    obtenerRoles().then(data => setRolesList(Array.isArray(data) ? data : []));
  }, []);

  React.useEffect(() => {
    setLoading(true);
    obtenerUsuarios().then(data => {
      setUsuarios(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const filtrados = useMemo(() => {
    return usuarios.filter(u =>
      (busqueda === '' || `${u.nombre_completo} ${u.correo}`.toLowerCase().includes(busqueda.toLowerCase())) &&
      (estado === 'Todos' || (u.estado?.toUpperCase() === estado.toUpperCase()))
    );
  }, [usuarios, busqueda, estado]);

  const limpiar = () => { setBusqueda(''); setRol('Todos'); setEstado('Todos'); };

  const openNew = () => {
    setEditing(null);
    setForm({ nombre_completo: '', correo: '', contrasena: '', telefono: '', estado: 'ACTIVO', rol: 'Propietario' });
    setOpenModal(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ nombre_completo: u.nombre_completo, correo: u.correo, contrasena: '', telefono: u.telefono || '', estado: u.estado?.toUpperCase() === 'ACTIVO' ? 'ACTIVO' : 'INACTIVO', rol: 'Propietario' });
    setOpenModal(true);
  };

  const saveUser = async (e) => {
    e.preventDefault();
    if (!form.nombre_completo || !form.correo) { alert('Nombre y correo son obligatorios'); return; }
    if (!editing && !form.contrasena) { alert('La contraseña es obligatoria'); return; }
    setOpenModal(false);
    if (editing) {
      await editarUsuario(editing.id, form);
      alert('Usuario actualizado');
    } else {
      await registrarUsuario(form);
      alert('Usuario creado');
    }
    // Refrescar lista
    setLoading(true);
    obtenerUsuarios().then(data => {
      setUsuarios(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  const deleteUser = async (u) => {
    if (window.confirm(`¿Eliminar usuario ${u.nombre_completo || u.nombre}?`)) {
      await eliminarUsuario(u.id);
      alert('Usuario eliminado');
      setLoading(true);
      obtenerUsuarios().then(data => {
        setUsuarios(Array.isArray(data) ? data : []);
        setLoading(false);
      });
    }
  };

  const renderEstado = (e) => {
    const variant = e === 'Activo' ? 'success' : e === 'Inactivo' ? 'danger' : 'neutral';
    return <Badge variant={variant} label={e} />;
  };

  return (
    <DashboardLayout>
      <div className="page-container">
          <div className="users-card">
            <div className="page-header">
              <div>
                <h1>Gestión de Usuarios</h1>
                <p>Administra alta, consulta, edición y baja de usuarios del sistema.</p>
              </div>
              <Button className="outline" onClick={openNew}>
                + Nuevo usuario
              </Button>
            </div>

            <div className="filters-row">
              <Input
                placeholder="Buscar por nombre o correo"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                rightElement={busqueda && <span onClick={() => setBusqueda('')}>✖</span>}
              />
              <select className="select-filter" value={rol} onChange={e => setRol(e.target.value)}>
                <option value="Todos">Filtrar por rol</option>
                {rolesList.map(r => <option key={r.id} value={r.nombre}>{r.nombre}</option>)}
              </select>
              <select className="select-filter" value={estado} onChange={e => setEstado(e.target.value)}>
                {estados.map(s => <option key={s} value={s}>Filtrar por estado {s !== 'Todos' ? `: ${s}` : ''}</option>)}
              </select>
              <Button onClick={limpiar}>Limpiar</Button>
            </div>

            <div className="table">
              <div className="thead">
                <div>ID</div>
                <div>Nombre</div>
                <div>Correo</div>
                <div>Teléfono</div>
                <div>Estado</div>
                <div>Acciones</div>
              </div>
              {filtrados.map(u => (
                <div className="trow" key={u.id}>
                  <div>{u.id}</div>
                  <div>{u.nombre_completo}</div>
                  <div>{u.correo}</div>
                  <div>{u.telefono}</div>
                  <div>{renderEstado(u.estado)}</div>
                  <div className="actions">
                    <Button className="outline" onClick={() => openEdit(u)}>Editar</Button>
                    <Button className="danger" onClick={() => deleteUser(u)}>Eliminar</Button>
                    <Button onClick={() => { setAsignarRolUser(u); setAsignarRolId(''); }}>Asignar rol</Button>
                  </div>
                </div>
              ))}
      {/* Modal para asignar rol */}
      <Modal open={!!asignarRolUser} title={asignarRolUser ? `Asignar rol a ${asignarRolUser.nombre_completo}` : ''} onClose={() => setAsignarRolUser(null)}>
        {asignarRolUser && (
          <form onSubmit={async e => {
            e.preventDefault();
            if (!asignarRolId) { alert('Selecciona un rol'); return; }
            setAsignarRolLoading(true);
            try {
              await crearUsuarioRol({ usuario: asignarRolUser.id, rol: asignarRolId });
              alert('Rol asignado correctamente');
              setAsignarRolUser(null);
            } catch (err) {
              alert('Error al asignar rol');
            }
            setAsignarRolLoading(false);
          }}>
            <div className="field">
              <label>Rol</label>
              <select value={asignarRolId} onChange={e => setAsignarRolId(e.target.value)} required>
                <option value="">Selecciona un rol</option>
                {rolesList.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <Button className="outline" type="button" onClick={() => setAsignarRolUser(null)}>Cancelar</Button>
              <Button type="submit" disabled={asignarRolLoading}>{asignarRolLoading ? 'Asignando...' : 'Asignar rol'}</Button>
            </div>
          </form>
        )}
      </Modal>
            </div>
          </div>
          <Modal open={openModal} title={editing ? 'Editar usuario' : 'Nuevo usuario'} onClose={() => setOpenModal(false)}>
            <form onSubmit={saveUser}>
              <div className="form-grid">
                <div className="field full">
                  <label>Nombre completo</label>
                  <input value={form.nombre_completo} onChange={e=>setForm({...form, nombre_completo: e.target.value})} placeholder="Juan Pérez" />
                </div>
                <div className="field">
                  <label>Correo</label>
                  <input type="email" value={form.correo} onChange={e=>setForm({...form, correo: e.target.value})} placeholder="correo@ejemplo.com" />
                </div>
                <div className="field">
                  <label>Teléfono</label>
                  <input value={form.telefono} onChange={e=>setForm({...form, telefono: e.target.value})} placeholder="+59170000000" />
                </div>
                {!editing && (
                  <div className="field full">
                    <label>Contraseña</label>
                    <input type="password" value={form.contrasena} onChange={e=>setForm({...form, contrasena: e.target.value})} placeholder="••••••••" />
                  </div>
                )}
                <div className="field">
                  <label>Estado</label>
                  <select value={form.estado} onChange={e=>setForm({...form, estado: e.target.value})}>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
                </div>
                <div className="field">
                  <label>Rol</label>
                  <select value={form.rol} onChange={e=>setForm({...form, rol: e.target.value})}>
                    <option>Administrador</option>
                    <option>Propietario</option>
                    <option>Inquilino</option>
                    <option>Personal</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <Button className="outline" type="button" onClick={() => setOpenModal(false)}>Cancelar</Button>
                <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
              </div>
            </form>
          </Modal>
      </div>
    </DashboardLayout>
  );
};

export default GestionarUsuarios;

