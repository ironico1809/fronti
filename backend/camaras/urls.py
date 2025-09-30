from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CamaraViewSet

router = DefaultRouter()
router.register(r'camaras', CamaraViewSet, basename='camara')

urlpatterns = [
    path('', include(router.urls)),
]
