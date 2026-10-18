<h1 align="center">🤖 AutoGrow AI/ML GitHub Trends Workflow</h1>

<p align="center">
  <img src="Workflow.png" alt="Workflow Overview" width="700"/>
</p>

<p align="center">
  <b>Automated curation of trending AI, ML, and Data Science repositories from GitHub</b><br>
  🚀 Daily digests | 📊 Category-aware summaries | 🔒 Token-safe workflow
</p>

---

## ✨ Overview

*AutoGrow AI/ML GitHub Trends Workflow* is a production-ready automation that:

- ✅ Fetches trending AI/ML/Data Science repos from GitHub
- ✅ Categorizes by ML, DL, NLP, CV, Data Science, and more
- ✅ Generates technical summaries using LLMs (Gemini API, etc.)
- ✅ Outputs daily markdown digests for your community or team
- ✅ Keeps your API keys and tokens safe (see .gitignore)
- ✅ Runs as an n8n workflow in Docker on AWS EC2

To see the results, go to [https://github.com/drago-Codes/daily-ai-trends](https://github.com/drago-Codes/daily-ai-trends)

---

## 🚀 Features

- 🤖 *Automated GitHub Search* – Finds new, high-star AI/ML repos daily
- 🧠 *Smart Categorization* – Tags repos by ML, DL, NLP, CV, etc.
- 📝 *LLM Summaries* – Uses Gemini API or similar LLMs for concise, technical writeups
- 📅 *Batch Digest* – Produces a markdown summary for easy sharing
- 🔒 *Token Redaction* – Sensitive keys are never committed (see .gitignore)
- ⚡ *AWS EC2 & Docker* – Easily deployable, scalable, and customizable

---

## 🛠 Tech Stack

| Layer         | Technology         |
|---------------|-------------------|
| ⚙ Workflow   | n8n (Docker on AWS EC2) |
| 🗃 Data Source | GitHub API         |
| 🧠 AI Engine  | Gemini API (or swap for OpenAI, etc.) |
| 📄 Output     | Markdown digests   |
| 🔒 Security   | .gitignore, token redaction |

---

## 🧪 Example Workflow

1. Scheduled trigger starts the workflow (daily or custom interval)
2. Fetches trending repos from GitHub (AI/ML/Data Science focus)
3. Splits and processes each repo, categorizing by topic
4. Generates technical summaries using an LLM (Gemini API)
5. Batches results into a markdown digest
6. Optionally commits the digest to a GitHub repo

---

## 🧰 Usage

### 🔧 Deploy on AWS EC2 with Docker

1. Launch an AWS EC2 instance (Ubuntu recommended) and install Docker
2. Clone this repository to your EC2 instance
3. Create your `.env` from the template and fill in your keys:
   ```bash
   cp .env.example .env
   ```
4. Start n8n:
   ```bash
   docker compose up -d
   ```
5. Import the workflow (or import `n8n-agent.json` from the n8n UI at `http://<host>:5678`):
   ```bash
   docker compose exec n8n n8n import:workflow --input=/workflows/n8n-agent.json
   ```
6. In n8n, attach your GitHub credential to the two **Create a file** nodes, then activate the workflow
7. Adjust schedule, categories, or output as needed. It runs daily at 9:00 (`TZ` in `.env`)

### ✅ Validate the workflow

Before importing changes, check the export for broken connections, Code node syntax errors, and `{{ }}` values that n8n won't evaluate:

```bash
node scripts/validate-workflow.mjs
```

### 🛡 Environment Variables & Security

*Never commit secrets to your repo!*

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | ✅ | Used for GitHub search API requests |
| `GEMINI_API_KEY` | ✅ | Gemini API key, sent as the `x-goog-api-key` header |
| `GEMINI_MODEL` | | Defaults to `gemini-2.5-flash` |
| `TZ` | | Timezone for the schedule trigger, defaults to `UTC` |

- All API tokens and keys are loaded from `.env`, which git ignores.
- The workflow reads them with `$env`, so `docker-compose.yml` sets `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`.
- The workflow export contains no secrets and is safe to commit.

---

## 📂 Project Structure

- `n8n-agent.json` – workflow export (safe to commit, no secrets)
- `docker-compose.yml` – runs n8n with your `.env`
- `.env.example` – template for `.env` (never commit the real one)
- `scripts/validate-workflow.mjs` – sanity checks for the workflow export
- `.gitignore` – excludes sensitive files and junk
- `Workflow.png` – workflow diagram

---
