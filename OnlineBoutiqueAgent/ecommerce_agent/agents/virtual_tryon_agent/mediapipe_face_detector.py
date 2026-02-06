"""
MediaPipe Face Mesh detector for precision eyewear placement
Uses 468 facial landmarks for accurate eye position detection
"""
import mediapipe as mp
import cv2
import numpy as np
from io import BytesIO
from PIL import Image


class MediaPipeFaceDetector:
    """
    Professional face landmark detection using Google's MediaPipe.
    Provides 468 facial landmarks including precise eye corners, nose bridge, etc.
    """
    
    def __init__(self):
        """Initialize MediaPipe Face Mesh"""
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5
        )
        
        # Key landmark indices for sunglasses placement
        # MediaPipe Face Mesh landmark indices:
        # 33, 133 = left eye outer/inner corners
        # 362, 263 = right eye outer/inner corners
        # 168 = nose bridge (between eyes)
        # 6 = nose tip
        self.LEFT_EYE_INNER = 133
        self.LEFT_EYE_OUTER = 33
        self.RIGHT_EYE_INNER = 362
        self.RIGHT_EYE_OUTER = 263
        self.NOSE_BRIDGE = 168
        self.NOSE_TIP = 6
        
    def detect_eyes(self, image_bytes):
        """
        Detect eye positions using MediaPipe Face Mesh.
        
        Args:
            image_bytes: Image as bytes
            
        Returns:
            dict: {
                'eye_center': (x, y),          # Center point between eyes
                'eye_distance': float,          # Distance between eye centers
                'angle': float,                 # Face rotation angle in degrees
                'left_eye': (x, y),            # Left eye center
                'right_eye': (x, y),           # Right eye center
                'nose_bridge': (x, y),         # Nose bridge position (CRITICAL for eyewear!)
                'landmarks': list              # All 468 landmarks (optional)
            }
            Returns None if no face detected.
        """
        try:
            print("   🔍 MediaPipe: Converting image...")
            # Convert bytes to numpy array
            np_arr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if image is None:
                print("   ❌ MediaPipe: Failed to decode image")
                return None
            
            # ✅ CRITICAL FIX #1: Upscale image before MediaPipe for better landmark detection
            # Small images (< 800px) produce poor eye distances (~21px instead of 120-180px)
            h, w = image.shape[:2]
            print(f"   📐 MediaPipe: Original image size {w}x{h}")
            
            if w < 800:
                scale = 800 / w
                image = cv2.resize(image, None, fx=scale, fy=scale, interpolation=cv2.INTER_LINEAR)
                h, w = image.shape[:2]
                print(f"   🔍 MediaPipe: Upscaled to {w}x{h} (scale={scale:.2f}x) for better detection")
            
            # Convert BGR to RGB for MediaPipe
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            print(f"   📐 MediaPipe: Processing at {w}x{h}")
            
            # Process the image
            print("   🧠 MediaPipe: Processing face mesh...")
            results = self.face_mesh.process(image_rgb)
            
            if not results.multi_face_landmarks:
                print("   ⚠️ MediaPipe: No face detected")
                return None
            
            # Get the first face
            face_landmarks = results.multi_face_landmarks[0]
            print(f"   ✅ MediaPipe: Found face with {len(face_landmarks.landmark)} landmarks")
            
            # Convert normalized landmarks to pixel coordinates
            # ✅ CRITICAL: Ensure proper int conversion to prevent coordinate bugs
            def get_landmark(idx):
                landmark = face_landmarks.landmark[idx]
                x_coord = int(landmark.x * w)
                y_coord = int(landmark.y * h)
                # Clamp to image bounds to prevent typo bugs
                x_coord = max(0, min(x_coord, w - 1))
                y_coord = max(0, min(y_coord, h - 1))
                return (x_coord, y_coord)
            
            # Get key facial points using CORRECT MediaPipe indices
            # Left eye: outer corner (33), inner corner (133)
            # Right eye: outer corner (263), inner corner (362)
            # Nose bridge: 168 (critical for eyewear placement!)
            
            left_eye_outer = get_landmark(33)   # Left eye outer corner
            left_eye_inner = get_landmark(133)  # Left eye inner corner
            right_eye_inner = get_landmark(362) # Right eye inner corner
            right_eye_outer = get_landmark(263) # Right eye outer corner
            nose_bridge = get_landmark(168)      # Nose bridge (CRITICAL!)
            
            print(f"   📍 Left eye: outer={left_eye_outer}, inner={left_eye_inner}")
            print(f"   📍 Right eye: outer={right_eye_outer}, inner={right_eye_inner}")
            print(f"   📍 Nose bridge: {nose_bridge}")
            
            # ✅ CRITICAL FIX #2: Ensure proper int conversion (prevent string concat bugs)
            # Calculate eye centers (midpoint of outer and inner corners)
            left_eye_center = (
                int((left_eye_inner[0] + left_eye_outer[0]) // 2),
                int((left_eye_inner[1] + left_eye_outer[1]) // 2)
            )
            
            right_eye_center = (
                int((right_eye_inner[0] + right_eye_outer[0]) // 2),
                int((right_eye_inner[1] + right_eye_outer[1]) // 2)
            )
            
            print(f"   👁️ Eye centers: Left={left_eye_center}, Right={right_eye_center}")
            
            # Calculate center between eyes (for reference only - we'll use nose bridge!)
            eye_center_x = int((left_eye_center[0] + right_eye_center[0]) // 2)
            eye_center_y = int((left_eye_center[1] + right_eye_center[1]) // 2)
            eye_center = (eye_center_x, eye_center_y)
            
            # Calculate distance between eyes
            eye_dx = right_eye_center[0] - left_eye_center[0]
            eye_dy = right_eye_center[1] - left_eye_center[1]
            eye_distance = np.sqrt(eye_dx**2 + eye_dy**2)
            
            print(f"   📏 Eye distance: {eye_distance:.2f}px (dx={eye_dx}, dy={eye_dy})")
            
            # Calculate face rotation angle (in degrees)
            angle = np.degrees(np.arctan2(eye_dy, eye_dx))
            
            # ✅ CRITICAL FIX: Clamp small angles to zero (ignore camera noise/asymmetry)
            # Glasses are worn straight unless head is CLEARLY tilted (not just expression asymmetry)
            # Only rotate for significant head tilt (ROLL), not for left/right facing (YAW)
            if abs(angle) < 10:
                angle = 0
            
            print(f"   🔄 Face angle: {angle:.2f}° (clamped if < 10°)")
            
            result = {
                'eye_center': eye_center,
                'eye_distance': eye_distance,
                'angle': angle,
                'left_eye': left_eye_center,
                'right_eye': right_eye_center,
                'nose_bridge': nose_bridge,  # CRITICAL for eyewear!
                'face_width': w,
                'face_height': h,
                'eye_dx': eye_dx,
                'eye_dy': eye_dy
            }
            
            print(f"   ✅ MediaPipe: Face detection complete!")
            return result
            
        except Exception as e:
            print(f"   ❌ MediaPipe face detection error: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def __del__(self):
        """Cleanup MediaPipe resources"""
        if hasattr(self, 'face_mesh'):
            self.face_mesh.close()


# Backward compatibility: alias for existing code
EyeDetector = MediaPipeFaceDetector
