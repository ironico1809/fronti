from django.db import models

class Usuario(models.Model):
	ESTADO_CHOICES = [
		('ACTIVO', 'Activo'),
		('INACTIVO', 'Inactivo'),
	]
	nombre_completo = models.CharField(max_length=100)
	correo = models.EmailField(max_length=100, unique=True)
	contrasena = models.CharField(max_length=255)
	telefono = models.CharField(max_length=20, blank=True, null=True)
	estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='ACTIVO')

	def __str__(self):
		return self.nombre_completo

	@property
	def is_active(self):
		return self.estado == 'ACTIVO'

# Modelo para reconocimiento facial de residentes
class RostroResidente(models.Model):
	usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE, related_name='rostros')
	imagen = models.ImageField(upload_to='rostros_residentes/')
	encoding = models.BinaryField(blank=True, null=True, editable=True)  # Para guardar el embedding facial
	fecha_registro = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Rostro de {self.usuario.nombre_completo} ({self.id})"

class Rol(models.Model):
	nombre = models.CharField(max_length=50, unique=True)
	descripcion = models.CharField(max_length=100, blank=True)

	def __str__(self):
		return self.nombre

class Permiso(models.Model):
	nombre = models.CharField(max_length=50, unique=True)
	descripcion = models.CharField(max_length=100, blank=True)

	def __str__(self):
		return self.nombre

class UsuarioRol(models.Model):
	usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
	rol = models.ForeignKey(Rol, on_delete=models.CASCADE)

	class Meta:
		unique_together = ('usuario', 'rol')

class RolPermiso(models.Model):
	rol = models.ForeignKey(Rol, on_delete=models.CASCADE)
	permiso = models.ForeignKey(Permiso, on_delete=models.CASCADE)

	class Meta:
		unique_together = ('rol', 'permiso')

class RecuperacionContrasena(models.Model):
	usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
	token = models.CharField(max_length=100)
	fecha_expiracion = models.DateTimeField()
	usado = models.BooleanField(default=False)

	def __str__(self):
		return f"Token de {self.usuario.correo} ({'usado' if self.usado else 'no usado'})"
