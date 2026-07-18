# ADR-001 — Uso do GeoLibre como plataforma web do Smart-15

## Status

Aceito.

## Data

2026-07-18.

## Contexto

O Smart-15 é uma plataforma de análise de acessibilidade urbana baseada no conceito de Cidade de 15 Minutos.

A solução precisa permitir que o usuário:

- selecione uma área de estudo;
- configure um perfil de mobilidade;
- execute uma análise geoespacial;
- visualize camadas, isócronas e pontos de interesse;
- compare cenários;
- exporte resultados;
- gere relatórios técnicos.

A versão anterior do projeto estava mais próxima de uma aplicação desktop e de um fluxo dependente de ferramentas locais de geoprocessamento.

Para a nova versão, foi definido que o sistema deve ser acessível pelo navegador, sem exigir que o usuário instale software geoespacial em sua estação de trabalho.

O projeto já utiliza funcionalidades de visualização cartográfica, manipulação de camadas e renderização WebGL que podem ser atendidas pelo GeoLibre.

O GeoLibre oferece uma base web para visualização geoespacial e permite a extensão da interface por meio de plugins.

## Decisão

O GeoLibre será utilizado como plataforma web e cartográfica do Smart-15.

O projeto Smart-15 será integrado a um fork do GeoLibre mantido pela organização GeoSmart.

O fork será utilizado para:

- controlar a versão do GeoLibre adotada pelo projeto;
- integrar o plugin Smart-15;
- ajustar o processo de build;
- configurar a aplicação para implantação;
- aplicar eventuais adaptações de interface e identidade visual.

A lógica de negócio específica do Smart-15 não será incorporada diretamente ao núcleo do GeoLibre.

A interface específica será implementada por meio do plugin Smart-15, enquanto o processamento geoespacial será realizado por um backend separado.

## Arquitetura resultante

A solução será organizada da seguinte forma:

```text
Usuário
   │
   ▼
GeoLibre Web
   │
   ▼
Plugin Smart-15
   │
   ▼
Smart-15 API
   │
   ▼
Motor Geoespacial
```
O GeoLibre será responsável principalmente por:

- fornecer a aplicação web;
- apresentar o mapa;
- controlar camadas;
- permitir interação com objetos geográficos;
- executar o plugin Smart-15;
- renderizar os resultados recebidos da API.

## Alternativas consideradas
### Desenvolver uma aplicação web cartográfica do zero

Essa alternativa daria maior liberdade sobre a interface e a arquitetura.

Entretanto, exigiria implementar novamente recursos já existentes, como:

- gerenciamento de mapa;
- carregamento de camadas;
- controles cartográficos;
- navegação;
- renderização WebGL;
- integração com formatos geoespaciais;
- gerenciamento de plugins.

Essa opção aumentaria o prazo, o esforço de desenvolvimento e o risco do projeto.

### Manter o projeto apenas como aplicação desktop

Essa alternativa reduziria alterações na arquitetura existente.

Entretanto, apresentaria limitações importantes:

- necessidade de instalação local;
- maior dificuldade de atualização;
- dependência do ambiente do usuário;
- menor facilidade de demonstração;
- maior complexidade para disponibilização institucional;
- dificuldade de acesso por diferentes dispositivos.

### Modificar diretamente o núcleo do GeoLibre

Essa alternativa permitiria inserir o Smart-15 diretamente no código principal da plataforma.

Entretanto, aumentaria o acoplamento entre o projeto e o GeoLibre, dificultando:

- atualização a partir do projeto original;
- manutenção;
- identificação das alterações do Smart-15;
- reutilização do plugin;
- isolamento de falhas.

## Consequências positivas
- Redução do esforço para construir a interface cartográfica.
- Disponibilização do sistema por navegador.
- Reaproveitamento de recursos existentes no GeoLibre.
- Separação entre plataforma cartográfica e lógica específica do Smart-15.
- Possibilidade de atualização do fork a partir do projeto original.
- Melhor rastreabilidade das alterações.
- Maior facilidade de implantação em servidor.
- Facilidade para demonstração e uso pela universidade.

## Consequências negativas
- Dependência tecnológica do GeoLibre.
- Necessidade de acompanhar mudanças no projeto original.
- Possíveis incompatibilidades entre novas versões do GeoLibre e o plugin.
- Necessidade de manter um fork.
- Parte da arquitetura e do ciclo de build será determinada pelo GeoLibre.

## Riscos
### Mudanças incompatíveis no GeoLibre

Novas versões podem alterar a API de plugins ou o processo de build.

Mitigação:

- fixar uma versão do GeoLibre para cada release do Smart-15;
- utilizar tags;
- atualizar o fork de forma controlada;
- testar a integração antes de incorporar novas versões.

### Crescimento excessivo das alterações no fork

Muitas alterações no núcleo podem dificultar a sincronização com o projeto original.

Mitigação:

- manter a lógica Smart-15 no plugin e no backend;
- evitar alterações desnecessárias no núcleo;
- documentar cada modificação realizada no fork.

### Critérios de validação

A decisão será considerada validada quando:

- o GeoLibre Web puder ser executado localmente;
- o plugin Smart-15 puder ser carregado;
- o plugin puder adicionar painéis e camadas;
- o plugin puder chamar a API Smart-15;
- os resultados da API puderem ser apresentados no mapa;
- a aplicação puder ser construída para implantação em servidor.

### Revisão da decisão

Esta decisão deve ser revisada caso:

- o GeoLibre deixe de atender aos requisitos essenciais;
- a API de plugins se torne inviável para o projeto;
- o custo de manutenção do fork supere o benefício de reutilização;
- seja definida uma nova plataforma institucional obrigatória.
