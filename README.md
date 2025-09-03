# VSCode Dev Container setup Example

This is an example of how a devcontainer setup can look like.

## Requirements

- Docker CLI installed
- VSCode with the Dev Containers Extension

## How to run

1. Clone this repository and open it in VSCode
2. Open the Command Palette with `Ctrl+Shift+P`
3. Run `>Dev Containers: Reopen in Container`

4. Start Backend:

   1. Run `dotnet restore`
   2. Run `dotnet tool restore`
   3. Run `dotnet ef database update` (Applies Migrations)
   4. Run `dotnet watch run`

5. Start Frontend:

   1. Run `pnpm i`
   2. Run `pnpm run dev`

6. Open `localhost:5173` on Host Device

Step 4 and 5 could be shortened when using 2 dev containers instead of stuffing 2 Projects in one.

## Setup Git

To setup git run

    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"

There is no further Authentication needed, the Host device is responsible for that.

## What does it do

A Dev Container is a Container VSCode attaches to, to use it as it's development environment. In this case the Docker Compose File sets up a postgres 16 database and the actual dev container VSCode attaches to using the Docker File.

### Dockerfile

The Dockerfile installs essentials like git and all the required Software to enable development.
In this case:

- Dotnet SDK 8
- Node 20
- pnpm 9

### Docker Compose

The Docker Compose file sets up 2 Containers.

myapp-dev is the Dev Container VSCode attaches to. It exposes the ports 5173 and 8080 for the frontend and backend app respectivly.

myapp-db is the postgres container that provides the database via port 5432.

### Devcontainer.json

The Devcontainer.json defines how the devcontainer is setup:

    "dockerComposeFile": [
      "docker-compose.yml"
    ],
    "service": "myapp-dev",
    "workspaceFolder": "/workspace",
    "runServices": ["myapp-dev", "myapp-db"],

and what settings and extensions VSCode uses:

    "customizations": {
      "vscode": {
        "extensions": [
          //Extenstions
        ],
        "settings": {
          //Settings
        }
      }
    }

### Benefits

- All Developers have the same development environment
- Setup ist fast and easy
- No additional software is required on the Host System
- No more "works on my machine" bugs
- Tight Control over what version of software is used
