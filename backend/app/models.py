"""Pydantic models: the shape of the data coming in and the JSON going out.

Pydantic v2 does two jobs here. At startup it validates the exported JSON, so a
bad export fails loudly on boot instead of producing odd recommendations later.
At request time FastAPI uses these models to serialise responses and to generate
the OpenAPI schema that powers /docs.
"""

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

# Bounds-checked so a typo in the data (a swapped lat/lon, a dropped minus sign)
# is rejected at load time rather than silently producing nonsense distances.
Latitude = Annotated[float, Field(ge=-90.0, le=90.0)]
Longitude = Annotated[float, Field(ge=-180.0, le=180.0)]


class Attraction(BaseModel):
    """One place, exactly as exported from the frontend's attractions.js."""

    # Reference data: frozen so nothing can mutate the shared in-memory copy
    # that every request reads.
    model_config = ConfigDict(frozen=True, extra="forbid")

    slug: str = Field(min_length=1)
    name: str = Field(min_length=1)
    category: str = Field(min_length=1)
    description: str = Field(min_length=1)
    address: str = Field(min_length=1)
    # [latitude, longitude] — the order Leaflet uses on the frontend.
    coordinates: tuple[Latitude, Longitude]

    @property
    def latitude(self) -> float:
        return self.coordinates[0]

    @property
    def longitude(self) -> float:
        return self.coordinates[1]


class HealthResponse(BaseModel):
    """GET /health — is the server up, and did it load the data?"""

    status: str
    attractions: int


class SimilarPlace(BaseModel):
    """One recommendation in a GET /attractions/{slug}/similar response."""

    slug: str
    name: str
    category: str
    # 0-1, where 1 would be an identical place. Comparable only within one
    # response: it ranks results, it is not an absolute measure of similarity.
    score: float = Field(ge=0.0, le=1.0)
    # Straight-line distance from the place being asked about. Serialised as
    # `distanceKm` because the frontend that consumes it is camelCase.
    distance_km: float = Field(ge=0.0, serialization_alias="distanceKm")


class SimilarResponse(BaseModel):
    """GET /attractions/{slug}/similar.

    The results are wrapped in an object rather than returned as a bare array:
    it echoes back which place was asked about (useful when debugging, and when a
    response arrives out of order on the client) and leaves room to add fields
    later without breaking existing callers.
    """

    slug: str
    name: str
    count: int
    results: list[SimilarPlace]
