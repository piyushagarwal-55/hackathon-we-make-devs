import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv('ecommerce_agent/.env')

# Configure API
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("ERROR: GEMINI_API_KEY not found in .env file")
    exit(1)

genai.configure(api_key=api_key)

print("=" * 80)
print("AVAILABLE GEMINI MODELS FOR YOUR API KEY")
print("=" * 80)

try:
    models = genai.list_models()
    
    # Filter models that support generateContent
    content_models = []
    for model in models:
        if 'generateContent' in model.supported_generation_methods:
            content_models.append(model)
    
    print(f"\nFound {len(content_models)} models that support generateContent:\n")
    
    for i, model in enumerate(content_models, 1):
        print(f"{i}. Model Name: {model.name}")
        print(f"   Display Name: {model.display_name}")
        print(f"   Description: {model.description[:100]}..." if len(model.description) > 100 else f"   Description: {model.description}")
        print(f"   Supported Methods: {', '.join(model.supported_generation_methods)}")
        print()
    
    print("=" * 80)
    print("RECOMMENDED MODELS TO USE:")
    print("=" * 80)
    
    # Find models with "flash" in name (typically faster and cheaper)
    flash_models = [m for m in content_models if 'flash' in m.name.lower()]
    
    if flash_models:
        print("\nFast/Free tier models (Flash):")
        for model in flash_models:
            # Extract just the model identifier
            model_id = model.name.replace('models/', '')
            print(f"  - {model_id}")
            print(f"    ({model.display_name})")
    
    print("\n" + "=" * 80)
    print("SUGGESTED MODEL TO USE IN YOUR CODE:")
    print("=" * 80)
    
    if flash_models:
        suggested = flash_models[0].name.replace('models/', '')
        print(f"\nmodel=\"{suggested}\"")
        print(f"\nThis is: {flash_models[0].display_name}")
    
except Exception as e:
    print(f"\nERROR: {e}")
    print("\nTrying alternative method...")
    
    # Try direct API call
    try:
        from google.ai import generativelanguage as glm
        client = glm.GenerativeServiceClient(
            api_key=api_key
        )
        
        print("Alternative check - trying common model names:")
        common_models = [
            "gemini-pro",
            "gemini-1.5-pro",
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-2.0-flash-exp",
            "gemini-flash-1.5",
        ]
        
        for model_name in common_models:
            print(f"  - {model_name}")
        
    except Exception as e2:
        print(f"Alternative method also failed: {e2}")

print("\n" + "=" * 80)
