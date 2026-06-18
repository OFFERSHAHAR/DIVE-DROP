import mimetypes
import os
import time
from getpass import getpass
from pathlib import Path

import anthropic


AGENT_ID = "agent_01WqoQsaMcGZyvas7DSTg1XP"
ENVIRONMENT_ID = "env_013R16keqBxceHUjm1vaTCEK"
FOLDER = Path(__file__).resolve().parent
OUTPUT_FOLDER = FOLDER / "output"
MAX_WAIT_SECONDS = 30 * 60

# Financial source formats that the managed agent can reasonably inspect.
SUPPORTED_EXTENSIONS = {
    ".csv",
    ".doc",
    ".docx",
    ".html",
    ".jpeg",
    ".jpg",
    ".json",
    ".md",
    ".ods",
    ".pdf",
    ".png",
    ".text",
    ".txt",
    ".xls",
    ".xlsb",
    ".xlsm",
    ".xlsx",
    ".xml",
}
IGNORED_FILENAMES = {
    "desktop.ini",
    "פקודת הרצה.txt",
}
MIME_OVERRIDES = {
    ".csv": "text/csv",
    ".json": "application/json",
    ".pdf": "application/pdf",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}


def find_input_files() -> list[Path]:
    """Return all supported source files placed directly in the input folder."""
    return sorted(
        (
            path
            for path in FOLDER.iterdir()
            if path.is_file()
            and not path.name.startswith(".")
            and path.name not in IGNORED_FILENAMES
            and path.suffix.lower() in SUPPORTED_EXTENSIONS
        ),
        key=lambda path: path.name.lower(),
    )


def mime_type_for(path: Path) -> str:
    return MIME_OVERRIDES.get(
        path.suffix.lower(),
        mimetypes.guess_type(path.name)[0] or "application/octet-stream",
    )


def load_api_key() -> str:
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    env_file = FOLDER / ".env"

    if not api_key and env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            name, separator, value = line.partition("=")
            if separator and name.strip() == "ANTHROPIC_API_KEY":
                api_key = value.strip().strip('"').strip("'")
                break

    return api_key or getpass(
        "הכנס מפתח Anthropic API (ההקלדה מוסתרת): "
    ).strip()


def wait_for_agent(client: anthropic.Anthropic, session_id: str) -> None:
    deadline = time.monotonic() + MAX_WAIT_SECONDS
    was_running = False
    idle_checks = 0

    while time.monotonic() < deadline:
        session_status = client.beta.sessions.retrieve(session_id)
        status = session_status.status

        if status == "running":
            was_running = True
            idle_checks = 0
            print(".", end="", flush=True)
        elif status == "idle":
            idle_checks += 1
            # A fast job may finish before the first poll observes "running".
            if was_running or idle_checks >= 6:
                print("\nהסוכן סיים!")
                return
        elif status == "terminated":
            raise RuntimeError("הסשן הסתיים בשגיאה. יש לבדוק אותו ב-Claude Console.")

        time.sleep(5)

    raise TimeoutError("הסוכן לא סיים בתוך 30 דקות.")


def main() -> None:
    api_key = load_api_key()
    if not api_key:
        raise RuntimeError(
            "לא הוזן מפתח API. אפשר גם להגדיר אותו מראש במשתנה ANTHROPIC_API_KEY."
        )

    input_files = find_input_files()
    if not input_files:
        supported = ", ".join(sorted(SUPPORTED_EXTENSIONS))
        raise FileNotFoundError(
            f"לא נמצאו קבצי מידע לניתוח בתיקייה {FOLDER}. סוגים נתמכים: {supported}"
        )

    OUTPUT_FOLDER.mkdir(exist_ok=True)
    client = anthropic.Anthropic(api_key=api_key)
    resources = []

    print(f"נמצאו {len(input_files)} קבצים לניתוח:")
    for path in input_files:
        print(f"  - {path.name}")
        with path.open("rb") as file_handle:
            uploaded = client.beta.files.upload(
                file=(path.name, file_handle, mime_type_for(path)),
            )
        resources.append(
            {
                "type": "file",
                "file_id": uploaded.id,
                "mount_path": f"/workspace/{path.name}",
            }
        )

    print("פותח סשן...")
    session = client.beta.sessions.create(
        agent=AGENT_ID,
        environment_id=ENVIRONMENT_ID,
        title=f"ניתוח כלכלי של {len(input_files)} קבצים",
        resources=resources,
    )
    print(f"סשן נפתח: {session.id}")
    print(
        "צפה בסשן: "
        f"https://platform.claude.com/workspaces/default/sessions/{session.id}"
    )

    file_list = "\n".join(f"- /workspace/{path.name}" for path in input_files)
    instruction = f"""נתח יחד את כל הקבצים הכלכליים הבאים, ללא יוצא מן הכלל:
{file_list}

אחד את המידע מכל הקבצים לתמונה כלכלית כוללת, זהה כפילויות בין מקורות,
ציין סתירות או נתונים חסרים, וצור את כל קבצי הפלט ב-/mnt/session/outputs/.
אל תסתפק בניתוח של קובץ אחד."""

    print("שולח הוראה לסוכן...")
    client.beta.sessions.events.send(
        session_id=session.id,
        events=[
            {
                "type": "user.message",
                "content": [{"type": "text", "text": instruction}],
            }
        ],
    )

    print("הסוכן עובד... ממתין לסיום (זה עלול לקחת כמה דקות)")
    wait_for_agent(client, session.id)

    print("מוריד קבצי פלט...")
    time.sleep(3)
    output_files = client.beta.files.list(
        scope_id=session.id,
        betas=["managed-agents-2026-04-01"],
    )

    if not output_files.data:
        print("לא נמצאו קבצי פלט - בדוק את הסשן ב-Console")
    else:
        for output_file in output_files.data:
            destination = OUTPUT_FOLDER / Path(output_file.filename).name
            content = client.beta.files.download(output_file.id)
            destination.write_bytes(content.read())
            print(f"נשמר: {destination}")

    print(f"\nהכל מוכן! הקבצים נמצאים ב: {OUTPUT_FOLDER}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"\nשגיאה: {error}")
    finally:
        input("לחץ Enter לסגירה...")
