# Workflow: Slack to Telegram - Anthropic Integration

**עברית:** אינטגרציה מלאה בין Slack, Telegram ו-Anthropic Sessions API לתעבור הודעות יחריות בעיתוי אמת.

---

## 📋 סקירת Workflow

```
[Slack Webhook] → [Parse JSON] → [Telegram Send Message] → [Telegram Button Listener] → [Anthropic API Call]
```

**זרימה:**
1. Slack שולח JSON עם event `human_handoff_requested`
2. Parse זוקף את כל השדות
3. Telegram שולח הודעה למשתמש עם כפתור "הצטרף לשיחה"
4. לחיצה על הכפתור מפעילת HTTP Request ל-Anthropic Sessions API
5. תשובה חוזרת לשיחה בטלגרם

---

## 🔧 צומת #1: Slack Webhook Trigger

**שם בN8N:** `Slack Webhook Trigger`

**סוג:** Slack Node - Webhook

### הגדרות:
| שדה | ערך |
|------|------|
| **Node Type** | Slack - Webhook |
| **Webhook Trigger** | Enabled |
| **Events to Listen** | Message Posted |
| **Channel Selection** | Specific Channel |
| **Channel** | בחר את ערוץ ה-Slack שלך (למשל: `#ai-handoffs`) |

### Auth:
- **Credentials:** הוסף Slack OAuth Token
- **Permission Scopes Required:**
  - `channels:read`
  - `chat:write`
  - `incoming-webhook`

### הודעה מצופה ב-Slack (שנשלחת על ידי Agent):
```json
{
  "event": "human_handoff_requested",
  "session_id": "sesn_xxxxx",
  "client_name": "שם הלקוח",
  "topic": "נושא הפניה",
  "summary": "תקציר השיחה",
  "urgency": "normal",
  "timestamp": "2025-01-15T14:32:00",
  "action_required": "join_chat"
}
```

### Output Data Structure:
```
$json.body = {
  "text": "{JSON_STRING}",
  "channel": "C12345678",
  "user": "U87654321",
  ...
}
```

---

## 🔧 צומת #2: Parse JSON

**שם בN8N:** `Parse JSON`

**סוג:** Set / Code Node

### הגדרות:
| שדה | ערך |
|------|------|
| **Node Type** | Code (JavaScript) |
| **Mode** | Run Once |

### JavaScript Code:
```javascript
// Extract the JSON from Slack message text
const slackMessage = $json.body.text;
const jsonData = JSON.parse(slackMessage);

return {
  event: jsonData.event,
  session_id: jsonData.session_id,
  client_name: jsonData.client_name,
  topic: jsonData.topic,
  summary: jsonData.summary,
  urgency: jsonData.urgency,
  timestamp: jsonData.timestamp,
  action_required: jsonData.action_required,
  slack_user_id: $json.body.user,
  slack_channel_id: $json.body.channel
};
```

### Output:
```
{
  "event": "human_handoff_requested",
  "session_id": "sesn_xxxxx",
  "client_name": "שם הלקוח",
  "topic": "נושא הפניה",
  "summary": "תקציר השיחה",
  "urgency": "normal",
  "timestamp": "2025-01-15T14:32:00",
  "action_required": "join_chat",
  "slack_user_id": "U87654321",
  "slack_channel_id": "C12345678"
}
```

---

## 🔧 צומת #3: Telegram Send Message with Button

**שם בN8N:** `Telegram Send Message`

**סוג:** Telegram Node - Send Message

### הגדרות:
| שדה | ערך / Expression |
|------|------|
| **Node Type** | Telegram - Send Message |
| **Chat ID** | `{{ $env.TELEGRAM_USER_ID }}` |
| **Text** | *ראה למטה* |
| **Parse Mode** | HTML |
| **Reply Markup** | Inline Keyboard |

### Text Message Template (HTML):
```html
📞 <b>בקשת Handoff חדשה</b>

<b>לקוח:</b> {{ $node["Parse JSON"].json.client_name }}
<b>נושא:</b> {{ $node["Parse JSON"].json.topic }}
<b>דחיפות:</b> {{ $node["Parse JSON"].json.urgency }}

<b>תקציר:</b>
{{ $node["Parse JSON"].json.summary }}

<b>Session ID:</b> <code>{{ $node["Parse JSON"].json.session_id }}</code>
```

### Inline Keyboard Configuration:
```json
{
  "inline_keyboard": [
    [
      {
        "text": "✅ הצטרף לשיחה",
        "callback_data": "join_chat_{{ $node[\"Parse JSON\"].json.session_id }}"
      }
    ],
    [
      {
        "text": "❌ דחה",
        "callback_data": "reject_{{ $node[\"Parse JSON\"].json.session_id }}"
      }
    ]
  ]
}
```

### Credentials:
- **Telegram Bot Token:** `{{ $env.TELEGRAM_BOT_TOKEN }}`
- **Chat ID:** ID של משתמש הטלגרם שלך (דוגמה: `123456789`)

---

## 🔧 צומת #4: Telegram Callback Query Listener

**שם בN8N:** `Telegram Callback Listener`

**סוג:** Telegram - Polling / Webhook

### הגדרות:
| שדה | ערך |
|------|------|
| **Node Type** | Telegram - Polling |
| **Polling Mode** | Enabled |
| **Poll Interval** | 5 seconds |
| **Update Types** | callback_query |

### Or use Webhook:
| שדה | ערך |
|------|------|
| **Node Type** | Webhook |
| **Webhook URL** | Telegram Callback Webhook |
| **Events** | Message from Bot |

### Output Structure:
```json
{
  "update_id": 123456789,
  "callback_query": {
    "id": "callback_query_id",
    "from": { "id": 123456789, "first_name": "שם" },
    "chat_instance": "123456789",
    "data": "join_chat_sesn_xxxxx",
    "message": { "message_id": 123, ... }
  }
}
```

---

## 🔧 צומת #5: Extract Session ID from Button Click

**שם בN8N:** `Extract Session from Callback`

**סוג:** Set

### הגדרות:
```javascript
// Extract session_id from callback_data
const callbackData = $json.callback_query.data;
// callbackData = "join_chat_sesn_xxxxx"

const sessionId = callbackData.split("_").slice(2).join("_");
// sessionId = "sesn_xxxxx"

return {
  session_id: sessionId,
  callback_query_id: $json.callback_query.id,
  user_id: $json.callback_query.from.id,
  callback_action: callbackData.split("_")[0] // "join" or "reject"
};
```

### Output:
```json
{
  "session_id": "sesn_xxxxx",
  "callback_query_id": "callback_id_123",
  "user_id": 123456789,
  "callback_action": "join"
}
```

---

## 🔧 צומת #6: Conditional Check - Join or Reject

**שם בN8N:** `Is Join Action?`

**סוג:** IF

### הגדרות:
| שדה | ערך |
|------|------|
| **Condition Type** | String |
| **Value 1** | `{{ $node["Extract Session from Callback"].json.callback_action }}` |
| **Operation** | equals |
| **Value 2** | `join` |

**True Branch:** המשך ל-Anthropic API
**False Branch:** שלח הודעת "בקשה נדחתה"

---

## 🔧 צומת #7: Anthropic Sessions API Call

**שם בN8N:** `Send Message to Anthropic Session`

**סוג:** HTTP Request

### הגדרות:
| שדה | ערך |
|------|------|
| **Node Type** | HTTP Request |
| **URL** | `https://api.anthropic.com/v1/beta/conversations/{{ $node["Extract Session from Callback"].json.session_id }}/messages` |
| **Method** | POST |
| **Authentication** | Bearer Token |

### Headers:
```
Authorization: Bearer {{ $env.ANTHROPIC_API_KEY }}
Content-Type: application/json
anthropic-beta: interleaved-thinking-2025-05-14
```

### Body (JSON):
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": "הצטרפתי לשיחה. איזה מידע אתה צריך ממני כדי להמשיך?"
    }
  ],
  "system": "אתה סוכן תמיכה בטלגרם. הלקוח זה עתה הצטרף לשיחה."
}
```

### OR - Update Session with New Participant (Recommended):

```json
{
  "role": "user",
  "content": "🔔 מטפל אנושי הצטרף לשיחה"
}
```

### Headers (Complete):
```
Authorization: Bearer {{ $env.ANTHROPIC_API_KEY }}
Content-Type: application/json
anthropic-beta: interleaved-thinking-2025-05-14
```

### Query Parameters:
```
None - session_id is in URL path
```

### Expected Response:
```json
{
  "id": "msg_xxxxx",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "שלום! התחברתי מעתה ל-Slack וטלגרם..."
    }
  ],
  "model": "claude-3-5-sonnet-20241022",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 100,
    "output_tokens": 150
  }
}
```

---

## 🔧 צומת #8: Send Anthropic Response to Telegram

**שם בN8N:** `Send API Response to Telegram`

**סוג:** Telegram - Send Message

### הגדרות:
| שדה | ערך / Expression |
|------|------|
| **Chat ID** | `{{ $node["Extract Session from Callback"].json.user_id }}` |
| **Text** | `{{ $node["Send Message to Anthropic Session"].json.content[0].text }}` |
| **Parse Mode** | HTML |

### Text Expression:
```
{{ $node["Send Message to Anthropic Session"].json.content[0].text }}
```

### Fallback on Error:
```
✅ ההודעה שלך נשלחה בהצלחה לסוכן. זה יענה קרוב לעתה.
```

---

## 🔧 צומת #9: Telegram Answer Callback Query

**שם בN8N:** `Answer Callback`

**סוג:** HTTP Request (ל-Telegram Bot API)

### הגדרות:
| שדה | ערך |
|------|------|
| **URL** | `https://api.telegram.org/bot{{ $env.TELEGRAM_BOT_TOKEN }}/answerCallbackQuery` |
| **Method** | POST |
| **Content-Type** | application/json |

### Body:
```json
{
  "callback_query_id": "{{ $node[\"Extract Session from Callback\"].json.callback_query_id }}",
  "text": "✅ הצטרפת בהצלחה לשיחה!",
  "show_alert": false,
  "cache_time": 0
}
```

---

## 🔧 צומת #10: Error Handler - Reject Case

**שם בN8N:** `Send Rejection Message`

**סוג:** Telegram - Send Message

*זה מתבצע כשלוחצים על "דחה"*

### הגדרות:
| שדה | ערך |
|------|------|
| **Chat ID** | `{{ $node["Extract Session from Callback"].json.user_id }}` |
| **Text** | `❌ בקשת ההצטרפות נדחתה.` |

---

## 📊 Workflow Architecture Diagram

```
START
  │
  ├─→ [Slack Webhook Trigger]
       │ ReceIves JSON from Slack
       │
       ├─→ [Parse JSON]
            │ Extract fields from message
            │
            ├─→ [Telegram Send Message + Button]
                 │ Send handoff notification with buttons
                 │
                 ├─→ [Telegram Callback Listener]
                      │ Wait for button click
                      │
                      ├─→ [Extract Session from Callback]
                           │ Parse callback_data
                           │
                           ├─→ [IF - Is Join Action?]
                                │
                                ├─ TRUE ─→ [Anthropic Sessions API Call]
                                │            │ Send message to session
                                │            │
                                │            ├─→ [Send Response to Telegram]
                                │                 │ Forward response to user
                                │                 │
                                │                 ├─→ [Answer Callback Query]
                                │                      │ Notify button pressed
                                │                      │
                                │                      └─→ END
                                │
                                ├─ FALSE ─→ [Send Rejection Message]
                                             │ Notify rejection
                                             │
                                             └─→ END
```

---

## 🔐 Environment Variables Required

הוסף למשתנים הסביבה ב-n8n:

```bash
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
TELEGRAM_USER_ID=YOUR_TELEGRAM_USER_ID
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY
SLACK_WEBHOOK_SECRET=YOUR_SLACK_SIGNING_SECRET
```

**איך להשיג:**
1. **Telegram Bot Token:** ש אל @BotFather ב-Telegram
2. **Telegram User ID:** שלח `/start` ל-@userinfobot
3. **Anthropic API Key:** מ-[console.anthropic.com](https://console.anthropic.com)

---

## 🧪 Test Cases

### Test 1: Valid Handoff Request
```json
{
  "event": "human_handoff_requested",
  "session_id": "sesn_test123",
  "client_name": "גברת כהן",
  "topic": "בעיה בתשלום",
  "summary": "הלקוח לא יכול להשלים רכישה",
  "urgency": "high",
  "timestamp": "2025-01-15T14:32:00",
  "action_required": "join_chat"
}
```

**Expected Output:**
- ✅ Telegram message sent
- ✅ Button clickable
- ✅ Callback received
- ✅ Anthropic API called
- ✅ Response sent back

### Test 2: Button Click Handling
**Click "הצטרף לשיחה"** → Should:
1. Parse `join_chat_sesn_test123`
2. Call Anthropic API
3. Send response to Telegram
4. Answer callback query

### Test 3: Reject Button
**Click "דחה"** → Should:
1. Send rejection message
2. Not call Anthropic API
3. Answer callback query

---

## ⚙️ Workflow Settings

### General:
| הגדרה | ערך |
|------|------|
| **Execution Mode** | Webhook |
| **Error Handling** | Stop on Error |
| **Timeout** | 30 seconds |
| **Max Attempts** | 1 |

### Advanced:
| הגדרה | ערך |
|------|------|
| **Save execution data** | All data |
| **Save error data** | Yes |
| **Execution Order** | v1 (Connection-based) |

---

## 📝 Notes

**Important:**
1. צומת Telegram Callback Listener יכול להיות polling או webhook בהתאם להגדרות n8n שלך
2. ה-session_id מ-Anthropic צריך להיות קיים ופעיל
3. ה-Anthropic API נתמך רק עם beta flag `interleaved-thinking-2025-05-14`
4. זמן חיצוני בטלגרם לעדכון הודעה: עד 3 שניות

---

## 🚀 Deployment Checklist

- [ ] הוסף Slack credentials
- [ ] הוסף Telegram Bot Token
- [ ] הוסף Anthropic API Key
- [ ] בחר את ערוץ ה-Slack הנכון
- [ ] הוסף את Telegram User ID שלך
- [ ] בדוק שהכפתורים מופיעים בתקדם
- [ ] Test עם handoff request אמיתי
- [ ] Activate workflow
- [ ] Monitor executions log

---

**Version:** 1.0
**Last Updated:** 2026-06-18
**Author:** Claude Code

