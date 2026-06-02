# Direct Index Evidence Request - ICA Context Studio

## Objective
Obtain direct evidence of chunk count, embedding count, and index statistics for context `ctx_fc39071914of` to explain why searches for obvious terms like "AQI" return no matches.

---

## Required Evidence

### 1. Actual Chunk Count for AQI_INTELLIGENCE.md

**What We Need:**
- Total number of chunks generated from AQI_INTELLIGENCE.md
- Chunk IDs (if any exist)
- Chunk size configuration (tokens per chunk)
- Chunk overlap configuration

**How to Obtain:**

#### Method A: ICA Context Studio UI
1. Access: https://servicesessentials.ibm.com/context-studio
2. Navigate: Contexts → AI Weather Advisor (ctx_fc39071914of)
3. Click: "Sources & Data" tab
4. Find: AQI_INTELLIGENCE.md in the list
5. Look for: "Chunks" column or "Details" button
6. Screenshot: The chunk count display

**Expected Display:**
```
Document Name: AQI_INTELLIGENCE.md
Status: READY
Size: 15.2 KB
Chunks: ??? (This is what we need to see)
Embeddings: ??? (This is what we need to see)
Last Processed: YYYY-MM-DD HH:MM:SS
```

#### Method B: MCP API Query
```bash
curl -X POST \
  https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/8ccdd203bdee4014b08e82eedb6046e2/mcp \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "resources/read",
    "params": {
      "uri": "context://ctx_fc39071914of/documents/AQI_INTELLIGENCE.md"
    }
  }'
```

**Expected Response (if chunks exist):**
```json
{
  "document_id": "doc_abc123",
  "name": "AQI_INTELLIGENCE.md",
  "status": "indexed",
  "chunk_count": 12,
  "embedding_count": 12,
  "chunk_ids": ["chunk_001", "chunk_002", ...],
  "processing_date": "2026-05-29T10:00:00Z"
}
```

**Expected Response (if no chunks):**
```json
{
  "document_id": "doc_abc123",
  "name": "AQI_INTELLIGENCE.md",
  "status": "uploaded",
  "chunk_count": 0,
  "embedding_count": 0,
  "processing_date": null
}
```

---

### 2. Actual Embedding Count

**What We Need:**
- Total number of embeddings generated
- Embedding dimensions (typically 1536 for text-embedding-ada-002)
- Embedding model used
- Embedding generation timestamp

**How to Obtain:**

#### Method A: Context Statistics API
```bash
curl -X GET \
  https://servicesessentials.ibm.com/context-studio/api/v1/contexts/ctx_fc39071914of/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "context_id": "ctx_fc39071914of",
  "total_documents": 6,
  "total_chunks": ???,
  "total_embeddings": ???,
  "embedding_model": "text-embedding-ada-002",
  "embedding_dimensions": 1536,
  "vector_index_status": "active|empty|building",
  "last_indexed": "2026-05-29T10:00:00Z"
}
```

#### Method B: MCP Resources List
```bash
curl -X POST \
  https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/8ccdd203bdee4014b08e82eedb6046e2/mcp \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "resources/list",
    "params": {
      "uri": "context://ctx_fc39071914of/embeddings"
    }
  }'
```

---

### 3. Actual Vector Index Statistics

**What We Need:**
- Index name/ID
- Index type (e.g., HNSW, IVF)
- Number of vectors in index
- Index build status
- Index size (MB)
- Last update timestamp

**How to Obtain:**

#### Method A: Index Status API
```bash
curl -X GET \
  https://servicesessentials.ibm.com/context-studio/api/v1/contexts/ctx_fc39071914of/indexes/vector \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (if index exists and populated):**
```json
{
  "index_id": "idx_vector_ctx_fc39071914of",
  "index_type": "HNSW",
  "status": "active",
  "vector_count": 64,
  "dimensions": 1536,
  "index_size_mb": 2.5,
  "last_updated": "2026-05-29T10:00:00Z",
  "search_enabled": true
}
```

**Expected Response (if index empty):**
```json
{
  "index_id": "idx_vector_ctx_fc39071914of",
  "index_type": "HNSW",
  "status": "empty",
  "vector_count": 0,
  "dimensions": 1536,
  "index_size_mb": 0,
  "last_updated": null,
  "search_enabled": false
}
```

#### Method B: MCP Diagnostic Query
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "context-broker-diagnostics",
    "arguments": {
      "context_id": "ctx_fc39071914of",
      "check_type": "vector_index"
    }
  }
}
```

---

### 4. Actual Lexical Index Statistics

**What We Need:**
- Index name/ID
- Index type (e.g., Elasticsearch, BM25)
- Number of documents indexed
- Number of terms in index
- Index size (MB)
- Last update timestamp

**How to Obtain:**

#### Method A: Index Status API
```bash
curl -X GET \
  https://servicesessentials.ibm.com/context-studio/api/v1/contexts/ctx_fc39071914of/indexes/lexical \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (if index exists and populated):**
```json
{
  "index_id": "idx_lexical_ctx_fc39071914of",
  "index_type": "BM25",
  "status": "active",
  "document_count": 64,
  "term_count": 5420,
  "index_size_mb": 1.2,
  "last_updated": "2026-05-29T10:00:00Z",
  "search_enabled": true
}
```

**Expected Response (if index empty):**
```json
{
  "index_id": "idx_lexical_ctx_fc39071914of",
  "index_type": "BM25",
  "status": "empty",
  "document_count": 0,
  "term_count": 0,
  "index_size_mb": 0,
  "last_updated": null,
  "search_enabled": false
}
```

---

### 5. Document Processing Status

**What We Need:**
- Processing pipeline status for each document
- Processing stages completed (upload → chunk → embed → index)
- Any error messages or warnings
- Processing timestamps

**How to Obtain:**

#### Method A: Document Details API
```bash
curl -X GET \
  https://servicesessentials.ibm.com/context-studio/api/v1/contexts/ctx_fc39071914of/documents \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "documents": [
    {
      "id": "doc_001",
      "name": "AQI_INTELLIGENCE.md",
      "status": "ready",
      "processing_stages": {
        "upload": {"status": "completed", "timestamp": "2026-05-29T09:00:00Z"},
        "chunking": {"status": "pending|completed|failed", "timestamp": null},
        "embedding": {"status": "pending|completed|failed", "timestamp": null},
        "indexing": {"status": "pending|completed|failed", "timestamp": null}
      },
      "chunk_count": 0,
      "error_message": null
    }
  ]
}
```

#### Method B: ICA Context Studio UI
1. Navigate to: Sources & Data → AQI_INTELLIGENCE.md
2. Click: "Processing History" or "Details"
3. Look for: Processing pipeline stages
4. Screenshot: The processing status display

---

## Alternative Diagnostic Approaches

### Approach 1: List All Chunks in Context

**MCP Query:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/list",
  "params": {
    "uri": "context://ctx_fc39071914of/chunks"
  }
}
```

**Expected Response (if chunks exist):**
```json
{
  "chunks": [
    {
      "chunk_id": "chunk_001",
      "source_document": "AQI_INTELLIGENCE.md",
      "content_preview": "Air Quality Index (AQI) is a standardized...",
      "token_count": 512,
      "has_embedding": true
    },
    ...
  ],
  "total_count": 64
}
```

**Expected Response (if no chunks):**
```json
{
  "chunks": [],
  "total_count": 0
}
```

---

### Approach 2: Direct Vector Search Test

**MCP Query:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "context-broker-hybrid-query",
    "arguments": {
      "context_id": "ctx_fc39071914of",
      "AgentPersona": "WeatherAdvisor",
      "query": "AQI",
      "sources": ["vector"],
      "vector_params": {
        "top_k": 100,
        "min_score": 0.0,
        "include_metadata": true
      }
    }
  }
}
```

**Purpose:** Request top 100 results with minimum score 0.0 to see if ANY vectors exist, even with low relevance.

**Expected Response (if vectors exist):**
```json
{
  "items": {
    "vector": [
      {
        "content": "...",
        "metadata": {
          "chunk_id": "chunk_001",
          "score": 0.15,
          "source_document": "AQI_INTELLIGENCE.md"
        }
      }
    ]
  },
  "total_items": 64
}
```

**Expected Response (if no vectors):**
```json
{
  "search_status": "no_results",
  "reason": "Vector index is empty"
}
```

---

### Approach 3: Direct Lexical Search Test

**MCP Query:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "context-broker-hybrid-query",
    "arguments": {
      "context_id": "ctx_fc39071914of",
      "AgentPersona": "WeatherAdvisor",
      "query": "AQI",
      "sources": ["lexical"],
      "lexical_params": {
        "top_k": 100,
        "include_metadata": true
      }
    }
  }
}
```

**Purpose:** Test if lexical (keyword) search finds anything.

---

### Approach 4: Context Metadata Query

**MCP Query:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/read",
  "params": {
    "uri": "context://ctx_fc39071914of"
  }
}
```

**Expected Response:**
```json
{
  "context_id": "ctx_fc39071914of",
  "name": "AI Weather Advisor",
  "status": "active",
  "statistics": {
    "document_count": 6,
    "chunk_count": ???,
    "embedding_count": ???,
    "entity_count": 119,
    "concept_count": 55,
    "relationship_count": 64
  },
  "indexes": {
    "vector": {"status": "active|empty", "count": ???},
    "lexical": {"status": "active|empty", "count": ???},
    "graph": {"status": "active", "count": 119}
  }
}
```

---

## Summary of Evidence Needed

| Evidence Type | Current Status | Required Proof |
|---------------|----------------|----------------|
| **Chunk Count** | Unknown | Screenshot or API response showing actual count |
| **Embedding Count** | Unknown | API response with embedding statistics |
| **Vector Index Status** | Unknown | Index statistics showing vector count |
| **Lexical Index Status** | Unknown | Index statistics showing document count |
| **Processing Status** | READY (upload only?) | Processing pipeline stages completed |

---

## Key Questions to Answer

1. **Are chunks generated?**
   - If YES: Why don't they match "AQI"?
   - If NO: Why wasn't chunking triggered after upload?

2. **Are embeddings generated?**
   - If YES: Why doesn't vector search find them?
   - If NO: Why wasn't embedding generation triggered?

3. **Are indexes populated?**
   - If YES: Why do searches return no_results?
   - If NO: Why wasn't indexing triggered?

4. **What is the actual processing pipeline status?**
   - Upload: ✅ READY
   - Chunking: ??? (This is critical)
   - Embedding: ??? (This is critical)
   - Indexing: ??? (This is critical)

---

## Action Items for User

**Priority 1: Check ICA Context Studio UI**
1. Login to https://servicesessentials.ibm.com/context-studio
2. Navigate to AI Weather Advisor context
3. Go to Sources & Data tab
4. For AQI_INTELLIGENCE.md, check:
   - Chunk count (should show a number, not 0)
   - Processing status (should show "Indexed", not just "Ready")
   - Last processed date
5. Take screenshots of the document details

**Priority 2: Run Diagnostic API Calls**
1. Execute the context statistics API call
2. Execute the vector index status API call
3. Execute the lexical index status API call
4. Execute the chunks list API call
5. Share the JSON responses

**Priority 3: Test Direct Searches**
1. Use Context Studio's built-in search feature
2. Search for "AQI" in the context
3. Check if any results appear
4. Take screenshot of search results

---

## Expected Outcomes

### Scenario A: Chunks Exist (Count > 0)
**Then the issue is:**
- Query formulation problem
- Embedding mismatch
- Index configuration issue
- Permission/access issue

**Next steps:**
- Analyze chunk content
- Test different query formulations
- Check embedding model compatibility

### Scenario B: Chunks Don't Exist (Count = 0)
**Then the issue is:**
- Documents uploaded but not processed
- Chunking step never triggered
- Processing pipeline incomplete

**Next steps:**
- Trigger chunking manually
- Check processing configuration
- Verify chunking settings

---

## Conclusion

We need **direct evidence** from ICA Context Studio showing:
1. Actual chunk count for each document
2. Actual embedding count
3. Actual vector index statistics
4. Actual lexical index statistics
5. Actual processing pipeline status

**Without this evidence, we cannot definitively explain why searches for "AQI" return no matches.**

The `no_results` response tells us the search failed, but it doesn't tell us WHY. We need to look at the underlying data structures to understand the root cause.

---

**Document Version:** 1.0  
**Created:** 2026-05-29  
**Purpose:** Request direct evidence of index status to diagnose search failures