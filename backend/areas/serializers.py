from rest_framework import serializers
from .models import Tarea, AreaComun, Reserva, HorarioArea, FechaEspecial, PlanMantenimiento, OrdenMantenimiento, EvidenciaMantenimiento

class TareaSerializer(serializers.ModelSerializer):
    responsable_nombre = serializers.CharField(source='responsable.nombre_completo', read_only=True)
    activo_nombre = serializers.CharField(source='activo.nombre', read_only=True)

    class Meta:
        model = Tarea
        fields = [
            'id', 'titulo', 'descripcion', 'activo', 'activo_nombre', 'prioridad',
            'fecha_asignacion', 'fecha_limite', 'responsable', 'responsable_nombre', 'estado'
        ]

class HorarioAreaSerializer(serializers.ModelSerializer):
    area_nombre = serializers.CharField(source='area.nombre', read_only=True)
    
    class Meta:
        model = HorarioArea
        fields = '__all__'

class AreaComunSerializer(serializers.ModelSerializer):
    # Campos calculados para el frontend
    aforoMaximo = serializers.IntegerField(source='aforo_maximo')
    tarifa = serializers.DecimalField(source='precio_hora', max_digits=8, decimal_places=2)
    
    # Horarios como un diccionario anidado
    horarios = serializers.SerializerMethodField()
    
    class Meta:
        model = AreaComun
        fields = [
            'id', 'nombre', 'descripcion', 'aforoMaximo', 'tarifa', 
            'reglas', 'imagen', 'estado', 'horarios'
        ]
        extra_kwargs = {
            'aforo_maximo': {'write_only': True},
            'precio_hora': {'write_only': True}
        }
    
    def get_horarios(self, obj):
        """Retorna los horarios en el formato que espera el frontend"""
        horarios_dict = {}
        
        # Dias por defecto
        dias_default = {
            'lunes': {'activo': True, 'apertura': '08:00', 'cierre': '18:00', 'slots': 1},
            'martes': {'activo': True, 'apertura': '08:00', 'cierre': '18:00', 'slots': 1},
            'miercoles': {'activo': True, 'apertura': '08:00', 'cierre': '18:00', 'slots': 1},
            'jueves': {'activo': True, 'apertura': '08:00', 'cierre': '18:00', 'slots': 1},
            'viernes': {'activo': True, 'apertura': '08:00', 'cierre': '18:00', 'slots': 1},
            'sabado': {'activo': True, 'apertura': '08:00', 'cierre': '18:00', 'slots': 1},
            'domingo': {'activo': False, 'apertura': '', 'cierre': '', 'slots': 1}
        }
        
        # Obtener horarios desde la base de datos
        horarios_bd = HorarioArea.objects.filter(area=obj)
        for horario in horarios_bd:
            horarios_dict[horario.dia_semana] = {
                'activo': horario.activo,
                'apertura': horario.hora_apertura.strftime('%H:%M') if horario.activo and horario.hora_apertura else '',
                'cierre': horario.hora_cierre.strftime('%H:%M') if horario.activo and horario.hora_cierre else '',
                'slots': horario.slots_por_hora
            }
        
        # Combinar con valores por defecto para dias faltantes
        for dia, config in dias_default.items():
            if dia not in horarios_dict:
                horarios_dict[dia] = config
                
        return horarios_dict
    
    def update(self, instance, validated_data):
        # Manejar campos con nombres diferentes
        if 'aforo_maximo' in validated_data:
            instance.aforo_maximo = validated_data.pop('aforo_maximo')
        if 'precio_hora' in validated_data:
            instance.precio_hora = validated_data.pop('precio_hora')
            
        # Actualizar el resto de campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class ReservaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    area_nombre = serializers.CharField(source='area.nombre', read_only=True)
    
    class Meta:
        model = Reserva
        fields = '__all__'

class FechaEspecialSerializer(serializers.ModelSerializer):
    areas_afectadas_nombres = serializers.StringRelatedField(source='areas_afectadas', many=True, read_only=True)
    areasSeleccionadas = serializers.PrimaryKeyRelatedField(
        source='areas_afectadas', 
        many=True, 
        queryset=AreaComun.objects.all(),
        required=False
    )
    afectaAreas = serializers.SerializerMethodField()
    tipo = serializers.CharField()
    
    class Meta:
        model = FechaEspecial
        fields = [
            'id', 'nombre', 'fecha', 'tipo', 'descripcion', 
            'areas_afectadas_nombres', 'areasSeleccionadas', 'afectaAreas', 'activo'
        ]
    
    def get_afectaAreas(self, obj):
        """Determina si afecta a todas las áreas o solo a las seleccionadas"""
        if obj.areas_afectadas.count() == 0:
            return 'TODAS'
        return 'SELECCIONADAS'
    
    def create(self, validated_data):
        areas_afectadas = validated_data.pop('areas_afectadas', [])
        fecha_especial = FechaEspecial.objects.create(**validated_data)
        fecha_especial.areas_afectadas.set(areas_afectadas)
        return fecha_especial
    
    def update(self, instance, validated_data):
        areas_afectadas = validated_data.pop('areas_afectadas', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if areas_afectadas is not None:
            instance.areas_afectadas.set(areas_afectadas)
            
        return instance

class PlanMantenimientoSerializer(serializers.ModelSerializer):
    activos_nombres = serializers.StringRelatedField(source='activos', many=True, read_only=True)
    class Meta:
        model = PlanMantenimiento
        fields = ['id', 'nombre', 'descripcion', 'frecuencia', 'activos', 'activos_nombres', 'tiempo_estimado', 'costo_estimado', 'proxima_ejecucion', 'estado']

class OrdenMantenimientoSerializer(serializers.ModelSerializer):
    plan_nombre = serializers.CharField(source='plan.nombre', read_only=True)
    activo_nombre = serializers.CharField(source='activo.nombre', read_only=True)
    responsable_nombre = serializers.CharField(source='responsable.nombre_completo', read_only=True)
    class Meta:
        model = OrdenMantenimiento
        fields = [
            'id', 'plan', 'plan_nombre', 'titulo', 'descripcion', 'activo', 'activo_nombre',
            'fecha_programada', 'fecha_limite', 'estado', 'prioridad', 'responsable', 'responsable_nombre',
            'fecha_inicio', 'fecha_completado', 'tiempo_estimado', 'tiempo_real', 'costo_estimado', 'costo_real', 'observaciones'
        ]

class EvidenciaMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvidenciaMantenimiento
        fields = ['id', 'orden', 'tipo', 'descripcion', 'archivo', 'fecha_subida']
