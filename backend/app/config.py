"""Every tunable value in one place.

Keeping these here rather than inline means the behaviour of the recommender can
be reviewed and changed without reading the algorithm, and the tests can import
the same constants instead of hardcoding numbers that then drift.
"""

from pathlib import Path

# app/data/attractions.json, written by `npm run export:attractions` in ctgmap/.
# Resolved relative to this file so the server starts from any directory.
DATA_PATH = Path(__file__).resolve().parent / "data" / "attractions.json"

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
