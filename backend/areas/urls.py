from rest_framework import routers
from .views import AreaComunViewSet, ReservaViewSet, HorarioAreaViewSet, FechaEspecialViewSet, TareaViewSet, PlanMantenimientoViewSet, OrdenMantenimientoViewSet, EvidenciaMantenimientoViewSet

router = routers.DefaultRouter()
router.register(r'areas-comunes', AreaComunViewSet)
router.register(r'reservas', ReservaViewSet)
router.register(r'horarios-areas', HorarioAreaViewSet)
router.register(r'fechas-especiales', FechaEspecialViewSet)
router.register(r'tareas', TareaViewSet)
router.register(r'planes-mantenimiento', PlanMantenimientoViewSet)
router.register(r'ordenes-mantenimiento', OrdenMantenimientoViewSet)
router.register(r'evidencias-mantenimiento', EvidenciaMantenimientoViewSet)

urlpatterns = router.urls
