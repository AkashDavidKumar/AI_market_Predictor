import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load .env from the current directory
load_dotenv()

api_key = os.environ.get('GEMINI_API_KEY')
print(f"Using API Key: {api_key[:5]}...{api_key[-5:] if api_key else 'None'}")

if not api_key:
    print("Error: GEMINI_API_KEY not found in .env")
    exit(1)

genai.configure(api_key=api_key)

try:
    print("Listing available models...")
    models = genai.list_models()
    for m in models:
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Failed to list models: {e}")
