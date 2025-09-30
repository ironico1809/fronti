"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.contrib import admin
from django.urls import path, include
from usuarios.views import (
    RegistroUsuarioView, UsuarioListView, UsuarioDetailView,
    RolListView, RolDetailView, PermisoListView, PermisoDetailView,
    UsuarioRolListView, UsuarioRolDetailView, RolPermisoListView, RolPermisoDetailView,
    PersonalListView
)

from rest_framework_simplejwt.views import TokenRefreshView
from usuarios.tokens import CustomTokenObtainPairView

from finanzas.views import PagoListCreateView, CuotaServicioListCreateView, CuotaServicioDetailView, MultaListCreateView, MultaDetailView
from finanzas.views import UnidadListCreateView, UnidadDetailView, CuotaGeneradaListCreateView, CuotaGeneradaDetailView
from rest_framework import routers
from avisos.views import AvisoViewSet, NotificacionViewSet
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'avisos', AvisoViewSet)
router.register(r'notificaciones', NotificacionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/usuarios/', UsuarioListView.as_view(), name='usuarios_list'),
    path('api/usuarios/<int:id>/', UsuarioDetailView.as_view(), name='usuario_detail'),
    path('api/personal/', PersonalListView.as_view(), name='personal_list'),
    path('api/roles/', RolListView.as_view(), name='roles_list'),
    path('api/roles/<int:id>/', RolDetailView.as_view(), name='rol_detail'),
    path('api/permisos/', PermisoListView.as_view(), name='permisos_list'),
    path('api/permisos/<int:id>/', PermisoDetailView.as_view(), name='permiso_detail'),
    path('api/usuario-roles/', UsuarioRolListView.as_view(), name='usuariorol_list'),
    path('api/usuario-roles/<int:id>/', UsuarioRolDetailView.as_view(), name='usuariorol_detail'),
    path('api/rol-permisos/', RolPermisoListView.as_view(), name='rolpermiso_list'),
    path('api/rol-permisos/<int:id>/', RolPermisoDetailView.as_view(), name='rolpermiso_detail'),
    path('api/pagos/', PagoListCreateView.as_view(), name='pagos_list_create'),
    path('api/cuotas-servicio/', CuotaServicioListCreateView.as_view(), name='cuotas_servicio_list_create'),
    path('api/cuotas-servicio/<int:pk>/', CuotaServicioDetailView.as_view(), name='cuotas_servicio_detail'),
    path('api/multas/', MultaListCreateView.as_view(), name='multas_list_create'),
    path('api/multas/<int:pk>/', MultaDetailView.as_view(), name='multas_detail'),

    # Unidad
    path('api/unidades/', UnidadListCreateView.as_view(), name='unidades_list_create'),
    path('api/unidades/<int:pk>/', UnidadDetailView.as_view(), name='unidades_detail'),

    # Cuotas generadas
    path('api/cuotas-generadas/', CuotaGeneradaListCreateView.as_view(), name='cuotas_generadas_list_create'),
    path('api/cuotas-generadas/<int:pk>/', CuotaGeneradaDetailView.as_view(), name='cuotas_generadas_detail'),

    # Rutas de la app areas
    path('api/', include('areas.urls')),
    # Rutas de usuarios (incluye rostros)
    path('api/usuarios/', include('usuarios.urls')),
    # Rutas de reportes
    path('api/reportes/', include('reportes.urls')),
    # Rutas de cámaras
    path('api/', include('camaras.urls')),
]

urlpatterns += router.urls
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
