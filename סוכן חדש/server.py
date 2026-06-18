# -*- coding: utf-8 -*-
import sys; sys.stdout.reconfigure(encoding='utf-8', errors='replace')
"""
AGENT HUB GURU — Flask API server
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import uuid

import llm_client
import agent_router
from agent_lead_classifier import LeadClassifier
from agent_customer_service import CustomerServiceAgent
from agent_sales import SalesAgent

app = Flask(__name__, static_folder="static")
CORS(app)

cs_sessions:    dict[str, CustomerServiceAgent] = {}
sales_sessions: dict[str, SalesAgent]           = {}
classifier = LeadClassifier()


# ── Static & Embed ───────────────────────────────────────────
@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/guide")
def guide():
    return send_from_directory("static", "guide.html")

# embed: /embed?agent=cs|sales|leads|auto
@app.route("/embed")
def embed():
    return send_from_directory("static", "embed.html")

# סינכרון מלא לכל agent בנפרד
@app.route("/embed/cs")
def embed_cs():
    return send_from_directory("static", "embed.html")

@app.route("/embed/sales")
def embed_sales():
    return send_from_directory("static", "embed.html")

@app.route("/embed/leads")
def embed_leads():
    return send_from_directory("static", "embed.html")


# ── Health ────────────────────────────────────────────────────
@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "provider": llm_client.provider_info()})


# ── Router API ───────────────────────────────────────────────
@app.route("/api/route", methods=["POST"])
def route_message():
    """מחזיר איזה סוכן מתאים להודעה."""
    data = request.get_json() or {}
    text = data.get("text", "")
    kind = agent_router.route(text)
    return jsonify({"agent": kind, "label": agent_router.AGENT_LABELS[kind]})


# ── Auto-session: יוצר session בסוכן הנכון לפי תוכן ──────────
@app.route("/api/auto/session", methods=["POST"])
def auto_session():
    data = request.get_json() or {}
    text = data.get("first_message", "")
    kind = agent_router.route(text) if text else "cs"
    if kind == "sales":
        sid   = str(uuid.uuid4())[:8]
        agent = SalesAgent()
        sales_sessions[sid] = agent
        opening = agent.get_call_opener()
        return jsonify({"session_id": sid, "agent": "sales", "message": opening})
    else:
        sid   = str(uuid.uuid4())[:8]
        agent = CustomerServiceAgent(session_id=f"CS-{sid}")
        cs_sessions[sid]  = agent
        opening = agent.chat("לקוח חדש התחבר. ברך אותו בקצרה ושאל במה תוכל לעזור.")
        return jsonify({"session_id": sid, "agent": "cs", "message": opening})

@app.route("/api/auto/chat", methods=["POST"])
def auto_chat():
    data = request.get_json() or {}
    sid  = data.get("session_id")
    msg  = data.get("message", "").strip()
    # חפש בשני מאגרי הסשנים
    if sid in cs_sessions:
        reply = cs_sessions[sid].chat(msg)
    elif sid in sales_sessions:
        reply = sales_sessions[sid].chat(msg)
    else:
        return jsonify({"error": "session not found"}), 404
    return jsonify({"success": True, "message": reply})


# ════ Lead Classifier ════════════════════════════════════════
@app.route("/api/classify", methods=["POST"])
def classify_lead():
    data = request.get_json()
    lead_text = (data or {}).get("lead_text", "").strip()
    if not lead_text:
        return jsonify({"error": "lead_text is required"}), 400
    try:
        return jsonify({"success": True, "result": classifier.classify_lead(lead_text)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ════ Customer Service ═══════════════════════════════════════
@app.route("/api/cs/session", methods=["POST"])
def create_cs_session():
    sid   = str(uuid.uuid4())[:8]
    agent = CustomerServiceAgent(session_id=f"CS-{sid}")
    cs_sessions[sid] = agent
    opening = agent.chat("לקוח חדש התחבר. ברך אותו בקצרה ושאל במה תוכל לעזור.")
    return jsonify({"session_id": sid, "message": opening})

@app.route("/api/cs/chat", methods=["POST"])
def cs_chat():
    data = request.get_json() or {}
    sid  = data.get("session_id")
    msg  = data.get("message", "").strip()
    if not sid or sid not in cs_sessions:
        return jsonify({"error": "session not found"}), 404
    if not msg:
        return jsonify({"error": "message required"}), 400
    try:
        return jsonify({"success": True, "message": cs_sessions[sid].chat(msg)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/cs/session/<sid>", methods=["DELETE"])
def close_cs_session(sid):
    cs_sessions.pop(sid, None)
    return jsonify({"success": True})


# ════ Sales ══════════════════════════════════════════════════
@app.route("/api/sales/session", methods=["POST"])
def create_sales_session():
    data  = request.get_json() or {}
    sid   = str(uuid.uuid4())[:8]
    agent = SalesAgent(lead_info={
        "name":       data.get("name", ""),
        "company":    data.get("company", ""),
        "pain_point": data.get("pain_point", ""),
        "source":     "ממשק UI"
    })
    sales_sessions[sid] = agent
    return jsonify({"session_id": sid, "message": agent.get_call_opener()})

@app.route("/api/sales/chat", methods=["POST"])
def sales_chat():
    data = request.get_json() or {}
    sid  = data.get("session_id")
    msg  = data.get("message", "").strip()
    if not sid or sid not in sales_sessions:
        return jsonify({"error": "session not found"}), 404
    if not msg:
        return jsonify({"error": "message required"}), 400
    try:
        return jsonify({"success": True, "message": sales_sessions[sid].chat(msg)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/sales/summary", methods=["POST"])
def sales_summary():
    data = request.get_json() or {}
    sid  = data.get("session_id")
    if not sid or sid not in sales_sessions:
        return jsonify({"error": "session not found"}), 404
    try:
        return jsonify({"success": True, "summary": sales_sessions[sid].generate_proposal_summary()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/sales/session/<sid>", methods=["DELETE"])
def close_sales_session(sid):
    sales_sessions.pop(sid, None)
    return jsonify({"success": True})


# ════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=== AGENT HUB GURU ===")
    print(f"   LLM    : {llm_client.provider_info()}")
    print("   ממשק   : http://localhost:5000")
    print("   embed  : http://localhost:5000/embed")
    print("   מדריך  : http://localhost:5000/guide")
    print()
    app.run(debug=False, port=5000)