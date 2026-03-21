import os
import requests
from flask import Blueprint, jsonify
from config import Config

quote_bp = Blueprint('quote_bp', __name__)

@quote_bp.route('/daily-quote', methods=['GET'])
def get_daily_quote():
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        return jsonify({"quote": "The seeds you plant today will become tomorrow's harvest. Patience grows prosperity."}), 200

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    
    # Adding a timestamp-based "seed" in the prompt doesn't work for LLMs as expected, 
    # but we can ask for a 'unique' quote and mention it should be different from previous ones.
    import time
    timestamp = int(time.time())
    
    payload = {
        "contents": [{
            "parts": [{
                "text": f"Generate a unique, fresh motivational quote for farmers about patience, soil, rain, and harvest. Use the following context seed to ensure variety: {timestamp}. Do NOT include the seed or 'Reference ID' in your output. Maximum 20 words. Just output the quote text itself."
            }]
        }]
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
        quote_text = data['candidates'][0]['content']['parts'][0]['text'].strip().replace('"', '')
        return jsonify({"quote": quote_text}), 200
    except Exception as e:
        # Return the error message if in debug mode for easier troubleshooting
        error_msg = str(e)
        if hasattr(Config, 'DEBUG') and Config.DEBUG:
            print(f"Gemini API error: {error_msg}")
        return jsonify({"quote": "The seeds you plant today will become tomorrow's harvest. Patience grows prosperity."}), 200
