# Smart15 Development Guide

## Main Components

The project consists of three core components:

- `backend/`: FastAPI API and geospatial processing;
- `plugin/`: Smart15 plugin source code;
- `geolibre/`: GeoLibre platform submodule.

The runtime infrastructure is located in `deploy/`, while auxiliary scripts are located in `scripts/`.

## Plugin Development

The plugin uses TypeScript, Vite, and components integrated into the GeoLibre interface.

To install the project dependencies:

```bash
npm install
```

To build and synchronize the plugin with GeoLibre:

```bash
./scripts/build-plugin.sh
```

The script:

1. builds the plugin bundle;
2. removes the previously synchronized version;
3. creates the destination directory structure;
4. copies the manifest;
5. copies the bundle;
6. validates the resulting files.

Plugin destination:

```text
geolibre/apps/geolibre-desktop/public/plugins/smart15-orquestrador/
```

## Integrated Execution

To build the plugin, build the Docker images, and start the entire environment:

```bash
./scripts/start.sh
```

## Backend

The backend is implemented in Python using FastAPI.

Its main responsibilities include:

- retrieval and processing of geospatial data;
- processing of digital elevation models;
- terrain slope calculation;
- processing of thermal and vegetation data;
- construction and analysis of the street network;
- generation of isochrones and grids;
- export of results;
- provision of generated files.

The interactive API documentation is available at:

```text
http://localhost:8000/docs
```

or at the port configured in `SMART15_BACKEND_PORT`.

## Relevant Project Structure

```text
Smart15-Acessibilidade/
├── backend/
├── deploy/
│   ├── compose/
│   ├── docker/
│   └── nginx/
├── docs/
├── geolibre/
├── plugin/
├── scripts/
│   ├── build-plugin.sh
│   └── start.sh
├── .env.example
├── package.json
└── README.md
```

## GeoLibre Submodule

To manually initialize or update the submodule:

```bash
git submodule update --init --recursive
```

To check the commit currently referenced by the project:

```bash
git submodule status
```

Changes to GeoLibre should be handled separately from changes to the main repository.

## Plugin Cache

If GeoLibre loads a previous version of the plugin bundle, run the following command in the browser's developer console:

```javascript
localStorage.removeItem('geolibre.pluginBundlePins')
```

Then reload the page using `Ctrl+Shift+R`.

## Pre-Commit Validation

Before committing changes, run:

```bash
git status
git diff
./scripts/build-plugin.sh
./scripts/start.sh
```

After startup, verify:

- web application access;
- backend `/health` endpoint;
- `/docs` API documentation;
- plugin loading;
- execution of a simulation;
- technical report generation and opening;
- result export.
