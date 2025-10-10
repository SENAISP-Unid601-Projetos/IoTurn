import numpy as np
import pandas as pd
from datetime import datetime, timedelta, timezone
import cuid # Import the CUID library

# --- 1. GERAÇÃO DOS DADOS (Lógica Idêntica à anterior) ---
n_samples = 500
# Data for 'steel' processing
rpm_aco = np.random.normal(loc=800, scale=50, size=n_samples)
corrente_aco = np.random.normal(loc=35, scale=5, size=n_samples)
temp_aco = np.random.normal(loc=90, scale=3, size=n_samples)
nivel_aco = np.random.normal(loc=70, scale=2, size=n_samples)
df_aco = pd.DataFrame({'rpm': rpm_aco, 'current': corrente_aco, 'oilTemperature': temp_aco, 'oilLevel': nivel_aco})

# Data for 'aluminum' processing
rpm_aluminio = np.random.normal(loc=3000, scale=100, size=n_samples)
corrente_aluminio = np.random.normal(loc=10, scale=1.5, size=n_samples)
temp_aluminio = np.random.normal(loc=75, scale=2, size=n_samples)
nivel_aluminio = np.random.normal(loc=72, scale=2, size=n_samples)
df_aluminio = pd.DataFrame({'rpm': rpm_aluminio, 'current': corrente_aluminio, 'oilTemperature': temp_aluminio, 'oilLevel': nivel_aluminio})

# Data for 'idle' state
rpm_ocioso = np.random.normal(loc=0, scale=10, size=n_samples // 2)
corrente_ocioso = np.random.normal(loc=1.5, scale=0.2, size=n_samples // 2)
temp_ocioso = np.random.normal(loc=60, scale=1, size=n_samples // 2)
nivel_ocioso = np.random.normal(loc=75, scale=1, size=n_samples // 2)
df_ocioso = pd.DataFrame({'rpm': rpm_ocioso, 'current': corrente_ocioso, 'oilTemperature': temp_ocioso, 'oilLevel': nivel_ocioso})

# Concatenate normal operation data
df_normal = pd.concat([df_aco, df_aluminio, df_ocioso])

# Manually define some anomalies
anomalias = [
    {'rpm': 50, 'current': 150.0, 'oilTemperature': 91, 'oilLevel': 69}, {'rpm': 10, 'current': 180.0, 'oilTemperature': 92, 'oilLevel': 69},
    {'rpm': 0, 'current': 200.0, 'oilTemperature': 93, 'oilLevel': 68}, {'rpm': 750, 'current': 60.0, 'oilTemperature': 150.0, 'oilLevel': 10.0},
    {'rpm': 3200, 'current': 45.0, 'oilTemperature': 95, 'oilLevel': 70}, {'rpm': 3100, 'current': 48.0, 'oilTemperature': 98, 'oilLevel': 70},
    {'rpm': 800, 'current': 35.0, 'oilTemperature': 500.0, 'oilLevel': 71}, {'rpm': 3000, 'current': 10.0, 'oilTemperature': 75, 'oilLevel': -15.0},
]
df_anomalias = pd.DataFrame(anomalias)

# Combine normal data with anomalies
df_perfect = pd.concat([df_normal, df_anomalias]).reset_index(drop=True)
df_perfect = df_perfect.round(2)

# --- 2. NOVA ETAPA: SIMULAR DADOS AUSENTES (DROPOUTS DE SENSOR) ---
print("Simulating sensor failures (dropouts)...")

df_final = df_perfect.copy()
numeric_features = ['current', 'rpm', 'oilTemperature', 'oilLevel']
num_dropouts = 10 # How many sensor "outages" to simulate
max_dropout_length = 50 # Maximum number of data points a sensor can be offline

for _ in range(num_dropouts):
    # Choose a random metric to fail
    metric_to_fail = np.random.choice(numeric_features)
    
    # Choose a random starting point for the failure
    start_index = np.random.randint(0, len(df_final) - max_dropout_length)
    
    # Choose a random duration for the failure
    dropout_length = np.random.randint(10, max_dropout_length)
    
    end_index = start_index + dropout_length
    
    # Replace values in the failure range with NaN, which will become NULL
    df_final.loc[start_index:end_index, metric_to_fail] = np.nan

# --- 3. ADICIONAR TIMESTAMPS, ID E COLUNAS FINAIS ---
total_rows = len(df_final)
now = datetime.now(timezone.utc)
timestamps = pd.to_datetime(pd.date_range(end=now, periods=total_rows, freq='-10S'))
df_final['timestamp'] = timestamps

# Shuffle and sort to make the data more realistic
df_final = df_final.sample(frac=1).sort_values('timestamp').reset_index(drop=True)

# Generate a unique CUID for each row and add it to the 'id' column
print("Generating unique IDs (CUIDs)...")
df_final['id'] = [cuid.cuid() for _ in range(total_rows)]

# Set 'isMissing' flags based on the NaNs we created
for col in numeric_features:
    df_final[f'{col}IsMissing'] = df_final[col].isnull()

df_final['machineId'] = 1
df_final = df_final.sample(frac=1).reset_index(drop=True)

# --- BLOCO DE VERIFICAÇÃO VISUAL (ADICIONE ISTO) ---
import matplotlib.pyplot as plt
import seaborn as sns

# Para a visualização, precisamos saber qual é o regime original de cada ponto.
# Vamos refazer o dataframe final adicionando a coluna 'regime'
df_aco['regime'] = 'Aco'
df_aluminio['regime'] = 'Aluminio'
df_ocioso['regime'] = 'Ocioso'
df_anomalias['regime'] = 'Anomalia'

df_para_visualizar = pd.concat([df_aco, df_aluminio, df_ocioso, df_anomalias])

print("\n--- GERANDO GRÁFICO DE VERIFICAÇÃO DOS DADOS FORJADOS ---")
plt.figure(figsize=(12, 8))
sns.scatterplot(data=df_para_visualizar, x='rpm', y='current', hue='regime', palette='bright', s=50)
plt.title('VERIFICAÇÃO: Estrutura dos Dados Gerados')
plt.grid(True)
plt.show()
# --- 4. GERAR COMANDOS SQL COM O CAMPO 'id' ---
output_filename = 'dados_para_inserir_com_falhas_e_cuid.sql'
print(f"Generating SQL file: {output_filename}")

with open(output_filename, 'w') as f:
    f.write("-- SQL commands generated to populate the UnifiedMachineState table (with simulated missing data and CUIDs)\n\n")
    
    for index, row in df_final.iterrows():
        # Handle potential NaN values for SQL formatting
        current = row['current'] if pd.notna(row['current']) else 'NULL'
        rpm = int(row['rpm']) if pd.notna(row['rpm']) else 'NULL'
        oilTemperature = row['oilTemperature'] if pd.notna(row['oilTemperature']) else 'NULL'
        oilLevel = row['oilLevel'] if pd.notna(row['oilLevel']) else 'NULL'
        
        # Format timestamp correctly
        ts_formatted = row['timestamp'].strftime('%Y-%m-%d %H:%M:%S.%f %z')

        # Create the SQL command, now including the 'id' field
        sql_command = (
            f'INSERT INTO "UnifiedMachineState" ("id", "timestamp", "machineId", "current", "rpm", "oilTemperature", "oilLevel", "currentIsMissing", "rpmIsMissing", "oilTemperatureIsMissing", "oilLevelIsMissing") '
            f"VALUES ('{row['id']}', '{ts_formatted}', {row['machineId']}, {current}, {rpm}, {oilTemperature}, {oilLevel}, {row['currentIsMissing']}, {row['rpmIsMissing']}, {row['oilTemperatureIsMissing']}, {row['oilLevelIsMissing']});\n"
        )
        
        f.write(sql_command)

print(f"\nFile '{output_filename}' generated successfully!")
print(f"Total missing values in 'current': {df_final['currentIsMissing'].sum()}")
print(f"Total missing values in 'rpm': {df_final['rpmIsMissing'].sum()}")
print(f"Total missing values in 'oilTemperature': {df_final['oilTemperatureIsMissing'].sum()}")
print(f"Total missing values in 'oilLevel': {df_final['oilLevelIsMissing'].sum()}")
