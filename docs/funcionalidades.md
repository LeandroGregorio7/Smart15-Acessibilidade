# Smart15 Features

## Accessibility Simulation

Smart15 supports accessibility simulations for different mobility profiles, including travel:

- on foot;
- by bicycle;
- by adults;
- by children;
- by older adults.

Speed parameters and environmental tolerance can vary according to the selected mobility profile.

## Urban Destination Analysis

The platform evaluates access to different categories of urban services and facilities, such as:

- schools and childcare facilities;
- hospitals and clinics;
- markets and bakeries;
- parks and green areas;
- cultural facilities;
- retail and services;
- gyms and sports facilities.

## Terrain Slope and Elevation

Terrain elevation can be obtained from digital elevation models, including Copernicus DEM data.

Terrain slope is incorporated into travel calculations to represent the impact of uphill and downhill movement on pedestrian and cyclist speeds.

## Land Surface Temperature

The platform can retrieve land surface temperature data from Landsat imagery through Microsoft Planetary Computer.

These data help identify areas with greater heat exposure and estimate their potential impact on travel comfort.

## Vegetation Cover

Vegetation cover can be estimated from satellite imagery or user-provided orthophotos.

The processing workflow enables land-cover classification and incorporates the potential effects of vegetation and shading into the accessibility analysis.

## Data Upload

The application supports user-provided data, including:

- GeoJSON files;
- training samples for classification;
- orthophotos;
- study area geometries.

## Isochrones and Spatial Aggregation

Results can be represented using:

- travel-time isochrones;
- hexagonal grids;
- areas accessible within 15 minutes;
- areas subject to penalties or low accessibility.

## Interactive Visualization

The interface allows users to:

- enable and disable layers;
- inspect map features;
- examine classes and indicators;
- visualize environmental data;
- compare scenarios;
- use 3D visualization when available;
- capture the analysis map.

## Result Export

Results can be exported in geospatial formats, including:

- GeoJSON;
- Shapefile;
- KML;
- ZIP archives containing the generated outputs.

## Automated Technical Report

At the end of a simulation, the platform generates a technical report containing:

- identification of the analyzed area;
- simulation map;
- executive summary;
- accessibility indicators;
- interpretation of the main contributing factors;
- assessment of terrain slope, land surface temperature, and vegetation;
- recommendations to support decision-making;
- information about the mobility profiles and parameters used.
