# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Código Py

    """
    =====================================================
    Emulador de Sensores MQTT (Simulação de Deltas)
    Versão Python - Equivalente ao código ESP32
    =====================================================
    """
    
    import random
    import json
    import time
    import paho.mqtt.client as mqtt
    
    # --- CONFIGURAÇÕES ---
    BROKER = "10.110.18.15"  # ou o IP local do seu PC, ex: "192.168.0.105"
    PORT = 32333
    MACHINE_ID = 1
    INTERVAL = 10  # segundos
    
    # --- CLIENTE MQTT ---
    client = mqtt.Client()
    client.connect(BROKER, PORT, 60)
    
    # --- ESTADO ANTERIOR (para detectar deltas) ---
    last_values = {
        "rpm": None,
        "corrente": None,
        "temperatura": None,
        "nivel": None
    }
    
    
    def mqtt_publish(topic, payload):
        """Publica mensagem MQTT"""
        print(f"[MQTT] Publicando em '{topic}': {payload}")
        client.publish(topic, payload)
    
    
    def simulate_and_publish_data():
        """Simula sensores, detecta deltas e publica JSON parcial"""
        global last_values

    print("\n--------------------")
    print("Verificando deltas dos sensores...")

    # JSON parcial
    delta_doc = {}
    # Simula chance de mudança (40%)
    change_prob = 0.4

    # --- Simula RPM ---
    if random.random() < change_prob:
        rpm = random.uniform(800, 1200)
        if rpm != last_values["rpm"]:
            delta_doc["rpm"] = round(rpm, 2)
            last_values["rpm"] = rpm

    # --- Simula Corrente ---
    if random.random() < change_prob:
        corrente = random.uniform(15.0, 30.0)
        if corrente != last_values["corrente"]:
            delta_doc["corrente"] = round(corrente, 2)
            last_values["corrente"] = corrente

    # --- Simula Temperatura ---
    if random.random() < change_prob:
        temp = random.uniform(75.0, 90.0)
        if temp != last_values["temperatura"]:
            delta_doc["temperatura"] = round(temp, 2)
            last_values["temperatura"] = temp

    # --- Simula Nível ---
    if random.random() < change_prob:
        level = random.randint(40, 90)
        if level != last_values["nivel"]:
            delta_doc["nivel"] = level
            last_values["nivel"] = level

    # --- Publica se algo mudou ---
    if not delta_doc:
        print("Nenhum delta detectado. Nada a publicar.")
        return

    print("JSON parcial gerado:", json.dumps(delta_doc))

    # Publica cada chave em seu tópico
    for key, value in delta_doc.items():
        topic = f"ioturn/maquinas/{MACHINE_ID}/dt/{key}"
        mqtt_publish(topic, str(value))


    # --- LOOP PRINCIPAL ---
    print("Iniciando emulador MQTT...")
    while True:
    simulate_and_publish_data()
    client.loop()  # mantém a conexão MQTT viva
time.sleep(INTERVAL)
