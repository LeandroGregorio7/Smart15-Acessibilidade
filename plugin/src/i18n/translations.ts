const en = {
  // Language
  "language.label": "Language",
  "language.portuguese": "Português",
  "language.english": "English",

  // General
  "common.notProvided": "Not provided",
  "common.notAvailable": "Not available",
  "common.yes": "Yes",
  "common.no": "No",
  "ui.section.boundary":
  "1. Geographic boundary",

  "ui.methodology": "Methodology",
  "ui.help": "Help / 3D",

  "ui.downloadZip":
  "DOWNLOAD RESULTS (.ZIP)",

  "ui.section.samples":
    "2. Local samples (AI training)",

  "ui.section.destinations":
    "3. OSM destinations (subcategories)",

  "ui.section.profiles":
    "4. Mobility profiles",

  "ui.section.environment":
    "5. Environmental variables",

  "ui.section.export":
    "6. Processing formats",

  "ui.section.visualization":
    "7. Visualization and analysis",

  "ui.section.vectorLayers":
    "8. Vector layers (simulations)",

  "ui.section.rasterLayers":
    "9. Raster layers (environment)",

  "ui.basemap.default":
  "Street / GeoLibre default",

  "ui.basemap.satellite":
    "Satellite (Esri World Imagery)",

  "ui.basemap.description":
    "Use the satellite as a reference for drawing trees, roofs and other classes.",

  "ui.draw.rectangle": "Draw rectangle",
  "ui.draw.polygon": "Draw polygon",
  "ui.draw.radius": "Draw radius",
  "ui.draw.clear": "Clear geometry",

  "ui.samples.none":
  "No sample has been drawn or loaded",

  "ui.samples.upload":
  "Upload sample file",

  "ui.samples.draw":
    "Draw",

  "ui.samples.drawTitle":
    "Draw sample on map",

  "ui.captureMap":
    "Capture map (screenshot)",


  "ui.poi.essential": "Essential (Weight 3)",
  "ui.poi.important": "Important (Weight 2)",
  "ui.poi.complementary": "Complementary (Weight 1)",

  "ui.profile.walking": "Walking",
  "ui.profile.walkingAdult": "Adult (4.5 km/h)",
  "ui.profile.walkingChild": "Child (3.5 km/h)",
  "ui.profile.walkingOlderAdult": "Older adult (3.0 km/h)",

  "ui.profile.cycling": "Cycling",
  "ui.profile.cyclingAdult": "Adult (15.0 km/h)",
  "ui.profile.cyclingChild": "Child (11.0 km/h)",
  "ui.profile.cyclingOlderAdult": "Older adult (10.0 km/h)",

  "ui.export.hexagons":
  "Process H3 tessellations",

  "ui.export.isochrones":
    "Process isochrones",

  "ui.export.enable3d":
    "Enable 3D extrusion",

  "ui.export.downloadFormats":
    "Download formats (.ZIP):",


  "ui.basemap.label":
  "Background map",

  "ui.environment.vegetation":
    "RGB orthophoto / Vegetation (FIS)",

  "ui.environment.temperature":
    "LST thermal layer (FIT)",

  "ui.environment.dem":
    "DEM elevation layer (FID)",

  "ui.environment.cloudSentinel":
    "Automatic cloud (Sentinel-2)",

  "ui.environment.cloudPlanetary":
    "Automatic cloud (Planetary Computer)",

  "ui.environment.cloudCopernicus":
    "Automatic cloud (Copernicus)",

  "ui.environment.localUpload":
    "Local upload (.tif)",

  "ui.visual.timeLegend":
    "Time legend (gradient):",

  "ui.visual.minutes2":
    "2 min",

  "ui.visual.minutes5":
    "5 min",

  "ui.visual.minutes10":
    "10 min",

  "ui.visual.minutes15":
    "15 min",

  "ui.visual.penalty":
    ">15 min (Penalty)",

  "ui.visual.poiLegend":
    "POI legend (OSM):",

  "ui.visual.identify":
    "🔍 IDENTIFY FEATURES (i)",

  "ui.visual.swipe":
    "↔️ COMPARISON SWIPE",

  "ui.visual.baseArea":
    "Area (base):",

  "ui.visual.outline":
    "Outline",

  "ui.visual.mask":
    "Mask (clip):",

  "ui.visual.isolateArea":
    "✂️ Isolate study area",

  "ui.visual.aiSamples":
    "AI samples:",

  "ui.visual.isochrones":
    "Isochrones:",

  "ui.visual.hexagons":
    "Hexagons:",

  "ui.visual.outline3d":
    "3D outline",

  "sampleClass.asphalt":
  "1 - Asphalt / Road",

  "sampleClass.sidewalk":
    "2 - Sidewalk / Footway",

  "sampleClass.building":
    "3 - Building / Roof",

  "sampleClass.tree":
    "4 - Tree",

  "sampleClass.grass":
    "5 - Grass / Low vegetation",

  "sampleClass.bareSoil":
    "6 - Bare soil",

  // General actions
  "action.close": "Close",
  "action.cancel": "Cancel",
  "action.confirm": "Confirm",
  "action.download": "Download",
  "action.clear": "Clear",
  "action.import": "Import",
  "action.choose": "Choose",

  "raster.aiLegend":
  "AI legend (OBIA):",

  "layer.studyArea":
    "Geographic area (base)",

  "layer.aiSamples":
    "AI samples",

  "layer.urbanPois":
    "Urban facility POIs",

  "layer.isochrones":
    "Isochrones",

  "layer.hexagons":
    "Hexagons",


  // 6
"simulation.areaRequired":
  "Define the study area first.",

"simulation.processing":
  "PROCESSING...",

"simulation.startingMetric":
  "Starting metric calculation...",

"simulation.calculatingRasters":
  "Calculating rasters and metrics...",

"simulation.waitingServer":
  "Waiting for server...",

"simulation.routing":
  "Routing network ({value}%)...",

"simulation.drawing":
  "Rendering results...",

"simulation.serverFailed":
  "Server processing failed.",

  //Help

  "help.instructions.title":
  "How to use Smart-15",

  "help.instructions.close":
    "Close instructions",

  "help.instructions.content": `
    <p>
      <b>1. Layer order (IMPORTANT):</b>
      The map rendering engine draws layers sequentially.
      For a layer to appear <b>ON TOP</b>, move it
      <b>DOWN</b> in the layer list.
    </p>

    <p>
      <b>2. Rasters (Section 9):</b>
      If set to "Automatic cloud", the panel will use
      Microsoft Planetary Computer and AWS APIs.
    </p>

    <p>
      <b>3. 3D visualization:</b>
      Enable "3D extrusion", hold the
      <b>RIGHT MOUSE BUTTON</b> and drag to tilt the camera.
    </p>

    <p>
      <b>4. Visual clipping (Mask):</b>
      In Section 7, enable "✂️ Isolate municipality"
      to hide the surroundings and focus on the study geometry.
    </p>

    <p>
      <b>5. Inspect data (Popups):</b>
      Enable "🔍 IDENTIFY FEATURES (i)".
      Move the pointer over any geometry to inspect travel time,
      profile, OSM destination categories, and AI classifications.
      For exact satellite values such as temperature and elevation,
      use the <b>dynamic raster legend</b> in Section 7.
    </p>

    <p>
      <b>6. Comparative swipe:</b>
      When swipe mode is enabled, the map is divided into two views.
      Hide or show layers using the eye icon.
      The <b>left</b> side preserves the previous scenario,
      while the <b>right</b> side reflects the current changes.
    </p>

    <p>
      <b>7. Export report:</b>
      Use the "Generate technical report" button to create
      a printable report containing the map and analysis results.
    </p>

    <p>
      <b>8. Export data:</b>
      Use the results download button to obtain the generated
      geospatial files.
    </p>

    <p>
      <b>9. AI and training samples (Draw or upload GeoJSON):</b>
      <br>
      • <b>Draw on the map:</b>
      switch the background map to <i>Satellite</i> in Section 2,
      select a class, and draw the sample polygon on the map.
      Use the right mouse button to close the polygon.
      <br>
      • <b>Upload an external GeoJSON:</b>
      the attribute table must contain a
      <code>classe</code> field with values from
      <b>1 to 6</b>:
      1-Asphalt, 2-Sidewalk, 3-Building,
      4-Tree, 5-Grass, 6-Bare soil.
      If you want to include a textual class name,
      create a separate <code>descritor</code> field.
    </p>
  `,

  "help.methodology.title":
    "Methodology and glossary (Smart-15)",

  "help.methodology.close":
    "Close glossary",

  "help.methodology.content": `
    <p>
      <b>1. Georeferenced metric projection:</b>
      The street network is projected from WGS84 geographic coordinates
      to the local UTM coordinate reference system before routing,
      ensuring that distances and isochrone areas are calculated in metric units.
    </p>

    <p>
      <b>2. Isochrones and morphological dilation:</b>
      Polygons are generated from travel-time distances along the actual
      street network using NetworkX and OSMnx.
      A morphological buffer is applied to network edges to close gaps
      and produce continuous accessibility areas.
    </p>

    <p>
      <b>3. Hexagonal indexing (H3):</b>
      The H3 hierarchical spatial indexing system is used to tessellate
      the study area at resolution 10, enabling uniform and comparable
      statistical analyses across the territory.
    </p>

    <p>
      <b>4. Intelligent classification (AI):</b>
      An OBIA / Decision Tree classifier is trained from user-provided
      vector samples to identify land-cover classes using radiometric
      information derived from the orthophoto, including NGRDI.
    </p>

    <p>
      <b>5. Tobler function (DEM):</b>
      Digital Elevation Models are incorporated to adjust the theoretical
      walking and cycling speeds according to terrain slope.
    </p>

    <p>
      <b>6. Thermal penalty (LST):</b>
      A thermal friction factor derived from land surface temperature
      is used to represent the potential reduction in mobility under
      high-heat conditions, particularly for vulnerable groups.
    </p>

    <hr class="s15-border" style="margin: 15px 0;">

    <h3
      class="s15-title"
      style="font-size: 14px; margin-bottom: 8px;"
    >
      References
    </h3>

    <ul style="margin-top: 0; padding-left: 20px;">
      <li style="margin-bottom: 4px;">
        BOEING, G. (2017).
        <i>
          OSMnx: New methods for acquiring, constructing,
          analyzing, and visualizing complex street networks
        </i>.
        Computers, Environment and Urban Systems.
      </li>

      <li style="margin-bottom: 4px;">
        BREIMAN, L., et al. (1984).
        <i>Classification and Regression Trees</i>.
        Wadsworth. (OBIA / Decision Trees).
      </li>

      <li style="margin-bottom: 4px;">
        TOBLER, W. (1993).
        <i>Three presentations on geographical analysis and modeling</i>.
        National Center for Geographic Information and Analysis.
      </li>

      <li style="margin-bottom: 4px;">
        UBER TECHNOLOGIES. (2018).
        <i>H3: Uber’s Hexagonal Hierarchical Spatial Index</i>.
      </li>
    </ul>
  `,

  // Simulation
  "simulation.run": "Run urban simulation",
  "simulation.running": "Processing...",
  "simulation.completed": "Simulation completed",
  "simulation.failed": "The simulation could not be completed.",
  "simulation.selectArea": "Select an area of interest.",
  "simulation.clearLayers": "Clear layers",

  // Report
  "report.generate": "Generate technical report",
  "report.generating": "Generating report...",
  "report.title": "Urban accessibility report",
  "report.subtitle":
    "Smart15 — decision support for urban mobility",
  "report.executiveSummary": "Executive summary",
  "report.identification":
    "Analysis identification",
  "report.configuration":
    "Simulation configuration",
  "report.indicators":
    "Accessibility indicators",
  "report.factorImpacts":
    "Influencing factors",
  "report.recommendations":
    "Recommendations",
  "report.methodology":
    "Methodological notes",
  "report.map":
    "Map of the study area",
  "report.generatedAt":
    "Report generated on {date}",
  "report.area":
    "Study area",
  "report.municipality":
    "Municipality",
  "report.state":
    "State",
  "report.notAvailable":
    "Not available",

  // Report adapter
"adapter.studyArea":
  "Study area",

"adapter.selectedMapArea":
  "Area selected on the map",

"adapter.map.title":
  "Map of the analyzed area",

"adapter.map.description":
  "Study area used in the simulation.",


  // Report — mobility contexts
"report.mobility.mixed.title":
  "Urban Accessibility Analysis Report",

"report.mobility.mixed.short":
  "Urban Accessibility",

"report.mobility.mixed.movement":
  "walking and cycling trips",

"report.mobility.mixed.speed":
  "Reference base speed",

"report.mobility.mixed.footer":
  "urban accessibility",

"report.mobility.bike.title":
  "Cycling Accessibility Analysis Report",

"report.mobility.bike.short":
  "Cycling Accessibility",

"report.mobility.bike.movement":
  "cycling trips",

"report.mobility.bike.speed":
  "Cycling base speed",

"report.mobility.bike.footer":
  "cycling accessibility",

"report.mobility.walk.title":
  "Walkability Analysis Report",

"report.mobility.walk.short":
  "Walkability",

"report.mobility.walk.movement":
  "walking trips",

"report.mobility.walk.speed":
  "Walking base speed",

"report.mobility.walk.footer":
  "walkability",

// Report — buttons and header
"report.print.title":
  "Print or save report as PDF",

"report.print.button":
  "Print / Save PDF",

"report.header.area":
  "Area:",

"report.header.destination":
  "Destination:",

"report.header.generatedAt":
  "Generated on:",

"report.destination.notProvided":
  "Destination not provided",

// Report — sections
"report.section.executive":
  "1. Executive summary",

"report.section.identification":
  "2. Area identification and characterization",

"report.section.configuration":
  "3. Simulation configuration",

"report.section.results":
  "4. Simulation results",

"report.section.interpretation":
  "5. Technical interpretation",

"report.section.recommendations":
  "6. Recommendations for urban planning",

"report.section.sources":
  "7. Data sources, parameters, and limitations",

// Executive summary labels
"report.executive.status":
  "Status:",

"report.executive.priority":
  "Priority:",

"report.executive.conclusion":
  "Conclusion:",

"report.executive.analysis":
  "Analysis:",

"report.executive.priorityFactors":
  "Priority factors:",

"report.executive.action":
  "Recommended action:",

"report.executive.noPriorityFactors":
  "No priority factors were identified.",

// Identification
"report.identification.analysisId":
  "Analysis identifier",

"report.identification.location":
  "Municipality/State",

"report.identification.area":
  "Analyzed area",

"report.identification.destination":
  "Analyzed destination",

"report.identification.crs":
  "Coordinate reference system",

"report.identification.analysisConsiders":
  "The analysis considers",

"report.identification.to":
  "to",

"report.identification.networkDistance":
  "The calculated network distance was",

"report.identification.noNetworkDistance":
  "Network distance was not provided by the current processing workflow.",

// Configuration
"report.configuration.parameter":
  "Parameter",

"report.configuration.value":
  "Value",

"report.configuration.targetTime":
  "Target time",

"report.configuration.profiles":
  "Mobility profiles",

"raster.lst":
  "LST (Heat)",

"raster.dem":
  "DEM (Elevation)",

"raster.slope":
  "Slope (%)",

"raster.orthophoto":
  "Orthophoto",

"raster.ngrdi":
  "NGRDI index",

"raster.aiClassification":
  "AI classification (OBIA)",

// Metrics
"report.metric.distance":
  "Distance",

"report.metric.baseTime":
  "Unweighted travel time",

"report.metric.adjustedTime":
  "Adjusted travel time",

"report.metric.factorDifference":
  "Difference produced by the factors",

"report.metric.averageSpeed":
  "Average speed",

"report.metric.reachableArea":
  "Reachable area",

// Factor blocks
"report.factor.timeImpact":
  "Estimated impact on travel time:",

"report.factor.observedValue":
  "Observed value:",

"report.factor.relatedRecommendations":
  "Related recommendations",

"report.factor.noRecommendations":
  "No priority recommendations were identified for this factor.",

// Technical summary
"report.summary.withinTarget":
  "The result is within the {target}-minute threshold defined for the analysis.",

"report.summary.aboveTarget":
  "The adjusted travel time exceeds the {target}-minute threshold defined for the analysis.",

"report.summary.noAdjustedTime":
  "The adjusted travel time could not be determined from the currently available data.",

"report.summary.restrictiveFactors":
  "The factors with the highest level of restriction were: {factors}.",

"report.summary.noRestrictiveFactors":
  "No factors were classified as having high or critical influence.",

// Recommendations
"report.recommendations.none":
  "No priority recommendations were generated based on the currently evaluated criteria.",

// Sources and limitations
"report.sources.title":
  "Data sources",

"report.sources.none":
  "Data sources were not provided.",

"report.limitations.title":
  "Analysis limitation:",

"report.limitations.description":
  "The results represent an estimate produced from the available data layers, configured parameters, and the travel model used. Temporary conditions, unregistered obstacles, and recent changes in the urban environment may not be represented.",

// Footer
"report.footer.generated":
  "Report automatically generated by the Smart15 {analysis} analysis plugin.",

"report.footer.pluginVersion":
  "Plugin version: {version}.",

"report.footer.algorithmVersion":
  "Algorithm version: {version}.",

// Errors
"report.error.popupBlocked":
  "The report could not be opened. Check whether the browser blocked the new window.",

  // Influence levels
  "level.positive": "Favorable",
  "level.neutral": "Neutral",
  "level.low": "Low influence",
  "level.moderate": "Moderate influence",
  "level.high": "High influence",
  "level.critical": "Critical influence",

  // Factors
  "factor.temperature":
    "Land surface temperature",
  "factor.slope":
    "Slope",
  "factor.treeCoverage":
    "Estimated tree cover",
  "factor.pavement":
    "Pavement quality",
  "factor.crossings":
    "Pedestrian crossings",
  "factor.accessibility":
    "Accessibility",


  // Factor interpretations — slope
  "factor.slope.description.low":
    "The average slope was {average}%, indicating a low influence on walking effort and travel time.",

  "factor.slope.description.moderate":
    "The average slope was {average}%, with a maximum of {maximum}%. This factor has a moderate influence on the required effort and travel speed.",

  "factor.slope.description.high":
    "The average slope was {average}%, reaching {maximum}% in some segments. This factor represents a relevant limitation to walkability, especially for older adults, children, and people with reduced mobility.",

  "factor.slope.recommendation.alternativeRoutes":
    "Assess alternative routes with gentler slopes.",

  "factor.slope.recommendation.sidewalkContinuity":
    "Assess sidewalk continuity and surface regularity along sloped segments.",

  "factor.slope.recommendation.accessibility":
    "Prioritize accessibility improvements along the steepest segments.",

  "factor.slope.recommendation.accessibleRoutes":
    "Prioritize accessible routes with gentler slopes.",

  "factor.slope.recommendation.restAreas":
    "Provide rest areas along segments requiring greater physical effort.",

  "factor.slope.recommendation.ramps":
    "Assess ramps, handrails, and other accessibility improvements.",

  "factor.slope.recommendation.signage":
    "Provide signage for alternative routes with gentler slopes.",

  // Tree cover
  "factor.treeCoverage.description.positive":
    "Estimated tree cover was {coverage}%, representing favorable conditions for thermal comfort and the walking experience.",

  "factor.treeCoverage.description.moderate":
    "Estimated tree cover was {coverage}%. Vegetation provides partial protection along the route, although some segments may offer lower thermal comfort.",

  "factor.treeCoverage.description.high":
    "Estimated tree cover was only {coverage}%, according to the automated classification of the image used in the simulation. Limited shade availability may reduce pedestrian comfort, particularly during periods of higher temperature.",

  "factor.treeCoverage.recommendation.preserve":
    "Preserve the existing tree cover.",

  "factor.treeCoverage.recommendation.maintenance":
    "Maintain regular vegetation management and conservation activities.",

  "factor.treeCoverage.recommendation.expand":
    "Expand tree cover along segments with lower coverage.",

  "factor.treeCoverage.recommendation.species":
    "Prioritize tree species compatible with sidewalks and urban infrastructure.",

  "factor.treeCoverage.recommendation.greenCorridors":
    "Develop green corridors along major walking routes.",

  "factor.treeCoverage.recommendation.planting":
    "Prioritize tree planting in segments with greater solar exposure.",

  "factor.treeCoverage.recommendation.infrastructure":
    "Integrate tree planting, sidewalks, and infrastructure networks in urban planning.",

  // Temperature
  "factor.temperature.maximum":
    ", with an estimated maximum of {maximum} °C",

  "factor.temperature.description.positive":
    "Estimated average land surface temperature was {average} °C{maximumText}, indicating favorable thermal exposure conditions for travel.",

  "factor.temperature.description.moderate":
    "Estimated average land surface temperature was {average} °C{maximumText}. Thermal exposure deserves attention in unshaded segments, particularly during the hottest periods.",

  "factor.temperature.description.high":
    "Estimated average land surface temperature was {average} °C{maximumText}. The result indicates high thermal exposure, which may reduce comfort and walking viability, especially for children, older adults, and people with reduced mobility.",

  "factor.temperature.recommendation.preserve":
    "Preserve existing shading and thermal comfort conditions.",

  "factor.temperature.recommendation.shade":
    "Prioritize tree planting and shading along the most exposed segments.",

  "factor.temperature.recommendation.restAreas":
    "Provide rest areas along routes with longer pedestrian exposure.",

  "factor.temperature.recommendation.priorityShade":
    "Implement tree planting and shading solutions along priority segments.",

  "factor.temperature.recommendation.furniture":
    "Integrate street furniture and rest areas into the most exposed routes.",

  "factor.temperature.recommendation.coolerRoutes":
    "Prioritize routes with greater thermal comfort in signage and planning.",

  // Pavement
  "factor.pavement.description.positive":
    "{adequate}% of the route was classified as having adequate pavement. Pavement conditions support continuity of travel.",

  "factor.pavement.description.moderate":
    "{adequate}% of the route has adequate pavement. Localized limitations may affect comfort or accessibility.",

  "factor.pavement.description.high":
    "Only {adequate}% of the route has pavement considered adequate. This condition represents an important barrier to pedestrian travel.",

  "factor.pavement.recommendation.maintenance":
    "Maintain preventive sidewalk maintenance activities.",

  "factor.pavement.recommendation.mapSegments":
    "Map discontinuous or deteriorated segments.",

  "factor.pavement.recommendation.recovery":
    "Prioritize sidewalk rehabilitation near essential destinations.",

  "factor.pavement.recommendation.repair":
    "Repair sidewalk segments in inadequate condition.",

  "factor.pavement.recommendation.obstacles":
    "Remove level differences, obstacles, and discontinuities.",

  "factor.pavement.recommendation.standards":
    "Apply accessibility standards to planned interventions.",

  // Accessibility
  "factor.accessibility.description.positive":
    "{accessible}% of the analyzed segments were classified as accessible.",

  "factor.accessibility.description.moderate":
    "{accessible}% of the segments were classified as accessible. The route provides partial accessibility conditions, with possible interruptions along the way.",

  "factor.accessibility.description.critical":
    "Only {accessible}% of the segments were classified as accessible. The result indicates poor continuity for people with reduced mobility.",

  "factor.accessibility.recommendation.preserve":
    "Preserve the continuity of the accessible route.",

  "factor.accessibility.recommendation.interruptions":
    "Identify and correct interruptions in the accessible route.",

  "factor.accessibility.recommendation.connections":
    "Prioritize connections between sidewalks, ramps, and crossings.",

  "factor.accessibility.recommendation.plan":
    "Develop a priority plan for sidewalk accessibility improvements.",

  "factor.accessibility.recommendation.ramps":
    "Implement accessible ramps and crossings.",

  "factor.accessibility.recommendation.removeObstacles":
    "Remove obstacles and correct level differences.",

  // Calculation context
  "factor.calculation.noWeight":
    "{description} This factor was identified in the diagnosis but was not assigned a weight in the adjusted travel-time calculation for this simulation.",

  // Executive summary
  "executive.status.adequate":
    "Adequate",

  "executive.status.attention":
    "Attention",

  "executive.status.critical":
    "Critical",

  "executive.priority.low":
    "Low",

  "executive.priority.medium":
    "Medium",

  "executive.priority.high":
    "High",

  "executive.critical.headline":
    "Priority intervention recommended",

  "executive.critical.timeExceeded":
    "The adjusted travel time of {adjusted} min exceeds the target of {target} min.",

  "executive.critical.factors":
    "Critical restrictive factors were identified in the analyzed area.",

  "executive.critical.action":
    "Prioritize interventions along critical segments and assess accessible alternative routes before new expansion investments.",

  "executive.attention.headline":
    "Accessibility within the target, with relevant constraints",

  "executive.attention.withTime":
    "The adjusted travel time of {adjusted} min meets the target of {target} min, but route improvements are still required.",

  "executive.attention.withoutTime":
    "The simulation did not provide an adjusted travel time, but relevant route constraints were identified.",

  "executive.attention.action":
    "Plan gradual interventions addressing the restrictive factors and monitor their effects in subsequent simulations.",

  "executive.adequate.headline":
    "Overall favorable condition",

  "executive.adequate.withTime":
    "The adjusted travel time of {adjusted} min meets the target of {target} min, with no factors classified as high or critical.",

  "executive.adequate.withoutTime":
    "No factors were classified as high or critical based on the available data.",

  "executive.adequate.action":
    "Maintain existing conditions, monitor the area, and preserve elements that contribute positively to accessibility.",


  // Profiles
  "profile.adulto_pedestre":
    "Adult — walking",
  "profile.pedestre_crianca":
    "Child — walking",
  "profile.pedestre_idoso":
    "Older adult — walking",

  "profile.adulto_bike":
    "Adult — cycling",
  "profile.ciclista_crianca":
    "Child — cycling",
  "profile.ciclista_idoso":
    "Older adult — cycling",

  // Destinations
  "target.escolas":
    "Schools and childcare facilities",
  "target.hospitais":
    "Hospitals and clinics",
  "target.mercados":
    "Markets and bakeries",
  "target.parques":
    "Parks and public squares",
  "target.cultura":
    "Cultural facilities and museums",
  "target.comercio":
    "Local retail and services",
  "target.academias":
    "Gyms and sports facilities",

  // Interpolated values
  "report.areaValue":
    "{value} km²",
  "report.minutesValue":
    "{value} min",
  "report.percentageValue":
    "{value}%",

  // Theme
  "theme.dark":
    "Dark mode",
  "theme.light":
    "Light mode",

  // Map / layers
  "map.legend":
    "Legend",
  "layer.moveUp":
    "Move layer up",
  "layer.moveDown":
    "Move layer down",
  "layer.toggleVisibility":
    "Show/hide layer",

  "map.legend.studyArea": "Study area",
  "map.legend.upToMinutes": "Up to {value} min",
  "map.legend.overMinutes": "More than {value} min",

  // Area
  "area.noneDefined":
    "No boundary defined",
  "area.captured":
    "Captured!",
  "area.study":
    "Study area",
} as const;

export type TranslationKey =
  keyof typeof en;

const ptBR: Record<
  TranslationKey,
  string
> = {
  // Idioma
  "language.label": "Idioma",
  "language.portuguese": "Português",
  "language.english": "English",

  // Geral
  "common.notProvided": "Não informado",
  "common.notAvailable": "Não disponível",
  "common.yes": "Sim",
  "common.no": "Não",
  "ui.section.boundary":
    "1. Limite geográfico",

  "ui.methodology": "Metodologia",
  "ui.help": "Ajuda / 3D",

  "ui.section.samples":
    "2. Amostras locais (treinamento IA)",

  "ui.section.destinations":
    "3. Destinos OSM (subcategorias)",

  "ui.section.profiles":
    "4. Perfis de mobilidade",  

  "ui.section.environment":
    "5. Variáveis ambientais",

  "ui.section.export":
    "6. Formatos de processamento",

  "ui.section.visualization":
    "7. Visualização e análise",

  "ui.section.vectorLayers":
    "8. Camadas de vetores (simulações)",

  "ui.section.rasterLayers":
    "9. Camadas de rasters (ambiente)",

    "ui.downloadZip":
  "BAIXAR RESULTADOS (.ZIP)",

  "ui.samples.upload":
    "Enviar arquivo de amostras",

  "ui.samples.draw":
    "Desenhar",

  "ui.samples.drawTitle":
    "Desenhar amostra no mapa",

  "ui.captureMap":
    "Capturar mapa (screenshot)",

  "ui.samples.none":
  "Nenhuma amostra desenhada ou carregada",

  "ui.basemap.default":
  "Rua / padrão do GeoLibre",

  "ui.basemap.satellite":
    "Satélite (Esri World Imagery)",

  "ui.basemap.description":"Use a imagem de satélite como referência para desenhar árvores, telhados e outras classes.",

  "ui.draw.rectangle": "Desenhar retângulo",
  "ui.draw.polygon": "Desenhar polígono",
  "ui.draw.radius": "Desenhar raio",
  "ui.draw.clear": "Limpar geometria",

  "ui.poi.essential": "Essenciais (Peso 3)",
  "ui.poi.important": "Importantes (Peso 2)",
  "ui.poi.complementary": "Complementares (Peso 1)",

  "ui.profile.walking": "A pé (Pedestres)",
  "ui.profile.walkingAdult": "Adulto (4,5 km/h)",
  "ui.profile.walkingChild": "Criança (3,5 km/h)",
  "ui.profile.walkingOlderAdult": "Pessoa idosa (3,0 km/h)",

  "ui.profile.cycling": "Ciclismo (Bicicletas)",
  "ui.profile.cyclingAdult": "Adulto (15,0 km/h)",
  "ui.profile.cyclingChild": "Criança (11,0 km/h)",
  "ui.profile.cyclingOlderAdult": "Pessoa idosa (10,0 km/h)",

  "ui.export.hexagons":
  "Processar tesselações (H3)",

  "ui.export.isochrones":
    "Processar isócronas",

  "ui.export.enable3d":
    "Ativar extrusão 3D na tela",

  "ui.export.downloadFormats":
    "Formatos de download (.ZIP):",

  "ui.basemap.label":
  "Mapa de fundo",

  "ui.environment.vegetation":
    "Ortofoto RGB / Vegetação (FIS)",

  "ui.environment.temperature":
    "Camada térmica LST (FIT)",

  "ui.environment.dem":
    "Camada de relevo DEM (FID)",

  "ui.environment.cloudSentinel":
    "Cloud automático (Sentinel-2)",

  "ui.environment.cloudPlanetary":
    "Cloud automático (Planetary Computer)",

  "ui.environment.cloudCopernicus":
    "Cloud automático (Copernicus)",

  "ui.environment.localUpload":
    "Upload local (.tif)",

  "ui.visual.timeLegend":
    "Legenda de tempo (degradê):",

  "ui.visual.minutes2":
    "2 min",

  "ui.visual.minutes5":
    "5 min",

  "ui.visual.minutes10":
    "10 min",

  "ui.visual.minutes15":
    "15 min",

  "ui.visual.penalty":
    ">15 min (Penalidade)",

  "ui.visual.poiLegend":
    "Legenda de POIs (OSM):",

  "ui.visual.identify":
    "🔍 ATIVAR IDENTIFICADOR (i)",

  "ui.visual.swipe":
    "↔️ CORTINA COMPARATIVA (SWIPE)",

  "ui.visual.baseArea":
    "Área (base):",

  "ui.visual.outline":
    "Contorno",

  "ui.visual.mask":
    "Máscara (clip):",

  "ui.visual.isolateArea":
    "✂️ Isolar área de estudo",

  "ui.visual.aiSamples":
    "Amostras IA:",

  "ui.visual.isochrones":
    "Isócronas:",

  "ui.visual.hexagons":
    "Hexágonos:",

  "ui.visual.outline3d":
    "Contorno 3D",

  "sampleClass.asphalt":
  "1 - Asfalto / Via",

  "sampleClass.sidewalk":
    "2 - Calçada / Passeio",

  "sampleClass.building":
    "3 - Construção / Telhado",

  "sampleClass.tree":
    "4 - Árvore",

  "sampleClass.grass":
    "5 - Grama / Rasteira",

  "sampleClass.bareSoil":
    "6 - Terra exposta",



  //Ajuda


  "help.instructions.title":
  "Como utilizar o Smart-15",

  "help.instructions.close":
    "Fechar instruções",

  "help.instructions.content": `
    <p>
      <b>1. Ordem das camadas (IMPORTANTE):</b>
      O motor gráfico do painel desenha o mapa sequencialmente.
      Para uma camada ficar <b>POR CIMA</b>, mova-a
      <b>PARA BAIXO</b> na lista de camadas.
    </p>

    <p>
      <b>2. Rasters (Seção 9):</b>
      Se estiver configurado como "Cloud automático",
      o painel utilizará as APIs do Microsoft Planetary Computer
      e da AWS.
    </p>

    <p>
      <b>3. Visualização 3D:</b>
      Ative "Extrusão 3D", segure o
      <b>BOTÃO DIREITO</b> do mouse e arraste para inclinar a câmera.
    </p>

    <p>
      <b>4. Recorte visual (Máscara):</b>
      Na Seção 7, ative "✂️ Isolar município"
      para esconder o entorno e focar apenas na geometria de estudo.
    </p>

    <p>
      <b>5. Consultar dados (Popups):</b>
      Ative "🔍 IDENTIFICAR FEIÇÕES (i)".
      Passe o cursor sobre uma geometria para consultar tempo,
      perfil, categorias de destinos OSM e classificações da IA.
      Para consultar valores exatos dos rasters,
      como temperatura e elevação, utilize a
      <b>legenda dinâmica dos rasters</b> na Seção 7.
    </p>

    <p>
      <b>6. Cortina comparativa (Swipe):</b>
      Ao ativar a cortina, o mapa é dividido em duas visualizações.
      Oculte ou exiba camadas utilizando o ícone de olho.
      O lado <b>esquerdo</b> preserva o cenário anterior,
      enquanto o lado <b>direito</b> reflete as alterações atuais.
    </p>

    <p>
      <b>7. Exportar relatório:</b>
      Utilize o botão "Gerar relatório técnico" para criar
      um relatório imprimível contendo o mapa e os resultados
      da análise.
    </p>

    <p>
      <b>8. Exportar dados:</b>
      Utilize o botão de download dos resultados para obter
      os arquivos geoespaciais gerados.
    </p>

    <p>
      <b>9. IA e amostras de treinamento
      (Desenhar ou enviar GeoJSON):</b>
      <br>
      • <b>Desenhar no mapa:</b>
      altere o mapa de fundo para <i>Satélite</i> na Seção 2,
      selecione a classe e desenhe o polígono da amostra.
      Utilize o botão direito do mouse para fechar o polígono.
      <br>
      • <b>Enviar um GeoJSON externo:</b>
      a tabela de atributos deve possuir o campo
      <code>classe</code> preenchido com valores de
      <b>1 a 6</b>:
      1-Asfalto, 2-Calçada, 3-Construção,
      4-Árvore, 5-Grama, 6-Terra exposta.
      Se desejar incluir o nome textual da classe,
      utilize um campo separado chamado <code>descritor</code>.
    </p>
  `,

  "help.methodology.title":
  "Metodologia e glossário (Smart-15)",

  "help.methodology.close":
    "Fechar glossário",

  "help.methodology.content": `
    <p>
      <b>1. Projeção métrica georreferenciada:</b>
      A malha viária é projetada das coordenadas geográficas WGS84
      para o sistema UTM local antes do roteamento,
      garantindo que distâncias e áreas das isócronas sejam calculadas
      em unidades métricas.
    </p>

    <p>
      <b>2. Isócronas e dilatação morfológica:</b>
      Os polígonos são gerados a partir das distâncias de deslocamento
      por tempo ao longo da rede viária real, utilizando NetworkX e OSMnx.
      Um buffer morfológico é aplicado às arestas para fechar lacunas
      e produzir áreas contínuas de acessibilidade.
    </p>

    <p>
      <b>3. Indexação hexagonal (H3):</b>
      O sistema hierárquico de indexação espacial H3 é utilizado
      para tesselação da área de estudo na resolução 10,
      permitindo análises estatísticas uniformes e comparáveis
      sobre o território.
    </p>

    <p>
      <b>4. Classificação inteligente (IA):</b>
      Um classificador OBIA / Decision Tree é treinado com amostras
      vetoriais fornecidas pelo usuário para identificar classes
      de cobertura do solo utilizando informações radiométricas
      derivadas da ortofoto, incluindo o NGRDI.
    </p>

    <p>
      <b>5. Função de Tobler (DEM):</b>
      Modelos Digitais de Elevação são incorporados para ajustar
      as velocidades teóricas de caminhada e ciclismo de acordo
      com a declividade do terreno.
    </p>

    <p>
      <b>6. Penalidade térmica (LST):</b>
      Um fator de atrito térmico derivado da temperatura da superfície
      é utilizado para representar a possível redução da mobilidade
      em condições de calor elevado, especialmente para grupos vulneráveis.
    </p>

    <hr class="s15-border" style="margin: 15px 0;">

    <h3
      class="s15-title"
      style="font-size: 14px; margin-bottom: 8px;"
    >
      Referências
    </h3>

    <ul style="margin-top: 0; padding-left: 20px;">
      <li style="margin-bottom: 4px;">
        BOEING, G. (2017).
        <i>
          OSMnx: New methods for acquiring, constructing,
          analyzing, and visualizing complex street networks
        </i>.
        Computers, Environment and Urban Systems.
      </li>

      <li style="margin-bottom: 4px;">
        BREIMAN, L., et al. (1984).
        <i>Classification and Regression Trees</i>.
        Wadsworth. (OBIA / Decision Trees).
      </li>

      <li style="margin-bottom: 4px;">
        TOBLER, W. (1993).
        <i>Three presentations on geographical analysis and modeling</i>.
        National Center for Geographic Information and Analysis.
      </li>

      <li style="margin-bottom: 4px;">
        UBER TECHNOLOGIES. (2018).
        <i>H3: Uber’s Hexagonal Hierarchical Spatial Index</i>.
      </li>
    </ul>
  `,

  // Ações gerais
  "action.close": "Fechar",
  "action.cancel": "Cancelar",
  "action.confirm": "Confirmar",
  "action.download": "Baixar",
  "action.clear": "Limpar",
  "action.import": "Importar",
  "action.choose": "Escolher",
  "raster.aiLegend":
    "Legenda da IA (OBIA):",

  

  // Simulação
  "simulation.run":
    "Executar simulação urbana",
  "simulation.running":
    "Processando...",
  "simulation.completed":
    "Simulação concluída",
  "simulation.failed":
    "Não foi possível executar a simulação.",
  "simulation.selectArea":
    "Selecione uma área de interesse.",
  "simulation.clearLayers":
    "Limpar camadas",


  "simulation.areaRequired":
  "Defina a área de estudo primeiro.",

  "simulation.processing":
    "PROCESSANDO...",

  "simulation.startingMetric":
    "Iniciando cálculo métrico...",

  "simulation.calculatingRasters":
    "Calculando rasters e métricas...",

  "simulation.waitingServer":
    "Aguardando servidor...",

  "simulation.routing":
    "Roteando rede ({value}%)...",

  "simulation.drawing":
    "Desenhando resultados...",


  "simulation.serverFailed":
    "Falha no processamento do servidor.",


  // Relatório
  "report.generate":
    "Gerar relatório técnico",
  "report.generating":
    "Gerando relatório...",
  "report.title":
    "Relatório de acessibilidade urbana",
  "report.subtitle":
    "Smart15 — apoio à decisão para mobilidade urbana",
  "report.executiveSummary":
    "Sumário executivo",
  "report.identification":
    "Identificação da análise",
  "report.configuration":
    "Configuração da simulação",
  "report.indicators":
    "Indicadores de acessibilidade",
  "report.factorImpacts":
    "Fatores de influência",
  "report.recommendations":
    "Recomendações",
  "report.methodology":
    "Notas metodológicas",
  "report.map":
    "Mapa da área analisada",
  "report.generatedAt":
    "Relatório gerado em {date}",
  "report.area":
    "Área analisada",
  "report.municipality":
    "Município",
  "report.state":
    "Unidade federativa",
  "report.notAvailable":
    "Não disponível",

  // Adaptador do relatório
"adapter.studyArea":
  "Área de estudo",

"adapter.selectedMapArea":
  "Área selecionada no mapa",

"adapter.map.title":
  "Mapa da área analisada",

"adapter.map.description":
  "Área de estudo utilizada na simulação.",


  // Relatório — contextos de mobilidade
"report.mobility.mixed.title":
  "Relatório de Análise de Acessibilidade Urbana",

"report.mobility.mixed.short":
  "Acessibilidade Urbana",

"report.mobility.mixed.movement":
  "deslocamentos a pé e por bicicleta",

"report.mobility.mixed.speed":
  "Velocidade-base de referência",

"report.mobility.mixed.footer":
  "acessibilidade urbana",

"report.mobility.bike.title":
  "Relatório de Análise de Acessibilidade Cicloviária",

"report.mobility.bike.short":
  "Acessibilidade Cicloviária",

"report.mobility.bike.movement":
  "deslocamentos por bicicleta",

"report.mobility.bike.speed":
  "Velocidade-base de ciclismo",

"report.mobility.bike.footer":
  "acessibilidade cicloviária",

"report.mobility.walk.title":
  "Relatório de Análise de Caminhabilidade",

"report.mobility.walk.short":
  "Caminhabilidade",

"report.mobility.walk.movement":
  "deslocamentos a pé",

"report.mobility.walk.speed":
  "Velocidade-base de caminhada",

"report.mobility.walk.footer":
  "caminhabilidade",

// Botões e cabeçalho
"report.print.title":
  "Imprimir ou salvar relatório em formato PDF",

"report.print.button":
  "Imprimir / Salvar PDF",

"report.header.area":
  "Área:",

"report.header.destination":
  "Destino:",

"report.header.generatedAt":
  "Gerado em:",

"report.destination.notProvided":
  "Destino não informado",

// Seções
"report.section.executive":
  "1. Sumário executivo",

"report.section.identification":
  "2. Identificação e caracterização da área",

"report.section.configuration":
  "3. Configuração da simulação",

"report.section.results":
  "4. Resultados da simulação",

"report.section.interpretation":
  "5. Interpretação técnica",

"report.section.recommendations":
  "6. Recomendações para o planejamento urbano",

"report.section.sources":
  "7. Fontes, parâmetros e limitações",

// Sumário executivo
"report.executive.status":
  "Situação:",

"report.executive.priority":
  "Prioridade:",

"report.executive.conclusion":
  "Conclusão:",

"report.executive.analysis":
  "Análise:",

"report.executive.priorityFactors":
  "Fatores prioritários:",

"report.executive.action":
  "Diretriz de ação:",

"report.executive.noPriorityFactors":
  "Não foram identificados fatores prioritários.",

// Identificação
"report.identification.analysisId":
  "Identificador da análise",

"report.identification.location":
  "Município/Estado",

"report.identification.area":
  "Área analisada",

"report.identification.destination":
  "Destino analisado",

"report.identification.crs":
  "Sistema de coordenadas",

"report.identification.analysisConsiders":
  "A análise considera",

"report.identification.to":
  "até",

"report.identification.networkDistance":
  "A distância calculada pela rede foi de",

"report.identification.noNetworkDistance":
  "A distância de rede não foi disponibilizada pelo processamento atual.",

"layer.studyArea":
  "Área geográfica (base)",

"layer.aiSamples":
  "Amostras IA",

"layer.urbanPois":
  "POIs de equipamentos urbanos",

"layer.isochrones":
  "Isócronas",

"layer.hexagons":
  "Hexágonos",

// Configuração
"report.configuration.parameter":
  "Parâmetro",

"report.configuration.value":
  "Valor",

"report.configuration.targetTime":
  "Tempo-alvo",

"report.configuration.profiles":
  "Perfis de mobilidade",

// Métricas
"report.metric.distance":
  "Distância",

"report.metric.baseTime":
  "Tempo sem ponderação",

"report.metric.adjustedTime":
  "Tempo ajustado",

"report.metric.factorDifference":
  "Diferença produzida pelos fatores",

"report.metric.averageSpeed":
  "Velocidade média",

"report.metric.reachableArea":
  "Área alcançável",

"raster.lst":
  "LST (Calor)",

"raster.dem":
  "DEM (Relevo)",

"raster.slope":
  "Declividade (%)",

"raster.orthophoto":
  "Ortofoto",

"raster.ngrdi":
  "Índice NGRDI",

"raster.aiClassification":
  "Classificação IA (OBIA)",

// Blocos dos fatores
"report.factor.timeImpact":
  "Impacto estimado no tempo:",

"report.factor.observedValue":
  "Valor observado:",

"report.factor.relatedRecommendations":
  "Recomendações relacionadas",

"report.factor.noRecommendations":
  "Não foram identificadas recomendações prioritárias para este fator.",

// Síntese técnica
"report.summary.withinTarget":
  "O resultado encontra-se dentro do limite de {target} minutos definido para a análise.",

"report.summary.aboveTarget":
  "O tempo ajustado ultrapassa o limite de {target} minutos definido para a análise.",

"report.summary.noAdjustedTime":
  "Não foi possível determinar o tempo ajustado com os dados atualmente disponibilizados.",

"report.summary.restrictiveFactors":
  "Os fatores com maior nível de restrição foram: {factors}.",

"report.summary.noRestrictiveFactors":
  "Não foram identificados fatores classificados com influência elevada ou crítica.",

// Recomendações
"report.recommendations.none":
  "Não foram geradas recomendações prioritárias com base nos critérios atualmente avaliados.",

// Fontes e limitações
"report.sources.title":
  "Fontes dos dados",

"report.sources.none":
  "As fontes dos dados não foram informadas.",

"report.limitations.title":
  "Limitação da análise:",

"report.limitations.description":
  "Os resultados representam uma estimativa produzida a partir das camadas disponíveis, dos parâmetros configurados e do modelo de deslocamento empregado. Condições temporárias, obstáculos não cadastrados e alterações recentes no ambiente urbano podem não estar representados.",

// Rodapé
"report.footer.generated":
  "Relatório produzido automaticamente pelo plugin de análise de {analysis}.",

"report.footer.pluginVersion":
  "Versão do plugin: {version}.",

"report.footer.algorithmVersion":
  "Versão do algoritmo: {version}.",

// Erros
"report.error.popupBlocked":
  "Não foi possível abrir o relatório. Verifique se o navegador bloqueou a nova janela.",

  // Níveis de influência
  "level.positive": "Favorável",
  "level.neutral": "Neutra",
  "level.low": "Baixa influência",
  "level.moderate": "Influência moderada",
  "level.high": "Influência elevada",
  "level.critical": "Influência crítica",

  // Fatores
  "factor.temperature":
    "Temperatura de superfície",
  "factor.slope":
    "Declividade",
  "factor.treeCoverage":
    "Cobertura arbórea estimada",
  "factor.pavement":
    "Qualidade do pavimento",
  "factor.crossings":
    "Travessias",
  "factor.accessibility":
    "Acessibilidade",

    // Interpretação dos fatores — declividade
  "factor.slope.description.low":
    "A declividade média do percurso foi de {average}%, indicando baixa influência sobre o esforço e o tempo de caminhada.",

  "factor.slope.description.moderate":
    "A declividade média foi de {average}%, com valor máximo de {maximum}%. O fator apresenta influência moderada sobre o esforço necessário e a velocidade de deslocamento.",

  "factor.slope.description.high":
    "A declividade média foi de {average}%, alcançando {maximum}% em determinados trechos. Esse fator representa uma limitação relevante à caminhabilidade, especialmente para pessoas idosas, crianças e pessoas com mobilidade reduzida.",

  "factor.slope.recommendation.alternativeRoutes":
    "Avaliar rotas alternativas com menor inclinação.",

  "factor.slope.recommendation.sidewalkContinuity":
    "Verificar a continuidade e a regularidade das calçadas nos trechos inclinados.",

  "factor.slope.recommendation.accessibility":
    "Priorizar soluções de acessibilidade nos segmentos de maior declividade.",

  "factor.slope.recommendation.accessibleRoutes":
    "Priorizar rotas acessíveis com menor inclinação.",

  "factor.slope.recommendation.restAreas":
    "Implantar áreas de descanso nos trechos de maior esforço.",

  "factor.slope.recommendation.ramps":
    "Avaliar rampas, corrimãos e adequações de acessibilidade.",

  "factor.slope.recommendation.signage":
    "Sinalizar trajetos alternativos com menor declividade.",

  // Cobertura arbórea
  "factor.treeCoverage.description.positive":
    "A cobertura arbórea estimada foi de {coverage}%, representando condição favorável ao conforto térmico e à experiência do deslocamento a pé.",

  "factor.treeCoverage.description.moderate":
    "A cobertura arbórea estimada foi de {coverage}%. A arborização oferece proteção parcial ao percurso, mas existem segmentos que podem apresentar menor conforto térmico.",

  "factor.treeCoverage.description.high":
    "A cobertura arbórea estimada foi de apenas {coverage}%, conforme classificação automatizada da imagem utilizada na simulação. A baixa disponibilidade de sombra pode reduzir o conforto do pedestre, principalmente em períodos de maior temperatura.",

  "factor.treeCoverage.recommendation.preserve":
    "Preservar a cobertura arbórea existente.",

  "factor.treeCoverage.recommendation.maintenance":
    "Manter ações periódicas de manejo e conservação.",

  "factor.treeCoverage.recommendation.expand":
    "Ampliar a arborização nos segmentos com menor cobertura.",

  "factor.treeCoverage.recommendation.species":
    "Priorizar espécies adequadas às calçadas e à infraestrutura urbana.",

  "factor.treeCoverage.recommendation.greenCorridors":
    "Implantar corredores verdes nos principais eixos de caminhada.",

  "factor.treeCoverage.recommendation.planting":
    "Priorizar o plantio de árvores em trechos com maior exposição solar.",

  "factor.treeCoverage.recommendation.infrastructure":
    "Integrar arborização, calçadas e redes de infraestrutura no planejamento.",

  // Temperatura
  "factor.temperature.maximum":
    ", com máximo estimado de {maximum} °C",

  "factor.temperature.description.positive":
    "A temperatura média estimada da superfície foi de {average} °C{maximumText}, indicando condição favorável de exposição térmica para o deslocamento.",

  "factor.temperature.description.moderate":
    "A temperatura média estimada da superfície foi de {average} °C{maximumText}. A exposição térmica merece atenção em trechos sem sombra, sobretudo nos horários mais quentes.",

  "factor.temperature.description.high":
    "A temperatura média estimada da superfície foi de {average} °C{maximumText}. O resultado indica exposição térmica elevada, que pode reduzir o conforto e a viabilidade do deslocamento a pé, especialmente para crianças, pessoas idosas e pessoas com mobilidade reduzida.",

  "factor.temperature.recommendation.preserve":
    "Preservar as condições de sombreamento e conforto térmico existentes.",

  "factor.temperature.recommendation.shade":
    "Priorizar arborização e sombreamento nos trechos mais expostos.",

  "factor.temperature.recommendation.restAreas":
    "Prever áreas de descanso em rotas de maior permanência a pé.",

  "factor.temperature.recommendation.priorityShade":
    "Implantar arborização e soluções de sombreamento nos trechos prioritários.",

  "factor.temperature.recommendation.furniture":
    "Integrar mobiliário urbano e áreas de descanso às rotas mais expostas.",

  "factor.temperature.recommendation.coolerRoutes":
    "Priorizar trajetos com maior conforto térmico na sinalização e no planejamento.",

  // Pavimento
  "factor.pavement.description.positive":
    "{adequate}% do percurso foi classificado como adequado. A condição do pavimento favorece a continuidade do deslocamento.",

  "factor.pavement.description.moderate":
    "{adequate}% do percurso apresenta pavimento adequado. Há limitações pontuais que podem afetar o conforto ou a acessibilidade.",

  "factor.pavement.description.high":
    "Somente {adequate}% do percurso apresenta pavimento considerado adequado. A condição representa uma barreira importante ao deslocamento de pedestres.",

  "factor.pavement.recommendation.maintenance":
    "Manter ações preventivas de conservação das calçadas.",

  "factor.pavement.recommendation.mapSegments":
    "Mapear os segmentos descontínuos ou deteriorados.",

  "factor.pavement.recommendation.recovery":
    "Priorizar a recuperação de calçadas próximas aos destinos essenciais.",

  "factor.pavement.recommendation.repair":
    "Recuperar os trechos de calçada em condições inadequadas.",

  "factor.pavement.recommendation.obstacles":
    "Eliminar desníveis, obstáculos e descontinuidades.",

  "factor.pavement.recommendation.standards":
    "Adotar padrões de acessibilidade nas intervenções.",

  // Acessibilidade
  "factor.accessibility.description.positive":
    "{accessible}% dos segmentos analisados foram classificados como acessíveis.",

  "factor.accessibility.description.moderate":
    "{accessible}% dos segmentos foram classificados como acessíveis. A rota possui condições parciais de acessibilidade, com possíveis interrupções ao longo do percurso.",

  "factor.accessibility.description.critical":
    "Apenas {accessible}% dos segmentos foram classificados como acessíveis. O resultado indica baixa continuidade para pessoas com mobilidade reduzida.",

  "factor.accessibility.recommendation.preserve":
    "Preservar a continuidade da rota acessível.",

  "factor.accessibility.recommendation.interruptions":
    "Identificar e corrigir os pontos de interrupção da rota acessível.",

  "factor.accessibility.recommendation.connections":
    "Priorizar conexões entre calçadas, rampas e travessias.",

  "factor.accessibility.recommendation.plan":
    "Elaborar plano prioritário de adequação das calçadas.",

  "factor.accessibility.recommendation.ramps":
    "Implantar rampas e travessias acessíveis.",

  "factor.accessibility.recommendation.removeObstacles":
    "Remover obstáculos e corrigir desníveis.",

  // Contexto do cálculo
  "factor.calculation.noWeight":
    "{description} Este fator foi identificado no diagnóstico, mas não recebeu ponderação no cálculo do tempo ajustado desta simulação.",

  // Sumário executivo
  "executive.status.adequate":
    "Adequado",

  "executive.status.attention":
    "Atenção",

  "executive.status.critical":
    "Crítico",

  "executive.priority.low":
    "Baixa",

  "executive.priority.medium":
    "Média",

  "executive.priority.high":
    "Alta",

  "executive.critical.headline":
    "Intervenção prioritária recomendada",

  "executive.critical.timeExceeded":
    "O tempo ajustado de {adjusted} min ultrapassa a meta de {target} min.",

  "executive.critical.factors":
    "Foram identificados fatores críticos de restrição no território analisado.",

  "executive.critical.action":
    "Priorizar intervenção nos trechos críticos e avaliar rotas alternativas acessíveis antes de novos investimentos de expansão.",

  "executive.attention.headline":
    "Acessibilidade dentro da meta, com restrições relevantes",

  "executive.attention.withTime":
    "O tempo ajustado de {adjusted} min atende à meta de {target} min, mas requer qualificação do percurso.",

  "executive.attention.withoutTime":
    "A simulação não disponibilizou o tempo ajustado, mas identificou restrições relevantes no percurso.",

  "executive.attention.action":
    "Planejar intervenções graduais nos fatores restritivos e monitorar seus efeitos nas próximas simulações.",

  "executive.adequate.headline":
    "Condição geral favorável",

  "executive.adequate.withTime":
    "O tempo ajustado de {adjusted} min atende à meta de {target} min sem fatores classificados como elevados ou críticos.",

  "executive.adequate.withoutTime":
    "Não foram identificados fatores classificados como elevados ou críticos com os dados disponíveis.",

  "executive.adequate.action":
    "Manter as condições existentes, monitorar a área e preservar os elementos favoráveis à acessibilidade.", 

  // Perfis
  "profile.adulto_pedestre":
    "Adulto — a pé",
  "profile.pedestre_crianca":
    "Criança — a pé",
  "profile.pedestre_idoso":
    "Pessoa idosa — a pé",

  "profile.adulto_bike":
    "Adulto — bicicleta",
  "profile.ciclista_crianca":
    "Criança — bicicleta",
  "profile.ciclista_idoso":
    "Pessoa idosa — bicicleta",

  // Destinos
  "target.escolas":
    "Escolas e creches",
  "target.hospitais":
    "Hospitais e clínicas",
  "target.mercados":
    "Mercados e padarias",
  "target.parques":
    "Parques e praças",
  "target.cultura":
    "Centros culturais e museus",
  "target.comercio":
    "Comércio local e serviços",
  "target.academias":
    "Academias e equipamentos esportivos",

  // Valores interpolados
  "report.areaValue":
    "{value} km²",
  "report.minutesValue":
    "{value} min",
  "report.percentageValue":
    "{value}%",

  // Tema
  "theme.dark":
    "Modo escuro",
  "theme.light":
    "Modo claro",

  // Mapa / camadas
  "map.legend":
    "Legenda",
  "layer.moveUp":
    "Subir camada no mapa",
  "layer.moveDown":
    "Descer camada no mapa",
  "layer.toggleVisibility":
    "Ativar/desativar camada",

  "map.legend.studyArea": "Área de estudo",
  "map.legend.upToMinutes": "Até {value} min",
  "map.legend.overMinutes": "Mais de {value} min",

  

  // Área
  "area.noneDefined":
    "Nenhum limite definido",
  "area.captured":
    "Capturado!",
  "area.study":
    "Área de estudo",
};

export const translations = {
  en,
  "pt-BR": ptBR,
} satisfies Record<
  "en" | "pt-BR",
  Record<TranslationKey, string>
>;
