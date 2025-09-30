from rest_framework import serializers
from .models import Pago, CuotaServicio, Unidad, CuotaGenerada

class CuotaServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuotaServicio
        fields = '__all__'

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'


# Serializers para Unidad y CuotaGenerada
class UnidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidad
        fields = '__all__'

class CuotaGeneradaSerializer(serializers.ModelSerializer):
    unidad = UnidadSerializer(read_only=True)
    unidad_id = serializers.PrimaryKeyRelatedField(queryset=Unidad.objects.all(), source='unidad', write_only=True)
    cuota_servicio = CuotaServicioSerializer(read_only=True)
    cuota_servicio_id = serializers.PrimaryKeyRelatedField(queryset=CuotaServicio.objects.all(), source='cuota_servicio', write_only=True)

    class Meta:
        model = CuotaGenerada
        fields = ['id', 'unidad', 'unidad_id', 'cuota_servicio', 'cuota_servicio_id', 'periodo', 'vencimiento', 'monto', 'estado', 'fecha_creacion']
