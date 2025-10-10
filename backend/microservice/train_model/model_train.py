import pandas as pd
import requests 
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
import os # Para ler variáveis de ambiente de forma segura


#API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000/unifiedMachines/state/:unifiedMachineId/:startDate/:endDate")
API_BASE_URL = "http://localhost:3000"
MACHINE_ID = 1 # A máquina que queremos treinar

# --- 2. NOVA FUNÇÃO DE CARREGAMENTO DE DADOS ---
def fetch_data_from_api(machine_id, start_date, end_date):
    """Busca dados de treinamento do endpoint seguro."""
    endpoint = f"{API_BASE_URL}/unifiedMachines/state/"
    params = {
        'unifiedMachineId': machine_id,
        'startDate': start_date,
        'endDate': end_date,
        'limit': 20000 # Um limite generoso
    }
    
    print(f"Buscando dados da API em: {endpoint}")
    try:
        response = requests.get(endpoint, headers=headers, params=params, timeout=300) # Timeout de 5 min
        response.raise_for_status() # Lança um erro se a resposta for 4xx ou 5xx
        
        # Converte a resposta JSON diretamente para um DataFrame do Pandas
        df = pd.DataFrame(response.json())
        print(f"{len(df)} registros carregados com sucesso da API.")
        return df
    except requests.exceptions.RequestException as e:
        print(f"Erro ao buscar dados da API: {e}")
        return None

# --- 3. O RESTO DO SCRIPT (PERMANECE QUASE IDÊNTICO) ---
# O código daqui para baixo não muda, pois ele opera sobre o DataFrame,
# não importa de onde o DataFrame veio (banco de dados ou API).

# A. Carregamento dos Dados (agora usando a nova função)
df = fetch_data_from_api(MACHINE_ID, '2025-10-01T00:00:00Z', '2025-10-08T23:59:59Z')

df.head()