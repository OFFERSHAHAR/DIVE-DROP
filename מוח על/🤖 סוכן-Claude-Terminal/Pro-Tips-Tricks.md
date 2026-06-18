# ⚡ Pro Tips & Tricks - Advanced Usage

> **נכסים, טריקים, וcommands מתקדמים שישדרגו אותך ל-EXPERT**

---

## 🔧 Claude Code Advanced Commands

### Interactive Mode Secrets
```bash
# Start interactive
claude-code

# Commands זמינים:
/context add <file>      # הוסף קובץ
/context list            # ראה context
/context clear           # נקה הכל
/save <filename>         # שמור conversation
/load <filename>         # טען conversation
/model <name>            # שנה מודל
/tokens                  # ראה token count
/review <file>           # דבר עם review mode
/help                    # עזרה
```

### Environment Variables (חזק!)
```bash
# Windows
set ANTHROPIC_API_KEY=sk-...
set ANTHROPIC_TIMEOUT=60000
set ANTHROPIC_BUFFER_SIZE=4096

# Linux/Mac
export ANTHROPIC_API_KEY=sk-...
export ANTHROPIC_TIMEOUT=60000

# Use in script
$env:ANTHROPIC_API_KEY = "sk-..."
```

---

## 💡 Hidden Tricks

### Trick 1: Batch Processing
```bash
# Process multiple files
for f in src/*.js; do
  claude-code -c "$f" "find bugs and fix"
done
```

### Trick 2: Pipe Context
```bash
# Use output as context
cat myfile.js | claude-code "analyze this code"

# Or
claude-code < input.txt "summarize"
```

### Trick 3: Template Prompts
```bash
# Create prompt template
cat > code-review.prompt << EOF
You are an expert code reviewer.
Review this code for:
1. Security issues
2. Performance problems
3. Code style issues
4. Testing gaps
EOF

# Use it
claude-code -c code.js < code-review.prompt
```

### Trick 4: Output to File
```bash
# Save output
claude-code "write full implementation" > output.js

# Append to file
claude-code "add more tests" >> tests.js

# Multiple formats
claude-code "generate docs" > README.md
claude-code "create JSON schema" > schema.json
```

---

## 🚀 Workflow Automations

### Automation 1: Auto-Commit with AI
```bash
#!/bin/bash
# save as git-smart-commit.sh

DIFF=$(git diff --cached)
COMMIT_MSG=$(claude-code -c - < <(echo "$DIFF") \
  "Generate a commit message for this diff (one line)")

git commit -m "$COMMIT_MSG"
```

### Automation 2: Code Quality Pipeline
```bash
#!/bin/bash
# auto-improve.sh

FILE=$1
echo "🔍 Analyzing $FILE..."
claude-code -c "$FILE" "suggest improvements" > suggestions.md

echo "✅ Implementing..."
claude-code -c "$FILE" -c suggestions.md "apply all improvements" > "${FILE}.improved"

echo "🧪 Testing..."
claude-code -c "${FILE}.improved" "write comprehensive tests" > "${FILE}.test.js"

mv "${FILE}.improved" "$FILE"
```

### Automation 3: Documentation Auto-Generator
```bash
#!/bin/bash
# auto-docs.sh

for file in src/**/*.js; do
  echo "📝 Documenting $file..."
  claude-code -c "$file" \
    "Generate comprehensive JSDoc comments and markdown documentation"
done
```

---

## 📊 Performance Hacks

### Hack 1: Parallel Processing
```bash
# Run multiple Claude processes in parallel
claude-code -c file1.js "analyze" &
claude-code -c file2.js "analyze" &
claude-code -c file3.js "analyze" &
wait

# Combine results
cat analysis-*.txt > combined-analysis.txt
```

### Hack 2: Caching Context
```bash
# Save context once
claude-code --output-dir ./cache -c src/ "index the code"

# Reuse in multiple prompts
claude-code --context-dir ./cache "find all database queries"
claude-code --context-dir ./cache "optimize performance"
```

### Hack 3: Model Fallback
```bash
#!/bin/bash
# use sonnet, fallback to haiku if expensive

if [ $(claude-code --show-tokens "$1") -gt 50000 ]; then
  echo "Using Haiku (context too large)"
  claude-code --model claude-haiku-4.5 "$1"
else
  echo "Using Sonnet"
  claude-code --model claude-sonnet-4.6 "$1"
fi
```

---

## 🎯 Token Optimization Tips

### Tip 1: Compression
```bash
# Bad (high tokens):
claude-code "analyze this 10KB JavaScript file: [entire file]"

# Good (low tokens):
claude-code -c largefile.js "analyze"  # Auto-optimized

# Better:
claude-code -c largefile.js --summary "analyze"
```

### Tip 2: Progressive Refinement
```bash
# Instead of 1 big prompt:
# ❌ claude-code "fix all bugs, add tests, optimize, document"

# Do this:
# ✅ claude-code -c code.js "find bugs"
# ✅ claude-code -c bugs.md "write fixes"  
# ✅ claude-code -c fixed.js "optimize"
```

### Tip 3: Structured Output
```bash
# Request structured response to reduce tokens needed for parsing
claude-code -c code.js \
  "Find 3 main issues. Format as:
   Issue 1: [description]
   Fix: [code]"
```

---

## 🔐 Security Best Practices

### Secret Management
```bash
# ❌ Never do this:
claude-code -c ".env" "analyze code"  # Your secrets are exposed!

# ✅ Do this:
claude-code -c .env.example "analyze setup"
```

### API Key Rotation
```bash
# Rotate key every 30 days
claude-code config set ANTHROPIC_API_KEY="sk-new..."

# Verify
claude-code config get ANTHROPIC_API_KEY
```

### Audit Logging
```bash
# Enable logging
export ANTHROPIC_LOG_LEVEL=DEBUG

# All requests logged to ~/.claude-code/logs
```

---

## 🌐 Integration Examples

### VSCode Integration
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Claude Code Review",
      "type": "shell",
      "command": "claude-code",
      "args": ["-c", "${file}", "review this file"],
      "problemMatcher": []
    }
  ]
}
```

### GitHub Actions Integration
```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review

on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Claude Review
        run: |
          npm install -g @anthropic-ai/claude-code
          claude-code "review PR changes: $(git diff main...HEAD)"
```

### N8N Workflow Integration
```javascript
// In N8N:
// Use "Execute command" node:
claude-code -c "file.js" "task: ${workflow.input}"
```

---

## 📚 Resources & Commands

### Getting Help
```bash
# Official docs
claude-code --help
claude-code --version

# Interactive help
claude-code > /help
# Then type: /help

# API docs
# https://docs.anthropic.com
```

### Useful Links
- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Anthropic Docs](https://docs.anthropic.com)
- [Model Comparison](https://docs.anthropic.com/en/docs/about-claude/models/latest)
- [Release Notes](https://github.com/anthropics/claude-code/releases)

---

## 🎁 Bonus: Useful Aliases (Unix/PowerShell)

### Unix/Linux/Mac
```bash
# Add to ~/.bashrc or ~/.zshrc:

alias cc='claude-code'
alias cc-review='claude-code --model claude-opus-4.8'
alias cc-fast='claude-code --model claude-haiku-4.5'
alias cc-balanced='claude-code --model claude-sonnet-4.6'

# Quick context add
cc-quick() { claude-code -c "$1" "${@:2}"; }

# Reload after each alias update:
source ~/.bashrc
```

### PowerShell
```powershell
# Add to $PROFILE:

function cc { claude-code @args }
function cc-review { claude-code --model claude-opus-4.8 @args }
function cc-fast { claude-code --model claude-haiku-4.5 @args }

# Reload:
. $PROFILE
```

---

**עודכן:** 2026-06-16
**סטטוס:** כל הTricks עובדים ✅
