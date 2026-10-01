"""Every tunable value in one place.

Keeping these here rather than inline means the behaviour of the recommender can
be reviewed and changed without reading the algorithm, and the tests can import
the same constants instead of hardcoding numbers that then drift.
"""

import os
from pathlib import Path

# app/data/attractions.json, written by `npm run export:attractions` in ctgmap/.
# Resolved relative to this file so the server starts from any directory.
DATA_PATH = Path(__file__).resolve().parent / "data" / "attractions.json"

# --- CORS ------------------------------------------------------------------
# Browsers block a page on origin A from reading a response from origin B unless
# B says otherwise, so the API has to name the frontends allowed to call it.
# Vite's dev server is the default; deployments set ALLOWED_ORIGINS instead.
DEFAULT_ALLOWED_ORIGINS = ("http://localhost:5173",)


def allowed_origins() -> list[str]:
    """Origins permitted to call this API, from `ALLOWED_ORIGINS`.

    Comma-separated, e.g. `https://ctgmap.example,http://localhost:5173`.

    Read through a function rather than at import time so tests can set the
    variable and see the effect without reimporting the module.

    Deliberately has no "*" escape hatch: a wildcard would let any site on the
    internet call this API from a visitor's browser. The data here is public, so
    the stakes are low today — but wildcards tend to outlive the reasoning behind
    them, so the list is always explicit.
    """
    configured = [
        origin.strip()
        for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
        if origin.strip()
    ]
    return configured or list(DEFAULT_ALLOWED_ORIGINS)


# --- /attractions/{slug}/similar -------------------------------------------

DEFAULT_LIMIT = 5
MIN_LIMIT = 1
MAX_LIMIT = 10

# --- Scoring ---------------------------------------------------------------
# final = TEXT_WEIGHT * text similarity + PROXIMITY_WEIGHT * proximity
#
# Text similarity is the signal we actually trust: it is derived from what each
# place *is* (its description and category). Distance is a tie-breaker — given
# two equally beach-like beaches, the nearer one is the more useful suggestion
# because a visitor can combine it into one trip. 0.2 is deliberately small: at
# that weight proximity can reorder near-ties but cannot pull an unrelated
# neighbour above a genuinely similar place far away. The two must sum to 1.0 so
# the final score stays inside 0-1 and remains readable as a percentage.
TEXT_WEIGHT = 0.8
PROXIMITY_WEIGHT = 0.2

# Proximity decays with distance on a half-life curve: 0 km scores 1.0,
# PROXIMITY_HALF_LIFE_KM scores 0.5, and it tends to 0 from there. 50 km is
# about the distance at which two places stop being a plausible single day trip
# in this region, which is the judgement the score is standing in for.
PROXIMITY_HALF_LIFE_KM = 50.0

# The category is appended to each place's text this many times. TF-IDF counts
# terms, so repeating the category makes "Beach" weigh as much as several
# description words and keeps same-category places clustered even when their
# prose has little vocabulary in common.
CATEGORY_REPEAT = 3

EARTH_RADIUS_KM = 6371.0
