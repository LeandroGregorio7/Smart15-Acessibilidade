from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json
import geopandas as gpd
import pandas as pd
import numpy as np
import osmnx as ox
import networkx as nx
import rasterio
from rasterio.enums import Resampling, ColorInterp
from rasterio.warp import transform_bounds, transform_geom
from rasterio.mask import mask
from rasterio.env import Env
from rasterio.features import rasterize
from shapely.geometry import Point, Polygon, box, MultiPolygon
from app.settings import ALLOW_ORIGINS
import h3
import os
import zipfile
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
import warnings
from pyproj import Transformer
import logging
import traceback
import requests
import hashlib

import pystac_client
import planetary_computer
import stackstac
import rioxarray

BASE_DIR = Path(__file__).resolve().parent.parent

TEMP_DIR = BASE_DIR / "temp_export"

TEMP_DIR.mkdir(exist_ok=True)


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

warnings.filterwarnings("ignore", category=UserWarning, message="Geometry is in a geographic CRS")

app = FastAPI()

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "smart15-api"
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(TEMP_DIR, exist_ok=True)
app.mount("/temp", StaticFiles(directory=TEMP_DIR), name="temp")

try:
    from sklearn.tree import DecisionTreeClassifier
    SKLEARN_AVAILABLE = True
    logger.info("Scikit-learn carregado. IA (Decision Tree) Pronta.")
except ImportError:
    SKLEARN_AVAILABLE = False
    logger.warning("Scikit-learn ausente. IA desativada.")

# ========================================================
# DICIONÁRIO DE CORES (TEXTOS E NÚMEROS)
# ========================================================
CLASS_COLORS = {
    'asfalto': '#808080', 'estrada': '#808080', 'via': '#808080', '1': '#808080', '1.0': '#808080',
    'calçada': '#f44336', 'calcada': '#f44336', '2': '#f44336', '2.0': '#f44336',
    'faixa': '#ffffff', 'sinalização': '#ffffff', 'sinalizacao': '#ffffff',
    'construção': '#4682b4', 'construcao': '#4682b4', 'prédio': '#4682b4', 'predio': '#4682b4', 'telhado': '#4682b4', '3': '#4682b4', '3.0': '#4682b4',
    'muro': '#666666',
    'cerca': '#bebebe',
    'árvore': '#008000', 'arvore': '#008000', 'floresta': '#008000', 'árvores': '#008000', 'arvores': '#008000', 'mata': '#008000', '4': '#008000', '4.0': '#008000',
    'grama': '#7cfc00', 'vegetação': '#7cfc00', 'vegetacao': '#7cfc00', 'rasteira': '#7cfc00', 'pasto': '#7cfc00', '5': '#7cfc00', '5.0': '#7cfc00',
    'solo': '#bc8f8f', 'exposto': '#bc8f8f', 'terra': '#bc8f8f', 'areia': '#bc8f8f', '6': '#bc8f8f', '6.0': '#bc8f8f',
    'carro': '#0000ff', 'veiculo': '#0000ff',
    'caminhão': '#000046', 'caminhao': '#000046',
    'ônibus': '#003c64', 'onibus': '#003c64',
    'motocicleta': '#0000e6', 'moto': '#0000e6',
    'bicicleta': '#770b14', 'bike': '#770b14',
    'pedestre': '#ffcb00', 'pessoa': '#ffcb00',
    'ciclista': '#ff0000',
    'água': '#00ffff', 'agua': '#00ffff', 'rio': '#00ffff', 'lago': '#00ffff'
}

FALLBACK_COLORS = ['#e6194b', '#fabebe', '#ffe119', '#e6beff', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#008080', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075']

def get_color_for_class(cls_name):
    c_lower = str(cls_name).lower().strip()
    
    # 1. Tentar match direto com números (ex: '4')
    if c_lower in CLASS_COLORS:
        return CLASS_COLORS[c_lower]
        
    # 2. Tentar match parcial com texto
    for k, v in CLASS_COLORS.items():
        if not k.replace('.','',1).isdigit() and k in c_lower:
            return v
            
    hash_val = int(hashlib.md5(c_lower.encode('utf-8')).hexdigest(), 16)
    return FALLBACK_COLORS[hash_val % len(FALLBACK_COLORS)]

def preencher_buracos(geom):
    if geom.geom_type == 'Polygon': return Polygon(geom.exterior)
    elif geom.geom_type == 'MultiPolygon': return MultiPolygon([Polygon(p.exterior) for p in geom.geoms])
    return geom

def get_osm_pois(polygon, alvos):
    dfs = []
    tags_dict = {
        'escolas': {'amenity': ['school', 'kindergarten', 'college', 'university', 'childcare']},
        'hospitais': {'amenity': ['hospital', 'clinic', 'doctors', 'dentist', 'pharmacy']},
        'parques': {'leisure': ['park', 'pitch', 'playground', 'garden', 'recreation_ground']},
        'mercados': {'shop': ['supermarket', 'convenience', 'grocery', 'bakery', 'butcher']},
        'cultura': {'amenity': ['library', 'arts_centre', 'theatre', 'museum']},
        'comercio': {'shop': ['mall', 'department_store', 'clothes', 'shoes', 'hardware']},
        'academias': {'leisure': ['fitness_centre', 'sports_centre', 'stadium']}
    }
    for categoria in alvos:
        if categoria in tags_dict:
            try:
                df = ox.features_from_polygon(polygon, tags=tags_dict[categoria])
                if not df.empty:
                    df['geometry'] = df.geometry.centroid
                    df = df[df.geometry.type == 'Point'].copy()
                    df['categoria'] = categoria
                    dfs.append(df)
            except: pass
    if dfs: return gpd.clip(pd.concat(dfs, ignore_index=True), polygon)
    return gpd.GeoDataFrame()

def download_lst_pc(bbox, out_path):
    try:
        logger.info("NUVEM: Buscando LST no Microsoft Planetary Computer...")
        catalog = pystac_client.Client.open("https://planetarycomputer.microsoft.com/api/stac/v1", modifier=planetary_computer.sign_inplace)
        search = catalog.search(collections=["landsat-c2-l2"], bbox=bbox, query={"eo:cloud_cover": {"lt": 20}, "platform": {"eq": "landsat-9"}}, sortby=[{"field": "properties.datetime", "direction": "desc"}], limit=1)
        items = list(search.items()) 
        if not items: 
            logger.warning("NUVEM: LST não encontrado no Planetary Computer.")
            return False
        stack = stackstac.stack(items[0], assets=["lwir11"], bounds_latlon=bbox, epsg=4326)
        data = stack.compute().squeeze()
        if "time" in data.coords: data = data.drop_vars("time") 
        data.rio.to_raster(out_path)
        logger.info("NUVEM: Recorte de LST concluído com sucesso (Microsoft PC)!")
        return True
    except Exception as e: 
        logger.error(f"Erro no Planetary Computer (LST): {e}")
        return False

def baixar_raster_nuvem_stac(bbox, poly, colecao, out_path, tipo_asset):
    stac_url = "https://earth-search.aws.element84.com/v1/search"
    payload = {"bbox": bbox, "collections": [colecao], "limit": 1}
    if colecao in ["landsat-c2-l2", "sentinel-2-l2a"]:
        payload["sortby"] = [{"field": "properties.datetime", "direction": "desc"}]
        payload["query"] = {"eo:cloud_cover": {"lt": 15}}
    try:
        logger.info(f"NUVEM: Buscando {tipo_asset} ({colecao}) na AWS...")
        res = requests.post(stac_url, json=payload, timeout=15).json()
        if not res.get("features"): return False
        assets = res["features"][0]["assets"]
        key = "data" if tipo_asset == "dem" else "visual"
        if key not in assets:
            key = [k for k in assets.keys() if "data" in k or "visual" in k][0]
        remote_url = assets[key]["href"]
        with Env(AWS_NO_SIGN_REQUEST='YES'):
            with rasterio.open(remote_url) as src:
                poly_reprojetado = transform_geom('EPSG:4326', src.crs, poly.__geo_interface__)
                out_image, out_transform = mask(src, [poly_reprojetado], crop=True)
                out_meta = src.meta.copy()
                out_meta.update({"driver": "GTiff", "height": out_image.shape[1], "width": out_image.shape[2], "transform": out_transform})
                with rasterio.open(out_path, "w", **out_meta) as dest: dest.write(out_image)
        logger.info(f"NUVEM: Recorte de {tipo_asset} concluído com sucesso!")
        return True
    except Exception as e:
        logger.error(f"NUVEM: Falha ao extrair {tipo_asset}: {e}")
        return False

def tiff_to_png(tif_path, colormap, out_name, is_rgb=False):
    try:
        with rasterio.open(tif_path) as src:
            scale = min(1024 / src.width, 1024 / src.height)
            if scale > 1: scale = 1.0 
            out_shape = (src.count, int(src.height * scale), int(src.width * scale))
            data = src.read(out_shape=out_shape, resampling=Resampling.cubic)
            bounds = src.bounds
            crs = src.crs
            if crs and crs.to_string() != 'EPSG:4326': left, bottom, right, top = transform_bounds(crs, 'EPSG:4326', bounds.left, bounds.bottom, bounds.right, bounds.top)
            else: left, bottom, right, top = bounds.left, bounds.bottom, bounds.right, bounds.top

            vmin, vmax = 0, 1
            if is_rgb and src.count >= 3:
                img_data = np.transpose(data[:3, :, :], (1, 2, 0)).astype(np.float32)
                p2, p98 = np.nanpercentile(img_data[img_data > 0], [2, 98])
                if p98 > p2:
                    img_data = np.clip(img_data, p2, p98)
                    img_data = (img_data - p2) / (p98 - p2)
                plt.imsave(f"temp_export/{out_name}.png", img_data, format='png')
            else:
                nodata_val = src.nodata
                img_data = np.ma.masked_equal(data[0], nodata_val) if nodata_val is not None else np.ma.masked_less(data[0], -999)
                valid_data = img_data.compressed() if np.ma.isMaskedArray(img_data) else img_data[np.isfinite(img_data)]
                if len(valid_data) > 0: vmin, vmax = np.nanpercentile(valid_data, [2, 98])
                plt.imsave(f"temp_export/{out_name}.png", img_data, cmap=colormap, format='png', vmin=vmin, vmax=vmax)
            
            return {"url": f"/temp/{out_name}.png", "coordinates": [[left, top], [right, top], [right, bottom], [left, bottom]], "min": float(vmin), "max": float(vmax)}
    except Exception as e: return None

def matrix_to_png(matrix, bounds, crs, colormap, out_name, is_categorical=False):
    try:
        img_data = np.ma.masked_invalid(matrix.astype(float))
        if is_categorical:
            vmin, vmax = 0, max(1, len(colormap.colors) - 1)
        else:
            valid_data = img_data.compressed() if np.ma.isMaskedArray(img_data) else img_data[np.isfinite(img_data)]
            if len(valid_data) > 0: vmin, vmax = np.nanpercentile(valid_data, [2, 98])
            else: vmin, vmax = 0, 1
            if vmin >= vmax: vmax = vmin + 0.1
        
        plt.imsave(f"temp_export/{out_name}.png", img_data, cmap=colormap, format='png', vmin=vmin, vmax=vmax)
        if crs and crs.to_string() != 'EPSG:4326': left, bottom, right, top = transform_bounds(crs, 'EPSG:4326', bounds.left, bounds.bottom, bounds.right, bounds.top)
        else: left, bottom, right, top = bounds.left, bounds.bottom, bounds.right, bounds.top
        return {"url": f"/temp/{out_name}.png", "coordinates": [[left, top], [right, top], [right, bottom], [left, bottom]], "min": float(vmin), "max": float(vmax)}
    except Exception as e:
        logger.error(f"Erro em matrix_to_png ({out_name}): {e}")
        return None

def create_hex_grid(poly, res=10):
    try: latlng_to_cell, cell_to_boundary = h3.latlng_to_cell, h3.cell_to_boundary
    except AttributeError: latlng_to_cell, cell_to_boundary = h3.geo_to_h3, h3.h3_to_geo_boundary
    minx, miny, maxx, maxy = poly.bounds
    step = 0.0005 
    cells = set()
    for lat in np.arange(miny - step, maxy + step, step):
        for lon in np.arange(minx - step, maxx + step, step): cells.add(latlng_to_cell(lat, lon, res))
    hex_polygons = []
    for c in cells:
        try:
            boundary = cell_to_boundary(c)
            hex_poly = Polygon([(lng, lat) for lat, lng in boundary])
            if poly.intersects(hex_poly): hex_polygons.append(hex_poly)
        except: pass
    return gpd.GeoDataFrame(geometry=hex_polygons, crs="EPSG:4326")

@app.post("/simular")
async def simular_urbana(
    dados: str = Form(...), file_veg: UploadFile = File(None), file_temp: UploadFile = File(None),
    file_dem: UploadFile = File(None), file_limite: UploadFile = File(None), file_samples: UploadFile = File(None)
):
    try:
        pacote = json.loads(dados)
        bbox = pacote.get('bbox')
        perfis, alvos = pacote.get('perfis', []), pacote.get('alvos', [])
        formatos_saida, vis_formatos = pacote.get('formatos_export', ['shp', 'geojson']), pacote.get('formatos', ['hexagonos', 'isocronas'])
        modo_temp = pacote.get('modo_temp', 'manual')
        
        logger.info(f"--- Iniciando Nova Simulação Urbana ---")
        
        for f in os.listdir("temp_export"):
            if any(f.endswith(ext) for ext in ['.png', '.shp', '.geojson', '.kml', '.zip', '.shx', '.dbf', '.prj', '.tif']): os.remove(os.path.join("temp_export", f))

        if file_limite:
            gdf_limite = gpd.read_file(file_limite.file)
            gdf_limite.to_crs("EPSG:4326", inplace=True)
            poly = gdf_limite.geometry.unary_union.buffer(0)
        else: poly = box(bbox[0], bbox[1], bbox[2], bbox[3]).buffer(0)

        poly_expanded = poly.buffer(0.01)
        bbox_expanded = poly_expanded.bounds

        mask_geojson = gpd.GeoSeries([box(-180, -85, 180, 85).difference(poly)]).__geo_interface__
        rasters_vis = {}
        import time; t_stamp = str(int(time.time()))
        
        if file_dem:
            with open(TEMP_DIR / "dem.tif", "wb") as f: f.write(file_dem.file.read())
        else: baixar_raster_nuvem_stac(bbox_expanded, poly_expanded, "cop-dem-glo-30", TEMP_DIR / "dem.tif", "dem")
            
        if file_veg:
            with open(TEMP_DIR / "veg.tif", "wb") as f: f.write(file_veg.file.read())
        else: baixar_raster_nuvem_stac(bbox_expanded, poly_expanded, "sentinel-2-l2a", TEMP_DIR / "veg.tif", "veg")

        if file_temp:
            with open(TEMP_DIR / "lst.tif", "wb") as f: f.write(file_temp.file.read())
        elif modo_temp == 'auto_pc':
            download_lst_pc(bbox_expanded, TEMP_DIR / "lst.tif")

        # ==========================================
        # 1. LST
        if os.path.exists(TEMP_DIR / "lst.tif"):
            try:
                with rasterio.open(TEMP_DIR / "lst.tif") as src:
                    sc = min(1024 / src.width, 1024 / src.height)
                    if sc > 1: sc = 1.0
                    lst_data = src.read(1, out_shape=(int(src.height * sc), int(src.width * sc)), resampling=Resampling.cubic).astype(float)
                    if src.nodata is not None: lst_data[lst_data == src.nodata] = np.nan
                    lst_data[lst_data < -999] = np.nan; lst_data[lst_data == 0] = np.nan 

                    if np.nanmax(lst_data) > 1000: lst_data = (lst_data * 0.00341802) + 149.0 - 273.15
                    r_vis = matrix_to_png(lst_data, src.bounds, src.crs, 'hot', f'lst_{t_stamp}')
                    if r_vis: 
                        r_vis['cmap_css'] = 'linear-gradient(to right, #0b0000, #d30000, #ff5b00, #fffa00, #ffffff)'
                        rasters_vis['LST (Calor)'] = r_vis
            except Exception as e: logger.error(f"Erro LST: {e}")

        # 2. DEM e DECLIVIDADE
        if os.path.exists(TEMP_DIR / "dem.tif"):
            r_vis = tiff_to_png(TEMP_DIR / "dem.tif", 'nipy_spectral', f'dem_{t_stamp}')
            if r_vis: 
                r_vis['cmap_css'] = 'linear-gradient(to right, #000000, #a000a0, #0000ff, #00a000, #00ff00, #ffff00, #ff0000, #e0e0e0, #ffffff)'
                rasters_vis['DEM (Relevo)'] = r_vis
            try:
                with rasterio.open(TEMP_DIR / "dem.tif") as src:
                    sc = min(1024 / src.width, 1024 / src.height)
                    if sc > 1: sc = 1.0
                    dem_data = src.read(1, out_shape=(int(src.height * sc), int(src.width * sc)), resampling=Resampling.cubic).astype(float)
                    if src.nodata is not None: dem_data[dem_data == src.nodata] = np.nan
                    dem_data[dem_data < -9999] = np.nan; dem_data[dem_data == 0] = np.nan 
                    
                    lat_rad = np.radians(poly.centroid.y)
                    res_x_m = max(abs(src.res[0] * 111320.0 * np.cos(lat_rad)), 1.0) if src.crs.to_string() == 'EPSG:4326' else max(abs(src.res[0]), 1.0)
                    res_y_m = max(abs(src.res[1] * 111320.0), 1.0) if src.crs.to_string() == 'EPSG:4326' else max(abs(src.res[1]), 1.0)
                    
                    dy, dx = np.gradient(dem_data, res_y_m, res_x_m)
                    slope_matrix = np.sqrt(dx**2 + dy**2) 
                    slope_matrix[np.isnan(dem_data)] = np.nan 
                    
                    sm_vis = matrix_to_png(np.clip(slope_matrix, 0, 0.5) * 100, src.bounds, src.crs, 'plasma', f'slope_{t_stamp}')
                    if sm_vis: 
                        sm_vis['cmap_css'] = 'linear-gradient(to right, #0d0887, #7e03a8, #cc4678, #f89441, #f0f921)'
                        rasters_vis['Declividade (%)'] = sm_vis
            except Exception as e: logger.error(f"Erro no DEM: {e}")

        rf_model = None; tree_classes = []

        # 3. NGRDI E IA (COM RECONHECIMENTO DA CLASSE 4)
        if os.path.exists(TEMP_DIR / "veg.tif"):
            r_vis = tiff_to_png(TEMP_DIR / "veg.tif", 'YlGn', f'veg_{t_stamp}', is_rgb=True)
            if r_vis: rasters_vis['Ortofoto'] = r_vis
            try:
                with rasterio.open(TEMP_DIR / "veg.tif") as src:
                    sc = min(1024 / src.width, 1024 / src.height)
                    if sc > 1: sc = 1.0
                    
                    out_h, out_w = int(src.height * sc), int(src.width * sc)
                    veg_data = src.read(out_shape=(src.count, out_h, out_w), resampling=Resampling.bilinear)
                    veg_float = veg_data.astype(float)
                    
                    soma = veg_float[1] + veg_float[0]
                    idx_matrix = np.divide((veg_float[1] - veg_float[0]), soma, out=np.zeros_like(soma), where=soma!=0)
                    bg_mask = (veg_float[0] == 0) & (veg_float[1] == 0) & (veg_float[2] == 0)
                    idx_matrix[bg_mask] = np.nan
                    
                    idx_vis = matrix_to_png(idx_matrix, src.bounds, src.crs, 'RdYlGn', f'index_{t_stamp}')
                    if idx_vis: 
                        idx_vis['cmap_css'] = 'linear-gradient(to right, #a50026, #f46d43, #fee08b, #d9ef8b, #66bd63, #006837)'
                        rasters_vis['Índice NGRDI'] = idx_vis
            except Exception as e: logger.error(f"Erro NGRDI: {e}")

            if file_samples and SKLEARN_AVAILABLE:
                try:
                    logger.info("IA: Iniciando treinamento do modelo OBIA Avançado...")
                    with open(TEMP_DIR / "samples.geojson", "wb") as f: f.write(file_samples.file.read())
                    samples_gdf = gpd.read_file(TEMP_DIR / "samples.geojson")

                    with rasterio.open(TEMP_DIR / "veg.tif") as veg_src:
                        samples_gdf = samples_gdf.to_crs(veg_src.crs)
                        
                        col_name = next((c for c in samples_gdf.columns if c.lower() in ['class', 'classe', 'id', 'nome', 'tipo', 'label']), None)
                        
                        if col_name:
                            unique_classes = []
                            class_to_id = {}
                            shapes = []
                            
                            for idx, row in samples_gdf.iterrows():
                                c = row[col_name]
                                if pd.notna(c) and str(c).strip() not in ["", "nan", "None", "NaN"]:
                                    c_str = str(c).strip()
                                    if c_str not in unique_classes:
                                        unique_classes.append(c_str)
                                        class_to_id[c_str] = len(unique_classes)
                                        
                                        # GARANTIR QUE A CLASSE 4 SEJA CONSIDERADA ÁRVORE
                                        if any(k in c_str.lower() for k in ['arv', 'tree', 'veg', 'florest', 'mata', 'verde', '4', '4.0']):
                                            if c_str not in tree_classes: tree_classes.append(c_str)
                                    
                                    geom = row.geometry
                                    if geom is not None and not geom.is_empty:
                                        shapes.append((geom, class_to_id[c_str]))

                            if shapes:
                                out_transform = rasterio.transform.from_bounds(*src.bounds, out_w, out_h)
                                mask_arr = rasterize(shapes, out_shape=(out_h, out_w), transform=out_transform, fill=0, dtype='int16')

                                train_mask = mask_arr > 0
                                if np.any(train_mask):
                                    bands = veg_data.shape[0]
                                    X_train = veg_data[:, train_mask].T
                                    y_train_ids = mask_arr[train_mask]

                                    valid_pixels = ~np.all(X_train == 0, axis=1) & ~np.isnan(X_train).any(axis=1)
                                    X_train = X_train[valid_pixels]
                                    y_train_ids = y_train_ids[valid_pixels]

                                    if len(X_train) > 0:
                                        rf_model = DecisionTreeClassifier(max_depth=20, random_state=42).fit(X_train, y_train_ids)
                                        logger.info(f"IA: Modelo treinado massivamente com {len(X_train)} pixéis válidos.")

                                        flat_data = np.nan_to_num(veg_data.reshape(bands, -1).T)
                                        preds_ids = rf_model.predict(flat_data)

                                        num_preds = (preds_ids - 1).reshape((out_h, out_w)).astype(float)
                                        num_preds[bg_mask] = np.nan 

                                        ia_colors = [get_color_for_class(c) for c in unique_classes]
                                        cmap_custom = ListedColormap(ia_colors)

                                        cl_vis = matrix_to_png(num_preds, src.bounds, src.crs, cmap_custom, f'class_{t_stamp}', is_categorical=True)
                                        if cl_vis:
                                            cl_vis['legend'] = {c: get_color_for_class(c) for c in unique_classes}
                                            rasters_vis['Classificação IA (OBIA)'] = cl_vis
                        else:
                            logger.error("Coluna alvo para a IA não encontrada nas amostras.")
                except Exception as e: logger.error(f"Erro na IA: {e}")

        # ==========================================
        # 4. MALHA VIÁRIA E EQUAÇÃO DE TOBLER
        # ==========================================
        try: G = ox.graph_from_polygon(poly_expanded, network_type='all'); G_proj = ox.project_graph(G) 
        except: return {"status": "erro", "mensagem": "Erro na malha OSM."}

        center_node = ox.distance.nearest_nodes(G, X=poly.centroid.x, Y=poly.centroid.y)
        
        dem_src = rasterio.open(TEMP_DIR / "dem.tif") if os.path.exists(TEMP_DIR / "dem.tif") else None
        lst_src = rasterio.open(TEMP_DIR / "lst.tif") if os.path.exists(TEMP_DIR / "lst.tif") else None
        veg_src = rasterio.open(TEMP_DIR / "veg.tif") if os.path.exists(TEMP_DIR / "veg.tif") else None

        trans_dem = Transformer.from_crs(G_proj.graph['crs'], dem_src.crs, always_xy=True) if dem_src else None
        trans_lst = Transformer.from_crs(G_proj.graph['crs'], lst_src.crs, always_xy=True) if lst_src else None
        trans_veg = Transformer.from_crs(G_proj.graph['crs'], veg_src.crs, always_xy=True) if veg_src else None

        if dem_src:
            for n, data in G_proj.nodes(data=True):
                try:
                    x, y = trans_dem.transform(data['x'], data['y'])
                    val = list(dem_src.sample([(x, y)]))[0][0]
                    data['z'] = val if val > -9999 and val != 0 and val != dem_src.nodata else np.nan
                except: data['z'] = np.nan

        for u, v, k, data in G_proj.edges(keys=True, data=True):
            length = data['length']
            z_u = G_proj.nodes[u].get('z', 0)
            z_v = G_proj.nodes[v].get('z', 0)
            z_u = 0 if np.isnan(z_u) else z_u
            z_v = 0 if np.isnan(z_v) else z_v
            
            if dem_src and length > 0:
                slope_val = (z_v - z_u) / length
                data['slope'] = np.clip(slope_val, -0.3, 0.3)
            else:
                data['slope'] = 0

            mid_x, mid_y = (G_proj.nodes[u]['x'] + G_proj.nodes[v]['x']) / 2, (G_proj.nodes[u]['y'] + G_proj.nodes[v]['y']) / 2

            data['lst'] = 25.0
            if lst_src:
                try:
                    x, y = trans_lst.transform(mid_x, mid_y)
                    val = list(lst_src.sample([(x, y)]))[0][0]
                    if not np.isnan(val) and val > -999 and val != lst_src.nodata and val != 0:
                        if val > 1000: val = (val * 0.00341802) + 149.0 - 273.15
                        elif 200 < val < 350: val = val - 273.15 
                        data['lst'] = np.clip(val, 10, 50)
                except: pass

            data['fis'] = 1.0
            if veg_src:
                try:
                    x, y = trans_veg.transform(mid_x, mid_y)
                    bands = list(veg_src.sample([(x, y)]))[0].astype(float)
                    if not np.any(np.isnan(bands)) and not np.all(bands == 0):
                        soma = bands[1] + bands[0]
                        idx_val = (bands[1] - bands[0]) / soma if soma != 0 else 0
                        if rf_model:
                            pred_id = rf_model.predict([bands])[0]
                            cls_name = unique_classes[int(pred_id)-1] if 0 < int(pred_id) <= len(unique_classes) else ""
                            data['fis'] = 0.4 if cls_name in tree_classes else 1 - (np.clip(idx_val, 0, 1) * 0.3)
                        else: data['fis'] = 1 - (np.clip(idx_val, 0, 1) * 0.3)
                except: pass

        if dem_src: dem_src.close()
        if lst_src: lst_src.close()
        if veg_src: veg_src.close()

        simulacoes_geojsons = []
        time_bands = [2, 5, 10, 15]
        
        for perfil in perfis:
            speed_kmh, slope_mult, lst_limit, lst_scale = 4.5, 3.5, 25.0, 10.0
            if "bike" in perfil or "ciclista" in perfil: speed_kmh = 11.0 if "crianca" in perfil else 10.0 if "idoso" in perfil else 15.0; slope_mult = 4.0 
            else: speed_kmh = 3.5 if "crianca" in perfil else 3.0 if "idoso" in perfil else 4.5
            if "crianca" in perfil or "idoso" in perfil: lst_limit, lst_scale = 23.0, 8.0; slope_mult = 4.5 if "pedestre" in perfil else 4.0

            speed_m_min = (speed_kmh * 1000) / 60

            for u, v, k, data in G_proj.edges(keys=True, data=True):
                fid = np.exp(-slope_mult * np.abs(data['slope'] + 0.05))
                fit_lst = 1 + max(0, (data['lst'] - lst_limit) / lst_scale)
                fit = fit_lst * data['fis']
                
                eff_speed = speed_m_min * fid / fit
                if np.isnan(eff_speed) or eff_speed < 0.1: eff_speed = 0.1 
                
                data[f'time_{perfil}'] = data['length'] / eff_speed

            features_iso, polys_by_time = [], {}
            for t in sorted(time_bands):
                subgraph = nx.ego_graph(G_proj, center_node, radius=t, distance=f'time_{perfil}')
                iso_poly_proj = ox.graph_to_gdfs(subgraph, nodes=False).unary_union.buffer(80) if len(subgraph.edges) > 0 else Point(G_proj.nodes[center_node]['x'], G_proj.nodes[center_node]['y']).buffer(80)
                polys_by_time[t] = preencher_buracos(iso_poly_proj)

            previous_poly = Polygon()
            for t in sorted(time_bands):
                current_poly = polys_by_time[t]
                ring = current_poly.difference(previous_poly)
                if not ring.is_empty: 
                    ring_clipped = gpd.GeoDataFrame(geometry=[ring], crs=G_proj.graph['crs']).to_crs("EPSG:4326").geometry.iloc[0].buffer(0).intersection(poly)
                    if not ring_clipped.is_empty:
                        nome_perfil = perfil.replace('_', ' ').title()
                        if ring_clipped.geom_type == 'MultiPolygon':
                            for p in ring_clipped.geoms: features_iso.append({"perfil": nome_perfil, "tipo": "isocronas", "time_band": t, "geometry": p})
                        else: features_iso.append({"perfil": nome_perfil, "tipo": "isocronas", "time_band": t, "geometry": ring_clipped})
                previous_poly = current_poly

            if features_iso:
                gdf_mapped = gpd.GeoDataFrame(features_iso, crs="EPSG:4326")
                union_mapped = gdf_mapped.unary_union
                rest_poly = poly.difference(union_mapped)
            else: rest_poly = poly
            
            if not rest_poly.is_empty and rest_poly.area > 1e-7:
                nome_perfil = perfil.replace('_', ' ').title()
                if rest_poly.geom_type == 'MultiPolygon':
                    for p in rest_poly.geoms: features_iso.append({"perfil": nome_perfil, "tipo": "isocronas", "time_band": 30, "geometry": p})
                else: features_iso.append({"perfil": nome_perfil, "tipo": "isocronas", "time_band": 30, "geometry": rest_poly})

            gdf_iso = gpd.GeoDataFrame(features_iso, crs="EPSG:4326")
            
            def export_gdf(gdf, base_name):
                if 'shp' in formatos_saida: gdf.to_file(f"temp_export/{base_name}.shp", driver='ESRI Shapefile')
                if 'geojson' in formatos_saida: gdf.to_file(f"temp_export/{base_name}.geojson", driver='GeoJSON')
                if 'kml' in formatos_saida:
                    try: gpd.io.file.fiona.drvsupport.supported_drivers['KML'] = 'rw'; gdf.to_file(f"temp_export/{base_name}.kml", driver='KML')
                    except: pass
            
            if 'isocronas' in vis_formatos and not gdf_iso.empty:
                simulacoes_geojsons.append(gdf_iso.to_json()); export_gdf(gdf_iso, f"isocronas_{perfil}")
            if 'hexagonos' in vis_formatos and not gdf_iso.empty:
                hex_grid = create_hex_grid(poly, res=10)
                hex_grid['time_band'], hex_grid['perfil'], hex_grid['tipo'] = 999, nome_perfil, 'hexagonos'
                for idx, row in gdf_iso.iterrows():
                    t = row['time_band']
                    intersecting = hex_grid.geometry.intersects(row['geometry'])
                    hex_grid.loc[intersecting & (hex_grid['time_band'] > t), 'time_band'] = t
                
                hex_grid.loc[hex_grid['time_band'] == 999, 'time_band'] = 30
                if not hex_grid.empty: simulacoes_geojsons.append(hex_grid.to_json()); export_gdf(hex_grid, f"hexagonos_{perfil}")

        gdf_pois = get_osm_pois(poly, alvos)
        if not gdf_pois.empty:
            gdf_pois_clean = gdf_pois[[c for c in ['categoria', 'geometry'] if c in gdf_pois.columns]]
            geojson_osm = gdf_pois_clean.to_json(); export_gdf(gdf_pois_clean, "equipamentos_osm")
        else: geojson_osm = "{}"

        with zipfile.ZipFile("exportacao_smart15.zip", 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk("temp_export"):
                for file in files: zipf.write(os.path.join(root, file), file)

        logger.info("Simulação concluída com sucesso.")
        return {
            "status": "sucesso", 
            "data": {
                "simulacoes": simulacoes_geojsons, "osm_targets": geojson_osm, "bbox_rasters": bbox,
                "rasters_vis": rasters_vis, "mask_geojson": json.dumps(mask_geojson),
                "download_url": "/download_zip"
            }
        }
    except Exception as e:
        logger.error(f"Erro fatal: {e}"); logger.error(traceback.format_exc())
        return {"status": "erro", "mensagem": str(e)}

@app.get("/download_zip")
async def download_zip(): return FileResponse("exportacao_smart15.zip", media_type="application/zip", filename="Resultados_Smart15.zip", headers={"Content-Disposition": "attachment; filename=Resultados_Smart15.zip"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
