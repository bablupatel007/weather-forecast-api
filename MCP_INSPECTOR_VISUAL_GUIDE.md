# 🎨 Visual Guide: MCP Inspector Configuration

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR BROWSER                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         MCP Inspector UI (localhost:6274)                 │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │  Server Configuration                           │    │  │
│  │  │  ┌───────────────────────────────────────────┐  │    │  │
│  │  │  │ Transport Type: STDIO                     │  │    │  │
│  │  │  │ Command: node                             │  │    │  │
│  │  │  │ Arguments: mcp-http-bridge.js             │  │    │  │
│  │  │  │                                           │  │    │  │
│  │  │  │ [Connect Button]                          │  │    │  │
│  │  │  └───────────────────────────────────────────┘  │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ STDIO (stdin/stdout)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              mcp-http-bridge.js (Node.js Process)               │
│                                                                  │
│  ┌────────────┐         ┌──────────────┐      ┌─────────────┐  │
│  │   STDIN    │────────▶│   Bridge     │─────▶│   STDOUT    │  │
│  │  (JSON-RPC)│         │   Logic      │      │  (JSON-RPC) │  │
│  └────────────┘         └──────────────┘      └─────────────┘  │
│                               │                                 │
│                               │ HTTPS POST                      │
│                               ▼                                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ + Authorization Header
                                │ + x-api-key Header
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ICA Context Studio MCP Server                  │
│         https://servicesessentials.ibm.com/mcp-gateway/...      │
│                                                                  │
│  Available Tools:                                               │
│  ├─ context-broker-get-context                                  │
│  └─ context-broker-get-context-schema                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 MCP Inspector UI - What to Look For

### Before Configuration (Default State)
```
┌────────────────────────────────────────────────────┐
│ MCP Inspector                                      │
├────────────────────────────────────────────────────┤
│                                                    │
│ Servers:                                           │
│ ┌────────────────────────────────────────────┐    │
│ │ ⚙️  mcp-server-everything                  │    │
│ │     Transport: STDIO                       │    │
│ │     Status: ● Connected                    │    │
│ │     [Disconnect] [Remove]                  │    │
│ └────────────────────────────────────────────┘    │
│                                                    │
│ [+ Add Server]                                     │
│                                                    │
└────────────────────────────────────────────────────┘
```

### After Configuration (Your Target State)
```
┌────────────────────────────────────────────────────┐
│ MCP Inspector                                      │
├────────────────────────────────────────────────────┤
│                                                    │
│ Servers:                                           │
│ ┌────────────────────────────────────────────┐    │
│ │ 🌐 ICA Context Studio                      │    │
│ │     Transport: STDIO                       │    │
│ │     Command: node mcp-http-bridge.js       │    │
│ │     Status: ● Connected                    │    │
│ │     [Disconnect] [Remove]                  │    │
│ └────────────────────────────────────────────┘    │
│                                                    │
│ Tools:                                             │
│ ├─ 🔧 context-broker-get-context                  │
│ └─ 🔧 context-broker-get-context-schema           │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 🎯 Configuration Form - Exact Fields

When you click "Add Server", you'll see a form. Fill it like this:

```
┌─────────────────────────────────────────────────────┐
│  Add MCP Server                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Server Name (optional):                            │
│  ┌───────────────────────────────────────────────┐ │
│  │ ICA Context Studio                            │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Transport Type: *                                  │
│  ┌───────────────────────────────────────────────┐ │
│  │ STDIO                              ▼          │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Command: *                                         │
│  ┌───────────────────────────────────────────────┐ │
│  │ node                                          │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Arguments:                                         │
│  ┌───────────────────────────────────────────────┐ │
│  │ mcp-http-bridge.js                            │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Working Directory (optional):                      │
│  ┌───────────────────────────────────────────────┐ │
│  │ c:/Users/BabluPatel/Desktop/WeatherForecast   │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Environment Variables (optional):                  │
│  ┌───────────────────────────────────────────────┐ │
│  │                                               │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│         [Cancel]              [Connect]             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example

### 1. User Action in MCP Inspector
```
User clicks: "List Tools" button
```

### 2. MCP Inspector → Bridge (STDIO)
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

### 3. Bridge → ICA Context Studio (HTTPS)
```http
POST https://servicesessentials.ibm.com/mcp-gateway/.../mcp
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
x-api-key: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

### 4. ICA Context Studio → Bridge (HTTPS Response)
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "context-broker-get-context",
        "description": "Get context from ICA Context Studio",
        "inputSchema": { ... }
      },
      {
        "name": "context-broker-get-context-schema",
        "description": "Get context schema",
        "inputSchema": { ... }
      }
    ]
  }
}
```

### 5. Bridge → MCP Inspector (STDIO)
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [ ... ]
  }
}
```

### 6. MCP Inspector UI Updates
```
Tools list now shows:
✅ context-broker-get-context
✅ context-broker-get-context-schema
```

---

## 🎬 Step-by-Step Visual Walkthrough

### Step 1: Open MCP Inspector
```
Browser → http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=...
```

### Step 2: Remove Default Server
```
Click [X] or [Remove] next to "mcp-server-everything"
```

### Step 3: Add New Server
```
Click [+ Add Server] button
```

### Step 4: Fill Configuration Form
```
Transport Type: STDIO
Command: node
Arguments: mcp-http-bridge.js
```

### Step 5: Connect
```
Click [Connect] button
```

### Step 6: Wait for Connection
```
Status changes: Connecting... → ● Connected
```

### Step 7: View Tools
```
Tools list appears with ICA Context Studio tools
```

### Step 8: Test a Tool
```
Click on "context-broker-get-context"
→ See tool details
→ Fill parameters (if any)
→ Click [Execute]
→ See response
```

---

## 🎨 Color Coding in UI

- 🟢 **Green dot (●)** = Connected
- 🔴 **Red dot (●)** = Disconnected
- 🟡 **Yellow dot (●)** = Connecting
- ⚙️ **Gear icon** = Configuration
- 🔧 **Wrench icon** = Tool
- 🌐 **Globe icon** = HTTP/Network server

---

## 📊 Success Indicators

### ✅ Connection Successful
```
✓ Status shows "Connected" with green dot
✓ Server name appears (ICA Context Studio)
✓ Tools list is populated
✓ No error messages in browser console
✓ Bridge logs show successful requests
```

### ❌ Connection Failed
```
✗ Status shows "Disconnected" or "Error"
✗ Error message appears
✗ Tools list is empty
✗ Browser console shows errors
✗ Bridge logs show connection errors
```

---

## 🔍 Where to Look for Information

### In MCP Inspector UI:
- **Top/Left Panel**: Server list and status
- **Main Panel**: Tools list and details
- **Bottom Panel**: Execution results and logs

### In Browser Console (F12):
- **Console Tab**: JavaScript errors and logs
- **Network Tab**: HTTP requests (if any)
- **Application Tab**: Storage and session info

### In Terminal 2 (Bridge):
- **stderr**: Bridge logs and debug info
- **stdout**: JSON-RPC responses (not visible, piped to Inspector)

---

## 💡 Pro Tips

1. **Keep Terminal 2 visible** to see bridge logs in real-time
2. **Use browser DevTools (F12)** to debug connection issues
3. **Check both terminals** if something doesn't work
4. **Copy exact commands** from this guide to avoid typos
5. **Take screenshots** at each step for documentation

---

## 🎯 Your Goal

```
┌────────────────────────────────────────────────────┐
│ ✅ MCP Inspector connected to ICA Context Studio   │
│ ✅ Tools visible and accessible                    │
│ ✅ Can execute tools successfully                  │
│ ✅ Ready to integrate with Weather Forecast app    │
└────────────────────────────────────────────────────┘