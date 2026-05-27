#!/usr/bin/env python3
"""Update tool call statistics in tool_stats.json

Usage:
  python3 update_tool_stats.py add --tool openviking_search --desc "Search: something" [--status OK|FAIL]
  python3 update_tool_stats.py add --tool exec --desc "Did something"
  python3 update_tool_stats.py list              # show current stats
  python3 update_tool_stats.py reset             # reset all counts to 0
"""
import json, os, sys, argparse
from datetime import datetime, timezone, timedelta

CST = timezone(timedelta(hours=8))
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(SCRIPT_DIR, "tool_stats.json")

# Tool icon/color/category mapping
TOOL_META = {
    "openviking_search":  {"icon": "🔍", "cat": "搜索", "color": "#3b82f6", "cls": "eis"},
    "openviking_read":    {"icon": "📖", "cat": "读取", "color": "#10b981", "cls": "eir"},
    "openviking_multi_read": {"icon": "📚", "cat": "读取", "color": "#10b981", "cls": "eir"},
    "openviking_list":    {"icon": "📋", "cat": "读取", "color": "#10b981", "cls": "eir"},
    "openviking_grep":    {"icon": "🔎", "cat": "搜索", "color": "#3b82f6", "cls": "eis"},
    "openviking_glob":    {"icon": "🌟", "cat": "搜索", "color": "#3b82f6", "cls": "eis"},
    "write_file":         {"icon": "📝", "cat": "写入", "color": "#f59e0b", "cls": "eiw"},
    "edit_file":          {"icon": "✏️", "cat": "写入", "color": "#f59e0b", "cls": "eiw"},
    "exec":               {"icon": "💻", "cat": "执行", "color": "#ec4899", "cls": "eix"},
    "web_search":         {"icon": "🔎", "cat": "网络", "color": "#8b5cf6", "cls": "eiwb"},
    "web_fetch":          {"icon": "🌐", "cat": "网络", "color": "#8b5cf6", "cls": "eiwb"},
    "generate_image":     {"icon": "🎨", "cat": "生成", "color": "#06b6d4", "cls": "eiim"},
    "message":            {"icon": "💬", "cat": "通信", "color": "#84cc16", "cls": "eiw"},
    "spawn":              {"icon": "🚀", "cat": "执行", "color": "#ec4899", "cls": "eix"},
    "cron":               {"icon": "⏰", "cat": "执行", "color": "#ec4899", "cls": "eix"},
    "openviking_memory_commit": {"icon": "🧠", "cat": "写入", "color": "#f59e0b", "cls": "eiw"},
    "openviking_add_resource":  {"icon": "📎", "cat": "写入", "color": "#f59e0b", "cls": "eiw"},
}


def load():
    with open(JSON_PATH, "r") as f:
        return json.load(f)


def save(data):
    with open(JSON_PATH, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def cmd_add(tool, desc, status="OK"):
    data = load()
    meta = TOOL_META.get(tool, {"icon": "🔧", "cls": "eiw"})

    # Add log entry
    entry = {"tool": tool, "icon": meta["icon"], "cls": meta["cls"],
             "desc": desc, "status": status}
    data["log"].append(entry)

    # Update tool count
    found = False
    for t in data["tools"]:
        if t["name"] == tool:
            t["count"] += 1
            found = True
            break
    if not found:
        data["tools"].append({
            "name": tool, "icon": meta["icon"],
            "count": 1, "cat": meta.get("cat", "其他"),
            "color": meta.get("color", "#666")
        })

    # Update totals
    data["total_calls"] = sum(t["count"] for t in data["tools"])
    data["updated_at"] = datetime.now(CST).strftime("%Y-%m-%dT%H:%M:%S+08:00")

    save(data)
    print(f"✅ +1 {tool}: {desc} [{status}]")
    print(f"   Total: {data['total_calls']} calls across {len(data['tools'])} tools")


def cmd_list():
    data = load()
    print(f"🔧 Tool Stats (updated: {data['updated_at']})")
    print(f"   Total: {data['total_calls']} calls, {len(data['tools'])} tools")
    print(f"   Log entries: {len(data['log'])}")
    print()
    for t in sorted(data["tools"], key=lambda x: -x["count"]):
        bar = "█" * t["count"]
        print(f"   {t['icon']} {t['name']:<28} {t['count']:>3}  {bar}")


def cmd_reset():
    data = load()
    data["total_calls"] = 0
    data["log"] = []
    for t in data["tools"]:
        t["count"] = 0
    data["updated_at"] = datetime.now(CST).strftime("%Y-%m-%dT%H:%M:%S+08:00")
    save(data)
    print("🔄 All tool stats reset to 0.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update tool call stats")
    sub = parser.add_subparsers(dest="cmd")

    p_add = sub.add_parser("add")
    p_add.add_argument("--tool", required=True, help="Tool name")
    p_add.add_argument("--desc", required=True, help="Description")
    p_add.add_argument("--status", default="OK", choices=["OK", "FAIL"])

    sub.add_parser("list")
    sub.add_parser("reset")

    args = parser.parse_args()

    if args.cmd == "add":
        cmd_add(args.tool, args.desc, args.status)
    elif args.cmd == "list":
        cmd_list()
    elif args.cmd == "reset":
        cmd_reset()
    else:
        parser.print_help()
