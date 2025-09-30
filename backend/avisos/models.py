from django.db import models
from usuarios.models import Usuario

class Aviso(models.Model):
    titulo = models.CharField(max_length=150)
    cuerpo = models.TextField()
    segmento = models.CharField(max_length=100)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    fecha_programada = models.DateTimeField(null=True, blank=True)
    estado = models.CharField(max_length=20, default='PENDIENTE')
    id_admin = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return self.titulo

class AvisoAdjunto(models.Model):
    aviso = models.ForeignKey(Aviso, related_name='adjuntos', on_delete=models.CASCADE)
    archivo = models.FileField(upload_to='avisos_adjuntos/')

    def __str__(self):
        return f"Adjunto de {self.aviso.titulo}"

class Notificacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=150)
    cuerpo = models.TextField()
    tipo = models.CharField(max_length=50)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, default='ENVIADA')
    token_notificacion = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.usuario} - {self.titulo}"
