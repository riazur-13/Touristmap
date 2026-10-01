"""The FastAPI application.

Run it with:  uvicorn app.main:app --reload
Then open:    http://localhost:8000/docs
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Path, Query, Request

from app import config
from app.data import load_attractions
from app.models import HealthResponse, SimilarResponse
from app.recommender import Recommender, UnknownSlugError


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup and shutdown work, done once per process.

    Everything before `yield` runs before the server accepts traffic; everything
    after runs on shutdown. Both the data load and the similarity build happen
    here rather than inside the request handler, so they cost nothing per request
    — and a bad export stops the server from starting at all.

    The results hang off `app.state`, which is FastAPI's place for
    per-application singletons.
    """
    attractions = load_attractions(config.DATA_PATH)
    app.state.attractions = attractions
    app.state.recommender = Recommender(attractions)
    yield
    app.state.attractions = None
    app.state.recommender = None


app = FastAPI(
    title="Chittagong Explorer API",
    description=(
        "Content-based similar-places recommendations for the Chittagong Explorer map."
    ),
    version="0.1.0",
    lifespan=lifespan,
)


def get_recommender(request: Request) -> Recommender:
    """Hands the request's app-level Recommender to a route.

    Routes take this via `Depends` instead of reaching for the module-level `app`
    object. That keeps handlers testable in isolation (the dependency can be
    overridden) and makes what each one needs explicit in its signature.
    """
    return request.app.state.recommender


RecommenderDep = Annotated[Recommender, Depends(get_recommender)]


@app.get("/health", response_model=HealthResponse, tags=["meta"])
def health(recommender: RecommenderDep) -> HealthResponse:
    """Liveness check that also proves the data loaded.

    A health check that only returned `{"status": "ok"}` would pass even if the
    dataset were empty, so it reports the number of attractions it is serving.
    """
    return HealthResponse(status="ok", attractions=len(recommender))


@app.get(
    "/attractions/{slug}/similar",
    response_model=SimilarResponse,
    tags=["attractions"],
    summary="Places similar to this one",
    responses={404: {"description": "No attraction with that slug"}},
)
def similar_attractions(
    recommender: RecommenderDep,
    slug: Annotated[
        str,
        Path(
            description="Slug of the place to find matches for, e.g. `patenga-beach`."
        ),
    ],
    limit: Annotated[
        int,
        Query(
            ge=config.MIN_LIMIT,
            le=config.MAX_LIMIT,
            description="How many suggestions to return.",
        ),
    ] = config.DEFAULT_LIMIT,
) -> SimilarResponse:
    """Rank every other place against this one and return the best `limit`.

    Scoring blends text similarity with proximity — see `app/recommender.py`.
    `limit` is bounded by FastAPI from the `ge`/`le` constraints above, so an
    out-of-range value is rejected with a 422 before this function runs.
    """
    try:
        place = recommender.attraction(slug)
        results = recommender.similar(slug, limit)
    except UnknownSlugError:
        # Converted here rather than inside the recommender: the recommender has
        # no business knowing about HTTP status codes.
        raise HTTPException(
            status_code=404, detail=f"No attraction with slug {slug!r}."
        ) from None

    return SimilarResponse(
        slug=place.slug,
        name=place.name,
        count=len(results),
        results=results,
    )
