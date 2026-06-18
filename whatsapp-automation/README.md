# 🚀 WhatsApp Bot Automation Platform

**Professional WhatsApp automation system for building custom bots using n8n + Official Meta API**

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-Private-blue)
![Owner](https://img.shields.io/badge/Owner-proximity03907%40gmail.com-blueviolet)

---

## 📦 What's Included

```
whatsapp-automation/
├── whatsapp-mcp-server/          # WhatsApp MCP server (built & ready)
├── clients/                       # Client-specific installations
│   └── [CLIENT_NAME]/
│       ├── whatsapp-mcp/         # Copy of server (env-specific)
│       ├── .env                  # Credentials for this client
│       └── workflows/            # n8n workflows
├── SETUP_GUIDE.md                # Complete setup documentation
├── CLIENT_ENV_TEMPLATE.env       # Template for .env files
├── N8N_WORKFLOW_TEMPLATE.json    # Template workflow
├── CLAUDE_SETTINGS_TEMPLATE.json # MCP configuration template
└── README.md                     # This file
```

---

## ⚡ Quick Start (30 seconds)

You need to set up automations? Here's what you do:

### 1️⃣ **Client Info**
Collect from client:
```
- WhatsApp Number: +972123456789
- Business Account ID: xxx
- Use Cases: orders, customer support, notifications
```

### 2️⃣ **Run Setup Script**
```bash
cd C:\Users\GamingPC\Desktop\whatsapp-automation
powershell .\setup-new-client.ps1 -ClientName "MyClient" -PhoneNumber "+972123456789"
```

### 3️⃣ **Fill Credentials**
Edit `clients/MyClient/.env` with Meta API credentials

### 4️⃣ **Deploy Workflow**
Import `N8N_WORKFLOW_TEMPLATE.json` into n8n

### 5️⃣ **Test**
Send WhatsApp message → Verify in n8n → Bot responds

---

## 🔧 Technology Stack

| Component | Technology | Status |
|-----------|-----------|--------|
| **WhatsApp API** | Meta Official Cloud API (v21.0) | ✅ Production |
| **MCP Server** | Node.js + TypeScript | ✅ Built |
| **Automation Platform** | n8n | ✅ Configured |
| **Connection** | HTTP + MCP Protocol | ✅ Ready |
| **Database** | (Your choice - PostgreSQL recommended) | ⏳ Per-client |

---

## 📋 Architecture

```
WhatsApp User
    ↓
    [sends message]
    ↓
Meta WhatsApp Cloud API
    ↓
    [webhook POST]
    ↓
whatsapp-mcp-server (localhost:3000)
    ↓
    [MCP protocol]
    ↓
n8n Workflow
    ↓
    [executes automation]
    ↓
    [database, AI agent, etc.]
    ↓
    [sends response]
    ↓
Meta WhatsApp Cloud API
    ↓
WhatsApp User [receives message]
```

---

## 🎯 Use Cases Supported

✅ **E-commerce**
- Order placement
- Order status tracking
- Inventory notifications

✅ **Customer Support**
- FAQ automation
- Ticket creation
- Knowledge base queries

✅ **Notifications**
- Appointment reminders
- Delivery updates
- Alert notifications

✅ **AI Agents**
- ChatGPT integration
- Custom LLM responses
- Context-aware conversations

✅ **Database Operations**
- Save conversations
- Update records
- Generate reports

---

## 📖 Full Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete step-by-step setup
- **[CLIENT_ENV_TEMPLATE.env](CLIENT_ENV_TEMPLATE.env)** - Environment variables
- **[N8N_WORKFLOW_TEMPLATE.json](N8N_WORKFLOW_TEMPLATE.json)** - Workflow template
- **whatsapp-mcp-server/README.md** - MCP server details

---

## 🚀 For Each New Client

### Time Breakdown
| Step | Time | What You Do |
|------|------|-----------|
| Setup Directory | 2 min | Run setup script |
| Fill Credentials | 5 min | Copy/paste from Meta Dashboard |
| Configure Workflow | 15 min | Import template + customize |
| Test End-to-End | 10 min | Send test message |
| **Total** | **32 min** | Ready to invoice client |

### Commands

```bash
# 1. Create new client environment
powershell .\setup-new-client.ps1 -ClientName "ClientName"

# 2. Start WhatsApp MCP for client
cd clients/ClientName
node whatsapp-mcp/dist/index.js

# 3. View logs (in another terminal)
# Logs print to console - watch for errors

# 4. Test connection
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"from":"972123456789","message":"test"}'
```

---

## 🔑 Environment Variables (Per Client)

```env
# Required
WHATSAPP_PHONE_NUMBER_ID=your_id
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id

# Recommended
WHATSAPP_WEBHOOK_VERIFY_TOKEN=random_secret
WHATSAPP_APP_SECRET=your_app_secret

# Optional
WEBHOOK_PORT=3000
LOG_LEVEL=info
```

**Where to get values**: Meta App Dashboard > WhatsApp > API Setup

---

## 🧪 Testing

### Test WhatsApp Message Reception
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=xxx" \
  -d '{
    "from": "+972123456789",
    "message": "test message",
    "type": "text",
    "timestamp": 1234567890
  }'
```

### Expected Response
```json
{
  "status": "ok",
  "message": "Webhook received"
}
```

---

## 📊 n8n Integration

### MCP Server Connection
- **URL**: `https://opiko666.app.n8n.cloud/mcp-server/http`
- **Auth**: Bearer token (configured)
- **Status**: ✅ Connected

### Workflow Import
1. Go to n8n dashboard
2. **Create New Workflow**
3. **Tools > Import JSON**
4. Paste `N8N_WORKFLOW_TEMPLATE.json`
5. Customize for your client

---

## 🔐 Security Best Practices

✅ **Do**
- Store credentials in `.env` files (not in code)
- Use permanent access tokens (not temporary)
- Enable webhook signature verification with APP_SECRET
- Rotate tokens periodically
- Use HTTPS for production webhooks

❌ **Don't**
- Paste API keys in chat or emails
- Commit `.env` files to git
- Use temporary tokens
- Skip signature verification
- Share credentials between clients

---

## 🛠️ Troubleshooting

| Issue | Fix |
|-------|-----|
| "Cannot find module" | Run `npm install` in client folder |
| "Invalid token" | Check token is PERMANENT (not 2hr temp token) |
| "Webhook not receiving" | Verify WEBHOOK_PORT is open, use ngrok for local |
| "No response from WhatsApp" | Check phone number format includes country code |
| "Connection refused to n8n" | Verify n8n MCP token is valid |

---

## 📈 Scaling

For multiple clients:
```
clients/
├── client-jewelry/
├── client-restaurant/
├── client-delivery/
├── client-support/
└── client-ai-agent/
```

Each runs independently with:
- Own WhatsApp number
- Own n8n workflows
- Own database
- Own .env credentials

---

## 📞 Support Resources

- **n8n Docs**: https://docs.n8n.io
- **Meta WhatsApp API**: https://developers.facebook.com/docs/whatsapp/cloud-api
- **MCP Protocol**: https://modelcontextprotocol.io

---

## 📝 Changelog

### v1.0.0 - 2026-06-17
- ✅ whatsapp-mcp-server built and tested
- ✅ n8n MCP integration configured
- ✅ Workflow templates created
- ✅ Setup documentation complete
- ✅ Production ready

---

## 🎯 Next Steps

1. **First Client**: Follow SETUP_GUIDE.md step-by-step
2. **Test Everything**: Send test WhatsApp messages
3. **Automate Setup**: Use setup script for future clients
4. **Scale**: Add more clients to `clients/` directory
5. **Monetize**: Charge per client (subscription or flat fee)

---

## 📄 License

Private project for proximity03907@gmail.com

---

**Ready to build? See [SETUP_GUIDE.md](SETUP_GUIDE.md) 🚀**
