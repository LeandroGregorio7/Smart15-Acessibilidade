
---

# `ADR-003-deploy-com-docker-compose.md`

```markdown
# ADR-003 — Implantação do Smart-15 com Docker Compose

## Status

Aceito.

## Data

2026-07-18.

## Contexto

O Smart-15 deverá ser entregue para execução em ambiente de servidor da universidade.

A aplicação possui diferentes componentes e dependências:

- GeoLibre Web;
- plugin Smart-15;
- backend FastAPI;
- bibliotecas Python geoespaciais;
- Nginx ou outro proxy reverso;
- diretórios de dados;
- arquivos temporários;
- resultados;
- relatórios;
- configurações de ambiente.

O backend utiliza bibliotecas que podem exigir dependências de sistema operacional, como:

- GDAL;
- PROJ;
- GEOS;
- Rasterio;
- GeoPandas;
- OSMnx;
- Scikit-learn.

A instalação manual dessas dependências no servidor aumentaria o risco de diferenças entre os ambientes de desenvolvimento, homologação e produção.

O projeto precisa de um processo de implantação:

- documentado;
- reproduzível;
- versionado;
- simples de executar;
- adequado a um servidor Linux;
- independente da estação do desenvolvedor.

## Decisão

O Smart-15 será implantado utilizando contêineres Docker coordenados por Docker Compose.

A implantação inicial será composta, no mínimo, pelos seguintes serviços:

```text
smart15-web
    GeoLibre Web com plugin Smart-15

smart15-api
    API FastAPI e motor geoespacial

reverse-proxy
    entrada HTTP/HTTPS e roteamento
```

Poderão ser adicionados futuramente:

```text
worker
    processamento assíncrono

redis
    fila, cache ou estado temporário

postgis
    persistência geoespacial

object-storage
    armazenamento de grandes artefatos
```

Arquitetura de implantação

```text
Navegador
    │
    │ HTTPS
    ▼
Nginx
    ├── /        → GeoLibre Web
    ├── /api     → Smart-15 API
    ├── /files   → resultados e exportações
    └── /reports → relatórios
```

O Nginx atuará como ponto único de acesso.

Isso permitirá que o navegador acesse frontend e backend pelo mesmo domínio, reduzindo problemas de CORS.

Estrutura prevista

```text
deploy/
├── compose/
│   ├── docker-compose.yml
│   └── docker-compose.override.yml
├── nginx/
│   └── nginx.conf
├── env/
│   └── .env.example
└── README.md
```

O arquivo .env real não será versionado.

Será fornecido apenas um arquivo .env.example.

Exemplo conceitual de Docker Compose

```yaml
services:
  web:
    build:
      context: ..
      dockerfile: geolibre/Dockerfile
    restart: unless-stopped
    depends_on:
      - api

  api:
    build:
      context: ../backend
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - smart15-data:/app/data
      - smart15-results:/app/results

  proxy:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ../nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - web
      - api

volumes:
  smart15-data:
  smart15-results:
```

O conteúdo final poderá diferir conforme a arquitetura efetivamente adotada.

## Estratégia de imagens

Durante o desenvolvimento, o Compose poderá utilizar build.

Exemplo:

```yaml
services:
  api:
    build:
      context: ../backend
```

Para homologação e produção, serão utilizadas preferencialmente imagens versionadas.

Exemplo:

```yaml
services:
  api:
    image: ghcr.io/geosmart/smart15-api:1.0.0

  web:
    image: ghcr.io/geosmart/smart15-web:1.0.0
```

Não será recomendado o uso exclusivo da tag latest em produção.

As imagens deverão utilizar versões explícitas:

```text
1.0.0
1.0.1
1.1.0
```

## Publicação das imagens

As imagens poderão ser publicadas no GitHub Container Registry.

O fluxo esperado será:

```text
Commit ou tag
    │
    ▼
GitHub Actions
    │
    ├── executa testes
    ├── constrói as imagens
    └── publica no registry
    │
    ▼
Servidor da universidade
    │
    ├── docker compose pull
    └── docker compose up -d
```

## Configuração

As configurações da aplicação serão fornecidas por variáveis de ambiente.

Exemplos:

```text
SMART15_ENV
SMART15_API_URL
SMART15_DATA_DIR
SMART15_RESULTS_DIR
SMART15_LOG_LEVEL
SMART15_MAX_ANALYSIS_AREA
SMART15_ALLOWED_ORIGINS
```

Credenciais e tokens não deverão ser armazenados no repositório.

## Persistência

Os dados que precisam sobreviver à recriação dos contêineres serão armazenados em volumes.

Exemplos:

- resultados;
- relatórios;
- arquivos exportados;
- cache de dados;
- arquivos enviados pelo usuário;
- logs, caso não sejam enviados para outro serviço.

Arquivos temporários poderão ser removidos após um período configurável.

## Backup

A implantação deverá documentar:

- quais volumes precisam de backup;
- onde ficam os arquivos persistentes;
- como restaurar os dados;
- como exportar uma release;
- como recuperar uma versão anterior.

O código-fonte não será considerado backup dos dados produzidos.

## Alternativas consideradas

### Instalação manual no servidor

A instalação manual de Python, Node.js, bibliotecas geoespaciais e Nginx seria possível.

Entretanto, aumentaria:

- divergências entre ambientes;
- dificuldade de suporte;
- risco de incompatibilidade;
- tempo de implantação;
- dependência do administrador do servidor.

### Kubernetes ou OpenShift

Kubernetes e OpenShift oferecem:

- escalabilidade;
- alta disponibilidade;
- gerenciamento avançado;
- observabilidade;
- deploy declarativo.

Entretanto, para a primeira versão, representariam maior complexidade operacional e exigiriam infraestrutura específica.

Docker Compose é suficiente para uma implantação inicial em servidor único.

A arquitetura em contêineres permitirá evolução futura para Kubernetes ou OpenShift.

### Execução em plataformas serverless

Serviços serverless poderiam simplificar parte do deploy.

Entretanto, o Smart-15 possui:

- processamento de longa duração;
- grande uso de memória;
- dependências nativas;
- manipulação de arquivos grandes;
- necessidade de armazenamento persistente.

Essas características podem não se adequar bem a ambientes serverless.

### Consequências positivas

- Ambiente reproduzível.
- Instalação simplificada.
- Isolamento das dependências.
- Facilidade de atualização.
- Possibilidade de rollback.
- Maior consistência entre desenvolvimento e produção.
- Menor dependência da configuração do servidor.
- Base para futura migração para OpenShift ou Kubernetes.
- Facilidade de entrega de imagens prontas para a universidade.

### Consequências negativas

- Necessidade de Docker no servidor.
- Necessidade de conhecimento básico de contêineres.
- Gerenciamento adicional de volumes e imagens.
- Consumo de espaço em disco.
- Necessidade de atualização das imagens base.
- Docker Compose não oferece alta disponibilidade nativa.

### Riscos

Servidor sem acesso ao registry

A universidade pode utilizar um servidor sem acesso externo.

Mitigação:

- gerar um pacote offline;
- exportar as imagens com docker save;
- importar com docker load;
- fornecer arquivos Compose e documentação.

### Crescimento dos arquivos

Rasters e exportações podem consumir grande volume de armazenamento.

Mitigação:

- configurar política de retenção;
- remover arquivos temporários;
- monitorar espaço disponível;
- separar dados persistentes;
- limitar tamanho e área das simulações.

### Falha durante atualização

Uma nova imagem pode apresentar problema em produção.

Mitigação:

- utilizar tags imutáveis;
- manter a versão anterior;
- documentar rollback;
- testar as imagens antes da implantação.

### Credenciais expostas

Tokens podem ser incluídos indevidamente no código ou nas imagens.

Mitigação:

- utilizar variáveis de ambiente;
- manter .env fora do Git;
- revisar imagens e workflows;
- utilizar secrets do GitHub Actions.

## Critérios de validação

A decisão será considerada validada quando:

- a aplicação puder ser iniciada com docker compose up -d;
- frontend e backend forem acessíveis pelo mesmo domínio;
- os dados persistirem após reinício;
- uma nova versão puder ser implantada por troca de tag;
- o rollback puder ser realizado;
- a instalação puder ser reproduzida em um servidor Linux limpo;
- o procedimento estiver documentado.

## Evolução futura

A arquitetura poderá evoluir para:

- fila de tarefas;
- múltiplos workers;
- banco PostGIS;
- armazenamento S3 compatível;
- monitoramento;
- centralização de logs;
- Kubernetes;
- OpenShift.

Essa evolução não exigirá alterar a separação conceitual entre frontend, API e processamento.

## Revisão da decisão

Esta decisão deve ser revisada caso:

- a universidade adote obrigatoriamente outra plataforma;
- seja necessário escalar horizontalmente;
- haja requisitos de alta disponibilidade;
- o volume de processamento exija uma infraestrutura distribuída;
- Docker Compose deixe de atender ao ambiente institucional.
