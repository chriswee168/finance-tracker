from fastapi.testclient import TestClient
from main import app
from utils.create_tables import create_tables

testclient = TestClient(app)

# Test root endpoint to get api status.
def test_get_api_status():
    response = testclient.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "Backend API online."}

# Test adding valid and invalid transactions.
def test_add_transaction():

    # Create the SQL database if it doesn't exist.
    create_tables()

    # Test valid entry.
    response = testclient.post(
        "/transaction-entries", 
        json={
            "type": "income",
            "desc": "Test description.",
            "amount_cents": 100
        }
    )
    assert response.status_code == 201 # Created.

    # Test invalid entry.
    response = testclient.post(
        "/transaction-entries", 
        json={
            "type": "none",
            "desc": "Test description.",
            "amount_cents": -25
        }
    )
    assert response.status_code == 422 # Unprocessable entity.

# Test getting transactions.
def test_get_transactions():
    n_entries = 1
    response = testclient.get(f"/transaction-entries?n_entries={n_entries}")

    # Return list of transaction objects/dictionaries.
    assert isinstance(response.json(), list)
    assert len(response.json()) == n_entries

# Test adding cash amounts to amount_history_table.
def test_add_cash_amounts():
    response = testclient.post(
        f"/cash-amounts", 
        json={"net_income_cents": 100, "current_balance_cents": 1000000}
    )
    assert response.status_code == 204 # No content.