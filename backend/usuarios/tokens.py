from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from django.contrib.auth import authenticate

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    correo = serializers.CharField()
    contrasena = serializers.CharField(write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop('username', None)
        self.fields.pop('password', None)

    def validate(self, attrs):
        correo = attrs.get('correo')
        contrasena = attrs.get('contrasena')
        user = authenticate(request=self.context.get('request'), correo=correo, password=contrasena)
        if not user:
            raise serializers.ValidationError('Contraseña incorrecta')
        attrs['username'] = correo
        attrs['password'] = contrasena
        return super().validate(attrs)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
