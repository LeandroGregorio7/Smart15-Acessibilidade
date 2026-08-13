# ADR-001 — Use of GeoLibre as the Smart15 Web Platform

## Status

Accepted.

## Date

2026-07-18.

## Context

Smart15 is an urban accessibility analysis platform based on the 15-Minute City concept.

The solution must allow users to:

- select a study area;
- configure mobility profiles;
- run geospatial analyses;
- visualize layers, isochrones, and points of interest;
- compare scenarios;
- export results;
- generate technical reports.

The previous version of the project was closer to a desktop application and relied on workflows involving local geospatial tools.

For the current version, the system is designed to be accessible through a web browser without requiring users to install geospatial software on their workstations.

The project requires capabilities such as cartographic visualization, layer manipulation, geographic feature interaction, and WebGL-based rendering. These capabilities are provided by GeoLibre.

GeoLibre provides a web-based environment for geospatial visualization and supports interface extension through plugins.

## Decision

GeoLibre is adopted as the web-based geospatial platform for Smart15.

Smart15 is integrated with a GeoLibre fork maintained by the GeoSmart organization.

The fork is used to:

- control the GeoLibre version adopted by the project;
- integrate the Smart15 plugin;
- adapt the build process;
- configure the application for deployment;
- apply interface and visual identity adaptations when necessary.

Smart15-specific business and geospatial analysis logic is not incorporated directly into the GeoLibre core.

The Smart15-specific user interface is implemented through the Smart15 plugin, while computationally intensive geospatial processing is performed by a separate backend.

## Resulting Architecture

The solution is organized as follows:

```text
User
  │
  ▼
GeoLibre Web
  │
  ▼
Smart15 Plugin
  │
  ▼
Smart15 Backend
```

GeoLibre is primarily responsible for:

- providing the web-based geospatial environment;
- displaying the map;
- managing layers;
- supporting interaction with geographic features;
- loading and executing the Smart15 plugin;
- rendering results received from the backend.

The Smart15 plugin provides the project-specific user interface and mediates interactions between GeoLibre and the Smart15 backend.

## Alternatives Considered

### Develop a Web-Based Geospatial Application from Scratch

This alternative would provide greater freedom over the user interface and system architecture.

However, it would require reimplementing capabilities already available in GeoLibre, including:

- map management;
- layer loading and management;
- cartographic controls;
- map navigation;
- WebGL rendering;
- integration with geospatial formats;
- plugin infrastructure.

This approach would increase development time, implementation effort, and project risk.

### Maintain the Project Exclusively as a Desktop Application

This alternative would require fewer changes to the previous architecture.

However, it would introduce important limitations:

- local installation requirements;
- greater difficulty in distributing updates;
- dependency on the user's local environment;
- reduced ease of demonstration;
- greater complexity for institutional deployment;
- limited accessibility across different devices.

### Modify the GeoLibre Core Directly

This alternative would allow Smart15 functionality to be incorporated directly into the main GeoLibre codebase.

However, it would increase coupling between Smart15 and GeoLibre, making the following activities more difficult:

- incorporating updates from the upstream project;
- maintenance;
- identifying Smart15-specific modifications;
- reusing the Smart15 plugin;
- isolating failures.

## Positive Consequences

- Reduced effort required to develop the geospatial user interface.
- Browser-based access to the system.
- Reuse of existing GeoLibre capabilities.
- Separation between the geospatial platform and Smart15-specific logic.
- Ability to incorporate upstream GeoLibre updates into the fork in a controlled manner.
- Improved traceability of project-specific changes.
- Easier server deployment.
- Easier demonstration and use in the university environment.

## Negative Consequences

- Technological dependency on GeoLibre.
- Need to monitor changes in the upstream project.
- Potential incompatibilities between new GeoLibre versions and the Smart15 plugin.
- Need to maintain a fork.
- Part of the architecture and build lifecycle is constrained by GeoLibre.

## Risks

### Incompatible Changes in GeoLibre

Future GeoLibre versions may introduce changes to the plugin API or build process.

Mitigation:

- pin a specific GeoLibre version for each Smart15 release;
- use version tags;
- update the fork in a controlled manner;
- test integration before adopting new versions.

### Excessive Growth of Fork-Specific Changes

Extensive modifications to the GeoLibre core could make synchronization with the upstream project increasingly difficult.

Mitigation:

- keep Smart15-specific logic within the plugin and backend;
- avoid unnecessary changes to the GeoLibre core;
- document modifications made to the fork.

## Validation Criteria

The decision is considered validated because the current implementation demonstrates that:

- GeoLibre Web can run locally;
- the Smart15 plugin can be loaded by GeoLibre;
- the plugin can add panels and geospatial layers;
- the plugin can communicate with the Smart15 backend;
- backend results can be rendered on the map;
- the application can be built and deployed using the project's containerized environment.

## Decision Review

This decision should be reviewed if:

- GeoLibre no longer meets the project's essential requirements;
- the plugin API becomes unsuitable for Smart15;
- the cost of maintaining the fork exceeds the benefits of reusing GeoLibre;
- a mandatory institutional platform is adopted.
