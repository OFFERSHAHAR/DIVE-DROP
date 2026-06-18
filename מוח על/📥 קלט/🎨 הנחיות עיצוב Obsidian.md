# 🎨 עיצוב Obsidian - הנחיות התקנה

עדכנתי את הגדרות ה-appearance וקובץ הplugins. בואו נסיים את העיצוב! 

---

## 📋 צעדים התקנה

### 1️⃣ הפעלת Community Plugins

בObsidian:
1. **Settings** (⚙️) → **Community Plugins** 
2. לחץ **Turn on community plugins** (אם כבוי)
3. חפש והתקן את ה-plugins הבאים:

### 2️⃣ Plugins שיש להתקין

**עיקריים:**
- ✅ **Dataview** — תרשימים דינמיים מנתונים
- ✅ **Excalidraw** — ציור ודיאגרמות
- ✅ **Templater** — תבניות חכמות
- ✅ **Calendar** — לוח שנה עם daily notes
- ✅ **Periodic Notes** — הערות יומיות/שבועיות

**תמיכה:**
- ✅ **Pane Relief** — ניהול פנלים
- ✅ **Tag Wrangler** — ניהול תגיות
- ✅ **Front Matter Title** — כותרות עברית בחזית
- ✅ **Breadcrumbs** — ניווט היררכי

### 3️⃣ התקנת Theme

1. Settings → **Appearance**
2. Scroll down: **Themes**
3. חפש **Minimal** (על ידי Kepano)
4. לחץ **Install** אחר כך **Use**

---

## 🎨 צבעים מומלצים

**Dark Mode (לילה):**
- Background: `#1e1e2e`
- Text: `#cdd6f4`
- Accent: `#7c3aed` (סגול)
- Links: `#a6e3a1` (ירוק)

**Font Size:**
- מרכזי: `16px`
- Line Height: `1.6`

---

## 🖼️ מראה בסוף

```
┌─────────────────────────────────────────┐
│  📝 מוח על                   Settings   │
├─────────────────────────────────────────┤
│  📥 קלט    │  [Preview Panel]           │
│  📚 ידע    │  ### כותרה                 │
│  ✅ משימ  │  - bullet point            │
│  📤 פלט    │  [[wiki-link]]             │
│  🔗 מקורות │                           │
└─────────────────────────────────────────┘
```

---

## ⚡ טיפים

- **Command Palette:** `Ctrl+P` - חיפוש מהיר
- **Quick Switcher:** `Ctrl+O` - קפוץ בין קבצים
- **Toggle Sidebar:** `Ctrl+B` - הסתר/הראה סרגל
- **Daily Notes:** `Ctrl+Shift+D` - פתח daily note

---

## 🔧 Custom CSS (אופציונלי)

אם תרצה עוד יותר customization:

1. Settings → **Appearance** → **CSS Snippets**
2. צור `custom.css` בתיקיית `.obsidian/snippets/`
3. הוסף קוד CSS כמו:

```css
/* סגנון ירוק עברי */
.cm-s-obsidian .cm-tag {
  color: #a6e3a1;
  font-weight: bold;
}

.internal-link {
  color: #7c3aed;
}
```

---

## ✨ אחרי הכל

אם משהו לא עובד:
1. **Restart Obsidian** (סגור ופתח מחדש)
2. **Reload App:** `Ctrl+R`
3. בדוק Console: Settings → **About** → **Debug Console**

---

**עודכן:** 2026-06-16

💡 **הערה:** ה-settings שעדכנתי בקבצים כבר הפעילו את Theme וColors המומלצים. אתה יכול לראות אותם מיד ב-Settings!
