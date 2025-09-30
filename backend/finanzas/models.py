
from django.db import models
from usuarios.models import Usuario
from django.core.validators import FileExtensionValidator


# Modelo para Multa
class Multa(models.Model):
	descripcion = models.CharField(max_length=200)
	monto = models.DecimalField(max_digits=10, decimal_places=2)
	fecha_creacion = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Multa: {self.descripcion} - Bs {self.monto}"

# Unidad (departamento/casa)
class Unidad(models.Model):
	nombre = models.CharField(max_length=20, unique=True)  # Ej: 'C-12'

	def __str__(self):
		return self.nombre

# Cuota generada para una unidad
class CuotaGenerada(models.Model):
	unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE)
	cuota_servicio = models.ForeignKey('CuotaServicio', on_delete=models.SET_NULL, null=True)
	periodo = models.CharField(max_length=50)  # Ej: '2025-09'
	vencimiento = models.DateField()
	monto = models.DecimalField(max_digits=10, decimal_places=2)
	estado = models.CharField(max_length=20, default='PENDIENTE')  # Pendiente, Pagado, Vencido, etc.
	fecha_creacion = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.unidad} - {self.cuota_servicio} - {self.periodo}"

class CuotaServicio(models.Model):
	nombre = models.CharField(max_length=100)
	descripcion = models.CharField(max_length=200, blank=True)
	monto = models.DecimalField(max_digits=10, decimal_places=2)
	tipo = models.CharField(max_length=50)
	fecha_creacion = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.nombre


class Pago(models.Model):
	usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)
	cuota_servicio = models.ForeignKey(CuotaServicio, on_delete=models.SET_NULL, null=True)
	monto_pagado = models.DecimalField(max_digits=10, decimal_places=2)
	fecha_pago = models.DateTimeField(auto_now_add=True)
	comprobante = models.FileField(
		upload_to='comprobantes/',
		blank=True,
		null=True,
		validators=[FileExtensionValidator(['jpg', 'jpeg', 'png', 'pdf'])]
	)

	def __str__(self):
		return f"Pago de {self.usuario} - {self.monto_pagado}"

# Create your models here.
