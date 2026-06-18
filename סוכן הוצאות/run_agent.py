import anthropic
import time
from pathlib import Path

# ───── הגדרות ─────
API_KEY        = "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"  # המפתח שלך
AGENT_ID       = "agent_01WqoQsaMcGZyvas7DSTg1XP"
ENVIRONMENT_ID = "env_013R16keqBxceHUjm1vaTCEK"
FOLDER         = Path(r"C:\Users\GamingPC\Desktop\סוכן הוצאות")
INPUT_FILE     = FOLDER / "excelNewTransactions.xlsx"
OUTPUT_FOLDER  = FOLDER / "output"

OUTPUT_FOLDER.mkdir(exist_ok=True)

client = anthropic.Anthropic(api_key=API_KEY)

# ───── שלב 1: העלאת הקובץ ─────
print("מעלה קובץ Excel...")
with open(INPUT_FILE, "rb") as f:
    uploaded = client.beta.files.upload(
        file=(INPUT_FILE.name, f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    )
print(f"הקובץ הועלה: {uploaded.id}")

# ───── שלב 2: פתיחת סשן ─────
print("פותח סשן...")
session = client.beta.sessions.create(
    agent=AGENT_ID,
    environment_id=ENVIRONMENT_ID,
    title="ניתוח חשבון בנק",
    resources=[{
        "type": "file",
        "file_id": uploaded.id,
        "mount_path": f"/workspace/{INPUT_FILE.name}",
    }],
)
print(f"סשן נפתח: {session.id}")
print(f"צפה בסשן: https://platform.claude.com/workspaces/default/sessions/{session.id}")

# ───── שלב 3: שליחת הודעת התחלה ─────
print("שולח הוראה לסוכן...")
client.beta.sessions.events.send(
    session_id=session.id,
    events=[{
        "type": "user.message",
        "content": [{"type": "text", "text": "נתח את קובץ ה-Excel שהועלה ל-/workspace וצור את כל קבצי הפלט ב-/mnt/session/outputs/"}],
    }],
)

# ───── שלב 4: המתנה לסיום ─────
print("הסוכן עובד... ממתין לסיום (זה עלול לקחת כמה דקות)")
was_running = False

while True:
    session_status = client.beta.sessions.retrieve(session.id)

    if session_status.status == "running":
        was_running = True
        print(".", end="", flush=True)

    elif session_status.status == "idle" and was_running:
        print("\nהסוכן סיים!")
        break

    elif session_status.status == "terminated":
        print("\nהסשן הסתיים בשגיאה!")
        break

    time.sleep(5)

# ───── שלב 5: הורדת קבצי פלט ─────
print("מוריד קבצי פלט...")
time.sleep(3)
output_files = client.beta.files.list(
    scope_id=session.id,
    betas=["managed-agents-2026-04-01"],
)

if not output_files.data:
    print("לא נמצאו קבצי פלט — בדוק את הסשן ב-Console")
else:
    for f in output_files.data:
        dest = OUTPUT_FOLDER / f.filename
        content = client.beta.files.download(f.id)
        dest.write_bytes(content.read())
        print(f"✓ נשמר: {dest}")

print(f"\nהכל מוכן! הקבצים נמצאים ב: {OUTPUT_FOLDER}")
input("לחץ Enter לסגירה...")