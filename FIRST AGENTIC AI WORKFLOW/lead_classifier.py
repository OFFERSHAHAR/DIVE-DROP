#!/usr/bin/env python3
import json
import os
from datetime import datetime
import win32com.client

# Settings
LISIM_FOLDER = r"C:\Users\GamingPC\Desktop\lisim"

def classify_lead(sender, subject, body):
    """Classify lead based on email content"""
    text = (subject + " " + body).lower()

    hot_keywords = ["buy", "purchase", "quote", "demo", "interested", "want to buy", "pricing", "sign up"]
    warm_keywords = ["information", "learn more", "details", "tell me", "how does"]
    spam_keywords = ["viagra", "casino", "unsubscribe", "click here", "urgent action"]

    if any(kw in text for kw in spam_keywords):
        return {"category": "SPAM", "score": 0, "action": "Mark as spam"}
    elif any(kw in text for kw in hot_keywords):
        return {"category": "HOT", "score": 90, "action": "Immediate follow-up required"}
    elif any(kw in text for kw in warm_keywords):
        return {"category": "WARM", "score": 60, "action": "Schedule follow-up"}
    else:
        return {"category": "COLD", "score": 30, "action": "Add to nurture list"}

def save_lead_to_file(sender, classification):
    """Save classified lead to JSON file"""
    filename = f"{sender.split('@')[0]}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    filepath = os.path.join(LISIM_FOLDER, filename)

    data = {
        "sender": sender,
        "category": classification["category"],
        "score": classification["score"],
        "action": classification["action"],
        "timestamp": datetime.now().isoformat()
    }

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✓ Saved: {filename}")

def monitor_outlook():
    """Monitor Outlook for new emails"""
    try:
        outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")
        inbox = outlook.GetDefaultFolder(6)  # 6 = Inbox

        print("🔍 Monitoring Outlook inbox...")
        print(f"📁 Saving to: {LISIM_FOLDER}\n")

        for email in inbox.Items:
            if not hasattr(email, 'Body'):
                continue

            sender = email.SenderEmailAddress
            subject = email.Subject
            body = email.Body[:500]  # First 500 chars

            # Classify
            classification = classify_lead(sender, subject, body)

            # Save
            save_lead_to_file(sender, classification)
            print(f"📧 {sender} → {classification['category']} (Score: {classification['score']})")

    except Exception as e:
        print(f"❌ Error: {e}")
        print("⚠️  Install: pip install pywin32")

if __name__ == "__main__":
    if not os.path.exists(LISIM_FOLDER):
        os.makedirs(LISIM_FOLDER)

    monitor_outlook()
