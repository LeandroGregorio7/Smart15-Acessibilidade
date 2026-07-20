//#region src/geolibre.ts
var painelHtml = `
  <div style="padding: 20px; font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; height: 100vh; width: 100%; overflow-y: auto; box-sizing: border-box;">
    
    <div style="border-bottom: 2px solid #2b6cb0; padding-bottom: 12px; margin-bottom: 20px;">
      <h2 style="color: #1a365d; margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">Smart-15: Acessibilidade</h2>
      <p style="font-size: 13px; color: #4a5568; margin: 0;">Orquestrador de Simulação Urbana</p>
    </div>

    <div style="margin-bottom: 24px;">
      <label style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 8px; color: #2c5282;">
        1. Limite Geográfico da Análise
      </label>
      <div style="display: flex; gap: 6px; margin-bottom: 8px;">
        <input type="file" id="hiddenFileInput" accept=".geojson,.kml,.shp,.zip" style="display: none;" />
        <button id="btnUploadArea" title="Importar Vetor Local" style="flex: 1.2; padding: 8px; background-color: #edf2f7; border: 1px solid #cbd5e0; border-radius: 4px; font-size: 12px; cursor: pointer; color: #2d3748; font-weight: bold;">
          📁 Importar
        </button>
        <div style="display: flex; flex: 2; gap: 4px;">
          <button id="btnDrawRect" title="Desenhar Retângulo" class="draw-tool" style="flex: 1; padding: 8px; background-color: #edf2f7; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer; font-size: 14px;">🟦</button>
          <button id="btnDrawPoly" title="Desenhar Polígono" class="draw-tool" style="flex: 1; padding: 8px; background-color: #edf2f7; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer; font-size: 14px;">⬡</button>
          <button id="btnDrawCircle" title="Desenhar Raio Circular" class="draw-tool" style="flex: 1; padding: 8px; background-color: #edf2f7; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer; font-size: 14px;">⭕</button>
          <button id="btnReset" title="Limpar Geometria" style="flex: 1; padding: 8px; background-color: #fed7d7; border: 1px solid #fc8181; border-radius: 4px; cursor: pointer; font-size: 14px;">🗑️</button>
        </div>
      </div>
      <button id="btnExportLimite" style="width: 100%; padding: 6px; background-color: #e2e8f0; border: 1px solid #cbd5e0; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; color: #4a5568; display: none; margin-bottom: 6px;">
        📥 Exportar Limite Geográfico (GeoJSON)
      </button>
      <div id="areaStatus" style="font-size: 11px; color: #718096; margin-top: 6px; font-style: italic; white-space: pre-line;">Nenhum limite definido</div>
    </div>

    <div id="lidarLinkCard" style="display: none; background-color: #fffaf0; border: 1px solid #feebc8; padding: 10px; margin-bottom: 24px; border-radius: 4px; font-size: 11px; color: #c05621;">
      <strong>⛰️ Extensão Sincronizada p/ USGS LiDAR:</strong>
      <div id="lidarCoordText" style="font-family: monospace; background: #fff; padding: 4px; border: 1px solid #feebc8; margin: 4px 0; border-radius: 2px;">-</div>
      <button id="btnCopyLidar" style="width: 100%; padding: 4px; background: #dd6b20; color: #fff; border: none; border-radius: 2px; font-weight: bold; cursor: pointer; font-size: 10px;">📋 Copiar para Janela USGS LiDAR</button>
    </div>

    <div style="margin-bottom: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
      <label style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 4px; color: #2c5282;">
        2. Amostras para Classificação de Uso do Solo
      </label>
      <p style="font-size: 11px; color: #718096; margin: 0 0 8px 0; line-height: 1.3;">A tabela de atributos de entrada deve conter apenas as colunas <code style="background:#edf2f7; padding:2px 4px; border-radius:3px;">id</code> e <code style="background:#edf2f7; padding:2px 4px; border-radius:3px;">class</code>.</p>
      
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <input type="file" id="sampleFileInput" accept=".geojson,.kml,.zip" style="display: none;" />
        <button id="btnUploadSamples" style="width: 100%; padding: 8px; background-color: #f7fafc; border: 1px solid #cbd5e0; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; color: #4a5568;">
          📁 Subir Arquivo de Amostras (.geojson, .kml, .shp.zip)
        </button>
        <button id="btnCollectSamples" style="width: 100%; padding: 8px; background-color: #edf2f7; border: 1px solid #cbd5e0; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; color: #2d3748; display: flex; align-items: center; justify-content: center; gap: 4px;">
          🎯 Coletar Amostras no Próprio Mapa
        </button>
      </div>
      <div id="sampleStatus" style="font-size: 11px; color: #718096; margin-top: 6px; font-style: italic;">Nenhuma amostra carregada</div>
    </div>

    <div style="margin-bottom: 24px;">
      <label style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 8px; color: #2c5282;">
        3. Destinos de Interesse (Rede OSM)
      </label>
      <div style="display: flex; flex-direction: column; gap: 6px; background-color: #f7fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 4px;">
        <label style="font-size: 13px; display: flex; align-items: center; color: #4a5568; cursor: pointer;"><input type="checkbox" class="osm-target" value="schools" checked style="margin-right: 8px;" /> Escolas e Creches</label>
        <label style="font-size: 13px; display: flex; align-items: center; color: #4a5568; cursor: pointer;"><input type="checkbox" class="osm-target" value="health" checked style="margin-right: 8px;" /> Hospitais e UBS</label>
        <label style="font-size: 13px; display: flex; align-items: center; color: #4a5568; cursor: pointer;"><input type="checkbox" class="osm-target" value="parks" style="margin-right: 8px;" /> Praças e Parques</label>
        <label style="font-size: 13px; display: flex; align-items: center; color: #4a5568; cursor: pointer;"><input type="checkbox" class="osm-target" value="transit" style="margin-right: 8px;" /> Pontos de Ônibus</label>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <label style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 4px; color: #2c5282;">
        4. Perfil de Velocidade e Restrição
      </label>
      <select id="perfilSelect" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #cbd5e0; font-size: 13px; color: #2d3748; background: #fff; cursor: pointer;">
        <optgroup label="A pé (Pedestres)">
          <option value="adulto_pedestre">Adulto (A pé - 5.0 km/h)</option>
          <option value="crianca_pedestre">Criança (A pé - 3.5 km/h)</option>
          <option value="idoso_pedestre">Idoso (A pé - 3.0 km/h)</option>
        </optgroup>
        <optgroup label="Ciclismo (Bicicletas)">
          <option value="adulto_bike">Adulto (Bicicleta - 15.0 km/h)</option>
          <option value="crianca_bike">Criança (Bicicleta - 11.0 km/h)</option>
          <option value="idoso_bike">Idoso (Bicicleta - 10.0 km/h)</option>
        </optgroup>
      </select>
    </div>

    <div style="margin-bottom: 24px;">
      <label style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 4px; color: #2c5282;">
        5. Variáveis de Custo Ambiental / Relevo
      </label>
      <div style="display: flex; flex-direction: column; gap: 12px; background-color: #f7fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 4px;">
        <div>
          <label style="font-size: 11px; font-weight: bold; color: #4a5568; display: block; margin-bottom: 4px;">🌳 Camada de Vegetação (Output de Classification)</label>
          <select id="layerVeg" class="raster-layer-select" style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #cbd5e0; font-size: 12px; color: #2d3748; background: #fff;"></select>
        </div>
        <div>
          <label style="font-size: 11px; font-weight: bold; color: #4a5568; display: block; margin-bottom: 4px;">🌡️ Camada Térmica LST (Output de Thermal)</label>
          <select id="layerTemp" class="raster-layer-select" style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #cbd5e0; font-size: 12px; color: #2d3748; background: #fff;"></select>
        </div>
        <div>
          <label style="font-size: 11px; font-weight: bold; color: #4a5568; display: block; margin-bottom: 4px;">⛰️ Camada de Declividade (Output de Terrain > Slope)</label>
          <select id="layerDem" class="raster-layer-select" style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #cbd5e0; font-size: 12px; color: #2d3748; background: #fff;"></select>
        </div>
      </div>
    </div>

    <div id="sampleModalOverlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;">
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 300px;">
        <h3 style="margin: 0 0 12px 0; color: #1a365d;">🎯 Configurar Amostra</h3>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #4a5568;">Digite o código da classe:</p>
        <input id="sampleClassInput" type="number" placeholder="Ex: 1=Vegetação, 2=Solo" style="width: 100%; padding: 8px; border: 1px solid #cbd5e0; border-radius: 4px; box-sizing: border-box; margin-bottom: 12px;" />
        <div style="display: flex; gap: 8px;">
          <button id="sampleModalCancel" style="flex: 1; padding: 8px; background-color: #e2e8f0; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer; font-weight: bold;">Cancelar</button>
          <button id="sampleModalOk" style="flex: 1; padding: 8px; background-color: #2b6cb0; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">OK</button>
        </div>
      </div>
    </div>

    <button id="btnSimular" style="width: 100%; padding: 14px; background-color: #2b6cb0; color: #ffffff; font-weight: bold; font-size: 14px; border: none; border-radius: 4px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px;">
      Executar Simulação Urbana
    </button>
  </div>
`;
var bboxCapturada = null;
var geometriaGeoJSON = null;
var listaDeAmostras = [];
var isDrawingMode = false;
var throttle = (func, limit) => {
	let inThrottle;
	return function(...args) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, limit);
		}
	};
};
var plugin = {
	id: "smart15-orquestrador",
	name: "Smart-15: Acessibilidade",
	version: "1.0.5",
	urlParameterNames: [],
	activate(app) {
		if (app.registerRightPanel) {
			app.registerRightPanel({
				id: "smart15-workbench",
				title: "Smart-15",
				defaultWidth: 350,
				render(container) {
					const wrap = document.createElement("div");
					wrap.innerHTML = painelHtml;
					container.appendChild(wrap);
					const btnUpload = wrap.querySelector("#btnUploadArea");
					const hiddenInput = wrap.querySelector("#hiddenFileInput");
					const areaStatus = wrap.querySelector("#areaStatus");
					const btnExportLimite = wrap.querySelector("#btnExportLimite");
					const btnSimular = wrap.querySelector("#btnSimular");
					const lidarLinkCard = wrap.querySelector("#lidarLinkCard");
					const lidarCoordText = wrap.querySelector("#lidarCoordText");
					const btnCopyLidar = wrap.querySelector("#btnCopyLidar");
					const btnUploadSamples = wrap.querySelector("#btnUploadSamples");
					const sampleFileInput = wrap.querySelector("#sampleFileInput");
					const btnCollectSamples = wrap.querySelector("#btnCollectSamples");
					const sampleStatus = wrap.querySelector("#sampleStatus");
					const drawTools = Array.from(wrap.querySelectorAll(".draw-tool"));
					const btnDrawRect = wrap.querySelector("#btnDrawRect");
					const btnDrawPoly = wrap.querySelector("#btnDrawPoly");
					const btnDrawCircle = wrap.querySelector("#btnDrawCircle");
					const btnReset = wrap.querySelector("#btnReset");
					const sampleModalOverlay = wrap.querySelector("#sampleModalOverlay");
					const sampleClassInput = wrap.querySelector("#sampleClassInput");
					const sampleModalOk = wrap.querySelector("#sampleModalOk");
					const sampleModalCancel = wrap.querySelector("#sampleModalCancel");
					let sampleModalResolve = null;
					
                    // Lógica do Reset
					btnReset.addEventListener("click", () => {
						const mapCanvas = document.querySelector(".maplibregl-canvas");
						if (mapCanvas && mapCanvas.parentElement) {
							mapCanvas.parentElement.querySelectorAll(".smart15-draw-overlay").forEach((o) => o.remove());
						}
						isDrawingMode = false;
						geometriaGeoJSON = null;
						bboxCapturada = null;
						drawTools.forEach((b) => {
							b.style.backgroundColor = "#edf2f7";
							b.style.borderColor = "#cbd5e0";
						});
						btnCollectSamples.style.backgroundColor = "#edf2f7";
						btnExportLimite.style.display = "none";
						lidarLinkCard.style.display = "none";
						areaStatus.innerText = "Nenhum limite definido (Resetado)";
						areaStatus.style.color = "#718096";
						areaStatus.style.fontWeight = "normal";
                        if (app.map && app.map.dragPan) app.map.dragPan.enable();
					});
                    
					const showSampleModal = () => {
						return new Promise((resolve) => {
							sampleModalResolve = resolve;
							sampleClassInput.value = "1";
							sampleClassInput.focus();
							sampleModalOverlay.style.display = "flex";
						});
					};
					const closeSampleModal = () => {
						sampleModalOverlay.style.display = "none";
					};
					sampleModalOk.addEventListener("click", () => {
						const value = parseInt(sampleClassInput.value) || 1;
						closeSampleModal();
						if (sampleModalResolve) sampleModalResolve(value);
					});
					sampleModalCancel.addEventListener("click", () => {
						closeSampleModal();
						if (sampleModalResolve) sampleModalResolve(null);
					});
					sampleClassInput.addEventListener("keypress", (e) => {
						if (e.key === "Enter") sampleModalOk.click();
					});
					const fazerDownload = (obj, nome) => {
						const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
						const url = URL.createObjectURL(blob);
						const a = document.createElement("a");
						a.href = url;
						a.download = nome;
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
						URL.revokeObjectURL(url);
					};
					btnExportLimite.addEventListener("click", () => {
						if (geometriaGeoJSON) fazerDownload(geometriaGeoJSON, "limite_smart15.geojson");
					});
					btnCopyLidar.addEventListener("click", () => {
						if (bboxCapturada) {
							const txt = `${bboxCapturada[0].toFixed(2)}, ${bboxCapturada[1].toFixed(2)} to ${bboxCapturada[2].toFixed(2)}, ${bboxCapturada[3].toFixed(2)}`;
							navigator.clipboard.writeText(txt);
							alert("📋 Extensão copiada para o clipboard!");
						}
					});
					btnUpload.addEventListener("click", () => hiddenInput.click());
					hiddenInput.addEventListener("change", (e) => {
						const file = e.target.files[0];
						if (file) {
							areaStatus.innerText = `📁 Arquivo de Limite: ${file.name}`;
							areaStatus.style.color = "#2b6cb0";
							areaStatus.style.fontWeight = "bold";
							geometriaGeoJSON = {
								type: "Feature_Importado",
								arquivo: file.name
							};
							bboxCapturada = null;
							lidarLinkCard.style.display = "none";
							btnExportLimite.style.display = "none";
							isDrawingMode = false;
						}
					});
					btnUploadSamples.addEventListener("click", () => sampleFileInput.click());
					sampleFileInput.addEventListener("change", (e) => {
						const file = e.target.files[0];
						if (file) {
							sampleStatus.innerText = `📁 Amostras: ${file.name}\nTabela Validada (id, class)`;
							sampleStatus.style.color = "#2b6cb0";
							sampleStatus.style.fontWeight = "bold";
						}
					});
                    
					const startDrawing = (mode) => {
						if (isDrawingMode) return;
						isDrawingMode = true;
						drawTools.forEach((b) => {
							b.style.backgroundColor = "#edf2f7";
							b.style.borderColor = "#cbd5e0";
						});
						btnCollectSamples.style.backgroundColor = "#edf2f7";
						if (mode !== "sample") {
							const activeBtn = mode === "rect" ? btnDrawRect : mode === "poly" ? btnDrawPoly : btnDrawCircle;
							activeBtn.style.backgroundColor = "#c6f6d5";
							activeBtn.style.borderColor = "#38a169";
						} else btnCollectSamples.style.backgroundColor = "#feebc8";
						const mapCanvas = document.querySelector(".maplibregl-canvas");
						const mapContainer = mapCanvas ? mapCanvas.parentElement : null;
						if (!mapContainer) {
							isDrawingMode = false;
							return;
						}
                        
                        // DESLIGA O PAN DO MAPA (Vindo do seu geolibre.ts 1.0.5)
                        if (app.map && app.map.dragPan) app.map.dragPan.disable();
                        
						mapContainer.querySelectorAll(".smart15-draw-overlay").forEach((o) => o.remove());
						const overlay = document.createElement("div");
						overlay.className = "smart15-draw-overlay";
						overlay.style.position = "absolute";
						overlay.style.top = "0";
						overlay.style.left = "0";
						overlay.style.width = "100%";
						overlay.style.height = "100%";
						overlay.style.zIndex = "9999";
						overlay.style.cursor = "crosshair";
						overlay.style.background = "transparent";
                        
                        // TOUCH ACTION NONE CRÍTICO! (Vindo do seu geolibre.ts 1.0.5)
                        overlay.style.touchAction = "none";
                        
						overlay.addEventListener("contextmenu", (e) => e.preventDefault());
						mapContainer.appendChild(overlay);
						const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
						svg.style.width = "100%";
						svg.style.height = "100%";
						svg.style.pointerEvents = "none";
						overlay.appendChild(svg);
						const getPos = (e) => {
							const r = overlay.getBoundingClientRect();
							return {
								x: e.clientX - r.left,
								y: e.clientY - r.top
							};
						};
						const finishDrawing = () => {
							overlay.remove();
                            // RELIGA O MAPA (Vindo do seu geolibre.ts 1.0.5)
                            if (app.map && app.map.dragPan) app.map.dragPan.enable();
                            
							drawTools.forEach((b) => {
								b.style.backgroundColor = "#edf2f7";
								b.style.borderColor = "#cbd5e0";
							});
							btnCollectSamples.style.backgroundColor = "#edf2f7";
							isDrawingMode = false;
							if (geometriaGeoJSON) {
								btnExportLimite.style.display = "block";
								if (bboxCapturada) {
									lidarLinkCard.style.display = "block";
									lidarCoordText.innerText = `${bboxCapturada[0].toFixed(2)}, ${bboxCapturada[1].toFixed(2)} to ${bboxCapturada[2].toFixed(2)}, ${bboxCapturada[3].toFixed(2)}`;
								}
								areaStatus.innerText = `✅ Geometria capturada e Georreferenciada!`;
								areaStatus.style.color = "#2f855a";
								areaStatus.style.fontWeight = "bold";
							}
						};
						if (mode === "rect") {
							areaStatus.innerText = "🟦 Clique e arraste para desenhar o retângulo.";
							areaStatus.style.color = "#2b6cb0";
							let rectEl = null;
							let start = null;
							let frameId = null;
							let isDrawing = false;
							overlay.onpointerdown = (e) => {
								e.preventDefault();
                                overlay.setPointerCapture(e.pointerId);
								isDrawing = true;
								start = getPos(e);
								rectEl = document.createElementNS("http://www.w3.org/2000/svg", "rect");
								rectEl.setAttribute("fill", "rgba(49, 130, 206, 0.2)");
								rectEl.setAttribute("stroke", "#3182ce");
								rectEl.setAttribute("stroke-width", "2");
								svg.appendChild(rectEl);
							};
							overlay.onpointermove = (e) => {
								e.preventDefault();
								if (!isDrawing || !start || !rectEl) return;
								const cur = getPos(e);
								if (frameId) cancelAnimationFrame(frameId);
								frameId = requestAnimationFrame(() => {
									rectEl.setAttribute("x", String(Math.min(start.x, cur.x)));
									rectEl.setAttribute("y", String(Math.min(start.y, cur.y)));
									rectEl.setAttribute("width", String(Math.abs(cur.x - start.x)));
									rectEl.setAttribute("height", String(Math.abs(cur.y - start.y)));
								});
							};
							overlay.onpointerup = (e) => {
								e.preventDefault();
                                overlay.releasePointerCapture(e.pointerId);
								isDrawing = false;
								if (frameId) cancelAnimationFrame(frameId);
								const end = getPos(e);
								if (start && app.map && Math.abs(end.x - start.x) > 10 && Math.abs(end.y - start.y) > 10) {
									const nw = app.map.unproject([Math.min(start.x, end.x), Math.min(start.y, end.y)]);
									const se = app.map.unproject([Math.max(start.x, end.x), Math.max(start.y, end.y)]);
									bboxCapturada = [nw.lng, se.lat, se.lng, nw.lat];
									geometriaGeoJSON = {
										type: "Feature",
										properties: { tipo: "retangulo" },
										geometry: {
											type: "Polygon",
											coordinates: [[[nw.lng, nw.lat], [se.lng, nw.lat], [se.lng, se.lat], [nw.lng, se.lat], [nw.lng, nw.lat]]]
										}
									};
									areaStatus.innerText = `✅ Retângulo desenhado com sucesso!`;
									areaStatus.style.color = "#2f855a";
								} else {
									areaStatus.innerText = `⚠️ Retângulo muito pequeno. Tente novamente.`;
									areaStatus.style.color = "#e53e3e";
								}
								finishDrawing();
							};
						} else if (mode === "poly") {
							areaStatus.innerText = "⬡ Clique no mapa para criar vértices.\nClique com o BOTÃO DIREITO para fechar.";
							areaStatus.style.color = "#2b6cb0";
							let polyEl = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
							polyEl.setAttribute("fill", "rgba(49, 130, 206, 0.15)");
							polyEl.setAttribute("stroke", "#2b6cb0");
							polyEl.setAttribute("stroke-width", "2");
							svg.appendChild(polyEl);
							let guideLineEl = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
							guideLineEl.setAttribute("fill", "none");
							guideLineEl.setAttribute("stroke", "#2b6cb0");
							guideLineEl.setAttribute("stroke-width", "1");
							guideLineEl.setAttribute("stroke-dasharray", "4,4");
							guideLineEl.setAttribute("opacity", "0.5");
							svg.appendChild(guideLineEl);
							let ptsTela = [];
							let coordsGeo = [];
							overlay.onpointerdown = (e) => {
								e.preventDefault();
								const pos = getPos(e);
								if (e.button === 2) {
									if (coordsGeo.length >= 3) {
										coordsGeo.push([coordsGeo[0][0], coordsGeo[0][1]]);
										geometriaGeoJSON = {
											type: "Feature",
											properties: { tipo: "poligono" },
											geometry: {
												type: "Polygon",
												coordinates: [coordsGeo]
											}
										};
										const lons = coordsGeo.map((c) => c[0]), lats = coordsGeo.map((c) => c[1]);
										bboxCapturada = [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)];
										areaStatus.innerText = `✅ Polígono finalizado com ${coordsGeo.length} vértices!`;
										areaStatus.style.color = "#2f855a";
									} else {
										areaStatus.innerText = `⚠️ Polígono precisa de pelo menos 3 vértices.`;
										areaStatus.style.color = "#e53e3e";
									}
									finishDrawing();
									return;
								}
								if (e.button === 0 && app.map) {
									const lngLat = app.map.unproject([pos.x, pos.y]);
									ptsTela.push(pos);
									coordsGeo.push([lngLat.lng, lngLat.lat]);
									polyEl.setAttribute("points", ptsTela.map((p) => `${p.x},${p.y}`).join(" "));
									areaStatus.innerText = `⬡ Vértices: ${coordsGeo.length}. Clique para adicionar mais ou botão direito para finalizar.`;
								}
							};
							const updateGuideLine = throttle((cur) => {
								if (ptsTela.length > 0) {
									const pontosTemporarios = [...ptsTela, cur];
									guideLineEl.setAttribute("points", pontosTemporarios.map((p) => `${p.x},${p.y}`).join(" "));
								}
							}, 16);
							overlay.onpointermove = (e) => {
								e.preventDefault();
								if (ptsTela.length === 0) return;
								updateGuideLine(getPos(e));
							};
						} else if (mode === "circle") {
							areaStatus.innerText = "⭕ Clique no centro e arraste para definir o raio.";
							areaStatus.style.color = "#2b6cb0";
							let circleEl = null;
							let start = null;
							let isDrawing = false;
							overlay.onpointerdown = (e) => {
								e.preventDefault();
                                overlay.setPointerCapture(e.pointerId);
								isDrawing = true;
								start = getPos(e);
								circleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
								circleEl.setAttribute("fill", "rgba(229, 62, 62, 0.15)");
								circleEl.setAttribute("stroke", "#e53e3e");
								circleEl.setAttribute("stroke-width", "2");
								circleEl.setAttribute("cx", String(start.x));
								circleEl.setAttribute("cy", String(start.y));
								svg.appendChild(circleEl);
							};
							overlay.onpointermove = (e) => {
								e.preventDefault();
								if (!isDrawing || !start || !circleEl) return;
								const cur = getPos(e);
								const r = Math.sqrt(Math.pow(cur.x - start.x, 2) + Math.pow(cur.y - start.y, 2));
								circleEl.setAttribute("r", String(r));
							};
							overlay.onpointerup = (e) => {
								e.preventDefault();
                                overlay.releasePointerCapture(e.pointerId);
								isDrawing = false;
								const end = getPos(e);
								if (start && app.map && Math.abs(end.x - start.x) > 10) {
									const centroGeo = app.map.unproject([start.x, start.y]);
									const rPixels = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
									const bordaGeo = app.map.unproject([start.x + rPixels, start.y]);
									const deltaLng = Math.abs(bordaGeo.lng - centroGeo.lng);
									bboxCapturada = [
										centroGeo.lng - deltaLng,
										centroGeo.lat - deltaLng * .7,
										centroGeo.lng + deltaLng,
										centroGeo.lat + deltaLng * .7
									];
									geometriaGeoJSON = {
										type: "Feature",
										properties: { tipo: "raio_circular", raio_metros: rPixels * 111 },
										geometry: { type: "Point", coordinates: [centroGeo.lng, centroGeo.lat] }
									};
									areaStatus.innerText = `✅ Círculo desenhado com sucesso!`;
									areaStatus.style.color = "#2f855a";
								} else {
									areaStatus.innerText = `⚠️ Círculo muito pequeno. Tente novamente.`;
									areaStatus.style.color = "#e53e3e";
								}
								finishDrawing();
							};
						} else if (mode === "sample") {
							areaStatus.innerText = "🎯 Clique no mapa para coletar amostras.";
							areaStatus.style.color = "#2b6cb0";
							overlay.onpointerdown = async (e) => {
								e.preventDefault();
								const pos = getPos(e);
								if (app.map) {
									const lngLat = app.map.unproject([pos.x, pos.y]);
									const classe = await showSampleModal();
									if (classe !== null) {
										listaDeAmostras.push({
											type: "Feature",
											geometry: { type: "Point", coordinates: [lngLat.lng, lngLat.lat] },
											properties: { id: listaDeAmostras.length + 1, class: classe }
										});
										sampleStatus.innerText = `🎯 Amostras em memória: ${listaDeAmostras.length} coletadas`;
										sampleStatus.style.color = "#2f855a";
										sampleStatus.style.fontWeight = "bold";
									}
								}
							};
						}
					};
					btnDrawRect.addEventListener("click", () => startDrawing("rect"));
					btnDrawPoly.addEventListener("click", () => startDrawing("poly"));
					btnDrawCircle.addEventListener("click", () => startDrawing("circle"));
					btnCollectSamples.addEventListener("click", () => startDrawing("sample"));
					const simularVarreduraDeCamadas = () => {
						const selects = wrap.querySelectorAll(".raster-layer-select");
						const camadasDoGeoLibre = [
							"Ortofoto_Classificada_RandomForest.tif",
							"Temperatura_LST.tif",
							"Declividade_Slope_MDE.tif"
						];
						selects.forEach((select) => {
							select.innerHTML = "<option value=\"\">-- Selecione a Camada Ativa --</option>";
							camadasDoGeoLibre.forEach((camada) => {
								const opt = document.createElement("option");
								opt.value = camada;
								opt.innerText = camada;
								select.appendChild(opt);
							});
						});
					};
					setTimeout(simularVarreduraDeCamadas, 500);
					if (btnSimular) btnSimular.addEventListener("click", async () => {
						if (!geometriaGeoJSON) {
							alert("⚠️ Área de estudo ausente.");
							return;
						}
						const tOriginal = btnSimular.innerText;
						btnSimular.innerText = "⏳ ENVIANDO...";
						btnSimular.disabled = true;
						try {
							const pacoteDeDados = {
								perfil: wrap.querySelector("#perfilSelect").value,
								alvos: Array.from(wrap.querySelectorAll(".osm-target:checked")).map((cb) => cb.value),
								camada_veg: wrap.querySelector("#layerVeg").value,
								camada_temp: wrap.querySelector("#layerTemp").value,
								camada_dem: wrap.querySelector("#layerDem").value,
								bbox: bboxCapturada,
								geometria: geometriaGeoJSON,
								samples: listaDeAmostras
							};
							const res = await (await fetch("/api/simular", {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify(pacoteDeDados)
							})).json();
							alert("✅ " + res.mensagem);
						} catch (erro) {
							alert("❌ Sem conexão com o Python.");
						} finally {
							btnSimular.innerText = tOriginal;
							btnSimular.disabled = false;
						}
					});
					return () => wrap.remove();
				}
			});
			app.openRightPanel?.("smart15-workbench");
		}
	},
	deactivate(app) {
		app.closeRightPanel?.("smart15-workbench");
	}
};
//#endregion
export { plugin as default, plugin };
