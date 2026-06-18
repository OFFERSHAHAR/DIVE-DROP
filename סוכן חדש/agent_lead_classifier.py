"""
סוכן #1 - מסווג לידים נכנסים
עובד עם Ollama (מקומי) או Anthropic — ראה llm_client.py
"""

import json
import llm_client

SYSTEM_PROMPT = """אתה סוכן מסווג לידים חכם של AGENT HUB GURU — חברה המתמחה בפתרונות והטמעת מערכות חכמות לעסקים.

תפקידך לנתח פניות נכנסות ולסווג כל ליד לפי:

== סיווג דחיפות ==
URGENT - לקוח עם צורך מיידי / תקלה / מכרז פתוח
WARM   - לקוח עם עניין ברור, בשלב מחקר/השוואה
COLD   - סקרנות ראשונית, אין לוח זמנים ברור

== תחום פתרון ==
- אוטומציה תהליכית (RPA / Workflow)
- בינה מלאכותית ואנליטיקה (AI/ML)
- מערכות CRM / ERP חכמות
- IoT ומערכות חכמות פיזיות
- אבטחת סייבר ומידע
- אחר / לא ברור

== פוטנציאל עסקי ==
HIGH - תקציב ברור, מקבל החלטות, חברה 50+ עובדים
MED  - עסק בינוני, תקציב לא מוגדר
LOW  - עסק קטן / סטארטאפ / יחיד

== פעולת המשך מומלצת ==
CALL_NOW      - התקשר תוך שעה
SCHEDULE_DEMO - תזמן הדגמה ב-48 שעות
SEND_INFO     - שלח חומר שיווקי + פולו-אפ בשבוע
QUALIFY_MORE  - צריך עוד מידע לפני המשך

חובה: החזר תשובה בפורמט JSON בלבד, ללא כל טקסט נוסף לפני או אחרי:

{
  "lead_id": "LL-XXXX",
  "urgency": "URGENT|WARM|COLD",
  "urgency_reason": "הסבר קצר",
  "solution_domain": "שם התחום",
  "business_potential": "HIGH|MED|LOW",
  "recommended_action": "CALL_NOW|SCHEDULE_DEMO|SEND_INFO|QUALIFY_MORE",
  "missing_info": ["פריט חסר 1", "פריט חסר 2"],
  "notes_for_sales": "הערה לצוות מכירות",
  "summary": "תקציר הליד בשורה אחת"
}"""


class LeadClassifier:
    def __init__(self):
        self.lead_counter = 1

    def classify_lead(self, lead_text: str) -> dict:
        lead_id = f"LL-{self.lead_counter:04d}"
        self.lead_counter += 1

        messages = [{"role": "user", "content": f"ליד חדש (ID: {lead_id}):\n\n{lead_text}\n\nסווג ליד זה. ענה ב-JSON בלבד."}]

        raw = llm_client.chat(SYSTEM_PROMPT, messages)

        try:
            start = raw.find("{")
            end   = raw.rfind("}") + 1
            result = json.loads(raw[start:end])
            result["lead_id"] = lead_id
        except json.JSONDecodeError:
            result = {"lead_id": lead_id, "raw_response": raw, "error": "JSON parse failed"}

        return result

    def print_classification(self, result: dict):
        urgency_icons  = {"URGENT": "🔴", "WARM": "🟡", "COLD": "🟢"}
        potential_icons = {"HIGH": "⭐⭐⭐", "MED": "⭐⭐", "LOW": "⭐"}
        action_icons = {
            "CALL_NOW": "📞 התקשר עכשיו",
            "SCHEDULE_DEMO": "📅 תזמן הדגמה",
            "SEND_INFO": "📧 שלח מידע",
            "QUALIFY_MORE": "❓ אסוף עוד מידע"
        }

        print(f"\n{'='*60}")
        print(f"ליד: {result.get('lead_id', 'N/A')}")
        print(f"{'='*60}")
        if "error" in result:
            print(f"שגיאה: {result['error']}")
            print(result.get("raw_response", ""))
            return

        urgency   = result.get("urgency", "N/A")
        potential = result.get("business_potential", "N/A")
        action    = result.get("recommended_action", "N/A")

        print(f"דחיפות:    {urgency_icons.get(urgency,'?')} {urgency}")
        print(f"תחום:      {result.get('solution_domain','N/A')}")
        print(f"פוטנציאל:  {potential_icons.get(potential,'?')} {potential}")
        print(f"פעולה:     {action_icons.get(action, action)}")
        print(f"סיכום:     {result.get('summary','N/A')}")
        if result.get("notes_for_sales"):
            print(f"הערות:     {result['notes_for_sales']}")
        if result.get("missing_info"):
            print(f"חסר מידע:  {', '.join(result['missing_info'])}")
        print(f"{'='*60}")


if __name__ == "__main__":
    print(f"🤖 סוכן מסווג לידים — {llm_client.provider_info()}\n")
    classifier = LeadClassifier()

    demo_leads = [
        """שם: דני לוי | חברה: תעשיות אלפא (300 עובדים)
        "צריכים בדחיפות החלפת ERP — מכרז נסגר ב-15 לחודש. תקציב: 500K ש״ח"
        danny@alpha-ind.co.il | 050-1234567""",

        """טופס אתר: רחל כהן | מאפייה רחל (5 עובדים)
        "קראתי על מערכות חכמות — רלוונטי לעסק קטן?"
        rachel@bakery.co.il"""
    ]

    for lead in demo_leads:
        result = classifier.classify_lead(lead)
        classifier.print_classification(result)
