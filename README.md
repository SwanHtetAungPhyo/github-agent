

# 🧑‍💻 GitHub Agent with Mastra

A **GitHub AI assistant** built with [Mastra](https://mastra.ai/), powered by [Groq](https://groq.com/) for LLM inference, and enhanced with **GitHub OAuth authentication**.
This agent provides **advanced repository management capabilities** such as issues, pull requests, file operations, collaborators, branches, commits, and release management — all automated through natural language.

---

## ✨ Features

* 🔐 **GitHub OAuth** — Secure authentication via GitHub

* ⚡ **Groq-powered LLM** — Fast and cost-efficient AI responses

* 🗂 **GitHub Repository Management**:

    * Fetch repo details & statistics
    * Manage issues & PRs
    * Branch & commit operations
    * File operations (CRUD)
    * Collaborator & release management
    * Search repositories (code, issues, PRs)

* 🧠 **Session-based Context** — Keeps track of conversations

* 🧰 **Tool Integration** — Uses GitHub API tools, not memory-based guesses

* 📊 **Structured Responses** — Clear, formatted output

---

## 🏗 Tech Stack

* [Mastra](https://mastra.ai/) — AI Orchestration Framework
* [Groq](https://groq.com/) — LLM inference provider
* [Hono](https://hono.dev/) — Lightweight web framework
* [Redis](https://redis.io/) — Session storage
* [PostgreSQL](https://www.postgresql.org/) — Persistence
* [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps) — Auth & API access

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/github-agent-mastra.git
cd github-agent-mastra
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file (never commit real secrets).
Use `.env.example` as a template:

```env
# API Keys
GROQ_API_KEY=your_groq_api_key_here

# Redis
REDIS_URL=redis://default:your_redis_password@your_redis_host:your_redis_port

# GitHub OAuth
GITHUB_REDIRECT_URI=http://localhost:3000/auth/github/callback
GITHUB_SCOPE=repo user:email
GITHUB_AUTHORIZER_URL=https://github.com/login/oauth/authorize
GITHUB_TOKEN_URL=https://github.com/login/oauth/access_token
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# PostgreSQL
POSTGRES_HOST=your_postgres_host
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database

# App
PORT=4000
```

---

## 🚀 Running the Project

Start the Mastra server:

```bash
npm run dev
```

By default, the app runs on:
👉 [http://localhost:3000](http://localhost:4000)
    
Swagger UI docs will be available at:
👉 [http://localhost:3000/docs](http://localhost:4000/docs)

---

## 🤖 The GitHub Agent

Defined in [`agents/githubAgent.ts`](./agents/githubAgent.ts):

```ts
export const mainAgent = new Agent({
  name: "GitHub Assistant Agent",
  instructions: "You are a comprehensive GitHub assistant...",
  model: groq("llama-3.3-70b-versatile"),
  tools: { getRepoTool },
  memory: memory,
});
```

---

## 🛠 Supported Operations

### 🔎 Repository

* Get repo details (`get_repo`)
* Repo stats (`get_repo_stats`)

### 📝 Issues

* List issues (`list_issues`)
* Create, update, close issues

### 🔀 Pull Requests

* List PRs (`list_prs`)
* Create & merge PRs

### 📂 Files

* Get, create, update, delete files
* List repo directories

### 🌿 Branches

* List, create, delete, get branches

### 📜 Commits

* List commits
* Get commit details
* Compare commits

### 👥 Collaborators

* List collaborators
* Add collaborator

### 📦 Releases

* List releases
* Create release

### 🔍 Search

* Search code (`search_code`)
* Search issues (`search_issues`)

---

## 💬 Example Interactions

* **Show README in VSCode repo**
  → *get\_file with path `README.md` from `microsoft/vscode`*

* **Create an issue**
  → Ask for title & body, then *create\_issue*

* **Make a new branch**
  → Ask for name + SHA, then *create\_branch*

* **Search for "error handling"**
  → *search\_code*

---

## 📡 API Routes

| Endpoint                | Method | Description                           |
| ----------------------- | ------ | ------------------------------------- |
| `/auth/github`          | GET    | GitHub login redirect                 |
| `/auth/github/callback` | GET    | GitHub OAuth callback                 |
| `/auth/github/logout`   | POST   | GitHub logout                         |
| `/chat`                 | POST   | Chat with agent (JSON response)       |
| `/awp` (optional)       | POST   | Chat with agent (AG-UI/SSE streaming) |

---

## 🔐 Authentication

1. Go to `/auth/github` → sign in with GitHub
2. Session is stored in Redis
3. Agent requests require `github_access_token` in session

---

## 📜 License

MIT © Your Name

---

⚡ With this, your **GitHub Agent with Mastra** is production-ready:

* Rich GitHub API tools
* Groq-powered reasoning
* OAuth-secured
* Flexible JSON + SSE interfaces

---

