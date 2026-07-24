# Funcionalidades do Smart15

## Simulação de acessibilidade

O Smart15 permite realizar simulações para diferentes perfis de mobilidade, incluindo deslocamentos:

- a pé;
- de bicicleta;
- por adultos;
- por crianças;
- por idosos.

Os parâmetros de velocidade e tolerância ambiental podem variar conforme o perfil selecionado.

## Análise de destinos urbanos

A plataforma permite avaliar o acesso a diferentes categorias de serviços e equipamentos, como:

- escolas e creches;
- hospitais e clínicas;
- mercados e padarias;
- parques e áreas verdes;
- equipamentos culturais;
- comércio e serviços;
- academias e equipamentos esportivos.

## Declividade e relevo

O relevo pode ser obtido a partir de modelos digitais de elevação, incluindo dados Copernicus DEM.

A declividade é incorporada ao cálculo de deslocamento para representar o impacto de subidas e descidas sobre a velocidade de pedestres e ciclistas.

## Temperatura da superfície

A solução pode obter dados de temperatura da superfície por meio do Microsoft Planetary Computer e de imagens Landsat.

Esses dados auxiliam na identificação de regiões com maior exposição térmica e na estimativa de seu impacto sobre o conforto do deslocamento.

## Cobertura vegetal

A cobertura vegetal pode ser estimada com base em imagens de satélite ou em ortofotos fornecidas pelo usuário.

O processamento permite classificar elementos da cobertura do solo e incorporar o efeito potencial de vegetação e sombreamento à análise.

## Upload de dados

A aplicação oferece suporte à inclusão de dados próprios, incluindo:

- arquivos GeoJSON;
- amostras para classificação;
- ortofotos;
- geometrias de áreas de estudo.

## Isócronas e agregações espaciais

Os resultados podem ser representados por:

- isócronas de tempo de deslocamento;
- grades hexagonais;
- áreas acessíveis em até 15 minutos;
- áreas com penalidade ou baixa acessibilidade.

## Visualização interativa

A interface permite:

- ativar e desativar camadas;
- inspecionar feições no mapa;
- consultar classes e indicadores;
- visualizar dados ambientais;
- comparar cenários;
- utilizar visualização 3D quando disponível;
- capturar o mapa da análise.

## Exportação de resultados

Os resultados podem ser exportados em formatos geoespaciais, incluindo:

- GeoJSON;
- Shapefile;
- KML;
- arquivo ZIP com os produtos gerados.

## Relatório técnico automatizado

Ao final da simulação, a plataforma gera um relatório com:

- identificação da área analisada;
- mapa da simulação;
- resumo executivo;
- indicadores de acessibilidade;
- interpretação dos principais fatores;
- avaliação de declividade, temperatura e vegetação;
- recomendações para apoio à decisão;
- informações sobre os perfis e parâmetros utilizados.
