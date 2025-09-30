from django.contrib import admin
from .models import AreaComun, Reserva, HorarioArea, FechaEspecial

class HorarioAreaInline(admin.TabularInline):
    model = HorarioArea
    extra = 0
    can_delete = True

@admin.register(AreaComun)
class AreaComunAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'aforo_maximo', 'precio_hora', 'estado')
    list_filter = ('estado',)
    search_fields = ('nombre', 'descripcion')
    readonly_fields = ('id',)
    inlines = [HorarioAreaInline]
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'descripcion', 'estado')
        }),
        ('Configuración', {
            'fields': ('aforo_maximo', 'precio_hora', 'reglas', 'imagen')
        }),
    )

@admin.register(HorarioArea)
class HorarioAreaAdmin(admin.ModelAdmin):
    list_display = ('area', 'dia_semana', 'activo', 'hora_apertura', 'hora_cierre', 'slots_por_hora')
    list_filter = ('dia_semana', 'activo', 'area')
    search_fields = ('area__nombre',)
    ordering = ('area__nombre', 'dia_semana')

@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ('area', 'usuario', 'fecha', 'hora_inicio', 'hora_fin', 'estado', 'monto')
    list_filter = ('estado', 'fecha', 'area')
    search_fields = ('area__nombre', 'usuario__username')
    readonly_fields = ('id',)
    ordering = ('-fecha', '-hora_inicio')
    
    fieldsets = (
        ('Reserva', {
            'fields': ('area', 'usuario', 'fecha', 'hora_inicio', 'hora_fin')
        }),
        ('Detalles', {
            'fields': ('cantidad_personas', 'detalles', 'monto', 'estado')
        }),
        ('Comprobante', {
            'fields': ('comprobante_pago',)
        }),
    )

@admin.register(FechaEspecial)
class FechaEspecialAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'fecha', 'tipo', 'activo')
    list_filter = ('tipo', 'activo', 'fecha')
    search_fields = ('nombre', 'descripcion')
    filter_horizontal = ('areas_afectadas',)
    ordering = ('-fecha',)
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'fecha', 'tipo', 'activo')
        }),
        ('Descripción', {
            'fields': ('descripcion',)
        }),
        ('Áreas Afectadas', {
            'fields': ('areas_afectadas',),
            'description': 'Si no se selecciona ninguna área, la fecha especial afectará a todas las áreas.'
        }),
    )
