#!/usr/bin/env python3
"""Query DeepSeek balance and update balance.json, then push to GitHub."""
import json, subprocess, sys, os
from datetime import datetime, timezone, timedelta

CST = timezone(timedelta(hours=8))
API_KEY = "sk-7d0f571aec444c4d90e37b09835f3137"
API_URL = "https://api.deepseek.com/user/balance"
BALANCE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "balance.json")

def run(cmd):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True)

# 1. Query DeepSeek API
print("[*] Querying DeepSeek balance API...")
result = run(f'curl -s {API_URL} -H "Authorization: Bearer {API_KEY}"')
if result.returncode != 0:
    print(f"[!] curl failed: {result.stderr}")
    sys.exit(1)

try:
    data = json.loads(result.stdout)
except json.JSONDecodeError:
    print(f"[!] Invalid JSON: {result.stdout[:200]}")
    sys.exit(1)

if not data.get("is_available"):
    print(f"[!] API returned unavailable: {data}")
    sys.exit(1)

balance_info = data["balance_infos"][0]
balance_data = {
    "updated_at": datetime.now(CST).strftime("%Y-%m-%d %H:%M:%S CST"),
    "currency": balance_info["currency"],
    "total_balance": balance_info["total_balance"],
    "granted_balance": balance_info["granted_balance"],
    "topped_up_balance": balance_info["topped_up_balance"],
    "is_available": data["is_available"]
}

print(f"[+] Balance: {balance_data['total_balance']} {balance_data['currency']}")

# 2. Write balance.json
with open(BALANCE_FILE, "w") as f:
    json.dump(balance_data, f, ensure_ascii=False, indent=2)
print(f"[+] Written to {BALANCE_FILE}")

# 3. Git commit & push
os.chdir(os.path.dirname(BALANCE_FILE))
run("git add balance.json")
r = run('git commit -m "🔄 Update DeepSeek balance"')
print(f"[*] git commit: {r.stdout.strip()}")

r = run("git push origin main 2>&1")
if r.returncode == 0:
    print("[+] Pushed to GitHub!")
else:
    print(f"[!] Push failed: {r.stderr}")
    sys.exit(1)
