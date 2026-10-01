"""Unit tests for the scoring pieces, below the HTTP layer.

These cover the arithmetic that the API tests can only observe indirectly.
"""

import numpy as np
import pytest

from app import config
from app.models import Attraction
from app.recommender import (
    Recommender,
    UnknownSlugError,
    build_text,
    haversine_km,
    proximity_score,
)

PLACE = Attraction(
    slug="test-beach",
    name="Test Beach",
    category="Beach",
    description="A sandy shore with sunsets.",
    address="Somewhere, Chittagong",
    coordinates=(22.0, 91.0),
)


# --- Configuration ----------------------------------------------------------


def test_scoring_weights_sum_to_one() -> None:
    """Keeps the final score inside 0-1, which the response model enforces."""
    total = config.TEXT_WEIGHT + config.PROXIMITY_WEIGHT

    assert total == pytest.approx(1.0)


# --- build_text -------------------------------------------------------------


def test_build_text_includes_description_and_address() -> None:
    text = build_text(PLACE)

    assert PLACE.description in text
    assert PLACE.address in text


def test_build_text_repeats_the_category() -> None:
    """The mechanism that makes category outweigh a single description word."""
    assert build_text(PLACE).count("Beach") == config.CATEGORY_REPEAT


# --- haversine_km -----------------------------------------------------------


def test_haversine_distance_to_self_is_zero() -> None:
    distances = haversine_km(np.array([22.0, 21.0]), np.array([91.0, 92.0]))

    assert distances[0, 0] == pytest.approx(0.0)
    assert distances[1, 1] == pytest.approx(0.0)


def test_haversine_is_symmetric() -> None:
    distances = haversine_km(np.array([22.0, 21.0]), np.array([91.0, 92.0]))

    assert distances[0, 1] == pytest.approx(distances[1, 0])


def test_haversine_matches_a_known_distance() -> None:
    """One degree of longitude at the equator is ~111.19 km."""
    distances = haversine_km(np.array([0.0, 0.0]), np.array([0.0, 1.0]))

    assert distances[0, 1] == pytest.approx(111.19, abs=0.05)


def test_haversine_matches_a_known_real_distance() -> None:
    """Dhaka to Chittagong is ~214 km great-circle.

    Note this is the straight-line distance, not the ~250 km by road — the whole
    point of `distanceKm` is that it makes no claim about routes.
    """
    distances = haversine_km(np.array([23.8103, 22.3569]), np.array([90.4125, 91.7832]))

    assert distances[0, 1] == pytest.approx(214.0, abs=3.0)


# --- proximity_score --------------------------------------------------------


def test_proximity_is_one_at_zero_distance() -> None:
    assert proximity_score(np.array([0.0]))[0] == pytest.approx(1.0)


def test_proximity_is_one_half_at_the_half_life() -> None:
    at_half_life = proximity_score(np.array([config.PROXIMITY_HALF_LIFE_KM]))[0]

    assert at_half_life == pytest.approx(0.5)


def test_proximity_decreases_with_distance_and_stays_in_range() -> None:
    scores = proximity_score(np.array([0.0, 10.0, 50.0, 200.0, 5000.0]))

    assert np.all(np.diff(scores) < 0)
    assert np.all((scores > 0.0) & (scores <= 1.0))


# --- Recommender ------------------------------------------------------------


def test_unknown_slug_raises(attractions: list[Attraction]) -> None:
    recommender = Recommender(attractions)

    with pytest.raises(UnknownSlugError):
        recommender.similar("not-a-place", 5)

    with pytest.raises(UnknownSlugError):
        recommender.attraction("not-a-place")


def test_rebuilding_gives_identical_results(attractions: list[Attraction]) -> None:
    """Determinism across instances, not just across calls on one instance.

    Nothing in the pipeline should depend on dict iteration order, hashing or a
    random seed; building twice and comparing is how that gets caught.
    """
    first = Recommender(attractions).similar("patenga-beach", config.MAX_LIMIT)
    second = Recommender(attractions).similar("patenga-beach", config.MAX_LIMIT)

    assert first == second


def test_limit_larger_than_the_dataset_returns_everything_else(
    attractions: list[Attraction],
) -> None:
    """No crash and no padding when asked for more than exists.

    Unreachable through the API (limit caps at 10), but the recommender is its own
    unit and shouldn't depend on the route to stay in range.
    """
    recommender = Recommender(attractions)

    results = recommender.similar("patenga-beach", len(attractions) + 50)

    assert len(results) == len(attractions) - 1
