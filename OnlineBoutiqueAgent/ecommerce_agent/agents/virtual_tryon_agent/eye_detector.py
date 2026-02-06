import cv2
import numpy as np
import os
import requests

class EyeDetector:
    """Detects eyes in images using OpenCV Haar Cascades"""
    
    def __init__(self, face_cascade_path=None, eye_cascade_path=None):
        """
        Initialize the eye detector. If paths aren't provided, download models automatically.
        """
        # Auto-download models if not provided
        if face_cascade_path is None or eye_cascade_path is None:
            models_dir = os.path.join(os.path.dirname(__file__), 'models')
            os.makedirs(models_dir, exist_ok=True)
            
            face_cascade_path = os.path.join(models_dir, "haarcascade_frontalface_default.xml")
            eye_cascade_path = os.path.join(models_dir, "haarcascade_eye.xml")
            
            # Download if missing
            if not os.path.exists(face_cascade_path):
                self._download_model(
                    "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml",
                    face_cascade_path
                )
            
            if not os.path.exists(eye_cascade_path):
                self._download_model(
                    "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_eye.xml",
                    eye_cascade_path
                )
        
        if not os.path.exists(face_cascade_path):
            raise FileNotFoundError(f"Face cascade model not found at {face_cascade_path}")
        if not os.path.exists(eye_cascade_path):
            raise FileNotFoundError(f"Eye cascade model not found at {eye_cascade_path}")
            
        self.face_cascade = cv2.CascadeClassifier(face_cascade_path)
        self.eye_cascade = cv2.CascadeClassifier(eye_cascade_path)
    
    def _download_model(self, url, filepath):
        """Download a model file from URL"""
        print(f"Downloading {os.path.basename(filepath)}...")
        response = requests.get(url)
        response.raise_for_status()
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded {os.path.basename(filepath)}")

    def detect_eyes(self, image_bytes):
        """
        Detects the position of the eyes in an image.

        Args:
            image_bytes (bytes): The image in bytes.

        Returns:
            dict: A dictionary containing the center of the eyes, the distance between them,
                  and the angle of the line connecting them. Returns None if no eyes are found.
        """
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if img is None:
            print("Failed to decode image")
            return None
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            eyes = self.eye_cascade.detectMultiScale(roi_gray)

            if len(eyes) >= 2:
                # Find the two largest eye regions, assuming they are the actual eyes
                eyes = sorted(eyes, key=lambda item: item[2] * item[3], reverse=True)[:2]
                
                # Get center of each eye
                (ex1, ey1, ew1, eh1) = eyes[0]
                (ex2, ey2, ew2, eh2) = eyes[1]
                
                center1 = (x + ex1 + ew1 // 2, y + ey1 + eh1 // 2)
                center2 = (x + ex2 + ew2 // 2, y + ey2 + eh2 // 2)

                # Sort eyes from left to right to ensure correct angle calculation
                if center1[0] < center2[0]:
                    left_eye = center1
                    right_eye = center2
                else:
                    left_eye = center2
                    right_eye = center1

                # Ensure eyes are roughly on the same horizontal level
                if abs(left_eye[1] - right_eye[1]) > h * 0.25:
                    continue # Likely a false positive

                # Calculate midpoint, distance, and angle
                eye_center_x = (left_eye[0] + right_eye[0]) // 2
                eye_center_y = (left_eye[1] + right_eye[1]) // 2
                
                distance = np.sqrt((right_eye[0] - left_eye[0])**2 + (right_eye[1] - left_eye[1])**2)
                
                # Angle in degrees
                angle = np.degrees(np.arctan2(right_eye[1] - left_eye[1], right_eye[0] - left_eye[0]))

                return {
                    "eye_center": (eye_center_x, eye_center_y),
                    "eye_distance": distance,
                    "angle": angle
                }
        
        return None
