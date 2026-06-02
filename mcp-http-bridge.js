#!/usr/bin/env node

/**
 * MCP HTTP-to-STDIO Bridge (Enhanced)
 * Bridges HTTP-based MCP servers to STDIO for use with MCP Inspector
 * With improved error handling, logging, and connection management
 */

const https = require('https');
const http = require('http');

// Configuration from .bob/mcp.json
const MCP_CONFIG = {
  url: 'https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/8ccdd203bdee4014b08e82eedb6046e2/mcp',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjb250ZXh0LXN0dWRpby11c2VyQGV4YW1wbGUuY29tIiwianRpIjoiYzY4ODNlNTMtMmNmZi00NjVkLTg1YTgtZGQ4NmQxM2YyNTA3IiwidG9rZW5fdXNlIjoiYXBpIiwiaWF0IjoxNzc5ODgxMjg3LCJpc3MiOiJtY3BnYXRld2F5IiwiYXVkIjoibWNwZ2F0ZXdheS1hcGkiLCJ1c2VyIjp7ImVtYWlsIjoiY29udGV4dC1zdHVkaW8tdXNlckBleGFtcGxlLmNvbSIsImZ1bGxfbmFtZSI6IkFQSSBUb2tlbiBVc2VyIiwiaXNfYWRtaW4iOmZhbHNlLCJhdXRoX3Byb3ZpZGVyIjoiYXBpX3Rva2VuIn0sInRlYW1zIjpbIjVhYTNiZDhkNDUxMDRlNzVhZDdhMzBjYTAzOTEyYzIwIl0sInNjb3BlcyI6eyJzZXJ2ZXJfaWQiOiI4Y2NkZDIwM2JkZWU0MDE0YjA4ZTgyZWVkYjYwNDZlMiIsInBlcm1pc3Npb25zIjpbImdhdGV3YXlzLnJlYWQiLCJzZXJ2ZXJzLnJlYWQiLCJzZXJ2ZXJzLnVzZSIsInRvb2xzLnJlYWQiLCJ0b29scy5leGVjdXRlIiwidGVhbXMucmVhZCIsInJlc291cmNlcy5yZWFkIiwicHJvbXB0cy5yZWFkIl0sImlwX3Jlc3RyaWN0aW9ucyI6W10sInRpbWVfcmVzdHJpY3Rpb25zIjp7fX0sImV4cCI6MTc4MTYwOTI4N30.eYMOMBPaoON7pJvLVudNkLl5DNRkcprJuQJ9PVLoSCE',
    'x-api-key': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbEFkZHJlc3MiOiJCYWJsdS5QYXRlbEBpYm0uY29tIiwidGVhbUlkIjoiNmExNmFiMGYwZjMwNTcxOTVjMjI5MjAyIiwiY29udGV4dElkIjoiY3R4X2ZjMzkwNzE5MTQwZiIsImlhdCI6MTc3OTg4MTI4NywiZXhwIjoxNzgxNjA5Mjg3LCJpc3MiOiJjb250ZXh0LWJyb2tlciIsInRva2VuX2lkIjoiMmU3OTMzMTItY2U4Mi00MDBjLWExNTgtY2E4ODg5NjZiYTk0In0.WuKkV3_9byjpKUu9wPGzT0XnBIYkt8z4xvxeg7A3_AHaMPV2QAQhFfoQ2BJCgWwMH_sv9Z0TVgfGQSWqEYRGfw',
    'Content-Type': 'application/json'
  }
};

// Parse URL
const urlObj = new URL(MCP_CONFIG.url);
const isHttps = urlObj.protocol === 'https:';
const httpModule = isHttps ? https : http;

// Keep track of connection state
let isConnected = true;
let requestCount = 0;

/**
 * Send request to MCP HTTP server with enhanced logging
 */
function sendMCPRequest(jsonrpcRequest) {
  return new Promise((resolve, reject) => {
    requestCount++;
    const requestId = requestCount;
    const postData = JSON.stringify(jsonrpcRequest);
    
    console.error(`[Bridge #${requestId}] >>> Outgoing HTTP request to ICA:`);
    console.error(`[Bridge #${requestId}]     Method: ${jsonrpcRequest.method}`);
    console.error(`[Bridge #${requestId}]     ID: ${jsonrpcRequest.id}`);
    console.error(`[Bridge #${requestId}]     Payload size: ${postData.length} bytes`);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': MCP_CONFIG.headers.Authorization,
        'x-api-key': MCP_CONFIG.headers['x-api-key'],
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000 // 30 second timeout
    };
    
    console.error(`[Bridge #${requestId}]     Request headers:`);
    console.error(`[Bridge #${requestId}]       Accept: application/json`);
    console.error(`[Bridge #${requestId}]       Content-Type: application/json`);
    console.error(`[Bridge #${requestId}]       Authorization: Bearer <token>`);
    console.error(`[Bridge #${requestId}]       x-api-key: <key>`);

    const req = httpModule.request(options, (res) => {
      console.error(`[Bridge #${requestId}] <<< HTTP Response received:`);
      console.error(`[Bridge #${requestId}]     Status: ${res.statusCode}`);
      console.error(`[Bridge #${requestId}]     Headers: ${JSON.stringify(res.headers)}`);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.error(`[Bridge #${requestId}]     Response size: ${data.length} bytes`);
        
        if (res.statusCode !== 200) {
          console.error(`[Bridge #${requestId}] ❌ HTTP Error: ${res.statusCode}`);
          console.error(`[Bridge #${requestId}]     Response body: ${data.substring(0, 500)}`);
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
          return;
        }
        
        try {
          const response = JSON.parse(data);
          console.error(`[Bridge #${requestId}] ✅ Response parsed successfully`);
          if (response.error) {
            console.error(`[Bridge #${requestId}] ⚠️  Response contains error: ${JSON.stringify(response.error)}`);
          }
          resolve(response);
        } catch (error) {
          console.error(`[Bridge #${requestId}] ❌ Failed to parse JSON response`);
          console.error(`[Bridge #${requestId}]     Error: ${error.message}`);
          console.error(`[Bridge #${requestId}]     Raw data: ${data.substring(0, 500)}`);
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`[Bridge #${requestId}] ❌ HTTP Request error: ${error.message}`);
      console.error(`[Bridge #${requestId}]     Code: ${error.code}`);
      reject(error);
    });

    req.on('timeout', () => {
      console.error(`[Bridge #${requestId}] ⏱️  Request timeout after 30s`);
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Send response to STDOUT with error handling
 */
function sendResponse(response, requestId) {
  try {
    const responseStr = JSON.stringify(response) + '\n';
    process.stdout.write(responseStr);
    console.error(`[Bridge #${requestId}] ✅ Response sent to MCP Inspector (${responseStr.length} bytes)`);
    return true;
  } catch (error) {
    console.error(`[Bridge #${requestId}] ❌ Failed to send response: ${error.message}`);
    return false;
  }
}

/**
 * Process STDIO input/output with enhanced error handling
 */
let buffer = '';

process.stdin.setEncoding('utf8');
process.stdin.resume(); // Ensure stdin doesn't pause

process.stdin.on('data', async (chunk) => {
  console.error(`[Bridge] <<< Received ${chunk.length} bytes from STDIN`);
  buffer += chunk;
  
  // Process complete JSON-RPC messages (newline-delimited)
  const lines = buffer.split('\n');
  buffer = lines.pop() || ''; // Keep incomplete line in buffer
  
  for (const line of lines) {
    if (!line.trim()) {
      console.error('[Bridge] Skipping empty line');
      continue;
    }
    
    let request;
    try {
      request = JSON.parse(line);
      console.error(`[Bridge] ✅ Parsed JSON-RPC request:`);
      console.error(`[Bridge]     Method: ${request.method}`);
      console.error(`[Bridge]     ID: ${request.id}`);
      console.error(`[Bridge]     Params: ${JSON.stringify(request.params || {}).substring(0, 200)}`);
    } catch (error) {
      console.error(`[Bridge] ❌ Failed to parse JSON from STDIN: ${error.message}`);
      console.error(`[Bridge]     Raw line: ${line.substring(0, 200)}`);
      
      const errorResponse = {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: `Parse error: ${error.message}`
        }
      };
      sendResponse(errorResponse, 'parse-error');
      continue;
    }
    
    try {
      // Handle initialize method specially - respond with MCP-compliant format
      if (request.method === 'initialize') {
        console.error(`[Bridge] 🔧 Handling initialize request locally (MCP protocol)`);
        const initializeResponse = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {}
            },
            serverInfo: {
              name: 'ica-context-studio-bridge',
              version: '1.0.0'
            }
          }
        };
        console.error(`[Bridge] ✅ Sending MCP-compliant initialize response`);
        sendResponse(initializeResponse, request.id);
        continue;
      }
      
      // Forward all other requests to HTTP MCP server
      console.error(`[Bridge] >>> Forwarding request to ICA Context Studio...`);
      const response = await sendMCPRequest(request);
      
      // Send response back via STDOUT
      sendResponse(response, request.id);
      
    } catch (error) {
      console.error(`[Bridge] ❌ Error processing request ${request.id}: ${error.message}`);
      console.error(`[Bridge]     Stack: ${error.stack}`);
      
      // Send error response
      const errorResponse = {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32603,
          message: `Bridge error: ${error.message}`,
          data: {
            originalError: error.toString(),
            method: request.method
          }
        }
      };
      sendResponse(errorResponse, request.id);
    }
  }
});

process.stdin.on('end', () => {
  console.error('[Bridge] ⚠️  STDIN closed, exiting...');
  isConnected = false;
  process.exit(0);
});

process.stdin.on('error', (error) => {
  console.error(`[Bridge] ❌ STDIN error: ${error.message}`);
  isConnected = false;
  process.exit(1);
});

process.stdout.on('error', (error) => {
  console.error(`[Bridge] ❌ STDOUT error: ${error.message}`);
  isConnected = false;
  process.exit(1);
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error(`[Bridge] ❌ Uncaught exception: ${error.message}`);
  console.error(`[Bridge]     Stack: ${error.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`[Bridge] ❌ Unhandled rejection at:`, promise);
  console.error(`[Bridge]     Reason:`, reason);
});

// Startup messages
console.error('═══════════════════════════════════════════════════════════');
console.error('[Bridge] 🚀 MCP HTTP-to-STDIO Bridge (Enhanced) started');
console.error('[Bridge] 📡 Target: ICA Context Studio');
console.error(`[Bridge] 🌐 URL: ${MCP_CONFIG.url}`);
console.error('[Bridge] 🔑 Authentication: Bearer token + x-api-key');
console.error('[Bridge] 📥 Listening on STDIN for JSON-RPC requests...');
console.error('[Bridge] 📤 Responses will be sent to STDOUT');
console.error('[Bridge] 📝 Debug logs on STDERR');
console.error('═══════════════════════════════════════════════════════════');
console.error('[Bridge] ✅ Ready to forward requests!');
console.error('');

// Made with Bob
