from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import RostroResidente, Usuario
import numpy as np
from PIL import Image
import io

# Usar OpenCV como alternativa a face_recognition
try:
    from .opencv_face_recognition import opencv_face_recognizer
    FACE_RECOGNITION_AVAILABLE = True
    print("OpenCV face recognition activado exitosamente")
except Exception as e:
    print(f"Warning: OpenCV face recognition no disponible: {e}")
    FACE_RECOGNITION_AVAILABLE = False

class ReconocerRostroAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if not FACE_RECOGNITION_AVAILABLE:
            return Response({'error': 'Face recognition no está disponible.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        imagen_file = request.FILES.get('imagen')
        if not imagen_file:
            return Response({'error': 'No se envió ninguna imagen.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Leer la imagen recibida
            image = Image.open(imagen_file)
            image = image.convert('RGB')

            # Buscar rostros registrados y preparar el reconocedor
            rostros = RostroResidente.objects.exclude(encoding__isnull=True)
            if not rostros.exists():
                return Response({'error': 'No hay rostros registrados para comparar.'}, status=status.HTTP_404_NOT_FOUND)

            # Preparar datos para entrenamiento
            known_encodings = []
            usuarios_ids = []
            for rostro in rostros:
                try:
                    encoding = np.frombuffer(rostro.encoding, dtype=np.uint8)
                    known_encodings.append(encoding)
                    usuarios_ids.append(rostro.usuario_id)
                except Exception:
                    continue

            if not known_encodings:
                return Response({'error': 'No hay encodings válidos para comparar.'}, status=status.HTTP_404_NOT_FOUND)

            # Entrenar el reconocedor con los datos disponibles
            if opencv_face_recognizer.train_recognizer(known_encodings, usuarios_ids):
                # Intentar reconocer el rostro
                user_id, similarity = opencv_face_recognizer.recognize_face(image)
                
                if user_id is not None and similarity > 0.6:  # Umbral de confianza
                    try:
                        usuario = Usuario.objects.get(id=user_id)
                        return Response({
                            'resultado': 'residente', 
                            'usuario_id': usuario.id, 
                            'nombre': usuario.nombre_completo,
                            'confianza': similarity
                        })
                    except Usuario.DoesNotExist:
                        pass

            return Response({'resultado': 'desconocido'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Error procesando imagen: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
