from django.core.management.base import BaseCommand
from datetime import datetime, time, date
from areas.models import AreaComun, HorarioArea, FechaEspecial

class Command(BaseCommand):
    help = 'Crear datos de ejemplo para las áreas comunes'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creando datos de ejemplo para áreas comunes...'))
        
        # Crear áreas comunes de ejemplo
        areas_data = [
            {
                'nombre': 'Salón de Eventos',
                'descripcion': 'Amplio salón para eventos sociales, reuniones familiares y celebraciones. Capacidad para hasta 50 personas con sistema de sonido incluido.',
                'aforo_maximo': 50,
                'precio_hora': 25.00,
                'reglas': 'No se permite fumar. Se requiere depósito de limpieza. Horario máximo hasta las 23:00.',
                'estado': 'ACTIVO'
            },
            {
                'nombre': 'Gimnasio',
                'descripcion': 'Gimnasio completamente equipado con máquinas de cardio, pesas libres y área de estiramiento.',
                'aforo_maximo': 15,
                'precio_hora': 8.00,
                'reglas': 'Uso obligatorio de ropa deportiva y toalla. No se permite el uso de calzado de calle.',
                'estado': 'ACTIVO'
            },
            {
                'nombre': 'Piscina',
                'descripcion': 'Piscina semiolímpica climatizada con área de descanso y duchas.',
                'aforo_maximo': 20,
                'precio_hora': 12.00,
                'reglas': 'Supervisión de adultos para menores de 12 años. No se permite comida ni bebidas alcohólicas.',
                'estado': 'ACTIVO'
            },
            {
                'nombre': 'Cancha de Tenis',
                'descripcion': 'Cancha de tenis profesional con superficie de arcilla y iluminación nocturna.',
                'aforo_maximo': 4,
                'precio_hora': 15.00,
                'reglas': 'Reservas máximo de 2 horas consecutivas. Se requiere calzado deportivo apropiado.',
                'estado': 'ACTIVO'
            },
            {
                'nombre': 'Sala de Reuniones',
                'descripcion': 'Sala de reuniones equipada con proyector, pizarra y sistema de videoconferencia.',
                'aforo_maximo': 12,
                'precio_hora': 10.00,
                'reglas': 'No se permite comida. Uso exclusivo para reuniones de trabajo o estudio.',
                'estado': 'ACTIVO'
            },
            {
                'nombre': 'BBQ/Parrilla',
                'descripcion': 'Área de barbacoa al aire libre con mesas, parrillas y área de cocina.',
                'aforo_maximo': 25,
                'precio_hora': 18.00,
                'reglas': 'El usuario debe limpiar después del uso. Prohibido el uso durante días lluviosos.',
                'estado': 'MANTENIMIENTO'  # Este estará en mantenimiento
            }
        ]
        
        areas_creadas = []
        for area_data in areas_data:
            area, created = AreaComun.objects.get_or_create(
                nombre=area_data['nombre'],
                defaults=area_data
            )
            if created:
                self.stdout.write(f'✅ Creada área: {area.nombre}')
                areas_creadas.append(area)
            else:
                self.stdout.write(f'⚠️  Ya existe área: {area.nombre}')
                areas_creadas.append(area)
        
        # Crear horarios para cada área
        dias_semana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
        
        for area in areas_creadas:
            # Configuraciones específicas por tipo de área
            if 'Gimnasio' in area.nombre:
                # Gimnasio: lunes a sábado 6:00-22:00, domingos cerrado
                horarios_config = {
                    'lunes': {'activo': True, 'apertura': '06:00', 'cierre': '22:00', 'slots': 3},
                    'martes': {'activo': True, 'apertura': '06:00', 'cierre': '22:00', 'slots': 3},
                    'miercoles': {'activo': True, 'apertura': '06:00', 'cierre': '22:00', 'slots': 3},
                    'jueves': {'activo': True, 'apertura': '06:00', 'cierre': '22:00', 'slots': 3},
                    'viernes': {'activo': True, 'apertura': '06:00', 'cierre': '22:00', 'slots': 3},
                    'sabado': {'activo': True, 'apertura': '08:00', 'cierre': '20:00', 'slots': 2},
                    'domingo': {'activo': False, 'apertura': '00:00', 'cierre': '00:00', 'slots': 1}
                }
            elif 'Piscina' in area.nombre:
                # Piscina: todos los días 8:00-20:00
                horarios_config = {
                    'lunes': {'activo': True, 'apertura': '08:00', 'cierre': '20:00', 'slots': 2},
                    'martes': {'activo': True, 'apertura': '08:00', 'cierre': '20:00', 'slots': 2},
                    'miercoles': {'activo': True, 'apertura': '08:00', 'cierre': '20:00', 'slots': 2},
                    'jueves': {'activo': True, 'apertura': '08:00', 'cierre': '20:00', 'slots': 2},
                    'viernes': {'activo': True, 'apertura': '08:00', 'cierre': '20:00', 'slots': 2},
                    'sabado': {'activo': True, 'apertura': '08:00', 'cierre': '20:00', 'slots': 2},
                    'domingo': {'activo': True, 'apertura': '08:00', 'cierre': '20:00', 'slots': 2}
                }
            elif 'Tenis' in area.nombre:
                # Cancha de tenis: lunes a domingo 7:00-21:00
                horarios_config = {dia: {'activo': True, 'apertura': '07:00', 'cierre': '21:00', 'slots': 1} for dia in dias_semana}
            elif 'BBQ' in area.nombre or 'Parrilla' in area.nombre:
                # BBQ: viernes a domingo 10:00-22:00
                horarios_config = {
                    'lunes': {'activo': False, 'apertura': '00:00', 'cierre': '00:00', 'slots': 1},
                    'martes': {'activo': False, 'apertura': '00:00', 'cierre': '00:00', 'slots': 1},
                    'miercoles': {'activo': False, 'apertura': '00:00', 'cierre': '00:00', 'slots': 1},
                    'jueves': {'activo': False, 'apertura': '00:00', 'cierre': '00:00', 'slots': 1},
                    'viernes': {'activo': True, 'apertura': '10:00', 'cierre': '22:00', 'slots': 1},
                    'sabado': {'activo': True, 'apertura': '10:00', 'cierre': '22:00', 'slots': 1},
                    'domingo': {'activo': True, 'apertura': '10:00', 'cierre': '22:00', 'slots': 1}
                }
            else:
                # Configuración por defecto: lunes a sábado 8:00-18:00
                horarios_config = {
                    'lunes': {'activo': True, 'apertura': '08:00', 'cierre': '18:00', 'slots': 1},
                    'martes': {'activo': True, 'apertura': '08:00', 'cierre': '18:00', 'slots': 1},
                    'miercoles': {'activo': True, 'apertura': '08:00', 'cierre': '18:00', 'slots': 1},
                    'jueves': {'activo': True, 'apertura': '08:00', 'cierre': '18:00', 'slots': 1},
                    'viernes': {'activo': True, 'apertura': '08:00', 'cierre': '18:00', 'slots': 1},
                    'sabado': {'activo': True, 'apertura': '08:00', 'cierre': '18:00', 'slots': 1},
                    'domingo': {'activo': False, 'apertura': '00:00', 'cierre': '00:00', 'slots': 1}
                }
            
            # Crear horarios para esta área
            for dia, config in horarios_config.items():
                horario, created = HorarioArea.objects.get_or_create(
                    area=area,
                    dia_semana=dia,
                    defaults={
                        'activo': config['activo'],
                        'hora_apertura': time.fromisoformat(config['apertura']) if config['activo'] else None,
                        'hora_cierre': time.fromisoformat(config['cierre']) if config['activo'] else None,
                        'slots_por_hora': config['slots']
                    }
                )
                if created:
                    self.stdout.write(f'    ✅ Horario creado: {area.nombre} - {dia}')
        
        # Crear fechas especiales de ejemplo
        fechas_especiales = [
            {
                'nombre': 'Día de la Independencia',
                'fecha': date(2025, 7, 4),
                'tipo': 'FERIADO',
                'descripcion': 'Día feriado nacional - Todas las áreas cerradas',
                'activo': True
            },
            {
                'nombre': 'Mantenimiento Piscina',
                'fecha': date(2025, 8, 15),
                'tipo': 'MANTENIMIENTO',
                'descripcion': 'Mantenimiento anual del sistema de filtración',
                'activo': True
            },
            {
                'nombre': 'Reunión de Condóminos',
                'fecha': date(2025, 9, 30),
                'tipo': 'EVENTO_ESPECIAL',
                'descripcion': 'Asamblea general de condóminos en el salón de eventos',
                'activo': True
            }
        ]
        
        for fecha_data in fechas_especiales:
            fecha, created = FechaEspecial.objects.get_or_create(
                nombre=fecha_data['nombre'],
                fecha=fecha_data['fecha'],
                defaults=fecha_data
            )
            if created:
                self.stdout.write(f'✅ Creada fecha especial: {fecha.nombre}')
                
                # Asignar áreas afectadas para algunos casos específicos
                if 'Piscina' in fecha.nombre:
                    piscina = areas_creadas[2] if len(areas_creadas) > 2 else None  # Piscina es el índice 2
                    if piscina and 'Piscina' in piscina.nombre:
                        fecha.areas_afectadas.add(piscina)
                elif 'Reunión' in fecha.nombre:
                    salon = areas_creadas[0] if len(areas_creadas) > 0 else None  # Salón es el índice 0
                    if salon and 'Salón' in salon.nombre:
                        fecha.areas_afectadas.add(salon)
                # Las fechas feriadas afectan a todas las áreas (no se asignan áreas específicas)
        
        self.stdout.write(
            self.style.SUCCESS(f'\n🎉 ¡Datos de ejemplo creados exitosamente!')
        )
        self.stdout.write(
            self.style.SUCCESS(f'📊 Total áreas creadas: {len(areas_creadas)}')
        )
        self.stdout.write(
            self.style.SUCCESS(f'📅 Total fechas especiales: {len(fechas_especiales)}')
        )
        self.stdout.write(
            self.style.WARNING(f'\n💡 Ahora puedes:')
        )
        self.stdout.write(
            self.style.WARNING(f'   1. Acceder al admin de Django para ver los datos')
        )
        self.stdout.write(
            self.style.WARNING(f'   2. Probar la API en /api/areas-comunes/')
        )
        self.stdout.write(
            self.style.WARNING(f'   3. Usar el frontend para gestionar áreas y horarios')
        )