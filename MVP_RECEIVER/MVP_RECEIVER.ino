
#include "LoRaWan_APP.h"
#include "Arduino.h"
#include "Mqtt_Service.h" 
#include "ArduinoJson.h"
#include "HT_SSD1306Wire.h"
#define RF_FREQUENCY                  915000000 // Frequência em Hz (ex: 915MHz para US915)
#define TX_OUTPUT_POWER               14        // Potência de transmissão em dBm (não usado no receptor, mas bom para referência)
#define LORA_BANDWIDTH                0         // 0: 125 kHz, 1: 250 kHz, 2: 500 kHz
#define LORA_SPREADING_FACTOR         7         // Fator de espalhamento [SF7..SF12]
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
const char* password = "pedro135553";
const char* broker = "192.168.147.10";

JsonDocument doc;
DeserializationError error;

static RadioEvents_t RadioEvents;
int16_t rssi, rxSize;
volatile bool lora_idle = true; 

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

    if (lora_idle) {
        lora_idle = false; 
        Serial.println("--> Entrando em modo de recepção (RX)");
        
        factory_display.clear();
        factory_display.setFont(ArialMT_Plain_10);
        factory_display.setTextAlignment(TEXT_ALIGN_LEFT);
        factory_display.drawString(0, 0, "Aguardando dados LoRa...");
        factory_display.display();
        
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
    doc.to<JsonObject>(); // Limpa e prepara o doc para receber um objeto JSON
    error = deserializeJson(doc, rxpacket);
    if(error){
        factory_display.clear();
        factory_display.setFont(ArialMT_Plain_10);
        factory_display.setTextAlignment(TEXT_ALIGN_LEFT);
        String errorMessage = "Falha no JSON: " + String(error.c_str());
        factory_display.drawString(0, 0, errorMessage);
        factory_display.display();
    } else {
        shareJson();
        Serial.println("Pacote publicado no MQTT.");
    }
    factory_display.clear();
    factory_display.setFont(ArialMT_Plain_10);
    factory_display.setTextAlignment(TEXT_ALIGN_LEFT);
    factory_display.drawString(0, 0, "Último Pacote Recebido:");
    factory_display.setFont(ArialMT_Plain_16);
    factory_display.drawString(0, 12, String(rxpacket)); 
    factory_display.setFont(ArialMT_Plain_10);
    factory_display.display();

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

void shareJson(){
    if (doc.containsKey("rpm_avg")) {
        mqtt_publish("ioturn/rpm_avg", doc["rpm_avg"].as<String>());
    }
    if (doc.containsKey("temp")) {
        mqtt_publish("ioturn/temp", doc["temp"].as<String>());
    }
    if (doc.containsKey("level")) {
        mqtt_publish("ioturn/level", doc["level"].as<String>());
    }
}
