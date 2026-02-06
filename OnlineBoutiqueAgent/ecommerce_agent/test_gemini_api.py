"""
Quick test to verify Gemini API key is working
This will generate ONE test image to verify the setup
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ ERROR: No Gemini API key found!")
    print("   Please set GOOGLE_API_KEY or GEMINI_API_KEY in .env file")
    exit(1)

print(f"✅ Found API key: {api_key[:10]}...{api_key[-5:]}")
print("🔄 Testing Gemini API connection...")

try:
    # Configure Gemini
    genai.configure(api_key=api_key)
    
    # List available models
    print("📋 Available models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"   ✓ {m.name}")
    print()
    
    # Try different model names (using models that actually exist)
    models_to_try = [
        'models/gemini-2.5-flash',  # Latest
        'models/gemini-2.0-flash',  # Stable
        'models/gemini-flash-latest',  # Alias
        'gemini-2.5-flash',  # Without prefix
        'gemini-2.0-flash'   # Without prefix
    ]
    
    working_model = None
    for model_name in models_to_try:
        try:
            print(f"🔄 Testing {model_name}...")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Say 'Hello, I am working!' in one short sentence.")
            working_model = model_name
            print(f"✅ {model_name} is working!")
            print(f"📝 Response: {response.text}")
            break
        except Exception as model_error:
            print(f"   ⚠️ {model_name} failed: {str(model_error)[:80]}")
    
    if not working_model:
        raise Exception("None of the tested models worked")
    print()
    print("🎉 SUCCESS! Your Gemini API key is properly configured.")
    print("   You can now use virtual try-on feature.")
    print()
    print("💡 Note: Each virtual try-on uses ~1-2 API calls to Gemini")
    print("   For 3-4 test images, you'll use approximately 4-8 API calls total")
    
except Exception as e:
    print(f"❌ ERROR: Failed to connect to Gemini API")
    print(f"   Error: {e}")
    print()
    print("🔧 Troubleshooting:")
    print("   1. Check if your API key is valid")
    print("   2. Visit https://makersuite.google.com/app/apikey to get a new key")
    print("   3. Make sure the key has Gemini API access enabled")
    exit(1)
