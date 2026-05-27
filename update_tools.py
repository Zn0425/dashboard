#!/usr/bin/env python3
"""Update tool call counts in tools.json"""
import json, sys, os
from datetime import datetime, timezone, timedelta

CST = timezone(timedelta(hours=8))
TOOLS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tools.json')

def load():
    with open(TOOLS_FILE) as f:
        return json.load(f)

def save(data):
    data['updated_at'] = datetime.now(CST).strftime('%Y-%m-%dT%H:%M:%S+08:00')
    with open(TOOLS_FILE, 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"💾 Saved at {data['updated_at']}")

def inc(tool_name, n=1):
    data = load()
    old = data['tools'].get(tool_name, 0)
    data['tools'][tool_name] = old + n
    save(data)
    print(f"✅ {tool_name}: {old} → {data['tools'][tool_name]} (+{n})")

def set_count(tool_name, n):
    data = load()
    old = data['tools'].get(tool_name, 0)
    data['tools'][tool_name] = n
    save(data)
    print(f"✅ {tool_name}: {old} → {n}")

def show():
    data = load()
    total = sum(data['tools'].values())
    print(f"📊 Total: {total} calls across {len(data['tools'])} tools")
    for name, count in sorted(data['tools'].items(), key=lambda x: -x[1]):
        print(f"  {name}: {count}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        show()
    elif sys.argv[1] == 'inc' and len(sys.argv) >= 3:
        inc(sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 1)
    elif sys.argv[1] == 'set' and len(sys.argv) >= 4:
        set_count(sys.argv[2], int(sys.argv[3]))
    else:
        print("Usage:")
        print("  python3 update_tools.py                  # show counts")
        print("  python3 update_tools.py inc <tool> [n]   # increment by n (default 1)")
        print("  python3 update_tools.py set <tool> <n>   # set exact count")
