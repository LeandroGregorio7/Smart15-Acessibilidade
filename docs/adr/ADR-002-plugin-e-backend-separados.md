# ADR-002 — Separation Between the Smart15 Plugin and Geospatial Backend

## Status

Accepted.

## Date

2026-07-18.

## Context

Smart15 has two main categories of responsibilities.

The first is related to user interaction and visualization:

- selecting the study area;
- configuring mobility profiles;
- selecting analysis parameters;
- submitting simulations;
- displaying processing status;
- visualizing geospatial layers;
- presenting indicators;
- generating technical reports;
- downloading results.

The second is related to computationally intensive geospatial processing:

- retrieving the street network;
- processing OpenStreetMap data;
- retrieving and processing raster data;
- calculating terrain slope;
- processing land surface temperature;
- classifying vegetation and land cover;
- applying mobility and environmental factors;
- performing network-based accessibility calculations;
- generating isochrones;
- performing H3 spatial aggregation;
- exporting geospatial files.

These two categories have different technical requirements.

The user interface runs in the browser and must remain responsive during interaction and visualization.

Geospatial processing, on the other hand, may require significant:

- CPU;
- memory;
- disk space;
- processing time;
- native geospatial libraries;
- temporary data storage.

A web browser is therefore not an appropriate environment for performing the complete geospatial processing workflow.

## Decision

The Smart15 user interface is implemented as a GeoLibre plugin.

Computationally intensive geospatial processing is implemented in a separate backend using Python and FastAPI.

Communication between the plugin and backend is performed through an HTTP API.

The main architectural separation is:

```text
Smart15 Plugin
    │
    │  User interface
    │  Simulation configuration
    │  Visualization
    │  Technical report generation
    │
    │  HTTP / JSON / GeoJSON
    ▼
Smart15 Backend
       │
       ├── API and input validation
       ├── Street-network and POI processing
       ├── Raster processing
       ├── Land-cover classification
       ├── Accessibility analysis
       ├── Isochrone and H3 processing
       └── Geospatial result export
```

This separation keeps browser-oriented responsibilities within the plugin while isolating computationally intensive processing and Python geospatial dependencies in the backend.

## Plugin Responsibilities

### The plugin is responsible for:

- presenting application controls;
- receiving user-defined parameters;
- obtaining the study area selected on the map;
- sending requests to the backend;
- presenting processing status;
- consuming backend results;
- adding resulting layers to GeoLibre;
- displaying isochrones, POIs, hexagonal grids, and other generated layers;
- presenting summarized indicators;
- generating the technical report from simulation results;
- providing access to exported results;
- presenting errors and processing messages in a user-understandable form;
- supporting interface internationalization.

### The plugin is not responsible for:

- performing computationally intensive raster processing;
- processing large street-network graphs;
- performing large-scale geospatial classification;
- retrieving and processing the external environmental datasets required by the analysis;
- generating Shapefile, KML, or other backend geospatial export products.

## Backend Responsibilities

### The backend is responsible for:

- receiving and validating analysis parameters;
- coordinating the geospatial processing workflow;
- accessing external geospatial data sources;
- retrieving and processing the street network;
- retrieving and processing POIs;
- processing raster data;
- calculating terrain slope;
- processing land surface temperature and vegetation data;
- performing land-cover classification;
- applying mobility and environmental factors;
- calculating accessibility results;
- generating isochrones and H3 aggregations;
- generating geospatial output files;
- managing temporary processing artifacts;
- making generated results available to the plugin;
- recording processing errors and execution information.

## Communication Contract

Communication between the Smart15 plugin and backend uses HTTP-based interfaces.

Depending on the operation, the exchanged data may include:

- JSON for analysis parameters, status information, metadata, and indicators;
- GeoJSON for vector geometries and analysis results;
- raster data or references to raster products when required;
- ZIP archives for grouped geospatial exports.

The frontend does not depend on the internal implementation of the geospatial processing algorithms. It communicates with the backend through the API contract and consumes the resulting data and artifacts.

GeoJSON is therefore a data exchange format rather than an independent architectural component.

## Alternatives Considered

### Perform All Processing in the Plugin

This approach would reduce the number of deployed runtime components.

However, it would be unsuitable because:

- browser resources are limited;
- the required Python geospatial ecosystem would not be directly available;
- large raster operations could block or degrade the user interface;
- computational processing would be repeated on each client workstation;
- geospatial processing would become strongly coupled to the frontend;
- reproducing and controlling the computational environment would be more difficult.

### Implement the User Interface Directly in the Backend

This alternative would allow Smart15 to be implemented as a conventional server-side web application.

However, it would reduce the benefits of using GeoLibre and make the following capabilities more difficult to reuse:

- map integration;
- layer management;
- interactive cartographic controls;
- GeoLibre's plugin architecture;
- independent evolution of the user interface.

### Incorporate Smart15 Processing into the GeoLibre Core

This alternative could reduce the number of separately managed application components.

However, it would increase coupling between Smart15-specific processing and the underlying geospatial platform.

The Smart15 backend has specialized Python and geospatial dependencies and an independent development lifecycle. Keeping it separate preserves the boundary between the GeoLibre platform and Smart15-specific analysis logic.

## Positive Consequences

- Clear separation of responsibilities.
- More responsive browser-based interface.
- Isolation of Python and native geospatial dependencies.
- Independent testing of frontend and backend.
- Improved reproducibility of the processing environment.
- Better organization of the source code.
- Lower coupling with the GeoLibre core.
- Possibility of reusing the backend through other clients or integrations.
- Independent evolution of visualization and geospatial processing.
- Easier deployment through separate containerized services.

## Negative Consequences

- More than one runtime component must be deployed.
- An API contract must be defined and maintained.
- Communication failures between frontend and backend must be handled.
- CORS or reverse-proxy configuration may be required depending on the deployment environment.
- Temporary processing artifacts must be managed.
- Frontend and backend compatibility must be maintained across releases.

## Risks

### Long-Running Processing

Some geospatial analyses may require significantly more processing time than ordinary web operations.

Mitigation:

- provide processing status information to the user;
- configure appropriate HTTP and infrastructure timeouts;
- limit excessively large study areas or inputs when necessary;
- consider asynchronous processing or processing queues if future workloads require them.

### Large Responses

Vector layers and other generated results may become large for complex study areas.

Mitigation:

- simplify geometries where appropriate;
- use compression for exported products;
- limit analysis areas when necessary;
- evaluate more efficient geospatial formats if future requirements justify them.

### Frontend and Backend Incompatibility

Changes to the communication contract may cause incompatibilities between plugin and backend versions.

Mitigation:

- document interface changes;
- test frontend/backend integration before releases;
- maintain compatible plugin and backend versions within each Smart15 release;
- introduce explicit API versioning if future evolution requires incompatible contracts.

## Implementation Requirements

The backend should:

- provide OpenAPI documentation through FastAPI;
- validate incoming parameters;
- return structured errors;
- record processing logs;
- avoid unnecessary dependence on fixed local paths or URLs;
- use environment-based configuration where appropriate;
- isolate temporary processing artifacts.

The plugin should:

- use a configurable backend endpoint;
- handle processing states;
- handle communication failures;
- avoid unnecessary dependence on absolute paths;
- validate user inputs before submitting operations;
- present processing errors clearly to the user.

## Validation Criteria

The decision is considered validated because the current implementation demonstrates that:

- the Smart15 plugin can submit analyses to the backend;
- the backend can receive and process requests;
- computationally intensive geospatial operations execute outside the browser;
- the plugin can consume and visualize generated results;
- resulting geospatial layers can be added to the GeoLibre map;
- indicators and processing information can be presented through the interface;
- geospatial results can be exported;
- technical reports can be generated from simulation results in the plugin.

## Decision Review

This decision should be reviewed if:

- geospatial processing becomes sufficiently lightweight to run efficiently in the client;
- GeoLibre introduces a native architecture that better supports Smart15's geospatial processing requirements;
- multiple specialized backend services become necessary;
- workload requirements justify adopting asynchronous processing, event-driven communication, or processing queues.
