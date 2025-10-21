import pandas as pd
import requests
import joblib
import numpy as np
from sklearn.preprocessing import StandardScaler
import os
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns
import hdbscan  # Importa o HDBSCAN

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
    """Pré-processa os dados, removendo valores nulos."""
    print("Iniciando pré-processamento...")

    numeric_features = ['current', 'rpm', 'oilTemperature', 'oilLevel']

    # Mantém apenas as colunas relevantes
    df = df[numeric_features].copy()

    # Remove valores infinitos e NaN
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    before = len(df)
    df.dropna(subset=numeric_features, inplace=True)
    after = len(df)

    print(f"Linhas removidas por conter valores nulos: {before - after}")
    print(f"Total de amostras restantes: {after}")

    # Normaliza os dados
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df)

    print(f"Dimensões finais de entrada: {X_scaled.shape}")
    return X_scaled, scaler, df

def train_and_save_model(X_scaled, scaler):
    """Treina o modelo HDBSCAN e salva os artefatos."""
    print("Iniciando o treinamento do modelo HDBSCAN...")

    hdb = hdbscan.HDBSCAN(
        min_cluster_size=30,
        min_samples=10,
        cluster_selection_epsilon=1.5,
        metric='euclidean',
        allow_single_cluster=True,
        prediction_data=True
    )

    hdb.fit(X_scaled)

    version_timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = f"artifacts/{version_timestamp}"
    os.makedirs(output_dir, exist_ok=True)
    
    joblib.dump(scaler, f"{output_dir}/scaler.joblib")
    joblib.dump(hdb, f"{output_dir}/model.joblib")
    
    print(f"Artefatos da versão {version_timestamp} salvos em '{output_dir}'.")
    return hdb

def analyze_results(df, model):
    """Analisa e imprime os resultados do clustering."""
    labels = model.labels_
    n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
    n_noise = list(labels).count(-1)
    
    print("\n--- Análise dos Resultados ---")
    print(f"Número de regimes (clusters) descobertos: {n_clusters}")
    print(f"Número de pontos anômalos (ruído): {n_noise}")
    
    df['cluster'] = labels

    print("\nAssinatura média de cada regime:")
    print(df.groupby('cluster').mean(numeric_only=True))
    

    # Visualização
    plt.figure(figsize=(12, 8))
    sns.scatterplot(data=df, x='rpm', y='current', hue='cluster', palette='viridis', s=60)
    plt.title("Clusters detectados pelo HDBSCAN")
    plt.xlabel("RPM")
    plt.ylabel("Corrente (A)")
    plt.show()

def main():
    """Executa o pipeline completo."""
    end_date = datetime.utcnow().strftime("%Y-%m-%d")
    start_date = (datetime.utcnow() - timedelta(days=7)).strftime("%Y-%m-%d")

    df = fetch_data_from_api(MACHINE_ID, start_date, end_date)
    if df is None:
        return

    X_scaled, scaler, df_clean = preprocess_data(df)
    model = train_and_save_model(X_scaled, scaler)
    analyze_results(df_clean, model)



if __name__ == "__main__":
    main()
