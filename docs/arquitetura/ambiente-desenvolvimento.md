# Ambiente de desenvolvimento

## GeoLibre

Construção da imagem:

```bash
docker build -t smart15-geolibre:dev ./geolibre
```

Execução:

```bash
docker run --rm -p 8080:80 smart15-geolibre:dev
```

Acesso:

<http://localhost:8080>
