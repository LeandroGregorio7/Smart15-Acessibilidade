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

## Study boundary and simulation start point

A valid Polygon or MultiPolygon is required for every simulation, regardless of the selected start-point method. The backend validates the origin against the actual geometry (including holes), clips isochrones and hexagons to the boundary, and rejects oversized geometries before raster downloads or routing. The default processing limits are 100 km² and 1.0° of bounding-box span in either direction; configure them with `SMART15_MAX_STUDY_AREA_KM2` and `SMART15_MAX_STUDY_BBOX_SPAN_DEGREES` in `.env`.

The boundary and uploaded point files accept GeoJSON in EPSG:4326, EPSG:3857, or EPSG:31983 (SIRGAS 2000 / UTM zone 23S). The start point can be the polygon centroid, a point clicked inside the polygon on the map, decimal latitude/longitude, an address found through a user-triggered OpenStreetMap/Nominatim search, or a point selected from an uploaded GeoJSON Point/MultiPoint file. Coordinate fields are separate and require a decimal **period** (`.`), for example `-23.55052`; decimal commas are not accepted. Point uploads are limited to 10 MB and 500 points, and one point is used per simulation run. Map clicks, coordinates, addresses, and uploaded points are checked against the study polygon (including holes) before simulation.

Address search uses the configurable `SMART15_NOMINATIM_URL`, caches results, does not autocomplete, and identifies the application to Nominatim. The interface displays OpenStreetMap attribution. The public service has a strict maximum of one request per second; see the [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/).

### Large raster uploads

The default maximum is **4 GiB total for uploaded files per simulation** (`SMART15_MAX_UPLOAD_SIZE_BYTES`), and the Nginx proxy accepts requests up to 5 GiB to allow multipart overhead. Large uploads are streamed to the mounted `backend/temp_export` volume and copied to disk in chunks rather than loaded completely into backend RAM. Keep at least about twice the raster size free on the Docker host while the upload is being staged and copied; a 2.05 GB orthophoto is within the default limit. Rebuild/recreate the containers after changing this code or the setting.

After pulling a version that contains these changes, rebuild and recreate the Docker services from the repository root:

```bash
git pull --ff-only origin main
git submodule update --init --recursive
docker compose --env-file .env --file deploy/compose/docker-compose.yml up -d --build --force-recreate
```

## Step-by-Step How install and Run (PDF Document)
[Smart15-Guia-de-Instalacao-Windows-PT-EN.pdf](https://github.com/user-attachments/files/31270334/Smart15-Guia-de-Instalacao-Windows-PT-EN.pdf)

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
- **André Costa** - idealization, concept and reviewer

## Base Project

Smart15 uses [GeoLibre](https://github.com/opengeos/GeoLibre) as its underlying geospatial platform.

The licenses and attribution requirements of all projects and libraries used by Smart15 must be preserved in accordance with their respective terms.

## License

See the [`LICENSE`](LICENSE) file for the project's terms of use and distribution.
