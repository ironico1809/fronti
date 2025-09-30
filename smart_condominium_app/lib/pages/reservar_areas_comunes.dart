import 'package:flutter/material.dart';

class ReservarAreasComunesPage extends StatefulWidget {
  const ReservarAreasComunesPage({Key? key}) : super(key: key);

  @override
  State<ReservarAreasComunesPage> createState() => _ReservarAreasComunesPageState();
}

class _ReservarAreasComunesPageState extends State<ReservarAreasComunesPage> {
  final List<Map<String, dynamic>> _areasComunes = [
    {
      'nombre': 'Salón de Fiestas',
      'capacidad': '50 personas',
      'precio': 100.0,
      'disponible': true,
      'icono': Icons.celebration,
    },
    {
      'nombre': 'Piscina',
      'capacidad': '30 personas',
      'precio': 50.0,
      'disponible': true,
      'icono': Icons.pool,
    },
    {
      'nombre': 'Quincho',
      'capacidad': '20 personas',
      'precio': 75.0,
      'disponible': false,
      'icono': Icons.outdoor_grill,
    },
    {
      'nombre': 'Cancha de Tenis',
      'capacidad': '4 personas',
      'precio': 30.0,
      'disponible': true,
      'icono': Icons.sports_tennis,
    },
  ];

  DateTime _fechaSeleccionada = DateTime.now();
  TimeOfDay _horaInicio = const TimeOfDay(hour: 10, minute: 0);
  TimeOfDay _horaFin = const TimeOfDay(hour: 14, minute: 0);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reservar Áreas Comunes'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Áreas Disponibles',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: _areasComunes.length,
                itemBuilder: (context, index) {
                  final area = _areasComunes[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: area['disponible'] ? Colors.green : Colors.grey,
                        child: Icon(
                          area['icono'],
                          color: Colors.white,
                        ),
                      ),
                      title: Text(area['nombre']),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Capacidad: ${area['capacidad']}'),
                          Text(
                            area['disponible'] ? 'Disponible' : 'No disponible',
                            style: TextStyle(
                              color: area['disponible'] ? Colors.green : Colors.red,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      trailing: Text(
                        '\$${area['precio'].toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      onTap: area['disponible'] ? () => _mostrarFormularioReserva(area) : null,
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _mostrarFormularioReserva(Map<String, dynamic> area) {
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
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Reservar ${area['nombre']}',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: const Icon(Icons.calendar_today),
                title: const Text('Fecha'),
                subtitle: Text(
                  '${_fechaSeleccionada.day}/${_fechaSeleccionada.month}/${_fechaSeleccionada.year}',
                ),
                onTap: _seleccionarFecha,
              ),
              ListTile(
                leading: const Icon(Icons.access_time),
                title: const Text('Hora de inicio'),
                subtitle: Text(_horaInicio.format(context)),
                onTap: () => _seleccionarHora(true),
              ),
              ListTile(
                leading: const Icon(Icons.access_time_filled),
                title: const Text('Hora de fin'),
                subtitle: Text(_horaFin.format(context)),
                onTap: () => _seleccionarHora(false),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Total:',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    '\$${area['precio'].toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.green,
                    ),
                  ),
                ],
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
                      onPressed: () => _confirmarReserva(area),
                      child: const Text('Reservar'),
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

  void _seleccionarFecha() async {
    final DateTime? fecha = await showDatePicker(
      context: context,
      initialDate: _fechaSeleccionada,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 90)),
    );
    if (fecha != null) {
      setState(() {
        _fechaSeleccionada = fecha;
      });
    }
  }

  void _seleccionarHora(bool esInicio) async {
    final TimeOfDay? hora = await showTimePicker(
      context: context,
      initialTime: esInicio ? _horaInicio : _horaFin,
    );
    if (hora != null) {
      setState(() {
        if (esInicio) {
          _horaInicio = hora;
        } else {
          _horaFin = hora;
        }
      });
    }
  }

  void _confirmarReserva(Map<String, dynamic> area) {
    Navigator.pop(context); // Cerrar bottom sheet
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirmar Reserva'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Área: ${area['nombre']}'),
            Text('Fecha: ${_fechaSeleccionada.day}/${_fechaSeleccionada.month}/${_fechaSeleccionada.year}'),
            Text('Horario: ${_horaInicio.format(context)} - ${_horaFin.format(context)}'),
            Text('Precio: \$${area['precio'].toStringAsFixed(2)}'),
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
              _mostrarExitoReserva();
            },
            child: const Text('Confirmar'),
          ),
        ],
      ),
    );
  }

  void _mostrarExitoReserva() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('¡Reserva Confirmada!'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.check_circle,
              color: Colors.green,
              size: 64,
            ),
            SizedBox(height: 16),
            Text('Tu reserva ha sido confirmada exitosamente.'),
            Text('Recibirás una notificación con los detalles.'),
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
}