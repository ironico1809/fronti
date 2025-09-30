from rest_framework import serializers
from .models import RostroResidente

class RostroResidenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RostroResidente
        fields = ['id', 'usuario', 'imagen', 'encoding', 'fecha_registro']
        read_only_fields = ['encoding', 'fecha_registro']
