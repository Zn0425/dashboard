#!/usr/bin/env python3
"""DeepSeek Balance Updater"""
import json, urllib.request, os, sys
from datetime import datetime, timezone, timedelta

CST = timezone(timedelta(hours=8))
API_KEY = "sk-7d0f571aec444c4d90e37b09835f3137"

def fetch_balance():
    req = urllib.request.Request(
        "https://api.deepseek.com/user/balance",
        headers={"Authorization": f"Bearer {API_KEY}"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode())

    bf = data.get("balance_infos", [])
    topped = granted = 0.0
    for b in bf:
        if b.get("currency") == "CNY":
            topped = float(b.get("topped_up_balance", 0))
            granted = float(b.get("granted_balance", 0))
            break

    result = {
        "is_available": data.get("is_available", False),
        "topped_up_balance": f"{topped:.6f}",
        "granted_balance": f"{granted:.6f}",
        "total_balance": f"{topped + granted:.6f}",
        "updated_at": datetime.now(CST).strftime("%m-%d %H:%M")
    }
    return result

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(script_dir, "balance.json")
    try:
        result = fetch_balance()
        with open(out_path, "w") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"✅ Balance updated: ¥{result['total_balance']}")
    except Exception as e:
        print(f"❌ Failed: {e}", file=sys.stderr)
        sys.exit(1)
