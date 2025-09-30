import 'package:flutter/material.dart';

class ReconocimientoFacialPage extends StatefulWidget {
  const ReconocimientoFacialPage({Key? key}) : super(key: key);

  @override
  State<ReconocimientoFacialPage> createState() => _ReconocimientoFacialPageState();
}

class _ReconocimientoFacialPageState extends State<ReconocimientoFacialPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _reconocimientoActivo = true;
  
  final List<Map<String, dynamic>> _rostrosRegistrados = [
    {
      'id': 'RF001',
      'nombre': 'Juan Pérez',
      'departamento': '4A',
      'tipo': 'Propietario',
      'fechaRegistro': '2024-01-15',
      'ultimoAcceso': '2024-12-28 08:30',
      'activo': true,
    },
    {
      'id': 'RF002',
      'nombre': 'María González',
      'departamento': '4A',
      'tipo': 'Familiar',
      'fechaRegistro': '2024-01-15',
      'ultimoAcceso': '2024-12-27 19:45',
      'activo': true,
    },
    {
      'id': 'RF003',
      'nombre': 'Pedro Martínez',
      'departamento': '2B',
      'tipo': 'Inquilino',
      'fechaRegistro': '2024-03-20',
      'ultimoAcceso': '2024-12-28 07:15',
      'activo': false,
    },
  ];

  final List<Map<String, dynamic>> _historialAccesos = [
    {
      'fecha': '2024-12-28 08:30',
      'nombre': 'Juan Pérez',
      'departamento': '4A',
      'puerta': 'Entrada Principal',
      'estado': 'Autorizado',
      'confianza': 98.5,
    },
    {
      'fecha': '2024-12-28 07:45',
      'nombre': 'Visitante Desconocido',
      'departamento': 'N/A',
      'puerta': 'Entrada Principal',
      'estado': 'Denegado',
      'confianza': 0.0,
    },
    {
      'fecha': '2024-12-27 19:45',
      'nombre': 'María González',
      'departamento': '4A',
      'puerta': 'Entrada Garage',
      'estado': 'Autorizado',
      'confianza': 95.2,
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reconocimiento Facial'),
        centerTitle: true,
        actions: [
          Switch(
            value: _reconocimientoActivo,
            onChanged: (value) {
              setState(() {
                _reconocimientoActivo = value;
              });
              _toggleReconocimiento(value);
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(icon: Icon(Icons.face), text: 'Mi Perfil'),
            Tab(icon: Icon(Icons.group), text: 'Registrados'),
            Tab(icon: Icon(Icons.history), text: 'Accesos'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildMiPerfil(),
          _buildRostrosRegistrados(),
          _buildHistorialAccesos(),
        ],
      ),
      floatingActionButton: _tabController.index == 1
          ? FloatingActionButton(
              onPressed: _registrarNuevoRostro,
              child: const Icon(Icons.add),
            )
          : null,
    );
  }

  Widget _buildMiPerfil() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.grey[300],
                      border: Border.all(color: Colors.blue, width: 3),
                    ),
                    child: const Icon(
                      Icons.person,
                      size: 50,
                      color: Colors.blue,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Juan Pérez',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Text('Departamento 4A'),
                        const Text('Propietario'),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(
                              Icons.verified,
                              color: Colors.green,
                              size: 16,
                            ),
                            const SizedBox(width: 4),
                            const Text(
                              'Verificado',
                              style: TextStyle(
                                color: Colors.green,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Estado del Sistema',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Row(
                    children: [
                      Icon(
                        _reconocimientoActivo ? Icons.check_circle : Icons.cancel,
                        color: _reconocimientoActivo ? Colors.green : Colors.red,
                        size: 32,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _reconocimientoActivo ? 'Sistema Activo' : 'Sistema Inactivo',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              _reconocimientoActivo 
                                  ? 'El reconocimiento facial está funcionando'
                                  : 'El sistema está desactivado temporalmente',
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(
                        children: [
                          const Text(
                            '98.5%',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.green,
                            ),
                          ),
                          const Text('Precisión'),
                        ],
                      ),
                      Column(
                        children: [
                          const Text(
                            '156',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue,
                            ),
                          ),
                          const Text('Accesos'),
                        ],
                      ),
                      Column(
                        children: [
                          const Text(
                            '3',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.orange,
                            ),
                          ),
                          const Text('Rostros'),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _actualizarRostro,
              icon: const Icon(Icons.camera_alt),
              label: const Text('Actualizar Mi Rostro'),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: _probarReconocimiento,
              icon: const Icon(Icons.face_retouching_natural),
              label: const Text('Probar Reconocimiento'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRostrosRegistrados() {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: _rostrosRegistrados.length,
      itemBuilder: (context, index) {
        final rostro = _rostrosRegistrados[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12.0),
          child: ListTile(
            leading: Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: rostro['activo'] ? Colors.green : Colors.grey,
              ),
              child: const Icon(
                Icons.person,
                color: Colors.white,
              ),
            ),
            title: Text(rostro['nombre']),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${rostro['tipo']} - ${rostro['departamento']}'),
                Text('Registrado: ${rostro['fechaRegistro']}'),
                Text('Último acceso: ${rostro['ultimoAcceso']}'),
              ],
            ),
            trailing: PopupMenuButton(
              itemBuilder: (context) => [
                PopupMenuItem(
                  value: 'editar',
                  child: Row(
                    children: [
                      const Icon(Icons.edit),
                      const SizedBox(width: 8),
                      const Text('Editar'),
                    ],
                  ),
                ),
                PopupMenuItem(
                  value: rostro['activo'] ? 'desactivar' : 'activar',
                  child: Row(
                    children: [
                      Icon(rostro['activo'] ? Icons.block : Icons.check_circle),
                      const SizedBox(width: 8),
                      Text(rostro['activo'] ? 'Desactivar' : 'Activar'),
                    ],
                  ),
                ),
                const PopupMenuItem(
                  value: 'eliminar',
                  child: Row(
                    children: [
                      Icon(Icons.delete, color: Colors.red),
                      SizedBox(width: 8),
                      Text('Eliminar', style: TextStyle(color: Colors.red)),
                    ],
                  ),
                ),
              ],
              onSelected: (value) => _handleRostroAction(value, rostro),
            ),
            onTap: () => _verDetallesRostro(rostro),
          ),
        );
      },
    );
  }

  Widget _buildHistorialAccesos() {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: _historialAccesos.length,
      itemBuilder: (context, index) {
        final acceso = _historialAccesos[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12.0),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: _getEstadoColor(acceso['estado']),
              child: Icon(
                _getEstadoIcon(acceso['estado']),
                color: Colors.white,
              ),
            ),
            title: Text(acceso['nombre']),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${acceso['puerta']} - ${acceso['departamento']}'),
                Text(acceso['fecha']),
                if (acceso['confianza'] > 0)
                  Text('Confianza: ${acceso['confianza'].toStringAsFixed(1)}%'),
              ],
            ),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: _getEstadoColor(acceso['estado']),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                acceso['estado'],
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Color _getEstadoColor(String estado) {
    switch (estado) {
      case 'Autorizado':
        return Colors.green;
      case 'Denegado':
        return Colors.red;
      case 'Pendiente':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  IconData _getEstadoIcon(String estado) {
    switch (estado) {
      case 'Autorizado':
        return Icons.check;
      case 'Denegado':
        return Icons.close;
      case 'Pendiente':
        return Icons.hourglass_empty;
      default:
        return Icons.help;
    }
  }

  void _toggleReconocimiento(bool activo) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          activo 
              ? 'Sistema de reconocimiento facial activado'
              : 'Sistema de reconocimiento facial desactivado',
        ),
        backgroundColor: activo ? Colors.green : Colors.orange,
      ),
    );
  }

  void _registrarNuevoRostro() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: Container(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Registrar Nuevo Rostro',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              const TextField(
                decoration: InputDecoration(
                  labelText: 'Nombre Completo',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              const TextField(
                decoration: InputDecoration(
                  labelText: 'Departamento',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(
                  labelText: 'Tipo',
                  border: OutlineInputBorder(),
                ),
                items: const [
                  DropdownMenuItem(value: 'Propietario', child: Text('Propietario')),
                  DropdownMenuItem(value: 'Inquilino', child: Text('Inquilino')),
                  DropdownMenuItem(value: 'Familiar', child: Text('Familiar')),
                  DropdownMenuItem(value: 'Empleado', child: Text('Empleado')),
                ],
                onChanged: (value) {},
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        _tomarFoto();
                      },
                      icon: const Icon(Icons.camera_alt),
                      label: const Text('Tomar Foto'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        _seleccionarFoto();
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
      ),
    );
  }

  void _tomarFoto() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Abriendo cámara para capturar rostro...')),
    );
  }

  void _seleccionarFoto() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Seleccionando foto de galería...')),
    );
  }

  void _actualizarRostro() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Actualizar Rostro'),
        content: const Text('¿Deseas tomar una nueva foto para actualizar tu perfil facial?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _tomarFoto();
            },
            child: const Text('Tomar Foto'),
          ),
        ],
      ),
    );
  }

  void _probarReconocimiento() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const AlertDialog(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Probando reconocimiento facial...'),
            SizedBox(height: 8),
            Text('Mira a la cámara frontal', style: TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );

    Future.delayed(const Duration(seconds: 3), () {
      Navigator.pop(context);
      _mostrarResultadoPrueba();
    });
  }

  void _mostrarResultadoPrueba() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Resultado de la Prueba'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.check_circle, color: Colors.green, size: 64),
            SizedBox(height: 16),
            Text('¡Reconocimiento Exitoso!'),
            SizedBox(height: 8),
            Text('Confianza: 98.5%'),
            SizedBox(height: 8),
            Text('Tu rostro fue identificado correctamente'),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Aceptar'),
          ),
        ],
      ),
    );
  }

  void _handleRostroAction(String action, Map<String, dynamic> rostro) {
    switch (action) {
      case 'editar':
        _editarRostro(rostro);
        break;
      case 'activar':
      case 'desactivar':
        _toggleRostro(rostro);
        break;
      case 'eliminar':
        _eliminarRostro(rostro);
        break;
    }
  }

  void _editarRostro(Map<String, dynamic> rostro) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Editando rostro de ${rostro['nombre']}')),
    );
  }

  void _toggleRostro(Map<String, dynamic> rostro) {
    setState(() {
      rostro['activo'] = !rostro['activo'];
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          '${rostro['nombre']} ${rostro['activo'] ? 'activado' : 'desactivado'}',
        ),
      ),
    );
  }

  void _eliminarRostro(Map<String, dynamic> rostro) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar Rostro'),
        content: Text('¿Estás seguro de eliminar el rostro de ${rostro['nombre']}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _rostrosRegistrados.remove(rostro);
              });
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
  }

  void _verDetallesRostro(Map<String, dynamic> rostro) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Detalles de ${rostro['nombre']}',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildDetalleRow('ID:', rostro['id']),
            _buildDetalleRow('Departamento:', rostro['departamento']),
            _buildDetalleRow('Tipo:', rostro['tipo']),
            _buildDetalleRow('Fecha de Registro:', rostro['fechaRegistro']),
            _buildDetalleRow('Último Acceso:', rostro['ultimoAcceso']),
            _buildDetalleRow('Estado:', rostro['activo'] ? 'Activo' : 'Inactivo'),
          ],
        ),
      ),
    );
  }

  Widget _buildDetalleRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          SizedBox(
            width: 120,
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

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }
}