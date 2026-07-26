# Instalação do Smart15

Este guia explica como instalar e iniciar o Smart15 em um servidor Linux ou em ambiente Windows + WSL2.

O Smart15 é executado com Docker. Isso significa que seus componentes — interface GeoLibre, plugin Smart15 e backend de processamento — são preparados e iniciados de forma padronizada, sem que seja necessário instalar manualmente Python, Node.js ou bibliotecas geoespaciais.

## Visão rápida

Depois que os pré-requisitos estiverem instalados, a instalação normalmente se resume a três comandos:

```bash
git clone --recurse-submodules <URL_DO_REPOSITORIO>
cd Smart15-Acessibilidade
./scripts/start.sh
```

Na primeira execução, o processo pode levar alguns minutos porque as imagens Docker precisam ser construídas.

## Conceitos utilizados

- **Terminal:** janela usada para digitar comandos no sistema operacional. No Ubuntu, pode ser aberta com `Ctrl` + `Alt` + `T`.
- **Git:** ferramenta usada para baixar e atualizar o código-fonte do projeto.
- **Docker:** ferramenta que executa a aplicação em contêineres isolados, com todas as dependências necessárias.
- **Docker Compose:** componente do Docker que inicia, para e acompanha os serviços do Smart15 em conjunto.
- **WSL2:** ambiente Linux dentro do Windows. Para usá-lo, o Docker Desktop deve estar instalado e integrado à distribuição Linux utilizada.

## 1. Pré-requisitos

São necessários:

- Git;
- Docker;
- Docker Compose;
- `curl`;
- `ss`;
- `timeout`.

O usuário que executará a instalação também precisa ter permissão para usar Docker.

### Instalação em Ubuntu ou Debian

Atualize a lista de pacotes e instale as ferramentas básicas:

```bash
sudo apt update

sudo apt install -y \
  git \
  curl \
  iproute2 \
  coreutils \
  docker.io \
  docker-compose-plugin
```

Adicione o usuário atual ao grupo do Docker:

```bash
sudo usermod -aG docker $USER
```

Após esse comando, encerre a sessão do Linux e entre novamente. Em WSL2, feche a distribuição e abra-a outra vez.

> Sem essa etapa, pode ser necessário usar `sudo` antes dos comandos Docker.

### Verificar o ambiente

Execute os comandos abaixo. Cada um deve exibir uma versão instalada:

```bash
git --version
docker --version
docker compose version
```

Também é possível verificar se o Docker está funcionando:

```bash
docker run hello-world
```

## 2. Baixar o projeto

No terminal, vá até a pasta em que deseja guardar o sistema e execute:

```bash
git clone --recurse-submodules <URL_DO_REPOSITORIO>
cd Smart15-Acessibilidade
```

Substitua `<URL_DO_REPOSITORIO>` pelo endereço do repositório Git fornecido pela equipe do projeto.

A opção `--recurse-submodules` baixa também o GeoLibre, componente que fornece a interface geoespacial utilizada pelo Smart15.

## 3. Iniciar a aplicação

Dentro da pasta `Smart15-Acessibilidade`, execute:

```bash
./scripts/start.sh
```

O script automatiza a preparação do ambiente. Ele realiza:

1. Validação dos pré-requisitos;
2. Criação do arquivo de configuração `.env`, quando necessário;
3. Inicialização do GeoLibre;
4. Compilação do plugin Smart15;
5. Sincronização do plugin com o GeoLibre;
6. Validação da configuração Docker Compose;
7. Verificação de conflitos de portas;
8. Construção das imagens Docker;
9. Inicialização dos contêineres;
10. Verificação de saúde do backend e da interface;
11. Apresentação dos endereços de acesso.

Ao final, a aplicação estará disponível nos endereços padrão:

- **Aplicação Smart15:** <http://localhost:8080>
- **Backend técnico:** <http://localhost:8000>
- **Documentação técnica da API:** <http://localhost:8000/docs>

Quando a aplicação estiver em um servidor, substitua `localhost` pelo endereço IP ou nome do servidor. Exemplo:

```text
http://192.168.1.50:8080
```

Para o uso normal do sistema, deve-se acessar a aplicação pela porta `8080`.

## 4. Configuração de portas

As portas externas são definidas no arquivo `.env`:

```dotenv
SMART15_BACKEND_PORT=8000
SMART15_WEB_PORT=8080
```

Na primeira execução, o arquivo `.env` é criado automaticamente a partir de `.env.example`.

Caso a porta padrão já esteja em uso, é possível iniciar temporariamente em outras portas:

```bash
SMART15_BACKEND_PORT=8001 \
SMART15_WEB_PORT=8081 \
./scripts/start.sh
```

Nesse exemplo, a aplicação será acessada em:

```text
http://localhost:8081
```

## Operação diária

### Verificar se o sistema está em execução

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  ps
```

Os serviços esperados são:

- `backend`: serviço que executa o processamento das simulações;
- `geolibre`: interface web do Smart15.

O estado `running` ou `Up` indica que o serviço está em execução.

### Acompanhar mensagens do sistema

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  logs -f
```

Para sair da visualização dos logs, pressione `Ctrl` + `C`.

### Parar a aplicação

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  down
```

Esse comando interrompe a aplicação, mas preserva os arquivos do projeto e as imagens Docker.

### Iniciar novamente

```bash
./scripts/start.sh
```

### Reconstruir o ambiente

Use este procedimento quando houver atualização do projeto ou necessidade de reconstruir os contêineres:

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  down --remove-orphans

./scripts/start.sh
```

## Problemas comuns

### O comando `git`, `docker` ou `docker compose` não foi encontrado

Isso indica que a ferramenta correspondente não está instalada ou que o terminal precisa ser reaberto após a instalação. Refaça a seção [Pré-requisitos](#1-pré-requisitos).

### Erro de permissão ao executar Docker

Se aparecer uma mensagem de permissão negada ao executar Docker, verifique se o usuário foi adicionado ao grupo `docker`:

```bash
sudo usermod -aG docker $USER
```

Depois, encerre a sessão e entre novamente no sistema.

### Porta em uso

Altere as portas no arquivo `.env` ou informe valores temporários:

```bash
SMART15_BACKEND_PORT=8001 \
SMART15_WEB_PORT=8081 \
./scripts/start.sh
```

### A aplicação não abre em outro computador da rede

Verifique:

1. Se a aplicação foi iniciada corretamente;
2. Se o endereço IP do servidor foi utilizado no navegador;
3. Se a porta configurada está liberada no firewall e na rede local;
4. Se os serviços aparecem como `running` no comando `docker compose ... ps`.

### Plugin desatualizado no navegador

Esta orientação é voltada à equipe técnica, após atualização do plugin:

1. Abra o console do navegador;
2. Execute o comando abaixo;
3. Recarregue a página com `Ctrl` + `Shift` + `R`.

```javascript
localStorage.removeItem('geolibre.pluginBundlePins')
```

### Verificar os logs de um único serviço

**Logs do backend:**

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  logs -f backend
```

**Logs da interface GeoLibre:**

```bash
docker compose \
  --env-file .env \
  --file deploy/compose/docker-compose.yml \
  logs -f geolibre
```
