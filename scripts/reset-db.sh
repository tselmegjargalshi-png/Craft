#!/bin/bash
# Dev helper: recreate the SQLite DB from scratch and reseed (stop the server first).
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a
rm -f prisma/dev.db prisma/dev.db-journal
npx prisma db push --skip-generate >/dev/null && npx tsx prisma/seed.ts
