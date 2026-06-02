# 🚀 Fresh MCP Inspector Setup - Step by Step

## ✅ Current Status

### Services Running:
- ✅ **MCP Inspector UI**: http://localhost:6274 (PID 18256)
- ✅ **MCP Proxy Server**: localhost:6277 (PID 4336)
- ✅ **Enhanced Bridge Script**: `mcp-http-bridge.js` (ready)

### Fresh Session URL:
```
http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=1e4ee1ccad328b14624e2b6d33737d0208922cfbddad437c6992bdfcbe8fc217
```

---

## 📋 Step-by-Step Instructions

### Step 1: Open MCP Inspector
**Action:** Open this URL in your browser:
```
http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=1e4ee1ccad328b14624e2b6d33737d0208922cfbddad437c6992bdfcbe8fc217
```

**Expected:** MCP Inspector UI loads successfully

---

### Step 2: Remove Default Server
**Action:** 
1. Look for "mcp-server-everything" in the server list
2. Click the **X** or **Remove** button next to it

**Expected:** Default server is removed from the list

---

### Step 3: Add ICA Context Studio Server
**Action:** Click the **"+ Add Server"** or **"Add Server"** button

**Expected:** A configuration form appears

---

### Step 4: Fill Configuration Form

**IMPORTANT:** Use the FULL PATH to avoid any path resolution issues

Fill in these exact values:

```
Transport Type: STDIO
Command: node
Arguments: c:/Users/BabluPatel/Desktop/WeatherForecast/mcp-http-bridge.js
```

**Alternative (if above doesn't work):**
```
Transport Type: STDIO
Command: C:\Program Files\nodejs\node.exe
Arguments: c:/Users/BabluPatel/Desktop/WeatherForecast/mcp-http-bridge.js
```

**Screenshot this form before clicking Connect!**

---

### Step 5: Click Connect
**Action:** Click the **"Connect"** button

**Expected:** 
- Status changes to "Connecting..."
- Then changes to "● Connected" (green dot)
- Terminal shows bridge logs

---

### Step 6: Monitor Terminal Output

**Watch Terminal 1** for these messages:

```
New STDIO connection request
STDIO transport: command=C:\Program Files\nodejs\node.exe, args=mcp-http-bridge.js
Created client transport
Created server transport
```

**If bridge starts successfully, you'll see:**
```
═══════════════════════════════════════════════════════════
[Bridge] 🚀 MCP HTTP-to-STDIO Bridge (Enhanced) started
[Bridge] 📡 Target: ICA Context Studio
[Bridge] 🌐 URL: https://servicesessentials.ibm.com/...
[Bridge] 🔑 Authentication: Bearer token + x-api-key
[Bridge] 📥 Listening on STDIN for JSON-RPC requests...
[Bridge] 📤 Responses will be sent to STDOUT
[Bridge] 📝 Debug logs on STDERR
═══════════════════════════════════════════════════════════
[Bridge] ✅ Ready to forward requests!

[Bridge] <<< Received X bytes from STDIN
[Bridge] ✅ Parsed JSON-RPC request:
[Bridge]     Method: initialize
[Bridge]     ID: 1
```

---

### Step 7: Verify Connection

**In MCP Inspector UI, check for:**

1. **Server Status:**
   - Name: Should show server info
   - Status: ● Connected (green)
   - Transport: STDIO

2. **Tools List:**
   - `context-broker-get-context`
   - `context-broker-get-context-schema`

**If you see these tools, SUCCESS! 🎉**

---

### Step 8: Test a Tool

**Action:**
1. Click on `context-broker-get-context`
2. Review the tool description
3. Fill in any required parameters
4. Click **"Execute"** or **"Run"**

**Expected:**
- Terminal shows HTTP request to ICA
- Terminal shows HTTP response
- MCP Inspector shows tool result

---

## 🐛 Troubleshooting

### Issue 1: "Failed to fetch" or "Couldn't connect to MCP Proxy Server"

**Cause:** Browser can't reach the proxy server

**Solution:**
1. Verify Terminal 1 is still running
2. Check ports: `netstat -ano | findstr ":6274 :6277"`
3. Refresh the browser page
4. Use the fresh URL with the new token

---

### Issue 2: "Connection Error" after clicking Connect

**Cause:** Bridge script failed to start

**Check Terminal 1 for:**
```
Error: spawn node ENOENT
```
OR
```
Error: Cannot find module 'mcp-http-bridge.js'
```

**Solution:**
- Use full path to node.exe: `C:\Program Files\nodejs\node.exe`
- Use full path to bridge: `c:/Users/BabluPatel/Desktop/WeatherForecast/mcp-http-bridge.js`
- Verify file exists: `Test-Path c:/Users/BabluPatel/Desktop/WeatherForecast/mcp-http-bridge.js`

---

### Issue 3: Bridge starts but no tools appear

**Check Terminal 1 for:**
```
[Bridge #1] ❌ HTTP Error: 401
```
OR
```
[Bridge #1] ❌ HTTP Error: 403
```

**Cause:** Authentication failed

**Solution:**
- Your API tokens may have expired
- Check expiration: Feb 13, 2025 (timestamp: 1781609287)
- If expired, regenerate tokens from ICA Context Studio

---

### Issue 4: "ECONNREFUSED" or "ETIMEDOUT"

**Check Terminal 1 for:**
```
[Bridge #1] ❌ HTTP Request error: ECONNREFUSED
```

**Cause:** Can't reach ICA Context Studio

**Solution:**
1. Check internet connectivity
2. Verify URL is accessible: `curl -I https://servicesessentials.ibm.com`
3. Check firewall/proxy settings

---

## 📸 Screenshots to Capture

Please capture these screenshots:

### 1. MCP Inspector Main Page
- Show the URL with token
- Show the server configuration area

### 2. Configuration Form
- Show Transport Type: STDIO
- Show Command: node
- Show Arguments: full path to bridge script

### 3. Connected State
- Show "● Connected" status
- Show tools list with ICA tools

### 4. Terminal Output
- Show bridge startup messages
- Show initialize request/response
- Show tools/list request/response

### 5. Tool Execution
- Show tool details
- Show execution result

---

## 🎯 Success Checklist

- [ ] MCP Inspector UI loaded at localhost:6274
- [ ] Fresh URL with new token used
- [ ] Default server removed
- [ ] New server added with STDIO transport
- [ ] Full path to bridge script used
- [ ] Connected successfully (green dot)
- [ ] Terminal shows bridge startup logs
- [ ] Terminal shows initialize request/response
- [ ] Tools list shows ICA Context Studio tools
- [ ] `context-broker-get-context` visible
- [ ] `context-broker-get-context-schema` visible
- [ ] Successfully executed at least one tool

---

## 🔧 Quick Commands

### Check if ports are in use:
```powershell
netstat -ano | findstr ":6274 :6277"
```

### Check if bridge file exists:
```powershell
Test-Path c:/Users/BabluPatel/Desktop/WeatherForecast/mcp-http-bridge.js
```

### Find node.exe location:
```powershell
where.exe node
```

### Test bridge manually:
```powershell
node c:/Users/BabluPatel/Desktop/WeatherForecast/mcp-http-bridge.js
```
Then type:
```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}
```

---

## 💡 Important Notes

1. **Keep Terminal 1 running** - Don't close it!
2. **Use the fresh URL** - Old tokens won't work
3. **Use full paths** - Avoid path resolution issues
4. **Watch terminal logs** - They show exactly what's happening
5. **Be patient** - First connection may take a few seconds

---

## 🚀 Ready to Connect!

Everything is set up and ready:
- ✅ MCP Inspector running
- ✅ Proxy server running
- ✅ Bridge script enhanced and ready
- ✅ Fresh authentication token generated

Follow the steps above and share your results!