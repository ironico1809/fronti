from django.db import models
from usuarios.models import Usuario


class AreaComun(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    aforo_maximo = models.IntegerField()
    precio_hora = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    reglas = models.TextField(blank=True)
    imagen = models.CharField(max_length=255, blank=True, null=True)  # Puedes usar FileField si quieres subir imágenes
    estado = models.CharField(max_length=20, default='ACTIVO')

    def __str__(self):
        return self.nombre

class PlanMantenimiento(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    frecuencia = models.CharField(max_length=20)  # Ej: 'MENSUAL', 'ANUAL'
    activos = models.ManyToManyField(AreaComun, related_name='planes')
    tiempo_estimado = models.IntegerField(help_text="En minutos", null=True, blank=True)
    costo_estimado = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    proxima_ejecucion = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=20, default='ACTIVO')

class OrdenMantenimiento(models.Model):
    plan = models.ForeignKey(PlanMantenimiento, on_delete=models.CASCADE, related_name='ordenes')
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    activo = models.ForeignKey(AreaComun, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_programada = models.DateField()
    fecha_limite = models.DateField()
    estado = models.CharField(max_length=20, choices=[
        ('PROGRAMADA', 'Programada'),
        ('EN_EJECUCION', 'En Ejecución'),
        ('COMPLETADA', 'Completada'),
        ('REPROGRAMADA', 'Reprogramada'),
        ('CANCELADA', 'Cancelada'),
    ], default='PROGRAMADA')
    prioridad = models.CharField(max_length=10, choices=[
        ('BAJA', 'Baja'),
        ('MEDIA', 'Media'),
        ('ALTA', 'Alta'),
        ('URGENTE', 'Urgente'),
    ], default='MEDIA')
    responsable = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_inicio = models.DateTimeField(null=True, blank=True)
    fecha_completado = models.DateTimeField(null=True, blank=True)
    tiempo_estimado = models.IntegerField(null=True, blank=True)
    tiempo_real = models.IntegerField(null=True, blank=True)
    costo_estimado = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    costo_real = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    observaciones = models.TextField(blank=True, null=True)

class EvidenciaMantenimiento(models.Model):
    orden = models.ForeignKey(OrdenMantenimiento, on_delete=models.CASCADE, related_name='evidencias')
    tipo = models.CharField(max_length=20, choices=[('FOTO', 'Foto'), ('DOCUMENTO', 'Documento')])
    descripcion = models.TextField(blank=True)
    archivo = models.FileField(upload_to='evidencias_mantenimiento/')
    fecha_subida = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class Reserva(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)
    area = models.ForeignKey(AreaComun, on_delete=models.SET_NULL, null=True)
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    cantidad_personas = models.IntegerField(default=1)
    detalles = models.TextField(blank=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    estado = models.CharField(max_length=20, default='PENDIENTE')
    comprobante_pago = models.FileField(upload_to='comprobantes_reserva/', blank=True, null=True)

    def __str__(self):
        return f"{self.area} - {self.fecha} {self.hora_inicio}-{self.hora_fin}"

class HorarioArea(models.Model):
    DIAS_SEMANA = [
        ('lunes', 'Lunes'),
        ('martes', 'Martes'),
        ('miercoles', 'Miércoles'),
        ('jueves', 'Jueves'),
        ('viernes', 'Viernes'),
        ('sabado', 'Sábado'),
        ('domingo', 'Domingo'),
    ]
    
    area = models.ForeignKey(AreaComun, on_delete=models.CASCADE, related_name='horarios')
    dia_semana = models.CharField(max_length=10, choices=DIAS_SEMANA)
    activo = models.BooleanField(default=True)
    hora_apertura = models.TimeField(null=True, blank=True)
    hora_cierre = models.TimeField(null=True, blank=True)
    slots_por_hora = models.IntegerField(default=1, help_text="Número de reservas simultáneas permitidas")

    class Meta:
        unique_together = ('area', 'dia_semana')

    def __str__(self):
        return f"{self.area.nombre} - {self.get_dia_semana_display()}"

class FechaEspecial(models.Model):
    TIPO_CHOICES = [
        ('FERIADO', 'Feriado'),
        ('MANTENIMIENTO', 'Mantenimiento'),
        ('EVENTO_ESPECIAL', 'Evento Especial'),
    ]
    
    nombre = models.CharField(max_length=100)
    fecha = models.DateField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    descripcion = models.TextField(blank=True)
    areas_afectadas = models.ManyToManyField(AreaComun, blank=True, help_text="Si no se selecciona ninguna, afecta a todas")
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} - {self.fecha}"


# Modelo para gestión de tareas asignadas
class Tarea(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_progreso', 'En Progreso'),
        ('completada', 'Completada'),
    ]

    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    activo = models.ForeignKey(AreaComun, on_delete=models.SET_NULL, null=True, blank=True, related_name='tareas')
    prioridad = models.CharField(max_length=10, choices=[
        ('BAJA', 'Baja'),
        ('MEDIA', 'Media'),
        ('ALTA', 'Alta'),
        ('URGENTE', 'Urgente'),
    ], default='MEDIA')
    fecha_asignacion = models.DateField(auto_now_add=True)
    fecha_limite = models.DateField()
    responsable = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='tareas_asignadas')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')

    def __str__(self):
        return self.titulo
