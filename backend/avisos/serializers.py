from rest_framework import serializers
from .models import Aviso, Notificacion, AvisoAdjunto

class AvisoAdjuntoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvisoAdjunto
        fields = ['id', 'archivo']

class AvisoSerializer(serializers.ModelSerializer):
    adjuntos = AvisoAdjuntoSerializer(many=True, read_only=True)

    class Meta:
        model = Aviso
        fields = '__all__'

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'
