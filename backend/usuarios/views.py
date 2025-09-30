from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import UsuarioRegistroSerializer, UsuarioListSerializer, UsuarioUpdateSerializer
from .models import Usuario
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from django.db.models import Q
class PersonalListView(ListAPIView):
    serializer_class = UsuarioListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Buscar roles ignorando mayúsculas/minúsculas
        roles = Rol.objects.filter(nombre__iexact="personal") | Rol.objects.filter(nombre__iexact="mantenimiento")
        usuario_ids = UsuarioRol.objects.filter(rol__in=roles).values_list("usuario_id", flat=True)
        return Usuario.objects.filter(id__in=usuario_ids, estado="ACTIVO")
from rest_framework.permissions import AllowAny
from .models import Rol, Permiso, UsuarioRol, RolPermiso
from .serializers import RolSerializer, PermisoSerializer, UsuarioRolSerializer, RolPermisoSerializer
from rest_framework.generics import ListCreateAPIView

class RegistroUsuarioView(APIView):
	def post(self, request):
		serializer = UsuarioRegistroSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UsuarioListView(ListAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioListSerializer
    permission_classes = [AllowAny]

class UsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioUpdateSerializer
    lookup_field = 'id'
    permission_classes = [AllowAny]

class RolListView(ListCreateAPIView):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class RolDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    lookup_field = 'id'

class PermisoListView(ListCreateAPIView):
    queryset = Permiso.objects.all()
    serializer_class = PermisoSerializer

class PermisoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Permiso.objects.all()
    serializer_class = PermisoSerializer
    lookup_field = 'id'

class UsuarioRolListView(ListCreateAPIView):
    queryset = UsuarioRol.objects.all()
    serializer_class = UsuarioRolSerializer

class UsuarioRolDetailView(RetrieveUpdateDestroyAPIView):
    queryset = UsuarioRol.objects.all()
    serializer_class = UsuarioRolSerializer
    lookup_field = 'id'

class RolPermisoListView(ListCreateAPIView):
    queryset = RolPermiso.objects.all()
    serializer_class = RolPermisoSerializer

class RolPermisoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = RolPermiso.objects.all()
    serializer_class = RolPermisoSerializer
    lookup_field = 'id'
