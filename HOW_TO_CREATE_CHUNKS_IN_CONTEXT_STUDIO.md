# How to Create Chunks in ICA Context Studio

**Date:** 2026-05-29  
**Context:** AI Weather Advisor (ctx_fc39071914of)  
**Goal:** Generate searchable chunks from uploaded documents

---

## 🎯 Overview

**What are Chunks?**
Chunks are segments of your documents that are indexed for vector and lexical search. Without chunks, documents cannot be searched even if they show "READY" status.

**Current Status:**
- ✅ Documents uploaded (5 files, READY status)
- ❌ Chunks not generated (0 chunks)
- ❌ Vector search returns no results

**Target:**
- ✅ Generate 50-80 chunks from 5 documents
- ✅ Create embeddings for all chunks
- ✅ Enable vector and lexical search

---

## 📋 Step-by-Step Guide

### Method 1: Using ICA Context Studio Web UI (Recommended)

#### Step 1: Access ICA Context Studio
```
URL: https://servicesessentials.ibm.com/context-studio
Login: Use your IBM credentials
```

#### Step 2: Navigate to Your Context
1. Click on **"Contexts"** in the left sidebar
2. Find and click **"AI Weather Advisor"**
3. You should see:
   - Context ID: ctx_fc39071914of
   - Status: active
   - Ingestion status: Ready

#### Step 3: Go to Sources & Data Tab
1. Click on **"Sources & Data"** tab at the top
2. You should see your 5 uploaded documents:
   - AQI_INTELLIGENCE.md (Status: READY)
   - HEALTH_ALERTS.md (Status: READY)
   - OUTDOOR_ACTIVITY_SUGGESTIONS.md (Status: READY)
   - TRAVEL_RECOMMENDATIONS.md (Status: READY)
   - WEATHER_RISK_ANALYSIS.md (Status: READY)

#### Step 4: Check Current Chunk Status
1. Click on **AQI_INTELLIGENCE.md**
2. Look for section showing:
   - **Chunks:** (should show a number)
   - **Embeddings:** (should show status)
   - **Vector Index:** (should show status)

**If Chunks = 0 or not shown, proceed to Step 5**

#### Step 5: Configure Chunking Settings
1. Look for **"Processing Settings"** or **"Chunking Configuration"**
2. Click **"Edit"** or **"Configure"**
3. Set the following parameters:

```
Chunking Strategy: Fixed Size
Chunk Size: 512 tokens
Chunk Overlap: 50 tokens
Separator: Paragraph breaks
```

**Why these settings?**
- **512 tokens:** Optimal size for semantic search (not too small, not too large)
- **50 token overlap:** Ensures context continuity between chunks
- **Paragraph breaks:** Maintains logical content boundaries

#### Step 6: Trigger Chunking Process
1. Select all 5 documents (use checkboxes)
2. Look for button: **"Process"**, **"Index"**, or **"Generate Chunks"**
3. Click the button
4. Confirm the action if prompted

**Alternative locations for this button:**
- Actions menu (three dots ⋮)
- Bulk actions toolbar
- Document details page
- Processing tab

#### Step 7: Monitor Processing
1. You should see a progress indicator
2. Status will change from "Processing" to "Indexed" or "Ready"
3. **Wait time:** 5-10 minutes for 5 documents

**What's happening:**
- Documents are being split into chunks
- Each chunk is being processed
- Embeddings are being generated
- Vector index is being built

#### Step 8: Verify Chunks Created
1. Go back to **"Sources & Data"** tab
2. Click on **AQI_INTELLIGENCE.md**
3. Check:
   - **Chunks:** Should show 10-15
   - **Embeddings:** Should show "Generated" or count
   - **Vector Index:** Should show "Active" or "Indexed"

4. Repeat for other documents:
   - HEALTH_ALERTS.md: 10-15 chunks
   - OUTDOOR_ACTIVITY_SUGGESTIONS.md: 10-15 chunks
   - TRAVEL_RECOMMENDATIONS.md: 8-12 chunks
   - WEATHER_RISK_ANALYSIS.md: 10-15 chunks

**Total Expected:** 50-80 chunks

#### Step 9: Verify Vector Search Enabled
1. Go to **"Settings"** or **"Configuration"** tab
2. Look for **"Search Capabilities"**
3. Verify enabled:
   - ✅ Vector Search
   - ✅ Lexical Search
   - ✅ Hybrid Search

#### Step 10: Test Search in UI
1. Look for **"Search"** or **"Query"** interface in Context Studio
2. Enter test query: **"AQI"**
3. Click **"Search"**
4. **Expected result:** 3-5 chunks from AQI_INTELLIGENCE.md
5. Check similarity scores (should be > 0.7)

---

### Method 2: Using Context Studio API (Alternative)

If UI options are not available, use the API:

#### API Endpoint for Chunking
```
POST https://servicesessentials.ibm.com/context-studio/api/v1/contexts/{context_id}/documents/process
```

#### Request Headers
```http
Authorization: Bearer {your_token}
Content-Type: application/json
```

#### Request Body
```json
{
  "document_ids": [
    "doc_id_1",
    "doc_id_2",
    "doc_id_3",
    "doc_id_4",
    "doc_id_5"
  ],
  "chunking_config": {
    "strategy": "fixed_size",
    "chunk_size": 512,
    "chunk_overlap": 50,
    "separator": "paragraph"
  },
  "generate_embeddings": true,
  "build_vector_index": true
}
```

#### Example using curl
```bash
curl -X POST \
  https://servicesessentials.ibm.com/context-studio/api/v1/contexts/ctx_fc39071914of/documents/process \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "document_ids": ["all"],
    "chunking_config": {
      "chunk_size": 512,
      "chunk_overlap": 50
    },
    "generate_embeddings": true
  }'
```

---

### Method 3: Re-upload with Chunking Enabled

If chunking cannot be triggered on existing documents:

#### Step 1: Delete Existing Documents (Optional)
1. Go to **"Sources & Data"** tab
2. Select all 5 documents
3. Click **"Delete"** or **"Remove"**
4. Confirm deletion

#### Step 2: Re-upload with Processing Enabled
1. Click **"Upload Documents"** or **"Add Source"**
2. Select your 5 markdown files from `docs/` folder
3. **Before uploading**, look for options:
   - ✅ **Generate Chunks** (enable)
   - ✅ **Generate Embeddings** (enable)
   - ✅ **Build Vector Index** (enable)
4. Set chunking parameters:
   - Chunk Size: 512 tokens
   - Chunk Overlap: 50 tokens
5. Click **"Upload"** or **"Process"**
6. Wait 5-10 minutes for processing

---

## 🔍 Troubleshooting

### Issue 1: Cannot Find Chunking Option

**Possible locations:**
- Sources & Data → Document → Actions menu (⋮)
- Sources & Data → Bulk Actions toolbar
- Processing tab
- Settings → Data Processing
- Document details page → Process button

**If still not found:**
- Check user permissions (need write/admin access)
- Contact IBM support for your Context Studio instance
- Use API method instead

### Issue 2: Chunking Fails or Errors

**Common causes:**
- Document format not supported (should be .md)
- Document too large (split into smaller files)
- Insufficient permissions
- Service temporarily unavailable

**Solutions:**
- Check document format and size
- Verify permissions
- Retry after a few minutes
- Check Context Studio status page

### Issue 3: Chunks Created but Search Still Returns Nothing

**Verify:**
1. Embeddings generated (not just chunks)
2. Vector index built and active
3. Search capabilities enabled
4. Agent persona has read permissions
5. Context ID correct in queries

**Test:**
- Use simple query: "AQI"
- Try vector-only search
- Check if graph search works
- Verify in Context Studio UI search

### Issue 4: Processing Takes Too Long

**Normal processing time:**
- 5 documents: 5-10 minutes
- 10 documents: 10-20 minutes

**If longer than 30 minutes:**
- Check processing status
- Look for error messages
- Refresh the page
- Contact support if stuck

---

## ✅ Success Criteria

After chunking is complete, you should see:

### In Context Studio UI:
```
✅ Total Chunks: 50-80
✅ Embeddings: Generated for all chunks
✅ Vector Index: Active/Indexed
✅ Search Test: Returns 3-5 results for "AQI"
```

### In Application Logs:
```
✅ HTTP Status: 200 OK
✅ Retrieved Chunks: 5-10 (not 0)
✅ Similarity Scores: 0.81-0.89 (not 0.0)
✅ Content: Rich text (not empty)
```

### In MCP Response:
```json
{
  "total_items": 6,
  "vector_results": 5,
  "average_score": 0.85,
  "chunks": [
    {
      "content": "## Moderate AQI (51-100): Health Recommendations...",
      "score": 0.89,
      "document_name": "AQI_INTELLIGENCE.md"
    }
  ]
}
```

---

## 📞 Getting Help

### IBM Context Studio Support
- **Documentation:** https://www.ibm.com/docs/context-studio
- **Support Portal:** https://www.ibm.com/mysupport
- **Community:** IBM Developer Community

### Provide This Information:
```
Context ID: ctx_fc39071914of
Context Name: AI Weather Advisor
Issue: Chunks not generated from uploaded documents
Documents: 5 markdown files (READY status)
Expected: 50-80 chunks
Actual: 0 chunks
Error: Vector search returns "no matching chunks"
```

---

## 🎯 Next Steps After Chunks Are Created

1. **Verify in Application:**
   - Refresh weather page
   - Check MCP recommendations
   - Should see 5-10 chunks retrieved

2. **Test Different Queries:**
   - Simple: "AQI"
   - Medium: "air quality health"
   - Complex: Current concept-based query

3. **Monitor Performance:**
   - Check similarity scores
   - Verify relevant results
   - Adjust chunking if needed

4. **Proceed with Development:**
   - Phase 2: Display chunks in UI
   - Phase 3: Format recommendations
   - Phase 4: Compare with existing
   - Phase 5: Full integration

---

**Summary:** To create chunks in ICA Context Studio, navigate to Sources & Data, select your documents, configure chunking settings (512 tokens, 50 overlap), and trigger the processing. Wait 5-10 minutes, then verify chunks are created and vector search is enabled. Once complete, your MCP queries will return rich, relevant weather recommendations.

**Last Updated:** 2026-05-29 16:29:25