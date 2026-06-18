"""
בוט טלגרם — AGENT HUB GURU
הגדר: TELEGRAM_TOKEN=<הטוקן מ-BotFather>
"""

import os
import sys
import asyncio
import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, ContextTypes, filters
sys.path.insert(0, os.path.dirname(__file__))
import agent_router
from agent_customer_service import CustomerServiceAgent
from agent_sales import SalesAgent
from agent_lead_classifier import LeadClassifierAgent

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
log = logging.getLogger(__name__)

TOKEN = os.environ.get("TELEGRAM_TOKEN", "")

# שמירת סשן לפי user_id: (agent_type, agent_instance)
sessions: dict[int, tuple[str, object]] = {}


def _new_agent(kind: str, text: str):
    if kind == "sales":
        return SalesAgent()
    if kind == "leads":
        return LeadClassifierAgent()
    return CustomerServiceAgent()


async def cmd_start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "שלום! אני אלון מ-AGENT HUB GURU.\n"
        "שלח לי הודעה ואדאג שתגיע לסוכן הנכון."
    )


async def cmd_reset(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    sessions.pop(uid, None)
    await update.message.reply_text("השיחה אופסה. שלח הודעה חדשה.")


async def handle_message(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    uid  = update.effective_user.id
    text = update.message.text.strip()

    # זיהוי סוכן ויצירת סשן
    if uid not in sessions:
        kind = agent_router.route(text)
        agent = _new_agent(kind, text)
        sessions[uid] = (kind, agent)
        label = agent_router.AGENT_LABELS[kind]
        await update.message.reply_text(f"[מועבר ל{label}]")
    else:
        kind, agent = sessions[uid]
        # אם הסוג השתנה בצורה ברורה — נציע מעבר
        new_kind = agent_router.route(text)
        if new_kind != kind and new_kind != "cs":
            label_new = agent_router.AGENT_LABELS[new_kind]
            await update.message.reply_text(
                f"נראה שהשאלה שלך יותר קשורה ל{label_new}. להעביר? (כן/לא)"
            )
            ctx.user_data["pending_switch"] = new_kind
            return

    # בדיקה אם יש מעבר ממתין
    if "pending_switch" in ctx.user_data:
        if text in ["כן", "כן!", "yes", "y"]:
            new_kind = ctx.user_data.pop("pending_switch")
            agent    = _new_agent(new_kind, "")
            sessions[uid] = (new_kind, agent)
            kind = new_kind
        else:
            ctx.user_data.pop("pending_switch", None)

    _, agent = sessions[uid]

    # שלח הודעה לסוכן המתאים
    await update.message.chat.send_action("typing")
    try:
        if kind == "leads":
            result = agent.classify(text)
            reply  = (
                f"סיווג ליד:\n"
                f"דחיפות: {result.get('urgency','')}\n"
                f"פוטנציאל: {result.get('business_potential','')}\n"
                f"פעולה: {result.get('recommended_action','')}\n"
                f"סיכום: {result.get('summary','')}"
            )
        else:
            reply = agent.chat(text)
        await update.message.reply_text(reply)
    except Exception as e:
        log.error("Agent error: %s", e)
        await update.message.reply_text("אירעה שגיאה. אנא נסה שוב.")


def main():
    if not TOKEN:
        print("ERROR: set TELEGRAM_TOKEN environment variable")
        sys.exit(1)

    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("reset", cmd_reset))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("Bot running... Ctrl+C to stop")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()