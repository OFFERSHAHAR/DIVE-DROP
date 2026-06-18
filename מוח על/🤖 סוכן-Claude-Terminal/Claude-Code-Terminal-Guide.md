# 📘 Claude Code/Terminal - המדריך המלא

> **מדריך עדכני על איך להפוך ל-EXPERT בשימוש ב-Claude Code ו-Terminal**

---

## 🎯 ההבדל בין כלים

| כלי | שימוש | כוח |
|-----|------|------|
| **Claude.ai/code** | אינטרקטיבי, visual | UI יפה, קל לחדשים |
| **Claude Code CLI** | Terminal, automation | חזק, fast, no limits |
| **Claude API** | Programmatic | Maximum control |

---

## ⚙️ התקנה קודם הכל

### Claude Code CLI (המומלץ)

```bash
# 1. התקן Node.js (אם עדיין אין)
choco install nodejs

# 2. התקן Claude Code
npm install -g @anthropic-ai/claude-code

# 3. בדוק התקנה
claude-code --version

# 4. התחבר (סוף פעם אחת)
claude-code auth login
# או עם API key
claude-code config set ANTHROPIC_API_KEY=sk-xxxx
```

---

## 🚀 שימוש בסיסי

### Run Single Prompt
```bash
claude-code "כתוב לי function שמחשב fibonacci"
```

### Interactive Mode (הטוב ביותר)
```bash
claude-code
# עכשיו אתה בpromt אינטראקטיבי
```

### Read Code & Analyze
```bash
claude-code -f myfile.js "מצא bugs בקוד הזה"
```

---

## 💡 Pro Tips (עדכני 2026)

### 1️⃣ **Context Management**
```bash
# הוסף קובץ כ-context (קריטי!)
claude-code -c src/main.js -c config.json "תקן את הבעיה"

# או בinteactive:
/context add src/
/context list
/context remove file.js
```

### 2️⃣ **Model Selection**
```bash
# אם Haiku מהיר מספיק, השתמש בו
claude-code --model claude-haiku-4.5

# Opus = הכי חזק (בשביל משימות קשות)
claude-code --model claude-opus-4.8

# Sonnet = balanced (מומלץ להרוב)
claude-code --model claude-sonnet-4.6
```

### 3️⃣ **Save Conversations**
```bash
# שמור conversation
claude-code --output-dir ./claude-logs

# צור session קבוע
claude-code --session my-project
```

---

## 🔥 Advanced Patterns

### Pattern 1: Code Review + Fix
```bash
claude-code \
  --context src/ \
  --model claude-opus-4.8 \
  "Code review מעמיק, אחר כך תקן את כל ה-issues"
```

### Pattern 2: Multi-File Refactoring
```bash
claude-code \
  --context src/components \
  --context src/utils \
  "עדכן את כל ה-imports להשתמש ב-barrel exports"
```

### Pattern 3: Documentation Generation
```bash
claude-code \
  --context src/ \
  --model claude-sonnet-4.6 \
  "כתוב JSDoc כמלא לכל ה-functions"
```

---

## 📊 Performance Tips

### זמן וחיסכון
```bash
# מהיר (Haiku, 0.80$/1M tokens)
claude-code --model claude-haiku-4.5 "task"

# איזון (Sonnet, 3$/1M tokens)
claude-code --model claude-sonnet-4.6 "task"

# כוחני (Opus, 15$/1M tokens)
claude-code --model claude-opus-4.8 "complex-task"
```

### Context Efficiency
```bash
# דרך 1: תן קובץ ספציפי (טוב)
claude-code -c src/main.js "..."

# דרך 2: summarize large files (טוב יותר)
claude-code -c src/ --summary "..."

# דרך 3: עדכן context כשמשימה משתנה
/context clear
/context add relevant-files-only.js
```

---

## 🎓 Workflows מומלצים

### Workflow 1: Code-First Development
```bash
1. claude-code "כתוב לי structure עבור..."
2. claude-code -c output.js "הוסף error handling"
3. claude-code -c output.js "כתוב unit tests"
4. claude-code -c output.js "תוקן את כל ה-bugs"
```

### Workflow 2: Documentation First
```bash
1. claude-code "כתוב TDD spec עבור feature X"
2. claude-code "כתוב implementation לפי spec"
3. claude-code -c spec.md -c implementation.js "validate"
```

### Workflow 3: Iterative Refinement
```bash
1. claude-code "כתוב draft"
2. /review draft
3. claude-code -c draft "תקן לפי feedback"
4. repeat until perfect
```

---

## 🐛 Troubleshooting

### Auth Issues
```bash
# מחק session ישן
rm ~/.claude-code/session

# התחבר מחדש
claude-code auth login
```

### Token Limit
```bash
# מודע לlimit (תמיד)
claude-code --show-tokens "prompt"

# אם גדול מדי:
- ❌ אל תשלח הכל בפעם אחת
- ✅ קטע לקבצים קטנים יותר
- ✅ דבר עם claude-haiku בפעם הראשונה
```

### Connection Issues
```bash
# בדוק API key
claude-code config show

# דוגמה:
export ANTHROPIC_API_KEY=sk-...
claude-code "test"
```

---

## 🎯 Best Practices

✅ **תמיד:**
- הוסף context (אל לא תרוץ עיוור!)
- בחר את המודל הנכון לגודל המשימה
- שמור את התוצר בקובץ
- קרא את התשובה לפני שמקבל

❌ **אל תעשה:**
- אל תשלח קוד גדול בלי `/context`
- אל תעשה creative tasks עם Haiku
- אל תתן סקריפטים מדוגמה ישנים
- אל תשכח לspecify model

---

## 🔗 קישורים שימושיים

- [Claude API Docs](https://docs.anthropic.com)
- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Model Comparison](https://docs.anthropic.com/en/docs/about-claude/models/latest)

---

**עודכן:** 2026-06-16
**תדירות עדכון:** כל שעתיים אוטומטית 🔄
