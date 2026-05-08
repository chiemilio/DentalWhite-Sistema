"""
Comprehensive test to verify the exact flow
"""
import requests

BASE_URL = "http://localhost:8000/api/v1"

def test_all():
    print("=== COMPREHENSIVE TEST ===\n")
    
    # Test 1: Login with /auth/login (no trailing slash)
    print("TEST 1: POST /auth/login")
    r1 = requests.post(f"{BASE_URL}/auth/login", 
        json={"email": "admin@dentalwhite.com", "password": "admin123"})
    print(f"  Status: {r1.status_code}")
    if r1.status_code != 200:
        print(f"  ERROR: {r1.text}")
        return
    
    token = r1.json()["access_token"]
    print(f"  Token received: {token[:30]}...\n")
    
    # Test 2: Login with /auth/login/ (with trailing slash)
    print("TEST 2: POST /auth/login/")
    r2 = requests.post(f"{BASE_URL}/auth/login/", 
        json={"email": "admin@dentalwhite.com", "password": "admin123"})
    print(f"  Status: {r2.status_code}")
    if r2.status_code == 200:
        print(f"  Token: {r2.json()['access_token'][:30]}...\n")
    
    # Test 3: GET /patients/search/?q=emilio with Bearer token
    print("TEST 3: GET /patients/search/?q=emilio")
    r3 = requests.get(f"{BASE_URL}/patients/search/?q=emilio",
        headers={"Authorization": f"Bearer {token}"})
    print(f"  Status: {r3.status_code}")
    if r3.status_code == 200:
        data = r3.json()
        print(f"  SUCCESS: {len(data)} patients found:")
        for p in data:
            print(f"    - {p['usuario_nombre']} ({p['numero_expediente']})")
    else:
        print(f"  ERROR: {r3.text}\n")
    
    # Test 4: GET /patients/search/?q=emilio WITHOUT token
    print("TEST 4: GET /patients/search/?q=emilio (NO TOKEN)")
    r4 = requests.get(f"{BASE_URL}/patients/search/?q=emilio")
    print(f"  Status: {r4.status_code}")
    
    # Test 5: GET /patients/search?q=emilio (NO trailing slash)
    print("TEST 5: GET /patients/search?q=emilio")
    r5 = requests.get(f"{BASE_URL}/patients/search?q=emilio",
        headers={"Authorization": f"Bearer {token}"})
    print(f"  Status: {r5.status_code}")
    if r5.status_code == 200:
        print(f"  SUCCESS: {len(r5.json())} patients\n")
    
    # Test 6: Verify token is valid JWT
    import json
    print("TEST 6: JWT Token payload")
    try:
        payload_b64 = token.split('.')[1]
        # Add padding if needed
        padding = 4 - len(payload_b64) % 4
        if padding != 4:
            payload_b64 += '=' * padding
        import base64
        decoded = json.loads(base64.b64decode(payload_b64))
        print(f"  Payload: {decoded}")
    except Exception as e:
        print(f"  ERROR decoding: {e}\n")

if __name__ == "__main__":
    test_all()