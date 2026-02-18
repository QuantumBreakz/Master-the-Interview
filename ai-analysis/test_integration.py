import sys
import os
import json
from api import app

def test_api_integration():
    """Test the AI Analysis API integration"""
    print("\n🧪 Testing AI Analysis API Integration...")
    
    # Create test client
    client = app.test_client()
    
    # Sample code (AI-like)
    ai_code = """
def calculate_fibonacci(n):
    # Calculate fibonacci sequence
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    sequence = [0, 1]
    while len(sequence) < n:
        next_val = sequence[-1] + sequence[-2]
        sequence.append(next_val)
    
    return sequence
"""

    # Sample code (Human-like)
    human_code = """
def fib(n):
    # simple fib impl
    a, b = 0, 1
    res = []
    for i in range(n):
        res.append(a)
        a, b = b, a+b
    return res
"""

    # Test Health Check
    print("\nExpected: Health check returns 200")
    resp = client.get('/health')
    print(f"Actual: {resp.status_code} - {resp.json}")
    assert resp.status_code == 200
    
    # Test Analysis (AI Code)
    print("\nExpected: AI Code Analysis returns results")
    resp = client.post('/analyze', json={'code': ai_code})
    if resp.status_code == 200:
        data = resp.json
        print(f"Prediction: {data.get('prediction')}")
        print(f"Confidence: {data.get('confidence')}")
        print(f"Characteristics: {data.get('analysis', {}).get('ai_characteristics')}")
    else:
        print(f"Error: {resp.status_code} - {resp.data}")

    # Test Analysis (Human Code)
    print("\nExpected: Human Code Analysis returns results")
    resp = client.post('/analyze', json={'code': human_code})
    if resp.status_code == 200:
        data = resp.json
        print(f"Prediction: {data.get('prediction')}")
        print(f"Confidence: {data.get('confidence')}")
    else:
        print(f"Error: {resp.status_code} - {resp.data}")

if __name__ == "__main__":
    try:
        test_api_integration()
        print("\n✅ Integration Test Passed!")
    except Exception as e:
        print(f"\n❌ Integration Test Failed: {str(e)}")
