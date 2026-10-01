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

| Method | Path                          | Description                             |
| ------ | ----------------------------- | --------------------------------------- |
| GET    | `/health`                     | Liveness check and the attraction count |
| GET    | `/attractions/{slug}/similar` | Up to `limit` (1–10, default 5) matches |

```bash
curl "http://localhost:8000/attractions/patenga-beach/similar?limit=5"
```

```json
{
  "slug": "patenga-beach",
  "name": "Patenga Beach",
  "count": 5,
  "results": [
    {
      "slug": "parki-beach",
      "name": "Parki Beach",
      "category": "Beach",
      "score": 0.5527,
      "distanceKm": 5.2
    }
  ]
}
```

A `limit` outside 1–10 is rejected with `422`; an unknown slug returns `404`.

## How the scoring works

Each place is reduced to one text (description + address + its category repeated),
turned into a TF-IDF vector, and compared to every other place by cosine
similarity. That text score is then blended with a distance-based one:

```
final = 0.8 × text similarity + 0.2 × proximity
```

Both parts are 0–1 and the weights sum to 1, so the final score is also 0–1. The
weights and the distance half-life live in `app/config.py`.

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

## Configuration

| Variable          | Default                 | Purpose                                |
| ----------------- | ----------------------- | -------------------------------------- |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated origins allowed by CORS |

See `.env.example`. Note that unlike the frontend, **this file is not loaded
automatically** — there is no dotenv dependency here, so set the variable in your
shell:

```powershell
$env:ALLOWED_ORIGINS = "http://localhost:5173"   # PowerShell
```

```bash
export ALLOWED_ORIGINS="http://localhost:5173"   # macOS/Linux
```

## Running it with the frontend

In two terminals:

```bash
cd backend && uvicorn app.main:app --reload     # :8000
cd ctgmap  && npm run dev                       # :5173
```

The frontend needs `VITE_API_URL=http://localhost:8000` in `ctgmap/.env` (copy
`ctgmap/.env.example`). Without it — or if this API is down — the map computes its
"You might also like" suggestions in the browser instead, so the site works
either way.
