#!/bin/sh
# Production entrypoint: create/upgrade the schema, seed an empty catalog (idempotent), start the server.
set -e
mkdir -p "$(dirname "${DATABASE_URL#file:}")"
npx prisma db push --skip-generate
npx tsx prisma/seed.ts
exec npx next start -p "${PORT:-3000}"
