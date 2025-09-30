from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from datetime import datetime, timedelta
from .models import AreaComun, Reserva, HorarioArea, FechaEspecial, Tarea, PlanMantenimiento, OrdenMantenimiento, EvidenciaMantenimiento
from .serializers import AreaComunSerializer, ReservaSerializer, HorarioAreaSerializer, FechaEspecialSerializer, TareaSerializer, PlanMantenimientoSerializer, OrdenMantenimientoSerializer, EvidenciaMantenimientoSerializer
# ViewSet para Tarea
from rest_framework import permissions

class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all().order_by('-fecha_asignacion')
    serializer_class = TareaSerializer
    permission_classes = [permissions.AllowAny]

class AreaComunViewSet(viewsets.ModelViewSet):
    queryset = AreaComun.objects.all().order_by('nombre')
    serializer_class = AreaComunSerializer

    @action(detail=True, methods=['get'])
    def disponibilidad(self, request, pk=None):
        """Obtiene la disponibilidad de un área para una fecha específica"""
        area = self.get_object()
        fecha = request.query_params.get('fecha')
        if not fecha:
            return Response(
                {'error': 'Debe enviar la fecha como parámetro (?fecha=YYYY-MM-DD)'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Formato de fecha inválido. Use YYYY-MM-DD'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar si hay fechas especiales que afecten esta área
        fechas_especiales = FechaEspecial.objects.filter(
            fecha=fecha_obj,
            activo=True
        ).filter(
            areas_afectadas=area
        ).exists() or FechaEspecial.objects.filter(
            fecha=fecha_obj,
            activo=True,
            areas_afectadas__isnull=True
        ).exists()
        
        if fechas_especiales:
            return Response({
                'disponible': False,
                'motivo': 'Fecha especial (feriado, mantenimiento o evento)',
                'ocupadas': []
            })
        
        # Obtener reservas existentes
        reservas = Reserva.objects.filter(area=area, fecha=fecha_obj)
        ocupadas = []
        for reserva in reservas:
            ocupadas.append({
                'inicio': reserva.hora_inicio.strftime('%H:%M'),
                'fin': reserva.hora_fin.strftime('%H:%M'),
                'usuario': reserva.usuario.nombre_completo if reserva.usuario else 'Desconocido'
            })
        
        return Response({
            'disponible': True,
            'ocupadas': ocupadas,
            'area': area.nombre
        })
    
    @action(detail=True, methods=['get'])
    def obtener_horarios(self, request, pk=None):
        """Obtiene los horarios formateados de un área específica para el frontend"""
        area = self.get_object()
        
        # Obtener todos los horarios del área
        horarios_db = HorarioArea.objects.filter(area=area)
        
        # Formatear horarios para el frontend
        horarios_formateados = {}
        dias_semana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
        
        for dia in dias_semana:
            try:
                horario = horarios_db.get(dia_semana=dia)
                horarios_formateados[dia] = {
                    'activo': horario.activo,
                    'apertura': horario.hora_apertura.strftime('%H:%M') if horario.hora_apertura else '08:00',
                    'cierre': horario.hora_cierre.strftime('%H:%M') if horario.hora_cierre else '18:00',
                    'slots': horario.slots_por_hora
                }
            except HorarioArea.DoesNotExist:
                # Si no existe horario para ese día, crear uno por defecto
                horarios_formateados[dia] = {
                    'activo': True if dia != 'domingo' else False,
                    'apertura': '08:00',
                    'cierre': '18:00',
                    'slots': 1
                }
        
        return Response({
            'area_id': area.id,
            'area_nombre': area.nombre,
            'horarios': horarios_formateados
        })

    @action(detail=True, methods=['post'])
    def guardar_horarios(self, request, pk=None):
        """Guarda los horarios de un área específica"""
        area = self.get_object()
        horarios_data = request.data.get('horarios', {})
        
        if not horarios_data:
            return Response(
                {'error': 'No se enviaron horarios para guardar'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with transaction.atomic():
                # Eliminar horarios existentes
                HorarioArea.objects.filter(area=area).delete()
                
                # Crear nuevos horarios
                for dia, config in horarios_data.items():
                    if config.get('activo', False):
                        HorarioArea.objects.create(
                            area=area,
                            dia_semana=dia,
                            activo=True,
                            hora_apertura=config.get('apertura', '08:00'),
                            hora_cierre=config.get('cierre', '18:00'),
                            slots_por_hora=config.get('slots', 1)
                        )
                    else:
                        # Crear registro inactivo con valores NULL para horarios
                        HorarioArea.objects.create(
                            area=area,
                            dia_semana=dia,
                            activo=False,
                            hora_apertura=None,  # NULL para días inactivos
                            hora_cierre=None,    # NULL para días inactivos
                            slots_por_hora=config.get('slots', 1)
                        )
                
                return Response({
                    'message': 'Horarios guardados exitosamente',
                    'area': area.nombre
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            return Response(
                {'error': f'Error al guardar horarios: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all().order_by('-fecha', '-hora_inicio')
    serializer_class = ReservaSerializer
    
    @action(detail=False, methods=['post'])
    def verificar_disponibilidad(self, request):
        """Verifica si un horario específico está disponible para reserva"""
        area_id = request.data.get('area_id')
        fecha = request.data.get('fecha')
        hora_inicio = request.data.get('hora_inicio')
        hora_fin = request.data.get('hora_fin')
        
        if not all([area_id, fecha, hora_inicio, hora_fin]):
            return Response(
                {'error': 'Faltan datos obligatorios: area_id, fecha, hora_inicio, hora_fin'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            area = AreaComun.objects.get(id=area_id)
            fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
            hora_inicio_obj = datetime.strptime(hora_inicio, '%H:%M').time()
            hora_fin_obj = datetime.strptime(hora_fin, '%H:%M').time()
        except (AreaComun.DoesNotExist, ValueError) as e:
            return Response(
                {'error': f'Datos inválidos: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar conflictos con reservas existentes
        conflictos = Reserva.objects.filter(
            area=area,
            fecha=fecha_obj,
            hora_inicio__lt=hora_fin_obj,
            hora_fin__gt=hora_inicio_obj
        )
        
        if conflictos.exists():
            return Response({
                'disponible': False,
                'motivo': 'Horario ya reservado'
            })
        
        return Response({'disponible': True})

class HorarioAreaViewSet(viewsets.ModelViewSet):
    queryset = HorarioArea.objects.all().order_by('area__nombre', 'dia_semana')
    serializer_class = HorarioAreaSerializer
    
    @action(detail=False, methods=['get'])
    def por_area(self, request):
        """Obtiene todos los horarios de un área específica"""
        area_id = request.query_params.get('area_id')
        if not area_id:
            return Response(
                {'error': 'Debe especificar area_id como parámetro'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        horarios = self.queryset.filter(area_id=area_id)
        serializer = self.get_serializer(horarios, many=True)
        return Response(serializer.data)

class FechaEspecialViewSet(viewsets.ModelViewSet):
    queryset = FechaEspecial.objects.all().order_by('-fecha')
    serializer_class = FechaEspecialSerializer
    
    @action(detail=False, methods=['get'])
    def por_mes(self, request):
        """Obtiene fechas especiales de un mes específico"""
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        
        if not year or not month:
            return Response(
                {'error': 'Debe especificar year y month como parámetros'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            fechas = self.queryset.filter(
                fecha__year=int(year),
                fecha__month=int(month)
            )
            serializer = self.get_serializer(fechas, many=True)
            return Response(serializer.data)
        except ValueError:
            return Response(
                {'error': 'Year y month deben ser números enteros'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class PlanMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = PlanMantenimiento.objects.all()
    serializer_class = PlanMantenimientoSerializer

class OrdenMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = OrdenMantenimiento.objects.all()
    serializer_class = OrdenMantenimientoSerializer

class EvidenciaMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = EvidenciaMantenimiento.objects.all()
    serializer_class = EvidenciaMantenimientoSerializer
