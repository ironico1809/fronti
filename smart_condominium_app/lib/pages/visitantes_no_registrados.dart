import 'package:flutter/material.dart';

class VisitantesNoRegistradosPage extends StatefulWidget {
  const VisitantesNoRegistradosPage({Key? key}) : super(key: key);

  @override
  State<VisitantesNoRegistradosPage> createState() => _VisitantesNoRegistradosPageState();
}

class _VisitantesNoRegistradosPageState extends State<VisitantesNoRegistradosPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  final List<Map<String, dynamic>> _visitantesDetectados = [
    {
      'id': 'VIS001',
      'fecha': '2024-12-28 14:30',
      'ubicacion': 'Entrada Principal',
      'estado': 'Pendiente',
      'descripcion': 'Hombre, aprox. 30 años, camisa azul',
      'confianza': 0.0,
      'imagen': null,
      'accion': null,
    },
    {
      'id': 'VIS002',
      'fecha': '2024-12-28 10:15',
      'ubicacion': 'Garage',
      'estado': 'Autorizado',
      'descripcion': 'Mujer, aprox. 25 años, vestido rojo',
      'confianza': 0.0,
      'imagen': null,
      'accion': 'Autorizado por Residente 4A',
    },
    {
      'id': 'VIS003',
      'fecha': '2024-12-27 18:45',
      'ubicacion': 'Entrada Principal',
      'estado': 'Denegado',
      'descripcion': 'Hombre, aprox. 40 años, gorra negra',
      'confianza': 0.0,
      'imagen': null,
      'accion': 'Acceso denegado automáticamente',
    },
    {
      'id': 'VIS004',
      'fecha': '2024-12-27 16:20',
      'ubicacion': 'Puerta Lateral',
      'estado': 'Esperando',
      'descripcion': 'Delivery - Uniform azul',
      'confianza': 0.0,
      'imagen': null,
      'accion': 'En espera de autorización',
    },
  ];

  final List<Map<String, dynamic>> _alertasSeguridad = [
    {
      'id': 'ALT001',
      'tipo': 'Intento de Acceso No Autorizado',
      'fecha': '2024-12-28 02:15',
      'ubicacion': 'Entrada Garage',
      'prioridad': 'Alta',
      'descripcion': 'Persona no identificada intentó forzar la entrada',
      'estado': 'Investigando',
    },
    {
      'id': 'ALT002',
      'tipo': 'Visitante Sospechoso',
      'fecha': '2024-12-27 22:30',
      'ubicacion': 'Entrada Principal',
      'prioridad': 'Media',
      'descripción': 'Persona merodeando cerca de la entrada por más de 10 minutos',
      'estado': 'Resuelto',
    },
    {
      'id': 'ALT003',
      'tipo': 'Acceso Fuera de Horario',
      'fecha': '2024-12-27 01:45',
      'ubicacion': 'Puerta Lateral',
      'prioridad': 'Baja',
      'descripcion': 'Intento de acceso fuera del horario permitido',
      'estado': 'Archivado',
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
        title: const Text('Visitantes No Registrados'),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: _configurarDeteccion,
            icon: const Icon(Icons.settings),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(
              text: 'Detectados (${_visitantesDetectados.where((v) => v['estado'] == 'Pendiente').length})',
            ),
            const Tab(text: 'Historial'),
            Tab(
              text: 'Alertas (${_alertasSeguridad.where((a) => a['estado'] != 'Archivado').length})',
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildVisitantesPendientes(),
          _buildHistorialVisitantes(),
          _buildAlertasSeguridad(),
        ],
      ),
    );
  }

  Widget _buildVisitantesPendientes() {
    final visitantesPendientes = _visitantesDetectados
        .where((v) => v['estado'] == 'Pendiente' || v['estado'] == 'Esperando')
        .toList();

    if (visitantesPendientes.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.security, size: 80, color: Colors.green),
            SizedBox(height: 16),
            Text(
              'No hay visitantes pendientes',
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            Text(
              'Todas las detecciones han sido procesadas',
              style: TextStyle(fontSize: 14, color: Colors.grey),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: visitantesPendientes.length,
      itemBuilder: (context, index) {
        return _buildVisitanteCard(visitantesPendientes[index], showActions: true);
      },
    );
  }

  Widget _buildHistorialVisitantes() {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: _visitantesDetectados.length,
      itemBuilder: (context, index) {
        return _buildVisitanteCard(_visitantesDetectados[index], showActions: false);
      },
    );
  }

  Widget _buildAlertasSeguridad() {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: _alertasSeguridad.length,
      itemBuilder: (context, index) {
        return _buildAlertaCard(_alertasSeguridad[index]);
      },
    );
  }

  Widget _buildVisitanteCard(Map<String, dynamic> visitante, {required bool showActions}) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      child: Column(
        children: [
          ListTile(
            leading: CircleAvatar(
              backgroundColor: _getEstadoColor(visitante['estado']),
              child: Icon(
                _getEstadoIcon(visitante['estado']),
                color: Colors.white,
              ),
            ),
            title: Text('Visitante ${visitante['id']}'),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${visitante['ubicacion']} • ${visitante['fecha']}'),
                Text(visitante['descripcion']),
                if (visitante['accion'] != null)
                  Text(
                    visitante['accion'],
                    style: const TextStyle(
                      fontStyle: FontStyle.italic,
                      color: Colors.blue,
                    ),
                  ),
              ],
            ),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: _getEstadoColor(visitante['estado']),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                visitante['estado'],
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            onTap: () => _verDetallesVisitante(visitante),
          ),
          if (showActions && (visitante['estado'] == 'Pendiente' || visitante['estado'] == 'Esperando'))
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _denegarAcceso(visitante),
                      icon: const Icon(Icons.close, color: Colors.red),
                      label: const Text('Denegar', style: TextStyle(color: Colors.red)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => _autorizarAcceso(visitante),
                      icon: const Icon(Icons.check),
                      label: const Text('Autorizar'),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildAlertaCard(Map<String, dynamic> alerta) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getPrioridadColor(alerta['prioridad']),
          child: Icon(
            _getPrioridadIcon(alerta['prioridad']),
            color: Colors.white,
          ),
        ),
        title: Text(alerta['tipo']),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${alerta['ubicacion']} • ${alerta['fecha']}'),
            Text(alerta['descripcion']),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: _getPrioridadColor(alerta['prioridad']),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                alerta['prioridad'].toUpperCase(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              alerta['estado'],
              style: const TextStyle(fontSize: 12),
            ),
          ],
        ),
        onTap: () => _verDetallesAlerta(alerta),
      ),
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
      case 'Esperando':
        return Colors.blue;
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
      case 'Esperando':
        return Icons.access_time;
      default:
        return Icons.help;
    }
  }

  Color _getPrioridadColor(String prioridad) {
    switch (prioridad) {
      case 'Alta':
        return Colors.red;
      case 'Media':
        return Colors.orange;
      case 'Baja':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  IconData _getPrioridadIcon(String prioridad) {
    switch (prioridad) {
      case 'Alta':
        return Icons.warning;
      case 'Media':
        return Icons.info;
      case 'Baja':
        return Icons.check_circle;
      default:
        return Icons.help;
    }
  }

  void _autorizarAcceso(Map<String, dynamic> visitante) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Autorizar Acceso'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('¿Deseas autorizar el acceso al visitante ${visitante['id']}?'),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(
                labelText: 'Motivo de la visita (opcional)',
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                visitante['estado'] = 'Autorizado';
                visitante['accion'] = 'Autorizado manualmente por residente';
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Acceso autorizado exitosamente')),
              );
            },
            child: const Text('Autorizar'),
          ),
        ],
      ),
    );
  }

  void _denegarAcceso(Map<String, dynamic> visitante) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Denegar Acceso'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('¿Deseas denegar el acceso al visitante ${visitante['id']}?'),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(
                labelText: 'Motivo de la denegación',
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                visitante['estado'] = 'Denegado';
                visitante['accion'] = 'Acceso denegado por residente';
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Acceso denegado'),
                  backgroundColor: Colors.red,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Denegar'),
          ),
        ],
      ),
    );
  }

  void _verDetallesVisitante(Map<String, dynamic> visitante) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        maxChildSize: 0.9,
        minChildSize: 0.5,
        builder: (context, scrollController) => Container(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Detalles del Visitante',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 24),
              Container(
                width: double.infinity,
                height: 200,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey),
                ),
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.person, size: 80, color: Colors.grey),
                    Text('Imagen de seguridad'),
                    Text('(No disponible)', style: TextStyle(fontSize: 12)),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              _buildDetalleRow('ID:', visitante['id']),
              _buildDetalleRow('Fecha y Hora:', visitante['fecha']),
              _buildDetalleRow('Ubicación:', visitante['ubicacion']),
              _buildDetalleRow('Estado:', visitante['estado']),
              _buildDetalleRow('Descripción:', visitante['descripcion']),
              if (visitante['accion'] != null)
                _buildDetalleRow('Acción:', visitante['accion']),
              const SizedBox(height: 24),
              if (visitante['estado'] == 'Pendiente')
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          _denegarAcceso(visitante);
                        },
                        child: const Text('Denegar'),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          _autorizarAcceso(visitante);
                        },
                        child: const Text('Autorizar'),
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

  void _verDetallesAlerta(Map<String, dynamic> alerta) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Detalle de Alerta',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            _buildDetalleRow('ID:', alerta['id']),
            _buildDetalleRow('Tipo:', alerta['tipo']),
            _buildDetalleRow('Fecha:', alerta['fecha']),
            _buildDetalleRow('Ubicación:', alerta['ubicacion']),
            _buildDetalleRow('Prioridad:', alerta['prioridad']),
            _buildDetalleRow('Estado:', alerta['estado']),
            _buildDetalleRow('Descripción:', alerta['descripcion']),
            const SizedBox(height: 24),
            if (alerta['estado'] != 'Archivado')
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    _marcarComoResuelto(alerta);
                  },
                  child: const Text('Marcar como Resuelto'),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetalleRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
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

  void _marcarComoResuelto(Map<String, dynamic> alerta) {
    setState(() {
      alerta['estado'] = 'Resuelto';
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Alerta marcada como resuelta')),
    );
  }

  void _configurarDeteccion() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Configuración de Detección',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            SwitchListTile(
              title: const Text('Detección Automática'),
              subtitle: const Text('Detectar visitantes no registrados automáticamente'),
              value: true,
              onChanged: (value) {},
            ),
            SwitchListTile(
              title: const Text('Alertas en Tiempo Real'),
              subtitle: const Text('Recibir notificaciones inmediatas'),
              value: true,
              onChanged: (value) {},
            ),
            SwitchListTile(
              title: const Text('Grabación de Video'),
              subtitle: const Text('Grabar video cuando se detecte un visitante'),
              value: false,
              onChanged: (value) {},
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Guardar Configuración'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }
}