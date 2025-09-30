import 'package:flutter/material.dart';

class ConfirmarPagarReservasPage extends StatefulWidget {
  const ConfirmarPagarReservasPage({Key? key}) : super(key: key);

  @override
  State<ConfirmarPagarReservasPage> createState() => _ConfirmarPagarReservasPageState();
}

class _ConfirmarPagarReservasPageState extends State<ConfirmarPagarReservasPage> {
  final List<Map<String, dynamic>> _reservasPendientes = [
    {
      'id': 'RES-001',
      'area': 'Salón de Fiestas',
      'fecha': '2025-01-15',
      'horaInicio': '18:00',
      'horaFin': '23:00',
      'precio': 100.0,
      'estado': 'Pendiente de Pago',
      'fechaLimite': '2025-01-10',
      'icono': Icons.celebration,
    },
    {
      'id': 'RES-002',
      'area': 'Piscina',
      'fecha': '2025-01-20',
      'horaInicio': '14:00',
      'horaFin': '18:00',
      'precio': 50.0,
      'estado': 'Confirmada',
      'fechaLimite': null,
      'icono': Icons.pool,
    },
    {
      'id': 'RES-003',
      'area': 'Cancha de Tenis',
      'fecha': '2025-01-25',
      'horaInicio': '16:00',
      'horaFin': '18:00',
      'precio': 30.0,
      'estado': 'Pendiente de Confirmación',
      'fechaLimite': '2025-01-12',
      'icono': Icons.sports_tennis,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Reservas'),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: _nuevaReserva,
            icon: const Icon(Icons.add),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildResumenReservas(),
          Expanded(
            child: _reservasPendientes.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.all(16.0),
                    itemCount: _reservasPendientes.length,
                    itemBuilder: (context, index) {
                      return _buildReservaCard(_reservasPendientes[index]);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildResumenReservas() {
    final reservasPendientes = _reservasPendientes.where((r) => r['estado'] == 'Pendiente de Pago').length;
    final reservasConfirmadas = _reservasPendientes.where((r) => r['estado'] == 'Confirmada').length;
    final totalAPagar = _reservasPendientes
        .where((r) => r['estado'] == 'Pendiente de Pago')
        .fold<double>(0.0, (sum, reserva) => sum + reserva['precio']);

    return Container(
      margin: const EdgeInsets.all(16.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Colors.green, Colors.lightGreen],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12.0),
      ),
      child: Column(
        children: [
          const Text(
            'Resumen de Reservas',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Column(
                  children: [
                    const Icon(Icons.pending_actions, color: Colors.white, size: 32),
                    const SizedBox(height: 8),
                    const Text(
                      'Pendientes',
                      style: TextStyle(color: Colors.white70),
                    ),
                    Text(
                      '$reservasPendientes',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(
                height: 60,
                child: VerticalDivider(color: Colors.white30),
              ),
              Expanded(
                child: Column(
                  children: [
                    const Icon(Icons.check_circle, color: Colors.white, size: 32),
                    const SizedBox(height: 8),
                    const Text(
                      'Confirmadas',
                      style: TextStyle(color: Colors.white70),
                    ),
                    Text(
                      '$reservasConfirmadas',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(
                height: 60,
                child: VerticalDivider(color: Colors.white30),
              ),
              Expanded(
                child: Column(
                  children: [
                    const Icon(Icons.attach_money, color: Colors.white, size: 32),
                    const SizedBox(height: 8),
                    const Text(
                      'A Pagar',
                      style: TextStyle(color: Colors.white70),
                    ),
                    Text(
                      '\$${totalAPagar.toStringAsFixed(0)}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildReservaCard(Map<String, dynamic> reserva) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      child: Column(
        children: [
          ListTile(
            leading: CircleAvatar(
              backgroundColor: _getEstadoColor(reserva['estado']),
              child: Icon(
                reserva['icono'],
                color: Colors.white,
              ),
            ),
            title: Text(reserva['area']),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Fecha: ${reserva['fecha']}'),
                Text('Horario: ${reserva['horaInicio']} - ${reserva['horaFin']}'),
                Text('ID: ${reserva['id']}'),
              ],
            ),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '\$${reserva['precio'].toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: _getEstadoColor(reserva['estado']),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getEstadoTexto(reserva['estado']),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
          if (reserva['fechaLimite'] != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.orange.shade50,
                border: Border(
                  top: BorderSide(color: Colors.grey.shade300),
                ),
              ),
              child: Row(
                children: [
                  const Icon(Icons.schedule, color: Colors.orange, size: 16),
                  const SizedBox(width: 8),
                  Text(
                    'Fecha límite para pagar: ${reserva['fechaLimite']}',
                    style: const TextStyle(
                      color: Colors.orange,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _verDetalles(reserva),
                    child: const Text('Ver Detalles'),
                  ),
                ),
                const SizedBox(width: 12),
                if (reserva['estado'] == 'Pendiente de Pago')
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _pagarReserva(reserva),
                      child: const Text('Pagar'),
                    ),
                  ),
                if (reserva['estado'] == 'Pendiente de Confirmación')
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _confirmarReserva(reserva),
                      child: const Text('Confirmar'),
                    ),
                  ),
                if (reserva['estado'] == 'Confirmada')
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _cancelarReserva(reserva),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Cancelar'),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.event_available,
            size: 80,
            color: Colors.grey,
          ),
          SizedBox(height: 16),
          Text(
            'No tienes reservas',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey,
            ),
          ),
          SizedBox(height: 8),
          Text(
            'Tus reservas aparecerán aquí cuando realices una',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Color _getEstadoColor(String estado) {
    switch (estado) {
      case 'Confirmada':
        return Colors.green;
      case 'Pendiente de Pago':
        return Colors.orange;
      case 'Pendiente de Confirmación':
        return Colors.blue;
      case 'Cancelada':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _getEstadoTexto(String estado) {
    switch (estado) {
      case 'Pendiente de Pago':
        return 'PAGAR';
      case 'Pendiente de Confirmación':
        return 'CONFIRMAR';
      case 'Confirmada':
        return 'ACTIVA';
      case 'Cancelada':
        return 'CANCELADA';
      default:
        return estado.toUpperCase();
    }
  }

  void _verDetalles(Map<String, dynamic> reserva) {
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
              Row(
                children: [
                  CircleAvatar(
                    backgroundColor: _getEstadoColor(reserva['estado']),
                    child: Icon(
                      reserva['icono'],
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          reserva['area'],
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: _getEstadoColor(reserva['estado']),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            reserva['estado'],
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              _buildDetalleRow('ID de Reserva:', reserva['id']),
              _buildDetalleRow('Fecha:', reserva['fecha']),
              _buildDetalleRow('Hora de Inicio:', reserva['horaInicio']),
              _buildDetalleRow('Hora de Fin:', reserva['horaFin']),
              _buildDetalleRow('Precio:', '\$${reserva['precio'].toStringAsFixed(2)}'),
              if (reserva['fechaLimite'] != null)
                _buildDetalleRow('Fecha Límite:', reserva['fechaLimite']),
              const SizedBox(height: 24),
              const Text(
                'Términos y Condiciones:',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                '• La reserva debe ser pagada antes de la fecha límite\n'
                '• No se permiten reembolsos 24 horas antes del evento\n'
                '• El área debe ser dejada en las mismas condiciones\n'
                '• Se aplicarán multas por daños o uso indebido',
                style: TextStyle(fontSize: 14),
              ),
              const SizedBox(height: 24),
              if (reserva['estado'] == 'Pendiente de Pago')
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      _pagarReserva(reserva);
                    },
                    icon: const Icon(Icons.payment),
                    label: const Text('Proceder al Pago'),
                  ),
                ),
            ],
          ),
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

  void _nuevaReserva() {
    Navigator.pushNamed(context, '/reservar-areas-comunes');
  }

  void _pagarReserva(Map<String, dynamic> reserva) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Seleccionar Método de Pago',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.credit_card),
              title: const Text('Tarjeta de Crédito/Débito'),
              onTap: () {
                Navigator.pop(context);
                _procesarPago(reserva, 'tarjeta');
              },
            ),
            ListTile(
              leading: const Icon(Icons.account_balance),
              title: const Text('Transferencia Bancaria'),
              onTap: () {
                Navigator.pop(context);
                _procesarPago(reserva, 'transferencia');
              },
            ),
            ListTile(
              leading: const Icon(Icons.account_balance_wallet),
              title: const Text('Billetera Virtual'),
              onTap: () {
                Navigator.pop(context);
                _procesarPago(reserva, 'billetera');
              },
            ),
          ],
        ),
      ),
    );
  }

  void _procesarPago(Map<String, dynamic> reserva, String metodoPago) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const AlertDialog(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Procesando pago...'),
          ],
        ),
      ),
    );

    Future.delayed(const Duration(seconds: 3), () {
      Navigator.pop(context); // Cerrar dialog de loading
      setState(() {
        reserva['estado'] = 'Confirmada';
        reserva['fechaLimite'] = null;
      });
      _mostrarConfirmacionPago(reserva);
    });
  }

  void _mostrarConfirmacionPago(Map<String, dynamic> reserva) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('¡Pago Exitoso!'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.check_circle,
              color: Colors.green,
              size: 64,
            ),
            const SizedBox(height: 16),
            Text('Tu reserva de ${reserva['area']} ha sido confirmada.'),
            const SizedBox(height: 8),
            Text('Fecha: ${reserva['fecha']}'),
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

  void _confirmarReserva(Map<String, dynamic> reserva) {
    setState(() {
      reserva['estado'] = 'Confirmada';
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Reserva confirmada exitosamente')),
    );
  }

  void _cancelarReserva(Map<String, dynamic> reserva) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancelar Reserva'),
        content: const Text('¿Estás seguro de que deseas cancelar esta reserva?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('No'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                reserva['estado'] = 'Cancelada';
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Reserva cancelada')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Sí, Cancelar'),
          ),
        ],
      ),
    );
  }
}