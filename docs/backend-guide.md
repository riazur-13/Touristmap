# Backend guide — the "similar places" API

This is a walkthrough of the first backend for Chittagong Explorer, written for
someone whose experience so far is frontend. One section per stage, in the order
it was built.

The service answers one question: *given a place on the map, which other places
are most like it?*

- [Stage 1 — Data and a hello-world API](#stage-1--data-and-a-hello-world-api)
- [Try it yourself](#try-it-yourself)

---

## Stage 1 — Data and a hello-world API

### The plain-language version

A backend is a program that sits on a computer somewhere, waits for questions
over the network, and answers them. That's it. The frontend you already have is
code that runs *inside someone's browser*; the backend runs somewhere you
control, and the browser talks to it over HTTP.

**The analogy.** Think of a restaurant kitchen. The menu (the frontend) is what
the customer sees and points at. The kitchen (the backend) receives the order,
does work the customer can't see, and sends back a plate. The *waiter* carrying
orders back and forth is HTTP — a fixed, boring protocol both sides agree on.

Two decisions in this stage are worth understanding, because they are the ones
that bite people later.

**First: who owns the data?** The attraction list already lives in
`ctgmap/src/data/attractions.js`. The backend is Python and can't import a
JavaScript file. The tempting fix is to paste the data into a Python file — and
then you have *two* lists that slowly disagree, which is one of the most common
and most annoying bugs in this line of work. So instead the JavaScript file stays
the one true copy, and a script *generates* a JSON version for the backend. A
test then fails if the generated copy is out of date, so forgetting is impossible
rather than merely discouraged. The kitchen and the menu are printed from the
same source.

**Second: when is the data read?** Reading a file from disk takes milliseconds —
fast for a person, slow for a server answering many requests. So the file is read
**once, when the server starts**, and kept in memory. Prep the vegetables before
service, not when each order comes in.

### What the code does

```
backend/
├── requirements.txt       pinned dependency versions
├── pyproject.toml         linter + test runner config
├── README.md              setup and run instructions
└── app/
    ├── config.py          every tunable number, in one place
    ├── models.py          the shape of the data and the JSON responses
    ├── data.py            reading + validating the exported JSON
    ├── main.py            the web app and its endpoints
    └── data/
        └── attractions.json   GENERATED — do not edit by hand
```

**`ctgmap/scripts/export-attractions.mjs`** is the generator. It reads
`attractions.js` and writes the JSON the backend consumes, keeping only the six
fields the backend needs: `slug`, `name`, `category`, `description`, `address`,
`coordinates`. Photos, opening hours and the rest stay frontend-only — sending
them across would mean more to keep in sync for no benefit.

There is a wrinkle worth knowing about. `attractions.js` imports
`"../config/constants"` with no `.js` on the end. Browsers and bundlers resolve
that; plain Node does not. Rather than fight it, the script borrows **Vite's**
resolver — the same one the real app uses — so the export is guaranteed to see
exactly what the browser sees:

```js
const server = await createServer({ server: { middlewareMode: true }, ... });
const { default: attractions } = await server.ssrLoadModule("/src/data/attractions.js");
```

The field list and the JSON formatting live in `scripts/attractionsExport.mjs`,
imported by both the script and the test, so the test can't check a different
shape than the script writes.

**`src/data/attractions.export.test.js`** is the staleness guard. It rebuilds the
JSON in memory and compares it to the file on disk. If they differ the test fails
with `export is stale — run \`npm run export:attractions\``. This is the piece
that makes "two copies of the data" safe: the duplication still exists, but it
cannot silently drift.

**`app/models.py`** defines the shapes, using Pydantic. If you've used
TypeScript, Pydantic will feel familiar but with one critical difference:
TypeScript types vanish at runtime, whereas Pydantic models *actually check data
at runtime*.

```python
Latitude = Annotated[float, Field(ge=-90.0, le=90.0)]

class Attraction(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")
    slug: str = Field(min_length=1)
    ...
    coordinates: tuple[Latitude, Longitude]
```

So a swapped latitude/longitude, an empty name, or an unexpected extra field is
rejected the moment the file is loaded. `frozen=True` makes each record
immutable, which matters because every request shares one in-memory copy — no
request can corrupt it for the next one.

**`app/data.py`** loads and validates the file, and refuses to proceed if the
file is missing, empty, or has duplicate slugs. All three are fatal on purpose: a
recommendation API with no data has nothing useful to do, so failing at startup
is better than booting and quietly returning empty results.

**`app/main.py`** is the web app. The important part is the *lifespan*:

```python
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    app.state.attractions = load_attractions(config.DATA_PATH)
    yield                      # <-- the server serves requests here
    app.state.attractions = None
```

Everything before `yield` runs once before the first request is accepted;
everything after runs at shutdown. The loaded data is parked on `app.state`,
FastAPI's place for things that exist once per application.

And the endpoint itself:

```python
@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", attractions=len(app.state.attractions))
```

`@app.get("/health")` means "when an HTTP GET arrives for the path `/health`,
call this function". `response_model=HealthResponse` tells FastAPI to validate and
serialise the return value — and to document it in `/docs` automatically.

Note that `/health` reports the attraction **count**, not just `{"status":
"ok"}`. A health check that can pass while the dataset is empty is not telling
you much; this one proves the server is up *and* that it has data.

### The professional framing

**Why a generated file instead of one shared database?** Because this data is
small (90 records), changes only when a developer edits it, and is already
version-controlled alongside the code. A database would add an operational
dependency — something to run, back up and connect to — to solve a problem that
doesn't exist yet. The generated-file approach keeps the data reviewable in pull
requests and makes the whole backend a pure function of the repo. If the data
later became user-editable, that calculus changes and a database becomes correct.

**Why pinned dependency versions?** `fastapi==0.142.2`, not `fastapi>=0.142`.
Unpinned dependencies mean your machine, your colleague's machine and CI can all
install different versions, which produces the worst class of bug: "it works on
my machine". Pinning makes the build reproducible; upgrades become a deliberate,
reviewable change.

> **Interviewer: "You've got the same data in two places. Isn't that a bug
> waiting to happen?"**
>
> "It would be, if both copies were editable. Here one is generated from the
> other by a script, and a test in the frontend suite fails if the generated copy
> is stale — so the duplication can't drift silently. I chose that over having the
> backend parse the JavaScript, or over moving the data into a database, because
> the data is small, developer-owned and already in version control; a database
> would add a service to operate without solving a problem I actually have. The
> moment the data needs to be user-editable or shared across services, the
> generated file stops being appropriate and I'd move it to a real datastore."

> **Interviewer: "Why load the data in a lifespan handler rather than in the
> request?"**
>
> "Cost and failure timing. Reading and validating the file is work that doesn't
> depend on the request, so doing it per-request burns latency on every call for
> no benefit. Doing it at startup also moves failure to the right place: if the
> data is missing or malformed the process refuses to start, which a deploy health
> check catches immediately. If I loaded it lazily, a bad deploy would look
> healthy and fail later on real traffic."

---

## Try it yourself

All commands assume the virtual environment is active — see
[`backend/README.md`](../backend/README.md) for the one-time setup.

### Start the server

From `backend/`:

```bash
uvicorn app.main:app --reload
```

`app.main:app` means "in the module `app/main.py`, use the object named `app`".
You should see `Uvicorn running on http://127.0.0.1:8000`.

### Call it from the interactive docs

Open <http://localhost:8000/docs>.

FastAPI generates this page from the type hints and Pydantic models — nothing is
written by hand. It is the fastest way to explore an API you don't know yet.

1. Click **GET /health** to expand it.
2. Click **Try it out**, then **Execute**.
3. You should get `200` and:

```json
{ "status": "ok", "attractions": 90 }
```

If `attractions` is `0` or the server failed to start, the export is probably
missing — run `npm run export:attractions` in `ctgmap/`.

You can also call it without a browser:

```bash
curl http://localhost:8000/health
```

### Run the tests

From `backend/`:

```bash
pytest          # the backend suite
ruff check .    # lint
```

And from `ctgmap/`, for the frontend side (including the export staleness guard):

```bash
npm test
npm run lint
```
