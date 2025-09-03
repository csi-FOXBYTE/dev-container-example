FROM mcr.microsoft.com/devcontainers/base:ubuntu

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    git \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

# DOTNET SDK
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
  | gpg --dearmor -o /usr/share/keyrings/microsoft.gpg \
 && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/microsoft.gpg] \
https://packages.microsoft.com/ubuntu/24.04/prod noble main" \
  > /etc/apt/sources.list.d/microsoft-prod.list

RUN apt-get update && apt-get install -y dotnet-sdk-8.0 \
 && rm -rf /var/lib/apt/lists/*

# Node 20.x + pnpm 9
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g pnpm@9 \
    && rm -rf /var/lib/apt/lists/*

# Allow git to work inside workspace
RUN git config --system --add safe.directory '*'

WORKDIR /workspace
