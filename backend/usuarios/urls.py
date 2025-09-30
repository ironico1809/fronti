from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .rostros_views import RostroResidenteViewSet
from .reconocer_rostro_api import ReconocerRostroAPIView

router = DefaultRouter()
router.register(r'rostros', RostroResidenteViewSet, basename='rostroresidente')

urlpatterns = [
    path('', include(router.urls)),
    path('reconocer_rostro/', ReconocerRostroAPIView.as_view(), name='reconocer-rostro'),
]
