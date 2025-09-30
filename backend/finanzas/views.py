

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Pago, CuotaServicio, Multa, Unidad, CuotaGenerada
from .serializers import PagoSerializer, CuotaServicioSerializer, UnidadSerializer, CuotaGeneradaSerializer
# Unidad API
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

class UnidadListCreateView(ListCreateAPIView):
	queryset = Unidad.objects.all()
	serializer_class = UnidadSerializer

class UnidadDetailView(RetrieveUpdateDestroyAPIView):
	queryset = Unidad.objects.all()
	serializer_class = UnidadSerializer

# CuotaGenerada API
class CuotaGeneradaListCreateView(ListCreateAPIView):
	queryset = CuotaGenerada.objects.all()
	serializer_class = CuotaGeneradaSerializer

class CuotaGeneradaDetailView(RetrieveUpdateDestroyAPIView):
	queryset = CuotaGenerada.objects.all()
	serializer_class = CuotaGeneradaSerializer
from rest_framework import status
from rest_framework.response import Response

class PagoListCreateView(ListCreateAPIView):
	queryset = Pago.objects.all()
	serializer_class = PagoSerializer

# CuotaServicio API (GET, POST)

class CuotaServicioListCreateView(ListCreateAPIView):
	queryset = CuotaServicio.objects.all()
	serializer_class = CuotaServicioSerializer

class CuotaServicioDetailView(RetrieveUpdateDestroyAPIView):
	queryset = CuotaServicio.objects.all()
	serializer_class = CuotaServicioSerializer

# Multa API (GET, POST)
from rest_framework import serializers
from .models import Multa

class MultaSerializer(serializers.ModelSerializer):
	class Meta:
		model = Multa
		fields = '__all__'


class MultaListCreateView(ListCreateAPIView):
	queryset = Multa.objects.all()
	serializer_class = MultaSerializer

class MultaDetailView(RetrieveUpdateDestroyAPIView):
	queryset = Multa.objects.all()
	serializer_class = MultaSerializer
