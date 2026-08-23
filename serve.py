#!/usr/bin/env python3
"""Local dev server for presentink.github.io.

Same as `python3 -m http.server`, but tells the browser never to cache anything —
Safari in particular will happily keep serving a stale base.css or sample.js after
an edit, which makes prototypes look unchanged.

    python3 serve.py          # http://localhost:8000
    python3 serve.py 8080     # another port
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        if "404" in (fmt % args):          # keep missing-file noise, drop the rest
            super().log_message(fmt, *args)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"presentink dev server (no-cache) → http://localhost:{port}/")
    print("  site       /")
    print("  prototype  /prototypes/2-filled-grid.html")
    try:
        ThreadingHTTPServer(("", port), NoCacheHandler).serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")
