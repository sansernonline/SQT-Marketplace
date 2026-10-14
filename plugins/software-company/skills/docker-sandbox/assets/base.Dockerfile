# SQT sandbox base — built once per machine as sqt-sandbox-base:1 and shared by every project
FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

ARG NODE_MAJOR=22
ARG INSTALL_PLAYWRIGHT=1
ARG INSTALL_CLAUDE=1
# Pin exact versions for reproducible builds: --build-arg CLAUDE_CODE_VERSION=<x.y.z> --build-arg PLAYWRIGHT_VERSION=<x.y.z>
ARG CLAUDE_CODE_VERSION=latest
ARG PLAYWRIGHT_VERSION=latest
ENV DEBIAN_FRONTEND=noninteractive \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN apt-get update && apt-get install -y --no-install-recommends \
      git curl ca-certificates build-essential rsync jq unzip ripgrep \
      python3 python3-pip python3-venv iptables ipset dnsutils \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash - \
    && apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*

RUN if [ "$INSTALL_CLAUDE" = "1" ]; then npm install -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}; fi

RUN if [ "$INSTALL_PLAYWRIGHT" = "1" ]; then \
      npx -y playwright@${PLAYWRIGHT_VERSION} install --with-deps chromium; fi \
    && mkdir -p /ms-playwright && chmod -R a+rwX /ms-playwright
# a+rwX: a project pinned to another Playwright version can add its own browser build here

COPY init-firewall.sh /usr/local/bin/init-firewall.sh
RUN chmod 755 /usr/local/bin/init-firewall.sh \
    && mkdir -p /work /etc/sandbox && chown vscode:vscode /work

USER vscode
WORKDIR /work
