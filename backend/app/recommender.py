"""Content-based similar-places recommender.

"Content-based" means recommendations come from what each place *is* — its
description, category and address — not from what visitors did. That matters
here: there is no visitor history to learn from, and a system that needs traffic
before it works is useless on day one (the "cold start" problem).

The whole model is built once at startup and every request is then a lookup into
a precomputed table. See `Recommender.__init__` for why.
"""

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app import config
from app.models import Attraction, SimilarPlace

# Digits in the serialised score. Ranking uses full precision; this only makes
# responses readable and stable to eyeball.
_SCORE_DECIMALS = 4
_DISTANCE_DECIMALS = 1


class UnknownSlugError(LookupError):
    """Raised when a slug is not in the dataset. The API turns this into a 404."""


def build_text(attraction: Attraction) -> str:
    """The single string that represents one place to the vectoriser.

    Description, address, and the category repeated `CATEGORY_REPEAT` times.
    TF-IDF counts how often terms occur, so repeating the category is how we say
    "this field matters more than one word of prose": it keeps two beaches close
    together even when their descriptions share little vocabulary.

    The address is included because it carries real signal in this dataset —
    "Bandarban", "Cox's Bazar", "Khagrachhari" group places that genuinely belong
    on the same trip.
    """
    parts = [attraction.description, attraction.address]
    parts.extend([attraction.category] * config.CATEGORY_REPEAT)
    return " ".join(parts)


def haversine_km(latitudes: np.ndarray, longitudes: np.ndarray) -> np.ndarray:
    """Great-circle distance in km between every pair of points.

    Returns an (n, n) matrix. Haversine treats the earth as a sphere, which is
    accurate to a fraction of a percent at these distances — far better than the
    data's own precision, and much cheaper than a true ellipsoidal formula.

    Written with whole-array numpy operations rather than a Python loop over
    pairs: the same arithmetic, but executed in compiled code.
    """
    lat = np.radians(latitudes)[:, np.newaxis]
    lon = np.radians(longitudes)[:, np.newaxis]

    delta_lat = lat - lat.T
    delta_lon = lon - lon.T

    a = (
        np.sin(delta_lat / 2.0) ** 2
        + np.cos(lat) * np.cos(lat.T) * np.sin(delta_lon / 2.0) ** 2
    )
    # Clip guards against a hair over 1.0 from floating-point error, which would
    # make arcsin return NaN.
    return 2.0 * config.EARTH_RADIUS_KM * np.arcsin(np.sqrt(np.clip(a, 0.0, 1.0)))


def proximity_score(distance_km: np.ndarray) -> np.ndarray:
    """Distance turned into a 0-1 "nearness" score.

    Half-life decay: 0 km scores 1.0, PROXIMITY_HALF_LIFE_KM scores 0.5, and it
    approaches 0 from there without ever going negative. A half-life curve is used
    rather than something like `1 - d/max_d` because the useful difference between
    5 km and 25 km is much larger than between 205 km and 225 km — once a place is
    far away, exactly how far stops mattering.
    """
    return 0.5 ** (distance_km / config.PROXIMITY_HALF_LIFE_KM)


class Recommender:
    """Precomputed similarity over a fixed set of attractions.

    Built once per process in the app's lifespan handler. Treat as read-only
    after construction.
    """

    def __init__(self, attractions: list[Attraction]) -> None:
        self._attractions = list(attractions)
        self._row_of = {a.slug: i for i, a in enumerate(self._attractions)}

        # --- Text similarity -------------------------------------------------
        # TfidfVectorizer turns the texts into vectors. "TF-IDF" weighs a term by
        # how often it occurs in this place (term frequency) against how rare it
        # is across all places (inverse document frequency) — so "beach" is
        # informative while "the" and "a" are not. English stop words are dropped
        # for the same reason.
        vectorizer = TfidfVectorizer(stop_words="english")
        matrix = vectorizer.fit_transform([build_text(a) for a in self._attractions])

        # Cosine similarity compares the *direction* of two vectors, ignoring
        # their length, so a long description does not score as more similar to
        # everything simply by having more words.
        text_similarity = cosine_similarity(matrix)

        # --- Distance --------------------------------------------------------
        self._distance_km = haversine_km(
            np.array([a.latitude for a in self._attractions]),
            np.array([a.longitude for a in self._attractions]),
        )

        # --- Final score -----------------------------------------------------
        # Both inputs are 0-1 and the weights sum to 1, so the result is 0-1 too.
        # Clipped because floating-point error can put cosine similarity a hair
        # outside the range, which the response model would then reject.
        self._score = np.clip(
            config.TEXT_WEIGHT * text_similarity
            + config.PROXIMITY_WEIGHT * proximity_score(self._distance_km),
            0.0,
            1.0,
        )

        # The whole (n, n) table is computed here, once, because it is the same
        # for every request: ~90x90 floats is trivial to hold in memory, and it
        # turns each request into a row lookup and a partial sort instead of
        # re-vectorising the corpus.

    def __len__(self) -> int:
        return len(self._attractions)

    def attraction(self, slug: str) -> Attraction:
        """The place with this slug, or raise UnknownSlugError."""
        try:
            return self._attractions[self._row_of[slug]]
        except KeyError as exc:
            raise UnknownSlugError(slug) from exc

    def similar(self, slug: str, limit: int) -> list[SimilarPlace]:
        """The `limit` places most similar to `slug`, best first.

        Never includes `slug` itself.
        """
        row = self._row_of.get(slug)
        if row is None:
            raise UnknownSlugError(slug)

        scores = self._score[row]

        # Rank by descending score. Sorting the negated scores with a *stable*
        # sort makes the result fully deterministic: equal scores always come back
        # in dataset order, so the same request cannot return two different
        # orderings between processes.
        order = np.argsort(-scores, kind="stable")

        results: list[SimilarPlace] = []
        for other in order:
            # A place is not its own recommendation. Skipping by index is exact,
            # unlike filtering on score, where a near-duplicate could tie with it.
            if other == row:
                continue

            candidate = self._attractions[other]
            results.append(
                SimilarPlace(
                    slug=candidate.slug,
                    name=candidate.name,
                    category=candidate.category,
                    score=round(float(scores[other]), _SCORE_DECIMALS),
                    distance_km=round(
                        float(self._distance_km[row, other]), _DISTANCE_DECIMALS
                    ),
                )
            )
            if len(results) == limit:
                break

        return results
