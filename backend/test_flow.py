"""
Test complete flow: Login -> Search Patients
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def main():
    print("=== Test Flow ===\n")
    
    # 1. Login
    print("1. Login...")
    resp = requests.post(f"{BASE_URL}/auth/login", 
        json={"email": "admin@dentalwhite.com", "password": "admin123"})
    
    if resp.status_code != 200:
        print(f"   ERROR Login: {resp.status_code} - {resp.text}")
        return
    
    data = resp.json()
    token = data["access_token"]
    user_role = data["user"]["role"]
    print(f"   SUCCESS! User role: {user_role}")
    print(f"   Token: {token[:50]}...")
    
    # Save token to localStorage simulation
    print(f"\n2. Simulating localStorage.setItem('dental_white_token', token)")
    # In real frontend: localStorage.setItem('dental_white_token', token)
    
    # 3. Search patients with correct Authorization header
    print(f"\n3. Search patients with Bearer token...")
    headers = {"Authorization": f"Bearer {token}"}
    search_resp = requests.get(f"{BASE_URL}/patients/search/?q=emilio", headers=headers)
    print(f"   Status: {search_resp.status_code}")
    
    if search_resp.status_code == 200:
        patients = search_resp.json()
        print(f"   SUCCESS! Found {len(patients)} patients:")
        for p in patients:
            print(f"     - {p.get('usuario_nombre')} (Exp: {p.get('numero_expediente')})")
    elif search_resp.status_code == 401:
        print(f"   401 ERROR: {search_resp.json()}")
    else:
        print(f"   ERROR: {search_resp.text}")
    
    # 4. Try WITHOUT Bearer (should fail)
    print(f"\n4. Try WITHOUT Authorization header (should fail)...")
    resp_no_auth = requests.get(f"{BASE_URL}/patients/search/?q=emilio")
    print(f"   Status: {resp_no_auth.status_code}")
    
    # 5. Check what's actually sent
    print(f"\n5. Checking request headers...")
    print(f"   Token starts with: {token[:30]}...")
    print(f"   Bearer format: Bearer {token[:30]}...")

if __name__ == "__main__":
    main()