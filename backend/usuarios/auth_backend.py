from django.contrib.auth.backends import BaseBackend
from .models import Usuario
from django.contrib.auth.hashers import check_password

class UsuarioAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        correo = kwargs.get('correo', username)
        try:
            usuario = Usuario.objects.get(correo=correo)
            if check_password(password, usuario.contrasena):
                return usuario
        except Usuario.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return Usuario.objects.get(pk=user_id)
        except Usuario.DoesNotExist:
            return None
