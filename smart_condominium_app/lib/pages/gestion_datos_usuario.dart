import 'package:flutter/material.dart';

class GestionDatosUsuarioPage extends StatefulWidget {
  const GestionDatosUsuarioPage({Key? key}) : super(key: key);

  @override
  State<GestionDatosUsuarioPage> createState() => _GestionDatosUsuarioPageState();
}

class _GestionDatosUsuarioPageState extends State<GestionDatosUsuarioPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  final _personalFormKey = GlobalKey<FormState>();
  final _contactoFormKey = GlobalKey<FormState>();
  
  // Controladores para datos personales
  final _nombreController = TextEditingController(text: 'Juan Pérez');
  final _dniController = TextEditingController(text: '12.345.678');
  final _fechaNacimientoController = TextEditingController(text: '15/03/1985');
  
  // Controladores para datos de contacto
  final _emailController = TextEditingController(text: 'juan.perez@email.com');
  final _telefonoController = TextEditingController(text: '+54 9 11 1234-5678');
  final _telefonoEmergenciaController = TextEditingController(text: '+54 9 11 8765-4321');
  
  // Controladores para dirección
  final _departamentoController = TextEditingController(text: 'Departamento 4A');
  final _pisoController = TextEditingController(text: '4');
  final _edificioController = TextEditingController(text: 'Torre Norte');

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Datos'),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(icon: Icon(Icons.person), text: 'Personal'),
            Tab(icon: Icon(Icons.contact_phone), text: 'Contacto'),
            Tab(icon: Icon(Icons.home), text: 'Residencia'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildDatosPersonales(),
          _buildDatosContacto(),
          _buildDatosResidencia(),
        ],
      ),
    );
  }

  Widget _buildDatosPersonales() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Form(
        key: _personalFormKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Información Personal',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            Center(
              child: Stack(
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
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: CircleAvatar(
                      radius: 18,
                      backgroundColor: Colors.green,
                      child: IconButton(
                        icon: const Icon(Icons.camera_alt, size: 18, color: Colors.white),
                        onPressed: _cambiarFoto,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            TextFormField(
              controller: _nombreController,
              decoration: const InputDecoration(
                labelText: 'Nombre Completo',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.person),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'El nombre es requerido';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _dniController,
              decoration: const InputDecoration(
                labelText: 'DNI',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.credit_card),
              ),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'El DNI es requerido';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _fechaNacimientoController,
              decoration: const InputDecoration(
                labelText: 'Fecha de Nacimiento',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.calendar_today),
              ),
              onTap: _seleccionarFecha,
              readOnly: true,
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _guardarDatos('personal'),
                child: const Text('Guardar Cambios'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDatosContacto() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Form(
        key: _contactoFormKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Información de Contacto',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            TextFormField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Email Principal',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.email),
              ),
              keyboardType: TextInputType.emailAddress,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'El email es requerido';
                }
                if (!value.contains('@')) {
                  return 'Ingresa un email válido';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _telefonoController,
              decoration: const InputDecoration(
                labelText: 'Teléfono Principal',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.phone),
              ),
              keyboardType: TextInputType.phone,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'El teléfono es requerido';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _telefonoEmergenciaController,
              decoration: const InputDecoration(
                labelText: 'Teléfono de Emergencia',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.local_hospital),
                helperText: 'Contacto en caso de emergencia',
              ),
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 24),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.settings, color: Colors.blue),
                        SizedBox(width: 8),
                        Text(
                          'Preferencias de Notificación',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SwitchListTile(
                      title: const Text('Notificaciones por Email'),
                      subtitle: const Text('Recibir avisos por correo electrónico'),
                      value: true,
                      onChanged: (value) {
                        // Actualizar preferencia
                      },
                    ),
                    SwitchListTile(
                      title: const Text('Notificaciones Push'),
                      subtitle: const Text('Recibir notificaciones en el dispositivo'),
                      value: true,
                      onChanged: (value) {
                        // Actualizar preferencia
                      },
                    ),
                    SwitchListTile(
                      title: const Text('Notificaciones SMS'),
                      subtitle: const Text('Recibir mensajes de texto'),
                      value: false,
                      onChanged: (value) {
                        // Actualizar preferencia
                      },
                    ),
                  ],
                ),
              ),
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _guardarDatos('contacto'),
                child: const Text('Guardar Cambios'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDatosResidencia() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Información de Residencia',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 24),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.home, color: Colors.green, size: 32),
                      SizedBox(width: 12),
                      Text(
                        'Mi Unidad',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildInfoRow('Edificio:', _edificioController.text),
                  _buildInfoRow('Piso:', _pisoController.text),
                  _buildInfoRow('Departamento:', _departamentoController.text),
                  _buildInfoRow('Superficie:', '85 m²'),
                  _buildInfoRow('Cochera:', 'Sí - Cochera N° 12'),
                  _buildInfoRow('Baulera:', 'Sí - Baulera N° 4A'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.people, color: Colors.blue, size: 32),
                      SizedBox(width: 12),
                      Text(
                        'Habitantes Registrados',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildHabitante('Juan Pérez', 'Propietario', true),
                  _buildHabitante('María González', 'Cónyuge', true),
                  _buildHabitante('Pedro Pérez', 'Hijo', false),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _agregarHabitante,
                  icon: const Icon(Icons.person_add),
                  label: const Text('Agregar'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _editarUnidad,
                  icon: const Icon(Icons.edit),
                  label: const Text('Editar'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  Widget _buildHabitante(String nombre, String relacion, bool verificado) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: verificado ? Colors.green : Colors.orange,
        child: Icon(
          verificado ? Icons.verified_user : Icons.person,
          color: Colors.white,
        ),
      ),
      title: Text(nombre),
      subtitle: Text(relacion),
      trailing: verificado
          ? const Icon(Icons.check_circle, color: Colors.green)
          : const Icon(Icons.pending, color: Colors.orange),
    );
  }

  void _cambiarFoto() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Cambiar foto de perfil',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      // Lógica para tomar foto con cámara
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

  void _seleccionarFecha() async {
    final DateTime? fecha = await showDatePicker(
      context: context,
      initialDate: DateTime(1985, 3, 15),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (fecha != null) {
      _fechaNacimientoController.text = '${fecha.day}/${fecha.month}/${fecha.year}';
    }
  }

  void _guardarDatos(String seccion) {
    GlobalKey<FormState>? formKey;
    if (seccion == 'personal') {
      formKey = _personalFormKey;
    } else if (seccion == 'contacto') {
      formKey = _contactoFormKey;
    }

    if (formKey?.currentState?.validate() ?? true) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Datos de $seccion guardados correctamente')),
      );
    }
  }

  void _agregarHabitante() {
    // Navegar a página para agregar habitante
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Funcionalidad para agregar habitante')),
    );
  }

  void _editarUnidad() {
    // Navegar a página para editar datos de unidad
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Funcionalidad para editar unidad')),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    _nombreController.dispose();
    _dniController.dispose();
    _fechaNacimientoController.dispose();
    _emailController.dispose();
    _telefonoController.dispose();
    _telefonoEmergenciaController.dispose();
    _departamentoController.dispose();
    _pisoController.dispose();
    _edificioController.dispose();
    super.dispose();
  }
}