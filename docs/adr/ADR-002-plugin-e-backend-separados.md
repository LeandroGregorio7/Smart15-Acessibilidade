
---

# `ADR-002-plugin-e-backend-separados.md`

```markdown
# ADR-002 — Separação entre o plugin Smart-15 e o backend geoespacial

## Status

Aceito.

## Data

2026-07-18.

## Contexto

O Smart-15 possui duas categorias principais de responsabilidade.

A primeira está relacionada à interação com o usuário:

- seleção da área de análise;
- configuração do perfil;
- escolha dos parâmetros;
- submissão da simulação;
- acompanhamento do processamento;
- exibição de camadas;
- apresentação de indicadores;
- download de resultados.

A segunda está relacionada ao processamento geoespacial:

- obtenção da rede viária;
- processamento de dados do OpenStreetMap;
- obtenção e tratamento de rasters;
- cálculo de declividade;
- processamento de temperatura superficial;
- classificação de vegetação e cobertura;
- ponderação da rede;
- cálculo de rotas;
- geração de isócronas;
- agregação H3;
- exportação de arquivos;
- geração de relatórios.

Essas duas categorias possuem características técnicas diferentes.

A interface deve executar no navegador e permanecer responsiva.

O processamento geoespacial pode consumir grande quantidade de:

- CPU;
- memória;
- disco;
- tempo de execução;
- bibliotecas nativas;
- dados temporários.

O navegador não é o ambiente adequado para realizar integralmente esse processamento.

## Decisão

A interface Smart-15 será implementada como plugin do GeoLibre.

O processamento geoespacial será implementado em um backend independente utilizando Python e FastAPI.

A comunicação entre plugin e backend ocorrerá por API HTTP.

A divisão principal será:

```text
Plugin Smart-15
    interface, interação e visualização

Smart-15 API
    validação, orquestração e disponibilização dos resultados

Motor Geoespacial
    cálculos, dados ambientais, roteamento e exportação
```

## Responsabilidades do plugin

### O plugin será responsável por:

- apresentar os controles da aplicação;
- receber os parâmetros do usuário;
- obter a área selecionada no mapa;
- enviar solicitações para a API;
- apresentar o estado da simulação;
- consumir os resultados;
- adicionar camadas ao GeoLibre;
- exibir isócronas, rotas, POIs e grades;
- exibir indicadores resumidos;
- disponibilizar links para download e relatório;
- apresentar mensagens de erro de forma compreensível.

### O plugin não será responsável por:

- executar processamento raster pesado;
- calcular rotas completas;
- processar grandes grafos;
- executar classificação geoespacial em larga escala;
- armazenar arquivos de resultado;
- gerar arquivos Shapefile, KML ou PDF.

## Responsabilidades do backend

### O backend será responsável por:

- validar os parâmetros recebidos;
- criar um identificador de simulação;
- coordenar o processamento;
- consultar serviços externos;
- processar a rede viária;
- processar rasters;
- aplicar os fatores de ponderação;
- calcular isócronas e indicadores;
- gerar arquivos de saída;
- armazenar os artefatos;
- disponibilizar os resultados;
- gerar o relatório técnico;
- registrar erros e informações de execução.

## Contrato de comunicação

O plugin enviará solicitações em JSON.

Exemplo conceitual:

```json
{
  "origin": {
    "latitude": -22.90,
    "longitude": -43.20
  },
  "profile": "adult_walking",
  "maximum_time_minutes": 15,
  "factors": {
    "slope": true,
    "temperature": true,
    "vegetation": true
  }
}
```

A API retornará um identificador da simulação e seu estado.

Exemplo:

```json
{
  "simulation_id": "sim-20260718-001",
  "status": "processing"
}
```

Após o processamento, a API poderá retornar:

```json
{
  "simulation_id": "sim-20260718-001",
  "status": "completed",
  "layers": {
    "isochrones": "/api/simulations/sim-20260718-001/isochrones.geojson",
    "routes": "/api/simulations/sim-20260718-001/routes.geojson",
    "pois": "/api/simulations/sim-20260718-001/pois.geojson",
    "hexagons": "/api/simulations/sim-20260718-001/hexagons.geojson"
  },
  "indicators": {
    "reachable_area_m2": 850000,
    "reachable_pois": 37,
    "slope_penalty_percent": 12.4,
    "heat_penalty_percent": 8.1,
    "vegetation_benefit_percent": 3.7
  },
  "exports": {
    "zip": "/api/simulations/sim-20260718-001/export.zip",
    "report": "/api/simulations/sim-20260718-001/report.pdf"
  }
}
```

## Formatos de dados

Serão utilizados, conforme a necessidade:

- JSON para parâmetros, estados e indicadores;
- GeoJSON para camadas vetoriais;
- PNG ou GeoTIFF para resultados raster;
- ZIP para agrupamento de arquivos exportados;
- PDF para relatórios;
- HTTP para transferência dos dados.

GeoJSON é um formato de resposta, não um componente independente da arquitetura.

## Alternativas consideradas
### Implementar todo o processamento no plugin

Essa abordagem reduziria o número de serviços.

Entretanto, seria inadequada porque:

- o navegador possui recursos limitados;
- bibliotecas Python geoespaciais não estariam disponíveis;
- grandes rasters poderiam bloquear a interface;
- o processamento seria repetido em cada estação;
- o código ficaria fortemente acoplado ao frontend;
- seria difícil controlar e reproduzir o ambiente.

### Implementar a interface diretamente no backend

Essa alternativa permitiria criar uma aplicação web convencional com templates.

Entretanto, reduziria o aproveitamento do GeoLibre e dificultaria:

- integração com o mapa;
- criação de camadas;
- controles interativos;
- reutilização da arquitetura de plugins;
- evolução independente da interface.

### Incorporar o backend dentro do serviço interno do GeoLibre

Essa alternativa diminuiria a quantidade de contêineres.

Entretanto, criaria maior acoplamento e misturaria responsabilidades de plataforma e domínio.

O backend Smart-15 possui dependências geoespaciais específicas e um ciclo de evolução próprio.

## Consequências positivas

- Separação clara de responsabilidades.
- Interface mais leve e responsiva.
- Backend reutilizável por outros clientes.
- Possibilidade de testar frontend e backend separadamente.
- Facilidade para escalar o processamento.
- Isolamento das dependências Python.
- Melhor organização do código.
- Possibilidade de futuras integrações por API.
- Facilidade para geração de relatórios e exportações.
- Menor acoplamento ao núcleo do GeoLibre.

## Consequências negativas

- Aumento do número de componentes implantados.
- Necessidade de definir e manter um contrato de API.
- Necessidade de tratamento de falhas de rede.
- Necessidade de configurar CORS ou proxy reverso.
- Necessidade de gerenciar arquivos e estados de simulação.
- Maior complexidade de observabilidade.

## Riscos

### Requisições demoradas

Simulações podem exceder o tempo normal de uma requisição HTTP.

Mitigação:

- utilizar processamento assíncrono;
- retornar um identificador de simulação;
- permitir consulta de estado;
- configurar limites e timeouts adequados;
- considerar fila de processamento em versões futuras.

### Respostas muito grandes

Camadas GeoJSON podem atingir tamanhos elevados.

Mitigação:

- simplificar geometrias;
- disponibilizar camadas por URL;
- utilizar compressão;
- avaliar formatos vetoriais mais eficientes no futuro;
- limitar a área de análise.

### Incompatibilidade entre frontend e API

Mudanças no contrato podem quebrar o plugin.

Mitigação:

- versionar a API;
- documentar os esquemas;
- criar testes de integração;
- manter compatibilidade durante as releases.

## Requisitos de implementação

A API deverá:

- possuir documentação OpenAPI;
- utilizar modelos de entrada e saída;
- validar parâmetros;
- retornar erros estruturados;
- registrar logs;
- identificar cada simulação;
- evitar nomes globais de arquivos;
- separar resultados por simulação;
- não depender de URLs fixas de localhost;
- permitir configuração por variáveis de ambiente.

O plugin deverá:

- utilizar uma URL de API configurável;
- tratar os estados de processamento;
- tratar falhas de comunicação;
- não depender de caminhos absolutos;
- validar entradas antes do envio;
- apresentar erros ao usuário.

## Critérios de validação

A decisão será considerada validada quando:

- o plugin conseguir iniciar uma simulação;
- a API receber e validar a requisição;
- a API executar ou coordenar o processamento;
- o plugin conseguir consultar o estado;
- o plugin carregar as camadas resultantes;
- os indicadores puderem ser apresentados;
- o relatório puder ser acessado pela interface.

## Revisão da decisão

Esta decisão deve ser revisada caso:

- o processamento passe a ser suficientemente leve para execução local;
- o GeoLibre ofereça uma arquitetura nativa adequada para serviços geoespaciais;
- surja a necessidade de múltiplos backends especializados;
- seja adotada uma arquitetura orientada a eventos ou filas.
