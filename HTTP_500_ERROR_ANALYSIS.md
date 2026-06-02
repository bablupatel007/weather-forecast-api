# HTTP 500 Error Analysis - Diagnostic Endpoint

## Error Response
```json
{
  "timestamp": "2026-05-29T17:30:12.137803",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred. Please try again later.",
  "path": "/weather/mcp/diagnostic-test"
}
```

## Problem Identification

The HTTP 500 error occurs when calling `POST /weather/mcp/diagnostic-test` but **no exception stack trace appears in the logs**. This indicates one of two scenarios:

### Scenario 1: Endpoint Doesn't Exist (Most Likely)
The diagnostic endpoint code was added but **not compiled** into the running application because:
1. Terminal 2 compilation may have failed silently
2. Spring DevTools auto-restart may have failed
3. The new code wasn't picked up by the classloader

### Scenario 2: Exception is Caught Silently
The endpoint exists but throws an exception that's being caught by a global exception handler without logging.

---

## Root Cause Analysis

Based on the code added to `WeatherService.java` (lines 960-1090), the diagnostic method `runMcpDiagnosticTest()` has several potential failure points:

### 1. Missing Import Statement
**Line 1015:** `ObjectMapper mapper = new ObjectMapper();`

**Issue:** `ObjectMapper` is used but may not be imported at the top of the file.

**Required Import:**
```java
import com.fasterxml.jackson.databind.ObjectMapper;
```

### 2. Unsafe Type Casting
**Lines 1000-1050:** Multiple unchecked casts:
```java
Map<String, Object> result = (Map<String, Object>) parsedResponse.get("result");
List<Map<String, Object>> content = (List<Map<String, Object>>) result.get("content");
Map<String, Object> items = (Map<String, Object>) nestedData.get("items");
List<Map<String, Object>> vectorResults = (List<Map<String, Object>>) items.get("vector");
```

**Issue:** If any of these casts fail, a `ClassCastException` will be thrown.

### 3. Null Pointer Exceptions
**Multiple lines:** No null checks before accessing nested objects:
```java
if (result != null) {
    List<Map<String, Object>> content = (List<Map<String, Object>>) result.get("content");
    if (content != null && !content.isEmpty()) {
        String textContent = (String) content.get(0).get("text");  // NPE if content.get(0) is null
```

### 4. JSON Parsing Exception
**Line 1015:**
```java
Map<String, Object> nestedData = mapper.readValue(textContent, Map.class);
```

**Issue:** `readValue()` throws `JsonProcessingException` which is caught but may not be logged properly.

---

## Exact Code Fix Required

### Fix 1: Add Missing Import (If Not Present)

Check if this import exists at the top of `WeatherService.java`:
```java
import com.fasterxml.jackson.databind.ObjectMapper;
```

If missing, add it after the existing imports around line 15-20.

### Fix 2: Add Proper Null Checks and Exception Handling

Replace the diagnostic method with this safer version:

```java
public Map<String, Object> runMcpDiagnosticTest() {
    logger.info("═══════════════════════════════════════════════════════");
    logger.info("STARTING MCP DIAGNOSTIC TEST");
    logger.info("═══════════════════════════════════════════════════════");
    
    Map<String, Object> results = new HashMap<>();
    results.put("timestamp", java.time.Instant.now().toString());
    results.put("context_id", "ctx_fc39071914of");
    results.put("agent_persona", "WeatherAdvisor");
    
    String[] testQueries = {"AQI", "Health", "Weather"};
    List<Map<String, Object>> queryResults = new ArrayList<>();
    
    for (String query : testQueries) {
        logger.info("───────────────────────────────────────────────────────");
        logger.info("Testing Query: {}", query);
        
        Map<String, Object> queryResult = new HashMap<>();
        queryResult.put("query", query);
        
        try {
            String mcpResponse = executeMcpQuery("ctx_fc39071914of", "WeatherAdvisor", query);
            
            if (mcpResponse == null || mcpResponse.isEmpty()) {
                queryResult.put("status", "error");
                queryResult.put("error_message", "Empty MCP response");
                queryResults.add(queryResult);
                continue;
            }
            
            Map<String, Object> parsedResponse = parseMcpResponse(mcpResponse);
            
            if (parsedResponse == null) {
                queryResult.put("status", "error");
                queryResult.put("error_message", "Failed to parse MCP response");
                queryResults.add(queryResult);
                continue;
            }
            
            // Safely extract result
            Object resultObj = parsedResponse.get("result");
            if (!(resultObj instanceof Map)) {
                queryResult.put("status", "error");
                queryResult.put("error_message", "Invalid result structure");
                queryResults.add(queryResult);
                continue;
            }
            
            @SuppressWarnings("unchecked")
            Map<String, Object> result = (Map<String, Object>) resultObj;
            
            // Safely extract content
            Object contentObj = result.get("content");
            if (!(contentObj instanceof List) || ((List<?>) contentObj).isEmpty()) {
                queryResult.put("status", "error");
                queryResult.put("error_message", "No content in response");
                queryResults.add(queryResult);
                continue;
            }
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> content = (List<Map<String, Object>>) contentObj;
            
            Map<String, Object> firstContent = content.get(0);
            if (firstContent == null) {
                queryResult.put("status", "error");
                queryResult.put("error_message", "First content element is null");
                queryResults.add(queryResult);
                continue;
            }
            
            String textContent = (String) firstContent.get("text");
            if (textContent == null || textContent.isEmpty()) {
                queryResult.put("status", "error");
                queryResult.put("error_message", "Text content is null or empty");
                queryResults.add(queryResult);
                continue;
            }
            
            // Parse nested JSON
            ObjectMapper mapper = new ObjectMapper();
            @SuppressWarnings("unchecked")
            Map<String, Object> nestedData = mapper.readValue(textContent, Map.class);
            
            // Extract items
            Object itemsObj = nestedData.get("items");
            if (!(itemsObj instanceof Map)) {
                queryResult.put("status", "no_results");
                queryResult.put("reason", "No items in response");
                queryResults.add(queryResult);
                continue;
            }
            
            @SuppressWarnings("unchecked")
            Map<String, Object> items = (Map<String, Object>) itemsObj;
            
            // Process vector results
            Object vectorObj = items.get("vector");
            if (!(vectorObj instanceof List)) {
                queryResult.put("status", "no_results");
                queryResult.put("reason", "No vector results");
                queryResults.add(queryResult);
                continue;
            }
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> vectorResults = (List<Map<String, Object>>) vectorObj;
            
            List<Map<String, Object>> chunks = new ArrayList<>();
            int chunkCount = 0;
            
            for (Map<String, Object> vectorResult : vectorResults) {
                if (vectorResult == null) continue;
                
                Object metadataObj = vectorResult.get("metadata");
                if (!(metadataObj instanceof Map)) continue;
                
                @SuppressWarnings("unchecked")
                Map<String, Object> metadata = (Map<String, Object>) metadataObj;
                
                String searchStatus = (String) metadata.get("search_status");
                
                if (!"no_results".equals(searchStatus)) {
                    chunkCount++;
                    Map<String, Object> chunkInfo = new HashMap<>();
                    chunkInfo.put("chunk_id", metadata.get("chunk_id"));
                    chunkInfo.put("score", metadata.get("score"));
                    chunkInfo.put("title", metadata.get("title"));
                    chunkInfo.put("source", metadata.get("source"));
                    
                    String chunkContent = (String) vectorResult.get("content");
                    if (chunkContent != null && chunkContent.length() > 200) {
                        chunkInfo.put("content_preview", chunkContent.substring(0, 200) + "...");
                    } else {
                        chunkInfo.put("content_preview", chunkContent);
                    }
                    chunks.add(chunkInfo);
                } else {
                    queryResult.put("status", "no_results");
                    queryResult.put("reason", metadata.get("reason"));
                    queryResult.put("vector_search_attempted", metadata.get("vector_search_attempted"));
                    queryResult.put("lexical_search_attempted", metadata.get("lexical_search_attempted"));
                }
            }
            
            queryResult.put("chunks_found", chunkCount);
            queryResult.put("chunks", chunks);
            
            if (chunkCount > 0) {
                queryResult.put("status", "success");
                logger.info("✓ Query '{}' returned {} chunks", query, chunkCount);
            } else if (!queryResult.containsKey("status")) {
                queryResult.put("status", "no_results");
                logger.warn("✗ Query '{}' returned no chunks", query);
            }
            
            queryResult.put("raw_response_size", mcpResponse.length());
            
        } catch (Exception e) {
            logger.error("Error testing query '{}': {}", query, e.getMessage(), e);
            queryResult.put("status", "error");
            queryResult.put("error_message", e.getMessage());
            queryResult.put("error_type", e.getClass().getSimpleName());
        }
        
        queryResults.add(queryResult);
    }
    
    results.put("test_queries", queryResults);
    
    // Summary
    long successCount = queryResults.stream()
        .filter(r -> "success".equals(r.get("status")))
        .count();
    long noResultsCount = queryResults.stream()
        .filter(r -> "no_results".equals(r.get("status")))
        .count();
    long errorCount = queryResults.stream()
        .filter(r -> "error".equals(r.get("status")))
        .count();
    
    Map<String, Object> summary = new HashMap<>();
    summary.put("total_queries", testQueries.length);
    summary.put("successful_queries", successCount);
    summary.put("no_results_queries", noResultsCount);
    summary.put("error_queries", errorCount);
    summary.put("retrieval_working", successCount > 0);
    
    results.put("summary", summary);
    
    logger.info("═══════════════════════════════════════════════════════");
    logger.info("DIAGNOSTIC TEST COMPLETE");
    logger.info("Summary: {} successful, {} no results, {} errors", 
        successCount, noResultsCount, errorCount);
    logger.info("═══════════════════════════════════════════════════════");
    
    return results;
}
```

---

## Verification Steps

After applying the fix:

1. **Stop the application** (Ctrl+C in Terminal 1)
2. **Rebuild:** `./mvnw.cmd clean compile`
3. **Restart:** `./mvnw.cmd spring-boot:run`
4. **Test endpoint:** `curl -X POST http://localhost:8080/weather/mcp/diagnostic-test`
5. **Check logs** for:
   - "STARTING MCP DIAGNOSTIC TEST"
   - Query test results
   - "DIAGNOSTIC TEST COMPLETE"
   - Any exception stack traces

---

## Expected Behavior After Fix

### If Successful:
```json
{
  "timestamp": "2026-05-29T...",
  "context_id": "ctx_fc39071914of",
  "test_queries": [
    {
      "query": "AQI",
      "status": "no_results",
      "reason": "Both vector similarity search and lexical full-text search returned no matching chunks",
      "chunks_found": 0
    }
  ],
  "summary": {
    "total_queries": 3,
    "successful_queries": 0,
    "no_results_queries": 3,
    "retrieval_working": false
  }
}
```

### If Still Failing:
Logs will show the exact exception type and message, allowing us to identify the specific line causing the failure.

---

## Summary

**Root Cause:** The diagnostic method likely fails due to:
1. Missing `ObjectMapper` import
2. Unsafe type casting without null checks
3. Unhandled exceptions during JSON parsing

**Fix:** Replace the method with the safer version above that includes:
- Proper null checks at every step
- Safe type casting with instanceof checks
- Comprehensive exception handling
- Detailed error logging

**Next Step:** Apply the fix, rebuild, restart, and test again to see the actual error or successful response.