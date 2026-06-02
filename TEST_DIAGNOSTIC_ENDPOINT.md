# Test MCP Diagnostic Endpoint

## Application Status
✅ Running on http://localhost:8080

## New Diagnostic Endpoint

### Endpoint Details
- **URL:** `POST http://localhost:8080/weather/mcp/diagnostic-test`
- **Method:** POST
- **Content-Type:** application/json
- **Body:** None required

### What It Does
Automatically executes 3 test queries:
1. "AQI" - Tests air quality retrieval
2. "Health" - Tests health recommendation retrieval  
3. "Weather" - Tests weather information retrieval

Returns detailed results including:
- Chunk IDs found
- Similarity scores
- Content previews
- Success/failure status for each query
- Summary statistics

### Test Using cURL

```bash
curl -X POST http://localhost:8080/weather/mcp/diagnostic-test \
  -H "Content-Type: application/json"
```

### Test Using PowerShell

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/weather/mcp/diagnostic-test" `
  -Method POST `
  -ContentType "application/json"
```

### Expected Response Format

```json
{
  "timestamp": "2026-05-29T11:55:00Z",
  "context_id": "ctx_fc39071914of",
  "agent_persona": "WeatherAdvisor",
  "test_queries": [
    {
      "query": "AQI",
      "status": "success|no_results|error",
      "chunks_found": 5,
      "chunks": [
        {
          "chunk_id": "actual_chunk_id_here",
          "score": 0.85,
          "title": "AQI_INTELLIGENCE.md",
          "source": "vector",
          "content_preview": "First 200 characters of chunk content..."
        }
      ],
      "raw_response_size": 1234
    },
    {
      "query": "Health",
      "status": "no_results",
      "reason": "Both vector similarity search and lexical full-text search returned no matching chunks",
      "vector_search_attempted": true,
      "lexical_search_attempted": true,
      "chunks_found": 0,
      "chunks": []
    },
    {
      "query": "Weather",
      "status": "error",
      "error_message": "Connection timeout"
    }
  ],
  "summary": {
    "total_queries": 3,
    "successful_queries": 1,
    "no_results_queries": 1,
    "error_queries": 1,
    "retrieval_working": true
  }
}
```

### Interpretation

#### If `retrieval_working: true`
✅ **Success!** The retrieval layer can access processed content.
- Chunks are being retrieved
- Vector/lexical search is working
- Application can now provide AI-powered recommendations

#### If `retrieval_working: false`
❌ **Issue Detected:** No chunks retrieved from any query.
- Possible causes:
  1. Documents not chunked
  2. Embeddings not generated
  3. Indexes not built
  4. Agent persona access issue
  5. Wrong retrieval configuration

### Next Steps After Testing

1. **If Successful (chunks found):**
   - Proceed to Phase 2: Display results in UI
   - Integrate all knowledge categories
   - Compare existing vs ICA recommendations

2. **If No Results:**
   - Check Context Studio for chunk count
   - Verify embeddings were generated
   - Rebuild indexes if necessary
   - Grant agent persona access

3. **If Errors:**
   - Check MCP connection
   - Verify authentication tokens
   - Review error messages in logs

---

## Alternative: Test via Browser

1. Open browser to: http://localhost:8080
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run:

```javascript
fetch('http://localhost:8080/weather/mcp/diagnostic-test', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'}
})
.then(r => r.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
```

---

## Current Status

The diagnostic endpoint has been added to the application. Once the compilation completes and the application restarts, you can test it using any of the methods above.

**Goal:** Determine if the retrieval layer can access the processed content in ctx_fc39071914of by executing automated diagnostic queries and analyzing the results.