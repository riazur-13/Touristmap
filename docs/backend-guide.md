# Backend guide — the "similar places" API

This is a walkthrough of the first backend for Chittagong Explorer, written for
someone whose experience so far is frontend. One section per stage, in the order
it was built.

The service answers one question: *given a place on the map, which other places
are most like it?*

- [Stage 1 — Data and a hello-world API](#stage-1--data-and-a-hello-world-api)
- [Stage 2 — The recommendation engine](#stage-2--the-recommendation-engine)
- [Stage 3 — Tests and quality](#stage-3--tests-and-quality)
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

## Stage 2 — The recommendation engine

### The plain-language version

We want: *given Patenga Beach, what else would this visitor like?*

**The analogy.** Imagine describing every place on a single index card, then
sorting the cards into piles by how much their wording overlaps. Beaches end up
with beaches because they all mention sand, sea and sunset; monasteries end up
with monasteries. To compare two cards you don't need to understand them — you
just need to count which words they share. That is the entire idea.

Two refinements make the counting actually work.

**Common words are worthless for telling things apart.** Nearly every card says
"the", "and", "visitors". Those words are *everywhere*, so they carry no signal.
Conversely "waterfall" appears on few cards, so when two cards both say it, that
is a strong hint. The standard way to encode this is **TF-IDF**: a word's weight
goes *up* the more it appears on this card, and *down* the more cards it appears
on. Rare shared words count; ubiquitous ones don't.

**Length shouldn't win.** A place with a 60-word description shares more raw
words with everything than one with a 20-word description. If we measured overlap
by raw count, verbose entries would look similar to everything. **Cosine
similarity** fixes this by comparing the *direction* of the two word-vectors and
ignoring their magnitude — the proportions of what a place talks about, not how
much it talks.

Then there is one thing the words don't know: **a good suggestion is one you can
act on.** Two equally beach-like beaches are not equally useful if one is 5 km
away and the other is 300 km away. So the final score mixes in distance — but
only a little, which is the interesting part (below).

### What the code does

Everything lives in `app/recommender.py`, plus the numbers in `app/config.py`.

**1. One text per place.** `build_text` flattens a place into a single string:

```python
parts = [attraction.description, attraction.address]
parts.extend([attraction.category] * config.CATEGORY_REPEAT)   # 3x
return " ".join(parts)
```

The category is repeated three times. TF-IDF counts terms, so repetition is how
you say "this field matters more than one word of prose" without reaching for a
more complex model. Without it, two beaches whose descriptions happen to share no
vocabulary would score as unrelated. The address is in there because in this
dataset it carries genuine signal — "Bandarban", "Cox's Bazar" and
"Khagrachhari" group places that really do belong on the same trip.

**2. Vectorise and compare.**

```python
vectorizer = TfidfVectorizer(stop_words="english")
matrix = vectorizer.fit_transform([build_text(a) for a in self._attractions])
text_similarity = cosine_similarity(matrix)
```

`matrix` has one row per place and one column per distinct word in the whole
dataset. `cosine_similarity` returns a 90×90 table where entry `[i][j]` is how
similar place *i* is to place *j*, from 0 to 1.

**3. Distance.** `haversine_km` returns another 90×90 table, of kilometres. It's
written as whole-array numpy arithmetic rather than a double loop — the same
formula, run in compiled code instead of interpreted Python.

**4. Blend them.**

```python
self._score = np.clip(
    config.TEXT_WEIGHT * text_similarity                      # 0.8
    + config.PROXIMITY_WEIGHT * proximity_score(distance_km),  # 0.2
    0.0, 1.0,
)
```

`proximity_score` converts km into a 0–1 nearness value by half-life decay: 0 km
scores 1.0, 50 km scores 0.5, 100 km scores 0.25, tapering towards zero. A decay
curve is used rather than something linear like `1 - d/max_d` because the
difference between 5 km and 25 km genuinely matters to a traveller, while the
difference between 205 km and 225 km does not.

**Why 0.8 / 0.2, and not 50/50?** Because the two signals are not equally
trustworthy. Text similarity answers the question actually asked ("what is like
this?"); distance answers a different one ("what is near this?"). At 0.2,
proximity has just enough pull to break near-ties — which of two similar beaches
to show first — but not enough to lift an unrelated neighbour above a genuinely
similar place further away. You can see it working in the real output: for Patenga
Beach, Parki Beach (5 km) edges out Kattali (14 km) despite near-identical text
scores, yet the whole top five is still beaches rather than "everything in
Chittagong city". At 50/50 the list degrades into a proximity list with a
tie-breaker, which the map already shows you. Both weights live in `config.py` and
sum to 1.0, which keeps the final score inside 0–1 and readable as a percentage.

**5. Serve a request.** `similar()` takes the one row it needs and ranks it:

```python
order = np.argsort(-scores, kind="stable")
for other in order:
    if other == row:      # a place is never its own recommendation
        continue
```

Two details carry weight here. `kind="stable"` makes ties resolve in dataset
order, so the same request can never return two different orderings — which is
what the determinism test pins down. And self-exclusion is by **index**, not by
filtering on score: two places with identical text would both score 1.0, so
filtering on the value could drop the wrong one.

**6. The route** (`app/main.py`):

```python
limit: Annotated[int, Query(ge=config.MIN_LIMIT, le=config.MAX_LIMIT)] = config.DEFAULT_LIMIT
```

That's the whole validation implementation. FastAPI reads the constraint from the
type annotation and rejects `?limit=0` or `?limit=11` with a `422` *before* the
handler body runs, and documents the bounds in `/docs`. An unknown slug raises
`UnknownSlugError` from the recommender, which the route translates into a `404`
— deliberately converted at the HTTP boundary, because the recommender has no
business knowing about status codes.

The recommender itself is reached through a dependency:

```python
def get_recommender(request: Request) -> Recommender:
    return request.app.state.recommender

RecommenderDep = Annotated[Recommender, Depends(get_recommender)]
```

This is FastAPI's dependency injection. The handler declares what it needs in its
signature instead of reaching for a module-level global, which keeps it testable
in isolation.

### The professional framing

**The key performance decision**: the 90×90 similarity table is computed **once
at startup**, not per request. Building it means vectorising the entire corpus —
expensive, and identical for every request. Precomputing turns each request into a
row lookup plus a sort: microseconds instead of milliseconds. The cost is memory
(trivial here — 8,100 floats) and staleness, which doesn't apply because the data
only changes on redeploy.

This is a real tradeoff, not a free win, and it's worth being able to say where it
breaks: the table is O(n²). At 90 places it's nothing. At 100,000 places it would
be 10 billion entries and this design would be wrong — you'd switch to an
approximate nearest-neighbour index (FAISS, `hnswlib`) and accept slightly
imperfect neighbours in exchange for not materialising the matrix.

> **Interviewer: "Why content-based filtering rather than collaborative
> filtering?"**
>
> "Cold start. Collaborative filtering recommends from behaviour — 'people who
> liked this also liked that' — which is usually more accurate, but it needs a
> corpus of user interactions this project doesn't have and can't fake. A
> content-based model works from the item metadata alone, so it gives sensible
> results on the very first request with zero users. It also has no privacy
> surface, since it never touches user data. The honest downside is that it can
> only find things that *look* similar in the text — it will never discover that
> two places are enjoyed by the same kind of traveller despite describing
> themselves differently. If this had real traffic I'd log interactions and move
> to a hybrid: content-based for cold items, collaborative once an item has enough
> signal."

> **Interviewer: "Walk me through why you precompute the similarity matrix. When
> would that be the wrong call?"**
>
> "The matrix is the same for every request and expensive to build, so computing
> it per request would pay the cost repeatedly for no benefit — it's hoisted into
> startup, which makes each request a row lookup and a partial sort. It's the
> right call when the item set is small and only changes on deploy, which is
> exactly this case. It becomes wrong on two axes: size, because memory is O(n²)
> and at six figures of items it stops fitting; and volatility, because if items
> were added at runtime the table would be stale the moment it was built. At that
> point I'd move to an approximate nearest-neighbour index and trade exactness for
> scale."

> **Interviewer: "You weight text at 0.8 and distance at 0.2. Where did those
> numbers come from?"**
>
> "Judgement, then checked against output — and I'd say that plainly rather than
> dress it up as tuned. The reasoning is that the two signals answer different
> questions: text answers the one the user asked, distance answers a convenience
> question, so distance should be a tie-breaker and not a driver. 0.2 is enough to
> reorder near-ties and not enough to promote an unrelated neighbour over a good
> match; I verified that on real queries. What I'd want to make it rigorous is
> click-through data — show variants, measure which suggestions get followed, and
> pick the weight empirically. The weights sit in one config constant specifically
> so that becomes a one-line change."

---

## Stage 3 — Tests and quality

### The plain-language version

**The analogy.** Tests are the smoke alarm you install *before* the fire. Nobody
enjoys fitting them, and they do nothing visible on a good day. Their entire value
shows up on the day you change something innocuous and the alarm goes off.

Recommendation code is unusually dangerous to leave untested, because **broken
output still looks plausible**. If `/health` breaks, you get a 500 and you know.
If the recommender starts suggesting Patenga Beach for Patenga Beach, or silently
returns three results when you asked for five, the page still renders a tidy list
of places and nothing looks wrong. You would ship it.

So the suite is split by what it's protecting:

- **Contract tests** — does the API behave as promised? Right number of results,
  rejects a bad `limit`, 404s an unknown slug, never returns the place itself.
- **Quality tests** — are the recommendations *any good*? A beach should mostly
  get beaches. This is the one that catches "you refactored the scoring and made
  it worse", which no contract test would notice.
- **Unit tests** — is the arithmetic right? Checked directly rather than inferred
  from API output, so a failure points at the line that's wrong.

### What the code does

```
backend/tests/
├── conftest.py           shared fixtures
├── test_health.py        /health
├── test_similar.py       the endpoint's contract + recommendation quality
└── test_recommender.py   the scoring maths, below HTTP
```

**`conftest.py`** provides the fixtures. The important subtlety:

```python
with TestClient(app) as test_client:
    yield test_client
```

Using `TestClient` **as a context manager** is what runs the lifespan handler. If
you just write `TestClient(app)`, startup never fires, `app.state.recommender` is
never set, and every test fails confusingly. Scope is `session`, so the 90×90
matrix is built once for the whole suite rather than per test.

**Self-exclusion is checked for all 90 places, not one:**

```python
@pytest.mark.parametrize("slug", ALL_SLUGS)
def test_never_recommends_the_place_itself(client, slug):
    body = fetch_similar(client, slug, limit=config.MAX_LIMIT)
    assert slug not in [r["slug"] for r in body["results"]]
```

`parametrize` turns one function into one test per slug, so a failure names the
offending place instead of just saying "a place failed". That's why the suite is
146 tests from ~20 functions.

**Invalid input must be rejected, not repaired.** `limit=0`, `limit=11`,
`limit=-1`, `limit=abc` and `limit=1.5` all assert `422`. Clamping a bad value to
something valid would hide the caller's bug.

**Determinism is pinned at two levels** — twice on one instance (no per-request
randomness) and across two freshly built `Recommender`s (nothing depends on dict
ordering or an unseeded random source). There's also a subtler one:

```python
def test_a_shorter_limit_is_a_prefix_of_a_longer_one(client):
    assert fetch_similar(client, "patenga-beach", limit=3)["results"] \
        == fetch_similar(client, "patenga-beach", limit=10)["results"][:3]
```

Asking for 3 must give the first 3 of asking for 10. That catches a whole family
of off-by-one and sort-order bugs that a length check sails past.

**The quality check** runs over every beach in the dataset:

```python
@pytest.mark.parametrize("slug", BEACH_SLUGS)
def test_a_beach_is_mostly_recommended_other_beaches(client, slug):
    results = fetch_similar(client, slug, limit=5)["results"]
    assert len([r for r in results if r["category"] == "Beach"]) >= 2
```

The threshold is deliberately **2 of 5**, while the model currently achieves 4–5
of 5. That gap is intentional: a test asserting the current output exactly would
fail on any reasonable reweighting, which trains you to ignore it. A loose floor
fails only when the model has genuinely broken. There's also an aggregate check
that ≥60% of all places get a same-category top match — asserted in aggregate
because a few places legitimately resemble another category more than their own,
and a per-place version would be encoding noise as a requirement.

**One test documents the proximity weight is live:**
`test_nearby_wins_between_comparable_places` asserts Parki Beach (5 km) outranks
Kattali (14 km) for Patenga. Set `PROXIMITY_WEIGHT` to 0 and only that test
fails — which is exactly what you want from a test of a tunable.

**CI** (`.github/workflows/ci.yml`) runs on every pull request: frontend lint and
tests in one job, backend `ruff check`, `ruff format --check` and `pytest` in
another. The backend job runs on a **matrix** of Python 3.11 and 3.14 — 3.11
because that's the floor the README promises (scikit-learn requires `>=3.11`), and
3.14 because that's what this was developed on. `npm ci` is used rather than
`npm install` because it installs exactly what the lockfile pins and fails if the
lockfile is stale.

### The professional framing

A test suite's job is to fail for the right reasons. Two failure modes to avoid,
both on display here:

- **Tests that assert current output.** Pinning "Parki Beach scores 0.5527" makes
  every tuning change a test-fixing exercise, so people stop reading the failures.
  The quality tests assert *properties* ("mostly beaches", "ordered by score",
  "nearer of two similar places wins") that survive reasonable change and break on
  real regressions.
- **Tests that can't localise a failure.** One test over all 90 slugs tells you
  something is broken; 90 parametrised tests tell you *which place*.

> **Interviewer: "How do you test a recommendation engine? There's no single
> right answer to compare against."**
>
> "You separate the two questions. The contract is objectively testable — result
> count, validation, 404s, never returning the input itself, and determinism — so I
> test that exhaustively, parametrised over every item so a failure names the
> culprit. Quality has no ground truth, so I test invariants instead of outputs: a
> beach's recommendations should be mostly beaches, results must be ordered by
> score, and of two similar places the nearer should rank higher. I set those
> thresholds deliberately loose — the beach check requires 2 of 5 while the model
> delivers 4 or 5 — because a test pinned to current output fails on every tuning
> change and quickly gets ignored. With real traffic I'd add offline evaluation on
> held-out click data, which gives you an actual metric to move."

> **Interviewer: "What would you add to this CI pipeline next?"**
>
> "Three things, in order of value. A coverage floor, so new code can't quietly
> arrive untested. Dependency and secret scanning — `pip-audit` plus Dependabot —
> since pinned dependencies are reproducible but also frozen, including frozen
> vulnerabilities. And a build-and-smoke-test step that actually boots the app and
> hits `/health`, because `pytest` passing proves the code works while the app can
> still fail to start for reasons tests never touch. I'd also add type checking
> with mypy; the annotations are already there, so it's close to free."

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

Now the interesting one. Expand **GET /attractions/{slug}/similar**, click **Try
it out**, and fill in:

- `slug`: `patenga-beach`
- `limit`: `5`

**Execute**, and you should get five beaches, nearest-and-most-similar first:

```json
{
  "slug": "patenga-beach",
  "name": "Patenga Beach",
  "count": 5,
  "results": [
    { "slug": "parki-beach", "name": "Parki Beach", "category": "Beach",
      "score": 0.5527, "distanceKm": 5.2 }
  ]
}
```

Things worth trying, to watch the validation work:

| Input                              | What happens                               |
| ---------------------------------- | ------------------------------------------ |
| `limit` = `0` or `11`              | `422` — outside the allowed 1–10            |
| `slug` = `not-a-place`             | `404` with an explanatory `detail`          |
| `slug` = `kaptai-lake`             | lakes and parks instead of beaches          |
| same request twice                 | byte-identical response (it's deterministic) |

You can also call it without a browser:

```bash
curl http://localhost:8000/health
curl "http://localhost:8000/attractions/patenga-beach/similar?limit=3"
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
