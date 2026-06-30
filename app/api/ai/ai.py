import sys
import json

def main():
    try:
        # Read the JSON body sent from Node.js stdin
        input_data = sys.stdin.read()
        if not input_data.strip():
            data = {}
        else:
            data = json.loads(input_data)
    except Exception as e:
        data = {"error": f"Failed to parse stdin payload: {str(e)}"}
    
    # Extract metadata properties for display in mock responses
    crop_id = data.get("cropId", "general")
    location = data.get("location", {})
    weather = data.get("weather", {})
    language = data.get("language", "en")
    
    location_name = location.get("name", "Unknown Location")
    lat = location.get("lat", 0.0)
    lng = location.get("lng", 0.0)
    
    current_weather = weather.get("current") or {}
    current_temp = current_weather.get("temp", "N/A")
    current_cond = current_weather.get("condition", "N/A")
    
    # Construct a dynamically templated mock report representing all sent telemetry
    report = f"--- MOCK AI AGRONOMIST ADVISORY REPORT (PYTHON BACKEND) ---\n"
    report += f"Generated for Location: {location_name} ({lat:.4f}°N, {lng:.4f}°E)\n"
    report += f"Crop Selection Context: {crop_id.upper()}\n"
    report += f"Interface Language: {language}\n"
    report += f"Microclimate Temp: {current_temp}°C, Condition: {current_cond}\n"
    report += "---------------------------------------------------------\n\n"
    
    report += "Analysis of Weather Data Passed to Python:\n"
    if not current_weather:
        report += " - [Warning] No current climate telemetry provided.\n"
    else:
        report += f" - Thermal index is at {current_temp}°C with humidity {current_weather.get('humidity', 'N/A')}%.\n"
        report += f" - Wind dynamics: {current_weather.get('windKph', 'N/A')} km/h, gusting to {current_weather.get('windGustsKph', 'N/A')} km/h.\n"
        report += f" - Barometric pressure indicates {current_weather.get('pressureMb', 'N/A')} mb.\n"
    
    hourly_slots = weather.get("hourly") or []
    if hourly_slots:
        report += f"\nHourly Forecast Analysis (Next {len(hourly_slots)} slots):\n"
        for h in hourly_slots:
            report += f" - {h.get('time', 'N/A')}: {h.get('temp', 'N/A')}°C ({h.get('condition', 'N/A')}) | Rain Chance: {h.get('rainChance', 'N/A')}%\n"
            
    daily_slots = weather.get("forecast") or []
    if daily_slots:
        report += f"\nDaily Extended Analysis (Next {len(daily_slots)} days):\n"
        for f in daily_slots:
            report += f" - {f.get('date', 'N/A')} ({f.get('day', 'N/A')}): High {f.get('high', 'N/A')}°C, Low {f.get('low', 'N/A')}°C ({f.get('condition', 'N/A')})\n"
            
    report += "\nRecommendation Insights:\n"
    if crop_id == "wheat":
        report += " - Optimize canopy emergence cycles. Heat-stress requires light micro-sprinkling early in the morning.\n"
    elif crop_id == "maize":
        report += " - Severe leaching risk detected under upcoming precipitation loads. Suspend fertilizer operations.\n"
    else:
        report += " - Normal field operation cycles. Ensure drainage channels remain clear of debris.\n"
        
    output = {
        "advisory": report
    }
    
    print(json.dumps(output))

if __name__ == "__main__":
    main()
