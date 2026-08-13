# Smart15 — Urban Accessibility Analysis

**Smart15** is a web-based geospatial analysis platform designed around the **15-Minute City** concept.

The platform estimates pedestrian and cyclist accessibility to urban services and facilities, considering not only travel distance but also factors such as:

- terrain slope;
- land surface temperature;
- vegetation cover and shading;
- street network characteristics;
- user mobility profile;
- distribution of urban services and facilities.

The platform is built on [GeoLibre](https://github.com/opengeos/GeoLibre) and integrates geospatial processing, interactive visualization, result export, and automated generation of technical reports.

## Demo

<video src="https://github.com/user-attachments/assets/db3433ff-69a3-4e4b-ba6c-fbabf08c8604" controls="controls" style="max-width: 100%;"></video>

> If the video is not displayed directly, access it through the repository attachments on GitHub.

## Key Features

- accessibility simulation for different mobility profiles;
- analysis of access to urban services and facilities;
- processing of terrain slope, land surface temperature, and vegetation cover;
- generation of isochrones and hexagonal grids;
- upload of GeoJSON files, training samples, and orthophotos;
- interactive visualization and inspection of layers;
- export to geospatial formats;
- automated generation of technical reports.

See the [complete feature description](docs/funcionalidades.md).

## Architecture

Smart15 consists of:

- a web interface based on GeoLibre;
- a plugin responsible for user interaction and result visualization;
- a FastAPI backend for geospatial processing, routing, raster processing, and data export;
- external data sources and user-provided data.

See the [architecture overview](docs/arquitetura/visao-geral.md).

## Quick Start

### Prerequisites

- Git;
- Docker;
- Docker Compose.

### Clone and Run

```bash
git clone --recurse-submodules <REPOSITORY_URL>
cd Smart15-Acessibilidade
./scripts/start.sh
```

Default addresses:

- Application: `http://localhost:8080`
- Backend: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

For port configuration, logs, shutdown procedures, and troubleshooting, see the [installation guide](docs/instalacao.md).

## Repository Structure

```text
Smart15-Acessibilidade/
├── backend/       # API and geospatial processing
├── deploy/        # Docker Compose, Dockerfiles, and Nginx
├── docs/          # Technical documentation
├── geolibre/      # GeoLibre submodule
├── plugin/        # Smart15 plugin source code
├── scripts/       # Build and startup scripts
└── README.md
```

## Documentation

- [Features](docs/funcionalidades.md)
- [Installation](docs/instalacao.md)
- [Development](docs/desenvolvimento.md)
- [Architecture overview](docs/arquitetura/visao-geral.md)
- [Architecture Decision Records](docs/adr/)

## Team

- **Leandro Gregório** — concept, architecture, and development;
- **Fábio Gregório** — development, integration, reporting, testing, and documentation.

## Base Project

Smart15 uses [GeoLibre](https://github.com/opengeos/GeoLibre) as its underlying geospatial platform.

The licenses and attribution requirements of all projects and libraries used by Smart15 must be preserved in accordance with their respective terms.

## License

See the [`LICENSE`](LICENSE) file for the project's terms of use and distribution.
