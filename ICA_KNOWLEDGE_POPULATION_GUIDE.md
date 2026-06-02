# ICA Context Studio Knowledge Population Guide

## 🎯 Objective
Populate ICA Context Studio with weather recommendation knowledge so MCP queries return actionable insights instead of `"search_status": "no_results"`.

---

## ✅ Current MCP Integration Status

### Working Components
- ✅ MCP connection successful
- ✅ `tools/list` successful  
- ✅ `tools/call` successful
- ✅ ICA query execution successful
- ✅ JSON-RPC response successful
- ✅ UI rendering successful
- ✅ Enhanced exception logging active

### Current Response
```json
{
  "search_status": "no_results",
  "vector_search_attempted": true,
  "lexical_search_attempted": true,
  "reason": "Both vector similarity search and lexical full-text search returned no matching chunks"
}
```

**Root Cause:** ICA Context Studio has no indexed weather knowledge content.

---

## 📚 Weather Knowledge to Upload

### 1. AQI (Air Quality Index) Guidance

#### AQI 0-50 (Good)
```
Air quality is satisfactory. Outdoor activities are safe for all groups. No health precautions needed. Ideal conditions for exercise, sports, and prolonged outdoor exposure.
```

#### AQI 51-100 (Moderate)
```
Air quality is acceptable for most people. Unusually sensitive individuals should consider limiting prolonged outdoor exertion. General population can engage in normal outdoor activities.
```

#### AQI 101-150 (Unhealthy for Sensitive Groups)
```
Members of sensitive groups (children, elderly, people with respiratory conditions) may experience health effects. Limit prolonged outdoor exertion. Wear N95 masks if necessary. General public should reduce intense outdoor activities.
```

#### AQI 151-200 (Unhealthy)
```
Everyone may begin to experience health effects. Sensitive groups should avoid outdoor activities. Wear N95 masks outdoors. Keep windows closed. Use air purifiers indoors. Limit outdoor exposure to essential activities only.
```

#### AQI 201-300 (Very Unhealthy)
```
Health alert: everyone may experience serious health effects. Avoid all outdoor activities. Stay indoors with air purifiers. Wear N95 masks if you must go outside. Seek medical attention if experiencing breathing difficulties.
```

#### AQI 301+ (Hazardous)
```
Health emergency: entire population is at risk. Stay indoors at all times. Seal windows and doors. Use HEPA air purifiers. Avoid all physical exertion. Seek immediate medical attention for any respiratory symptoms.
```

### 2. UV Index Protection Advice

#### UV 0-2 (Low)
```
Minimal sun protection required. Safe for extended outdoor activities. Sunglasses recommended on bright days.
```

#### UV 3-5 (Moderate)
```
Moderate sun protection needed. Wear sunscreen SPF 30+. Seek shade during midday hours (10 AM - 4 PM). Wear sunglasses and hat.
```

#### UV 6-7 (High)
```
High sun protection essential. Apply SPF 50+ sunscreen every 2 hours. Wear protective clothing, wide-brimmed hat, and UV-blocking sunglasses. Seek shade during peak hours.
```

#### UV 8-10 (Very High)
```
Extra sun protection required. Minimize sun exposure between 10 AM and 4 PM. Wear SPF 50+ sunscreen, reapply every hour. Cover skin with long sleeves and pants. Wear wide-brimmed hat and UV-400 sunglasses.
```

#### UV 11+ (Extreme)
```
Maximum sun protection critical. Avoid outdoor activities during peak hours. If outside, stay in shade. Apply SPF 50+ sunscreen every 30 minutes. Wear full protective clothing, hat, and sunglasses. Risk of skin damage in minutes.
```

### 3. Rain and Weather Alerts

#### Light Rain (< 2.5mm/hour)
```
Light drizzle expected. Carry umbrella or light raincoat. Roads may be slippery. Drive carefully. Outdoor activities can continue with rain gear.
```

#### Moderate Rain (2.5-10mm/hour)
```
Moderate rainfall expected. Carry waterproof gear. Avoid low-lying areas prone to flooding. Reduce driving speed. Visibility may be reduced. Postpone non-essential outdoor activities.
```

#### Heavy Rain (10-50mm/hour)
```
Heavy rainfall warning. Stay indoors if possible. Avoid driving through flooded areas. Risk of flash flooding in low-lying regions. Secure outdoor items. Monitor weather updates closely.
```

#### Very Heavy Rain (> 50mm/hour)
```
Severe weather alert. Stay indoors. Do not attempt to drive. Risk of severe flooding and landslides. Keep emergency supplies ready. Follow local authority instructions. Avoid basements and underground areas.
```

### 4. Temperature-Based Recommendations

#### Cold (< 10°C)
```
Wear warm layers: thermal underwear, sweater, jacket, gloves, and hat. Protect extremities from frostbite. Limit outdoor exposure. Stay hydrated. Watch for signs of hypothermia.
```

#### Cool (10-20°C)
```
Wear light jacket or sweater. Comfortable for outdoor activities. Layer clothing for temperature changes. Good conditions for exercise and sports.
```

#### Warm (20-30°C)
```
Wear light, breathable clothing. Stay hydrated. Use sunscreen. Ideal for outdoor activities. Avoid strenuous exercise during peak afternoon heat.
```

#### Hot (30-35°C)
```
Wear loose, light-colored, breathable clothing. Drink water frequently (8-10 glasses/day). Avoid outdoor activities between 12 PM and 4 PM. Seek air-conditioned spaces. Watch for heat exhaustion symptoms.
```

#### Very Hot (35-40°C)
```
Extreme heat warning. Minimize outdoor exposure. Wear minimal, light-colored clothing. Drink water every 15-20 minutes. Avoid all strenuous activities. Stay in air-conditioned spaces. Risk of heat stroke.
```

#### Extreme Heat (> 40°C)
```
Heat emergency. Stay indoors with air conditioning. Drink water constantly. Avoid all outdoor activities. Check on elderly and vulnerable individuals. Seek medical attention for dizziness, nausea, or confusion.
```

### 5. Outdoor Activity Guidance

#### Ideal Conditions
```
Temperature 15-25°C, AQI < 50, UV < 6, No rain. Perfect for: Running, cycling, hiking, sports, picnics, outdoor events. Stay hydrated and use sunscreen.
```

#### Good Conditions
```
Temperature 10-30°C, AQI 50-100, UV 3-7, Light rain possible. Suitable for: Most outdoor activities with appropriate gear. Monitor weather changes.
```

#### Fair Conditions
```
Temperature 5-35°C, AQI 100-150, UV 7-9, Moderate rain possible. Limited outdoor activities recommended. Sensitive groups should take precautions.
```

#### Poor Conditions
```
Temperature < 5°C or > 35°C, AQI 150-200, UV > 9, Heavy rain. Avoid prolonged outdoor exposure. Indoor activities recommended.
```

#### Hazardous Conditions
```
Extreme temperature, AQI > 200, Severe weather. Stay indoors. Cancel all outdoor plans. Follow emergency protocols.
```

### 6. Travel Weather Precautions

#### Clear Weather Travel
```
Ideal travel conditions. Check traffic updates. Carry water and snacks. Plan rest stops every 2 hours. Ensure vehicle maintenance is current.
```

#### Rainy Weather Travel
```
Reduce speed by 30%. Increase following distance. Turn on headlights. Avoid sudden braking. Watch for hydroplaning. Carry emergency kit with flashlight, first aid, and blankets.
```

#### Foggy Conditions
```
Use low-beam headlights and fog lights. Reduce speed significantly. Use road markings as guide. Avoid overtaking. Pull over if visibility drops below 50 meters.
```

#### Extreme Weather Travel
```
Postpone non-essential travel. If travel is necessary: inform someone of route and ETA, carry emergency supplies, keep phone charged, monitor weather updates, have alternate routes planned.
```

### 7. Hydration and Health Advice

#### Normal Conditions (20-25°C)
```
Drink 8 glasses (2 liters) of water daily. Eat balanced meals. Maintain regular exercise routine.
```

#### Hot Weather (25-35°C)
```
Increase water intake to 10-12 glasses (2.5-3 liters) daily. Drink before feeling thirsty. Avoid alcohol and caffeine. Eat light, frequent meals. Include electrolyte drinks during exercise.
```

#### Very Hot Weather (> 35°C)
```
Drink 12-15 glasses (3-4 liters) of water daily. Sip water every 15 minutes. Consume electrolyte solutions. Eat water-rich fruits (watermelon, cucumber). Avoid heavy meals. Monitor urine color (should be pale yellow).
```

#### Cold Weather (< 10°C)
```
Drink warm fluids regularly. Maintain calorie intake. Eat warm, nutritious meals. Avoid alcohol (causes heat loss). Watch for dehydration signs despite cold.
```

### 8. Seasonal Weather Safety

#### Summer Safety
```
Peak heat hours: 12 PM - 4 PM. Seek shade and air conditioning. Wear light colors. Use SPF 50+ sunscreen. Stay hydrated. Watch for heat exhaustion: dizziness, nausea, rapid heartbeat.
```

#### Monsoon Safety
```
Avoid waterlogged areas. Don't walk through flowing water. Stay away from electric poles and wires. Keep emergency contacts handy. Stock non-perishable food. Charge devices regularly.
```

#### Winter Safety
```
Layer clothing. Protect extremities. Watch for ice on roads. Keep emergency supplies in vehicle. Maintain heating systems. Check on elderly neighbors. Prevent carbon monoxide poisoning.
```

#### Spring/Autumn Safety
```
Prepare for temperature fluctuations. Carry layers. Monitor pollen counts if allergic. Be aware of sudden weather changes. Keep umbrella handy.
```

### 9. Humidity-Based Recommendations

#### Low Humidity (< 30%)
```
Use moisturizer for skin. Drink extra water. Use humidifier indoors. Protect lips with balm. May cause dry throat and nasal passages.
```

#### Comfortable Humidity (30-60%)
```
Ideal conditions. No special precautions needed. Comfortable for most activities.
```

#### High Humidity (60-80%)
```
Feels warmer than actual temperature. Increase water intake. Wear breathable fabrics. Use dehumidifier indoors. Mold risk increases.
```

#### Very High Humidity (> 80%)
```
Oppressive conditions. Limit outdoor activities. Stay in air-conditioned spaces. Drink water frequently. Watch for heat-related illnesses. Dry clothing and shoes properly.
```

### 10. Wind-Based Recommendations

#### Calm (< 10 km/h)
```
Ideal conditions for outdoor activities. No wind-related precautions needed.
```

#### Light Breeze (10-20 km/h)
```
Pleasant conditions. Secure loose outdoor items. Good for sailing and kite flying.
```

#### Moderate Wind (20-40 km/h)
```
Secure outdoor furniture. Be cautious with umbrellas. Dust and debris may blow. Difficult for cycling.
```

#### Strong Wind (40-60 km/h)
```
Stay indoors if possible. Avoid parking under trees. Secure all outdoor items. Driving may be difficult, especially for high-profile vehicles.
```

#### Very Strong Wind (> 60 km/h)
```
Weather warning. Stay indoors. Risk of falling trees and flying debris. Avoid travel. Power outages possible. Follow emergency protocols.
```

---

## 🏗️ Ontology Structure

### Entities to Create

#### 1. City Entity
```json
{
  "@type": "City",
  "properties": {
    "name": "string",
    "country": "string",
    "coordinates": "geo:Point",
    "timezone": "string"
  }
}
```

#### 2. WeatherCondition Entity
```json
{
  "@type": "WeatherCondition",
  "properties": {
    "temperature": "number",
    "humidity": "number",
    "aqi": "number",
    "uvIndex": "number",
    "description": "string",
    "windSpeed": "number",
    "precipitation": "number"
  }
}
```

#### 3. AQILevel Entity
```json
{
  "@type": "AQILevel",
  "properties": {
    "value": "number",
    "category": "string",
    "healthImplications": "string",
    "cautionaryStatement": "string"
  }
}
```

#### 4. UVLevel Entity
```json
{
  "@type": "UVLevel",
  "properties": {
    "index": "number",
    "category": "string",
    "protectionRequired": "string",
    "recommendations": "string"
  }
}
```

#### 5. WeatherRecommendation Entity
```json
{
  "@type": "WeatherRecommendation",
  "properties": {
    "category": "string",
    "priority": "string",
    "description": "string",
    "actionItems": "array"
  }
}
```

#### 6. HealthAdvice Entity
```json
{
  "@type": "HealthAdvice",
  "properties": {
    "condition": "string",
    "riskLevel": "string",
    "symptoms": "array",
    "precautions": "array",
    "emergencyActions": "array"
  }
}
```

#### 7. TravelAdvice Entity
```json
{
  "@type": "TravelAdvice",
  "properties": {
    "weatherCondition": "string",
    "safetyLevel": "string",
    "recommendations": "array",
    "emergencyContacts": "array"
  }
}
```

### Relationships to Define

```
City --hasWeatherCondition--> WeatherCondition
WeatherCondition --hasAQILevel--> AQILevel
WeatherCondition --hasUVLevel--> UVLevel
WeatherCondition --requiresRecommendation--> WeatherRecommendation
WeatherRecommendation --providesHealthAdvice--> HealthAdvice
WeatherRecommendation --providesTravelAdvice--> TravelAdvice
AQILevel --triggersHealthAdvice--> HealthAdvice
UVLevel --requiresProtection--> HealthAdvice
```

---

## 📤 Upload Methods

### Method 1: ICA Context Studio UI
1. Log into ICA Context Studio admin interface
2. Navigate to Knowledge Base section
3. Create new knowledge chunks for each category
4. Tag with appropriate metadata (category, priority, conditions)
5. Enable vector indexing
6. Trigger reindexing

### Method 2: ICA API Upload
```bash
curl -X POST "https://ica-context-studio-url/api/v1/knowledge/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "context_id": "ctx_fc39071914of",
    "chunks": [
      {
        "content": "AQI 0-50 (Good): Air quality is satisfactory...",
        "metadata": {
          "category": "aqi_guidance",
          "aqi_range": "0-50",
          "priority": "high"
        }
      }
    ]
  }'
```

### Method 3: Bulk CSV Upload
Create CSV file with columns:
- content
- category
- priority
- conditions
- tags

Upload via ICA admin interface.

### Method 4: MCP Post-Events Tool
Use the `context-broker-post-events` tool to trigger ingestion:

```json
{
  "method": "tools/call",
  "params": {
    "name": "context-broker-post-events",
    "arguments": {
      "context_id": "ctx_fc39071914of",
      "event_type": "knowledge_upload",
      "payload": {
        "source_id": "weather-knowledge-base",
        "source_type": "manual",
        "paths": ["/weather-recommendations/aqi-guidance.json"]
      }
    }
  }
}
```

---

## ✅ Verification Steps

### 1. Check Knowledge Upload
```bash
curl -X POST "https://ica-context-studio-url/api/v1/tools/call" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "context-broker-vector-query",
      "arguments": {
        "context_id": "ctx_fc39071914of",
        "AgentPersona": "WeatherAdvisor",
        "query": "AQI recommendations",
        "top_k": 5
      }
    }
  }'
```

### 2. Test MCP Integration
1. Open Weather Pro application: http://localhost:8080
2. Navigate to AI Weather Advisor
3. Enter city: "Delhi"
4. Click "Get AI Recommendations"
5. Verify response contains actionable recommendations (not "no_results")

### 3. Monitor Logs
Check Terminal 3 for:
```
Step 4b: Full MCP response: {...}
"search_status": "success"
"total_items": 5
```

---

## 🎯 Expected Result

### Before Knowledge Upload
```json
{
  "search_status": "no_results",
  "reason": "Both vector similarity search and lexical full-text search returned no matching chunks"
}
```

### After Knowledge Upload
```json
{
  "search_status": "success",
  "total_items": 5,
  "items": {
    "vector": [
      {
        "content": "AQI 101-150 (Unhealthy for Sensitive Groups): Members of sensitive groups...",
        "metadata": {
          "category": "aqi_guidance",
          "score": 0.92
        }
      },
      {
        "content": "UV Index 6-7 (High): High sun protection essential...",
        "metadata": {
          "category": "uv_protection",
          "score": 0.88
        }
      }
    ]
  }
}
```

---

## 📞 Support

For ICA Context Studio knowledge upload assistance:
- Contact ICA admin team
- Refer to ICA Context Studio documentation
- Use ICA support portal

**Note:** Knowledge population requires ICA Context Studio admin access, which is outside the scope of the Weather Pro application codebase.

---

## ✅ Summary

**Current Status:** MCP integration fully operational ✅  
**Next Step:** Populate ICA with weather knowledge (requires ICA admin access)  
**Goal:** Enable AI Weather Advisor to return actionable recommendations

**Do NOT modify the working MCP integration pipeline.**