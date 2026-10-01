# Chittagong Explorer — backend

A small FastAPI service that answers one question: **given a place on the map,
which other places are most like it?**

It is a *content-based* recommender — it compares what each place is (its
description, category and address), so it needs no user history and works from
the first request. See [`docs/backend-guide.md`](../docs/backend-guide.md) for
the walkthrough.

## Requirements

- **Python 3.11 or newer** — check with `python --version` (or `py --version` on
  Windows). If it is missing or older, install it from
  [python.org/downloads](https://www.python.org/downloads/), or with
  `brew install python@3.12` (macOS) / `sudo apt install python3.12-venv` (Debian/Ubuntu).
- **Node.js 20+**, only to re-export the attraction data from the frontend.

## Setup

All commands are run from `backend/`.

### Windows (PowerShell)

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

If activation is blocked by the execution policy, run this once:
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

### macOS / Linux

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

`.venv/` is gitignored — it is rebuilt from `requirements.txt`, never committed.
You will know it is active when your prompt is prefixed with `(.venv)`. Leave it
with `deactivate`.

## Run the server

```bash
uvicorn app.main:app --reload
```

- Interactive API docs: <http://localhost:8000/docs>
- Health check: <http://localhost:8000/health>

`--reload` restarts the server when you edit a file. Use it in development only.

## Endpoints

| Method | Path      | Description                             |
| ------ | --------- | --------------------------------------- |
| GET    | `/health` | Liveness check and the attraction count |

## Tests and linting

```bash
pytest           # test suite
ruff check .     # lint
ruff format .    # auto-format (use --check to verify without writing)
```

## Where the data comes from

`app/data/attractions.json` is **generated**. The single source of truth is the
frontend's `ctgmap/src/data/attractions.js`. After editing it, re-export:

```bash
cd ../ctgmap
npm run export:attractions
```

Forgetting this is caught by the frontend test suite — `npm test` fails with a
message telling you to re-export.
