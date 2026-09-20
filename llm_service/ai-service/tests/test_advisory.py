from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "ai-service"}

@patch("app.api.bedrock.client.BedrockClient.invoke")
def test_valid_advisory_request(mock_invoke):
    mock_invoke.return_value = {
        "status": "SUCCESS",
        "summary": "Dairy business is viable with steady cash flow.",
        "confidence": {"overall": "VERIFIED", "financial": "VERIFIED", "market": "VERIFIED"}
    }

    payload = {
        "businessInfo": {
            "businessType": "Dairy Farming",
            "location": "Rajpura",
            "district": "Patiala",
            "state": "Punjab",
            "language": "en"
        },
        "financialInfo": {
            "capital": 50000.0,
            "projectCost": 200000.0,
            "loanAmount": 150000.0,
            "interestRate": 8.5,
            "tenure": 36,
            "emi": 4732.0,
            "monthlyRevenue": 45000.0,
            "monthlyExpenses": 20000.0,
            "monthlyProfit": 25000.0,
            "riskLevel": "LOW"
        }
    }

    response = client.post("/v1/advisory", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "Dairy business" in data["summary"]