import 'package:flutter/material.dart';

class CierreSesionPage extends StatelessWidget {
  const CierreSesionPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cerrar Sesión'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.logout,
              size: 100,
              color: Colors.red,
            ),
            const SizedBox(height: 32),
            const Text(
              '¿Estás seguro que deseas cerrar sesión?',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            const Text(
              'Tendrás que iniciar sesión nuevamente para acceder a la aplicación.',
              style: TextStyle(fontSize: 14),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Cancelar'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      _cerrarSesion(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Cerrar Sesión'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _cerrarSesion(BuildContext context) {
    // Lógica para cerrar sesión (limpiar tokens, preferencias, etc.)
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const AlertDialog(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Cerrando sesión...'),
          ],
        ),
      ),
    );

    // Simular proceso de cierre
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.of(context).pop(); // Cerrar dialog
      Navigator.of(context).pushReplacementNamed('/login');
    });
  }
}