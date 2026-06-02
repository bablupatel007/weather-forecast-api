# MCP Inspector Setup Guide for ICA Context Studio

## Overview
This guide explains how to connect the MCP Inspector to your ICA Context Studio MCP server using the HTTP-to-STDIO bridge.

## Problem
The MCP Inspector UI only supports STDIO-based MCP servers by default, but your ICA Context Studio uses a "streamable-http" transport type. We've created a bridge script to solve this.

## Solution Architecture
```
MCP Inspector (STDIO) <--> Bridge Script <--> ICA Context Studio (HTTP)
```

## Step-by-Step Setup

### Step 1: Verify Files
Ensure these files exist in your project:
- ✅ `.bob/mcp.json` - Your MCP server configuration
- ✅ `mcp-http-bridge.js` - The bridge script (just created)

### Step 2: Open MCP Inspector
The MCP Inspector should already be running at:
```
http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=<your-token>
```

If not running, start it with:
```bash
npx @modelcontextprotocol/inspector
```

### Step 3: Configure MCP Inspector

In the MCP Inspector web interface:

1. **Clear the default server** (mcp-server-everything)

2. **Add your ICA Context Studio server:**
   - Click on the server configuration area
   - Select **Transport Type: STDIO**
   - Enter the following command:

   ```bash
   node mcp-http-bridge.js
   ```

   Or use the full path:
   ```bash
   node c:/Users/BabluPatel/Desktop/WeatherForecast/mcp-http-bridge.js
   ```

3. **Click "Connect"**

### Step 4: Verify Connection

Once connected, you should see:

#### Expected Tools:
- ✅ `context-broker-get-context`
- ✅ `context-broker-get-context-schema`

#### Server Information:
- **Name:** ICA Context Studio
- **Version:** (as reported by the server)
- **Transport:** STDIO (via bridge)

### Step 5: Test a Tool

1. Select `context-broker-get-context` from the tools list
2. Click on it to see the tool details
3. Fill in required parameters (if any)
4. Click "Execute" or "Run Tool"
5. Verify you get a response from the ICA Context Studio

## Troubleshooting

### Issue: "Command not found" or "node not found"
**Solution:** Ensure Node.js is in your PATH. Try:
```bash
where node
```

### Issue: "Connection failed" or "Bridge not responding"
**Solution:** 
1. Check if the bridge script has correct permissions
2. Verify your authentication tokens in `.bob/mcp.json` are valid
3. Check the browser console for error messages

### Issue: "401 Unauthorized" or "403 Forbidden"
**Solution:** Your API tokens may have expired. Check:
- Bearer token expiration: `exp: 1781609287` (timestamp)
- x-api-key expiration: `exp: 1781609287` (timestamp)

If expired, you'll need to regenerate tokens from ICA Context Studio.

### Issue: Bridge script errors
**Solution:** Run the bridge manually to see detailed logs:
```bash
node mcp-http-bridge.js
```
Then type a test JSON-RPC request:
```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}
```

## Configuration Details

### Your ICA Context Studio Configuration
From `.bob/mcp.json`:
```json
{
  "mcpServers": {
    "context-studio": {
      "type": "streamable-http",
      "url": "https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/8ccdd203bdee4014b08e82eedb6046e2/mcp",
      "headers": {
        "Authorization": "Bearer <token>",
        "x-api-key": "<api-key>"
      }
    }
  }
}
```

### Bridge Script Features
- ✅ Converts STDIO to HTTP requests
- ✅ Forwards all JSON-RPC messages
- ✅ Includes authentication headers
- ✅ Provides debug logging to stderr
- ✅ Handles errors gracefully

## Expected Workflow

1. **MCP Inspector sends** JSON-RPC request via STDIO
2. **Bridge receives** request on stdin
3. **Bridge forwards** request to ICA Context Studio via HTTPS POST
4. **ICA Context Studio processes** request
5. **Bridge receives** HTTP response
6. **Bridge sends** response back via stdout
7. **MCP Inspector displays** result

## Testing Checklist

- [ ] MCP Inspector is running at localhost:6274
- [ ] Bridge script is configured in Inspector
- [ ] Connection established successfully
- [ ] Tools list shows ICA Context Studio tools
- [ ] `context-broker-get-context` is visible
- [ ] `context-broker-get-context-schema` is visible
- [ ] Successfully executed at least one tool
- [ ] Response received from ICA Context Studio

## Screenshots to Capture

1. **MCP Inspector main page** showing connection status
2. **Server configuration** with the bridge command
3. **Tools list** showing ICA Context Studio tools
4. **Tool details** for `context-broker-get-context`
5. **Execution result** after running a tool

## Next Steps

After successful connection:
1. Explore available tools
2. Test each tool with sample parameters
3. Document tool responses
4. Integrate tools into your Weather Forecast application

## Support

If you encounter issues:
1. Check the browser console (F12) for errors
2. Review bridge script logs (stderr output)
3. Verify network connectivity to IBM services
4. Confirm API tokens are valid and not expired

## Important Notes

⚠️ **Security:** The bridge script contains your API tokens. Keep it secure and don't commit to public repositories.

⚠️ **Token Expiration:** Your tokens expire on `2025-02-13`. You'll need to refresh them before that date.

⚠️ **Network:** Ensure you have internet connectivity to reach `servicesessentials.ibm.com`.