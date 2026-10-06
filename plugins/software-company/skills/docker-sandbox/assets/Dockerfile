# Project layer — only what this project needs on top of the shared base image.
# The base (Node, Python, Git, Playwright Chromium, Claude Code) is built once: sandbox.ps1 base
ARG BASE_IMAGE=sqt-sandbox-base:1
FROM ${BASE_IMAGE}

ARG INSTALL_DOTNET=0
USER root
RUN if [ "$INSTALL_DOTNET" = "1" ]; then \
      apt-get update && apt-get install -y dotnet-sdk-8.0 && rm -rf /var/lib/apt/lists/*; fi
# Add this project's own packages below, for example:
# RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client && rm -rf /var/lib/apt/lists/*

USER vscode
WORKDIR /work
