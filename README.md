# Smart15 — Análise de Acessibilidade Urbana

O **Smart15** é uma plataforma web de análise geoespacial voltada ao conceito de **Cidade de 15 Minutos**.

A solução estima a acessibilidade de pedestres e ciclistas a serviços e equipamentos urbanos considerando, além da distância percorrida, fatores como:

- declividade do terreno;
- temperatura da superfície;
- cobertura vegetal e sombreamento;
- características da malha viária;
- perfil de mobilidade do usuário;
- distribuição de serviços e equipamentos urbanos.

A plataforma foi construída sobre o [GeoLibre](https://github.com/opengeos/GeoLibre) e integra processamento geoespacial, visualização interativa, exportação de resultados e geração automatizada de relatórios técnicos.

## Demonstração

<video src="https://github.com/user-attachments/assets/db3433ff-69a3-4e4b-ba6c-fbabf08c8604" controls="controls" style="max-width: 100%;"></video>

> Caso o vídeo não seja exibido diretamente, acesse o arquivo pela área de anexos do repositório no GitHub.

## Principais funcionalidades

- simulação de acessibilidade para diferentes perfis de mobilidade;
- análise de acesso a serviços e equipamentos urbanos;
- processamento de declividade, temperatura e cobertura vegetal;
- geração de isócronas e grades hexagonais;
- upload de arquivos GeoJSON, amostras e ortofotos;
- visualização e inspeção interativa das camadas;
- exportação em formatos geoespaciais;
- geração automatizada de relatório técnico.

Consulte a [descrição completa das funcionalidades](docs/funcionalidades.md).

## Arquitetura

O Smart15 é composto por:

- uma interface web baseada no GeoLibre;
- um plugin responsável pela interação com o usuário e visualização dos resultados;
- um backend FastAPI para processamento geoespacial, roteamento, rasters e exportações;
- fontes externas e dados fornecidos pelo usuário.

Consulte a [visão geral da arquitetura](docs/arquitetura/visao-geral.md).

## Instalação rápida

### Pré-requisitos

- Git;
- Docker;
- Docker Compose.

### Clonar e iniciar

```bash
git clone --recurse-submodules <URL_DO_REPOSITORIO>
cd Smart15-Acessibilidade
./scripts/start.sh
```

Endereços padrão:

- Aplicação: `http://localhost:8080`
- Backend: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

Para configuração de portas, logs, encerramento e solução de problemas, consulte o [guia de instalação](docs/instalacao.md).

## Estrutura do repositório

```text
Smart15-Acessibilidade/
├── backend/       # API e processamento geoespacial
├── deploy/        # Docker Compose, Dockerfiles e Nginx
├── docs/          # Documentação técnica
├── geolibre/      # Submódulo do GeoLibre
├── plugin/        # Código-fonte do plugin Smart15
├── scripts/       # Scripts de build e inicialização
└── README.md
```

## Documentação

- [Funcionalidades](docs/funcionalidades.md)
- [Instalação](docs/instalacao.md)
- [Desenvolvimento](docs/desenvolvimento.md)
- [Visão geral da arquitetura](docs/arquitetura/visao-geral.md)
- [Decisões arquiteturais](docs/adr/)

## Equipe

- **Leandro Gregório** — concepção, arquitetura e desenvolvimento;
- **Fábio Gregório** — desenvolvimento, integração, relatórios, testes e documentação.

## Projeto-base

O Smart15 utiliza o [GeoLibre](https://github.com/opengeos/GeoLibre) como plataforma geoespacial de base.

As licenças e os créditos dos projetos e bibliotecas utilizados devem ser preservados conforme seus respectivos termos.

## Licença

Consulte o arquivo [`LICENSE`](LICENSE) para as condições de uso e distribuição do projeto.
