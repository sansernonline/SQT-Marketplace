#!/usr/bin/env bash
# Copy resources/ into the run folder. add_dirs only grants read access and the run starts in an empty cwd.
set -euo pipefail
cp -R "$(dirname "$0")/resources" .
