# 🤖 WhatsApp + n8n Automation Setup Guide

**סטטוס**: ✅ Production-Ready  
**תאריך**: 2026-06-17  
**Owner**: proximity03907@gmail.com

---

## 📋 מה יש לך

- ✅ **whatsapp-mcp-server** - מחובר ל-Meta Official Cloud API (קוד מוכן)
- ✅ **n8n MCP Server** - `https://opiko666.app.n8n.cloud/mcp-server/http`
- ✅ **2 JWT Tokens** - public-api + mcp-server-api
- ✅ **Workflow Templates** - לבוטים חדשים

---

## 🚀 איך להרים בוט חדש לקלינט

### **שלב 1: אסוף מפרטים לקלינט (5 דקות)**

כשקלינט רוצה בוט חדש, אתה צריך:

```json
{
  "client_name": "Jewelry Store",
  "whatsapp_number": "+972123456789",
  "whatsapp_business_account_id": "xxx",
  "automations": [
    {
      "trigger": "customer_order",
      "action": "save_to_database_and_notify"
    },
    {
      "trigger": "customer_question",
      "action": "ai_agent_response"
    }
  ]
}
```

### **שלב 2: צור חדש Environment עבור הקלינט (10 דקות)**

```bash
# 1. צור תיקיה חדשה
mkdir C:\Users\GamingPC\Desktop\whatsapp-automation\clients\[CLIENT_NAME]

# 2. העתק את ה-template
copy whatsapp-mcp-server C:\Users\GamingPC\Desktop\whatsapp-automation\clients\[CLIENT_NAME]\whatsapp-mcp

# 3. צור .env עם הפרטים של הקלינט
# (ראה סעיף "ENV TEMPLATE" למטה)
```

### **שלב 3: בנה n8n Workflow (20 דקות)**

בקישור: `https://opiko666.app.n8n.cloud`

1. **Create New Workflow**
2. **Add Trigger**: HTTP Request (incoming from WhatsApp MCP)
3. **Add Nodes**:
   - Parse incoming message
   - Route to correct automation
   - Execute action (database, AI agent, etc.)
   - Send response back via WhatsApp

### **שלב 4: חבר WhatsApp MCP ל-n8n (10 דקות)**

בקובץ `.claude/settings.json`:

```json
{
  "mcpServers": {
    "whatsapp-client-[NAME]": {
      "command": "node",
      "args": [
        "C:/Users/GamingPC/Desktop/whatsapp-automation/clients/[CLIENT_NAME]/whatsapp-mcp/dist/index.js"
      ],
      "env": {
        "WHATSAPP_PHONE_NUMBER_ID": "xxx",
        "WHATSAPP_ACCESS_TOKEN": "xxx",
        "WHATSAPP_WEBHOOK_VERIFY_TOKEN": "random-secret-123",
        "WEBHOOK_PORT": "3000",
        "WEBHOOK_PATH": "/webhook"
      }
    }
  }
}
```

### **שלב 5: בדוק End-to-End (15 דקות)**

1. הרם MCP server
2. שלח הודעה WhatsApp ל-בוט
3. בדוק שהיא הגיעה ל-n8n
4. בדוק שה-workflow בוצע
5. בדוק שתשובה חזרה ל-WhatsApp

---

## 📝 ENV TEMPLATE

שמור בקובץ `.env` בכל client folder:

```bash
# WhatsApp Cloud API Credentials (from Meta App Dashboard)
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

# Webhook Configuration (for receiving messages)
WHATSAPP_WEBHOOK_VERIFY_TOKEN=random-secret-string-123
WEBHOOK_PORT=3000
WEBHOOK_PATH=/webhook

# Security (optional but recommended)
WHATSAPP_APP_SECRET=your_app_secret
WHATSAPP_API_VERSION=v21.0

# Logging
LOG_LEVEL=info
```

**איפה להוציא את הערכים:**

1. **WHATSAPP_PHONE_NUMBER_ID** → Meta App Dashboard > WhatsApp > API Setup > Phone Number ID
2. **WHATSAPP_ACCESS_TOKEN** → Meta App Dashboard > WhatsApp > API Setup > Permanent Access Token
3. **WHATSAPP_BUSINESS_ACCOUNT_ID** → Meta App Dashboard > WhatsApp > Business Account ID
4. **WHATSAPP_APP_SECRET** → Meta App Dashboard > Settings > Basic > App Secret

---

## 🔗 n8n Workflow Template

יוצר workflow שמקבל הודעות WhatsApp:

```javascript
// n8n workflow JSON (simplified)
{
  "name": "WhatsApp Automation - [CLIENT_NAME]",
  "nodes": [
    {
      "name": "Webhook - WhatsApp Incoming",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "webhookId": "auto",
      "webhookPath": "whatsapp-[CLIENT_NAME]",
      "webhookMethods": ["POST"]
    },
    {
      "name": "Parse Message",
      "type": "n8n-nodes-base.set",
      "position": [450, 300],
      "parameters": {
        "keepOnlySet": false,
        "values": {
          "string": [
            {
              "name": "from",
              "value": "={{ $json.from }}"
            },
            {
              "name": "message",
              "value": "={{ $json.message }}"
            }
          ]
        }
      }
    },
    {
      "name": "Route to Automation",
      "type": "n8n-nodes-base.switch",
      "position": [650, 300],
      "parameters": {
        "cases": [
          {
            "condition": "contains",
            "value1": "={{ $json.message }}",
            "value2": "order",
            "output": 1
          },
          {
            "condition": "contains",
            "value1": "={{ $json.message }}",
            "value2": "help",
            "output": 2
          }
        ],
        "fallbackOutput": 3
      }
    },
    {
      "name": "Save Order to DB",
      "type": "n8n-nodes-base.postgres",
      "position": [850, 250],
      "parameters": {
        "operation": "insert",
        "schema": "public",
        "table": "orders",
        "columns": "customer_phone,order_details,created_at"
      }
    },
    {
      "name": "Send AI Response",
      "type": "n8n-nodes-base.http",
      "position": [850, 400],
      "parameters": {
        "method": "POST",
        "url": "{{ $env.AI_AGENT_URL }}",
        "sendBody": true,
        "bodyParameters": [
          {
            "name": "message",
            "value": "={{ $json.message }}"
          }
        ]
      }
    }
  ]
}
```

---

## 🎯 Quick Reference - Commands

```bash
# Start WhatsApp MCP for a client
node C:/Users/GamingPC/Desktop/whatsapp-automation/clients/[CLIENT_NAME]/whatsapp-mcp/dist/index.js

# Test connection
npm test

# View logs
# Check console output - logs print to stderr

# Rebuild if you change source
npm run build
```

---

## 📊 Architecture

```
[Customer sends WhatsApp] 
        ↓
[WhatsApp Cloud API]
        ↓
[whatsapp-mcp-server runs locally]
        ↓
[n8n MCP Server Trigger]
        ↓
[n8n Workflow Executes]
        ↓
[Action: Save to DB / Send to AI Agent / etc.]
        ↓
[Send Response back via WhatsApp]
```

---

## ✅ Checklist: איזה עובד?

- ✅ whatsapp-mcp-server built locally
- ✅ Can send WhatsApp messages
- ✅ Can receive incoming messages (via webhook)
- ✅ n8n MCP Server configured
- ✅ n8n Workflow template created
- ✅ End-to-end tested

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Missing WHATSAPP_PHONE_NUMBER_ID" | Fill .env with Meta credentials |
| "Cannot connect to WhatsApp API" | Check access token validity in Meta dashboard |
| "Webhook not receiving messages" | Ensure WEBHOOK_PORT matches n8n config, use ngrok for local dev |
| "n8n MCP not connecting" | Verify Bearer token is valid and not expired |
| "Rate limited by WhatsApp" | Add exponential backoff (automatic in whatsapp-mcp-server) |

---

## 📞 Support

- **n8n Docs**: https://docs.n8n.io
- **WhatsApp Cloud API**: https://developers.facebook.com/docs/whatsapp/cloud-api
- **MCP Protocol**: https://modelcontextprotocol.io

---

**Last Updated**: 2026-06-17
