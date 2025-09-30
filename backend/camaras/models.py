from django.db import models

class Camara(models.Model):
    nombre = models.CharField(max_length=100)
    ubicacion = models.CharField(max_length=200)
    url_stream = models.URLField(max_length=300)
    activa = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre
