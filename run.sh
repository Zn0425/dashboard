#!/bin/bash
cd /dataST/users/zn/OpenViking/bot/workspace/feishu__cli_aa9c12c09fbb9cc7/dashboard
python3 << 'PYEOF'
import base64, os

# Base64 encoded minimal HTML
html_b64 = "PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9InpoLUNOIj4KPGhlYWQ+CjxtZXRhIGNoYXJzZXQ9IlVURi04Ij4KPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjAiPgo8dGl0bGU+8J+QsSDlsI/pu5EgQUkgQWdlbnQgRGFzaGJvYXJkPC90aXRsZT4KPGxpbmsgcmVsPSJzdHlsZXNoZWV0IiBocmVmPSJzdHlsZS5jc3MiPgo8L2hlYWQ+Cjxib2R5Pgo8ZGl2IGNsYXNzPSJncmlkLWJnIj48L2Rpdj48ZGl2IGNsYXNzPSJvcmIgbzEiPjwvZGl2PjxkaXYgY2xhc3M9Im9yYiBvMiI+PC9kaXY+PGRpdiBjbGFzcz0ib3JiIG8zIj48L2Rpdj4KPHA+SGVsbG8gZnJvbSBYYW9oZWkhPC9wPgo8L2JvZHk+CjwvaHRtbD4="

with open('index.html', 'w') as f:
    f.write(base64.b64decode(html_b64).decode())

print("Done! Size:", os.path.getsize('index.html'))
PYEOF