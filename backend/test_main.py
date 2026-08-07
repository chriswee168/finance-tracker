from fastapi.testclient import TestClient
from main import app

testclient = TestClient(app)

# Test root endpoint to get api status.
def test_get_api_status():
    response = testclient.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "Backend API online."}

# Test adding valid and invalid transactions.
def test_add_transaction():
    response = testclient.post(
        "/transaction-entries", 
        json={
            "datetime": "01 Mar 2026, 12:00 pm",
            "type": "income",
            "desc": "Test description.",
            "amount_cents": 100
        }
    )
    
    assert response.status_code == 201