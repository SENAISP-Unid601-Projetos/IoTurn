import pandas as pd
import requests
import joblib
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
from sklearn.impute import SimpleImputer
import os
from datetime import datetime,timedelta
from sklearn.neighbors import NearestNeighbors
import matplotlib.pyplot as plt
import seaborn as sns
# --- 1. CONFIGURAÇÕES ---
API_BASE_URL = "http://localhost:3000"
MACHINE_ID = 1

def fetch_data_from_api(machine_id, start_date, end_date):
    """Busca e carrega os dados de treinamento via API."""
    endpoint = f"{API_BASE_URL}/unifiedMachines/state/{machine_id}/{start_date}/{end_date}"
    print(f"Buscando dados da API em: {endpoint}")
    try:
        response = requests.get(endpoint, timeout=300)
        response.raise_for_status()
        df = pd.DataFrame(response.json())
        if df.empty:
            print("A API retornou dados vazios. Encerrando o treinamento.")
            return None
        print(f"{len(df)} registros carregados com sucesso.")
        return df
    except requests.exceptions.RequestException as e:
        print(f"Erro ao buscar dados da API: {e}")
        return None

def preprocess_data(df):
    """Prepara os dados, tratando valores ausentes e aplicando flags."""
    print("Iniciando pré-processamento...")
    numeric_features = ['current', 'rpm', 'oilTemperature', 'oilLevel']
    flag_features = ['currentIsMissing', 'rpmIsMissing', 'oilTemperatureIsMissing', 'oilLevelIsMissing']
    
    imputer = SimpleImputer(strategy='mean')
    df_imputed_numeric = imputer.fit_transform(df[numeric_features])
    df_flags = df[flag_features].astype(int).values
    X_final = np.concatenate([df_imputed_numeric, df_flags], axis=1)
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_final)

    # Calcula a distância de cada ponto para seus 20 vizinhos mais próximos
    #neighbors = NearestNeighbors(n_neighbors=20)
    #neighbors_fit = neighbors.fit(X_scaled)
    #distances, indices = neighbors_fit.kneighbors(X_scaled)

    # Ordena as distâncias e plota
    #distances = np.sort(distances, axis=0)
    #distances = distances[:,1]
    #plt.plot(distances)
    #plt.title('K-distance Graph')
    #plt.xlabel('Pontos de Dados Ordenados por Distância')
    #plt.ylabel('Distância para o 20º Vizinho (eps)')
    #plt.grid(True)
    #plt.show() # Isso vai abrir uma janela com o gráfico
    
    return X_scaled, imputer, scaler

def train_and_save_model(X_scaled, imputer, scaler):
    """Treina o modelo DBSCAN e salva todos os artefatos com versionamento."""
    print("Iniciando o treinamento do modelo DBSCAN...")
    dbscan = DBSCAN(eps=1.5, min_samples=20)
    dbscan.fit(X_scaled)
    
    version_timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = f"artifacts/{version_timestamp}"
    os.makedirs(output_dir, exist_ok=True)
    
    joblib.dump(imputer, f"{output_dir}/imputer.joblib")
    joblib.dump(scaler, f"{output_dir}/scaler.joblib")
    joblib.dump(dbscan, f"{output_dir}/model.joblib")
    
    print(f"Artefatos da versão {version_timestamp} salvos em '{output_dir}'.")
    return dbscan

def analyze_results(df, model, features):
    """Analisa e imprime os resultados do clustering."""
    labels = model.labels_
    n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
    n_noise = list(labels).count(-1)
    
    print("\n--- Análise dos Resultados ---")
    print(f"Número de regimes (clusters) descobertos: {n_clusters}")
    print(f"Número de pontos anômalos (ruído) encontrados: {n_noise}")
    
    df['cluster'] = labels
    print("Assinatura média de cada regime:")
    print(df.groupby('cluster')[features].mean())

    print("\nVisualizando os clusters...")
    # Criamos um gráfico de dispersão (scatter plot)
    # Usando seaborn para um visual mais agradável e legenda automática
    plt.figure(figsize=(12, 8)) # Aumenta o tamanho da figura
    sns.scatterplot(data=df, x='rpm', y='current', hue='cluster', palette='viridis', s=50) # s=50 aumenta o tamanho dos pontos
    plt.title('Visualização dos Clusters (RPM vs. Corrente)')
    plt.xlabel('RPM (Rotações por Minuto)')
    plt.ylabel('Corrente (Amperes)')
    plt.grid(True)
    plt.legend(title='Cluster ID')
    plt.show()

# --- BLOCO PRINCIPAL DE EXECUÇÃO ---
if __name__ == "__main__":
    # Define o período de treinamento (ex: últimos 10 dias)
    end_date_str = '2025-10-10 23:59:59.554+00:00'
    start_date_str = (datetime.now() - timedelta(days=10)).strftime('%Y-%m-%dT%H:%M:%SZ')

    # 1. Carregar Dados
    dataframe = fetch_data_from_api(MACHINE_ID, start_date_str, end_date_str)
    
    if dataframe is not None:
        # 2. Pré-processar
        X_processed, imputer_obj, scaler_obj = preprocess_data(dataframe)
        
        # 3. Treinar e Salvar
        model_obj = train_and_save_model(X_processed, imputer_obj, scaler_obj)
        
        # 4. Analisar Resultados
        analyze_results(dataframe, model_obj, ['current', 'rpm', 'oilTemperature', 'oilLevel'])