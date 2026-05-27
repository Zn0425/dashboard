#!/usr/bin/env python3
"""Update gateway start time in status.json"""
import json, os
from datetime import datetime, timezone, timedelta

CST = timezone(timedelta(hours=8))

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(script_dir, "status.json")
    
    now = datetime.now(CST).strftime("%Y-%m-%dT%H:%M:%S+08:00")
    data = {"gateway_start_time": now}
    
    with open(out_path, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Gateway start time updated: {now}")
