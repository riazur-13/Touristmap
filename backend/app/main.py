"""The FastAPI application.

Run it with:  uvicorn app.main:app --reload
Then open:    http://localhost:8000/docs
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app import config
from app.data import load_attractions
from app.models import HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup and shutdown work, done once per process.

    Everything before `yield` runs before the server accepts traffic; everything
    after runs on shutdown. Loading the data here rather than inside the request
    handler means the file is read and validated exactly once, not on every
    request — and a bad export stops the server from starting at all.

    The loaded data hangs off `app.state`, which is FastAPI's place for
    per-application singletons.
    """
    app.state.attractions = load_attractions(config.DATA_PATH)
    yield
    app.state.attractions = None


app = FastAPI(
    title="Chittagong Explorer API",
    description=(
        "Content-based similar-places recommendations for the Chittagong Explorer map."
    ),
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/health", response_model=HealthResponse, tags=["meta"])
def health() -> HealthResponse:
    """Liveness check that also proves the data loaded.

    A health check that only returned `{"status": "ok"}` would pass even if the
    dataset were empty, so it reports the number of attractions it is serving.
    """
    return HealthResponse(status="ok", attractions=len(app.state.attractions))
