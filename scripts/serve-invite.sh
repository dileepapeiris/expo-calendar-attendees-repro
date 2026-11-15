#!/bin/bash
# Serves scripts/invite.ics on http://127.0.0.1:8765/invite.ics so the simulator's Calendar
# can subscribe to it (EventKit cannot add attendees to an event, a subscription can).
cd "$(dirname "$0")" && exec python3 -m http.server 8765 --bind 127.0.0.1
