from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Aviso, Notificacion, AvisoAdjunto
from .serializers import AvisoSerializer, NotificacionSerializer, AvisoAdjuntoSerializer
from usuarios.models import Usuario
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action

class AvisoViewSet(viewsets.ModelViewSet):
    queryset = Aviso.objects.all().order_by('-fecha_publicacion')
    serializer_class = AvisoSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        aviso = serializer.save()
        # Crear notificaciones para todos los usuarios
        usuarios = Usuario.objects.all()
        for usuario in usuarios:
            Notificacion.objects.create(
                usuario=usuario,
                titulo=aviso.titulo,
                cuerpo=aviso.cuerpo,
                tipo='AVISO',
                estado='ENVIADA'
            )

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def subir_adjunto(self, request, pk=None):
        aviso = self.get_object()
        serializer = AvisoAdjuntoSerializer(data={'archivo': request.FILES['archivo'], 'aviso': aviso.id})
        if serializer.is_valid():
            serializer.save(aviso=aviso)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all().order_by('-fecha_envio')
    serializer_class = NotificacionSerializer
