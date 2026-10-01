"""Loading the exported attraction data from disk."""

from pathlib import Path

from pydantic import TypeAdapter

from app.models import Attraction

# A TypeAdapter is Pydantic's way to validate a type that is not itself a model
# — here "a list of Attraction". Built once at import time because compiling the
# validator is the expensive part; validating with it is fast.
_ATTRACTION_LIST = TypeAdapter(list[Attraction])


def load_attractions(path: Path) -> list[Attraction]:
    """Read and validate the exported attractions.

    Raises FileNotFoundError if the export is missing and pydantic's
    ValidationError if any record is malformed. Both are deliberately fatal: the
    API has nothing useful to serve without this data, so it should fail to start
    rather than come up and return empty results.
    """
    try:
        raw = path.read_bytes()
    except FileNotFoundError as exc:
        raise FileNotFoundError(
            f"Attraction data not found at {path}. "
            "Run `npm run export:attractions` in ctgmap/ to generate it."
        ) from exc

    attractions = _ATTRACTION_LIST.validate_json(raw)

    if not attractions:
        raise ValueError(f"{path} contains no attractions.")

    duplicates = _find_duplicate_slugs(attractions)
    if duplicates:
        raise ValueError(f"{path} has duplicate slugs: {', '.join(duplicates)}")

    return attractions


def _find_duplicate_slugs(attractions: list[Attraction]) -> list[str]:
    """Slugs appearing more than once, sorted.

    Slugs are the API's identifiers, so a duplicate would make one of the two
    places unreachable. The frontend's own test suite already enforces
    uniqueness; this is the backend refusing to trust its input anyway.
    """
    seen: set[str] = set()
    duplicates: set[str] = set()
    for attraction in attractions:
        if attraction.slug in seen:
            duplicates.add(attraction.slug)
        seen.add(attraction.slug)
    return sorted(duplicates)
