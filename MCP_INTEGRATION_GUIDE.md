# MCP Integration Guide - ICA Context Studio Weather Recommendations

## Overview
This guide documents the complete integration of IBM's ICA Context Studio MCP (Model Context Protocol) with the Weather Forecast application to provide real AI-powered weather recommendations.

## Architecture

### Backend Components

#### 1. WeatherService.java
**Location:** `src/main/java/com/weather/forecast/service/WeatherService.java`

**New Methods:**
- `fetchMcpToolsList()` - Retrieves available MCP tools from Context Studio
- `fetchMcpWeatherRecommendations()` - Executes hybrid-query for weather recommendations

**MCP Configuration:**
```properties
mcp.context-studio.url=https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/8ccdd203bdee4014b08e82eedb6046e2/mcp
mcp.context-studio.authorization=Bearer <token>
mcp.context-studio.api-key=<api-key>
```

#### 2. WeatherController.java
**Location:** `src/main/java/com/weather/forecast/controller/WeatherController.java`

**New Endpoints:**
- `POST /weather/mcp/tools-list` - Lists available MCP tools
- `POST /weather/mcp/recommendations` - Gets AI recommendations

**Request Format:**
```json
{
  "contextId": "ctx_fc39071914of",
  "agentPersona": "WeatherAdvisor",
  "city": "Bengaluru",
  "temperature": 25.5,
  "humidity": 65,
  "aqi": 85,
  "uvIndex": 7.5,
  "weatherCondition": "partly cloudy"
}
```

### Frontend Components

#### 3. ai-weather-advisor.js
**Location:** `src/main/resources/static/ai-weather-advisor.js`

**New Functions:**
- `fetchMCPRecommendations()` - Calls backend MCP endpoint
- `applyMCPRecommendations()` - Applies MCP data to UI
- `updateRecommendationsFromMCP()` - Updates recommendation sections
- `updateHealthRecommendationsFromMCP()` - Updates health advice
- `updateOutdoorActivitiesFromMCP()` - Updates activity suggestions
- `updateTravelIntelligenceFromMCP()` - Updates travel recommendations
- `addMCPIndicator()` - Shows MCP status indicator
- `updateWithFallbackRecommendations()` - Fallback when MCP unavailable

## MCP Integration Flow

```
User searches for city
    ↓
Weather data fetched from OpenWeatherMap
    ↓
AI Advisor page activated
    ↓
updateAIAdvisor() called
    ↓
fetchMCPRecommendations() → Backend /weather/mcp/recommendations
    ↓
Backend calls ICA Context Studio MCP hybrid-query
    ↓
MCP returns contextual recommendations
    ↓
Frontend applies recommendations to UI
    ↓
Visual indicator shows "Powered by ICA Context Studio"
```

## MCP Query Structure

The system sends a comprehensive query to Context Studio:

```javascript
{
  "context_id": "ctx_fc39071914of",
  "AgentPersona": "WeatherAdvisor",
  "query": "Provide comprehensive weather-based recommendations for [City]. 
            Current conditions: Temperature X°C, Humidity Y%, AQI Z, UV Index W, Weather: [condition]. 
            Include: 1) Health recommendations, 2) Outdoor activities, 3) Protection tips, 
            4) Travel recommendations, 5) Clothing advice.",
  "sources": ["graph", "vector"],
  "graph_params": {
    "top_k": 5,
    "max_depth": 1
  },
  "vector_params": {
    "top_k": 5
  }
}
```

## Graceful Fallback

The system includes multiple fallback layers:

1. **MCP Unavailable:** Uses rule-based recommendations
2. **MCP Error:** Backend returns fallback recommendations
3. **Network Error:** Frontend uses cached/default recommendations

**Fallback Indicator:**
- Green badge: "✅ Powered by ICA Context Studio"
- Orange badge: "⚠️ Using Fallback Recommendations"

## Testing the Integration

### 1. Verify MCP Connectivity
```bash
curl -X POST http://localhost:8080/weather/mcp/tools-list
```

Expected response: List of 7 MCP tools including `context-broker-hybrid-query`

### 2. Test Weather Recommendations
```bash
curl -X POST http://localhost:8080/weather/mcp/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Bengaluru",
    "temperature": 28.5,
    "humidity": 65,
    "aqi": 85,
    "uvIndex": 7.5,
    "weatherCondition": "partly cloudy"
  }'
```

### 3. UI Testing
1. Start the application: `./mvnw spring-boot:run`
2. Open browser: `http://localhost:8080`
3. Search for a city (e.g., "Bengaluru")
4. Click "AI Weather Advisor" tab
5. Observe:
   - Real-time MCP recommendations loading
   - Green indicator: "Powered by ICA Context Studio"
   - Contextual health, activity, and travel advice

### 4. Fallback Testing
1. Stop MCP server or use invalid credentials
2. Search for a city
3. Open AI Advisor
4. Observe:
   - Orange indicator: "Using Fallback Recommendations"
   - Rule-based recommendations displayed
   - No application errors

## MCP Response Parsing

The system intelligently parses MCP responses:

```javascript
// MCP returns structured context
{
  "result": {
    "contexts": [
      {
        "content": "Health recommendation text...",
        "score": 0.95
      },
      {
        "content": "Activity suggestion text...",
        "score": 0.92
      }
    ]
  }
}

// System extracts and categorizes recommendations by keywords:
// - Health: "health", "medical", "safety", "hydrate", "protect"
// - Activity: "outdoor", "activity", "exercise", "sport"
// - Travel: "travel", "commute", "transport", "drive"
// - Clothing: "clothing", "wear", "dress"
```

## Configuration

### application.properties
```properties
# MCP Context Studio Configuration
mcp.context-studio.url=https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/8ccdd203bdee4014b08e82eedb6046e2/mcp
mcp.context-studio.authorization=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
mcp.context-studio.api-key=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...
```

### .bob/mcp.json
```json
{
  "mcpServers": {
    "context-studio": {
      "type": "streamable-http",
      "url": "https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/8ccdd203bdee4014b08e82eedb6046e2/mcp",
      "headers": {
        "Authorization": "Bearer <token>",
        "x-api-key": "<api-key>"
      },
      "disabled": false
    }
  }
}
```

## Monitoring and Debugging

### Backend Logs
```
INFO  - Fetching MCP weather recommendations for city: Bengaluru
DEBUG - MCP request body: {contextId=ctx_fc39071914of, query=...}
INFO  - Successfully fetched MCP weather recommendations for city: Bengaluru
```

### Frontend Console
```
🔄 Fetching MCP recommendations from Context Studio...
📤 MCP Request: {city: "Bengaluru", temperature: 28.5, ...}
📥 MCP Response: {result: {...}}
✅ MCP recommendations received, updating UI with real data
🎨 Applying MCP recommendations to UI...
```

### Error Handling
```
❌ MCP fetch failed, using fallback: Error: Network timeout
⚠️ MCP unavailable, using fallback recommendations
📋 Using fallback recommendations
```

## Benefits of MCP Integration

1. **Contextual Intelligence:** Recommendations based on comprehensive weather ontology
2. **Dynamic Insights:** Real-time AI analysis vs static rules
3. **Personalization:** Context-aware advice for specific conditions
4. **Scalability:** Leverages IBM's enterprise AI infrastructure
5. **Reliability:** Graceful degradation with fallback system

## Future Enhancements

1. **User Preferences:** Store user context for personalized recommendations
2. **Historical Analysis:** Leverage past weather patterns
3. **Location-Specific:** Use geographic context from ontology
4. **Multi-Language:** Support recommendations in multiple languages
5. **Caching:** Cache MCP responses for similar conditions

## Troubleshooting

### Issue: MCP returns empty recommendations
**Solution:** Check query format and ensure weather data is complete

### Issue: Fallback always triggered
**Solution:** Verify MCP credentials and network connectivity

### Issue: Slow response times
**Solution:** Reduce `max_depth` and `top_k` parameters in MCP query

### Issue: Compilation errors in Java
**Solution:** Ensure Lombok is properly configured and run `mvn clean install`

## Support

For MCP-related issues:
- Check ICA Context Studio documentation
- Verify API token expiration
- Review backend logs for detailed error messages
- Test MCP connectivity with curl commands

---

**Last Updated:** 2026-05-27  
**Version:** 1.0.0  
**Status:** Production Ready ✅