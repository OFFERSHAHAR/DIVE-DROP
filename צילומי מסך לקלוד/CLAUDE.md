# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 📋 Project Overview

**Agent Workspace** is a framework for building AI agents using the **WAT model**:

- **Workflows** = Instructions (Markdown SOPs in `AGENT_WORKSPACE/workflows/`)
- **Agents** = Reasoning & Decision Making (This role)
- **Tools** = Deterministic Execution (Python/NodeJS/Shell scripts in `AGENT_WORKSPACE/tools/`)

The system integrates with:
- **Claude API** (LLM backbone via Anthropic)
- **n8n** (Workflow automation & orchestration)
- **WhatsApp Business API** (Messaging)
- **Salesforce** (CRM integration)
- **Slack** (Team communication)
- **Gmail** (Email automation)
- **PostgreSQL** (Data persistence)

---

## 🗂️ Project Structure

```
AGENT_WORKSPACE/
├── .env                  # Environment variables (template in repo)
├── credentials.json      # API credentials (NEVER commit actual values)
├── workflows/            # Markdown SOPs & n8n workflow definitions
├── tools/                # Executable tools (Python, Node, Shell)
│   ├── core/            # Framework utilities
│   ├── integrations/    # API client wrappers
│   └── automation/      # Business logic
├── tmp/                 # Temporary working files
├── LOGS/                # Execution logs and audit trail
└── docs/                # Documentation & architecture decisions
```

---

## ⚙️ Setup & Configuration

### Initial Setup

```bash
# 1. Copy environment template
cp AGENT_WORKSPACE/.env.example AGENT_WORKSPACE/.env

# 2. Fill in credentials (NEVER commit this file)
# Edit AGENT_WORKSPACE/credentials.json with actual API keys:
# - LLM_API_KEY (from Anthropic)
# - N8N_TOKEN (from n8n)
# - WHATSAPP_ACCESS_TOKEN (from Meta)
# - Database credentials
# - etc.

# 3. Verify configuration
node AGENT_WORKSPACE/validate-config.js
```

### Required Environment Variables

```
LLM_MODEL=claude-opus           # Anthropic model to use
LLM_API_KEY=sk-ant-...          # Anthropic API key
N8N_URL=https://<instance>.n8n.cloud
N8N_TOKEN=n8n_pat_...
WHATSAPP_PHONE_ID=              # Meta Business Phone ID
WHATSAPP_ACCESS_TOKEN=          # Meta access token
WHATSAPP_BUSINESS_ID=           # Meta Business Account ID
DB_HOST=localhost
DB_USER=<postgres_user>
DB_PASS=<postgres_password>
DB_NAME=agent_workspace
LOG_LEVEL=info
LOG_PATH=./LOGS
```

---

## 🚀 Development Workflow

### Core Operating Principles

1. **Read before acting** — Understand the existing system
2. **Understand before changing** — Know what you're modifying
3. **Reuse before creating** — Check existing tools/workflows first
4. **Verify before claiming success** — Test everything
5. **Fix root causes, not symptoms** — Debug properly
6. **Preserve existing functionality** — Don't break what works
7. **Never make assumptions when evidence can be gathered** — Investigate

### Before Writing Code

- Inspect `AGENT_WORKSPACE/` structure
- Read relevant workflow in `workflows/`
- Search `tools/` for existing implementations
- Identify dependencies and impacts
- Check n8n integrations for available API connections

### Before Modifying Code

- Use trace-mcp tools to understand code impact
- Check imports and references
- Review existing patterns and conventions
- Verify all tests pass
- Review diff before committing

### After Modifying Code

```bash
# 1. Run validation
node AGENT_WORKSPACE/validate.js

# 2. Run tests if available
npm test

# 3. Verify functionality in context
# Test tool with sample input, verify logs

# 4. Check git diff
git diff HEAD

# 5. Report changes clearly
```

---

## 🛠️ Creating Tools

Tools are deterministic, reusable components. Create new tools only if no existing tool solves the problem.

### Tool Structure

```
tools/integrations/salesforce-client.js
tools/core/logger.js
tools/automation/send-whatsapp.js
```

### Tool Template

```javascript
/**
 * Tool: [Name]
 * Purpose: [Brief description]
 * Inputs: [Describe parameters]
 * Outputs: [Describe return values]
 * Dependencies: [What this requires]
 */

module.exports = async function toolName(params) {
  // Validate inputs
  if (!params.required) throw new Error('Missing required parameter');
  
  // Execute
  const result = await doWork(params);
  
  // Log
  logger.info(`[toolName] Completed:`, result);
  
  // Return
  return result;
};
```

### Tool Execution Policy

- Tools must be **pure functions** when possible
- Always **log** execution and results
- Always **handle errors** explicitly
- Never store state in tools (use workflows/database)
- Return structured, parseable output

---

## 📝 Creating Workflows

Workflows are Markdown SOPs + n8n automation definitions.

### Workflow Execution (6-Step Process)

When a task arrives:

1. **Read** relevant workflow from `AGENT_WORKSPACE/workflows/`
2. **Determine** required inputs
3. **Identify** available tools
4. **Execute** tools in correct sequence
5. **Validate** outputs
6. **Return** result

### Workflow Format

```markdown
# Workflow: Send WhatsApp Message

## Purpose
Deliver WhatsApp message to customer via Meta Business API

## Inputs
- phone_number: E.164 format
- message: Text content
- template_id: Optional template reference

## Steps
1. Validate phone number format
2. Check rate limits
3. Call send-whatsapp tool
4. Log delivery status
5. Update CRM

## Error Handling
- Invalid format → Return validation error
- Rate limited → Queue for retry
- API error → Log and alert
```

---

## 🔗 Integration Points

### n8n Integration

- **URL**: `https://opiko666.app.n8n.cloud`
- **Use for**: Cross-system orchestration, scheduling, webhooks
- **Policy**: Minimize node count, reuse workflows, avoid unnecessary complexity

### Claude API Integration

- **Model**: claude-opus (configurable in .env)
- **Used for**: Agent reasoning, decision-making, text generation
- **Pattern**: Call Claude → Parse response → Execute tools

### WhatsApp Integration

- **API**: Meta Business Messaging API
- **Rate limits**: Check Meta documentation
- **Webhook handling**: Verify signatures before processing

### Database

- **Type**: PostgreSQL
- **Use for**: Persisting agent state, conversation history, audit logs
- **Schema**: Define in docs/schema.sql

---

## 📊 Tool-First Policy

**Priority for implementation:**

1. Check existing MCP servers (if available)
2. Check existing tools in `tools/`
3. Check existing n8n workflows
4. Check existing integrations
5. **ONLY THEN** create new implementation

Do not create duplicate implementations.

---

## ✅ Git Workflow

### Before Any Commit

- Review diff: `git diff HEAD`
- Remove debug code and console logs
- Remove unused imports
- Verify build/validation passes

### Commit Message Format

```
type(scope): description

Examples:
feat(whatsapp): add template message support
fix(db): resolve connection timeout issue
refactor(tools): simplify rate-limit logic
docs(workflow): update send-message SOP
```

### Never Commit

- `.env` files with real credentials
- `credentials.json` with actual API keys
- Debug logs or temporary files
- Failing tests

---

## 🎯 AI Agent Operating Rules

### You Are the Coordinator, Not the Tool

- **Delegate** scripts, APIs, MCP servers, existing tools
- **Focus on**: Planning, reasoning, validation, coordination
- **Don't**: Write code when a tool exists

### Output Format

Always return results in this structure:

```markdown
## Summary
[What was accomplished]

## Changes
[Files modified, tools created, workflows updated]

## Validation
[How the result was verified]

## Risks
[Potential concerns or side effects]

## Next Steps
[Recommended follow-up actions]
```

### Error Handling

When failure occurs:

1. Read the entire error
2. Determine root cause (don't guess)
3. Fix the issue
4. Retest thoroughly
5. Verify success
6. Document learning for future prevention

---

## 🔍 Self-Improvement Loop

For every failure:

1. **Identify** the failure
2. **Fix** the implementation
3. **Verify** the fix works
4. **Update** workflow documentation
5. **Prevent** recurrence

The system improves after every failure.

---

## 📝 Common Development Tasks

### Running the Agent

```bash
# From AGENT_WORKSPACE directory
node index.js
```

### Testing a Tool

```bash
# Load the tool and test with sample input
node -e "require('./tools/integrations/salesforce-client')({...params})"
```

### Checking Logs

```bash
# View recent logs
tail -f AGENT_WORKSPACE/LOGS/agent.log

# Filter by level
grep ERROR AGENT_WORKSPACE/LOGS/agent.log
```

### Validating Configuration

```bash
# Verify all required env vars are set
node AGENT_WORKSPACE/validate-config.js
```

---

## ⚠️ Critical Rules

- **Never hardcode credentials** — Always use .env and credentials.json
- **Never ignore errors** — Debug and fix
- **Never bypass failures** — Don't suppress warnings
- **Never optimize for speed** — Optimize for correctness
- **A verified solution is always better than a fast guess**

---

## 📚 Reference Files

- `AGENT_WORKSPACE/MD/` — Architecture docs and decision logs
- `AGENT_WORKSPACE/workflows/` — Standard Operating Procedures
- `AGENT_WORKSPACE/tools/` — Reusable tool implementations
- `.env` — Configuration template
- `credentials.json` — Integration setup template

---

## 🔑 Key Patterns

### Pattern: Tool Invocation via Workflow

```
Workflow (n8n) → Calls Tool → Returns Result → Updates State → Logs Action
```

### Pattern: Agent Decision Loop

```
Task → Read Workflow → Identify Tools → Execute → Validate → Report
```

### Pattern: Error Recovery

```
Error Detected → Root Cause Analysis → Fix → Test → Document → Retry
```

---

## 🏆 Golden Rule

**Do not optimize for speed. Optimize for correctness.**

A verified solution is always better than a fast guess.
