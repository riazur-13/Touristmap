"""CORS configuration.

Worth testing because a CORS mistake is invisible from the server's side — the
request succeeds and returns 200, and only the browser refuses to hand the
response to the page. Nothing in the logs looks wrong.
"""

import pytest
from fastapi.testclient import TestClient

from app import config

ALLOW_ORIGIN = "access-control-allow-origin"


# --- Parsing ALLOWED_ORIGINS ------------------------------------------------


def test_defaults_to_the_vite_dev_server(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("ALLOWED_ORIGINS", raising=False)

    assert config.allowed_origins() == ["http://localhost:5173"]


def test_blank_value_falls_back_to_the_default(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """An empty variable means "unset", not "allow nothing"."""
    monkeypatch.setenv("ALLOWED_ORIGINS", "   ")

    assert config.allowed_origins() == ["http://localhost:5173"]


def test_parses_a_comma_separated_list(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv(
        "ALLOWED_ORIGINS", "https://ctgmap.example,http://localhost:5173"
    )

    assert config.allowed_origins() == [
        "https://ctgmap.example",
        "http://localhost:5173",
    ]


def test_tolerates_whitespace_and_trailing_commas(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Hand-edited env vars pick these up; none should become a bogus origin."""
    monkeypatch.setenv("ALLOWED_ORIGINS", " https://a.example , https://b.example ,")

    assert config.allowed_origins() == ["https://a.example", "https://b.example"]


# --- The middleware ---------------------------------------------------------


def test_allowed_origin_may_read_the_response(client: TestClient) -> None:
    response = client.get(
        "/attractions/patenga-beach/similar",
        headers={"Origin": "http://localhost:5173"},
    )

    assert response.status_code == 200
    assert response.headers[ALLOW_ORIGIN] == "http://localhost:5173"


def test_unlisted_origin_gets_no_permission(client: TestClient) -> None:
    """The response still arrives; the header the browser needs does not."""
    response = client.get(
        "/attractions/patenga-beach/similar",
        headers={"Origin": "https://not-allowed.example"},
    )

    assert ALLOW_ORIGIN not in response.headers


def test_preflight_advertises_get(client: TestClient) -> None:
    """Allowing only GET: this API is read-only and has no sessions."""
    response = client.options(
        "/attractions/patenga-beach/similar",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert "GET" in response.headers["access-control-allow-methods"]
