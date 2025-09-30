import 'package:flutter/material.dart';

class ConsultarCuotasServiciosPage extends StatefulWidget {
  const ConsultarCuotasServiciosPage({Key? key}) : super(key: key);

  @override
  State<ConsultarCuotasServiciosPage> createState() => _ConsultarCuotasServiciosPageState();
}

class _ConsultarCuotasServiciosPageState extends State<ConsultarCuotasServiciosPage> {
  final List<Map<String, dynamic>> _cuotas = [
    {
      'concepto': 'Expensas Ordinarias',
      'monto': 150.00,
      'vencimiento': '2025-01-15',
      'estado': 'Pendiente',
    },
    {
      'concepto': 'Expensas Extraordinarias',
      'monto': 50.00,
      'vencimiento': '2025-01-20',
      'estado': 'Pagado',
    },
    {
      'concepto': 'Servicio de Limpieza',
      'monto': 30.00,
      'vencimiento': '2025-01-10',
      'estado': 'Vencido',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cuotas y Servicios'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Estado de Cuenta',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: _cuotas.length,
                itemBuilder: (context, index) {
                  final cuota = _cuotas[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: _getStatusColor(cuota['estado']),
                        child: Icon(
                          _getStatusIcon(cuota['estado']),
                          color: Colors.white,
                        ),
                      ),
                      title: Text(cuota['concepto']),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Vencimiento: ${cuota['vencimiento']}'),
                          Text(
                            'Estado: ${cuota['estado']}',
                            style: TextStyle(
                              color: _getStatusColor(cuota['estado']),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      trailing: Text(
                        '\$${cuota['monto'].toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      onTap: () {
                        _showCuotaDetails(cuota);
                      },
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  // Navegar a página de pagos
                },
                icon: const Icon(Icons.payment),
                label: const Text('Realizar Pago'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String estado) {
    switch (estado) {
      case 'Pagado':
        return Colors.green;
      case 'Pendiente':
        return Colors.orange;
      case 'Vencido':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getStatusIcon(String estado) {
    switch (estado) {
      case 'Pagado':
        return Icons.check_circle;
      case 'Pendiente':
        return Icons.access_time;
      case 'Vencido':
        return Icons.error;
      default:
        return Icons.help;
    }
  }

  void _showCuotaDetails(Map<String, dynamic> cuota) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(cuota['concepto']),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Monto: \$${cuota['monto'].toStringAsFixed(2)}'),
              const SizedBox(height: 8),
              Text('Vencimiento: ${cuota['vencimiento']}'),
              const SizedBox(height: 8),
              Text('Estado: ${cuota['estado']}'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cerrar'),
            ),
            if (cuota['estado'] != 'Pagado')
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  // Navegar a pago
                },
                child: const Text('Pagar'),
              ),
          ],
        );
      },
    );
  }
}