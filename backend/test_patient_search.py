"""
Test: Search patients via API
"""
import requests

BASE_URL = "http://localhost:8000/api/v1"

def main():
    # 1. Login
    print("1. Logging in...")
    login_resp = requests.post(f"{BASE_URL}/auth/login/", 
        json={"email": "admin@dentalwhite.com", "password": "admin123"})
    
    if login_resp.status_code != 200:
        print(f"ERROR: {login_resp.status_code} - {login_resp.text}")
        return
    
    token = login_resp.json()["access_token"]
    print(f"   Token OK")
    
    # 2. Search patients
    print("\n2. Searching patients with 'emilio'...")
    headers = {"Authorization": f"Bearer {token}"}
    search_resp = requests.get(f"{BASE_URL}/patients/search/?q=emilio", headers=headers)
    
    print(f"   Status: {search_resp.status_code}")
    if search_resp.status_code == 200:
        patients = search_resp.json()
        print(f"   Found: {len(patients)} patients")
        for p in patients:
            print(f"     - {p.get('usuario_nombre')} (Exp: {p.get('numero_expediente')})")
    else:
        print(f"   ERROR: {search_resp.text}")

if __name__ == "__main__":
    main()
