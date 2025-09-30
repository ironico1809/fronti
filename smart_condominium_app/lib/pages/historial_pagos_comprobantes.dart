import 'package:flutter/material.dart';

class HistorialPagosComprobantesPage extends StatefulWidget {
  const HistorialPagosComprobantesPage({Key? key}) : super(key: key);

  @override
  State<HistorialPagosComprobantesPage> createState() => _HistorialPagosComprobantesPageState();
}

class _HistorialPagosComprobantesPageState extends State<HistorialPagosComprobantesPage> {
  final List<Map<String, dynamic>> _historialPagos = [
    {
      'fecha': '2024-12-15',
      'concepto': 'Expensas Ordinarias',
      'monto': 150.00,
      'metodo': 'Tarjeta de Crédito',
      'estado': 'Pagado',
      'comprobante': 'COMP-2024-001',
    },
    {
      'fecha': '2024-11-15',
      'concepto': 'Expensas Ordinarias',
      'monto': 150.00,
      'metodo': 'Transferencia Bancaria',
      'estado': 'Pagado',
      'comprobante': 'COMP-2024-002',
    },
    {
      'fecha': '2024-12-01',
      'concepto': 'Reserva Salón de Fiestas',
      'monto': 100.00,
      'metodo': 'Tarjeta de Débito',
      'estado': 'Pagado',
      'comprobante': 'COMP-2024-003',
    },
    {
      'fecha': '2024-10-15',
      'concepto': 'Expensas Extraordinarias',
      'monto': 75.00,
      'metodo': 'Efectivo',
      'estado': 'Pagado',
      'comprobante': 'COMP-2024-004',
    },
    {
      'fecha': '2024-12-20',
      'concepto': 'Multa por Ruidos',
      'monto': 25.00,
      'metodo': 'Transferencia Bancaria',
      'estado': 'Pendiente',
      'comprobante': null,
    },
  ];

  String _filtroSeleccionado = 'Todos';
  final List<String> _opcionesFiltro = ['Todos', 'Pagado', 'Pendiente', 'Cancelado'];

  @override
  Widget build(BuildContext context) {
    final pagosFiltrados = _filtrarPagos();
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Historial de Pagos'),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: _exportarHistorial,
            icon: const Icon(Icons.download),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildResumenFinanciero(),
          _buildFiltros(),
          Expanded(
            child: pagosFiltrados.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.all(16.0),
                    itemCount: pagosFiltrados.length,
                    itemBuilder: (context, index) {
                      return _buildPagoCard(pagosFiltrados[index]);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildResumenFinanciero() {
    final pagosRealizados = _historialPagos.where((p) => p['estado'] == 'Pagado').toList();
    final totalPagado = pagosRealizados.fold<double>(0.0, (sum, pago) => sum + pago['monto']);
    final pagosPendientes = _historialPagos.where((p) => p['estado'] == 'Pendiente').toList();
    final totalPendiente = pagosPendientes.fold<double>(0.0, (sum, pago) => sum + pago['monto']);

    return Container(
      margin: const EdgeInsets.all(16.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Colors.blue, Colors.blueAccent],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12.0),
      ),
      child: Column(
        children: [
          const Text(
            'Resumen Financiero',
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
                    const Icon(Icons.check_circle, color: Colors.white, size: 32),
                    const SizedBox(height: 8),
                    const Text(
                      'Total Pagado',
                      style: TextStyle(color: Colors.white70),
                    ),
                    Text(
                      '\$${totalPagado.toStringAsFixed(2)}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(
                height: 50,
                child: VerticalDivider(color: Colors.white30),
              ),
              Expanded(
                child: Column(
                  children: [
                    const Icon(Icons.pending, color: Colors.white, size: 32),
                    const SizedBox(height: 8),
                    const Text(
                      'Total Pendiente',
                      style: TextStyle(color: Colors.white70),
                    ),
                    Text(
                      '\$${totalPendiente.toStringAsFixed(2)}',
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

  Widget _buildFiltros() {
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _opcionesFiltro.length,
        itemBuilder: (context, index) {
          final filtro = _opcionesFiltro[index];
          final isSelected = _filtroSeleccionado == filtro;
          return Container(
            margin: const EdgeInsets.only(right: 8.0, top: 8.0, bottom: 8.0),
            child: FilterChip(
              label: Text(filtro),
              selected: isSelected,
              onSelected: (selected) {
                setState(() {
                  _filtroSeleccionado = filtro;
                });
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildPagoCard(Map<String, dynamic> pago) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getStatusColor(pago['estado']),
          child: Icon(
            _getStatusIcon(pago['estado']),
            color: Colors.white,
          ),
        ),
        title: Text(pago['concepto']),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Fecha: ${pago['fecha']}'),
            Text('Método: ${pago['metodo']}'),
            if (pago['comprobante'] != null)
              Text('Comprobante: ${pago['comprobante']}'),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '\$${pago['monto'].toStringAsFixed(2)}',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              pago['estado'],
              style: TextStyle(
                color: _getStatusColor(pago['estado']),
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        onTap: () => _verDetallesPago(pago),
      ),
    );
  }

  Widget _buildEmptyState() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.receipt_long,
            size: 80,
            color: Colors.grey,
          ),
          SizedBox(height: 16),
          Text(
            'No hay pagos para mostrar',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey,
            ),
          ),
          SizedBox(height: 8),
          Text(
            'Los pagos aparecerán aquí cuando realices transacciones',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  List<Map<String, dynamic>> _filtrarPagos() {
    if (_filtroSeleccionado == 'Todos') {
      return _historialPagos;
    }
    return _historialPagos.where((pago) => pago['estado'] == _filtroSeleccionado).toList();
  }

  Color _getStatusColor(String estado) {
    switch (estado) {
      case 'Pagado':
        return Colors.green;
      case 'Pendiente':
        return Colors.orange;
      case 'Cancelado':
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
      case 'Cancelado':
        return Icons.cancel;
      default:
        return Icons.help;
    }
  }

  void _verDetallesPago(Map<String, dynamic> pago) {
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
                'Detalle de Pago',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 24),
              _buildDetalleRow('Concepto:', pago['concepto']),
              _buildDetalleRow('Fecha:', pago['fecha']),
              _buildDetalleRow('Monto:', '\$${pago['monto'].toStringAsFixed(2)}'),
              _buildDetalleRow('Método de Pago:', pago['metodo']),
              _buildDetalleRow('Estado:', pago['estado']),
              if (pago['comprobante'] != null)
                _buildDetalleRow('N° Comprobante:', pago['comprobante']),
              const SizedBox(height: 24),
              if (pago['estado'] == 'Pagado' && pago['comprobante'] != null)
                Column(
                  children: [
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => _descargarComprobante(pago['comprobante']),
                        icon: const Icon(Icons.download),
                        label: const Text('Descargar Comprobante'),
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: () => _compartirComprobante(pago['comprobante']),
                        icon: const Icon(Icons.share),
                        label: const Text('Compartir Comprobante'),
                      ),
                    ),
                  ],
                ),
              if (pago['estado'] == 'Pendiente')
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      _pagarAhora(pago);
                    },
                    icon: const Icon(Icons.payment),
                    label: const Text('Pagar Ahora'),
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
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
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

  void _exportarHistorial() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Exportar Historial'),
        content: const Text('¿En qué formato deseas exportar el historial?'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _exportar('PDF');
            },
            child: const Text('PDF'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _exportar('Excel');
            },
            child: const Text('Excel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
        ],
      ),
    );
  }

  void _exportar(String formato) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Exportando historial en formato $formato...')),
    );
  }

  void _descargarComprobante(String comprobante) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Descargando comprobante $comprobante...')),
    );
  }

  void _compartirComprobante(String comprobante) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Compartiendo comprobante $comprobante...')),
    );
  }

  void _pagarAhora(Map<String, dynamic> pago) {
    // Navegar a página de pago
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Redirigiendo al pago de ${pago['concepto']}...')),
    );
  }
}