"""GET /health."""

from fastapi.testclient import TestClient

from app.models import Attraction


def test_health_reports_ok(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_health_reports_the_number_of_loaded_attractions(
    client: TestClient, attractions: list[Attraction]
) -> None:
    """The count is the point of this endpoint.

    A check that only asserted `status == "ok"` would still pass with an empty
    dataset, which is the failure most worth catching on a deploy.
    """
    body = client.get("/health").json()

    assert body["attractions"] == len(attractions)
    assert body["attractions"] > 0
