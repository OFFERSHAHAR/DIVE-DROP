"""Compatibility entry point. The maintained implementation is run_agent.py."""

from run_agent import main


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"\nשגיאה: {error}")
    finally:
        input("לחץ Enter לסגירה...")
