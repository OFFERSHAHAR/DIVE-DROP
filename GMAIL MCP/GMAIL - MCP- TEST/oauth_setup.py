#!/usr/bin/env python3
'''
OAuth 2.0 setup script for Gmail MCP Server.

Run this script once to authenticate with Google.
It will open a browser window for you to sign in and grant access.
'''

import os
import json
import webbrowser
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TOKEN_DIR = os.path.join(SCRIPT_DIR, ".gmail_token")
TOKEN_FILE = os.path.join(TOKEN_DIR, "token.json")
CREDENTIALS_FILE = os.path.join(SCRIPT_DIR, "credentials.json")


def main():
    print("=" * 60)
    print("  Gmail MCP - OAuth 2.0 Setup")
    print("=" * 60)

    if not os.path.exists(CREDENTIALS_FILE):
        print("\n[X] credentials.json not found!")
        print("\nTo set up Gmail API access:")
        print("1. Go to https://console.cloud.google.com/")
        print("2. Create a new project (or select existing)")
        print("3. Enable the Gmail API:")
        print("   -> APIs & Services > Library > Search 'Gmail API' > Enable")
        print("4. Create OAuth 2.0 credentials:")
        print("   -> APIs & Services > Credentials > Create Credentials > OAuth client ID")
        print("   -> Application type: Desktop app")
        print("   -> Name: Gmail MCP")
        print("5. Download the JSON file and save it as:")
        print(f"   {CREDENTIALS_FILE}")
        print("\n6. Re-run this script after placing credentials.json")
        return

    if os.path.exists(TOKEN_FILE):
        print("\n[*] Existing token found. Checking validity...")
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

        if creds.valid:
            print("[✓] Token is still valid. No action needed.")
            print(f"    Token location: {TOKEN_FILE}")
            return

        if creds.expired and creds.refresh_token:
            print("[*] Token expired. Attempting refresh...")
            creds.refresh(Request())
            os.makedirs(TOKEN_DIR, exist_ok=True)
            with open(TOKEN_FILE, "w") as f:
                f.write(creds.to_json())
            print("[✓] Token refreshed successfully!")
            return

        print("[*] Token cannot be refreshed. Re-authenticating...")

    print("\n[*] Opening browser for Google authentication...")
    print("    (Grant read-only access to your Gmail)\n")

    flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
    creds = flow.run_local_server(port=0)

    os.makedirs(TOKEN_DIR, exist_ok=True)
    with open(TOKEN_FILE, "w") as f:
        f.write(creds.to_json())

    print(f"\n[✓] Authentication successful!")
    print(f"    Token saved to: {TOKEN_FILE}")
    print("\n    You can now use the Gmail MCP server.")
    print("    Run: python gmail_mcp.py")


if __name__ == "__main__":
    main()
