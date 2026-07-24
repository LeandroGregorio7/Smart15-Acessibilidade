#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")/.." >/dev/null 2>&1
  pwd
)"

PLUGIN_DIR="$ROOT_DIR/plugin"
PLUGIN_BUILD_DIR="$PLUGIN_DIR/geolibre-plugin"

GEOLIBRE_PLUGINS_DIR="$ROOT_DIR/geolibre/apps/geolibre-desktop/public/plugins"
DESTINATION_DIR="$GEOLIBRE_PLUGINS_DIR/smart15-orquestrador"

MANIFEST_SOURCE="$PLUGIN_BUILD_DIR/plugin.json"
BUNDLE_SOURCE="$PLUGIN_BUILD_DIR/dist/index.js"

MANIFEST_DESTINATION="$DESTINATION_DIR/plugin.json"
BUNDLE_DESTINATION="$DESTINATION_DIR/dist/index.js"

log() {
  printf '[build-plugin] %s\n' "$*"
}

fail() {
  printf '[build-plugin] ERRO: %s\n' "$*" >&2
  exit 1
}

[[ -d "$PLUGIN_DIR" ]] \
  || fail "Diretório do plugin não encontrado: $PLUGIN_DIR"

[[ -f "$PLUGIN_DIR/package.json" ]] \
  || fail "package.json não encontrado em: $PLUGIN_DIR"

[[ -d "$GEOLIBRE_PLUGINS_DIR" ]] \
  || fail "Diretório de plugins do GeoLibre não encontrado: $GEOLIBRE_PLUGINS_DIR"

log "Projeto: $ROOT_DIR"
log "Compilando o plugin Smart15..."

cd "$PLUGIN_DIR"

if [[ ! -d node_modules ]]; then
  log "Dependências não encontradas. Executando npm ci..."
  npm ci
fi

npm run build:geolibre

[[ -f "$MANIFEST_SOURCE" ]] \
  || fail "O build não gerou o manifesto: $MANIFEST_SOURCE"

[[ -f "$BUNDLE_SOURCE" ]] \
  || fail "O build não gerou o bundle: $BUNDLE_SOURCE"

log "Limpando o destino anterior..."
rm -rf "$DESTINATION_DIR"

log "Criando a estrutura no GeoLibre..."
mkdir -p "$DESTINATION_DIR/dist"

log "Copiando o manifesto..."
install -m 0644 \
  "$MANIFEST_SOURCE" \
  "$MANIFEST_DESTINATION"

log "Copiando o bundle..."
install -m 0644 \
  "$BUNDLE_SOURCE" \
  "$BUNDLE_DESTINATION"

log "Validando os arquivos copiados..."

cmp --silent "$MANIFEST_SOURCE" "$MANIFEST_DESTINATION" \
  || fail "O manifesto copiado difere do arquivo de origem."

cmp --silent "$BUNDLE_SOURCE" "$BUNDLE_DESTINATION" \
  || fail "O bundle copiado difere do arquivo de origem."

log "Plugin sincronizado com sucesso:"

echo
echo "====================================================="
echo "Smart15 Plugin"
echo "====================================================="
echo "✓ Build concluído"
echo "✓ Manifesto atualizado"
echo "✓ Bundle sincronizado"
echo
echo "Destino:"
echo "  $DESTINATION_DIR"
echo
echo "Caso o GeoLibre não carregue a versão atualizada do plugin, é necessário limpar o cache de bundles:"
echo
echo "  1. Abra o console do navegador (F12)."
echo "  2. Execute:"
echo
echo "     localStorage.removeItem('geolibre.pluginBundlePins')"
echo
echo "  3. Recarregue a página (Ctrl+Shift+R)."
echo "====================================================="
find "$DESTINATION_DIR" \
  -maxdepth 3 \
  -type f \
  -printf '  %p  %s bytes\n'
