#!/usr/bin/env python3
"""Update conversation.json with recent chat messages.

Usage:
  python3 update_conversation.py add --role user --content "Hello"      # Add a message
  python3 update_conversation.py add --role assistant --content "Hi!"   # Add a reply
  python3 update_conversation.py show                                   # Show all
  python3 update_conversation.py last 2                                 # Show last N rounds
"""

import json
import sys
import os
from datetime import datetime, timezone, timedelta

CST = timezone(timedelta(hours=8))
CONV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'conversation.json')


def load():
    if os.path.exists(CONV_FILE):
        with open(CONV_FILE, 'r') as f:
            return json.load(f)
    return {'conversations': [], 'updated_at': ''}


def save(data):
    data['updated_at'] = datetime.now(CST).strftime('%Y-%m-%dT%H:%M:%S')
    with open(CONV_FILE, 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'✅ Saved ({len(data["conversations"])} messages)')


def cmd_add(role, content):
    data = load()
    now = datetime.now(CST).strftime('%Y-%m-%dT%H:%M:%S')
    data['conversations'].append({
        'role': role,
        'content': content,
        'time': now
    })
    save(data)
    # Show last 4
    for m in data['conversations'][-4:]:
        emoji = '👤' if m['role'] == 'user' else '🐱'
        print(f'  {emoji} [{m["time"]}] {m["content"]}')


def cmd_show():
    data = load()
    print(f'📋 {len(data["conversations"])} messages (updated: {data.get("updated_at", "?")})')
    for m in data['conversations']:
        emoji = '👤' if m['role'] == 'user' else '🐱'
        print(f'  {emoji} [{m["time"]}] {m["content"]}')


def cmd_last(rounds):
    """Show last N rounds (1 round = user + assistant pair)"""
    data = load()
    msgs = data['conversations']
    # Take last 2*rounds messages (at most)
    count = min(rounds * 2, len(msgs))
    recent = msgs[-count:]
    print(f'📋 Last {rounds} round(s) ({len(recent)} messages):')
    for m in recent:
        emoji = '👤' if m['role'] == 'user' else '🐱'
        print(f'  {emoji} [{m["time"]}] {m["content"]}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == 'add':
        role = content = None
        i = 2
        while i < len(sys.argv):
            if sys.argv[i] == '--role' and i+1 < len(sys.argv):
                role = sys.argv[i+1]; i += 2
            elif sys.argv[i] == '--content' and i+1 < len(sys.argv):
                content = sys.argv[i+1]; i += 2
            else:
                i += 1
        if not role or not content:
            print('Usage: python3 update_conversation.py add --role user|assistant --content "message"')
            sys.exit(1)
        cmd_add(role, content)

    elif cmd == 'show':
        cmd_show()

    elif cmd == 'last':
        rounds = int(sys.argv[2]) if len(sys.argv) > 2 else 2
        cmd_last(rounds)

    else:
        print(f'Unknown command: {cmd}')
        print(__doc__)
