//#region src/geolibre.ts
const painelHtml = `
  <style>
    #smart15-main-wrapper { transition: all 0.3s ease; height: 100vh; overflow-y: auto; padding: 20px; font-family: Arial, sans-serif; box-sizing: border-box; }
    .s15-icon { width: 14px; height: 14px; display: inline-block; vertical-align: middle; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; fill: none; margin-right: 6px; }
    .s15-icon-btn { margin-right: 0; width: 12px; height: 12px; }
    .s15-icon-fill { fill: currentColor; stroke: none; }
    #smart15-main-wrapper { background-color: #ffffff; color: #333333; }
    #smart15-main-wrapper .s15-card { background-color: #f7fafc; border: 1px solid #e2e8f0; }
    #smart15-main-wrapper .s15-title { color: #1a365d; }
    #smart15-main-wrapper .s15-label { color: #2c5282; }
    #smart15-main-wrapper .s15-text { color: #4a5568; }
    #smart15-main-wrapper .s15-border { border-color: #cbd5e0; }
    #smart15-main-wrapper .layer-row { background: #ffffff; border: 1px solid #e2e8f0; }
    #smart15-main-wrapper .draw-tool, #smart15-main-wrapper .s15-btn-normal { background-color: #edf2f7; color: #2b6cb0; border: 1px solid #cbd5e0; transition: all 0.2s; }
    #smart15-main-wrapper .draw-tool:hover, #smart15-main-wrapper .s15-btn-normal:hover { background-color: #e2e8f0; }
    #smart15-main-wrapper .layer-row button { color: #4a5568; }
    #smart15-main-wrapper .layer-row button:hover { background: #edf2f7; }
    #smart15-main-wrapper .smart15-modal { background: #ffffff; color: #333333; }
    #smart15-main-wrapper .s15-help-bg { background: rgba(0,0,0,0.5); }
    #smart15-main-wrapper.s15-dark { background-color: #1a202c; color: #e2e8f0; }
    #smart15-main-wrapper.s15-dark .s15-card { background-color: #2d3748; border: 1px solid #4a5568; }
    #smart15-main-wrapper.s15-dark .s15-title { color: #90cdf4; }
    #smart15-main-wrapper.s15-dark .s15-label { color: #63b3ed; }
    #smart15-main-wrapper.s15-dark .s15-text { color: #a0aec0; }
    #smart15-main-wrapper.s15-dark .s15-border { border-color: #4a5568; }
    #smart15-main-wrapper.s15-dark .layer-row { background: #1a202c; border: 1px solid #4a5568; }
    #smart15-main-wrapper.s15-dark .draw-tool, #smart15-main-wrapper.s15-dark .s15-btn-normal { background-color: #4a5568; color: #e2e8f0; border: 1px solid #718096; }
    #smart15-main-wrapper.s15-dark .draw-tool:hover, #smart15-main-wrapper.s15-dark .s15-btn-normal:hover { background-color: #2d3748; }
    #smart15-main-wrapper.s15-dark .layer-row button { color: #e2e8f0; }
    #smart15-main-wrapper.s15-dark .layer-row button:hover { background: #4a5568; }
    #smart15-main-wrapper.s15-dark .smart15-modal { background: #2d3748; color: #e2e8f0; border: 1px solid #4a5568; }
    #smart15-main-wrapper.s15-dark .s15-help-bg { background: rgba(0,0,0,0.7); }
    .smart15-btn-export { background: #f0fdf4; border: 1px dashed #4ade80; border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; transition: all 0.2s ease; color: #166534; display: flex; flex-direction: column; align-items: center; gap: 4px; width: 100%; margin-top: 8px; font-weight:bold; }
    .smart15-btn-export:hover { background: #dcfce7; transform: translateY(-2px); border-color: #22c55e; }
    #smart15-main-wrapper.s15-dark .smart15-btn-export { background: #1c4532; border-color: #4ade80; color: #c6f6d5; }
    #smart15-main-wrapper.s15-dark .smart15-btn-export:hover { background: #22543d; }
    .layer-row { display: flex; justify-content: space-between; align-items: center; padding: 6px; border-radius: 4px; margin-bottom: 4px; }
    .layer-row span { font-size: 11px; font-weight: bold; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .layer-row .tools { display: flex; gap: 4px; }
    .layer-row button { cursor: pointer; border: none; background: transparent; padding: 4px; border-radius: 3px; display: flex; align-items: center; justify-content: center;}
    .ctrl-group { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
    .ctrl-label { font-size: 11px; font-weight: bold; width: 30%; display: flex; align-items: center; }
    .ctrl-tools { display: flex; gap: 6px; align-items: center; flex: 1; justify-content: flex-end; }
    .ctrl-chk { font-size: 9px; cursor: pointer; display: flex; align-items: center; }
    .smart15-modal { display: none; position: fixed; top: 5%; left: 10%; width: 80%; height: 90%; z-index: 10000; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); border-radius: 8px; overflow-y: auto; font-family: Arial; }
    .smart15-modal-backdrop { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; }
    .legenda-box { width: 12px; height: 12px; display: inline-block; margin-right: 4px; border-radius: 2px; border: 1px solid rgba(0,0,0,0.1); }
    .poi-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 4px; }
    svg { display: block; }
  </style>

  <svg style="display: none;">
    <defs>
      <g id="icon-import"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></g>
      <g id="icon-rect"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></g>
      <g id="icon-poly"><path d="M12 2l9 5v10l-9 5-9-5V7z"/></g>
      <g id="icon-circle"><circle cx="12" cy="12" r="10"/></g>
      <g id="icon-trash"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></g>
      <g id="icon-up"><polyline points="18 15 12 9 6 15"/></g>
      <g id="icon-down"><polyline points="6 9 12 15 18 9"/></g>
      <g id="icon-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></g>
      <g id="icon-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></g>
      <g id="icon-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></g>
      <g id="icon-sun"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></g>
      <g id="icon-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></g>
      <g id="icon-info"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></g>
      <g id="icon-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></g>
      <g id="icon-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 22l8.5-8.5"/></g>
      <g id="icon-thermometer"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></g>
      <g id="icon-mountain"><path d="M8 3l4 8 5-5 5 15H2L8 3z"/></g>
      <g id="icon-pedestrian"><path d="M12 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M10 22v-9l-2-2v-3h8v3l-2 2v9"/><path d="M8 8h8"/></g>
      <g id="icon-bike"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></g>
      <g id="icon-server"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></g>
      <g id="icon-check"><polyline points="20 6 9 17 4 12"/></g>
      <g id="icon-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></g>
      <g id="icon-warn"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></g>
      <g id="icon-circle-fill"><circle cx="12" cy="12" r="10"/></g>
      <g id="icon-camera"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></g>
    </defs>
  </svg>

  <div id="smart15-main-wrapper">
    <div id="smart15HelpBackdrop" class="smart15-modal-backdrop s15-help-bg"></div>
    
    <div id="smart15HelpModal" class="smart15-modal">
      <h2 class="s15-title" style="margin-top: 0;">Metodologia e Dicionário (Smart-15)</h2>
      <div class="s15-text" style="font-size: 13px; line-height: 1.6;">
          <p><b>1. Projeção Métrica Georreferenciada:</b> A malha viária é projetada de WGS84 (Graus) para UTM local (Metros) antes do roteamento, garantindo distâncias e áreas isócronas matematicamente precisas.</p>
          <p><b>2. Isócronas e Dilatação Morfológica:</b> Geração de polígonos baseados na distância percorrida por tempo na rede de ruas reais (NetworkX/OSMnx). Um buffer morfológico é aplicado às arestas para fechamento de lacunas, criando manchas contínuas de acesso.</p>
          <p><b>3. Indexação Hexagonal (H3):</b> Utiliza a biblioteca matemática H3 para tesselação da área (Resolução 10), permitindo análises estatísticas uniformes e comparáveis sobre o território.</p>
          <p><b>4. Classificação Inteligente (IA):</b> Algoritmo OBIA / Decision Tree treinado via amostras vetoriais do utilizador para detectar áreas de interesse via Índices Radiométricos (NGRDI) lidos da ortofoto.</p>
          <p><b>5. Função de Tobler (DEM):</b> Incorpora Modelos Digitais de Elevação para reduzir ou aumentar a velocidade teórica de caminhada e ciclismo com base na inclinação real do terreno.</p>
          <p><b>6. Penalidade Térmica (LST):</b> Fator de atrito térmico derivado de imagens infravermelhas (Temperatura da Superfície), reduzindo a mobilidade de grupos vulneráveis em zonas de calor extremo.</p>
          
          <hr class="s15-border" style="margin: 15px 0;">
          <h3 class="s15-title" style="font-size: 14px; margin-bottom: 8px;">Bibliografia Base:</h3>
          <ul style="margin-top: 0; padding-left: 20px;">
              <li style="margin-bottom: 4px;">BOEING, G. (2017). <i>OSMnx: New methods for acquiring, constructing, analyzing, and visualizing complex street networks</i>. Computers, Environment and Urban Systems.</li>
              <li style="margin-bottom: 4px;">BREIMAN, L., et al. (1984). <i>Classification and Regression Trees</i>. Wadsworth. (OBIA / Decision Trees).</li>
              <li style="margin-bottom: 4px;">TOBLER, W. (1993). <i>Three presentations on geographical analysis and modeling</i>. National Center for Geographic Information and Analysis.</li>
              <li style="margin-bottom: 4px;">UBER TECHNOLOGIES. (2018). <i>H3: Uber’s Hexagonal Hierarchical Spatial Index</i>.</li>
          </ul>
      </div>
      <button id="btnCloseHelp" style="padding: 10px 15px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer; float: right; margin-top: 10px; font-weight: bold;">Fechar Dicionário</button>
    </div>

    <div id="smart15InstrucoesModal" class="smart15-modal">
      <h2 style="color:#166534; margin-top: 0;">Como Utilizar o Smart-15</h2>
      <div class="s15-text" style="font-size: 13px; line-height: 1.6;">
          <p><b>1. Ordem das Camadas (IMPORTANTE):</b> O motor gráfico do painel desenha o mapa sequencialmente. Para uma camada ficar <b>POR CIMA</b>, você deve movê-la para <b>BAIXO</b> na lista de camadas.</p>
          <p><b>2. Rasters (Caixa 9):</b> Se deixar no "Cloud Automático", o painel utilizará as APIs do Microsoft Planetary Computer e da AWS.</p>
          <p><b>3. Visualização 3D:</b> Marque "Ativar Extrusão 3D na Tela", segure o <b>BOTÃO DIREITO</b> do rato e arraste-o para inclinar a câmara.</p>
          <p><b>4. Recorte Visual (Máscara):</b> Na Caixa 7, ative "✂️ Isolar Município" para esconder o entorno e focar apenas na sua geometria de estudo.</p>
          <p><b>5. Consultar Dados (Popups):</b> Ligue a caixa " ATIVAR IDENTIFICADOR (i)". Passe o rato sobre qualquer geometria para ver os dados de Tempo, Perfil, Categorias de Equipamentos OSM e Classificações da IA. Para ler valores exatos de Satélite (Calor/Relevo), use a <b>Legenda Dinâmica Exata</b> na secção 7.</p>
          <p><b>6. Cortina Comparativa (Swipe):</b> Ao ativar a cortina, a tela é dividida. Para comparar, oculte camadas no painel (ícone de olho). O lado <b>Esquerdo</b> ficará congelado com o cenário anterior, e o <b>Direito</b> refletirá suas mudanças.</p>
      </div>
      <button id="btnCloseInstrucoes" style="padding: 10px 15px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer; float: right; margin-top: 10px; font-weight: bold;">Fechar Instruções</button>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2b6cb0; padding-bottom: 12px; margin-bottom: 20px;" class="s15-border">
      <div>
        <h2 class="s15-title" style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">Smart-15: Cidades</h2>
        <p class="s15-text" style="font-size: 11px; margin: 0;">Geo-Analytics Metrics v2.0</p>
      </div>
      <div style="display: flex; gap: 6px; flex-direction: column; align-items: flex-end;">
        <button id="btnToggleTheme" style="background: transparent; color: inherit; border: 1px solid currentColor; padding: 4px 8px; border-radius: 4px; cursor: pointer; display:flex; align-items:center; font-size:10px;">
          <svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-moon"/></svg> Modo Escuro
        </button>
        <div style="display:flex; gap: 4px;">
            <button id="btnOpenHelp" style="background: #3182ce; color: white; border: none; padding: 6px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; display:flex; align-items:center;">
              <svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-book"/></svg> Metodologia
            </button>
            <button id="btnOpenInstrucoes" style="background: #166534; color: white; border: none; padding: 6px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; display:flex; align-items:center;">
              <svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-info"/></svg> Ajuda / 3D
            </button>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <label class="s15-label" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 8px;">1. Limite Geográfico</label>
      <div style="display: flex; gap: 4px; margin-bottom: 8px; flex-wrap: wrap;">
        <input type="file" id="hiddenFileInput" accept=".geojson,.kml,.shp,.zip" style="display: none;" />
        <button id="btnUploadArea" class="s15-btn-normal" style="flex: 1; padding: 6px; border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: bold; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-import"/></svg> Importar
        </button>
        <button id="btnDrawRect" class="draw-tool" title="Desenhar Retângulo" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer; display:flex; justify-content:center;">
            <svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-rect"/></svg>
        </button>
        <button id="btnDrawPoly" class="draw-tool" title="Desenhar Polígono" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer; display:flex; justify-content:center;">
            <svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-poly"/></svg>
        </button>
        <button id="btnDrawCircle" class="draw-tool" title="Desenhar Raio" style="flex: 1; padding: 6px; border-radius: 4px; cursor: pointer; display:flex; justify-content:center;">
            <svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-circle"/></svg>
        </button>
        <button id="btnReset" title="Limpar Geometria" style="flex: 1; padding: 6px; background-color: #fed7d7; border: 1px solid #fc8181; border-radius: 4px; cursor: pointer; display:flex; justify-content:center; color:#c53030; transition: 0.2s;">
            <svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-trash"/></svg>
        </button>
      </div>
      <div id="areaStatus" class="s15-text" style="font-size: 11px; margin-top: 6px; font-style: italic;">Nenhum limite definido</div>
      <div id="areaCoords" style="font-family: monospace; font-size: 10px; color: #c05621; margin-top: 4px; word-break: break-all;"></div>
    </div>

    <div style="margin-bottom: 24px; border-top: 1px solid; padding-top: 16px;" class="s15-border">
      <label class="s15-label" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 4px;">2. Amostras (Treinamento IA)</label>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <input type="file" id="sampleFileInput" accept=".geojson,.kml,.zip" style="display: none;" />
        <button id="btnUploadSamples" class="s15-card s15-text" style="width: 100%; padding: 8px; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 24 24" class="s15-icon"><use href="#icon-import"/></svg> Subir Ficheiro de Amostras
        </button>
      </div>
      <div id="sampleStatus" class="s15-text" style="font-size: 11px; margin-top: 6px; font-style: italic;">Nenhuma amostra carregada</div>
      <div id="sampleCoords" style="font-family: monospace; font-size: 10px; color: #c05621; margin-top: 4px; word-break: break-all;"></div>
    </div>

    <div style="margin-bottom: 24px;">
      <label class="s15-label" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 8px;">3. Destinos OSM (Subcategorias)</label>
      <div class="s15-card" style="display: flex; flex-direction: column; gap: 4px; padding: 12px; border-radius: 4px;">
        <div class="s15-text s15-border" style="font-size: 11px; font-weight: bold; margin-bottom: 2px; border-bottom: 1px solid; padding-bottom: 2px; display:flex; align-items:center;">
          <svg viewBox="0 0 24 24" class="s15-icon s15-icon-fill" style="color:#e53e3e;"><use href="#icon-circle-fill"/></svg> Essenciais (Peso 3)
        </div>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="osm-target" value="escolas" checked style="margin-right: 8px;" /> Escolas e Creches</label>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="osm-target" value="hospitais" checked style="margin-right: 8px;" /> Hospitais e Clínicas</label>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="osm-target" value="mercados" style="margin-right: 8px;" /> Mercados e Padarias</label>

        <div class="s15-text s15-border" style="font-size: 11px; font-weight: bold; margin-top: 8px; margin-bottom: 2px; border-bottom: 1px solid; padding-bottom: 2px; display:flex; align-items:center;">
          <svg viewBox="0 0 24 24" class="s15-icon s15-icon-fill" style="color:#dd6b20;"><use href="#icon-circle-fill"/></svg> Importantes (Peso 2)
        </div>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="osm-target" value="parques" checked style="margin-right: 8px;" /> Parques e Praças</label>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="osm-target" value="cultura" style="margin-right: 8px;" /> Centros Culturais / Museus</label>

        <div class="s15-text s15-border" style="font-size: 11px; font-weight: bold; margin-top: 8px; margin-bottom: 2px; border-bottom: 1px solid; padding-bottom: 2px; display:flex; align-items:center;">
          <svg viewBox="0 0 24 24" class="s15-icon s15-icon-fill" style="color:#ecc94b;"><use href="#icon-circle-fill"/></svg> Complementares (Peso 1)
        </div>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="osm-target" value="comercio" style="margin-right: 8px;" /> Comércio Local</label>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="osm-target" value="academias" style="margin-right: 8px;" /> Academias e Ginásios</label>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <label class="s15-label" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 4px;">4. Simulação Múltipla (Velocidades)</label>
      <div class="s15-card" style="display: flex; flex-direction: column; gap: 6px; padding: 12px; border-radius: 4px;">
        <div class="s15-text" style="font-size: 11px; font-weight: bold; margin-bottom: 2px; display:flex; align-items:center;"><svg viewBox="0 0 24 24" class="s15-icon"><use href="#icon-pedestrian"/></svg> A pé (Pedestres)</div>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="perfil-target" value="adulto_pedestre" checked style="margin-right: 8px;" /> Adulto (4.5 km/h)</label>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="perfil-target" value="pedestre_crianca" style="margin-right: 8px;" /> Criança (3.5 km/h)</label>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="perfil-target" value="pedestre_idoso" style="margin-right: 8px;" /> Idoso (3.0 km/h)</label>
        <div class="s15-text" style="font-size: 11px; font-weight: bold; margin-top: 6px; margin-bottom: 2px; display:flex; align-items:center;"><svg viewBox="0 0 24 24" class="s15-icon"><use href="#icon-bike"/></svg> Ciclismo (Bicicletas)</div>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="perfil-target" value="adulto_bike" checked style="margin-right: 8px;" /> Adulto (15.0 km/h)</label>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="perfil-target" value="ciclista_crianca" style="margin-right: 8px;" /> Criança (11.0 km/h)</label>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="perfil-target" value="ciclista_idoso" style="margin-right: 8px;" /> Idoso (10.0 km/h)</label>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <label class="s15-label" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 4px;">5. Variáveis Ambientais (Rasters)</label>
      <div class="s15-card" style="display: flex; flex-direction: column; gap: 12px; padding: 12px; border-radius: 4px;">
        
        <div>
          <label class="s15-text" style="font-size: 11px; font-weight: bold; display: flex; align-items:center; margin-bottom: 4px;"><svg viewBox="0 0 24 24" class="s15-icon"><use href="#icon-leaf"/></svg> Ortofoto RGB / Vegetação (FIS)</label>
          <div style="display: flex; gap: 4px;">
            <select id="modoVeg" class="s15-border s15-card s15-text" style="flex: 1; padding: 6px; border-radius: 4px; border-width: 1px; font-size: 12px; cursor: pointer;">
              <option value="auto_sentinel">Cloud Automático (Sentinel-2)</option>
              <option value="manual">Upload Local (.tif)</option>
            </select>
            <input type="file" id="fileVeg" accept=".tif,.tiff" style="display: none;" />
            <button id="btnFileVeg" class="s15-btn-normal" style="display: none; padding: 6px; border-radius: 4px; font-size: 11px; cursor: pointer; font-weight: bold;">Escolher</button>
          </div>
          <div id="statusVeg" style="font-size: 10px; color: #2b6cb0; margin-top: 4px;"></div>
        </div>

        <div>
          <label class="s15-text" style="font-size: 11px; font-weight: bold; display: flex; align-items:center; margin-bottom: 4px; color: #e53e3e;"><svg viewBox="0 0 24 24" class="s15-icon"><use href="#icon-thermometer"/></svg> Camada Térmica LST (FIT)</label>
          <div style="display: flex; gap: 4px;">
            <select id="modoTemp" class="s15-border s15-card s15-text" style="flex: 1; padding: 6px; border-radius: 4px; border-width: 1px; font-size: 12px; cursor: pointer;">
              <option value="auto_pc">Cloud Automático (Planetary Computer)</option>
              <option value="manual">Upload Local (.tif)</option>
            </select>
            <input type="file" id="fileTemp" accept=".tif,.tiff" style="display: none;" />
            <button id="btnFileTemp" class="s15-btn-normal" style="display: none; padding: 6px; border-radius: 4px; font-size: 11px; cursor: pointer; font-weight: bold;">Escolher</button>
          </div>
          <div id="statusTemp" style="font-size: 10px; color: #2b6cb0; margin-top: 4px;"></div>
        </div>

        <div>
          <label class="s15-text" style="font-size: 11px; font-weight: bold; display: flex; align-items:center; margin-bottom: 4px;"><svg viewBox="0 0 24 24" class="s15-icon"><use href="#icon-mountain"/></svg> Camada de Relevo DEM (FID)</label>
          <div style="display: flex; gap: 4px;">
            <select id="modoDem" class="s15-border s15-card s15-text" style="flex: 1; padding: 6px; border-radius: 4px; border-width: 1px; font-size: 12px; cursor: pointer;">
              <option value="auto">Cloud Automático (Copernicus)</option>
              <option value="manual">Upload Local (.tif)</option>
            </select>
            <input type="file" id="fileDem" accept=".tif,.tiff" style="display: none;" />
            <button id="btnFileDem" class="s15-btn-normal" style="display: none; padding: 6px; border-radius: 4px; font-size: 11px; cursor: pointer; font-weight: bold;">Escolher</button>
          </div>
          <div id="statusDem" style="font-size: 10px; color: #2b6cb0; margin-top: 4px;"></div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <label class="s15-label" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 4px;">6. Exportação e Renderização</label>
      <div class="s15-card" style="padding: 12px; border-radius: 4px;">
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="formato-saida" value="hexagonos" checked style="margin-right: 8px;" /> Processar Tesselações (H3)</label>
        <label class="s15-text" style="font-size: 13px; display: flex; align-items: center; cursor: pointer;"><input type="checkbox" class="formato-saida" value="isocronas" checked style="margin-right: 8px;" /> Processar Isócronas</label>
        <hr class="s15-border" style="border-width:0; border-top-width: 1px; margin: 8px 0;">
        <label style="font-size: 13px; display: flex; align-items: center; color: #c05621; cursor: pointer; font-weight: bold;"><input type="checkbox" id="extrusao3d" checked style="margin-right: 8px; width: 16px; height: 16px;" /> Ativar Extrusão 3D na Tela</label>
        <hr class="s15-border" style="border-width:0; border-top-width: 1px; margin: 8px 0;">
        <div class="s15-text" style="font-size: 11px; font-weight: bold; margin-bottom: 4px;">Formatos de Download (.ZIP):</div>
        <div style="display:flex; gap:10px;">
            <label class="s15-text" style="font-size: 11px; cursor: pointer;"><input type="checkbox" class="formato-export" value="shp" checked /> SHP</label>
            <label class="s15-text" style="font-size: 11px; cursor: pointer;"><input type="checkbox" class="formato-export" value="geojson" /> GeoJSON</label>
            <label class="s15-text" style="font-size: 11px; cursor: pointer;"><input type="checkbox" class="formato-export" value="kml" /> KML</label>
        </div>
      </div>
    </div>

    <button id="btnSimular" style="width: 100%; padding: 14px; background-color: #2b6cb0; color: #ffffff; font-weight: bold; font-size: 14px; border: none; border-radius: 4px; cursor: pointer; text-transform: uppercase;">Executar Simulação Urbana</button>
    
    <div id="progressContainer" style="display: none; margin-top: 16px; background-color: #ebf8ff; border: 1px solid #bee3f8; padding: 12px; border-radius: 4px;">
      <div style="display: flex; justify-content: space-between; font-size: 11px; color: #2c5282; margin-bottom: 6px; font-weight: bold;"><span id="progressLabel" style="display:flex; align-items:center;"></span><span id="progressText">0%</span></div>
      <div style="width: 100%; background-color: #cbd5e0; border-radius: 4px; overflow: hidden; height: 12px;"><div id="progressBar" style="width: 0%; height: 100%; background-color: #3182ce; transition: width 0.3s ease-out;"></div></div>
    </div>

    <div id="painelPosProcessamento" style="display: none; margin-top: 24px;">
      
      <div class="s15-border" style="margin-bottom: 24px; border-top-width: 2px; border-top-style: solid; padding-top: 16px;">
        <label class="s15-label" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 8px;">7. Controles Visuais Múltiplos</label>
        
        <div class="s15-text s15-border" style="font-size: 10px; margin-bottom: 6px; border-bottom: 1px solid; padding-bottom: 8px;">
            <b style="display: block; margin-bottom: 6px;">Legenda de Tempo (Degradê):</b>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                <span style="display:flex; align-items:center;"><span class="legenda-box" style="background:#4ade80;"></span> 2 min</span>
                <span style="display:flex; align-items:center;"><span class="legenda-box" style="background:#a3e635;"></span> 5 min</span>
                <span style="display:flex; align-items:center;"><span class="legenda-box" style="background:#facc15;"></span> 10 min</span>
                <span style="display:flex; align-items:center;"><span class="legenda-box" style="background:#fb923c;"></span> 15 min</span>
                <span style="display:flex; align-items:center;"><span class="legenda-box" style="background:#ef4444;"></span> >15 min (Penalidade)</span>
            </div>
        </div>

        <div id="rasterLegendsContainer" class="s15-text s15-border" style="font-size: 10px; margin-bottom: 12px; border-bottom: 1px solid; padding-bottom: 8px; display:none;">
            </div>

        <div class="s15-text s15-border" style="font-size: 10px; margin-bottom: 12px; border-bottom: 1px solid; padding-bottom: 8px;">
            <b style="display: block; margin-bottom: 6px;">Legenda de POIs (OSM):</b>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                <span style="display:flex; align-items:center;"><span class="poi-dot" style="background:#e53e3e;"></span> Escolas</span>
                <span style="display:flex; align-items:center;"><span class="poi-dot" style="background:#3182ce;"></span> Hospitais</span>
                <span style="display:flex; align-items:center;"><span class="poi-dot" style="background:#38a169;"></span> Parques</span>
                <span style="display:flex; align-items:center;"><span class="poi-dot" style="background:#d69e2e;"></span> Mercados</span>
                <span style="display:flex; align-items:center;"><span class="poi-dot" style="background:#805ad5;"></span> Cultura</span>
                <span style="display:flex; align-items:center;"><span class="poi-dot" style="background:#00b5d8;"></span> Comércio</span>
                <span style="display:flex; align-items:center;"><span class="poi-dot" style="background:#dd6b20;"></span> Academias</span>
            </div>
        </div>

        <div class="s15-card" style="display: flex; flex-direction: column; gap: 10px; padding: 12px; border-radius: 4px;">
          
          <label class="ctrl-chk s15-text" style="color:#d69e2e; font-weight:bold; cursor:pointer; background:#fffff0; padding:6px; border-radius:4px; border:1px solid #ecc94b; display:flex; justify-content:center;">
             <input type="checkbox" id="toggleInfoMode" style="margin-right:6px;">  ATIVAR IDENTIFICADOR (i)
          </label>

          <label class="ctrl-chk s15-text" style="color:#2b6cb0; font-weight:bold; cursor:pointer; background:#f0f7ff; padding:6px; border-radius:4px; border:1px solid #90cdf4; display:flex; justify-content:center; margin-top:4px;">
             <input type="checkbox" id="toggleSwipeMode" style="margin-right:6px;"> ↔️ CORTINA COMPARATIVA (SWIPE)
          </label>

          <div class="ctrl-group" style="margin-top:4px;">
            <span class="ctrl-label s15-text">Área (Base):</span>
            <div class="ctrl-tools">
              <input type="color" id="corArea" value="#ecc94b" style="width: 20px; height: 20px; padding: 0; border: none; cursor: pointer;">
              <input type="range" id="opacArea" min="0" max="100" value="10" style="width: 50px;">
              <label class="ctrl-chk s15-text"><input type="checkbox" id="contornoArea" style="margin-right:2px;"> Contorno</label>
            </div>
          </div>

          <div class="ctrl-group">
            <span class="ctrl-label s15-text">Máscara (Clip):</span>
            <div class="ctrl-tools" style="justify-content: flex-start;">
              <label class="ctrl-chk s15-text"><input type="checkbox" id="toggleMascara" style="margin-right:4px;"> ✂️ Isolar Município</label>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div class="ctrl-group" style="margin-bottom:0;">
              <span class="ctrl-label s15-text">Amostras IA:</span>
              <div class="ctrl-tools">
                <input type="color" id="corOsm" value="#4a5568" style="width: 20px; height: 20px; padding: 0; border: none; cursor: pointer;">
                <input type="range" id="opacOsm" min="0" max="100" value="100" style="width: 50px;">
                <label class="ctrl-chk s15-text"><input type="checkbox" id="contornoOsm" style="margin-right:2px;"> Contorno</label>
              </div>
            </div>
          </div>

          <div class="ctrl-group">
            <span class="ctrl-label" style="color: #2b6cb0;">Isócronas:</span>
            <div class="ctrl-tools">
              <input type="range" id="opacIso" min="0" max="100" value="60" style="width: 50px;">
              <label class="ctrl-chk s15-text"><input type="checkbox" id="contornoIso" style="margin-right:2px;"> Contorno</label>
            </div>
          </div>
          
          <div class="ctrl-group" style="margin-bottom:0;">
            <span class="ctrl-label" style="color: #c53030;">Hexágonos:</span>
            <div class="ctrl-tools">
              <input type="range" id="opacHex" min="0" max="100" value="60" style="width: 50px;">
              <label class="ctrl-chk s15-text"><input type="checkbox" id="contornoHex" style="margin-right:2px;"> Contorno 3D</label>
            </div>
          </div>
          
        </div>
      </div>

      <div>
        <label class="s15-label" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 8px;">8. Camadas de Vetores (Simulações)</label>
        <div id="listaCamadasInput" style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px;"></div>
        <div id="listaCamadas" style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; max-height: 250px; overflow-y: auto; padding-right: 5px;"></div>
      </div>
      
      <div style="margin-top: 16px;">
        <label class="s15-label" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 8px;">9. Camadas de Rasters (Ambiente)</label>
        <div id="listaCamadasRasters" style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px;"></div>
      </div>

      <button id="btnExportResult" class="smart15-btn-export">
        <strong style="color:inherit;"><svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-download"/></svg> FAZER DOWNLOAD DO .ZIP</strong>
      </button>

      <button id="btnScreenshot" class="smart15-btn-export" style="background: #ebf8ff; border-color: #63b3ed; color: #2b6cb0;">
        <strong style="color:inherit;"><svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-camera"/></svg> CAPTURAR MAPA (SCREENSHOT)</strong>
      </button>

    </div>
  </div>
`;

let bboxCapturada = null;
let geometriaGeoJSON = null;
let amostrasGeoJSON = null;
let isDrawingMode = false;
let layersAtivos = [];
let downloadUrlZip = null;
let maskDataGeoJSON = null;
let isInfoMode = false;
let isSwipeMode = false;
let secondMapInstance = null;

const SVG_ICONS = {
    SUCCESS: '<svg viewBox="0 0 24 24" class="s15-icon" style="stroke:#38a169"><use href="#icon-check"/></svg>',
    LOAD: '<svg viewBox="0 0 24 24" class="s15-icon" style="stroke:#d69e2e"><use href="#icon-clock"/></svg>',
    WARN: '<svg viewBox="0 0 24 24" class="s15-icon" style="stroke:#e53e3e"><use href="#icon-warn"/></svg>',
    SERVER: '<svg viewBox="0 0 24 24" class="s15-icon"><use href="#icon-server"/></svg>',
    EYE: '<svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-eye"/></svg>',
    EYE_OFF: '<svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-eye-off"/></svg>',
    UP: '<svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-up"/></svg>',
    DOWN: '<svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-down"/></svg>'
};

const getMapInstance = (app: any) => {
    if (app && app.map && typeof app.map.unproject === 'function') return app.map;
    if (app && typeof app.getMap === 'function') return app.getMap();
    if ((window as any).map && typeof (window as any).map.unproject === 'function') return (window as any).map;
    return null;
};

const calculateBBox = (geojson: any) => {
    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    const extract = (coords: any) => {
        if (!coords || coords.length === 0) return;
        if (typeof coords[0] === 'number') {
            minLng = Math.min(minLng, coords[0]); minLat = Math.min(minLat, coords[1]);
            maxLng = Math.max(maxLng, coords[0]); maxLat = Math.max(maxLat, coords[1]);
        } else if (Array.isArray(coords)) { coords.forEach(extract); }
    };
    if (geojson.type === 'FeatureCollection') { geojson.features.forEach((f: any) => extract(f.geometry ? f.geometry.coordinates : null)); } 
    else if (geojson.type === 'Feature') { extract(geojson.geometry ? geojson.geometry.coordinates : null); }
    else if (geojson.coordinates) { extract(geojson.coordinates); }
    if (minLng !== Infinity) return [[minLng, minLat], [maxLng, maxLat]];
    return null;
};

export const plugin = {
	id: "smart15-orquestrador",
	name: "Smart-15: Acessibilidade",
	version: "2.0.0",
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

                    const mapObj = getMapInstance(app);
                    
                    let tooltip = document.getElementById('smart15-tooltip');
                    if (!tooltip) {
                        tooltip = document.createElement('div');
                        tooltip.id = 'smart15-tooltip';
                        tooltip.style.position = 'absolute';
                        tooltip.style.background = '#ffffff';
                        tooltip.style.padding = '10px';
                        tooltip.style.border = '2px solid #2b6cb0';
                        tooltip.style.borderRadius = '6px';
                        tooltip.style.pointerEvents = 'none';
                        tooltip.style.display = 'none';
                        tooltip.style.zIndex = '99999';
                        tooltip.style.fontSize = '12px';
                        tooltip.style.maxHeight = '300px';
                        tooltip.style.overflowY = 'auto';
                        tooltip.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
                        document.body.appendChild(tooltip);
                    }

                    if (mapObj && !(mapObj as any)._silencedMissingImages) {
                        (mapObj as any)._silencedMissingImages = true;
                        mapObj.on('styleimagemissing', (e: any) => {
                            const canvas = document.createElement('canvas'); canvas.width = 1; canvas.height = 1;
                            try { mapObj.addImage(e.id, (canvas.getContext('2d') as CanvasRenderingContext2D).getImageData(0, 0, 1, 1)); } catch(err) {}
                        });
                        
                        mapObj.on('mousemove', (e: any) => {
                            if (!isInfoMode) return;
                            const features = mapObj.queryRenderedFeatures(e.point);
                            const myFeats = features.filter((f: any) => f.layer.id.includes('smart15') && f.properties);
                            
                            if (myFeats.length > 0) {
                                tooltip!.style.display = 'block';
                                tooltip!.style.left = (e.originalEvent.pageX + 15) + 'px';
                                tooltip!.style.top = (e.originalEvent.pageY + 15) + 'px';
                                
                                let innerHTML = '';
                                const seen = new Set();
                                
                                myFeats.forEach((f: any) => {
                                    const props = f.properties;
                                    const strProps = JSON.stringify(props);
                                    if(seen.has(strProps)) return; 
                                    seen.add(strProps);
                                    
                                    if (props.tipo === 'isocronas' || props.tipo === 'hexagonos') {
                                        innerHTML += `<div style="margin-bottom:6px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
                                            <span style="color:#2c5282;"><b>⚙️ Perfil:</b> ${props.perfil}</span><br>
                                            <span style="color:#e53e3e;"><b>⏱️ Tempo:</b> ${props.time_band} min</span><br>
                                            <span style="color:#38a169;"><b>💠 Tipo:</b> ${props.tipo}</span>
                                        </div>`;
                                    } else if (props.categoria) {
                                        innerHTML += `<div style="margin-bottom:6px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
                                            <span style="color:#d69e2e;"><b>📍 POI (Equipamento):</b></span><br>
                                            <b>Tipo:</b> ${props.categoria.toUpperCase()}
                                        </div>`;
                                    } else if (props.class || props.classe || props.nome || props.label) {
                                        const c = props.class || props.classe || props.nome || props.label;
                                        innerHTML += `<div style="margin-bottom:6px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
                                            <span style="color:#805ad5;"><b>🎯 Amostra / Vetor:</b></span><br>
                                            <b>Classe:</b> ${c.toUpperCase()}
                                        </div>`;
                                    } else {
                                        let propStr = '';
                                        for (let key in props) {
                                            if (key !== 'id' && key !== 'fid') { propStr += `<b>${key}:</b> ${props[key]}<br>`; }
                                        }
                                        if(propStr) {
                                            innerHTML += `<div style="margin-bottom:6px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
                                                <span style="color:#4a5568;"><b>Dados da Camada:</b></span><br>${propStr}
                                            </div>`;
                                        }
                                    }
                                });

                                if (innerHTML === '') {
                                    tooltip!.innerHTML = `<span style="color:#718096; font-style:italic;">(Nenhum dado vetorial detectado aqui. Para Rasters, leia a Legenda Dinâmica na Caixa 7)</span>`;
                                } else {
                                    tooltip!.innerHTML = innerHTML;
                                }
                                mapObj.getCanvas().style.cursor = 'crosshair';
                            } else {
                                tooltip!.style.display = 'none';
                                mapObj.getCanvas().style.cursor = 'help';
                            }
                        });
                        
                        mapObj.on('mouseout', () => { tooltip!.style.display = 'none'; });
                    }

                    (wrap.querySelector("#toggleInfoMode") as HTMLInputElement).addEventListener("change", (e: any) => {
                        isInfoMode = e.target.checked;
                        if (!isInfoMode && tooltip) { tooltip.style.display = 'none'; }
                        if(mapObj && mapObj.getCanvas()) { mapObj.getCanvas().style.cursor = isInfoMode ? 'help' : ''; }
                    });

                    let moveSyncHandler: any = null;
                    let onMouseMoveSwipe: any = null;
                    let onMouseUpSwipe: any = null;

                    (wrap.querySelector("#toggleSwipeMode") as HTMLInputElement).addEventListener("change", (e: any) => {
                        isSwipeMode = e.target.checked;
                        const mapContainer = mapObj.getContainer();
                        
                        if (isSwipeMode) {
                            let swipeDiv = document.getElementById('smart15-swipe-div');
                            if (!swipeDiv) {
                                swipeDiv = document.createElement('div');
                                swipeDiv.id = 'smart15-swipe-div';
                                swipeDiv.style.position = 'absolute';
                                swipeDiv.style.top = '0';
                                swipeDiv.style.left = '0';
                                swipeDiv.style.width = '50%';
                                swipeDiv.style.height = '100%';
                                swipeDiv.style.zIndex = '990';
                                swipeDiv.style.borderRight = '4px solid #2b6cb0';
                                swipeDiv.style.overflow = 'hidden';
                                swipeDiv.style.pointerEvents = 'none';
                                
                                const innerDiv = document.createElement('div');
                                innerDiv.id = 'smart15-swipe-inner';
                                innerDiv.style.width = mapContainer.clientWidth + 'px';
                                innerDiv.style.height = mapContainer.clientHeight + 'px';
                                innerDiv.style.pointerEvents = 'none';
                                swipeDiv.appendChild(innerDiv);
                                mapContainer.appendChild(swipeDiv);

                                const handle = document.createElement('div');
                                handle.id = 'smart15-swipe-handle';
                                handle.style.position = 'absolute';
                                handle.style.top = '50%';
                                handle.style.left = '50%';
                                handle.style.width = '36px';
                                handle.style.height = '36px';
                                handle.style.marginLeft = '-18px';
                                handle.style.marginTop = '-18px';
                                handle.style.background = '#2b6cb0';
                                handle.style.color = '#ffffff';
                                handle.style.borderRadius = '50%';
                                handle.style.display = 'flex';
                                handle.style.alignItems = 'center';
                                handle.style.justifyContent = 'center';
                                handle.style.cursor = 'ew-resize';
                                handle.style.zIndex = '1001';
                                handle.style.fontWeight = 'bold';
                                handle.style.pointerEvents = 'auto'; 
                                handle.innerText = '↔';
                                mapContainer.appendChild(handle);

                                let labelLeft = document.createElement('div');
                                labelLeft.className = 'smart15-swipe-label';
                                labelLeft.innerHTML = '← Antes (Congelado)';
                                labelLeft.style.cssText = 'position:absolute; top:30px; left:30px; background:rgba(0,0,0,0.7); color:#fff; padding:8px 16px; border-radius:6px; font-weight:bold; z-index:1002; transition:opacity 1s ease-in-out; font-size:13px; pointer-events:none; box-shadow:0 4px 6px rgba(0,0,0,0.3); border:1px solid #4a5568;';
                                mapContainer.appendChild(labelLeft);
                                
                                let labelRight = document.createElement('div');
                                labelRight.className = 'smart15-swipe-label';
                                labelRight.innerHTML = 'Depois (Atual) →';
                                labelRight.style.cssText = 'position:absolute; top:30px; right:30px; background:rgba(0,0,0,0.7); color:#fff; padding:8px 16px; border-radius:6px; font-weight:bold; z-index:1002; transition:opacity 1s ease-in-out; font-size:13px; pointer-events:none; box-shadow:0 4px 6px rgba(0,0,0,0.3); border:1px solid #4a5568;';
                                mapContainer.appendChild(labelRight);
                                
                                setTimeout(() => {
                                    if(labelLeft) labelLeft.style.opacity = '0';
                                    if(labelRight) labelRight.style.opacity = '0';
                                    setTimeout(() => { if(labelLeft) labelLeft.remove(); if(labelRight) labelRight.remove(); }, 1000);
                                }, 4000);

                                const MapConstructor = mapObj.constructor;
                                secondMapInstance = new (MapConstructor as any)({
                                    container: 'smart15-swipe-inner',
                                    style: mapObj.getStyle(),
                                    center: mapObj.getCenter(),
                                    zoom: mapObj.getZoom(),
                                    bearing: mapObj.getBearing(),
                                    pitch: mapObj.getPitch(),
                                    interactive: false
                                });

                                let isDragging = false;

                                const startDrag = (ev: any) => {
                                    isDragging = true;
                                    ev.stopPropagation(); 
                                    ev.preventDefault();
                                    if (mapObj.dragPan) mapObj.dragPan.disable();
                                };

                                onMouseMoveSwipe = (ev: any) => {
                                    if (!isDragging) return;
                                    ev.stopPropagation();
                                    const rect = mapContainer.getBoundingClientRect();
                                    let clientX = ev.clientX ?? (ev.touches && ev.touches.length > 0 ? ev.touches[0].clientX : 0);
                                    if (!clientX) return;

                                    let x = clientX - rect.left;
                                    if (x < 0) x = 0;
                                    if (x > rect.width) x = rect.width;
                                    
                                    const pct = (x / rect.width) * 100;
                                    swipeDiv!.style.width = pct + '%';
                                    handle.style.left = pct + '%';
                                };

                                onMouseUpSwipe = () => {
                                    if (isDragging) {
                                        isDragging = false;
                                        if (mapObj.dragPan) mapObj.dragPan.enable(); 
                                    }
                                };

                                handle.addEventListener('mousedown', startDrag);
                                handle.addEventListener('touchstart', startDrag, { passive: false });
                                window.addEventListener('mousemove', onMouseMoveSwipe);
                                window.addEventListener('touchmove', onMouseMoveSwipe, { passive: false });
                                window.addEventListener('mouseup', onMouseUpSwipe);
                                window.addEventListener('touchend', onMouseUpSwipe);

                                moveSyncHandler = () => {
                                    if (secondMapInstance) {
                                        (secondMapInstance as any).jumpTo({
                                            center: mapObj.getCenter(),
                                            zoom: mapObj.getZoom(),
                                            bearing: mapObj.getBearing(),
                                            pitch: mapObj.getPitch()
                                        });
                                    }
                                };
                                mapObj.on('move', moveSyncHandler);

                                layersAtivos.forEach(id => {
                                    if (id.includes('raster') && mapObj.getLayer(id)) {
                                        mapObj.setLayoutProperty(id, 'visibility', 'none');
                                    }
                                });
                            }
                        } else {
                            const sDiv = document.getElementById('smart15-swipe-div'); if (sDiv) sDiv.remove();
                            const hDiv = document.getElementById('smart15-swipe-handle'); if (hDiv) hDiv.remove();
                            mapContainer.querySelectorAll('.smart15-swipe-label').forEach(el => el.remove());
                            if (secondMapInstance) { (secondMapInstance as any).remove(); secondMapInstance = null; }
                            
                            if (moveSyncHandler) { mapObj.off('move', moveSyncHandler); moveSyncHandler = null; }
                            
                            if (onMouseMoveSwipe) {
                                window.removeEventListener('mousemove', onMouseMoveSwipe);
                                window.removeEventListener('touchmove', onMouseMoveSwipe);
                                onMouseMoveSwipe = null;
                            }
                            if (onMouseUpSwipe) {
                                window.removeEventListener('mouseup', onMouseUpSwipe);
                                window.removeEventListener('touchend', onMouseUpSwipe);
                                onMouseUpSwipe = null;
                            }
                            
                            layersAtivos.forEach(id => {
                                if (id.includes('raster') && mapObj.getLayer(id)) {
                                    mapObj.setLayoutProperty(id, 'visibility', 'visible');
                                }
                            });
                        }
                    });

                    (wrap.querySelector("#toggleMascara") as HTMLInputElement).addEventListener("change", (e: any) => {
                        if (!mapObj || !maskDataGeoJSON) return;
                        if (e.target.checked) {
                            if (!mapObj.getSource('smart15-mask-src')) {
                                mapObj.addSource('smart15-mask-src', { type: 'geojson', data: JSON.parse(maskDataGeoJSON) });
                                mapObj.addLayer({ id: 'smart15-mask-layer', type: 'fill', source: 'smart15-mask-src', paint: { 'fill-color': '#f7fafc', 'fill-opacity': 0.85 } });
                            }
                        } else {
                            if (mapObj.getLayer('smart15-mask-layer')) mapObj.removeLayer('smart15-mask-layer');
                            if (mapObj.getSource('smart15-mask-src')) mapObj.removeSource('smart15-mask-src');
                        }
                    });

                    const btnToggleTheme = wrap.querySelector("#btnToggleTheme") as HTMLButtonElement;
                    const mainWrapper = wrap.querySelector("#smart15-main-wrapper") as HTMLDivElement;
                    let isDark = false;
                    btnToggleTheme.addEventListener("click", () => {
                        isDark = !isDark;
                        if(isDark) { mainWrapper.classList.add("s15-dark"); btnToggleTheme.innerHTML = '<svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-sun"/></svg> Modo Claro'; } 
                        else { mainWrapper.classList.remove("s15-dark"); btnToggleTheme.innerHTML = '<svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-moon"/></svg> Modo Escuro'; }
                    });

                    const btnOpenHelp = wrap.querySelector("#btnOpenHelp") as HTMLButtonElement;
                    const btnCloseHelp = wrap.querySelector("#btnCloseHelp") as HTMLButtonElement;
                    const modal = wrap.querySelector("#smart15HelpModal") as HTMLDivElement;
                    const backdrop = wrap.querySelector("#smart15HelpBackdrop") as HTMLDivElement;

                    const btnOpenInstrucoes = wrap.querySelector("#btnOpenInstrucoes") as HTMLButtonElement;
                    const btnCloseInstrucoes = wrap.querySelector("#btnCloseInstrucoes") as HTMLButtonElement;
                    const modalInstrucoes = wrap.querySelector("#smart15InstrucoesModal") as HTMLDivElement;

                    btnOpenHelp.addEventListener("click", () => { modal.style.display = "block"; backdrop.style.display = "block"; });
                    btnOpenInstrucoes.addEventListener("click", () => { modalInstrucoes.style.display = "block"; backdrop.style.display = "block"; });
                    const closeModal = () => { modal.style.display = "none"; modalInstrucoes.style.display = "none"; backdrop.style.display = "none"; };
                    btnCloseHelp.addEventListener("click", closeModal); btnCloseInstrucoes.addEventListener("click", closeModal); backdrop.addEventListener("click", closeModal);
					
                    const btnUpload = wrap.querySelector("#btnUploadArea") as HTMLButtonElement; 
                    const hiddenInput = wrap.querySelector("#hiddenFileInput") as HTMLInputElement;
                    const areaStatus = wrap.querySelector("#areaStatus") as HTMLDivElement; 
                    const btnReset = wrap.querySelector("#btnReset") as HTMLButtonElement;
                    const areaCoords = wrap.querySelector("#areaCoords") as HTMLDivElement;
                    
                    const sampleFileInput = wrap.querySelector("#sampleFileInput") as HTMLInputElement; 
                    const sampleStatus = wrap.querySelector("#sampleStatus") as HTMLDivElement; 
                    const sampleCoords = wrap.querySelector("#sampleCoords") as HTMLDivElement;

                    const painelPosProcessamento = wrap.querySelector("#painelPosProcessamento") as HTMLDivElement;
                    const listaCamadasInput = wrap.querySelector("#listaCamadasInput") as HTMLDivElement;
                    const listaCamadas = wrap.querySelector("#listaCamadas") as HTMLDivElement;
                    const listaCamadasRasters = wrap.querySelector("#listaCamadasRasters") as HTMLDivElement;

                    const corArea = wrap.querySelector("#corArea") as HTMLInputElement; 
                    const opacArea = wrap.querySelector("#opacArea") as HTMLInputElement; 
                    const contornoArea = wrap.querySelector("#contornoArea") as HTMLInputElement;
                    
                    const corOsm = wrap.querySelector("#corOsm") as HTMLInputElement; 
                    const opacOsm = wrap.querySelector("#opacOsm") as HTMLInputElement; 
                    const contornoOsm = wrap.querySelector("#contornoOsm") as HTMLInputElement;
                    
                    const opacIso = wrap.querySelector("#opacIso") as HTMLInputElement; 
                    const contornoIso = wrap.querySelector("#contornoIso") as HTMLInputElement;
                    const opacHex = wrap.querySelector("#opacHex") as HTMLInputElement; 
                    const contornoHex = wrap.querySelector("#contornoHex") as HTMLInputElement;

                    (wrap.querySelector("#btnScreenshot") as HTMLButtonElement).addEventListener("click", () => {
                        const mapObj = getMapInstance(app);
                        if (!mapObj) { alert("Mapa não encontrado!"); return; }
                        
                        let info = document.createElement("div");
                        info.innerText = "A capturar mapa...";
                        info.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#2b6cb0; color:white; padding:15px; border-radius:8px; z-index:999999; font-weight:bold;";
                        document.body.appendChild(info);

                        mapObj.once('render', () => {
                            try {
                                const canvas = mapObj.getCanvas();
                                const dataURL = canvas.toDataURL("image/png");
                                
                                document.body.removeChild(info);
                                
                                const modalCapture = document.createElement('div');
                                modalCapture.style.cssText = 'position:fixed; top:5%; left:5%; width:90%; height:90%; background-color:#ffffff; z-index:100000; box-shadow:0 10px 25px rgba(0,0,0,0.5); border-radius:10px; display:flex; flex-direction:column; padding:20px; box-sizing:border-box;';
                                
                                const header = document.createElement('div');
                                header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;';
                                
                                const title = document.createElement('h3');
                                title.innerText = '📸 Captura de Ecrã Finalizada';
                                title.style.cssText = 'margin:0; color:#2d3748;';
                                
                                const btnCloseTop = document.createElement('button');
                                btnCloseTop.innerHTML = '&times;';
                                btnCloseTop.style.cssText = 'background:transparent; border:none; font-size:24px; cursor:pointer; color:#a0aec0;';
                                btnCloseTop.onclick = () => document.body.removeChild(modalCapture);
                                
                                header.appendChild(title);
                                header.appendChild(btnCloseTop);
                                modalCapture.appendChild(header);
                                
                                const imgContainer = document.createElement('div');
                                imgContainer.style.cssText = 'flex:1; overflow:auto; background:#edf2f7; border:1px solid #cbd5e0; border-radius:6px; display:flex; justify-content:center; align-items:center; margin-bottom:15px;';
                                
                                const img = document.createElement('img');
                                img.src = dataURL;
                                img.style.cssText = 'max-width:100%; box-shadow:0 4px 6px rgba(0,0,0,0.1);';
                                imgContainer.appendChild(img);
                                modalCapture.appendChild(imgContainer);
                                
                                const btnSave = document.createElement('button');
                                btnSave.innerHTML = '<strong style="display:flex; align-items:center; justify-content:center; gap:8px;">💾 GUARDAR IMAGEM NO PC</strong>';
                                btnSave.style.cssText = 'padding:15px; background:#38a169; color:white; border:none; border-radius:6px; cursor:pointer; font-size:16px; transition:background 0.2s;';
                                btnSave.onmouseover = () => btnSave.style.background = '#2f855a';
                                btnSave.onmouseout = () => btnSave.style.background = '#38a169';
                                
                                btnSave.onclick = () => {
                                    const link = document.createElement("a");
                                    link.download = "Smart15_Mapa_" + Date.now() + ".png";
                                    link.href = dataURL;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    document.body.removeChild(modalCapture);
                                };
                                
                                modalCapture.appendChild(btnSave);
                                document.body.appendChild(modalCapture);
                                
                            } catch (err) {
                                if(document.body.contains(info)) document.body.removeChild(info);
                                alert("O navegador bloqueou a captura (Segurança CORS). O mapa base não permite cópias diretas.");
                            }
                        });
                        mapObj.triggerRepaint();
                    });

                    const setupFileInput = (modoId: string, btnId: string, fileId: string, statusId: string) => {
                        const modo = wrap.querySelector(modoId) as HTMLSelectElement; 
                        const btn = wrap.querySelector(btnId) as HTMLButtonElement;
                        const file = wrap.querySelector(fileId) as HTMLInputElement; 
                        const status = wrap.querySelector(statusId) as HTMLDivElement;
                        modo.addEventListener('change', (e: any) => {
                            if(e.target.value === 'manual') { btn.style.display = 'block'; status.innerHTML = "Nenhum ficheiro (.tif)"; }
                            else { btn.style.display = 'none'; status.innerHTML = ""; }
                        });
                        btn.addEventListener('click', () => file.click());
                        file.addEventListener('change', (e: any) => {
                            if(e.target.files.length > 0) { status.innerHTML = SVG_ICONS.SUCCESS + e.target.files[0].name; status.style.color = "#2f855a"; }
                        });
                    };
                    setupFileInput('#modoVeg', '#btnFileVeg', '#fileVeg', '#statusVeg'); setupFileInput('#modoTemp', '#btnFileTemp', '#fileTemp', '#statusTemp'); setupFileInput('#modoDem', '#btnFileDem', '#fileDem', '#statusDem');

                    const updateLayerStyle = () => {
                        const mapObj = getMapInstance(app); if (!mapObj) return;
                        
                        layersAtivos.forEach(id => {
                            if (!mapObj.getLayer(id)) return;
                            
                            if (id.includes('smart15-input-area') || id.includes('smart15-area')) {
                                if (id.includes('-line')) { 
                                    mapObj.setPaintProperty(id, 'line-color', corArea.value); 
                                    mapObj.setPaintProperty(id, 'line-opacity', contornoArea.checked ? 1 : 0); 
                                } 
                                else if (id.includes('-fill')) { 
                                    mapObj.setPaintProperty(id, 'fill-color', corArea.value); 
                                    mapObj.setPaintProperty(id, 'fill-opacity', contornoArea.checked ? 0 : (parseInt(opacArea.value)/100)); 
                                }
                            }
                            else if (id.includes('smart15-input-samples')) {
                                if (id.includes('-circle')) { 
                                    mapObj.setPaintProperty(id, 'circle-color', corOsm.value); 
                                    mapObj.setPaintProperty(id, 'circle-opacity', contornoOsm.checked ? 0 : (parseInt(opacOsm.value)/100)); 
                                    mapObj.setPaintProperty(id, 'circle-stroke-width', contornoOsm.checked ? 2 : 0); 
                                    mapObj.setPaintProperty(id, 'circle-stroke-color', corOsm.value); 
                                } else if (id.includes('-fill')) {
                                    mapObj.setPaintProperty(id, 'fill-color', corOsm.value); 
                                    mapObj.setPaintProperty(id, 'fill-opacity', contornoOsm.checked ? 0 : (parseInt(opacOsm.value)/100)); 
                                } else if (id.includes('-line')) {
                                    mapObj.setPaintProperty(id, 'line-color', corOsm.value); 
                                    mapObj.setPaintProperty(id, 'line-width', contornoOsm.checked ? 2 : 0); 
                                }
                            }
                            else if (id.includes('smart15-sim-ok') && !id.endsWith('-stroke')) {
                                const isHex = id.includes('-hex-');
                                const targetOpac = isHex ? (parseInt(opacHex.value)/100) : (parseInt(opacIso.value)/100);
                                const targetContorno = isHex ? contornoHex.checked : contornoIso.checked;

                                if (mapObj.getLayer(id).type === 'fill-extrusion') {
                                    mapObj.setPaintProperty(id, 'fill-extrusion-opacity', targetContorno ? 0 : targetOpac);
                                } else if (mapObj.getLayer(id).type === 'fill') {
                                    mapObj.setPaintProperty(id, 'fill-opacity', targetContorno ? 0 : targetOpac);
                                }
                                if(mapObj.getLayer(id+'-stroke')) { 
                                    mapObj.setPaintProperty(id+'-stroke', 'line-opacity', targetContorno ? 1 : 0); 
                                }
                            }
                        });
                    };

                    const updateHandler = () => updateLayerStyle();
                    [corArea, opacArea, contornoArea, corOsm, opacOsm, contornoOsm, opacIso, contornoIso, opacHex, contornoHex].forEach(el => el.addEventListener('input', updateHandler));

                    const moveLayerCustom = (layerId: string, direction: string) => {
                        const mapObj = getMapInstance(app); if(!mapObj) return;
                        
                        const listItems = Array.from(document.querySelectorAll('#listaCamadas .layer-row, #listaCamadasInput .layer-row'));
                        const currentIndex = listItems.findIndex(el => el.id === 'toggle-' + layerId);
                        
                        const allMapLayers = mapObj.getStyle().layers;
                        const baseId = layerId.replace('-layer', '').replace('-fill', '').replace('-circle', '');
                        const relatedIds = allMapLayers.filter((l: any) => l.id.startsWith(baseId)).map((l: any) => l.id);

                        if (direction === 'up' && currentIndex > 0) {
                            const previousRowId = listItems[currentIndex - 1].id.replace('toggle-', '');
                            const previousBase = previousRowId.replace('-layer', '').replace('-fill', '').replace('-circle', '');
                            const previousLayerInMap = allMapLayers.find((l: any) => l.id.startsWith(previousBase));
                            
                            if(previousLayerInMap) {
                                relatedIds.forEach((rId: string) => { if(mapObj.getLayer(rId)) mapObj.moveLayer(rId, previousLayerInMap.id); });
                            }
                            listItems[currentIndex].parentNode!.insertBefore(listItems[currentIndex], listItems[currentIndex - 1]);
                            
                        } else if (direction === 'down' && currentIndex < listItems.length - 1) {
                            const nextRowId = listItems[currentIndex + 1].id.replace('toggle-', '');
                            const nextBase = nextRowId.replace('-layer', '').replace('-fill', '').replace('-circle', '');
                            const nextLayersInMap = allMapLayers.filter((l: any) => l.id.startsWith(nextBase));
                            
                            if(nextLayersInMap.length > 0) {
                                const insertBeforeId = allMapLayers[allMapLayers.findIndex((l: any) => l.id === nextLayersInMap[nextLayersInMap.length-1].id) + 1]?.id;
                                relatedIds.forEach((rId: string) => { if(mapObj.getLayer(rId) && insertBeforeId) mapObj.moveLayer(rId, insertBeforeId); });
                            }
                            listItems[currentIndex].parentNode!.insertBefore(listItems[currentIndex + 1], listItems[currentIndex]);
                        }
                    };

                    const appendLayerToggle = (layerId: string, layerName: string, container: HTMLElement) => {
                        const mapObj = getMapInstance(app); if (!mapObj || document.getElementById('toggle-' + layerId)) return;
                        const row = document.createElement("div"); row.className = "layer-row"; row.id = 'toggle-' + layerId;
                        const span = document.createElement("span"); span.innerText = layerName; span.title = layerName;
                        const tools = document.createElement("div"); tools.className = "tools";
                        
                        const btnUp = document.createElement("button"); btnUp.innerHTML = SVG_ICONS.UP; btnUp.title = "Subir camada no Mapa";
                        const btnDown = document.createElement("button"); btnDown.innerHTML = SVG_ICONS.DOWN; btnDown.title = "Descer camada no Mapa";
                        const btnVis = document.createElement("button"); btnVis.innerHTML = SVG_ICONS.EYE; btnVis.title = "Ativar/Desativar";
                        
                        btnUp.addEventListener("click", () => moveLayerCustom(layerId, 'up')); btnDown.addEventListener("click", () => moveLayerCustom(layerId, 'down'));
                        btnVis.addEventListener("click", () => {
                            const vis = mapObj.getLayoutProperty(layerId, 'visibility'); 
                            const targetVis = (!vis || vis === 'visible') ? 'none' : 'visible';
                            
                            const baseId = layerId.replace('-layer', '').replace('-fill', '').replace('-circle', '');
                            layersAtivos.forEach(activeId => {
                                if (activeId.startsWith(baseId)) {
                                    if (mapObj.getLayer(activeId)) mapObj.setLayoutProperty(activeId, 'visibility', targetVis);
                                }
                            });
                            
                            btnVis.innerHTML = targetVis === 'visible' ? SVG_ICONS.EYE : SVG_ICONS.EYE_OFF; 
                            span.style.textDecoration = targetVis === 'visible' ? "none" : "line-through";
                        });
                        tools.appendChild(btnUp); tools.appendChild(btnDown); tools.appendChild(btnVis); row.appendChild(span); row.appendChild(tools); container.appendChild(row);
                    };

                    const startDrawing = (mode: string) => {
                        if (isDrawingMode) return; isDrawingMode = true;
                        const mapCanvas = document.querySelector(".maplibregl-canvas"); const mapContainer = mapCanvas ? mapCanvas.parentElement : null;
                        const mapObj = getMapInstance(app);
                        if (!mapContainer || !mapObj) { areaStatus.innerHTML = SVG_ICONS.WARN + " Erro na tela."; isDrawingMode = false; return; }
                        if (mapObj.dragPan) mapObj.dragPan.disable();

                        mapContainer.querySelectorAll(".smart15-draw-overlay").forEach(o => o.remove());
                        const overlay = document.createElement("div"); overlay.className = "smart15-draw-overlay"; overlay.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; z-index:9999; cursor:crosshair; background:rgba(255,255,255,0.001);"; mapContainer.appendChild(overlay);
                        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.style.cssText = "width:100%; height:100%; pointer-events:none;"; overlay.appendChild(svg);
                        const getPos = (e: any) => { const r = overlay.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

                        const finishDrawing = () => {
                            overlay.remove(); if (mapObj && mapObj.dragPan) mapObj.dragPan.enable(); isDrawingMode = false;
                            if (geometriaGeoJSON && bboxCapturada) {
                                areaStatus.innerHTML = SVG_ICONS.SUCCESS + " Capturado!"; areaStatus.style.color = "#2f855a";
                                areaCoords.innerText = "BBox: [" + bboxCapturada[0].toFixed(4) + ", " + bboxCapturada[1].toFixed(4) + ", " + bboxCapturada[2].toFixed(4) + ", " + bboxCapturada[3].toFixed(4) + "]";
                                const sourceId = 'smart15-input-area';
                                if (!mapObj.getSource(sourceId)) { mapObj.addSource(sourceId, { type: 'geojson', data: geometriaGeoJSON }); } else { mapObj.getSource(sourceId).setData(geometriaGeoJSON); }
                                if (!mapObj.getLayer(sourceId+'-fill')) { mapObj.addLayer({ id: sourceId+'-fill', type: 'fill', source: sourceId, paint: { 'fill-color': corArea.value, 'fill-opacity': 0.1 } }); layersAtivos.push(sourceId+'-fill'); }
                                if (!mapObj.getLayer(sourceId+'-line')) { mapObj.addLayer({ id: sourceId+'-line', type: 'line', source: sourceId, paint: { 'line-color': corArea.value, 'line-width': 2, 'line-opacity': 0 } }); layersAtivos.push(sourceId+'-line'); }
                                painelPosProcessamento.style.display = "block"; appendLayerToggle(sourceId+'-fill', "Área Geográfica (Base)", listaCamadasInput); updateLayerStyle();
                            }
                        };

                        if (mode === "rect") {
                            areaStatus.innerText = "Arraste o rato."; areaCoords.innerText = "";
                            let rectEl: any = null, start: any = null, isDrawing = false;
                            const onMove = (ev: any) => { ev.preventDefault(); if (!isDrawing || !start || !rectEl) return; const cur = getPos(ev); rectEl.setAttribute("x", String(Math.min(start.x, cur.x))); rectEl.setAttribute("y", String(Math.min(start.y, cur.y))); rectEl.setAttribute("width", String(Math.abs(cur.x - start.x))); rectEl.setAttribute("height", String(Math.abs(cur.y - start.y))); };
                            const onUp = (ev: any) => { ev.preventDefault(); if (!isDrawing) return; isDrawing = false; window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); const end = getPos(ev); if (Math.abs(end.x - start.x) > 10) { const nw = mapObj.unproject([Math.min(start.x, end.x), Math.min(start.y, end.y)]); const se = mapObj.unproject([Math.max(start.x, end.x), Math.max(start.y, end.y)]); bboxCapturada = [Math.min(nw.lng, se.lng), Math.min(nw.lat, se.lat), Math.max(nw.lng, se.lng), Math.max(nw.lat, se.lat)]; geometriaGeoJSON = { type: "Feature", geometry: { type: "Polygon", coordinates: [[[nw.lng, nw.lat], [se.lng, nw.lat], [se.lng, se.lat], [nw.lng, se.lat], [nw.lng, nw.lat]]] } }; } finishDrawing(); };
                            overlay.addEventListener("pointerdown", (e: any) => { e.preventDefault(); isDrawing = true; start = getPos(e); rectEl = document.createElementNS("http://www.w3.org/2000/svg", "rect"); rectEl.setAttribute("fill", "rgba(49, 130, 206, 0.2)"); rectEl.setAttribute("stroke", "#3182ce"); rectEl.setAttribute("stroke-width", "2"); svg.appendChild(rectEl); window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp); });
                        } else if (mode === "poly") {
                            areaStatus.innerText = "Clique no mapa. DIREITO para fechar."; areaCoords.innerText = "";
                            let polyEl = document.createElementNS('http://www.w3.org/2000/svg', 'polygon'); polyEl.setAttribute('fill', 'rgba(49, 130, 206, 0.15)'); polyEl.setAttribute('stroke', '#2b6cb0'); polyEl.setAttribute('stroke-width', '2'); svg.appendChild(polyEl);
                            let guideLineEl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); guideLineEl.setAttribute('fill', 'none'); guideLineEl.setAttribute('stroke', '#2b6cb0'); guideLineEl.setAttribute('stroke-width', '1'); guideLineEl.setAttribute('stroke-dasharray', '4,4'); svg.appendChild(guideLineEl);
                            let ptsTela: any[] = []; let coordsGeo: any[] = [];
                            const onMove = (e: any) => { e.preventDefault(); if (ptsTela.length > 0) { const cur = getPos(e); guideLineEl.setAttribute('points', [...ptsTela, cur].map(p => p.x + "," + p.y).join(' ')); } };
                            overlay.addEventListener("pointerdown", (e: any) => {
                                e.preventDefault(); const pos = getPos(e);
                                if (e.button === 2) {
                                    if (coordsGeo.length >= 3) { coordsGeo.push([coordsGeo[0][0], coordsGeo[0][1]]); geometriaGeoJSON = { type: "Feature", geometry: { type: "Polygon", coordinates: [coordsGeo] } }; const lons = coordsGeo.map(c => c[0]), lats = coordsGeo.map(c => c[1]); bboxCapturada = [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)]; }
                                    window.removeEventListener("pointermove", onMove); finishDrawing(); return;
                                }
                                if (e.button === 0) { const lngLat = mapObj.unproject([pos.x, pos.y]); ptsTela.push(pos); coordsGeo.push([lngLat.lng, lngLat.lat]); polyEl.setAttribute('points', ptsTela.map(p => p.x + "," + p.y).join(' ')); }
                            });
                            window.addEventListener("pointermove", onMove);
                        } else if (mode === "circle") {
                            areaStatus.innerText = "Arraste o rato."; areaCoords.innerText = "";
                            let circleEl: any = null, start: any = null, isDrawing = false;
                            const onMove = (ev: any) => { ev.preventDefault(); if (!isDrawing || !start || !circleEl) return; const cur = getPos(ev); const r = Math.sqrt(Math.pow(cur.x - start.x, 2) + Math.pow(cur.y - start.y, 2)); circleEl.setAttribute("r", String(r)); };
                            const onUp = (ev: any) => {
                                ev.preventDefault(); if (!isDrawing) return; isDrawing = false; window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); const end = getPos(ev);
                                if (Math.abs(end.x - start.x) > 10) {
                                    const centroGeo = mapObj.unproject([start.x, start.y]); const rPixels = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)); const bordaGeo = mapObj.unproject([start.x + rPixels, start.y]); const deltaLng = Math.abs(bordaGeo.lng - centroGeo.lng);
                                    const circleCoords: any[] = []; for(let i=0; i<=32; i++){ const a = i * (Math.PI * 2) / 32; circleCoords.push([centroGeo.lng + deltaLng * Math.cos(a), centroGeo.lat + deltaLng * Math.sin(a)]); }
                                    bboxCapturada = [centroGeo.lng - deltaLng, centroGeo.lat - deltaLng, centroGeo.lng + deltaLng, centroGeo.lat + deltaLng];
                                    geometriaGeoJSON = { type: "Feature", geometry: { type: "Polygon", coordinates: [circleCoords] } };
                                }
                                finishDrawing();
                            };
                            overlay.addEventListener("pointerdown", (e: any) => { e.preventDefault(); isDrawing = true; start = getPos(e); circleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle"); circleEl.setAttribute("fill", "rgba(229, 62, 62, 0.15)"); circleEl.setAttribute("stroke", "#e53e3e"); circleEl.setAttribute("stroke-width", "2"); circleEl.setAttribute("cx", String(start.x)); circleEl.setAttribute("cy", String(start.y)); svg.appendChild(circleEl); window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp); });
                        }
                    };

                    (wrap.querySelector("#btnDrawRect") as HTMLButtonElement).addEventListener("click", () => startDrawing("rect"));
                    (wrap.querySelector("#btnDrawPoly") as HTMLButtonElement).addEventListener("click", () => startDrawing("poly"));
                    (wrap.querySelector("#btnDrawCircle") as HTMLButtonElement).addEventListener("click", () => startDrawing("circle"));

                    btnReset.addEventListener("click", () => {
                        const mapObj = getMapInstance(app);
                        if (mapObj) { 
                            if (mapObj.getLayer('smart15-mask-layer')) mapObj.removeLayer('smart15-mask-layer');
                            if (mapObj.getSource('smart15-mask-src')) mapObj.removeSource('smart15-mask-src');
                            (wrap.querySelector("#toggleMascara") as HTMLInputElement).checked = false;
                            layersAtivos.forEach(id => { try { if (mapObj.getLayer(id)) mapObj.removeLayer(id); } catch(e){} }); layersAtivos.forEach(id => { const sId = id.replace('-line', '').replace('-fill', '').replace('-circle', '').replace('-layer', '').replace('-stroke', '').replace('-grid', ''); try { if (mapObj.getSource(sId)) mapObj.removeSource(sId); } catch(e){} }); 
                        }
                        
                        layersAtivos = []; geometriaGeoJSON = null; amostrasGeoJSON = null; maskDataGeoJSON = null; bboxCapturada = null; downloadUrlZip = null; isDrawingMode = false; 
                        painelPosProcessamento.style.display = "none"; listaCamadasInput.innerHTML = ""; listaCamadas.innerHTML = ""; listaCamadasRasters.innerHTML = ""; 
                        
                        areaStatus.innerText = "Nenhum limite definido."; areaCoords.innerText = ""; 
                        sampleStatus.innerHTML = "Nenhuma amostra carregada"; sampleStatus.style.color = "#4a5568"; sampleCoords.innerText = "";
                        (wrap.querySelector("#rasterLegendsContainer") as HTMLDivElement).style.display = "none";
                        
                        clearInterval((window as any).simProgressInterval); (wrap.querySelector("#progressContainer") as HTMLDivElement).style.display = "none";
                        if(tooltip) tooltip.style.display = 'none';
                    });

                    btnUpload.addEventListener("click", () => hiddenInput.click());
                    hiddenInput.addEventListener("change", (e: any) => {
                        const file = e.target.files[0]; if (file) {
                            areaStatus.innerHTML = SVG_ICONS.LOAD + " Lendo...";
                            const reader = new FileReader();
                            reader.onload = (ev: any) => {
                                try {
                                    geometriaGeoJSON = JSON.parse(ev.target.result);
                                    const b = calculateBBox(geometriaGeoJSON);
                                    if(b) {
                                        bboxCapturada = [b[0][0], b[0][1], b[1][0], b[1][1]]; areaStatus.innerHTML = SVG_ICONS.SUCCESS + " Capturado!";
                                        areaCoords.innerText = "BBox: [" + bboxCapturada[0].toFixed(4) + ", " + bboxCapturada[1].toFixed(4) + ", " + bboxCapturada[2].toFixed(4) + ", " + bboxCapturada[3].toFixed(4) + "]";
                                        const sourceId = 'smart15-input-area';
                                        const mapObj = getMapInstance(app);
                                        if(mapObj) {
                                            if (!mapObj.getSource(sourceId)) { mapObj.addSource(sourceId, { type: 'geojson', data: geometriaGeoJSON }); } else { mapObj.getSource(sourceId).setData(geometriaGeoJSON); }
                                            if (!mapObj.getLayer(sourceId+'-fill')) { mapObj.addLayer({ id: sourceId+'-fill', type: 'fill', source: sourceId, paint: { 'fill-color': corArea.value, 'fill-opacity': 0.1 } }); layersAtivos.push(sourceId+'-fill'); }
                                            if (!mapObj.getLayer(sourceId+'-line')) { mapObj.addLayer({ id: sourceId+'-line', type: 'line', source: sourceId, paint: { 'line-color': corArea.value, 'line-width': 2, 'line-opacity': 0 } }); layersAtivos.push(sourceId+'-line'); }
                                            mapObj.fitBounds(b, { padding: 40 }); painelPosProcessamento.style.display = "block"; appendLayerToggle(sourceId+'-fill', "Área Geográfica (Base)", listaCamadasInput); updateLayerStyle();
                                        }
                                    } else { areaStatus.innerHTML = SVG_ICONS.WARN + " Falha BBox."; }
                                } catch(err) { areaStatus.innerHTML = SVG_ICONS.WARN + " Erro GeoJSON"; }
                            }; reader.readAsText(file);
                        }
                    });

                    (wrap.querySelector("#btnUploadSamples") as HTMLButtonElement).addEventListener("click", (e: any) => { e.preventDefault(); sampleFileInput.click(); });
                    sampleFileInput.addEventListener("change", (e: any) => {
                        const file = e.target.files[0]; if (file) {
                            
                            sampleStatus.innerHTML = SVG_ICONS.LOAD + " Lendo amostras...";
                            sampleStatus.style.color = "#d69e2e";
                            
                            const reader = new FileReader(); reader.onload = (ev: any) => { try {
                                amostrasGeoJSON = JSON.parse(ev.target.result);
                                const b = calculateBBox(amostrasGeoJSON);
                                if(b) sampleCoords.innerText = "BBox: [" + b[0][0].toFixed(4) + ", " + b[0][1].toFixed(4) + ", " + b[1][0].toFixed(4) + ", " + b[1][1].toFixed(4) + "]";
                                
                                const mapObj = getMapInstance(app); 
                                if(mapObj) {
                                    const sId = 'smart15-input-samples'; 
                                    if(!mapObj.getSource(sId)) mapObj.addSource(sId, {type:'geojson', data:amostrasGeoJSON}); 
                                    else mapObj.getSource(sId).setData(amostrasGeoJSON);
                                    
                                    const isPolygon = amostrasGeoJSON.features && amostrasGeoJSON.features[0] && (amostrasGeoJSON.features[0].geometry.type.includes('Polygon'));
                                    
                                    if(isPolygon) {
                                        if(!mapObj.getLayer(sId+'-fill')) { mapObj.addLayer({id:sId+'-fill', type:'fill', source:sId, paint:{'fill-color':corOsm.value, 'fill-opacity':contornoOsm.checked ? 0 : (parseInt(opacOsm.value)/100)}}); layersAtivos.push(sId+'-fill'); }
                                        if(!mapObj.getLayer(sId+'-line')) { mapObj.addLayer({id:sId+'-line', type:'line', source:sId, paint:{'line-color':corOsm.value, 'line-width':contornoOsm.checked ? 2 : 0}}); layersAtivos.push(sId+'-line'); }
                                        appendLayerToggle(sId+'-fill', "Amostras", listaCamadasInput);
                                    } else {
                                        if(!mapObj.getLayer(sId+'-circle')) { mapObj.addLayer({id:sId+'-circle', type:'circle', source:sId, paint:{'circle-radius':5, 'circle-color':corOsm.value, 'circle-opacity':contornoOsm.checked ? 0 : (parseInt(opacOsm.value)/100), 'circle-stroke-width': contornoOsm.checked ? 2 : 0, 'circle-stroke-color': corOsm.value}}); layersAtivos.push(sId+'-circle'); }
                                        appendLayerToggle(sId+'-circle', "Amostras", listaCamadasInput);
                                    }
                                    updateLayerStyle();
                                    
                                    sampleStatus.innerHTML = SVG_ICONS.SUCCESS + " " + file.name; 
                                    sampleStatus.style.color = "#2f855a";
                                }
                            } catch(e) {
                                sampleStatus.innerHTML = SVG_ICONS.WARN + " Erro ao ler GeoJSON";
                                sampleStatus.style.color = "#e53e3e";
                            } }; reader.readAsText(file);
                        }
                    });

                    (wrap.querySelector("#btnExportResult") as HTMLButtonElement).addEventListener("click", async () => {
                        if (downloadUrlZip) { 
                            try {
                                const btn = wrap.querySelector("#btnExportResult") as HTMLButtonElement;
                                const textOriginal = btn.innerHTML;
                                btn.innerHTML = '<strong style="color:inherit;"><svg viewBox="0 0 24 24" class="s15-icon s15-icon-btn"><use href="#icon-download"/></svg> A BAIXAR... AGUARDE</strong>';
                                
                                const response = await fetch(downloadUrlZip);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = "Resultados_Smart15_" + Date.now() + ".zip";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                                
                                btn.innerHTML = textOriginal;
                            } catch(e) {
                                alert("Erro ao transferir o arquivo ZIP.");
                            }
                        } else { 
                            alert("Simule antes de exportar."); 
                        }
                    });

                    (window as any).simProgressInterval = null;

                    (wrap.querySelector("#btnSimular") as HTMLButtonElement).addEventListener("click", async () => {
                        if (!geometriaGeoJSON) { alert("Defina a Área de Estudo primeiro."); return; }
                        const btnSimular = wrap.querySelector("#btnSimular") as HTMLButtonElement; btnSimular.innerText = "PROCESSANDO..."; btnSimular.disabled = true;

                        const progressContainer = wrap.querySelector("#progressContainer") as HTMLDivElement; 
                        const progressBar = wrap.querySelector("#progressBar") as HTMLDivElement; 
                        const progressText = wrap.querySelector("#progressText") as HTMLSpanElement; 
                        const progressLabel = wrap.querySelector("#progressLabel") as HTMLSpanElement;
                        
                        progressContainer.style.display = "block"; progressBar.style.width = "0%"; progressText.innerText = "0%"; progressLabel.innerHTML = SVG_ICONS.SERVER + " Iniciando Cálculo Métrico...";

                        let progressValue = 0; let pPhase = 1;
                        (window as any).simProgressInterval = setInterval(() => {
                            if (pPhase === 1) { progressValue += Math.floor(Math.random()*8)+2; if(progressValue>=20){progressValue=20; pPhase=2; progressLabel.innerHTML=SVG_ICONS.SERVER+' Calculando Rasters e Metros...';} }
                            else if (pPhase === 2) { progressValue += Math.floor(Math.random()*3)+1; if(progressValue>=85){progressValue=85; progressLabel.innerHTML=SVG_ICONS.SERVER+' Aguardando Servidor...';} else {progressLabel.innerHTML=SVG_ICONS.SERVER+' Roteando Metros ('+progressValue+'%)...';} }
                            progressBar.style.width = progressValue+"%"; progressText.innerText = progressValue+"%";
                        }, 600);

                        try {
                            const pData = {
                                perfis: Array.from(wrap.querySelectorAll(".perfil-target:checked")).map((cb:any)=>cb.value), alvos: Array.from(wrap.querySelectorAll(".osm-target:checked")).map((cb:any)=>cb.value),
                                formatos: Array.from(wrap.querySelectorAll(".formato-saida:checked")).map((cb:any)=>cb.value), bbox: bboxCapturada, geometria: geometriaGeoJSON,
                                formatos_export: Array.from(wrap.querySelectorAll(".formato-export:checked")).map((cb:any)=>cb.value),
                                visualizacao: { extrusao_3d: (wrap.querySelector("#extrusao3d") as HTMLInputElement).checked },
                                modo_temp: (wrap.querySelector("#modoTemp") as HTMLSelectElement).value,
                                modo_veg: (wrap.querySelector("#modoVeg") as HTMLSelectElement).value,
                                modo_dem: (wrap.querySelector("#modoDem") as HTMLSelectElement).value
                            };

                            const formData = new FormData(); formData.append("dados", JSON.stringify(pData));
                            const fileVegInput = wrap.querySelector("#fileVeg") as HTMLInputElement;
                            if(pData.modo_veg === 'manual' && fileVegInput.files && fileVegInput.files[0]) formData.append("file_veg", fileVegInput.files[0]);
                            const fileTempInput = wrap.querySelector("#fileTemp") as HTMLInputElement;
                            if(pData.modo_temp === 'manual' && fileTempInput.files && fileTempInput.files[0]) formData.append("file_temp", fileTempInput.files[0]);
                            const fileDemInput = wrap.querySelector("#fileDem") as HTMLInputElement;
                            if(pData.modo_dem === 'manual' && fileDemInput.files && fileDemInput.files[0]) formData.append("file_dem", fileDemInput.files[0]);
                            if(amostrasGeoJSON) formData.append("file_samples", new Blob([JSON.stringify(amostrasGeoJSON)], {type:'application/json'}));

                            const res = await fetch("/api/simular", { method: "POST", body: formData }).then(r=>r.json());
                            clearInterval((window as any).simProgressInterval); progressValue=90; progressBar.style.width="90%"; progressText.innerText="90%"; progressLabel.innerHTML = SVG_ICONS.SUCCESS + " Desenhando na Tela...";

                            if (res.data) {
                                downloadUrlZip = res.data.download_url; maskDataGeoJSON = res.data.mask_geojson;
                                const mapObj = getMapInstance(app); painelPosProcessamento.style.display = "block"; listaCamadas.innerHTML = ""; listaCamadasRasters.innerHTML = "";
                                const rasterLegends = wrap.querySelector("#rasterLegendsContainer") as HTMLDivElement;
                                rasterLegends.innerHTML = `<b style="display: block; margin-bottom: 6px;">Valores Exatos dos Rasters (Mín / Máx):</b>`;

                                if(res.data.rasters_vis) {
                                    Object.keys(res.data.rasters_vis).forEach(rName => {
                                        const rData = res.data.rasters_vis[rName]; const rId = 'smart15-raster-' + rName.replace(/\\s/g,'') + '-' + Date.now();
                                        mapObj.addSource(rId, { type: 'image', url: rData.url + '?t=' + Date.now(), coordinates: rData.coordinates });
                                        mapObj.addLayer({ id: rId+'-layer', type: 'raster', source: rId, paint: { 'raster-opacity': 0.6 } }); layersAtivos.push(rId+'-layer'); appendLayerToggle(rId+'-layer', rName, listaCamadasRasters);
                                        
                                        if(rData.cmap_css) {
                                            rasterLegends.style.display = "block";
                                            rasterLegends.innerHTML += `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                                <span style="width:30%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${rName}">${rName.split(' ')[0]}:</span> 
                                                <span style="font-weight:bold;">${rData.min.toFixed(1)}</span>
                                                <div style="flex:1; height:8px; margin:0 6px; border-radius:4px; background:${rData.cmap_css}"></div>
                                                <span style="font-weight:bold;">${rData.max.toFixed(1)}</span>
                                            </div>`;
                                        }
                                        
                                        if (rData.legend) {
                                            rasterLegends.style.display = "block";
                                            let htmlIA = `<b style="display: block; margin-top: 8px; margin-bottom: 6px; padding-top:4px; border-top:1px dashed #cbd5e0;">Legenda da IA (OBIA):</b><div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">`;
                                            for (let c in rData.legend) {
                                                htmlIA += `<span style="display:flex; align-items:center;"><span class="legenda-box" style="background:${rData.legend[c]};"></span> ${c.toUpperCase()}</span>`;
                                            }
                                            htmlIA += `</div>`;
                                            rasterLegends.innerHTML += htmlIA;
                                        }
                                    });
                                }

                                if (res.data.osm_targets && mapObj) {
                                    const osmId = 'smart15-osm-' + Date.now(); mapObj.addSource(osmId, { type: 'geojson', data: JSON.parse(res.data.osm_targets) });
                                    const colorExpr = ['match', ['get', 'categoria'], 'escolas', '#e53e3e', 'hospitais', '#3182ce', 'parques', '#38a169', 'mercados', '#d69e2e', 'cultura', '#805ad5', 'comercio', '#00b5d8', 'academias', '#dd6b20', '#718096'];
                                    mapObj.addLayer({ 'id': osmId+'-circle', 'type': 'circle', 'source': osmId, 'paint': { 'circle-radius': 6, 'circle-color': colorExpr, 'circle-stroke-width': 1, 'circle-stroke-color': '#fff' } });
                                    layersAtivos.push(osmId+'-circle'); appendLayerToggle(osmId+'-circle', "POIs Equipamentos Urbanos", listaCamadas);
                                }

                                if (res.data.simulacoes && mapObj) {
                                    const stepColor = ['step', ['get', 'time_band'], '#4ade80', 3, '#a3e635', 6, '#facc15', 11, '#fb923c', 16, '#ef4444'];
                                    
                                    res.data.simulacoes.forEach((geojsonStr: string, index: number) => {
                                        const geojson = JSON.parse(geojsonStr); const tipo = geojson.features[0]?.properties?.tipo || 'camada'; const perfil = geojson.features[0]?.properties?.perfil || 'Simulação';
                                        const prefixId = tipo === 'hexagonos' ? 'hex-' : 'iso-';
                                        
                                        const idOk = 'smart15-sim-ok-' + prefixId + index + '-' + Date.now(); mapObj.addSource(idOk, {type:'geojson', data:geojson});
                                        
                                        if ((wrap.querySelector("#extrusao3d") as HTMLInputElement).checked && tipo === 'hexagonos') { 
                                            mapObj.addLayer({ 'id': idOk+'-layer', 'type': 'fill-extrusion', 'source': idOk, 'paint': { 'fill-extrusion-color': stepColor, 'fill-extrusion-height': ['*', ['-', 25, ['get', 'time_band']], 2.5], 'fill-extrusion-opacity': (parseInt(opacHex.value)/100) } }); 
                                        } else { 
                                            mapObj.addLayer({ 'id': idOk+'-layer', 'type': 'fill', 'source': idOk, 'paint': { 'fill-color': stepColor, 'fill-opacity': (parseInt(opacIso.value)/100) } }); 
                                        }
                                        layersAtivos.push(idOk+'-layer'); 
                                        
                                        mapObj.addLayer({ 'id': idOk+'-layer-stroke', 'type': 'line', 'source': idOk, 'paint': { 'line-color': stepColor, 'line-width': 2, 'line-opacity':0 } }); 
                                        layersAtivos.push(idOk+'-layer-stroke'); 
                                        
                                        appendLayerToggle(idOk+'-layer', tipo + ' - ' + perfil, listaCamadas);
                                    });
                                }
                                setTimeout(() => { updateLayerStyle(); progressBar.style.width="100%"; progressText.innerText="100%"; progressLabel.innerHTML=SVG_ICONS.SUCCESS+" Concluído!"; setTimeout(()=>progressContainer.style.display="none", 2000); }, 300);
                            }
                        } catch (erro) { clearInterval((window as any).simProgressInterval); progressLabel.innerHTML=SVG_ICONS.WARN+" Falha no Servidor."; } 
                        finally { btnSimular.innerText = "Executar Simulação Urbana"; btnSimular.disabled = false; }
                    });

                    return () => wrap.remove();
                }
            });
            app.openRightPanel?.("smart15-workbench");
		}
    },
    deactivate(app: any) {
        const mapObj = getMapInstance(app); if (mapObj) { layersAtivos.forEach(id => { try { if(mapObj.getLayer(id)) mapObj.removeLayer(id); } catch(e){} }); layersAtivos.forEach(id => { const sId = id.replace('-line','').replace('-fill','').replace('-circle','').replace('-layer','').replace('-stroke','').replace('-grid',''); try { if(mapObj.getSource(sId)) mapObj.removeSource(sId); } catch(e){} }); }
        layersAtivos = []; app.closeRightPanel?.("smart15-workbench");
        const tooltip = document.getElementById('smart15-tooltip'); if(tooltip) tooltip.remove();
        const swipeDiv = document.getElementById('smart15-swipe-div'); if(swipeDiv) swipeDiv.remove();
        const swipeHandle = document.getElementById('smart15-swipe-handle'); if(swipeHandle) swipeHandle.remove();
    }
};

export default plugin;
//#endregion
