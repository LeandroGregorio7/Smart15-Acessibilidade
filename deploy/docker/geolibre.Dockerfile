# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS builder

WORKDIR /workspace

# Dependências do plugin
COPY plugin/package.json plugin/package-lock.json ./plugin/

RUN --mount=type=cache,target=/root/.npm \
    cd /workspace/plugin \
    && npm ci --no-audit --no-fund

# Dependências do GeoLibre
COPY geolibre/package.json geolibre/package-lock.json ./geolibre/

COPY geolibre/apps/geolibre-desktop/package.json \
     ./geolibre/apps/geolibre-desktop/package.json

COPY geolibre/packages/core/package.json \
     ./geolibre/packages/core/package.json

COPY geolibre/packages/map/package.json \
     ./geolibre/packages/map/package.json

COPY geolibre/packages/plugins/package.json \
     ./geolibre/packages/plugins/package.json

COPY geolibre/packages/processing/package.json \
     ./geolibre/packages/processing/package.json

COPY geolibre/packages/ui/package.json \
     ./geolibre/packages/ui/package.json

COPY geolibre/workers/collab/package.json \
     ./geolibre/workers/collab/package.json

COPY geolibre/workers/tiles/package.json \
     ./geolibre/workers/tiles/package.json

COPY geolibre/workers/viewer/package.json \
     ./geolibre/workers/viewer/package.json

RUN --mount=type=cache,target=/root/.npm \
    cd /workspace/geolibre \
    && npm ci --no-audit --no-fund --verbose

# Código-fonte
COPY geolibre ./geolibre
COPY plugin ./plugin
COPY scripts/build-plugin.sh ./scripts/build-plugin.sh

RUN chmod +x ./scripts/build-plugin.sh

RUN /workspace/scripts/build-plugin.sh

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
    CMD wget --quiet --tries=1 --spider \
      http://127.0.0.1/health || exit 1
