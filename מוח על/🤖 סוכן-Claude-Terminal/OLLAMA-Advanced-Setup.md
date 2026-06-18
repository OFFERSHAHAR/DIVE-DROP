# 🦙 OLLAMA - Advanced Setup & Optimization

> **איך להריץ Local Models כמו מקצוען + חיבור ל-Claude**

---

## 🎯 למה OLLAMA?

| אפשרות | עלות | מהירות | פרטיות | ידע |
|--------|------|--------|--------|------|
| Claude API | $$ | מהיר | ☁️ Cloud | ✅ מחדש |
| Local OLLAMA | $ | ⚡ מהיר | 🔒 Private | ⚠️ עתיק |
| Hybrid | $-$$ | ⚡⚡ | ✅ Mixed | ✅✅ |

**אנחנו בחרים Hybrid!** ✅

---

## 🚀 התקנה

### Windows - OLLAMA

```powershell
# 1. Download
Invoke-WebRequest -Uri "https://ollama.ai/download/OllamaSetup.exe" -OutFile "OllamaSetup.exe"

# 2. התקן
.\OllamaSetup.exe

# 3. בדוק
ollama --version
```

### macOS/Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

---

## 📦 Choose Your Model

### Light (Fast) - Haiku-equivalent
```bash
# Best for: quick tasks, local summary
ollama run mistral
```

### Medium (Balanced) - Sonnet-equivalent
```bash
# Best for: most tasks, code review
ollama run neural-chat
```

### Heavy (Smart) - Opus-equivalent
```bash
# Best for: complex reasoning, architecture
ollama run llama2-uncensored

# or
ollama run openchat
```

### Latest (Best 2026)
```bash
# Check what's new
ollama list

# Pull latest
ollama pull mistral-nemo  # NEW 2026
ollama pull llama2.3      # UPDATED
```

---

## ⚙️ Setup Optimizations

### 1. GPU Acceleration (CRITICAL!)
```bash
# Windows (NVIDIA)
# OLLAMA automatically uses GPU if installed

# Check GPU usage
nvidia-smi

# If not using GPU:
set CUDA_VISIBLE_DEVICES=0
ollama serve
```

### 2. Memory Optimization
```bash
# Set max context
# In .ollama/config

# For 8GB RAM:
OLLAMA_MAX_LOADED_MODELS=1
OLLAMA_MEMORY_GROWTH=0.8

# For 16GB RAM:
OLLAMA_MAX_LOADED_MODELS=2
OLLAMA_NUM_PARALLEL=4

# For 32GB+ (like you might have):
OLLAMA_NUM_PARALLEL=8
OLLAMA_MEMORY_GROWTH=0.95
```

### 3. API Server (חשוב!)
```bash
# Start OLLAMA as API server
ollama serve

# Default: http://localhost:11434

# Test it:
curl http://localhost:11434/api/tags
```

---

## 🔗 Connect OLLAMA to Claude Code

### Option 1: Use OLLAMA for Summarization
```bash
# Before Claude API call:
# Summarize large files with OLLAMA (cheaper)

curl -X POST http://localhost:11434/api/generate \
  -d '{
    "model": "mistral",
    "prompt": "Summarize this code: [large code here]"
  }'

# Then pass summary to Claude
claude-code -c "summary" "analyze this"
```

### Option 2: Chain OLLAMA → Claude
```bash
# Create wrapper script

#!/bin/bash
# chain.sh

# Step 1: OLLAMA analysis (fast, local)
OLLAMA_SUMMARY=$(curl -X POST http://localhost:11434/api/generate \
  -d "{ \"model\": \"mistral\", \"prompt\": \"$1\" }" \
  -s | jq -r '.response')

# Step 2: Claude enhancement (smart)
claude-code "Improve on this analysis: $OLLAMA_SUMMARY"
```

### Option 3: OLLAMA API Wrapper
```python
# ollama_wrapper.py
import requests
import subprocess

def ollama_analyze(text, task="analyze"):
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "mistral",
            "prompt": f"{task}: {text}"
        }
    )
    return response.json()["response"]

def claude_enhance(text, model="claude-sonnet-4.6"):
    # Call Claude after OLLAMA
    cmd = f'claude-code -c - --model {model} "Improve this: {{text}}"'
    return subprocess.run(cmd, input=text, capture_output=True)

# Usage
ollama_result = ollama_analyze("my code")
final = claude_enhance(ollama_result)
```

---

## 🎯 Pro Workflows

### Workflow 1: Code Review (Hybrid)
```bash
# 1. OLLAMA: Fast first pass
ollama run mistral "code review of [code]"

# 2. Claude: Deep analysis
claude-code -c code.js "detailed review based on OLLAMA feedback"

# 3. OLLAMA: Verify fixes
ollama run mistral "are these fixes good?"
```

### Workflow 2: Documentation Generation
```bash
# 1. OLLAMA: Generate docs skeleton (fast)
ollama run neural-chat "generate markdown docs for [code]"

# 2. Claude: Polish & enhance
claude-code -c skeleton.md -c code.js "professional-grade docs"
```

### Workflow 3: Testing Strategy
```bash
# 1. OLLAMA: Test ideas
ollama run mistral "suggest test cases for [function]"

# 2. Claude: Write tests
claude-code "implement tests: [suggestions]"

# 3. OLLAMA: Quick validation
ollama run mistral "are these tests complete?"
```

---

## 📊 Performance Benchmark

### Speed (lower = better)
```
Task: Analyze 5KB code
- OLLAMA (Mistral): 2-5 sec ⚡
- Claude Haiku: 1-2 sec ⚡⚡
- Claude Sonnet: 1-2 sec ⚡⚡

Task: Complex architecture
- OLLAMA: ❌ struggles
- Claude Opus: ✅ Perfect
```

### Cost (per 1M tokens)
```
OLLAMA: $0 (local) ✅
Claude Haiku: $0.80
Claude Sonnet: $3
Claude Opus: $15
```

### Quality (1-10)
```
OLLAMA: 6-7 (good for summaries)
Claude Haiku: 7.5
Claude Sonnet: 8.5
Claude Opus: 9.5 (state-of-art)
```

---

## 🐛 Troubleshooting

### OLLAMA won't start
```bash
# Check port
netstat -an | findstr 11434

# Kill process
taskkill /PID [pid] /F

# Restart
ollama serve
```

### GPU not working
```bash
# Reinstall CUDA
# Or check drivers
nvidia-smi

# Force CPU mode
OLLAMA_GPU_MEMORY=0 ollama serve
```

### Connection refused
```bash
# Make sure OLLAMA is running
ollama serve

# Check endpoint
curl http://localhost:11434/api/tags
```

---

## ✅ Best Practices

✅ **תמיד:**
- השתמש OLLAMA לsumarization בלבד
- Use Claude for complex tasks
- Monitor GPU memory (ollama top)
- Pull latest models regularly

❌ **אל תעשה:**
- אל תתגיע על Claude API עבור עבודות פשוטות
- אל תשתמש ב-OLLAMA ל-complex reasoning
- אל תרשום GPU memory להתחממות
- אל תסתמך על old models

---

**עודכן:** 2026-06-16
**מודלים חדשים:** בדוק עם `ollama list` 🔄
