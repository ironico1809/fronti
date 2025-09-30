import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class IdentificacionVehiculosPage extends StatefulWidget {
  const IdentificacionVehiculosPage({Key? key}) : super(key: key);

  @override
  State<IdentificacionVehiculosPage> createState() => _IdentificacionVehiculosPageState();
}

class _IdentificacionVehiculosPageState extends State<IdentificacionVehiculosPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _ocrActivo = true;
  
  final List<Map<String, dynamic>> _vehiculosRegistrados = [
    {
      'id': 'VEH001',
      'placa': 'ABC-123',
      'marca': 'Toyota',
      'modelo': 'Camry',
      'color': 'Blanco',
      'departamento': '4A',
      'propietario': 'Juan Pérez',
      'tipo': 'Residente',
      'fechaRegistro': '2024-01-15',
      'ultimoAcceso': '2024-12-28 08:30',
      'activo': true,
    },
    {
      'id': 'VEH002',
      'placa': 'XYZ-789',
      'marca': 'Honda',
      'modelo': 'Civic',
      'color': 'Azul',
      'departamento': '2B',
      'propietario': 'María González',
      'tipo': 'Inquilino',
      'fechaRegistro': '2024-02-10',
      'ultimoAcceso': '2024-12-27 19:45',
      'activo': true,
    },
    {
      'id': 'VEH003',
      'placa': 'DEF-456',
      'marca': 'Ford',
      'modelo': 'Explorer',
      'color': 'Negro',
      'departamento': 'N/A',
      'propietario': 'Visitante',
      'tipo': 'Temporal',
      'fechaRegistro': '2024-12-28',
      'ultimoAcceso': '2024-12-28 14:20',
      'activo': false,
    },
  ];

  final List<Map<String, dynamic>> _deteccionesRecientes = [
    {
      'id': 'DET001',
      'fecha': '2024-12-28 14:30',
      'placa': 'ABC-123',
      'confianza': 98.5,
      'ubicacion': 'Entrada Garage',
      'estado': 'Autorizado',
      'vehiculo': {
        'marca': 'Toyota',
        'modelo': 'Camry',
        'color': 'Blanco',
      },
      'propietario': 'Juan Pérez',
      'departamento': '4A',
    },
    {
      'id': 'DET002',
      'fecha': '2024-12-28 12:15',
      'placa': 'GHI-999',
      'confianza': 85.2,
      'ubicacion': 'Entrada Principal',
      'estado': 'No Registrado',
      'vehiculo': {
        'marca': 'Desconocida',
        'modelo': 'Desconocido',
        'color': 'Rojo',
      },
      'propietario': null,
      'departamento': null,
    },
    {
      'id': 'DET003',
      'fecha': '2024-12-28 10:30',
      'placa': 'XYZ-789',
      'confianza': 92.8,
      'ubicacion': 'Salida Garage',
      'estado': 'Autorizado',
      'vehiculo': {
        'marca': 'Honda',
        'modelo': 'Civic',
        'color': 'Azul',
      },
      'propietario': 'María González',
      'departamento': '2B',
    },
  ];

  final List<Map<String, dynamic>> _estadisticas = [
    {'titulo': 'Vehículos Registrados', 'valor': '12', 'icono': Icons.directions_car, 'color': Colors.blue},
    {'titulo': 'Detecciones Hoy', 'valor': '24', 'icono': Icons.visibility, 'color': Colors.green},
    {'titulo': 'Precisión OCR', 'valor': '94.8%', 'icono': Icons.analytics, 'color': Colors.purple},
    {'titulo': 'No Autorizados', 'valor': '3', 'icono': Icons.warning, 'color': Colors.red},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Identificación de Vehículos'),
        centerTitle: true,
        actions: [
          Switch(
            value: _ocrActivo,
            onChanged: (value) {
              setState(() {
                _ocrActivo = value;
              });
              _toggleOCR(value);
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(icon: Icon(Icons.dashboard), text: 'Dashboard'),
            Tab(icon: Icon(Icons.directions_car), text: 'Mis Vehículos'),
            Tab(icon: Icon(Icons.history), text: 'Detecciones'),
            Tab(icon: Icon(Icons.camera_alt), text: 'Escanear'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildDashboard(),
          _buildMisVehiculos(),
          _buildDetecciones(),
          _buildEscanear(),
        ],
      ),
      floatingActionButton: _tabController.index == 1
          ? FloatingActionButton(
              onPressed: _registrarVehiculo,
              child: const Icon(Icons.add),
            )
          : null,
    );
  }

  Widget _buildDashboard() {
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
                  Icon(
                    _ocrActivo ? Icons.check_circle : Icons.cancel,
                    color: _ocrActivo ? Colors.green : Colors.red,
                    size: 32,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _ocrActivo ? 'Sistema OCR Activo' : 'Sistema OCR Inactivo',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          _ocrActivo 
                              ? 'Identificando placas automáticamente'
                              : 'El reconocimiento está desactivado',
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.5,
            ),
            itemCount: _estadisticas.length,
            itemBuilder: (context, index) {
              final stat = _estadisticas[index];
              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        stat['icono'],
                        size: 32,
                        color: stat['color'],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        stat['valor'],
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: stat['color'],
                        ),
                      ),
                      Text(
                        stat['titulo'],
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 24),
          const Text(
            'Detecciones Recientes',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: ListView.builder(
              itemCount: _deteccionesRecientes.take(3).length,
              itemBuilder: (context, index) {
                return _buildDeteccionCard(_deteccionesRecientes[index], compact: true);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMisVehiculos() {
    final misVehiculos = _vehiculosRegistrados
        .where((v) => v['tipo'] == 'Residente' || v['tipo'] == 'Inquilino')
        .toList();

    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: misVehiculos.length,
      itemBuilder: (context, index) {
        final vehiculo = misVehiculos[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12.0),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: vehiculo['activo'] ? Colors.green : Colors.grey,
              child: const Icon(
                Icons.directions_car,
                color: Colors.white,
              ),
            ),
            title: Text('${vehiculo['marca']} ${vehiculo['modelo']}'),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Placa: ${vehiculo['placa']}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text('Color: ${vehiculo['color']}'),
                Text('Último acceso: ${vehiculo['ultimoAcceso']}'),
              ],
            ),
            trailing: PopupMenuButton(
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'editar',
                  child: Row(
                    children: [
                      Icon(Icons.edit),
                      SizedBox(width: 8),
                      Text('Editar'),
                    ],
                  ),
                ),
                PopupMenuItem(
                  value: vehiculo['activo'] ? 'desactivar' : 'activar',
                  child: Row(
                    children: [
                      Icon(vehiculo['activo'] ? Icons.block : Icons.check_circle),
                      const SizedBox(width: 8),
                      Text(vehiculo['activo'] ? 'Desactivar' : 'Activar'),
                    ],
                  ),
                ),
                const PopupMenuItem(
                  value: 'historial',
                  child: Row(
                    children: [
                      Icon(Icons.history),
                      SizedBox(width: 8),
                      Text('Ver Historial'),
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
              onSelected: (value) => _handleVehiculoAction(value, vehiculo),
            ),
            onTap: () => _verDetallesVehiculo(vehiculo),
          ),
        );
      },
    );
  }

  Widget _buildDetecciones() {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: _deteccionesRecientes.length,
      itemBuilder: (context, index) {
        return _buildDeteccionCard(_deteccionesRecientes[index]);
      },
    );
  }

  Widget _buildDeteccionCard(Map<String, dynamic> deteccion, {bool compact = false}) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getEstadoColor(deteccion['estado']),
          child: Icon(
            _getEstadoIcon(deteccion['estado']),
            color: Colors.white,
          ),
        ),
        title: Text(
          'Placa: ${deteccion['placa']}',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!compact) ...[
              Text('${deteccion['vehiculo']['marca']} ${deteccion['vehiculo']['modelo']}'),
              Text('Color: ${deteccion['vehiculo']['color']}'),
            ],
            Text('${deteccion['ubicacion']} • ${deteccion['fecha']}'),
            if (deteccion['propietario'] != null)
              Text('Propietario: ${deteccion['propietario']} (${deteccion['departamento']})'),
            Text('Confianza: ${deteccion['confianza'].toStringAsFixed(1)}%'),
          ],
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: _getEstadoColor(deteccion['estado']),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            deteccion['estado'],
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        onTap: () => _verDetallesDeteccion(deteccion),
      ),
    );
  }

  Widget _buildEscanear() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: double.infinity,
            height: 300,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey, width: 2),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.camera_alt,
                  size: 80,
                  color: Colors.grey[600],
                ),
                const SizedBox(height: 16),
                Text(
                  'Vista de Cámara',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Posiciona la placa del vehículo aquí',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          if (_ocrActivo) ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                border: Border.all(color: Colors.green),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Row(
                children: [
                  Icon(Icons.check_circle, color: Colors.green),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Sistema OCR activo - Escaneando automáticamente',
                      style: TextStyle(color: Colors.green),
                    ),
                  ),
                ],
              ),
            ),
          ] else ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.orange.shade50,
                border: Border.all(color: Colors.orange),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Row(
                children: [
                  Icon(Icons.warning, color: Colors.orange),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Sistema OCR desactivado - Actívalo para escanear',
                      style: TextStyle(color: Colors.orange),
                    ),
                  ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _escanearManual,
                  icon: const Icon(Icons.document_scanner),
                  label: const Text('Escanear Manual'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _tomarFoto,
                  icon: const Icon(Icons.camera_alt),
                  label: const Text('Tomar Foto'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: _ingresarPlacaManual,
              icon: const Icon(Icons.keyboard),
              label: const Text('Ingresar Placa Manualmente'),
            ),
          ),
        ],
      ),
    );
  }

  Color _getEstadoColor(String estado) {
    switch (estado) {
      case 'Autorizado':
        return Colors.green;
      case 'No Registrado':
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
      case 'No Registrado':
        return Icons.close;
      case 'Pendiente':
        return Icons.hourglass_empty;
      default:
        return Icons.help;
    }
  }

  void _toggleOCR(bool activo) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          activo 
              ? 'Sistema OCR activado - Escaneando placas automáticamente'
              : 'Sistema OCR desactivado',
        ),
        backgroundColor: activo ? Colors.green : Colors.orange,
      ),
    );
  }

  void _registrarVehiculo() {
    final GlobalKey<FormState> formKey = GlobalKey<FormState>();
    final TextEditingController placaController = TextEditingController();
    final TextEditingController marcaController = TextEditingController();
    final TextEditingController modeloController = TextEditingController();
    final TextEditingController colorController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: Container(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Registrar Nuevo Vehículo',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: placaController,
                  decoration: const InputDecoration(
                    labelText: 'Placa',
                    border: OutlineInputBorder(),
                    hintText: 'ABC-123',
                  ),
                  textCapitalization: TextCapitalization.characters,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Por favor ingresa la placa';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: marcaController,
                  decoration: const InputDecoration(
                    labelText: 'Marca',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Por favor ingresa la marca';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: modeloController,
                  decoration: const InputDecoration(
                    labelText: 'Modelo',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Por favor ingresa el modelo';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: colorController,
                  decoration: const InputDecoration(
                    labelText: 'Color',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Por favor ingresa el color';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Cancelar'),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          if (formKey.currentState!.validate()) {
                            Navigator.pop(context);
                            _guardarVehiculo(
                              placaController.text,
                              marcaController.text,
                              modeloController.text,
                              colorController.text,
                            );
                          }
                        },
                        child: const Text('Registrar'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _guardarVehiculo(String placa, String marca, String modelo, String color) {
    final nuevoVehiculo = {
      'id': 'VEH${(_vehiculosRegistrados.length + 1).toString().padLeft(3, '0')}',
      'placa': placa.toUpperCase(),
      'marca': marca,
      'modelo': modelo,
      'color': color,
      'departamento': '4A', // Simulado
      'propietario': 'Juan Pérez', // Simulado
      'tipo': 'Residente',
      'fechaRegistro': DateTime.now().toString().substring(0, 10),
      'ultimoAcceso': 'N/A',
      'activo': true,
    };

    setState(() {
      _vehiculosRegistrados.add(nuevoVehiculo);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Vehículo registrado exitosamente')),
    );
  }

  void _handleVehiculoAction(String action, Map<String, dynamic> vehiculo) {
    switch (action) {
      case 'editar':
        _editarVehiculo(vehiculo);
        break;
      case 'activar':
      case 'desactivar':
        _toggleVehiculo(vehiculo);
        break;
      case 'historial':
        _verHistorialVehiculo(vehiculo);
        break;
      case 'eliminar':
        _eliminarVehiculo(vehiculo);
        break;
    }
  }

  void _editarVehiculo(Map<String, dynamic> vehiculo) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Editando ${vehiculo['marca']} ${vehiculo['modelo']}')),
    );
  }

  void _toggleVehiculo(Map<String, dynamic> vehiculo) {
    setState(() {
      vehiculo['activo'] = !vehiculo['activo'];
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Vehículo ${vehiculo['placa']} ${vehiculo['activo'] ? 'activado' : 'desactivado'}',
        ),
      ),
    );
  }

  void _verHistorialVehiculo(Map<String, dynamic> vehiculo) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Mostrando historial de ${vehiculo['placa']}')),
    );
  }

  void _eliminarVehiculo(Map<String, dynamic> vehiculo) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar Vehículo'),
        content: Text('¿Estás seguro de eliminar el vehículo ${vehiculo['placa']}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _vehiculosRegistrados.remove(vehiculo);
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Vehículo ${vehiculo['placa']} eliminado')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
  }

  void _verDetallesVehiculo(Map<String, dynamic> vehiculo) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Detalles del Vehículo',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            _buildDetalleRow('Placa:', vehiculo['placa']),
            _buildDetalleRow('Marca:', vehiculo['marca']),
            _buildDetalleRow('Modelo:', vehiculo['modelo']),
            _buildDetalleRow('Color:', vehiculo['color']),
            _buildDetalleRow('Propietario:', vehiculo['propietario']),
            _buildDetalleRow('Departamento:', vehiculo['departamento']),
            _buildDetalleRow('Tipo:', vehiculo['tipo']),
            _buildDetalleRow('Fecha Registro:', vehiculo['fechaRegistro']),
            _buildDetalleRow('Último Acceso:', vehiculo['ultimoAcceso']),
            _buildDetalleRow('Estado:', vehiculo['activo'] ? 'Activo' : 'Inactivo'),
          ],
        ),
      ),
    );
  }

  void _verDetallesDeteccion(Map<String, dynamic> deteccion) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Detalles de Detección',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              height: 150,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey),
              ),
              child: const Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.image, size: 60, color: Colors.grey),
                  Text('Imagen capturada'),
                  Text('(No disponible)', style: TextStyle(fontSize: 12)),
                ],
              ),
            ),
            const SizedBox(height: 16),
            _buildDetalleRow('ID:', deteccion['id']),
            _buildDetalleRow('Placa:', deteccion['placa']),
            _buildDetalleRow('Fecha:', deteccion['fecha']),
            _buildDetalleRow('Ubicación:', deteccion['ubicacion']),
            _buildDetalleRow('Estado:', deteccion['estado']),
            _buildDetalleRow('Confianza:', '${deteccion['confianza'].toStringAsFixed(1)}%'),
            if (deteccion['propietario'] != null) ...[
              _buildDetalleRow('Propietario:', deteccion['propietario']),
              _buildDetalleRow('Departamento:', deteccion['departamento']),
            ],
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

  void _escanearManual() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const AlertDialog(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Escaneando placa...'),
            SizedBox(height: 8),
            Text('Procesando imagen con OCR', style: TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );

    Future.delayed(const Duration(seconds: 3), () {
      Navigator.pop(context);
      _mostrarResultadoEscaneo('ABC-123', 94.2);
    });
  }

  void _tomarFoto() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Abriendo cámara para capturar placa...')),
    );
  }

  void _ingresarPlacaManual() {
    final TextEditingController placaController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Ingresar Placa'),
        content: TextField(
          controller: placaController,
          decoration: const InputDecoration(
            labelText: 'Número de Placa',
            hintText: 'ABC-123',
            border: OutlineInputBorder(),
          ),
          textCapitalization: TextCapitalization.characters,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              if (placaController.text.isNotEmpty) {
                Navigator.pop(context);
                _procesarPlaca(placaController.text.toUpperCase());
              }
            },
            child: const Text('Buscar'),
          ),
        ],
      ),
    );
  }

  void _mostrarResultadoEscaneo(String placa, double confianza) {
    final vehiculoEncontrado = _vehiculosRegistrados
        .where((v) => v['placa'] == placa)
        .firstOrNull;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Resultado del Escaneo'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              vehiculoEncontrado != null ? Icons.check_circle : Icons.warning,
              color: vehiculoEncontrado != null ? Colors.green : Colors.orange,
              size: 64,
            ),
            const SizedBox(height: 16),
            Text(
              'Placa detectada: $placa',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            Text('Confianza: ${confianza.toStringAsFixed(1)}%'),
            const SizedBox(height: 8),
            if (vehiculoEncontrado != null) ...[
              const Text('✓ Vehículo registrado'),
              Text('Propietario: ${vehiculoEncontrado['propietario']}'),
              Text('Departamento: ${vehiculoEncontrado['departamento']}'),
            ] else ...[
              const Text('⚠ Vehículo no registrado'),
              const Text('Se requiere autorización manual'),
            ],
          ],
        ),
        actions: [
          if (vehiculoEncontrado == null)
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                _registrarVehiculoTemporal(placa);
              },
              child: const Text('Registrar Temporal'),
            ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Aceptar'),
          ),
        ],
      ),
    );
  }

  void _procesarPlaca(String placa) {
    _mostrarResultadoEscaneo(placa, 100.0);
  }

  void _registrarVehiculoTemporal(String placa) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Registro Temporal'),
        content: Text('¿Deseas registrar temporalmente el vehículo $placa?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Vehículo $placa registrado temporalmente')),
              );
            },
            child: const Text('Registrar'),
          ),
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