import 'package:flutter/material.dart';

class NotificacionesAutomaticasPage extends StatefulWidget {
  const NotificacionesAutomaticasPage({Key? key}) : super(key: key);

  @override
  State<NotificacionesAutomaticasPage> createState() => _NotificacionesAutomaticasPageState();
}

class _NotificacionesAutomaticasPageState extends State<NotificacionesAutomaticasPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  final List<Map<String, dynamic>> _notificaciones = [
    {
      'titulo': 'Expensas Vencidas',
      'mensaje': 'Tienes expensas pendientes por \$150.00',
      'fecha': '2024-12-28 14:30',
      'tipo': 'financiero',
      'leida': false,
      'prioridad': 'alta',
    },
    {
      'titulo': 'Mantenimiento de Ascensores',
      'mensaje': 'El ascensor A estará fuera de servicio mañana de 9:00 a 15:00',
      'fecha': '2024-12-27 08:15',
      'tipo': 'mantenimiento',
      'leida': true,
      'prioridad': 'media',
    },
    {
      'titulo': 'Visitante en Recepción',
      'mensaje': 'Un visitante pregunta por ti en recepción',
      'fecha': '2024-12-27 16:45',
      'tipo': 'seguridad',
      'leida': false,
      'prioridad': 'alta',
    },
    {
      'titulo': 'Reserva Confirmada',
      'mensaje': 'Tu reserva del salón de fiestas para el 30/12 está confirmada',
      'fecha': '2024-12-26 10:20',
      'tipo': 'reservas',
      'leida': true,
      'prioridad': 'baja',
    },
    {
      'titulo': 'Corte de Agua Programado',
      'mensaje': 'Habrá corte de agua el 29/12 de 10:00 a 14:00 por mantenimiento',
      'fecha': '2024-12-25 12:00',
      'tipo': 'avisos',
      'leida': true,
      'prioridad': 'media',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notificaciones'),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: _marcarTodasComoLeidas,
            icon: const Icon(Icons.mark_email_read),
          ),
          PopupMenuButton(
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'configurar',
                child: Row(
                  children: [
                    Icon(Icons.settings),
                    SizedBox(width: 8),
                    Text('Configurar'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'limpiar',
                child: Row(
                  children: [
                    Icon(Icons.clear_all),
                    SizedBox(width: 8),
                    Text('Limpiar todo'),
                  ],
                ),
              ),
            ],
            onSelected: _handleMenuSelection,
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(
              text: 'No leídas (${_notificaciones.where((n) => !n['leida']).length})',
            ),
            const Tab(text: 'Todas'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildNotificacionesList(false), // No leídas
          _buildNotificacionesList(true),  // Todas
        ],
      ),
    );
  }

  Widget _buildNotificacionesList(bool mostrarTodas) {
    List<Map<String, dynamic>> notificacionesFiltradas;
    
    if (mostrarTodas) {
      notificacionesFiltradas = _notificaciones;
    } else {
      notificacionesFiltradas = _notificaciones.where((n) => !n['leida']).toList();
    }

    if (notificacionesFiltradas.isEmpty) {
      return _buildEmptyState(mostrarTodas);
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: notificacionesFiltradas.length,
      itemBuilder: (context, index) {
        return _buildNotificacionCard(notificacionesFiltradas[index]);
      },
    );
  }

  Widget _buildNotificacionCard(Map<String, dynamic> notificacion) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      elevation: notificacion['leida'] ? 1 : 3,
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getTipoColor(notificacion['tipo']),
          child: Icon(
            _getTipoIcon(notificacion['tipo']),
            color: Colors.white,
          ),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                notificacion['titulo'],
                style: TextStyle(
                  fontWeight: notificacion['leida'] ? FontWeight.normal : FontWeight.bold,
                ),
              ),
            ),
            if (!notificacion['leida'])
              Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: Colors.blue,
                  shape: BoxShape.circle,
                ),
              ),
            const SizedBox(width: 4),
            _buildPrioridadBadge(notificacion['prioridad']),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              notificacion['mensaje'],
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              notificacion['fecha'],
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
        onTap: () => _abrirNotificacion(notificacion),
        onLongPress: () => _mostrarOpcionesNotificacion(notificacion),
      ),
    );
  }

  Widget _buildPrioridadBadge(String prioridad) {
    Color color;
    switch (prioridad) {
      case 'alta':
        color = Colors.red;
        break;
      case 'media':
        color = Colors.orange;
        break;
      case 'baja':
        color = Colors.green;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        prioridad.toUpperCase(),
        style: const TextStyle(
          color: Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildEmptyState(bool esTodas) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            esTodas ? Icons.notifications_off : Icons.notifications_active,
            size: 80,
            color: Colors.grey,
          ),
          const SizedBox(height: 16),
          Text(
            esTodas ? 'No hay notificaciones' : 'No tienes notificaciones sin leer',
            style: const TextStyle(
              fontSize: 18,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            esTodas 
                ? 'Las notificaciones aparecerán aquí cuando lleguen'
                : '¡Genial! Estás al día con todas las notificaciones',
            style: const TextStyle(
              fontSize: 14,
              color: Colors.grey,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Color _getTipoColor(String tipo) {
    switch (tipo) {
      case 'financiero':
        return Colors.green;
      case 'mantenimiento':
        return Colors.orange;
      case 'seguridad':
        return Colors.red;
      case 'reservas':
        return Colors.blue;
      case 'avisos':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  IconData _getTipoIcon(String tipo) {
    switch (tipo) {
      case 'financiero':
        return Icons.attach_money;
      case 'mantenimiento':
        return Icons.build;
      case 'seguridad':
        return Icons.security;
      case 'reservas':
        return Icons.event;
      case 'avisos':
        return Icons.announcement;
      default:
        return Icons.notifications;
    }
  }

  void _abrirNotificacion(Map<String, dynamic> notificacion) {
    setState(() {
      notificacion['leida'] = true;
    });

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        maxChildSize: 0.9,
        minChildSize: 0.4,
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
              Row(
                children: [
                  CircleAvatar(
                    backgroundColor: _getTipoColor(notificacion['tipo']),
                    child: Icon(
                      _getTipoIcon(notificacion['tipo']),
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          notificacion['titulo'],
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          notificacion['fecha'],
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  _buildPrioridadBadge(notificacion['prioridad']),
                ],
              ),
              const SizedBox(height: 24),
              Text(
                notificacion['mensaje'],
                style: const TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        _eliminarNotificacion(notificacion);
                      },
                      icon: const Icon(Icons.delete),
                      label: const Text('Eliminar'),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        _accionarNotificacion(notificacion);
                      },
                      icon: const Icon(Icons.open_in_new),
                      label: const Text('Ver más'),
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

  void _mostrarOpcionesNotificacion(Map<String, dynamic> notificacion) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: Icon(
                notificacion['leida'] ? Icons.mark_as_unread : Icons.mark_email_read,
              ),
              title: Text(
                notificacion['leida'] ? 'Marcar como no leída' : 'Marcar como leída',
              ),
              onTap: () {
                Navigator.pop(context);
                setState(() {
                  notificacion['leida'] = !notificacion['leida'];
                });
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete),
              title: const Text('Eliminar notificación'),
              onTap: () {
                Navigator.pop(context);
                _eliminarNotificacion(notificacion);
              },
            ),
            ListTile(
              leading: const Icon(Icons.share),
              title: const Text('Compartir notificación'),
              onTap: () {
                Navigator.pop(context);
                _compartirNotificacion(notificacion);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _marcarTodasComoLeidas() {
    setState(() {
      for (var notificacion in _notificaciones) {
        notificacion['leida'] = true;
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Todas las notificaciones marcadas como leídas')),
    );
  }

  void _handleMenuSelection(String value) {
    switch (value) {
      case 'configurar':
        _configurarNotificaciones();
        break;
      case 'limpiar':
        _limpiarNotificaciones();
        break;
    }
  }

  void _configurarNotificaciones() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const ConfiguracionNotificacionesPage(),
      ),
    );
  }

  void _limpiarNotificaciones() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Limpiar Notificaciones'),
        content: const Text('¿Estás seguro de que deseas eliminar todas las notificaciones?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _notificaciones.clear();
              });
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Eliminar Todo'),
          ),
        ],
      ),
    );
  }

  void _eliminarNotificacion(Map<String, dynamic> notificacion) {
    setState(() {
      _notificaciones.remove(notificacion);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Notificación eliminada')),
    );
  }

  void _compartirNotificacion(Map<String, dynamic> notificacion) {
    // Implementar compartir
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Compartiendo notificación...')),
    );
  }

  void _accionarNotificacion(Map<String, dynamic> notificacion) {
    // Navegar según el tipo de notificación
    switch (notificacion['tipo']) {
      case 'financiero':
        // Navegar a pagos
        break;
      case 'reservas':
        // Navegar a reservas
        break;
      case 'seguridad':
        // Navegar a seguridad
        break;
      default:
        break;
    }
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Abriendo ${notificacion['tipo']}...')),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }
}

class ConfiguracionNotificacionesPage extends StatefulWidget {
  const ConfiguracionNotificacionesPage({Key? key}) : super(key: key);

  @override
  State<ConfiguracionNotificacionesPage> createState() => _ConfiguracionNotificacionesPageState();
}

class _ConfiguracionNotificacionesPageState extends State<ConfiguracionNotificacionesPage> {
  bool _notificacionesPush = true;
  bool _notificacionesEmail = true;
  bool _notificacionesSMS = false;
  bool _notificacionesFinancieras = true;
  bool _notificacionesMantenimiento = true;
  bool _notificacionesSeguridad = true;
  bool _notificacionesReservas = true;
  bool _notificacionesAvisos = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Configurar Notificaciones'),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          const Text(
            'Métodos de Notificación',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          SwitchListTile(
            title: const Text('Notificaciones Push'),
            subtitle: const Text('Recibir notificaciones en el dispositivo'),
            value: _notificacionesPush,
            onChanged: (value) {
              setState(() {
                _notificacionesPush = value;
              });
            },
          ),
          SwitchListTile(
            title: const Text('Notificaciones por Email'),
            subtitle: const Text('Recibir notificaciones por correo electrónico'),
            value: _notificacionesEmail,
            onChanged: (value) {
              setState(() {
                _notificacionesEmail = value;
              });
            },
          ),
          SwitchListTile(
            title: const Text('Notificaciones SMS'),
            subtitle: const Text('Recibir notificaciones por mensaje de texto'),
            value: _notificacionesSMS,
            onChanged: (value) {
              setState(() {
                _notificacionesSMS = value;
              });
            },
          ),
          const Divider(height: 32),
          const Text(
            'Tipos de Notificación',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          SwitchListTile(
            title: const Text('Financieras'),
            subtitle: const Text('Expensas, pagos, multas'),
            value: _notificacionesFinancieras,
            onChanged: (value) {
              setState(() {
                _notificacionesFinancieras = value;
              });
            },
          ),
          SwitchListTile(
            title: const Text('Mantenimiento'),
            subtitle: const Text('Avisos de mantenimiento y reparaciones'),
            value: _notificacionesMantenimiento,
            onChanged: (value) {
              setState(() {
                _notificacionesMantenimiento = value;
              });
            },
          ),
          SwitchListTile(
            title: const Text('Seguridad'),
            subtitle: const Text('Visitantes, accesos, alertas'),
            value: _notificacionesSeguridad,
            onChanged: (value) {
              setState(() {
                _notificacionesSeguridad = value;
              });
            },
          ),
          SwitchListTile(
            title: const Text('Reservas'),
            subtitle: const Text('Confirmaciones y recordatorios de reservas'),
            value: _notificacionesReservas,
            onChanged: (value) {
              setState(() {
                _notificacionesReservas = value;
              });
            },
          ),
          SwitchListTile(
            title: const Text('Avisos Generales'),
            subtitle: const Text('Comunicados del consorcio'),
            value: _notificacionesAvisos,
            onChanged: (value) {
              setState(() {
                _notificacionesAvisos = value;
              });
            },
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _guardarConfiguracion,
              child: const Text('Guardar Configuración'),
            ),
          ),
        ],
      ),
    );
  }

  void _guardarConfiguracion() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Configuración guardada correctamente')),
    );
    Navigator.pop(context);
  }
}