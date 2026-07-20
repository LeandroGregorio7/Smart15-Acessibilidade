FROM node:22-bookworm-slim AS builder

WORKDIR /workspace

# Copia o GeoLibre completo porque o npm ci precisa conhecer
# todos os workspaces declarados no package.json da raiz.
COPY geolibre ./geolibre

# Copia o projeto do plugin Smart15.
COPY plugin ./plugin

# Script responsável por construir e sincronizar o plugin.
COPY scripts/build-plugin.sh ./scripts/build-plugin.sh

RUN chmod +x ./scripts/build-plugin.sh

# Instala as dependências do plugin.
RUN cd /workspace/plugin \
    && npm ci

# Instala as dependências de todos os workspaces do GeoLibre.
RUN cd /workspace/geolibre \
    && npm ci

# Compila o plugin e o copia para o diretório público do GeoLibre.
RUN /workspace/scripts/build-plugin.sh

# Executa o prebuild do JupyterLite, TypeScript e Vite.
RUN cd /workspace/geolibre \
    && npm run build

FROM nginx:1.27-alpine AS runtime

COPY deploy/nginx/geolibre.conf \
     /etc/nginx/conf.d/default.conf

COPY --from=builder \
     /workspace/geolibre/apps/geolibre-desktop/dist \
     /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1/health || exit 1
