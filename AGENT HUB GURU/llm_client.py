"""
LLM Client — AGENT HUB GURU
"""

import re
import requests

PROVIDER = "ollama"
MODEL    = "qwen3.5:latest"

OLLAMA_URL = "http://localhost:11434/api/chat"

_CJKV = re.compile(r'[一-鿿぀-ヿ가-힯]+')


def chat(system: str, messages: list[dict], max_tokens: int = 2048) -> str:
    safe = []
    for m in messages:
        if m["role"] == "user":
            safe.append({"role": "user", "content": "/no_think\n" + m["content"]})
        else:
            safe.append(m)

    if PROVIDER == "ollama":
        raw = _ollama(system, safe)
    else:
        raw = _anthropic(system, safe, max_tokens)

    raw = re.sub(r"<think>.*?</think>", "", raw, flags=re.DOTALL)
    raw = _CJKV.sub("", raw)
    return raw.strip()


def _ollama(system: str, messages: list[dict]) -> str:
    r = requests.post(OLLAMA_URL, json={
        "model": MODEL,
        "messages": [{"role": "system", "content": system}] + messages,
        "stream": False,
        "options": {"temperature": 0.7}
    }, timeout=120)
    r.raise_for_status()
    return r.json()["message"]["content"]


def _anthropic(system: str, messages: list[dict], max_tokens: int) -> str:
    import anthropic
    c = anthropic.Anthropic()
    r = c.messages.create(model="claude-sonnet-4-6", max_tokens=max_tokens,
                           system=system, messages=messages)
    return r.content[0].text


def provider_info() -> str:
    return f"Ollama / {MODEL}" if PROVIDER == "ollama" else "Anthropic / claude-sonnet-4-6"
