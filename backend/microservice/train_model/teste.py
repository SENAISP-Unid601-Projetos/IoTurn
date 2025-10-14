# predict.py

import joblib
import pandas as pd
import numpy as np
import hdbscan
import os

# --- 1. FUNÇÕES PARA CARREGAR OS ARTEFATOS ---

def find_latest_artifacts(artifacts_dir="artifacts"):
    """Encontra os caminhos para o scaler e o modelo mais recentes."""
    try:
        # Lista todos os subdiretórios (versões) na pasta de artefatos
        all_versions = os.listdir(artifacts_dir)
        all_versions.sort() # Ordena para que a versão mais recente fique por último
        
        latest_version_dir = all_versions[-1]
        
        scaler_path = os.path.join(artifacts_dir, latest_version_dir, "scaler.joblib")
        model_path = os.path.join(artifacts_dir, latest_version_dir, "model.joblib")
        
        if os.path.exists(scaler_path) and os.path.exists(model_path):
            print(f"✅ Artefatos mais recentes encontrados em: {latest_version_dir}")
            return scaler_path, model_path
        else:
            print(f"❌ Erro: Arquivos 'scaler.joblib' ou 'model.joblib' não encontrados no diretório: {latest_version_dir}")
            return None, None
            
    except (IndexError, FileNotFoundError):
        print(f"❌ Erro: Nenhum artefato de modelo encontrado no diretório '{artifacts_dir}'.")
        print("Certifique-se de que você já treinou o modelo primeiro.")
        return None, None

def load_artifacts(scaler_path, model_path):
    """Carrega o scaler e o modelo a partir dos caminhos especificados."""
    try:
        scaler = joblib.load(scaler_path)
        model = joblib.load(model_path)
        print("✅ Scaler e Modelo carregados com sucesso.")
        return scaler, model
    except Exception as e:
        print(f"❌ Erro ao carregar os artefatos: {e}")
        return None, None

# --- 2. FUNÇÃO PRINCIPAL DE PREDIÇÃO ---

def predict_regime(scaler, model, new_data_df):
    """
    Prevê o regime (cluster) para um novo conjunto de dados.

    Args:
        scaler: O objeto StandardScaler treinado e carregado.
        model: O objeto HDBSCAN treinado e carregado.
        new_data_df: Um DataFrame do Pandas com os novos dados.
                     Deve conter as mesmas colunas numéricas do treinamento.

    Returns:
        Um DataFrame com os dados originais e as colunas de predição adicionadas.
    """
    # Verificação de segurança para garantir que o modelo foi treinado corretamente
    if not hasattr(model, 'prediction_data_'):
        raise TypeError(
            "O modelo HDBSCAN não foi treinado com 'prediction_data=True'. "
            "Não é possível fazer predições. Treine o modelo novamente."
        )

    print("🔍 Realizando pré-processamento e predição do novo dado...")
    
    # Extrai apenas as features numéricas na ordem correta
    numeric_features = ['current', 'rpm', 'oilTemperature', 'oilLevel']
    X_new = new_data_df[numeric_features].values

    # Passo 1: Normaliza os novos dados USANDO O SCALER JÁ TREINADO.
    # NUNCA use .fit_transform() em novos dados, apenas .transform()!
    X_scaled = scaler.transform(X_new)

    # Passo 2: Usa a função approximate_predict
    # Ela espera o modelo treinado e os novos dados normalizados.
    labels, strengths = hdbscan.approximate_predict(model, X_scaled)
    # Adiciona os resultados ao DataFrame original para um retorno claro
    result_df = new_data_df.copy()
    result_df['predicted_cluster'] = labels
    result_df['prediction_strength'] = strengths # A "certeza" da predição (0.0 a 1.0)

    print("✅ Predição concluída.")
    return result_df

# --- 3. BLOCO DE EXECUÇÃO PARA TESTE ---

if __name__ == "__main__":
    # 1. Encontra e carrega os artefatos mais recentes
    scaler_path, model_path = find_latest_artifacts()
    
    if scaler_path and model_path:
        scaler, model = load_artifacts(scaler_path, model_path)

        if scaler and model:
            # 2. Cria exemplos de novos dados para testar a predição
            # IMPORTANTE: Os nomes das colunas devem ser os mesmos do treinamento!
            sample_data = pd.DataFrame([
                # --- Cenário 1: Explorando o Cluster de "Operação Normal" (Cluster 1) ---
                # Hipótese: Deve ser classificado como Cluster 1, com força decrescente.
                {'current': 19.7, 'rpm': 1590, 'oilTemperature': 79.5, 'oilLevel': 71.5},  # Ponto A: Quase perfeito, no centro do cluster.
                {'current': 30.0, 'rpm': 1800, 'oilTemperature': 90.0, 'oilLevel': 75.0},  # Ponto B: Um pouco mais de carga, mas ainda dentro do esperado.
                {'current': 45.0, 'rpm': 2500, 'oilTemperature': 95.0, 'oilLevel': 68.0},  # Ponto C: No limite do normal. Pode ser Cluster 1 com baixa força, ou -1.

                # --- Cenário 2: Explorando o Cluster "Máquina Desligada" (Cluster 0) ---
                # Hipótese: Deve ser classificado como Cluster 0.
                {'current': 4.5,  'rpm': 0,    'oilTemperature': 35.0, 'oilLevel': 72.5},  # Variação do estado ocioso.

                # --- Cenário 3: Tentando encontrar um possível cluster de "Partida" ---
                # Hipótese: Pode ser um cluster pequeno que existe (ex: Cluster 2), ou ser -1.
                {'current': 55.0, 'rpm': 350,  'oilTemperature': 48.0, 'oilLevel': 71.0},  # Uma partida menos agressiva que o teste anterior.

                # --- Cenário 4: Anomalias "Sutis" ---
                # Hipótese: Deve ser classificado como -1, pois um parâmetro está fora do normal.
                {'current': 20.0, 'rpm': 1600, 'oilTemperature': 125.0, 'oilLevel': 71.0}, # Operação normal, mas com superaquecimento.
                {'current': 21.0, 'rpm': 1550, 'oilTemperature': 80.0,  'oilLevel': 55.0}, # Operação normal, mas com nível de óleo perigosamente baixo.
            ])

            # 3. Faz a predição
            predictions = predict_regime(scaler, model, sample_data)

            print("\n--- Resultados da Predição ---")
            print(predictions)