import 'package:flutter/material.dart';

class GestionUsuarioPage extends StatefulWidget {
  const GestionUsuarioPage({Key? key}) : super(key: key);

  @override
  State<GestionUsuarioPage> createState() => _GestionUsuarioPageState();
}

class _GestionUsuarioPageState extends State<GestionUsuarioPage> {
  final _nombreController = TextEditingController(text: 'Juan Pérez');
  final _emailController = TextEditingController(text: 'juan.perez@email.com');
  final _telefonoController = TextEditingController(text: '+54 9 11 1234-5678');
  final _departamentoController = TextEditingController(text: 'Departamento 4A');
  final _formKey = GlobalKey<FormState>();

  bool _editMode = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gestión de Usuario'),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: () {
              setState(() {
                _editMode = !_editMode;
              });
            },
            icon: Icon(_editMode ? Icons.cancel : Icons.edit),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              const CircleAvatar(
                radius: 60,
                backgroundColor: Colors.blue,
                child: Icon(
                  Icons.person,
                  size: 80,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 24),
              TextButton(
                onPressed: _editMode ? _cambiarFotoPerfil : null,
                child: Text(_editMode ? 'Cambiar foto' : ''),
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _nombreController,
                enabled: _editMode,
                decoration: const InputDecoration(
                  labelText: 'Nombre Completo',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor ingresa tu nombre';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                enabled: _editMode,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.email),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor ingresa tu email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _telefonoController,
                enabled: _editMode,
                decoration: const InputDecoration(
                  labelText: 'Teléfono',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.phone),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor ingresa tu teléfono';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _departamentoController,
                enabled: false,
                decoration: const InputDecoration(
                  labelText: 'Departamento',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.home),
                ),
              ),
              const SizedBox(height: 24),
              if (_editMode)
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _cancelarEdicion,
                        child: const Text('Cancelar'),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _guardarCambios,
                        child: const Text('Guardar'),
                      ),
                    ),
                  ],
                ),
              const SizedBox(height: 16),
              ListTile(
                leading: const Icon(Icons.security),
                title: const Text('Cambiar Contraseña'),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: _cambiarContrasena,
              ),
              ListTile(
                leading: const Icon(Icons.notifications),
                title: const Text('Configurar Notificaciones'),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: _configurarNotificaciones,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _cambiarFotoPerfil() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Cambiar foto de perfil',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      // Lógica para tomar foto
                    },
                    icon: const Icon(Icons.camera_alt),
                    label: const Text('Cámara'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      // Lógica para seleccionar de galería
                    },
                    icon: const Icon(Icons.photo_library),
                    label: const Text('Galería'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _cancelarEdicion() {
    setState(() {
      _editMode = false;
      // Restaurar valores originales
      _nombreController.text = 'Juan Pérez';
      _emailController.text = 'juan.perez@email.com';
      _telefonoController.text = '+54 9 11 1234-5678';
    });
  }

  void _guardarCambios() {
    if (_formKey.currentState!.validate()) {
      // Lógica para guardar cambios
      setState(() {
        _editMode = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Datos actualizados correctamente')),
      );
    }
  }

  void _cambiarContrasena() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const CambiarContrasenaPage(),
      ),
    );
  }

  void _configurarNotificaciones() {
    // Navegar a configuración de notificaciones
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Configuración de notificaciones')),
    );
  }

  @override
  void dispose() {
    _nombreController.dispose();
    _emailController.dispose();
    _telefonoController.dispose();
    _departamentoController.dispose();
    super.dispose();
  }
}

class CambiarContrasenaPage extends StatefulWidget {
  const CambiarContrasenaPage({Key? key}) : super(key: key);

  @override
  State<CambiarContrasenaPage> createState() => _CambiarContrasenaPageState();
}

class _CambiarContrasenaPageState extends State<CambiarContrasenaPage> {
  final _actualController = TextEditingController();
  final _nuevaController = TextEditingController();
  final _confirmarController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cambiar Contraseña'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _actualController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Contraseña Actual',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.lock),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Ingresa tu contraseña actual';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _nuevaController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Nueva Contraseña',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.lock_outline),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Ingresa la nueva contraseña';
                  }
                  if (value.length < 6) {
                    return 'La contraseña debe tener al menos 6 caracteres';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _confirmarController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Confirmar Nueva Contraseña',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.lock_outline),
                ),
                validator: (value) {
                  if (value != _nuevaController.text) {
                    return 'Las contraseñas no coinciden';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _cambiarContrasena,
                  child: const Text('Cambiar Contraseña'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _cambiarContrasena() {
    if (_formKey.currentState!.validate()) {
      // Lógica para cambiar contraseña
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Contraseña cambiada exitosamente')),
      );
      Navigator.pop(context);
    }
  }

  @override
  void dispose() {
    _actualController.dispose();
    _nuevaController.dispose();
    _confirmarController.dispose();
    super.dispose();
  }
}