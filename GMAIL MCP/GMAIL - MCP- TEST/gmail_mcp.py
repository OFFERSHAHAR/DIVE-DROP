#!/usr/bin/env python3
'''
MCP Server for Gmail API.

Provides tools to read and search Gmail messages using official Google API.
Uses OAuth 2.0 with read-only scope to avoid account restrictions.
Rate-limited with exponential backoff to prevent API quota issues.
'''

import os
import json
import base64
import time
import random
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime, timedelta
from email import message_from_bytes

import httpx
from pydantic import BaseModel, Field, ConfigDict
from mcp.server.fastmcp import FastMCP

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

mcp = FastMCP("gmail_mcp")

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]
TOKEN_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".gmail_token")
TOKEN_FILE = os.path.join(TOKEN_DIR, "token.json")
CREDENTIALS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "credentials.json")

MAX_RETRIES = 3
INITIAL_RETRY_DELAY = 1.0

class ResponseFormat(str, Enum):
    MARKDOWN = "markdown"
    JSON = "json"

class ListMessagesInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, validate_assignment=True)

    max_results: int = Field(default=20, description="Maximum messages to return", ge=1, le=100)
    label_ids: Optional[List[str]] = Field(default=None, description="Filter by label IDs (e.g., ['INBOX', 'UNREAD'])")
    query: Optional[str] = Field(default=None, description="Gmail search query (same as Gmail search bar)")
    include_spam_trash: bool = Field(default=False, description="Include messages from Spam and Trash")
    response_format: ResponseFormat = Field(default=ResponseFormat.MARKDOWN, description="Output format")

class GetMessageInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, validate_assignment=True)

    message_id: str = Field(..., description="Gmail message ID to fetch", min_length=1)
    format: str = Field(default="full", description="Message format: 'full', 'raw', 'minimal', 'metadata'")
    response_format: ResponseFormat = Field(default=ResponseFormat.MARKDOWN, description="Output format")

class SearchMessagesInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, validate_assignment=True)

    query: str = Field(..., description="Gmail search query", min_length=1)
    max_results: int = Field(default=20, description="Maximum results to return", ge=1, le=100)
    response_format: ResponseFormat = Field(default=ResponseFormat.MARKDOWN, description="Output format")

class ListLabelsInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, validate_assignment=True)

    response_format: ResponseFormat = Field(default=ResponseFormat.MARKDOWN, description="Output format")

class GetUnreadCountInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, validate_assignment=True)

    response_format: ResponseFormat = Field(default=ResponseFormat.MARKDOWN, description="Output format")

class ListAttachmentsInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, validate_assignment=True)

    message_id: str = Field(..., description="Gmail message ID", min_length=1)
    response_format: ResponseFormat = Field(default=ResponseFormat.MARKDOWN, description="Output format")

class GetProfileInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, validate_assignment=True)

    response_format: ResponseFormat = Field(default=ResponseFormat.MARKDOWN, description="Output format")


def _ensure_token_dir():
    if not os.path.exists(TOKEN_DIR):
        os.makedirs(TOKEN_DIR, exist_ok=True)

def _get_gmail_service():
    _ensure_token_dir()
    creds = None

    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDENTIALS_FILE):
                raise RuntimeError(
                    "credentials.json not found. "
                    "Run 'python oauth_setup.py' first to set up Gmail API access."
                )
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)

        _ensure_token_dir()
        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())

    return build("gmail", "v1", credentials=creds)

def _execute_with_retry(request):
    for attempt in range(MAX_RETRIES):
        try:
            return request.execute()
        except HttpError as e:
            if e.resp.status in (429, 500, 502, 503):
                if attempt == MAX_RETRIES - 1:
                    raise
                delay = INITIAL_RETRY_DELAY * (2 ** attempt) + random.uniform(0, 1)
                time.sleep(delay)
            else:
                raise

def _decode_email_body(payload):
    if "parts" in payload:
        body_data = ""
        for part in payload["parts"]:
            if part["mimeType"] == "text/plain" and "data" in part.get("body", {}):
                body_data = base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="replace")
                break
            elif part["mimeType"] == "text/html" and "data" in part.get("body", {}):
                body_data = base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="replace")
                break
            elif "parts" in part:
                body_data = _decode_email_body(part)
                if body_data:
                    return body_data
        return body_data
    else:
        if "data" in payload.get("body", {}):
            return base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="replace")
    return ""

def _parse_message(msg):
    headers = {h["name"].lower(): h["value"] for h in msg.get("payload", {}).get("headers", [])}
    body = _decode_email_body(msg.get("payload", {}))
    return {
        "id": msg["id"],
        "thread_id": msg.get("threadId", ""),
        "from": headers.get("from", ""),
        "to": headers.get("to", ""),
        "subject": headers.get("subject", ""),
        "date": headers.get("date", ""),
        "snippet": msg.get("snippet", ""),
        "body_preview": body[:500] if body else "",
        "label_ids": msg.get("labelIds", []),
    }

def _format_message_md(msg):
    lines = [
        f"**From:** {msg['from']}",
        f"**To:** {msg['to']}",
        f"**Subject:** {msg['subject']}",
        f"**Date:** {msg['date']}",
        f"**Labels:** {', '.join(msg['label_ids'])}",
        "",
        f"**Preview:** {msg['snippet']}",
    ]
    if msg.get("body_preview"):
        lines.extend(["", "---", "", msg["body_preview"]])
    return "\n".join(lines)

def _format_message_list_md(messages, total):
    if not messages:
        return "No messages found."

    lines = [f"# Gmail Messages\n", f"Found {total} messages\n"]
    for i, msg in enumerate(messages, 1):
        lines.extend([
            f"### {i}. {msg['subject'] or '(no subject)'}",
            f"- **From:** {msg['from']}",
            f"- **Date:** {msg['date']}",
            f"- **Snippet:** {msg['snippet'][:120]}",
            f"- **ID:** `{msg['id']}`",
            "",
        ])
    return "\n".join(lines)

def _handle_api_error(e: Exception) -> str:
    if isinstance(e, HttpError):
        status = e.resp.status
        if status == 401:
            return "Error: Authentication failed. Run 'python oauth_setup.py' to re-authenticate."
        elif status == 403:
            return "Error: Access forbidden. Check Gmail API is enabled in Google Cloud Console."
        elif status == 429:
            return "Error: Rate limit exceeded. Please wait before making more requests."
        elif status == 404:
            return "Error: Message not found. The ID may be incorrect or the message was deleted."
        return f"Error: Gmail API request failed with status {status}"
    elif isinstance(e, httpx.TimeoutException):
        return "Error: Request timed out. Please try again."
    return f"Error: {str(e)}"


@mcp.tool(
    name="gmail_list_messages",
    annotations={
        "title": "List Gmail Messages",
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
)
async def gmail_list_messages(params: ListMessagesInput) -> str:
    '''List Gmail messages with optional filters.

    Retrieves messages from the authenticated user's Gmail inbox with support
    for label filtering, search queries, and pagination. Does NOT mark messages
    as read or modify them in any way.

    Args:
        params (ListMessagesInput): Validated input parameters containing:
            - max_results (int): Maximum messages to return, between 1-100 (default: 20)
            - label_ids (Optional[List[str]]): Filter by label IDs like ['INBOX', 'UNREAD', 'SENT']
            - query (Optional[str]): Gmail search query syntax (e.g., "from:john@example.com after:2024/01/01")
            - include_spam_trash (bool): Include Spam and Trash (default: False)
            - response_format (str): 'markdown' or 'json' (default: 'markdown')

    Returns:
        str: Formatted list of messages with subject, sender, date, and preview.
    '''
    try:
        service = _get_gmail_service()

        kwargs = {
            "userId": "me",
            "maxResults": min(params.max_results, 100),
        }
        if params.label_ids:
            kwargs["labelIds"] = params.label_ids
        if params.query:
            kwargs["q"] = params.query
        if params.include_spam_trash:
            kwargs["includeSpamTrash"] = True

        request = service.users().messages().list(**kwargs)
        data = _execute_with_retry(request)
        messages = data.get("messages", [])
        total = len(messages)

        results = []
        for msg_meta in messages:
            msg = _execute_with_retry(
                service.users().messages().get(userId="me", id=msg_meta["id"], format="metadata", metadataHeaders=["From", "Subject", "Date"])
            )
            results.append(_parse_message(msg))

        if params.response_format == ResponseFormat.MARKDOWN:
            if not results:
                return "No messages found matching your filters."
            return _format_message_list_md(results, total)
        else:
            return json.dumps({
                "total": total,
                "messages": results,
            }, indent=2)

    except Exception as e:
        return _handle_api_error(e)


@mcp.tool(
    name="gmail_get_message",
    annotations={
        "title": "Get Gmail Message Details",
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
)
async def gmail_get_message(params: GetMessageInput) -> str:
    '''Get full details of a specific Gmail message.

    Fetches the complete content of a single email by its ID, including body text.
    Use after gmail_list_messages to get full content of a specific email.

    Args:
        params (GetMessageInput): Validated input parameters containing:
            - message_id (str): The Gmail message ID to fetch
            - format (str): 'full', 'raw', 'minimal', or 'metadata' (default: 'full')
            - response_format (str): 'markdown' or 'json' (default: 'markdown')

    Returns:
        str: Full message content including body text.
    '''
    try:
        service = _get_gmail_service()
        msg = _execute_with_retry(
            service.users().messages().get(userId="me", id=params.message_id, format=params.format)
        )
        parsed = _parse_message(msg)

        if params.response_format == ResponseFormat.MARKDOWN:
            return _format_message_md(parsed)
        else:
            return json.dumps(parsed, indent=2)

    except Exception as e:
        return _handle_api_error(e)


@mcp.tool(
    name="gmail_search_messages",
    annotations={
        "title": "Search Gmail Messages",
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
)
async def gmail_search_messages(params: SearchMessagesInput) -> str:
    '''Search Gmail messages using Gmail search syntax.

    Same Gmail search syntax as the web interface:
    - from:sender@example.com
    - to:recipient@example.com
    - subject:"exact phrase"
    - after:2024/01/01 before:2024/12/31
    - has:attachment
    - is:unread / is:read

    Args:
        params (SearchMessagesInput): Validated input parameters containing:
            - query (str): Gmail search query string
            - max_results (int): Maximum results, between 1-100 (default: 20)
            - response_format (str): 'markdown' or 'json' (default: 'markdown')

    Returns:
        str: Matching messages with subject, sender, date, and preview.
    '''
    try:
        service = _get_gmail_service()

        request = service.users().messages().list(
            userId="me", q=params.query, maxResults=min(params.max_results, 100)
        )
        data = _execute_with_retry(request)
        messages = data.get("messages", [])
        total = len(messages)

        results = []
        for msg_meta in messages:
            msg = _execute_with_retry(
                service.users().messages().get(
                    userId="me", id=msg_meta["id"],
                    format="metadata",
                    metadataHeaders=["From", "Subject", "Date"],
                )
            )
            results.append(_parse_message(msg))

        if params.response_format == ResponseFormat.MARKDOWN:
            if not results:
                return f"No messages found matching query: '{params.query}'"
            lines = [f"# Search Results: '{params.query}'\n", f"Found {total} messages\n"]
            for i, msg in enumerate(results, 1):
                lines.extend([
                    f"### {i}. {msg['subject'] or '(no subject)'}",
                    f"- **From:** {msg['from']}",
                    f"- **Date:** {msg['date']}",
                    f"- **Snippet:** {msg['snippet'][:200]}",
                    f"- **ID:** `{msg['id']}`",
                    "",
                ])
            return "\n".join(lines)
        else:
            return json.dumps({"query": params.query, "total": total, "messages": results}, indent=2)

    except Exception as e:
        return _handle_api_error(e)


@mcp.tool(
    name="gmail_list_labels",
    annotations={
        "title": "List Gmail Labels",
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
)
async def gmail_list_labels(params: ListLabelsInput) -> str:
    '''List all Gmail labels (folders/tags) for the authenticated account.

    Returns both system labels (INBOX, SENT, UNREAD, etc.) and user-created labels.

    Args:
        params (ListLabelsInput): Validated input parameters containing:
            - response_format (str): 'markdown' or 'json' (default: 'markdown')

    Returns:
        str: List of all labels with their IDs, names, and message counts.
    '''
    try:
        service = _get_gmail_service()
        response = _execute_with_retry(service.users().labels().list(userId="me"))
        labels = response.get("labels", [])

        if params.response_format == ResponseFormat.MARKDOWN:
            if not labels:
                return "No labels found."
            lines = ["# Gmail Labels\n"]
            for label in sorted(labels, key=lambda x: x.get("name", "")):
                label_type = "System" if label.get("type") == "system" else "User"
                total_count = label.get("messagesTotal", 0)
                unread_count = label.get("messagesUnread", 0)
                lines.append(f"- **{label['name']}** (`{label['id']}`)")
                lines.append(f"  - Type: {label_type}, Total: {total_count}, Unread: {unread_count}")
            return "\n".join(lines)
        else:
            return json.dumps({"total": len(labels), "labels": labels}, indent=2, default=str)

    except Exception as e:
        return _handle_api_error(e)


@mcp.tool(
    name="gmail_get_unread_count",
    annotations={
        "title": "Get Gmail Unread Count",
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
)
async def gmail_get_unread_count(params: GetUnreadCountInput) -> str:
    '''Get the number of unread messages in the inbox.

    Quick way to check for new mail without fetching full message lists.

    Args:
        params (GetUnreadCountInput): Validated input parameters containing:
            - response_format (str): 'markdown' or 'json' (default: 'markdown')

    Returns:
        str: Unread count with inbox total.
    '''
    try:
        service = _get_gmail_service()
        inbox = _execute_with_retry(
            service.users().labels().get(userId="me", id="INBOX")
        )
        unread = inbox.get("messagesUnread", 0)
        total = inbox.get("messagesTotal", 0)

        list_req = service.users().messages().list(
            userId="me", labelIds=["INBOX", "UNREAD"], maxResults=1
        )
        unread_data = _execute_with_retry(list_req)
        recent_unread = unread_data.get("resultSizeEstimate", 0)

        if params.response_format == ResponseFormat.MARKDOWN:
            return (
                f"**Unread Messages:** {unread}\n"
                f"**Total Inbox:** {total}\n"
                f"**Unread (estimated):** {recent_unread}"
            )
        else:
            return json.dumps({
                "unread": unread,
                "total_inbox": total,
                "unread_estimate": recent_unread,
            }, indent=2)

    except Exception as e:
        return _handle_api_error(e)


@mcp.tool(
    name="gmail_list_attachments",
    annotations={
        "title": "List Gmail Message Attachments",
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
)
async def gmail_list_attachments(params: ListAttachmentsInput) -> str:
    '''List attachment metadata for a specific Gmail message.

    Shows filename, MIME type, and size of all attachments. Does NOT download them.

    Args:
        params (ListAttachmentsInput): Validated input parameters containing:
            - message_id (str): Gmail message ID
            - response_format (str): 'markdown' or 'json' (default: 'markdown')

    Returns:
        str: List of attachments with metadata.
    '''
    try:
        service = _get_gmail_service()
        msg = _execute_with_retry(
            service.users().messages().get(userId="me", id=params.message_id, format="full")
        )

        attachments = []
        def _extract_parts(parts):
            for part in parts:
                filename = part.get("filename", "")
                mime_type = part.get("mimeType", "")
                body = part.get("body", {})
                if filename and body.get("attachmentId"):
                    attachments.append({
                        "filename": filename,
                        "mime_type": mime_type,
                        "size": body.get("size", 0),
                        "attachment_id": body["attachmentId"],
                    })
                if "parts" in part:
                    _extract_parts(part["parts"])

        payload = msg.get("payload", {})
        if "parts" in payload:
            _extract_parts(payload["parts"])

        if params.response_format == ResponseFormat.MARKDOWN:
            if not attachments:
                return "No attachments found in this message."
            total_size = sum(a["size"] for a in attachments)
            lines = [f"# Attachments ({len(attachments)} files, {_format_size(total_size)})", ""]
            for att in attachments:
                lines.append(f"- **{att['filename']}** ({att['mime_type']}, {_format_size(att['size'])})")
            return "\n".join(lines)
        else:
            return json.dumps({
                "message_id": params.message_id,
                "attachments": attachments,
            }, indent=2)

    except Exception as e:
        return _handle_api_error(e)


@mcp.tool(
    name="gmail_get_profile",
    annotations={
        "title": "Get Gmail Profile",
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
)
async def gmail_get_profile(params: GetProfileInput) -> str:
    '''Get the authenticated user's Gmail profile information.

    Shows email address, total messages, and total threads.

    Args:
        params (GetProfileInput): Validated input parameters containing:
            - response_format (str): 'markdown' or 'json' (default: 'markdown')

    Returns:
        str: Profile information for the authenticated account.
    '''
    try:
        service = _get_gmail_service()
        profile = _execute_with_retry(service.users().getProfile(userId="me"))

        if params.response_format == ResponseFormat.MARKDOWN:
            return (
                f"**Email:** {profile['emailAddress']}\n"
                f"**Total Messages:** {profile.get('messagesTotal', 0)}\n"
                f"**Total Threads:** {profile.get('threadsTotal', 0)}"
            )
        else:
            return json.dumps(profile, indent=2, default=str)

    except Exception as e:
        return _handle_api_error(e)


def _format_size(size_bytes):
    for unit in ["B", "KB", "MB", "GB"]:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} TB"


if __name__ == "__main__":
    mcp.run()
