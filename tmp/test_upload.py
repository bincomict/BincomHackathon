import json
import urllib.request
import urllib.error

# 1. Login to get the current token
login_url = "http://localhost:3000/api/admin/login"
login_data = json.dumps({"username": "bincom_admin", "password": "BincomGenAIHacks2026!"}).encode("utf-8")
req = urllib.request.Request(login_url, data=login_data, headers={"Content-Type": "application/json"})

try:
    with urllib.request.urlopen(req) as res:
        res_data = json.loads(res.read().decode("utf-8"))
        token = res_data["token"]
        print(f"Logged in successfully. Token: {token}")
except Exception as e:
    print("Login failed:", e)
    exit(1)

# 2. Load the base64 file
with open("/tmp/test_img.b64", "r") as f:
    b64_content = f.read()

# 3. Upload the large flyer
upload_url = "http://localhost:3000/api/upload-flyer"
upload_payload = json.dumps({
    "image": f"data:image/jpeg;base64,{b64_content}",
    "fileName": "large_flyer_test.jpg"
}).encode("utf-8")

upload_req = urllib.request.Request(
    upload_url,
    data=upload_payload,
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
)

try:
    with urllib.request.urlopen(upload_req) as res:
        print(f"Status Code: {res.status}")
        print(f"Headers: {dict(res.headers)}")
        print(f"Body: {res.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Response: {e.read().decode('utf-8')}")
except Exception as e:
    print("Upload failed with exception:", e)
