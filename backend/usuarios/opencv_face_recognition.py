import cv2
import numpy as np
from PIL import Image
import pickle

class OpenCVFaceRecognition:
    def __init__(self):
        # Inicializar el detector de rostros de OpenCV
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        # Inicializar el reconocedor de rostros
        self.face_recognizer = cv2.face.LBPHFaceRecognizer_create()
        self.trained = False
        self.encodings = []
        self.user_ids = []
    
    def detect_faces(self, image):
        """Detectar rostros en una imagen"""
        if isinstance(image, Image.Image):
            # Convertir PIL Image a array numpy
            image_array = np.array(image.convert('RGB'))
            # Convertir RGB a BGR para OpenCV
            image_cv = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
        else:
            image_cv = image
        
        # Convertir a escala de grises
        gray = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)
        
        # Detectar rostros
        faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
        
        return faces, gray
    
    def extract_face_encoding(self, image):
        """Extraer encoding facial de una imagen"""
        faces, gray = self.detect_faces(image)
        
        if len(faces) == 0:
            return None
        
        # Tomar el primer rostro detectado
        (x, y, w, h) = faces[0]
        face_roi = gray[y:y+h, x:x+w]
        
        # Redimensionar a un tamaño estándar
        face_roi = cv2.resize(face_roi, (100, 100))
        
        # Retornar la región del rostro como "encoding"
        return face_roi.flatten()
    
    def train_recognizer(self, face_encodings, user_ids):
        """Entrenar el reconocedor con los encodings disponibles"""
        if len(face_encodings) == 0:
            return False
        
        # Convertir encodings a formato adecuado para entrenamiento
        faces = []
        labels = []
        
        for i, encoding in enumerate(face_encodings):
            if encoding is not None:
                # Reshape el encoding de vuelta a imagen 100x100
                face_image = encoding.reshape(100, 100).astype(np.uint8)
                faces.append(face_image)
                labels.append(user_ids[i])
        
        if len(faces) > 0:
            self.face_recognizer.train(faces, np.array(labels))
            self.trained = True
            return True
        
        return False
    
    def recognize_face(self, image):
        """Reconocer un rostro en una imagen"""
        if not self.trained:
            return None, 0
        
        faces, gray = self.detect_faces(image)
        
        if len(faces) == 0:
            return None, 0
        
        # Tomar el primer rostro detectado
        (x, y, w, h) = faces[0]
        face_roi = gray[y:y+h, x:x+w]
        face_roi = cv2.resize(face_roi, (100, 100))
        
        # Predecir la identidad
        user_id, confidence = self.face_recognizer.predict(face_roi)
        
        # Convertir confidence a similarity (menor confidence = mayor similarity)
        # En LBPH, confidence menor significa mejor match
        similarity = max(0, (100 - confidence) / 100)
        
        return user_id, similarity

# Instancia global del reconocedor
opencv_face_recognizer = OpenCVFaceRecognition()