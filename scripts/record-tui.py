#!/usr/bin/env python3
"""Records an interactive gooze TUI session with asciinema, headless.

The TUI asks the terminal for its background colour and cursor position at
startup and waits for keys, so it can't be recorded from a script directly.
This runs `asciinema rec` inside a pseudo-terminal of a fixed size, answers
those queries like a terminal would, and types the given keys with pauses, as
a person would. The recorded output is gooze's own.

  scripts/record-tui.py OUT.cast "TITLE" "COMMAND" [KEYS...]

KEYS are sent in order. Each is either "wait:TEXT" (wait until TEXT appears on
screen, up to 120s), "sleep:SECONDS", or keys to type ("q", "j", "\\r" for
enter, "/" ...).
"""
import os
import pty
import re
import select
import struct
import sys
import termios
import fcntl
import time

COLS, ROWS = 100, 30
QUERY_BG = re.compile(rb"\x1b\]11;\?(\x07|\x1b\\)")
QUERY_POS = b"\x1b[6n"
ANSI = re.compile(rb"\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(\x07|\x1b\\)")


def main() -> None:
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    out, title, command, *keys = sys.argv[1:]

    pid, fd = pty.fork()
    if pid == 0:
        os.environ["TERM"] = "xterm-256color"
        os.execvp(
            "asciinema",
            ["asciinema", "rec", "-q", "--overwrite", "-i", "1", "-t", title, "-c", command, out],
        )

    fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", ROWS, COLS, 0, 0))
    screen = b""

    def pump(seconds: float) -> bool:
        """Reads output for up to `seconds`, answering terminal queries."""
        nonlocal screen
        end = time.time() + seconds
        while time.time() < end:
            ready, _, _ = select.select([fd], [], [], 0.05)
            if not ready:
                continue
            try:
                data = os.read(fd, 65536)
            except OSError:
                return False
            if not data:
                return False
            if QUERY_BG.search(data):
                os.write(fd, b"\x1b]11;rgb:1e1e/1e1e/1e1e\x1b\\")
            if QUERY_POS in data:
                os.write(fd, b"\x1b[1;1R")
            screen = (screen + ANSI.sub(b"", data))[-20000:]
        return True

    pump(1.0)
    for key in keys:
        if key.startswith("wait:"):
            text = key[5:].encode()
            deadline = time.time() + 120
            while text not in screen and time.time() < deadline:
                if not pump(0.2):
                    break
            if text not in screen:
                sys.exit(f"timed out waiting for {key[5:]!r}")
            pump(1.0)
        elif key.startswith("sleep:"):
            pump(float(key[6:]))
        else:
            os.write(fd, key.encode().decode("unicode_escape").encode())
            pump(0.8)

    # Let the program exit and asciinema write the file.
    deadline = time.time() + 30
    while time.time() < deadline and pump(0.5):
        pass
    _, status = os.waitpid(pid, 0)
    sys.exit(os.waitstatus_to_exitcode(status))


if __name__ == "__main__":
    main()
