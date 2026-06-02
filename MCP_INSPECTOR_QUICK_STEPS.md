# 🚀 Quick Steps: Connect MCP Inspector to ICA Context Studio

## Current Status
✅ MCP Inspector running at: http://localhost:6274  
✅ Bridge script created: `mcp-http-bridge.js`  
✅ Bridge script tested and ready

---

## 📋 Follow These Exact Steps

### Step 1: Open MCP Inspector
Go to your browser and open:
```
http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=9a1f89c6c333193fc7946e8625305d7bc8e6c64b660a191e68fea3bb8ccb094f
```

### Step 2: Configure Server in MCP Inspector UI

1. **Look for the server configuration section** (usually on the left side or top)

2. **Remove/Clear the default demo server:**
   - You'll see "mcp-server-everything" 
   - Click the X or delete button to remove it

3. **Add New Server:**
   - Click "Add Server" or "+" button
   - You'll see a form with these fields:

4. **Fill in the form:**
   ```
   Transport Type: STDIO
   Command: node
   Arguments: mcp-http-bridge.js
   ```
   
   OR use the full path:
   ```
   Transport Type: STDIO
   Command: node
   Arguments: c:/Users/BabluPatel/Desktop/WeatherForecast/mcp-http-bridge.js
   ```

5. **Click "Connect" or "Start Server"**

### Step 3: Verify Connection

You should see:
- ✅ Connection status: "Connected" (green indicator)
- ✅ Server name: Should show ICA Context Studio info
- ✅ Tools list appears

### Step 4: Check Available Tools

Look for these tools in the tools list:
- ✅ `context-broker-get-context`
- ✅ `context-broker-get-context-schema`

### Step 5: Test a Tool

1. Click on `context-broker-get-context`
2. Review the tool description and parameters
3. Fill in any required parameters
4. Click "Execute" or "Run"
5. Check the response

---

## 🎯 What You Should See

### In MCP Inspector UI:
```
┌─────────────────────────────────────┐
│ Server: ICA Context Studio          │
│ Status: ● Connected                 │
│ Transport: STDIO                    │
└─────────────────────────────────────┘

Tools Available:
├─ context-broker-get-context
└─ context-broker-get-context-schema
```

### In Terminal (Bridge Logs):
```
[Bridge] MCP HTTP-to-STDIO Bridge started
[Bridge] Connecting to: https://servicesessentials.ibm.com/...
[Bridge] Ready to forward requests...
[Bridge] Received request: initialize
[Bridge] Sent response for: initialize
[Bridge] Received request: tools/list
[Bridge] Sent response for: tools/list
```

---

## 📸 Screenshots to Capture

Please capture these screenshots:

1. **MCP Inspector Main Page**
   - Show the server configuration area
   - Show connection status

2. **Server Configuration Form**
   - Show the STDIO transport type selected
   - Show the command: `node mcp-http-bridge.js`

3. **Connected State**
   - Show "Connected" status
   - Show the tools list with ICA tools

4. **Tool Details**
   - Click on `context-broker-get-context`
   - Show the tool description and parameters

5. **Tool Execution**
   - Show a successful tool execution
   - Show the response from ICA Context Studio

---

## 🔧 Alternative Configuration Methods

### Method 1: Using Full Path (Recommended for Windows)
```
Command: node
Arguments: c:/Users/BabluPatel/Desktop/WeatherForecast/mcp-http-bridge.js
```

### Method 2: Using Relative Path
```
Command: node
Arguments: ./mcp-http-bridge.js
```

### Method 3: Single Command (if supported)
```
Command: node mcp-http-bridge.js
```

---

## ⚠️ Troubleshooting

### If connection fails:

1. **Check Terminal 2** - Bridge should show:
   ```
   [Bridge] MCP HTTP-to-STDIO Bridge started
   [Bridge] Ready to forward requests...
   ```

2. **Check Browser Console** (F12):
   - Look for any error messages
   - Check Network tab for failed requests

3. **Verify Node.js**:
   ```bash
   node --version
   ```
   Should show v14 or higher

4. **Test Bridge Manually**:
   - Stop Terminal 2 (Ctrl+C)
   - Run: `node mcp-http-bridge.js`
   - Type: `{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}`
   - Press Enter
   - Should see a response

---

## 📝 Notes

- The bridge script is already running in Terminal 2
- You may need to stop it (Ctrl+C) before MCP Inspector can use it
- MCP Inspector will start its own instance of the bridge
- Keep Terminal 1 (MCP Inspector) running
- The bridge logs will appear in the MCP Inspector's terminal output

---

## ✅ Success Criteria

You've successfully connected when:
- [ ] MCP Inspector shows "Connected" status
- [ ] Tools list displays ICA Context Studio tools
- [ ] `context-broker-get-context` is visible
- [ ] `context-broker-get-context-schema` is visible
- [ ] You can click on a tool and see its details
- [ ] You can execute a tool and get a response

---

## 🎉 Next Steps After Connection

1. Explore all available tools
2. Test each tool with sample data
3. Document the tool responses
4. Plan integration with Weather Forecast app
5. Update application to use ICA Context Studio tools

---

## 📞 Need Help?

If you encounter issues:
1. Share screenshots of the MCP Inspector UI
2. Share Terminal 2 output (bridge logs)
3. Share browser console errors (F12)
4. Describe what happens when you click "Connect"