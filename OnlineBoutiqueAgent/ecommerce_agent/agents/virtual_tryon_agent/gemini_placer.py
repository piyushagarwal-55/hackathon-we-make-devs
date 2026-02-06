import google.generativeai as genai
import os
import json
from PIL import Image, ImageDraw
import numpy as np
import io

class GeminiPlacer:
    """
    A class to handle object placement using the Gemini API and image manipulation.
    """
    def __init__(self, gemini_model):
        """
        Initializes the GeminiPlacer with a pre-configured Gemini model.

        Args:
            gemini_model: An instance of a Gemini generative model.
        """
        if gemini_model is None:
            raise ValueError("A Gemini model instance must be provided.")
        self.model = gemini_model

    def get_object_placement(self, background_image_bytes, object_description, context_hint="", eye_data=None, object_dimensions=None):
        """
        Uses the Gemini API to determine the best placement for an object.
        """
        background_image = Image.open(io.BytesIO(background_image_bytes))

        # Start with the base prompt
        prompt_parts = [
            f"You are an expert interior and fashion AI. Your task is to determine the most realistic position, size, and rotation to place a '{object_description}' into the provided image.",
            "Analyze the image carefully. Consider perspective, depth, relative sizing, lighting, and context."
        ]

        if context_hint:
            prompt_parts.append(f"**Hint:** {context_hint}")

        if object_dimensions:
            prompt_parts.append(f"**Object Image Info:** The source image for the '{object_description}' is {object_dimensions[0]} pixels wide and {object_dimensions[1]} pixels high. Use its aspect ratio as a guide for scaling.")

        # If we have precise eye data, use a more specific prompt
        if eye_data:
            prompt_parts.append("\n**Precision Placement Instructions for Eyeglasses:**")
            prompt_parts.append("I have detected the exact location of the eyes using a computer vision model. Use this data for perfect placement.")
            prompt_parts.append(f"- The center between the eyes is at coordinates: {eye_data['eye_center']}.")
            prompt_parts.append(f"- The distance between the eyes is approximately {eye_data['eye_distance']:.2f} pixels. Use this to determine the initial width of the glasses.")
            prompt_parts.append(f"- The angle of the eyes is {eye_data['angle']:.2f} degrees. Use this for the rotation of the glasses.")
            prompt_parts.append("\nYour task is to refine these values. The final 'x' and 'y' should be the center of the glasses, which might be slightly different from the eye center. Adjust the 'scale' and 'rotation' for the most natural fit.")

        prompt_parts.append("\n**CRITICAL:** Your output MUST be ONLY a JSON object, with NO explanations, NO comments, NO markdown. Just pure JSON:")
        prompt_parts.append("""
        {
            "x": <integer>,
            "y": <integer>,
            "scale": <float>,
            "rotation": <integer>
        }
        """)
        prompt_parts.append("- `x` and `y`: The coordinates for the CENTER of where the object should be placed.")
        prompt_parts.append("- `scale`: A float between 0.05 and 1.0, representing the object's size relative to the image's smaller dimension.")
        prompt_parts.append("- `rotation`: An integer for the object's rotation in degrees.")
        prompt_parts.append("\nReturn ONLY the JSON object above. Do not include explanations or reasoning.")
        
        prompt_parts.append(f"\nHere is the image where you will place the '{object_description}':")

        final_prompt = "\n".join(prompt_parts)

        try:
            response = self.model.generate_content([final_prompt, background_image])
            
            response_text = response.text.strip()
            
            # Extract JSON from response (handle cases where Gemini adds explanations)
            json_str = None
            
            # Method 1: Look for ```json...``` block
            if '```json' in response_text:
                start = response_text.rfind('```json') + 7  # Find last occurrence
                end = response_text.find('```', start)
                if end != -1:
                    json_str = response_text[start:end].strip()
            
            # Method 2: Look for plain ``` block
            if not json_str and '```' in response_text:
                start = response_text.rfind('```') + 3
                end = response_text.find('```', start)
                if end != -1:
                    json_str = response_text[start:end].strip()
            
            # Method 3: Look for JSON object pattern {..."x":...}
            if not json_str:
                import re
                json_match = re.search(r'\{[^}]*"x"[^}]*"y"[^}]*"scale"[^}]*"rotation"[^}]*\}', response_text, re.DOTALL)
                if json_match:
                    json_str = json_match.group(0)
            
            # Method 4: Use entire response as fallback
            if not json_str:
                json_str = response_text
            
            print(f"🧹 Extracted JSON: {json_str[:200]}")
            
            placement = json.loads(json_str)
            return placement
        except Exception as e:
            print(f"❌ Error communicating with Gemini or parsing response: {e}")
            # Provide a fallback placement if Gemini fails
            fallback = {"x": background_image.width // 2, "y": background_image.height // 2, "scale": 0.5, "rotation": 0}
            print(f"⚠️ Using fallback placement: {fallback}")
            return fallback

    @staticmethod
    def overlay_object(background_image_bytes, object_image_bytes, placement):
        """
        Overlays an object onto a background image using the given placement parameters.
        This is a static method as it does not depend on the Gemini model instance.
        
        Args:
            background_image_bytes: Background image as bytes
            object_image_bytes: Object image as bytes (or path string)
            placement: Dict with x, y, scale, rotation
        """
        background = Image.open(io.BytesIO(background_image_bytes)).convert("RGBA")
        
        # Handle both bytes and path
        if isinstance(object_image_bytes, (str, bytes)) and isinstance(object_image_bytes, str):
            obj_image = Image.open(object_image_bytes).convert("RGBA")
        else:
            obj_image = Image.open(io.BytesIO(object_image_bytes)).convert("RGBA")

        # Resize object based on scale and background image size
        bg_width, bg_height = background.size
        base_size = min(bg_width, bg_height)
        
        # Handle potential zero or invalid scale value from the model
        scale = placement.get('scale', 0.5)
        if not isinstance(scale, (int, float)) or scale <= 0:
            print(f"   ⚠️ Invalid scale {scale}, using 0.5")
            scale = 0.5

        # Calculate new dimensions
        # Scale is relative to product's original width
        obj_new_width = int(obj_image.width * scale)
        
        # Preserve aspect ratio
        aspect_ratio = obj_image.height / obj_image.width
        obj_new_height = int(obj_new_width * aspect_ratio)
        
        print(f"   📏 Original product: {obj_image.width}x{obj_image.height}")
        print(f"   📊 Scale factor: {scale:.3f}")
        print(f"   📐 Resized to: {obj_new_width}x{obj_new_height}")
        
        obj_resized = obj_image.resize((obj_new_width, obj_new_height), Image.Resampling.LANCZOS)

        # Rotate object
        # PIL rotates counter-clockwise for positive angles
        # Negate the angle to match face orientation correctly
        rotation = placement.get('rotation', 0)
        obj_rotated = obj_resized.rotate(-rotation, expand=True, resample=Image.Resampling.BICUBIC)
        
        print(f"   🔄 Rotation: {rotation}° (PIL uses {-rotation}°)")
        print(f"   📦 After rotation: {obj_rotated.width}x{obj_rotated.height}")

        # Calculate top-left corner for pasting
        # CRITICAL: The x,y from placement is the CENTER of the glasses!
        # We need to convert center to top-left corner
        center_x = placement.get('x', background.width // 2)
        center_y = placement.get('y', background.height // 2)
        
        # Calculate top-left by subtracting half the rotated dimensions
        top_left_x = center_x - obj_rotated.width // 2
        top_left_y = center_y - obj_rotated.height // 2
        
        print(f"   🎯 Center coordinates: ({center_x}, {center_y})")
        print(f"   📍 Top-left paste position: ({top_left_x}, {top_left_y})")
        
        # Create a transparent layer to paste the rotated object on
        composite = Image.new('RGBA', background.size, (0, 0, 0, 0))
        composite.paste(obj_rotated, (top_left_x, top_left_y), obj_rotated)
        
        print(f"   🎨 Compositing onto {background.width}x{background.height} background")
        print(f"   ✅ Overlay complete!")

        # Alpha composite the two images
        final_image = Image.alpha_composite(background, composite)

        return final_image.convert("RGB")
