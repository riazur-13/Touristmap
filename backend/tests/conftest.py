"""Shared test fixtures.

pytest discovers this file automatically; tests just name a fixture as an
argument and pytest supplies it.
"""

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app import config
from app.data import load_attractions
from app.main import app
from app.models import Attraction


@pytest.fixture(scope="session")
def attractions() -> list[Attraction]:
    """The dataset the API is serving, for cross-checking responses against."""
    return load_attractions(config.DATA_PATH)


@pytest.fixture(scope="session")
def client() -> Iterator[TestClient]:
    """An HTTP client wired to the app, with startup/shutdown actually run.

    Using TestClient as a context manager is what triggers the lifespan handler,
    so these tests exercise the same data load and similarity build that
    production does — rather than a half-initialised app.

    Session-scoped so the similarity matrix is built once for the whole suite
    instead of per test.
    """
    with TestClient(app) as test_client:
        yield test_client
