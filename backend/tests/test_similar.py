"""GET /attractions/{slug}/similar."""

from typing import Any

import pytest
from fastapi.testclient import TestClient

from app import config
from app.data import load_attractions

# Loaded at import time so it can drive @parametrize, which pytest evaluates
# during collection — before fixtures exist.
ATTRACTIONS = load_attractions(config.DATA_PATH)
ALL_SLUGS = [a.slug for a in ATTRACTIONS]
BEACH_SLUGS = [a.slug for a in ATTRACTIONS if a.category == "Beach"]
CATEGORY_OF = {a.slug: a.category for a in ATTRACTIONS}

EXPECTED_RESULT_KEYS = {"slug", "name", "category", "score", "distanceKm"}


def fetch_similar(client: TestClient, slug: str, **params: Any) -> dict[str, Any]:
    """GET the endpoint and assert it succeeded, returning the parsed body."""
    response = client.get(f"/attractions/{slug}/similar", params=params)
    assert response.status_code == 200, response.text
    return response.json()


# --- The envelope -----------------------------------------------------------


def test_echoes_the_place_that_was_asked_about(client: TestClient) -> None:
    body = fetch_similar(client, "patenga-beach")

    assert body["slug"] == "patenga-beach"
    assert body["name"] == "Patenga Beach"
    assert body["count"] == len(body["results"])


def test_results_have_exactly_the_documented_fields(client: TestClient) -> None:
    """Including `distanceKm` in camelCase — the frontend depends on that name."""
    for result in fetch_similar(client, "patenga-beach")["results"]:
        assert set(result) == EXPECTED_RESULT_KEYS
        assert 0.0 <= result["score"] <= 1.0
        assert result["distanceKm"] >= 0.0


# --- limit ------------------------------------------------------------------


def test_limit_defaults_to_the_configured_value(client: TestClient) -> None:
    body = fetch_similar(client, "patenga-beach")

    assert len(body["results"]) == config.DEFAULT_LIMIT


@pytest.mark.parametrize("limit", range(config.MIN_LIMIT, config.MAX_LIMIT + 1))
def test_limit_is_respected(client: TestClient, limit: int) -> None:
    body = fetch_similar(client, "patenga-beach", limit=limit)

    assert len(body["results"]) == limit


@pytest.mark.parametrize(
    "limit",
    [
        config.MIN_LIMIT - 1,  # 0
        config.MAX_LIMIT + 1,  # 11
        -1,
        1000,
        "abc",  # not an integer at all
        1.5,
    ],
)
def test_out_of_range_limit_is_rejected(client: TestClient, limit: Any) -> None:
    """422, not a clamped result.

    Silently clamping would hide a caller's bug; FastAPI derives this from the
    ge/le constraints on the query parameter, so there is no hand-written
    validation to get wrong.
    """
    response = client.get("/attractions/patenga-beach/similar", params={"limit": limit})

    assert response.status_code == 422


# --- Self-exclusion ---------------------------------------------------------


@pytest.mark.parametrize("slug", ALL_SLUGS)
def test_never_recommends_the_place_itself(client: TestClient, slug: str) -> None:
    """Checked for every place, not a sample.

    A place is trivially its own best match, so this is the one bug the endpoint
    is most likely to have — and it would look plausible in the UI.
    """
    body = fetch_similar(client, slug, limit=config.MAX_LIMIT)

    assert slug not in [result["slug"] for result in body["results"]]


def test_results_are_distinct_and_real_places(client: TestClient) -> None:
    results = fetch_similar(client, "patenga-beach", limit=config.MAX_LIMIT)["results"]
    slugs = [result["slug"] for result in results]

    assert len(set(slugs)) == len(slugs)
    assert set(slugs) <= set(ALL_SLUGS)


# --- Unknown slug -----------------------------------------------------------


@pytest.mark.parametrize("slug", ["not-a-place", "PATENGA-BEACH", "patenga_beach", "x"])
def test_unknown_slug_returns_404(client: TestClient, slug: str) -> None:
    response = client.get(f"/attractions/{slug}/similar")

    assert response.status_code == 404
    assert slug in response.json()["detail"]


# --- Ordering and determinism ----------------------------------------------


def test_results_are_ordered_by_descending_score(client: TestClient) -> None:
    scores = [
        result["score"]
        for result in fetch_similar(client, "patenga-beach", limit=config.MAX_LIMIT)[
            "results"
        ]
    ]

    assert scores == sorted(scores, reverse=True)


@pytest.mark.parametrize("slug", ["patenga-beach", "kaptai-lake", "coxs-bazar-beach"])
def test_repeated_requests_return_identical_responses(
    client: TestClient, slug: str
) -> None:
    """No randomness, and no dependence on request order.

    Worth pinning explicitly: ties are broken by a stable sort over dataset order,
    and if that ever regressed to an unstable sort the output would still *look*
    correct while varying between runs.
    """
    first = fetch_similar(client, slug, limit=config.MAX_LIMIT)
    second = fetch_similar(client, slug, limit=config.MAX_LIMIT)

    assert first == second


def test_a_shorter_limit_is_a_prefix_of_a_longer_one(client: TestClient) -> None:
    """Ranking is consistent: asking for 3 gives the first 3 of asking for 10."""
    three = fetch_similar(client, "patenga-beach", limit=3)["results"]
    ten = fetch_similar(client, "patenga-beach", limit=10)["results"]

    assert three == ten[:3]


# --- Sanity: are the recommendations actually any good? --------------------


@pytest.mark.parametrize("slug", BEACH_SLUGS)
def test_a_beach_is_mostly_recommended_other_beaches(
    client: TestClient, slug: str
) -> None:
    """The end-to-end quality check.

    Everything else here verifies the API's contract; this verifies the model is
    not nonsense. Two of five is a deliberately loose floor — the dataset has only
    10 beaches among 90 places, and a bar set at the current output (4-5 of 5)
    would fail on any reasonable reweighting rather than on a real regression.
    """
    results = fetch_similar(client, slug, limit=5)["results"]
    beaches = [r for r in results if r["category"] == "Beach"]
    got = [(r["name"], r["category"]) for r in results]

    assert len(beaches) >= 2, f"{slug} -> {got}"


def test_the_top_match_is_usually_the_same_category(client: TestClient) -> None:
    """Across the whole dataset, the best match should usually share the category.

    Asserted in aggregate rather than per place: a handful of places legitimately
    resemble another category more than their own (a hilltop temple is genuinely
    close to both), so a per-place assertion would encode noise.
    """
    same_category = sum(
        fetch_similar(client, slug, limit=1)["results"][0]["category"]
        == CATEGORY_OF[slug]
        for slug in ALL_SLUGS
    )

    assert same_category / len(ALL_SLUGS) >= 0.6


def test_nearby_wins_between_comparable_places(client: TestClient) -> None:
    """The proximity weight is doing something observable.

    Parki Beach (~5 km from Patenga) should outrank Kattali Sea Beach (~14 km):
    their descriptions are near-equally beach-like, so distance is what separates
    them. If the proximity weight were dropped to zero this would flip.
    """
    slugs = [
        result["slug"]
        for result in fetch_similar(client, "patenga-beach", limit=config.MAX_LIMIT)[
            "results"
        ]
    ]

    assert slugs.index("parki-beach") < slugs.index("kattali-sea-beach")
