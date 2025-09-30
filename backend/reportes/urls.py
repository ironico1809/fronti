from django.urls import path
from .views import ReporteUsoAreasAPIView

urlpatterns = [
    path('uso-areas/', ReporteUsoAreasAPIView.as_view(), name='reporte-uso-areas'),
]
