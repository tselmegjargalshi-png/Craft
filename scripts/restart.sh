#!/bin/bash
# Restart the production server on :3000.
cd "$(dirname "$0")/.."
for PID in $(ps -eo pid,args | grep "[n]ext-server" | awk '{print $1}'); do kill "$PID"; done
sleep 2
(setsid nohup npx next start -p 3000 > /tmp/craft-server.log 2>&1 &)
for i in $(seq 1 30); do curl -s -o /dev/null localhost:3000/ && break; sleep 0.5; done
