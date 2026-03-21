import os
import datetime
import traceback

# Use the new google-genai SDK
from google import genai
from google.genai import types

from database.db_connection import alerts_collection, prices_collection, predictions_collection
from services.weather_service import WeatherService

class ChatbotService:
    @staticmethod
    def get_assistant_response(user_message, user_id=None):
        try:
            message = user_message.lower()

            # 1. Platform-specific data detection
            platform_context = ""

            if any(word in message for word in ["alert", "my alerts", "show alerts"]):
                alerts = list(alerts_collection.find({"user_id": user_id}).limit(5)) if user_id else []
                if alerts:
                    alert_list = ", ".join([
                        f"{a.get('crop_name', 'Unknown')} ({a.get('condition', '?')} ₹{a.get('target_price', '---')})"
                        for a in alerts
                    ])
                    platform_context = f"The user has {len(alerts)} active price alert(s): {alert_list}."
                else:
                    platform_context = "The user currently has no active price alerts."

            elif any(word in message for word in ["weather", "temperature", "temp"]):
                weather = WeatherService.get_weather("Tirupattur")
                platform_context = (
                    f"Today's weather in {weather.get('location', 'your area')} is "
                    f"{weather.get('temperature', 'N/A')}°C and {weather.get('condition', 'N/A')}."
                )

            elif any(word in message for word in ["best price", "market price", "today's price", "price today"]):
                best_price_doc = prices_collection.find_one({}, sort=[("price", -1)])
                if best_price_doc:
                    crop = best_price_doc.get('crop_name', best_price_doc.get('crop', 'Unknown'))
                    platform_context = (
                        f"Today's best market price is ₹{best_price_doc.get('price')} "
                        f"for {crop} in {best_price_doc.get('market', 'Unknown Market')}."
                    )

            elif any(word in message for word in ["recommend", "suggestion", "best crop", "which crop"]):
                best = prices_collection.find_one({}, sort=[("price", -1)])
                if best:
                    crop = best.get('crop_name', best.get('crop', 'Unknown'))
                    platform_context = f"Based on current market data, {crop} has the highest price right now."

            elif "sell" in message:
                crops = ["wheat", "soybean", "cotton", "rice", "tomato", "onion"]
                target_crop = next((c for c in crops if c in message), None)
                if target_crop:
                    pred = predictions_collection.find_one(
                        {"crop_name": target_crop.capitalize()}, sort=[("created_at", -1)]
                    )
                    if pred:
                        platform_context = (
                            f"Our AI prediction for {target_crop} is "
                            f"₹{pred.get('predicted_price')} on {pred.get('predicted_date')}. "
                            f"Check the Smart Sell dashboard for the full recommendation."
                        )

            # 2. Gemini Integration using new google-genai SDK
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                if platform_context:
                    return f"Platform data: {platform_context}"
                return "I'm your FormarAsOwner assistant. Gemini AI is not configured yet."

            from google.genai import types as genai_types
            client = genai.Client(
                api_key=api_key,
                http_options=genai_types.HttpOptions(api_version="v1beta")
            )

            system_instruction = (
                "You are 'FormarAsOwner Assistant', a helpful and knowledgeable agricultural advisor. "
                "You help farmers with market intelligence, crop prices, weather, and farming practices. "
                "Keep your answers concise, friendly, and practical."
            )

            user_prompt = user_message
            if platform_context:
                user_prompt = f"[Platform context: {platform_context}]\n\nUser question: {user_message}"

            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                )
            )
            return response.text

        except Exception as e:
            error_str = str(e)
            with open("debug_error.log", "a") as f:
                f.write(f"\n[{datetime.datetime.now()}] ChatbotService Exception: {error_str}\n")
                traceback.print_exc(file=f)
            # Provide user-friendly messages based on error type
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                return "I've reached my AI usage limit for now (free tier quota). I'll be back online soon! In the meantime, check your Dashboard for real-time market data."
            elif "404" in error_str or "not found" in error_str.lower():
                return "My AI brain is being updated. Please try again in a moment."
            return "I encountered a small issue. Please try rephrasing your question."
