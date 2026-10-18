#!/bin/bash
# Dev helper: wipe the database configured in .env (DANGEROUS: drops all data) and reseed. Stop the server first.
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a
npx prisma db push --force-reset --skip-generate --accept-data-loss >/dev/null && npx tsx prisma/seed.ts
