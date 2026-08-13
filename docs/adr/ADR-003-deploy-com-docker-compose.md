# ADR-003 — Deployment of Smart15 with Docker Compose

## Status

Accepted.

## Date

2026-07-18.

## Context

Smart15 is intended to run on a university-managed server environment.

The application includes multiple components and dependencies, including:

* GeoLibre Web;
* the Smart15 plugin;
* a FastAPI backend;
* Python geospatial libraries;
* web-server configuration;
* temporary processing directories;
* exported geospatial results;
* environment-specific configuration.

The backend depends on a geospatial Python ecosystem that may require operating-system-level libraries and native dependencies, including technologies such as:

* GDAL;
* PROJ;
* GEOS;
* Rasterio;
* GeoPandas;
* OSMnx;
* Scikit-learn.

Installing and configuring these dependencies manually on the target server would increase the risk of inconsistencies between development and deployment environments.

The project therefore requires a deployment process that is:

* documented;
* reproducible;
* version-controlled;
* simple to execute;
* suitable for a Linux server;
* independent of the developer workstation.

## Decision

Smart15 is deployed using Docker containers coordinated through Docker Compose.

The current deployment consists of two main services:

```text
smart15-geolibre
    GeoLibre Web with the Smart15 plugin

smart15-backend
    FastAPI API and geospatial processing
```

The two services communicate through a dedicated Docker network.

The GeoLibre service provides the browser-accessible application, while the backend performs computationally intensive geospatial processing.

The current runtime architecture is:

```text
Browser
   │
   │ HTTP
   ▼
GeoLibre Web + Smart15 Plugin
   │
   │ HTTP / JSON / GeoJSON
   ▼
Smart15 Backend
   │
   ▼
Temporary File Storage
```

Docker Compose defines the services, networks, exposed ports, health checks, build instructions, and runtime dependencies.

## Current Compose Services

### `backend`

The backend service:

* is built from the Smart15 backend Dockerfile;
* runs the FastAPI application;
* exposes the internal application port `8000`;
* provides a health endpoint;
* performs geospatial processing;
* writes generated exports to temporary storage.

The external backend port can be configured through:

```dotenv
SMART15_BACKEND_PORT=8000
```

### `geolibre`

The GeoLibre service:

* provides the web-based geospatial interface;
* includes the synchronized Smart15 plugin;
* depends on the backend health check;
* exposes the browser-facing web application.

The external web port can be configured through:

```dotenv
SMART15_WEB_PORT=8080
```

## Deployment Structure

The relevant deployment structure is:

```text
deploy/
├── compose/
│   └── docker-compose.yml
├── docker/
│   ├── backend.Dockerfile
│   └── geolibre.Dockerfile
└── nginx/
```

Auxiliary scripts are maintained separately:

```text
scripts/
├── build-plugin.sh
└── start.sh
```

Configuration defaults are provided through:

```text
.env.example
```

The local `.env` file is not intended to be version-controlled.

## Automated Startup

The project provides:

```bash
./scripts/start.sh
```

as the standard startup procedure.

The script performs the following operations:

1. validates required commands and dependencies;
2. creates `.env` from `.env.example` when necessary;
3. initializes the GeoLibre Git submodule when required;
4. checks configured ports;
5. builds the Smart15 plugin;
6. synchronizes the plugin with GeoLibre;
7. validates the Docker Compose configuration;
8. builds the Docker images;
9. starts the containers;
10. checks published ports;
11. validates backend availability;
12. validates GeoLibre availability;
13. displays the application access URLs.

This script provides a reproducible entry point for deployment and reduces the number of manual steps required from the operator.

## Port Configuration

Default external ports are:

```dotenv
SMART15_BACKEND_PORT=8000
SMART15_WEB_PORT=8080
```

They can be changed permanently in `.env` or overridden for a single execution:

```bash
SMART15_BACKEND_PORT=8001 \
SMART15_WEB_PORT=8081 \
./scripts/start.sh
```

The internal container ports remain unchanged.

This allows Smart15 to coexist with other applications running on the same host without modifying the application code.

## Build Strategy

The current Docker Compose configuration builds the application images from the project source code.

Conceptually:

```yaml
services:
  backend:
    build:
      context: ../..
      dockerfile: deploy/docker/backend.Dockerfile

  geolibre:
    build:
      context: ../..
      dockerfile: deploy/docker/geolibre.Dockerfile
```

This approach is appropriate for the current delivery model because the complete application can be reconstructed from the versioned source repository.

Versioned pre-built images may be introduced in future deployment workflows if required by the university infrastructure.

## Temporary Storage

The backend uses filesystem-based temporary storage for generated processing artifacts.

The current deployment includes a bind mount associated with the backend export directory.

This storage may contain:

* generated geospatial exports;
* intermediate processing artifacts;
* temporary files required during simulations.

The current implementation does not depend on a database or object-storage service for application execution.

Long-term persistence of simulation histories is outside the current deployment scope.

## Configuration

Application configuration is provided through environment variables and the `.env` file.

The project includes `.env.example` as a documented configuration template.

Sensitive credentials, access tokens, or environment-specific secrets should not be committed to the source repository.

## Alternatives Considered

### Manual Server Installation

Python, Node.js, geospatial libraries, GeoLibre dependencies, and the web environment could be installed directly on the target server.

However, this approach would increase:

* environment inconsistencies;
* deployment time;
* support complexity;
* dependency conflicts;
* dependence on server-specific configuration.

Containerization provides greater reproducibility and isolation.

### Kubernetes or OpenShift

Kubernetes and OpenShift provide capabilities such as:

* horizontal scaling;
* high availability;
* advanced orchestration;
* declarative deployment;
* integrated observability.

However, they would introduce unnecessary operational complexity for the current Smart15 deployment, which consists of a small number of services running on a single server.

Docker Compose is sufficient for the current deployment requirements.

The containerized architecture does not prevent future migration to an orchestration platform if scaling or availability requirements change.

### Serverless Platforms

Serverless platforms could simplify infrastructure management for some types of applications.

However, Smart15 performs operations that may involve:

* relatively long processing times;
* significant memory consumption;
* native geospatial dependencies;
* raster processing;
* large spatial files.

These characteristics make a container-based deployment more suitable for the current system.

## Positive Consequences

* Reproducible runtime environment.
* Simplified installation.
* Isolation of geospatial dependencies.
* Reduced dependence on host operating-system configuration.
* Consistency between development and deployment environments.
* Easier reconstruction of the complete application.
* Configurable external ports.
* Automated environment validation through `start.sh`.
* Explicit health checks for application services.
* Easier deployment on a Linux server.
* Foundation for future adoption of more advanced container orchestration.

## Negative Consequences

* Docker and Docker Compose are required on the target server.
* Operators need basic familiarity with container-based environments.
* Docker images consume additional disk space.
* Base images and dependencies require periodic maintenance.
* Docker Compose does not provide native high availability or horizontal orchestration.

## Risks

### Port Conflicts

The default ports may already be used by other applications on the target server.

Mitigation:

* validate port availability before startup;
* allow configuration through `.env`;
* allow temporary port overrides through environment variables.

### Large Temporary Files

Raster processing and exported geospatial products may consume significant disk space.

Mitigation:

* isolate temporary export directories;
* monitor available disk space;
* remove obsolete temporary artifacts when appropriate;
* establish retention policies if the volume of use increases.

### Environment-Specific Deployment Constraints

The university server may impose restrictions related to networking, external connectivity, firewall configuration, or Docker usage.

Mitigation:

* document required ports and dependencies;
* validate installation on a clean Linux environment;
* maintain deployment configuration separately from application code;
* adapt external port mappings without changing application internals.

### Failure During an Update

Changes to the application or its dependencies may produce an invalid deployment.

Mitigation:

* use Git tags and releases to identify validated versions;
* retain previous versions of the source code;
* rebuild and test the environment before institutional deployment;
* validate application health after startup.

### Exposed Credentials

Tokens or credentials could be accidentally included in project files.

Mitigation:

* use environment variables;
* exclude `.env` from Git;
* provide only `.env.example`;
* review repository contents before release.

## Validation Criteria

The decision is considered validated because the current implementation demonstrates that:

* the complete environment can be started through `./scripts/start.sh`;
* Docker Compose builds and starts the backend and GeoLibre services;
* the GeoLibre service waits for a healthy backend before startup;
* external ports can be configured without changing the application code;
* the application can be installed from the repository on another machine;
* the GeoLibre Git submodule can be initialized automatically;
* the Smart15 plugin can be built and synchronized automatically;
* backend and web availability are verified during startup;
* the installation procedure is documented and reproducible.

## Future Evolution

If future operational requirements justify additional infrastructure, the deployment architecture may evolve to include:

* asynchronous processing queues;
* worker processes;
* PostGIS persistence;
* S3-compatible object storage;
* centralized monitoring;
* centralized logging;
* Kubernetes;
* OpenShift;
* versioned container images in a container registry.

These possibilities are not part of the current Smart15 deployment and should be treated as future architectural options rather than implemented components.

## Decision Review

This decision should be reviewed if:

* the university mandates a different deployment platform;
* horizontal scaling becomes necessary;
* high-availability requirements are introduced;
* processing workloads require distributed infrastructure;
* Docker Compose no longer meets the operational requirements of the target environment.
