from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import RostroResidente
from .rostros_serializers import RostroResidenteSerializer
from PIL import Image
import numpy as np
import io

# Usar OpenCV como alternativa a face_recognition
try:
    from .opencv_face_recognition import opencv_face_recognizer
    FACE_RECOGNITION_AVAILABLE = True
    print("OpenCV face recognition activado exitosamente")
except Exception as e:
    print(f"Warning: OpenCV face recognition no disponible: {e}")
    FACE_RECOGNITION_AVAILABLE = False

class RostroResidenteViewSet(viewsets.ModelViewSet):
    queryset = RostroResidente.objects.all()
    serializer_class = RostroResidenteSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        if not FACE_RECOGNITION_AVAILABLE:
            return Response({'error': 'Face recognition no está disponible.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        # Procesar la imagen para extraer el encoding facial
        imagen_file = request.FILES.get('imagen')
        if imagen_file:
            try:
                # Leer la imagen
                image = Image.open(imagen_file)
                image = image.convert('RGB')
                
                # Obtener encoding facial usando OpenCV
                encoding = opencv_face_recognizer.extract_face_encoding(image)
                if encoding is not None:
                    # Convertir el encoding a bytes para guardarlo
                    encoding_bytes = encoding.tobytes()
                    # Agregar el encoding a los datos de la request
                    request.data['encoding'] = encoding_bytes
                else:
                    return Response({'error': 'No se detectó ningún rostro en la imagen.'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': f'Error procesando imagen: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)
