#!/usr/bin/env bash
set -euo pipefail

git init -b main
git add .
git status --short

cat <<'MSG'

Next manual Git Flow commands after your first commit:

  git commit -m "Initial cloud DevOps project scaffold"
  git checkout -b develop
  git checkout -b release
  git checkout main

Then each member creates a feature branch from develop:

  git checkout develop
  git checkout -b feature/member-name-work

MSG
