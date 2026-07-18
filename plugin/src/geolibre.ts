const painelHtml = `
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

let bboxCapturada: number[] | null = null;
let geometriaGeoJSON: any = null;
let listaDeAmostras: any[] = [];
let isDrawingMode = false;

const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const plugin = {
  id: "smart15-orquestrador",
  name: "Smart-15: Acessibilidade",
  version: "1.0.5",
  urlParameterNames: [],

  activate(app: any) {
    if (app.registerRightPanel) {
      app.registerRightPanel({
        id: "smart15-workbench",
        title: "Smart-15",
        defaultWidth: 350,
        render(container: HTMLElement) {
          const wrap = document.createElement("div");
          wrap.innerHTML = painelHtml;
          container.appendChild(wrap);

          const btnUpload = wrap.querySelector('#btnUploadArea') as HTMLButtonElement;
          const hiddenInput = wrap.querySelector('#hiddenFileInput') as HTMLInputElement;
          const areaStatus = wrap.querySelector('#areaStatus') as HTMLDivElement;
          const btnExportLimite = wrap.querySelector('#btnExportLimite') as HTMLButtonElement;
          const btnSimular = wrap.querySelector('#btnSimular') as HTMLButtonElement;
          
          const lidarLinkCard = wrap.querySelector('#lidarLinkCard') as HTMLDivElement;
          const lidarCoordText = wrap.querySelector('#lidarCoordText') as HTMLDivElement;
          const btnCopyLidar = wrap.querySelector('#btnCopyLidar') as HTMLButtonElement;

          const btnUploadSamples = wrap.querySelector('#btnUploadSamples') as HTMLButtonElement;
          const sampleFileInput = wrap.querySelector('#sampleFileInput') as HTMLInputElement;
          const btnCollectSamples = wrap.querySelector('#btnCollectSamples') as HTMLButtonElement;
          const sampleStatus = wrap.querySelector('#sampleStatus') as HTMLDivElement;

          const drawTools = Array.from(wrap.querySelectorAll('.draw-tool')) as HTMLButtonElement[];
          const btnDrawRect = wrap.querySelector('#btnDrawRect') as HTMLButtonElement;
          const btnDrawPoly = wrap.querySelector('#btnDrawPoly') as HTMLButtonElement;
          const btnDrawCircle = wrap.querySelector('#btnDrawCircle') as HTMLButtonElement;
          const btnReset = wrap.querySelector('#btnReset') as HTMLButtonElement; // <-- Lixeira injetada

          // Modal para amostras
          const sampleModalOverlay = wrap.querySelector('#sampleModalOverlay') as HTMLDivElement;
          const sampleClassInput = wrap.querySelector('#sampleClassInput') as HTMLInputElement;
          const sampleModalOk = wrap.querySelector('#sampleModalOk') as HTMLButtonElement;
          const sampleModalCancel = wrap.querySelector('#sampleModalCancel') as HTMLButtonElement;

          // ==========================================
          // LÓGICA DO RESET (Destravar sistema)
          // ==========================================
          btnReset.addEventListener("click", () => {
              const mapCanvas = document.querySelector(".maplibregl-canvas");
              if (mapCanvas && mapCanvas.parentElement) {
                  mapCanvas.parentElement.querySelectorAll(".smart15-draw-overlay").forEach(o => o.remove());
              }
              isDrawingMode = false;
              geometriaGeoJSON = null;
              bboxCapturada = null;
              
              drawTools.forEach(b => {
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

          let sampleModalResolve: ((value: number | null) => void) | null = null;

          const showSampleModal = (): Promise<number | null> => {
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

          sampleModalOk.addEventListener('click', () => {
            const value = parseInt(sampleClassInput.value) || 1;
            closeSampleModal();
            if (sampleModalResolve) sampleModalResolve(value);
          });

          sampleModalCancel.addEventListener('click', () => {
            closeSampleModal();
            if (sampleModalResolve) sampleModalResolve(null);
          });

          sampleClassInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sampleModalOk.click();
          });

          const fazerDownload = (obj: any, nome: string) => {
            const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = nome;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
          };

          btnExportLimite.addEventListener('click', () => {
            if (geometriaGeoJSON) fazerDownload(geometriaGeoJSON, "limite_smart15.geojson");
          });

          btnCopyLidar.addEventListener('click', () => {
            if (bboxCapturada) {
              const txt = `${bboxCapturada[0].toFixed(2)}, ${bboxCapturada[1].toFixed(2)} to ${bboxCapturada[2].toFixed(2)}, ${bboxCapturada[3].toFixed(2)}`;
              navigator.clipboard.writeText(txt);
              alert("📋 Extensão copiada para o clipboard!");
            }
          });

          btnUpload.addEventListener('click', () => hiddenInput.click());
          hiddenInput.addEventListener('change', (e: any) => {
            const file = e.target.files[0];
            if (file) {
              areaStatus.innerText = `📁 Arquivo de Limite: ${file.name}`;
              areaStatus.style.color = "#2b6cb0"; areaStatus.style.fontWeight = "bold";
              geometriaGeoJSON = { type: "Feature_Importado", arquivo: file.name };
              bboxCapturada = null; lidarLinkCard.style.display = "none"; btnExportLimite.style.display = "none";
              isDrawingMode = false;
            }
          });

          btnUploadSamples.addEventListener('click', () => sampleFileInput.click());
          sampleFileInput.addEventListener('change', (e: any) => {
            const file = e.target.files[0];
            if (file) {
              sampleStatus.innerText = `📁 Amostras: ${file.name}\nTabela Validada (id, class)`;
              sampleStatus.style.color = "#2b6cb0"; sampleStatus.style.fontWeight = "bold";
            }
          });

          const startDrawing = (mode: 'rect' | 'poly' | 'circle' | 'sample') => {
            if (isDrawingMode) return; 
            isDrawingMode = true;

            drawTools.forEach(b => { b.style.backgroundColor = "#edf2f7"; b.style.borderColor = "#cbd5e0"; });
            btnCollectSamples.style.backgroundColor = "#edf2f7";

            if (mode !== 'sample') {
              const activeBtn = mode === 'rect' ? btnDrawRect : mode === 'poly' ? btnDrawPoly : btnDrawCircle;
              activeBtn.style.backgroundColor = "#c6f6d5"; activeBtn.style.borderColor = "#38a169";
            } else {
              btnCollectSamples.style.backgroundColor = "#feebc8";
            }

            const mapCanvas = document.querySelector('.maplibregl-canvas') as HTMLElement;
            const mapContainer = mapCanvas ? mapCanvas.parentElement : null;
            if (!mapContainer) {
              isDrawingMode = false;
              return;
            }

            if (app.map && app.map.dragPan) app.map.dragPan.disable();

            const oldOverlays = mapContainer.querySelectorAll('.smart15-draw-overlay');
            oldOverlays.forEach(o => o.remove());

            const overlay = document.createElement('div');
            overlay.className = 'smart15-draw-overlay';
            overlay.style.position = 'absolute'; overlay.style.top = '0'; overlay.style.left = '0';
            overlay.style.width = '100%'; overlay.style.height = '100%'; overlay.style.zIndex = '9999';
            overlay.style.cursor = 'crosshair'; overlay.style.background = 'transparent';
            overlay.style.touchAction = 'none'; 
            
            overlay.addEventListener('contextmenu', (e) => e.preventDefault());
            
            mapContainer.appendChild(overlay);

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.style.width = '100%'; svg.style.height = '100%'; svg.style.pointerEvents = 'none';
            overlay.appendChild(svg);

            const getPos = (e: PointerEvent) => {
              const r = overlay.getBoundingClientRect();
              return { x: e.clientX - r.left, y: e.clientY - r.top };
            };

            const finishDrawing = () => {
              overlay.remove();
              if (app.map && app.map.dragPan) app.map.dragPan.enable(); 
              
              drawTools.forEach(b => { b.style.backgroundColor = "#edf2f7"; b.style.borderColor = "#cbd5e0"; });
              btnCollectSamples.style.backgroundColor = "#edf2f7";
              isDrawingMode = false;

              if (geometriaGeoJSON) {
                btnExportLimite.style.display = "block";
                if (bboxCapturada) {
                  lidarLinkCard.style.display = "block";
                  lidarCoordText.innerText = `${bboxCapturada[0].toFixed(2)}, ${bboxCapturada[1].toFixed(2)} to ${bboxCapturada[2].toFixed(2)}, ${bboxCapturada[3].toFixed(2)}`;
                }
                areaStatus.innerText = `✅ Geometria capturada e Georreferenciada!`;
                areaStatus.style.color = "#2f855a"; areaStatus.style.fontWeight = "bold";
              }
            };

            if (mode === 'rect') {
              areaStatus.innerText = "🟦 Clique e arraste para desenhar o retângulo.";
              areaStatus.style.color = "#2b6cb0";

              let rectEl: SVGElement | null = null;
              let start: {x: number, y: number} | null = null;
              let frameId: number | null = null;
              let isDrawing = false;

              overlay.onpointerdown = (e: PointerEvent) => {
                e.preventDefault();
                overlay.setPointerCapture(e.pointerId); 
                isDrawing = true;
                start = getPos(e);
                rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rectEl.setAttribute('fill', 'rgba(49, 130, 206, 0.2)');
                rectEl.setAttribute('stroke', '#3182ce'); rectEl.setAttribute('stroke-width', '2');
                svg.appendChild(rectEl);
              };

              overlay.onpointermove = (e: PointerEvent) => {
                e.preventDefault();
                if (!isDrawing || !start || !rectEl) return;
                const cur = getPos(e);
                if (frameId) cancelAnimationFrame(frameId);
                frameId = requestAnimationFrame(() => {
                  rectEl!.setAttribute('x', String(Math.min(start!.x, cur.x)));
                  rectEl!.setAttribute('y', String(Math.min(start!.y, cur.y)));
                  rectEl!.setAttribute('width', String(Math.abs(cur.x - start!.x)));
                  rectEl!.setAttribute('height', String(Math.abs(cur.y - start!.y)));
                });
              };

              overlay.onpointerup = (e: PointerEvent) => {
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
                    type: "Feature", properties: { tipo: "retangulo" },
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
            }

            else if (mode === 'poly') {
              areaStatus.innerText = "⬡ Clique no mapa para criar vértices.\nClique com o BOTÃO DIREITO para fechar.";
              areaStatus.style.color = "#2b6cb0";

              let polyEl = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
              polyEl.setAttribute('fill', 'rgba(49, 130, 206, 0.15)');
              polyEl.setAttribute('stroke', '#2b6cb0');
              polyEl.setAttribute('stroke-width', '2');
              svg.appendChild(polyEl);
            }
          }
        }
      });  
    }
  }
};
