"""
ראוטר חכם — מזהה סוג הודעה ומחזיר את שם הסוכן הנכון
"""

import re

# מילות מפתח לפי סוכן
_SALES = re.compile(
    r'מחיר|עלות|כמה עולה|הצעת מחיר|רכש|לקנות|תוכנית|השקעה|תקציב|ROI|חוזה|הדגמה|דמו|'
    r'price|cost|quote|buy|purchase|budget|invest|demo|contract',
    re.IGNORECASE
)
_LEADS = re.compile(
    r'שם שלי|אני מנהל|אני בעל|הגעתי מ|ראיתי מודעה|פנייה ראשונה|מעוניין לשמוע|'
    r'my name is|i manage|i run|referred by|first contact|interested in hearing',
    re.IGNORECASE
)
_SUPPORT = re.compile(
    r'בעיה|תקלה|לא עובד|שגיאה|עזרה|איך|מה זה|הסבר|מדריך|'
    r'problem|error|broken|help|how|explain|guide',
    re.IGNORECASE
)


def route(text: str) -> str:
    """מחזיר: 'sales' | 'cs' | 'leads'"""
    if _LEADS.search(text):
        return "leads"
    if _SALES.search(text):
        return "sales"
    # ברירת מחדל — שירות לקוחות
    return "cs"


AGENT_LABELS = {
    "cs":    "שירות לקוחות",
    "sales": "מכירות",
    "leads": "מסווג לידים",
}