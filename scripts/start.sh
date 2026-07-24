#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")/.." >/dev/null 2>&1
  pwd
)"

COMPOSE_FILE="$ROOT_DIR/deploy/compose/docker-compose.yml"
BUILD_PLUGIN_SCRIPT="$ROOT_DIR/scripts/build-plugin.sh"

ENV_FILE="$ROOT_DIR/.env"
ENV_EXAMPLE_FILE="$ROOT_DIR/.env.example"

GEOLIBRE_DIR="$ROOT_DIR/geolibre"
GEOLIBRE_PLUGINS_DIR="$GEOLIBRE_DIR/apps/geolibre-desktop/public/plugins"

log() {
  printf '[start] %s\n' "$*"
}

fail() {
  printf '[start] ERRO: %s\n' "$*" >&2
  exit 1
}

check_command() {
  command -v "$1" >/dev/null 2>&1 \
    || fail "Comando obrigatório não encontrado: $1"
}

validate_port() {
  local name="$1"
  local port="$2"

  [[ "$port" =~ ^[0-9]+$ ]] \
    || fail "A porta configurada para $name não é válida: $port"

  ((port >= 1 && port <= 65535)) \
    || fail "A porta configurada para $name está fora do intervalo permitido: $port"
}

is_port_in_use() {
  local port="$1"

  # Detecta portas ocupadas por processos visíveis dentro do Linux/WSL.
  if ss -ltn 2>/dev/null |
    awk -v expected_port="$port" '
      NR > 1 {
        address = $4

        if (address ~ (":" expected_port "$")) {
          found = 1
          exit
        }
      }

      END {
        exit found ? 0 : 1
      }
    '; then
    return 0
  fi

  # Detecta serviços acessíveis pela rede, mesmo que não estejam visíveis dentro do Linux/WSL.
  if timeout 1 bash -c \
    "echo >/dev/tcp/127.0.0.1/$port" \
    >/dev/null 2>&1; then
    return 0
  fi

  return 1
}

find_available_port() {
  local initial_port="$1"
  local candidate=$((initial_port + 1))
  local limit=65535

  while ((candidate <= limit)); do
    if ! is_port_in_use "$candidate"; then
      printf '%s\n' "$candidate"
      return 0
    fi

    candidate=$((candidate + 1))
  done

  return 1
}

check_port_available() {
  local port="$1"
  local service="$2"
  local variable_name="$3"
  local suggested_port
  local suggested_backend_port="$BACKEND_PORT"
  local suggested_web_port="$WEB_PORT"

  if ! is_port_in_use "$port"; then
    log "Porta $port disponível para $service."
    return 0
  fi

  suggested_port="$(find_available_port "$port")" \
    || fail "Não foi possível encontrar uma porta disponível após $port."

  if [[ "$variable_name" == "SMART15_BACKEND_PORT" ]]; then
    suggested_backend_port="$suggested_port"
  else
    suggested_web_port="$suggested_port"
  fi

  echo
  echo "====================================================="
  echo "A porta $port, configurada para $service, já está em uso."
  echo
  echo "Serviços que estão escutando nessa porta:"
  echo

  ss -ltnp 2>/dev/null |
    grep -E ":${port}[[:space:]]" \
    || echo "  Nenhum processo Linux identificado pelo comando ss."

  echo
  echo "Containers Docker associados à porta:"
  echo

  docker ps \
    --format 'table {{.Names}}\t{{.Ports}}' |
    grep -E "NAMES|0\.0\.0\.0:${port}->|\[::\]:${port}->" \
    || echo "  Nenhum container Docker identificado."

  echo
  echo "A porta também pode estar sendo utilizada pelo Windows,"
  echo "pelo WSL2 ou por outro mecanismo de encaminhamento."
  echo
  echo "Escolha uma das opções abaixo:"
  echo
  echo "1) Alterar permanentemente a configuração do projeto:"
  echo
  echo "   Edite o arquivo:"
  echo "     $ENV_FILE"
  echo
  echo "   Exemplo:"
  echo "     ${variable_name}=${suggested_port}"
  echo
  echo "2) Executar apenas esta vez com outra porta:"
  echo
  echo "     ${variable_name}=${suggested_port} ./scripts/start.sh"
  echo
  echo "3) Informar temporariamente as duas portas:"
  echo
  echo "     SMART15_BACKEND_PORT=<porta-backend> \\"
  echo "     SMART15_WEB_PORT=<porta-geolibre> \\"
  echo "     ./scripts/start.sh"
  echo
  echo "   Exemplo:"
  echo
  echo "     SMART15_BACKEND_PORT=8001 \\"
  echo "     SMART15_WEB_PORT=8081 \\"
  echo "     ./scripts/start.sh"
  echo
  echo "====================================================="
  echo

  fail "A porta $port não está disponível para $service."
}

wait_for_http() {
  local name="$1"
  local url="$2"
  local attempts="${3:-30}"
  local delay="${4:-2}"

  log "Aguardando $name em $url..."

  for ((attempt = 1; attempt <= attempts; attempt++)); do
    if curl \
      --silent \
      --show-error \
      --fail \
      --max-time 5 \
      "$url" \
      >/dev/null 2>&1; then
      log "$name disponível."
      return 0
    fi

    sleep "$delay"
  done

  return 1
}

check_command docker
check_command curl
check_command ss
check_command timeout

docker compose version >/dev/null 2>&1 \
  || fail "Docker Compose não está disponível."

[[ -f "$COMPOSE_FILE" ]] \
  || fail "Arquivo Compose não encontrado: $COMPOSE_FILE"

[[ -x "$BUILD_PLUGIN_SCRIPT" ]] \
  || fail "Script não encontrado ou sem permissão de execução: $BUILD_PLUGIN_SCRIPT"

log "Projeto: $ROOT_DIR"

#
# Configuração local
#

if [[ ! -f "$ENV_FILE" ]]; then
  [[ -f "$ENV_EXAMPLE_FILE" ]] \
    || fail "Arquivos .env e .env.example não encontrados."

  log "Arquivo .env não encontrado."
  log "Criando .env a partir de .env.example..."

  cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
fi

# Preserva valores eventualmente informados na linha de comando:
#
# SMART15_BACKEND_PORT=8001 ./scripts/start.sh
#
EXTERNAL_BACKEND_PORT="${SMART15_BACKEND_PORT-}"
EXTERNAL_WEB_PORT="${SMART15_WEB_PORT-}"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -n "$EXTERNAL_BACKEND_PORT" ]]; then
  SMART15_BACKEND_PORT="$EXTERNAL_BACKEND_PORT"
fi

if [[ -n "$EXTERNAL_WEB_PORT" ]]; then
  SMART15_WEB_PORT="$EXTERNAL_WEB_PORT"
fi

BACKEND_PORT="${SMART15_BACKEND_PORT:-8000}"
WEB_PORT="${SMART15_WEB_PORT:-8080}"

validate_port "o backend Smart15" "$BACKEND_PORT"
validate_port "a interface GeoLibre" "$WEB_PORT"

[[ "$BACKEND_PORT" != "$WEB_PORT" ]] \
  || fail "Backend e GeoLibre não podem utilizar a mesma porta externa: $BACKEND_PORT"

export SMART15_BACKEND_PORT="$BACKEND_PORT"
export SMART15_WEB_PORT="$WEB_PORT"

COMPOSE_COMMAND=(
  docker
  compose
  --env-file
  "$ENV_FILE"
  --file
  "$COMPOSE_FILE"
)

log "Configuração:"
log "  Backend:  porta $BACKEND_PORT"
log "  GeoLibre: porta $WEB_PORT"

#
# Submódulo GeoLibre
#

if [[ ! -d "$GEOLIBRE_PLUGINS_DIR" ]]; then
  log "Conteúdo do GeoLibre não encontrado."
  log "Inicializando os submódulos Git..."

  check_command git

  git \
    -C "$ROOT_DIR" \
    submodule update \
    --init \
    --recursive
fi

[[ -d "$GEOLIBRE_PLUGINS_DIR" ]] \
  || fail "Falha ao inicializar o submódulo GeoLibre: $GEOLIBRE_DIR"

#
# Containers e portas
#

log "Removendo containers anteriores do Smart15..."

"${COMPOSE_COMMAND[@]}" \
  down \
  --remove-orphans

log "Verificando disponibilidade das portas..."

check_port_available \
  "$BACKEND_PORT" \
  "o backend Smart15" \
  "SMART15_BACKEND_PORT"

check_port_available \
  "$WEB_PORT" \
  "a interface GeoLibre" \
  "SMART15_WEB_PORT"

#
# Build do plugin
#

log "Compilando e sincronizando o plugin Smart15..."
"$BUILD_PLUGIN_SCRIPT"

#
# Inicialização da aplicação
#

log "Validando a configuração Docker Compose..."

"${COMPOSE_COMMAND[@]}" config --quiet \
  || fail "A configuração Docker Compose é inválida."

log "Construindo e iniciando os containers..."

"${COMPOSE_COMMAND[@]}" \
  up \
  --build \
  --detach \
  --force-recreate

log "Estado inicial dos serviços:"

"${COMPOSE_COMMAND[@]}" ps

#
# Validação do backend
#

if ! wait_for_http \
  "backend" \
  "http://127.0.0.1:$BACKEND_PORT/health"; then

  log "O backend não respondeu dentro do tempo esperado."
  log "Exibindo logs recentes do backend..."

  "${COMPOSE_COMMAND[@]}" \
    logs \
    --tail=100 \
    backend

  fail "Falha ao iniciar o backend."
fi

#
# Validação do GeoLibre
#

if ! wait_for_http \
  "GeoLibre" \
  "http://127.0.0.1:$WEB_PORT/health"; then

  log "O GeoLibre não respondeu dentro do tempo esperado."
  log "Exibindo logs recentes do serviço geolibre..."

  "${COMPOSE_COMMAND[@]}" \
    logs \
    --tail=100 \
    geolibre

  fail "Falha ao iniciar o GeoLibre."
fi

echo
echo "====================================================="
echo "Smart15 iniciado com sucesso."
echo
echo "Aplicação: http://localhost:$WEB_PORT"
echo "Backend:   http://localhost:$BACKEND_PORT"
echo "API Docs:  http://localhost:$BACKEND_PORT/docs"
echo
echo "Configuração efetiva:"
echo "  SMART15_BACKEND_PORT=$BACKEND_PORT"
echo "  SMART15_WEB_PORT=$WEB_PORT"
echo
echo "Arquivo de configuração local:"
echo "  $ENV_FILE"
echo
echo "Para acompanhar os logs:"
echo
echo "  docker compose \\"
echo "    --env-file .env \\"
echo "    --file deploy/compose/docker-compose.yml \\"
echo "    logs -f"
echo
echo "Para parar a aplicação:"
echo
echo "  docker compose \\"
echo "    --env-file .env \\"
echo "    --file deploy/compose/docker-compose.yml \\"
echo "    down"
echo "====================================================="