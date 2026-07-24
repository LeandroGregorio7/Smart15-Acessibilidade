# Instalação do Smart15

Este guia descreve a instalação e a inicialização do Smart15 em ambiente Linux ou WSL2 com Docker.

## Pré-requisitos

Verifique se estão instalados:

- Git;
- Docker;
- Docker Compose;
- `curl`;
- `ss`;
- `timeout`.

O usuário atual deve possuir permissão para executar comandos Docker.

Verifique o ambiente:

```bash
git --version
docker --version
docker compose version
```

## Clonar o repositório

```bash
git clone --recurse-submodules <URL_DO_REPOSITORIO>
cd Smart15-Acessibilidade
```

O uso de `--recurse-submodules` é recomendado. Caso o GeoLibre ainda não tenha sido baixado, o script de inicialização tentará configurar o submódulo automaticamente.

## Iniciar a aplicação

```bash
./scripts/start.sh
```

O script realiza:

1. validação dos pré-requisitos;
2. criação do arquivo `.env`, quando necessário;
3. inicialização do submódulo GeoLibre;
4. compilação do plugin Smart15;
5. sincronização do plugin com o GeoLibre;
6. validação da configuração Docker Compose;
7. verificação de conflitos de portas;
8. construção das imagens Docker;
9. inicialização dos containers;
10. verificação de saúde do backend e da interface;
11. apresentação das URLs de acesso.

## Endereços padrão

- Aplicação: `http://localhost:8080`
- Backend: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

## Configuração de portas

As portas externas são configuradas no arquivo `.env`:

```dotenv
SMART15_BACKEND_PORT=8000
SMART15_WEB_PORT=8080
```

Na primeira execução, o `.env` é criado automaticamente a partir de `.env.example`.

Para utilizar portas diferentes apenas durante uma execução:

```bash
SMART15_BACKEND_PORT=8001 \
SMART15_WEB_PORT=8081 \
./scripts/start.sh
```

Quando uma porta estiver ocupada, o script interromperá a inicialização e apresentará uma sugestão de porta alternativa.

## Operação dos containers

### Consultar o estado

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  ps
```

### Acompanhar os logs

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  logs -f
```

### Parar a aplicação

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  down
```

### Reconstruir o ambiente

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  down --remove-orphans

./scripts/start.sh
```

## Problemas comuns

### Porta em uso

Altere as portas no `.env` ou informe valores temporários:

```bash
SMART15_BACKEND_PORT=8001 \
SMART15_WEB_PORT=8081 \
./scripts/start.sh
```

### Plugin desatualizado no navegador

Abra o console do navegador e execute:

```javascript
localStorage.removeItem('geolibre.pluginBundlePins')
```

Depois, recarregue a página com `Ctrl+Shift+R`.

### Verificar os logs de um serviço

Backend:

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  logs -f backend
```

GeoLibre:

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  logs -f geolibre
```
