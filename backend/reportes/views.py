from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from areas.models import Reserva, AreaComun
from django.db.models import Sum, Count, Q, F

class ReporteUsoAreasAPIView(APIView):
    """
    Reporte de uso de áreas comunes: ocupación, ingresos, tasa de confirmación, etc.
    Filtros: fecha_inicio, fecha_fin, area_id (opcional)
    """
    def get(self, request):
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        area_id = request.query_params.get('area_id')

        # Validar fechas
        try:
            if fecha_inicio:
                fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
            if fecha_fin:
                fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
        except Exception:
            return Response({'error': 'Formato de fecha inválido. Use YYYY-MM-DD'}, status=400)

        reservas = Reserva.objects.all()
        if fecha_inicio:
            reservas = reservas.filter(fecha__gte=fecha_inicio)
        if fecha_fin:
            reservas = reservas.filter(fecha__lte=fecha_fin)
        if area_id and area_id != 'all':
            reservas = reservas.filter(area_id=area_id)

        # Métricas globales
        total_reservas = reservas.count()
        confirmadas = reservas.filter(estado__iexact='CONFIRMADA').count()
        canceladas = reservas.filter(estado__iexact='CANCELADA').count()
        ingresos = reservas.filter(estado__iexact='CONFIRMADA').aggregate(total=Sum('monto'))['total'] or 0
        tasa_confirmacion = (confirmadas / total_reservas * 100) if total_reservas else 0

        # Por área
        areas = AreaComun.objects.all()
        if area_id and area_id != 'all':
            areas = areas.filter(id=area_id)
        reporte_areas = []
        for area in areas:
            r_area = reservas.filter(area=area)
            total = r_area.count()
            conf = r_area.filter(estado__iexact='CONFIRMADA').count()
            canc = r_area.filter(estado__iexact='CANCELADA').count()
            ing = r_area.filter(estado__iexact='CONFIRMADA').aggregate(total=Sum('monto'))['total'] or 0
            tasa = (conf / total * 100) if total else 0
            promedio = (ing / conf) if conf else 0
            reporte_areas.append({
                'area': area.nombre,
                'total_reservas': total,
                'confirmadas': conf,
                'canceladas': canc,
                'tasa_confirmacion': round(tasa, 1),
                'ingresos': ing,
                'promedio_reserva': round(promedio, 2)
            })

        return Response({
            'total_reservas': total_reservas,
            'confirmadas': confirmadas,
            'canceladas': canceladas,
            'ingresos': ingresos,
            'tasa_confirmacion': round(tasa_confirmacion, 1),
            'reporte_areas': reporte_areas
        })
