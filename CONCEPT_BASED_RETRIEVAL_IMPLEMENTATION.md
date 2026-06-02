# Concept-Based Retrieval Implementation Guide

## Problem Analysis

### Current Issue
The MCP query generation is too specific, including:
- City name ("Delhi", "Bengaluru")
- Exact numerical values (Temperature 34.1°C, AQI 61)
- Specific conditions

This prevents retrieval because the knowledge base contains **generic weather intelligence** documents about:
- AQI categories (Good, Moderate, Unhealthy, etc.)
- Temperature ranges (Cold, Warm, Hot, etc.)
- UV categories (Low, Moderate, High, etc.)
- Health recommendations
- Outdoor activity suggestions
- Travel recommendations

### Root Cause
**Query Mismatch**: City-specific queries don't match generic knowledge documents.

**Current Query Example:**
```
"Provide comprehensive weather-based recommendations for Delhi. 
Current conditions: Temperature 34.1°C, Humidity 43%, AQI 61, UV Index 5.0, Weather: haze."
```

**Result:** No chunks retrieved (vector similarity = 0.0)

---

## Solution: Concept-Based Multi-Query Retrieval

### Strategy Overview

1. **Extract Weather Concepts** from current conditions
2. **Generate Multiple Targeted Queries** using concepts
3. **Retrieve Relevant Chunks** from knowledge documents
4. **Aggregate Results** with debugging information

### Implementation Steps

#### Step 1: Concept Extraction

Convert numerical values to categorical concepts:

```java
private String getAQICategory(Integer aqi) {
    if (aqi <= 50) return "good";
    if (aqi <= 100) return "moderate";
    if (aqi <= 150) return "unhealthy for sensitive groups";
    if (aqi <= 200) return "unhealthy";
    if (aqi <= 300) return "very unhealthy";
    return "hazardous";
}

private String getTemperatureCategory(Double temp) {
    if (temp < 0) return "freezing";
    if (temp < 10) return "cold";
    if (temp < 20) return "cool";
    if (temp < 30) return "warm";
    if (temp < 35) return "hot";
    return "very hot";
}

private String getUVCategory(Double uv) {
    if (uv < 3) return "low";
    if (uv < 6) return "moderate";
    if (uv < 8) return "high";
    if (uv < 11) return "very high";
    return "extreme";
}
```

#### Step 2: Generate Concept-Based Queries

Create 5 targeted queries focusing on concepts:

**Query 1: AQI and Health**
```
"Air quality index moderate health recommendations respiratory protection 
sensitive groups pollutants PM2.5 breathing"
```

**Query 2: Temperature**
```
"Temperature hot weather clothing advice heat protection hydration comfort"
```

**Query 3: UV Protection**
```
"UV index moderate sun protection sunscreen SPF skin damage outdoor exposure"
```

**Query 4: Outdoor Activities**
```
"Outdoor activities haze running cycling hiking sports suitability conditions"
```

**Query 5: Travel**
```
"Travel recommendations haze visibility safety precautions planning commute"
```

#### Step 3: Execute Multiple Vector Queries

```java
public Map<String, Object> fetchMcpWeatherRecommendations(...) {
    // Extract concepts
    String aqiCategory = getAQICategory(aqi);
    String tempCategory = getTemperatureCategory(temperature);
    String uvCategory = getUVCategory(uvIndex);
    
    logger.info("Weather Concepts: AQI={} ({}), Temp={} ({}), UV={} ({})",
        aqi, aqiCategory, temperature, tempCategory, uvIndex, uvCategory);
    
    // Execute 5 targeted queries
    List<Map<String, Object>> allResults = new ArrayList<>();
    
    // Query 1: AQI
    String aqiQuery = String.format(
        "Air quality index %s health recommendations respiratory protection",
        aqiCategory
    );
    allResults.add(executeSingleVectorQuery(contextId, agentPersona, aqiQuery, 10));
    
    // Query 2: Temperature
    String tempQuery = String.format(
        "Temperature %s weather clothing advice heat cold protection",
        tempCategory
    );
    allResults.add(executeSingleVectorQuery(contextId, agentPersona, tempQuery, 10));
    
    // ... (3 more queries)
    
    // Aggregate results
    return aggregateResults(allResults, city, temperature, humidity, aqi, uvIndex, weatherCondition);
}
```

#### Step 4: Single Vector Query Execution

```java
private Map<String, Object> executeSingleVectorQuery(
        String contextId, String agentPersona, String query, int topK) {
    
    Map<String, Object> toolArguments = new HashMap<>();
    toolArguments.put("context_id", contextId);
    toolArguments.put("AgentPersona", agentPersona);
    toolArguments.put("query", query);
    toolArguments.put("top_k", topK);
    
    Map<String, Object> params = new HashMap<>();
    params.put("name", "context-broker-vector-query");
    params.put("arguments", toolArguments);
    
    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("jsonrpc", "2.0");
    requestBody.put("id", System.currentTimeMillis());
    requestBody.put("method", "tools/call");
    requestBody.put("params", params);
    
    Map<String, Object> response = webClient
            .post()
            .uri(mcpUrl)
            .header("Content-Type", "application/json")
            .header("Authorization", mcpAuthorization)
            .header("x-api-key", mcpApiKey)
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Map.class)
            .block();
    
    logRetrievedChunks(response, query);
    return response;
}
```

#### Step 5: Chunk Debugging

```java
private void logRetrievedChunks(Map<String, Object> response, String query) {
    try {
        Map<String, Object> result = (Map<String, Object>) response.get("result");
        List<Map<String, Object>> content = (List<Map<String, Object>>) result.get("content");
        
        if (content != null && !content.isEmpty()) {
            String textData = (String) content.get(0).get("text");
            
            logger.info("📊 Query: '{}'", query.substring(0, Math.min(50, query.length())));
            
            // Parse JSON response to extract chunk IDs and scores
            if (textData.contains("chunk_id")) {
                logger.info("✓ Chunks retrieved");
                // Extract and log:
                // - chunk_id
                // - similarity score
                // - document title
                // - content preview
            } else {
                logger.warn("⚠ No chunks for this query");
            }
        }
    } catch (Exception e) {
        logger.debug("Could not parse chunks: {}", e.getMessage());
    }
}
```

#### Step 6: Result Aggregation

```java
private Map<String, Object> aggregateResults(
        List<Map<String, Object>> allResults,
        String city, Double temperature, Integer humidity,
        Integer aqi, Double uvIndex, String weatherCondition) {
    
    Map<String, Object> aggregated = new HashMap<>();
    aggregated.put("city", city);
    aggregated.put("temperature", temperature);
    aggregated.put("humidity", humidity);
    aggregated.put("aqi", aqi);
    aggregated.put("uvIndex", uvIndex);
    aggregated.put("weatherCondition", weatherCondition);
    aggregated.put("queryCount", allResults.size());
    aggregated.put("results", allResults);
    aggregated.put("retrievalStrategy", "concept-based-multi-query");
    
    // Extract all retrieved chunks
    List<Map<String, Object>> allChunks = new ArrayList<>();
    for (Map<String, Object> result : allResults) {
        // Parse and collect chunks from each query result
        // Include: chunk_id, score, title, content
    }
    aggregated.put("retrievedChunks", allChunks);
    aggregated.put("totalChunksRetrieved", allChunks.size());
    
    return aggregated;
}
```

---

## Expected Results

### Before (City-Specific Query)
```
Query: "Provide comprehensive weather-based recommendations for Delhi. 
        Temperature 34.1°C, Humidity 43%, AQI 61..."
Result: no_results (0 chunks retrieved)
Reason: "Both vector similarity search and lexical full-text search returned no matching chunks"
```

### After (Concept-Based Queries)
```
Query 1: "Air quality index moderate health recommendations..."
Result: 5-10 chunks from AQI_INTELLIGENCE.md
Chunks: [chunk_id_1, chunk_id_2, ...] with scores [0.85, 0.82, ...]

Query 2: "Temperature hot weather clothing advice..."
Result: 5-10 chunks from HEALTH_ALERTS.md
Chunks: [chunk_id_3, chunk_id_4, ...] with scores [0.88, 0.79, ...]

Query 3: "UV index moderate sun protection..."
Result: 5-10 chunks from HEALTH_ALERTS.md
Chunks: [chunk_id_5, chunk_id_6, ...] with scores [0.91, 0.87, ...]

Query 4: "Outdoor activities haze running cycling..."
Result: 5-10 chunks from OUTDOOR_ACTIVITY_SUGGESTIONS.md
Chunks: [chunk_id_7, chunk_id_8, ...] with scores [0.84, 0.81, ...]

Query 5: "Travel recommendations haze visibility..."
Result: 5-10 chunks from TRAVEL_RECOMMENDATIONS.md
Chunks: [chunk_id_9, chunk_id_10, ...] with scores [0.86, 0.83, ...]

Total: 25-50 relevant chunks retrieved
```

---

## Implementation File

The complete implementation is available in:
`src/main/java/com/weather/forecast/service/WeatherServiceUpdated.java`

### Key Methods:
1. `fetchMcpWeatherRecommendationsConceptBased()` - Main entry point
2. `executeSingleVectorQuery()` - Execute individual queries
3. `logRetrievedChunks()` - Debug chunk retrieval
4. `aggregateResults()` - Combine all results
5. `getAQICategory()`, `getTemperatureCategory()`, `getUVCategory()` - Concept extraction

---

## Integration Steps

### Option 1: Replace Existing Method
Replace the `fetchMcpWeatherRecommendations()` method in `WeatherService.java` with the new implementation.

### Option 2: Add New Method
Keep both methods and add a flag to switch between strategies:
```java
@Value("${mcp.retrieval.strategy:concept-based}")
private String retrievalStrategy;

public Map<String, Object> fetchMcpWeatherRecommendations(...) {
    if ("concept-based".equals(retrievalStrategy)) {
        return fetchMcpWeatherRecommendationsConceptBased(...);
    } else {
        return fetchMcpWeatherRecommendationsLegacy(...);
    }
}
```

---

## Testing

### Test Cases

1. **AQI Categories**
   - Good (0-50): Should retrieve "good air quality" recommendations
   - Moderate (51-100): Should retrieve "moderate AQI" guidance
   - Unhealthy (151-200): Should retrieve "unhealthy air" warnings

2. **Temperature Ranges**
   - Cold (<10°C): Should retrieve "cold weather" advice
   - Hot (>30°C): Should retrieve "hot weather" precautions

3. **UV Levels**
   - Low (<3): Should retrieve "low UV" information
   - High (6-8): Should retrieve "high UV" protection tips
   - Extreme (>11): Should retrieve "extreme UV" warnings

4. **Weather Conditions**
   - Clear: Should retrieve "clear weather" activities
   - Rain: Should retrieve "rainy weather" precautions
   - Haze: Should retrieve "poor visibility" warnings

### Verification

Check logs for:
```
=== Starting Concept-Based MCP Retrieval for Delhi ===
Weather Concepts: AQI=61 (moderate), Temp=34.1 (hot), UV=5.0 (moderate), Condition=haze
Query 1: AQI and health recommendations...
📊 Query: 'Air quality index moderate health...'
✓ Chunks retrieved
Query 2: Temperature-based recommendations...
📊 Query: 'Temperature hot weather clothing...'
✓ Chunks retrieved
...
Aggregating 5 query results...
=== Concept-Based Retrieval Complete ===
```

---

## Benefits

1. **Higher Retrieval Success Rate**: Matches generic knowledge documents
2. **Better Semantic Matching**: Concept-based queries align with document content
3. **Comprehensive Coverage**: Multiple queries cover different aspects
4. **Debugging Visibility**: Chunk IDs and scores logged for analysis
5. **Flexible**: Easy to add more query types or adjust concepts

---

## Next Steps

1. ✅ Implement concept extraction methods
2. ✅ Create multi-query execution logic
3. ✅ Add chunk debugging
4. ✅ Implement result aggregation
5. ⏳ Integrate into WeatherService
6. ⏳ Test with different weather conditions
7. ⏳ Monitor retrieval success rates
8. ⏳ Fine-tune concept categories and queries

---

## References

- Knowledge Documents: `docs/AQI_INTELLIGENCE.md`, `docs/HEALTH_ALERTS.md`, `docs/OUTDOOR_ACTIVITY_SUGGESTIONS.md`
- Ontology: `ontology/weather-ontology.jsonld`
- MCP Integration: `MCP_INTEGRATION_GUIDE.md`
- ICA Context Studio: `ICA_KNOWLEDGE_POPULATION_GUIDE.md`