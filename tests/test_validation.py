import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def load_mock_data():
    with open("app/mock/users.json") as f:
        return json.load(f)

def test_invalid_users():
    data = load_mock_data()

    for user in data:
        response = client.post("/validate-user", json=user)

        # conditions for invalid input
        if (
            user["name"] == ""
            or len(user["name"]) < 2
            or len(user["name"]) > 50
            or "@" not in user["email"]
            or user["age"] < 0
            or user["age"] > 120
        ):
            assert response.status_code == 400

            body = response.json()

            assert "errors" in body
            assert isinstance(body["errors"], list)