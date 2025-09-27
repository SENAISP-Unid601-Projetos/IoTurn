
#include "LoRaWan_APP.h"
#include "Arduino.h"
#include "Mqtt_Service.h" 
#include "ArduinoJson.h"
#include "HT_SSD1306Wire.h"
#include <map>
#define RF_FREQUENCY                  915000000 // Frequência em Hz (ex: 915MHz para US915)
#define TX_OUTPUT_POWER               14        // Potência de transmissão em dBm (não usado no receptor, mas bom para referência)
#define LORA_BANDWIDTH                0         // 0: 125 kHz, 1: 250 kHz, 2: 500 kHz
#define LORA_SPREADING_FACTOR         9        // Fator de espalhamento [SF7..SF12]
#define LORA_CODINGRATE               1         // Taxa de codificação [1: 4/5, 2: 4/6, 3: 4/7, 4: 4/8]
#define LORA_PREAMBLE_LENGTH          8         // Comprimento do preâmbulo
#define LORA_SYMBOL_TIMEOUT           0         // Timeout de símbolo
#define LORA_FIX_LENGTH_PAYLOAD_ON    false     // Carga útil de comprimento variável
#define LORA_IQ_INVERSION_ON          false
#define RX_TIMEOUT_VALUE              1000
#define BUFFER_SIZE                   64 // Tamanho máximo da mensagem esperada


SSD1306Wire  factory_display(0x3c, 500000, SDA_OLED, SCL_OLED, GEOMETRY_128_64, RST_OLED);
char rxpacket[BUFFER_SIZE]; 

const char* ssid = "Nextron";
const char* password = "iot12345";
const char* broker = "192.168.71.10";

JsonDocument doc;
DeserializationError error;

String devicesJson;
static RadioEvents_t RadioEvents;
int16_t rssi, rxSize;
volatile bool lora_idle = true; 

std::map<String, int> nodeMachineMap;
void VextON(void);
void VextOFF(void);
void shareJson(void);

void setup() {
    Serial.begin(115200);
    Mcu.begin(HELTEC_BOARD, SLOW_CLK_TPYE);
    VextON();
    factory_display.init();
    factory_display.clear();
    factory_display.setFont(ArialMT_Plain_16);
    factory_display.setTextAlignment(TEXT_ALIGN_CENTER);
    factory_display.drawString(64, 26, "Inicializando...");
    factory_display.display();
    delay(1000);
    
    setup_wifi(ssid, password);
    mqtt_setup(broker, 1883);
    getMappingDevices(); // Carrega o mapeamento inicial
    RadioEvents.RxDone = OnRxDone; 
    Radio.Init(&RadioEvents);
    Radio.SetChannel(RF_FREQUENCY);
    Radio.SetRxConfig(MODEM_LORA, LORA_BANDWIDTH, LORA_SPREADING_FACTOR,
                      LORA_CODINGRATE, 0, LORA_PREAMBLE_LENGTH,
                      LORA_SYMBOL_TIMEOUT, LORA_FIX_LENGTH_PAYLOAD_ON,
                      0, true, 0, 0, LORA_IQ_INVERSION_ON, true);
    
    Serial.println("Setup concluído. Receptor pronto.");
}

void loop() {
    mqtt_loop();
    char messageBuffer[256];
    if (getNewMqttMessage(messageBuffer, sizeof(messageBuffer))) {
      processJsonCommand(messageBuffer);
    }
    if (lora_idle) {
        lora_idle = false; 
        Serial.println("--> Entrando em modo de recepção (RX)");
        
        Radio.Rx(0); 
    }
    Radio.IrqProcess();
}

void OnRxDone(uint8_t *payload, uint16_t size, int16_t rssi_val, int8_t snr) {
    Radio.Sleep();

    rssi = rssi_val;
    rxSize = size;
    memcpy(rxpacket, payload, size);
    rxpacket[size] = '\0'; 

    Serial.printf("\r\nPacote recebido: \"%s\" | RSSI: %d | Tamanho: %d\r\n", rxpacket, rssi, rxSize);
    StaticJsonDocument<256> doc; 
    DeserializationError error = deserializeJson(doc, rxpacket);
    if (error) {
        Serial.print("Falha ao decodificar JSON do pacote LoRa: ");
        Serial.println(error.c_str());
        lora_idle = true; 
        return;
    }
    String nodeId = doc["nodeID"];
    
    if (nodeMachineMap.count(nodeId)) {
        int machineId = nodeMachineMap[nodeId];
        Serial.printf("Nó %s pertence à Máquina ID %d.\n", nodeId.c_str(), machineId);

        if (doc.containsKey("temp")) {
            float temp = doc["temp"];
            String topic = "ioturn/maquinas/" + String(machineId) + "/dt/temperatura";
            mqtt_publish(topic.c_str(), String(temp).c_str());
        }
        if (doc.containsKey("level")) {
            int level = doc["level"];
            String topic = "ioturn/maquinas/" + String(machineId) + "/dt/nivel";
            mqtt_publish(topic.c_str(), String(level).c_str());
        }

    } else {
        Serial.printf("AVISO: Nó %s não está mapeado. Pacote descartado.\n", nodeId.c_str());
    }

    lora_idle = true; 
}
void VextON(void) {
    pinMode(Vext, OUTPUT);
    digitalWrite(Vext, LOW); 
}

void VextOFF(void) {
    pinMode(Vext, OUTPUT);
    digitalWrite(Vext, HIGH); 
}

void getMappingDevices() {
    String jsonResponse = httpGETRequest("http://192.168.71.10:3000/devices/getDeviceMapping");
    Serial.println("Resposta da API de Mapeamento:");
    Serial.println(jsonResponse);
    StaticJsonDocument<1024> doc; 
    DeserializationError error = deserializeJson(doc, jsonResponse);
    if (error) {
        Serial.print("Falha ao decodificar JSON do mapa: ");
        Serial.println(error.c_str());
        return;
    }
    nodeMachineMap.clear();
    JsonArray array = doc.as<JsonArray>();
    for (JsonObject item : array) {
        String nodeId = item["nodeId"];
        int machineId = item["machineId"];
        nodeMachineMap[nodeId] = machineId;
    }
    Serial.println("Mapa de dispositivos atualizado com sucesso!");
    Serial.print("Total de dispositivos mapeados: ");
    Serial.println(nodeMachineMap.size());
}

void processJsonCommand(const char* jsonMessage) {
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, jsonMessage);

    if (error) {
        Serial.print("Falha no parsing do JSON! Erro: ");
        Serial.println(error.c_str());
        return;
    }

    const char* command = doc["command"];

    if (command) {
        if (strcmp(command, "refresh_mappings") == 0) {
            getMappingDevices();
        }
    }
}


