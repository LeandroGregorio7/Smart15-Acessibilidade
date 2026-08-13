# Smart15 — Technical Overview

## Overview

Smart15 is a geospatial analysis platform designed to support accessibility studies based on the **15-Minute City** concept.

Rather than relying exclusively on Euclidean distance, Smart15 estimates pedestrian and cyclist accessibility using the street network while incorporating environmental and mobility-related factors that may affect travel conditions.

The platform combines street-network analysis, remote sensing data, geospatial processing, land-cover classification, and interactive visualization within a web-based environment built on GeoLibre.

## Accessibility Analysis

Smart15 models accessibility through the actual street network obtained from OpenStreetMap.

The analysis considers factors such as:

- travel time through the street network;
- terrain slope;
- land surface temperature (LST);
- vegetation cover and potential shading;
- user mobility profile;
- distribution of urban services and facilities.

Different mobility profiles can be used to represent adults, children, and older adults traveling either on foot or by bicycle.

## Digital Elevation Model and Terrain Slope

Elevation data can be obtained from Copernicus DEM.

Geographic coordinates are transformed into an appropriate metric coordinate reference system for spatial calculations. Terrain slope is then incorporated into the network analysis to adjust theoretical travel speeds according to topographic conditions.

The processing workflow uses a slope-dependent mobility model based on Tobler's hiking function to represent the effect of terrain inclination on movement.

## Land Surface Temperature

Smart15 integrates land surface temperature data derived from Landsat imagery accessed through Microsoft Planetary Computer.

Thermal information can be incorporated into the accessibility model to represent the potential impact of heat exposure on mobility, particularly for profiles with different environmental tolerance parameters.

## Vegetation and Land-Cover Classification

Vegetation and land-cover information can be obtained from remote sensing imagery or user-provided orthophotos.

Smart15 includes an object-based image analysis (OBIA) workflow using a Decision Tree classifier trained from user-provided samples.

The classification process can distinguish land-cover categories such as:

- asphalt;
- sidewalks;
- buildings;
- trees;
- grass;
- bare soil.

Radiometric information, including the Normalized Green Red Difference Index (NGRDI), is used as part of the classification workflow.

The resulting information can be incorporated into the accessibility analysis to represent the potential influence of vegetation and shading.

## Handling Missing Raster Data

The raster-processing workflow includes mechanisms for handling missing or invalid values.

These safeguards prevent unavailable raster values, including `NaN` values near dataset boundaries, from interrupting street-network processing and accessibility calculations.

## Multi-Profile Simulation

Smart15 supports different pedestrian and cyclist mobility profiles.

Profiles can represent:

- adults;
- children;
- older adults;
- walking;
- cycling.

Each profile can use different travel speeds and environmental tolerance parameters.

## Isochrones and Hexagonal Grids

Simulation results can be represented through two complementary spatial structures:

### Isochrones

Isochrones represent continuous areas that can be reached within defined travel-time intervals.

### Hexagonal Grids

Smart15 also uses H3 hexagonal spatial indexing to aggregate and represent accessibility indicators across the study area.

The platform distinguishes travel-time ranges up to 15 minutes and can also represent areas beyond this threshold as low-accessibility or penalty areas.

## Interactive Visualization

Smart15 provides interactive tools for exploring simulation results.

### Feature Identification

Users can inspect map features and retrieve information such as:

- travel time;
- mobility profile;
- urban facility categories;
- environmental indicators;
- land-cover classification results.

### Comparison Swipe

A swipe visualization tool allows users to compare different map configurations or scenarios by dividing the visualization area.

### Dynamic Raster Legends

Raster layers can display their corresponding value ranges, allowing users to interpret environmental variables such as elevation, terrain slope, and land surface temperature.

### 3D Visualization

When applicable, simulation layers can be rendered using MapLibre/WebGL-based 3D visualization.

## Result Export

Smart15 supports the export of geospatial results in formats including:

- Shapefile;
- GeoJSON;
- KML;
- ZIP archives containing generated outputs.

The platform also provides map capture and automated technical report generation.

## Technology Stack

### Backend

The geospatial processing backend is implemented in Python and uses technologies including:

- FastAPI;
- GeoPandas;
- OSMnx;
- NetworkX;
- Rasterio;
- Shapely;
- Scikit-learn;
- pystac-client;
- stackstac.

### Frontend and Geospatial Platform

The user interface is implemented as a plugin integrated with GeoLibre and uses:

- TypeScript;
- JavaScript;
- Vite;
- React components;
- MapLibre GL;
- GeoJSON;
- WebGL.

### Infrastructure

The execution environment uses:

- Docker;
- Docker Compose;
- Nginx;
- Git submodules.

## System Architecture

At a high level, Smart15 consists of:

1. the GeoLibre web-based geospatial environment;
2. the Smart15 frontend plugin;
3. a FastAPI geospatial processing backend;
4. external geospatial and remote sensing data sources;
5. user-provided spatial data.

The frontend is responsible for user interaction, configuration, visualization, and result inspection, while computationally intensive geospatial processing is performed by the backend.

For installation instructions, see the [Smart15 Installation Guide](../instalacao.md).

For a complete description of the platform capabilities, see [Smart15 Features](../funcionalidades.md).
