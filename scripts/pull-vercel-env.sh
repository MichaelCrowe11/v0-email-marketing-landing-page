#!/usr/bin/env bash
set -euo pipefail

# Pull Vercel environment variables into a local .env file for local testing
# Usage: ./scripts/pull-vercel-env.sh [environment] [out_file]
# Example: ./scripts/pull-vercel-env.sh production .env.local

ENV=${1:-production}
OUT=${2:-.env.local}

echo "Pulling Vercel envs for environment: $ENV -> $OUT"

if command -v vercel >/dev/null 2>&1; then
  VERCEL_CMD=vercel
else
  VERCEL_CMD="npx vercel"
fi

if [[ -n "${VERCEL_TOKEN:-}" ]]; then
  echo "Using VERCEL_TOKEN from environment (non-interactive)"
  $VERCEL_CMD env pull "$OUT" --environment="$ENV" --token "$VERCEL_TOKEN" --yes
else
  echo "No VERCEL_TOKEN found. Falling back to interactive flow."
  echo "If you prefer non-interactive, create a Personal Token in Vercel and set VERCEL_TOKEN in this shell."
  echo "You may be prompted to login in the browser."
  read -p "Continue with interactive flow and pull envs to $OUT? (type YES to continue) " CONFIRM
  if [ "$CONFIRM" != "YES" ]; then
    echo "Aborted by user"
    exit 1
  fi
  $VERCEL_CMD env pull "$OUT" --environment="$ENV"
fi

# Ensure .env.local is in .gitignore
if ! grep -qxF "$OUT" .gitignore 2>/dev/null; then
  echo "Adding $OUT to .gitignore"
  echo "$OUT" >> .gitignore
fi

echo "Done. Remember: $OUT contains secrets. Do NOT commit it to git."
