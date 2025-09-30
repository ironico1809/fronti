# Smart Condominium App 🏢

Una aplicación móvil Flutter completa para la gestión inteligente de condominios, que incluye funcionalidades de administración financiera, reservas de áreas comunes, y sistemas de seguridad con IA.

## 🚀 Características Principales

### 💰 Servicios Financieros
- **Consultar Cuotas y Servicios**: Visualización detallada de todos los pagos pendientes y servicios
- **Realizar Pagos en Línea**: Sistema de pagos integrado con múltiples métodos (tarjeta, transferencia)
- **Historial de Pagos y Comprobantes**: Gestión completa del historial con filtros y exportación

### 🏊‍♀️ Reservas y Áreas Comunes
- **Reservar Áreas Comunes**: Sistema de reservas con calendario interactivo
- **Confirmar y Pagar Reservas**: Gestión de reservas con confirmación y pagos

### 🔒 Seguridad con IA
- **Reconocimiento Facial**: Sistema biométrico para identificación de residentes
- **Detección de Visitantes**: IA para detectar visitantes no registrados
- **Identificación de Vehículos (OCR)**: Reconocimiento automático de placas vehiculares

### 👤 Gestión de Usuario
- **Perfil de Usuario**: Gestión completa de datos personales
- **Notificaciones Automáticas**: Sistema de alertas y comunicaciones
- **Autenticación Segura**: Login con recuperación de contraseña

## 📱 Casos de Uso Implementados

| **Funcionalidad** | **Estado** | **Descripción** |
|-------------------|------------|-----------------|
| 🔐 Inicio de sesión | ✅ | Autenticación con email/contraseña |
| 💳 Consultar cuotas y servicios | ✅ | Vista detallada de pagos pendientes |
| 💰 Realizar pago en línea | ✅ | Procesamiento de pagos múltiples métodos |
| 📊 Ver historial de pagos | ✅ | Historial completo con filtros |
| 🔔 Notificaciones automáticas | ✅ | Sistema de alertas categorizado |
| 🏊 Reservar áreas comunes | ✅ | Calendario de reservas interactivo |
| ✅ Confirmar y pagar reservas | ✅ | Gestión de reservas con pagos |
| 👤 Reconocimiento facial | ✅ | Sistema biométrico completo |
| 🚨 Detección de visitantes | ✅ | Monitoreo de visitantes no registrados |
| 🚗 Identificación de vehículos | ✅ | OCR para reconocimiento de placas |

## 🛠️ Tecnologías Utilizadas

- **Framework**: Flutter 3.x
- **Lenguaje**: Dart
- **UI/UX**: Material Design 3
- **Gestión de Estado**: StatefulWidget con setState
- **Navegación**: Navigator 2.0
- **Formularios**: TextFormField con validación
- **Elementos UI**: Cards, Modals, Tabs, Dialogs

## 📂 Estructura del Proyecto

```
smart_condominium_app/
├── lib/
│   ├── main.dart                           # Punto de entrada y navegación principal
│   └── pages/                              # Todas las páginas de la aplicación
│       ├── inicio_sesion.dart              # 🔐 Pantalla de login
│       ├── consultar_cuotas_servicios.dart # 💳 Consulta de servicios financieros
│       ├── pago_en_linea.dart              # 💰 Procesamiento de pagos
│       ├── historial_pagos_comprobantes.dart # 📊 Historial de transacciones
│       ├── notificaciones_automaticas.dart   # 🔔 Sistema de notificaciones
│       ├── reservar_areas_comunes.dart     # 🏊 Reservas de áreas
│       ├── confirmar_pagar_reservas.dart   # ✅ Confirmación de reservas
│       ├── reconocimiento_facial.dart      # 👤 Biometría facial
│       ├── visitantes_no_registrados.dart  # 🚨 Detección de visitantes
│       ├── identificacion_vehiculos.dart   # 🚗 OCR de vehículos
│       ├── gestion_usuario.dart            # 👤 Perfil de usuario
│       ├── gestion_datos_usuario.dart      # ✏️ Edición de datos
│       ├── recuperar_contrasena.dart       # 🔑 Recuperación de contraseña
│       └── cierre_sesion.dart              # 🚪 Logout
└── README.md                               # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Flutter SDK (>=3.0.0)
- Dart SDK (>=3.0.0)
- Android Studio / VS Code
- Dispositivo Android/iOS o emulador

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd smart_condominium_app
```

2. **Instalar dependencias**
```bash
flutter pub get
```

3. **Ejecutar la aplicación**
```bash
flutter run
```

## 🎯 Funcionalidades Detalladas

### 🔐 Sistema de Autenticación
- Login con validación de email y contraseña
- Recuperación de contraseña con código de verificación
- Navegación automática al dashboard tras login exitoso

### 💰 Módulo Financiero
- **Consulta de Servicios**: Vista de todas las cuotas pendientes y pagadas
- **Pagos en Línea**: Múltiples métodos de pago (tarjeta, transferencia)
- **Historial Completo**: Filtros por fecha, tipo, estado con exportación PDF/Excel

### 🏊‍♀️ Sistema de Reservas
- **Calendario Interactivo**: Selección de fechas y horarios disponibles
- **Áreas Disponibles**: Piscina, gimnasio, salón de eventos, canchas
- **Gestión de Reservas**: Confirmación, modificación y cancelación
- **Pagos de Reservas**: Integración con el sistema de pagos

### 🤖 IA y Seguridad
- **Reconocimiento Facial**: 
  - Registro y gestión de rostros
  - Detección en tiempo real
  - Historial de accesos
  - Configuración de precisión
  
- **Detección de Visitantes**:
  - Identificación automática de personas no registradas
  - Sistema de alertas de seguridad
  - Autorización manual de accesos
  - Registro de incidentes

- **OCR de Vehículos**:
  - Reconocimiento automático de placas
  - Base de datos de vehículos registrados
  - Detección de vehículos no autorizados
  - Dashboard de estadísticas

### 📱 Gestión de Usuario
- **Perfil Completo**: Información personal, contacto, documentos
- **Notificaciones**: Configuración personalizada por categorías
- **Datos del Usuario**: Edición con tabs organizados
- **Configuraciones**: Preferencias de la aplicación

## 🎨 Diseño UI/UX

- **Material Design 3**: Diseño moderno y consistente
- **Temas Dinámicos**: Colores adaptativos por funcionalidad
- **Navegación Intuitiva**: Menús expandibles organizados por categorías
- **Responsive Design**: Adaptado para diferentes tamaños de pantalla
- **Iconografía Clara**: Iconos representativos para cada función

## 📊 Datos de Ejemplo

La aplicación incluye datos simulados para demostrar todas las funcionalidades:
- Usuario de ejemplo: Juan Pérez (Departamento 4A)
- Pagos pendientes y historial financiero
- Reservas de ejemplo en diferentes áreas
- Registros de acceso biométrico
- Detecciones de seguridad simuladas
- Vehículos registrados con placas de ejemplo

## 🔧 Personalización

El proyecto está diseñado para ser fácilmente personalizable:
- **Colores**: Modificar en `ThemeData` del archivo `main.dart`
- **Datos**: Reemplazar los arrays de datos de ejemplo con API calls
- **Funcionalidades**: Cada página es independiente y modular
- **Navegación**: Sistema de rutas fácil de extender

## 🚀 Próximas Características

- [ ] Integración con APIs reales
- [ ] Mapas interactivos del condominio
- [ ] Chat en tiempo real con administración
- [ ] Sistema de votaciones digitales
- [ ] Integración con IoT (domótica)
- [ ] Reportes avanzados con gráficos
- [ ] Sistema de multas y sanciones
- [ ] Marketplace de servicios

---

**Smart Condominium App** - Transformando la gestión residencial con tecnología inteligente 🏢✨
