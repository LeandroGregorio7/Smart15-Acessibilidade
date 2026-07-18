# **Smart-15 v2.0 (Geo-Analytics Metrics)**
O Smart-15 revoluciona o conceito de "Cidades de 15 Minutos" (15-Minute City) ao abandonar o simples cálculo de distância euclidiana. Em vez disso, esta ferramenta introduz uma física de movimento humanizada, cruzando a malha viária com dados ambientais de satélite e algoritmos de Inteligência Artificial para calcular o verdadeiro esforço e conforto térmico de pedestres e ciclistas.

# **Principais Novidades desta Versão**
>Nesta versão 2.0, o motor de roteamento e o processamento de rasters foram totalmente reconstruídos para entregar precisão cirúrgica e automação em nuvem:

>Integração Cloud-Native (LST): Conexão direta com o Microsoft Planetary Computer para extração automática e gratuita da Temperatura da Superfície (Banda 10 do Landsat 9).

>Relevo e Equação de Tobler (DEM): Escalonamento geodésico rigoroso (Graus para Metros Reais) utilizando dados do Copernicus. A inclinação real (declividade) frena ou acelera o indivíduo dinamicamente na rede do OpenStreetMap.

>Motor de IA (Smart OBIA): Novo algoritmo de Classificação Baseada em Objetos (Decision Tree Classifier) que rasteriza milhares de pixéis a partir de amostras do utilizador. Classifica o asfalto, edifícios e árvores de forma massiva para injetar o Fator de Sombreamento (FIS) na rota.

>Escudo Anti-NaN: Proteção matemática avançada que impede a quebra da malha de roteamento em zonas de dados ausentes nas bordas dos satélites.

# **Funcionalidades de Destaque**
>Simulação Multi-Perfil: Acessibilidade inclusiva. O algoritmo respeita diferentes velocidades e limites de tolerância térmica para Adultos, Crianças e Idosos (a pé ou de bicicleta).

>Tesselação e Isócronas: Exportação simultânea de manchas contínuas de tempo (Isócronas) e agregações estatísticas hexagonais (Grelha H3 da Uber).

>Preenchimento de Penalidade: Zonas além do raio de 15 minutos não ficam vazias; são ativamente mapeadas como áreas de exclusão/penalidade vermelha (> 15 min).

>Visualização Interativa de Alto Nível:

>Identificador Raio-X: Passe o mouse para ler classes da IA, categorias de POIs e tempos de roteamento.

>Cortina Comparativa (Swipe): Analise cenários dividindo o ecrã a meio.

>Legendas Dinâmicas: Valores exatos (vmin/vmax) extraídos diretamente dos satélites para as rampas Plasma (Declividade) e Nipy Spectral (Elevação).

>Exportação Segura: Geração nativa de .ZIP (SHP, GeoJSON, KML) e ferramenta integrada de Captura de Ecrã (Screenshot).

# ** Stack Tecnológico**
Backend (Motor Python): FastAPI, GeoPandas, OSMnx, NetworkX, Rasterio, Scikit-learn (Decision Trees), pystac-client e stackstac.
Frontend (Painel): JavaScript Puro, renderização WebGL/MapLibre para Extrusão 3D e manipulação de fontes GeoJSON.

# **Veja uma demonstração no video:**
<video src="https://github.com/user-attachments/assets/db3433ff-69a3-4e4b-ba6c-fbabf08c8604" controls="controls" style="max-width: 100%;"></video>




