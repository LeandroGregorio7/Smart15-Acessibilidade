# Smart15 Installation Guide

This guide explains how to install and run Smart15 on a Linux server or in a Windows + WSL2 environment.

Smart15 runs using Docker. This means that its components — the GeoLibre interface, the Smart15 plugin, and the processing backend — are prepared and started in a standardized environment, without requiring the manual installation of Python, Node.js, or geospatial libraries.

## Quick Overview

Once the prerequisites are installed, the installation process normally consists of three commands:

```bash
git clone --recurse-submodules <REPOSITORY_URL>
cd Smart15-Acessibilidade
./scripts/start.sh
```

The first run may take a few minutes because the Docker images need to be built.

## Concepts Used

- **Terminal:** a command-line window used to interact with the operating system. On Ubuntu, it can be opened with `Ctrl` + `Alt` + `T`.
- **Git:** a tool used to download and update the project's source code.
- **Docker:** a platform that runs the application in isolated containers with all required dependencies.
- **Docker Compose:** a Docker component used to start, stop, and manage the Smart15 services together.
- **WSL2:** a Linux environment running within Windows. To use it, Docker Desktop must be installed and integrated with the Linux distribution being used.

## 1. Prerequisites

The following tools are required:

- Git;
- Docker;
- Docker Compose;
- `curl`;
- `ss`;
- `timeout`.

The user performing the installation must also have permission to run Docker commands.

### Installation on Ubuntu or Debian

Update the package list and install the required tools:

```bash
sudo apt update

sudo apt install -y \
  git \
  curl \
  iproute2 \
  coreutils \
  docker.io \
  docker-compose-plugin
```

Add the current user to the Docker group:

```bash
sudo usermod -aG docker $USER
```

After running this command, log out of the Linux session and log back in. On WSL2, close the Linux distribution and open it again.

> Without this step, you may need to use `sudo` before Docker commands.

### Verify the Environment

Run the commands below. Each one should display the installed version:

```bash
git --version
docker --version
docker compose version
```

You can also verify that Docker is working correctly:

```bash
docker run hello-world
```

## 2. Download the Project

In the terminal, navigate to the directory where you want to store the project and run:

```bash
git clone --recurse-submodules <REPOSITORY_URL>
cd Smart15-Acessibilidade
```

Replace `<REPOSITORY_URL>` with the Git repository URL provided by the project team.

The `--recurse-submodules` option also downloads GeoLibre, which provides the geospatial interface used by Smart15.

## 3. Start the Application

Inside the `Smart15-Acessibilidade` directory, run:

```bash
./scripts/start.sh
```

The script automates the environment setup. It performs the following steps:

1. Validates the prerequisites;
2. Creates the `.env` configuration file when necessary;
3. Initializes GeoLibre;
4. Builds the Smart15 plugin;
5. Synchronizes the plugin with GeoLibre;
6. Validates the Docker Compose configuration;
7. Checks for port conflicts;
8. Builds the Docker images;
9. Starts the containers;
10. Checks the health of the backend and web interface;
11. Displays the application access addresses.

Once the process is complete, the application will be available at the default addresses:

- **Smart15 application:** <http://localhost:8080>
- **Backend:** <http://localhost:8000>
- **API documentation:** <http://localhost:8000/docs>

When the application is running on a server, replace `localhost` with the server's IP address or hostname. For example:

```text
http://192.168.1.50:8080
```

For normal use, access the application through port `8080`.

## 4. Port Configuration

External ports are defined in the `.env` file:

```dotenv
SMART15_BACKEND_PORT=8000
SMART15_WEB_PORT=8080
```

On the first run, the `.env` file is automatically created from `.env.example`.

If a default port is already in use, the application can be temporarily started on different ports:

```bash
SMART15_BACKEND_PORT=8001 \
SMART15_WEB_PORT=8081 \
./scripts/start.sh
```

In this example, the application will be available at:

```text
http://localhost:8081
```

## Daily Operation

### Check Whether the System Is Running

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  ps
```

The expected services are:

- `backend`: service responsible for simulation processing;
- `geolibre`: Smart15 web interface.

A `running` or `Up` status indicates that the service is running.

### View System Logs

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  logs -f
```

Press `Ctrl` + `C` to stop viewing the logs.

### Stop the Application

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  down
```

This command stops the application while preserving the project files and Docker images.

### Start the Application Again

```bash
./scripts/start.sh
```

### Rebuild the Environment

Use this procedure after updating the project or whenever the containers need to be rebuilt:

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  down --remove-orphans

./scripts/start.sh
```

## Common Issues

### The `git`, `docker`, or `docker compose` Command Was Not Found

This indicates that the corresponding tool is not installed or that the terminal needs to be reopened after installation. Follow the steps in the [Prerequisites](#1-prerequisites) section again.

### Permission Error When Running Docker

If a permission-denied message appears when running Docker, verify that the user has been added to the `docker` group:

```bash
sudo usermod -aG docker $USER
```

Then log out and log back into the system.

### Port Already in Use

Change the ports in the `.env` file or specify temporary values:

```bash
SMART15_BACKEND_PORT=8001 \
SMART15_WEB_PORT=8081 \
./scripts/start.sh
```

### The Application Cannot Be Accessed from Another Computer on the Network

Verify:

1. That the application started successfully;
2. That the server's IP address is being used in the browser;
3. That the configured port is allowed through the firewall and local network;
4. That the services appear as `running` when using the `docker compose ... ps` command.

### Outdated Plugin in the Browser

This procedure is intended for the technical team after updating the plugin:

1. Open the browser's developer console;
2. Run the command below;
3. Reload the page with `Ctrl` + `Shift` + `R`.

```javascript
localStorage.removeItem('geolibre.pluginBundlePins')
```

### View Logs for a Single Service

**Backend logs:**

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  logs -f backend
```

**GeoLibre interface logs:**

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  logs -f geolibre
```
