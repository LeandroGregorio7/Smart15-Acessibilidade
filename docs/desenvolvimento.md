# Desenvolvimento do Smart15

## Componentes principais

O projeto possui três componentes centrais:

- `backend/`: API FastAPI e processamento geoespacial;
- `plugin/`: código-fonte do plugin Smart15;
- `geolibre/`: submódulo da plataforma GeoLibre.

A infraestrutura de execução fica em `deploy/`, e os scripts auxiliares ficam em `scripts/`.

## Desenvolvimento do plugin

O plugin utiliza TypeScript, Vite e componentes integrados à interface do GeoLibre.

Para instalar as dependências do projeto:

```bash
npm install
```

Para compilar e sincronizar o plugin com o GeoLibre:

```bash
./scripts/build-plugin.sh
```

O script:

1. compila o bundle;
2. remove a versão anteriormente sincronizada;
3. cria a estrutura de destino;
4. copia o manifesto;
5. copia o bundle;
6. valida os arquivos resultantes.

Destino do plugin:

```text
geolibre/apps/geolibre-desktop/public/plugins/smart15-orquestrador/
```

## Execução integrada

Para compilar o plugin, construir as imagens e iniciar todo o ambiente:

```bash
./scripts/start.sh
```

## Backend

O backend é implementado em Python com FastAPI.

Principais responsabilidades:

- obtenção e tratamento de dados geoespaciais;
- processamento de modelos digitais de elevação;
- cálculo de declividade;
- tratamento de dados térmicos e de vegetação;
- construção e análise da rede viária;
- geração de isócronas e grades;
- exportação dos resultados;
- disponibilização dos arquivos gerados.

A documentação interativa da API fica disponível em:

```text
http://localhost:8000/docs
```

ou na porta configurada em `SMART15_BACKEND_PORT`.

## Estrutura relevante

```text
Smart15-Acessibilidade/
├── backend/
├── deploy/
│   ├── compose/
│   ├── docker/
│   └── nginx/
├── docs/
├── geolibre/
├── plugin/
├── scripts/
│   ├── build-plugin.sh
│   └── start.sh
├── .env.example
├── package.json
└── README.md
```

## Submódulo GeoLibre

Para inicializar ou atualizar manualmente o submódulo:

```bash
git submodule update --init --recursive
```

Para consultar o commit utilizado:

```bash
git submodule status
```

Alterações no GeoLibre devem ser tratadas separadamente das alterações do repositório principal.

## Cache do plugin

Caso o GeoLibre carregue uma versão anterior do bundle, execute no console do navegador:

```javascript
localStorage.removeItem('geolibre.pluginBundlePins')
```

Depois, recarregue a página com `Ctrl+Shift+R`.

## Validações antes de um commit

```bash
git status
git diff
./scripts/build-plugin.sh
./scripts/start.sh
```

Após a inicialização, verifique:

- aplicação web;
- endpoint `/health` do backend;
- documentação `/docs`;
- carregamento do plugin;
- execução de uma simulação;
- geração e abertura do relatório;
- exportação dos resultados.
