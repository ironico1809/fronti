from rest_framework import serializers
from .models import Camara

class CamaraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camara
        fields = ['id', 'nombre', 'ubicacion', 'url_stream', 'activa']
