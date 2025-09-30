from django.db import models
from usuarios.models import Usuario

class AreaComun(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    aforo_maximo = models.IntegerField()
    reglas = models.TextField(blank=True)
    estado = models.CharField(max_length=20, default='ACTIVO')

    def __str__(self):
        return self.nombre

class Reserva(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)
    area = models.ForeignKey(AreaComun, on_delete=models.SET_NULL, null=True)
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    detalles = models.TextField(blank=True)
    estado = models.CharField(max_length=20, default='PENDIENTE')
    monto = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    comprobante_pago = models.FileField(upload_to='comprobantes_reserva/', blank=True, null=True)

    def __str__(self):
        return f"{self.area} - {self.fecha} {self.hora_inicio}-{self.hora_fin}"
