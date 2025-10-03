#include "LoRaWan_APP.h"
#include "Arduino.h"
#include <Wire.h>  
#include "HT_SSD1306Wire.h"
#include "Sensor_DS18B20.h"
#include "ArduinoJson.h"
#include "Sensor_HCSR04.h" 
#include <cstdlib>
#include <array>
#include <numeric>
#include "Sensor_RPM.h"

// --- Configurações LoRa ---
#define RF_FREQUENCY                                915000000 // Hz
#define TX_OUTPUT_POWER                             20        // dBm
#define LORA_BANDWIDTH                              0         // [0: 125 kHz]
#define LORA_SPREADING_FACTOR                       9         // [SF7..SF12]
#define LORA_CODINGRATE                             1         // [1: 4/5]
#define LORA_PREAMBLE_LENGTH                        8         
#define LORA_SYMBOL_TIMEOUT                         0         
#define LORA_FIX_LENGTH_PAYLOAD_ON                  false
#define LORA_IQ_INVERSION_ON                        false
#define RX_TIMEOUT_VALUE                            1000
#define BUFFER_SIZE                                 64

// --- Display ---
SSD1306Wire  factory_display(0x3c, 500000, SDA_OLED, SCL_OLED, GEOMETRY_128_64, RST_OLED);

// --- Buffers e JSON ---
char txpacket[BUFFER_SIZE];
StaticJsonDocument<256> doc;
String nodeChipID;

// --- Controle de Estado ---
volatile bool lora_idle = true;

// --- Variáveis de Telemetria e Deltas ---

// Temperatura
float currentTemperature;
float lastSentTemperature = -100.0; // Usar valor inicial que não será lido
const float tempChangeDelta = 0.5;   // Delta absoluto de 0.5°C

// RPM (Média Móvel)
std::array<int, 5> rpmReadings;
int rpmReadingIndex = 0;
bool rpmBufferFull = false;
int lastSentAverageRPM = -1; // Usar -1 para indicar que nunca foi enviado
float averageRPM = 0.0;
const float rpmChangeDeltaPercent = 0.10; // Delta de 5%

// Nível do Tanque
int lastSentLevelPercentage = -1;
const int levelChangeDelta = 10; // Delta absoluto de 10%
const int deadZoneLevel = 5;     // Nível crítico
int currentLevelPercentage;
float tankHeight = 10.0; // Ex: 10 metros

// Armazenamento temporário para atualização após TX
float stagedTemperature;
float stagedAverageRPM;
int stagedLevelPercentage;

// Controle de tempo
unsigned long lastReadTime = 0;
const int readInterval = 1000; 

// --- Protótipos de Funções ---
static RadioEvents_t RadioEvents;
void OnTxDone(void);
void OnTxTimeout(void);
void AddReadingRPM(int newValue);
String getChipId();
void VextON(void);
void VextOFF(void);

// =====================================================================
// SETUP
// =====================================================================
void setup() {
    Serial.begin(115200);
    Mcu.begin(HELTEC_BOARD, SLOW_CLK_TPYE);

    RadioEvents.TxDone = OnTxDone;
    RadioEvents.TxTimeout = OnTxTimeout;
    
    Radio.Init(&RadioEvents);
    Radio.SetChannel(RF_FREQUENCY);
    Radio.SetTxConfig(MODEM_LORA, TX_OUTPUT_POWER, 0, LORA_BANDWIDTH,
                      LORA_SPREADING_FACTOR, LORA_CODINGRATE,
                      LORA_PREAMBLE_LENGTH, LORA_FIX_LENGTH_PAYLOAD_ON,
                      true, 0, 0, LORA_IQ_INVERSION_ON, 3000);
                      
    nodeChipID = getChipId();
    startTemperature(); 
    startRPM();
    startLevel();
    
    VextON();
    delay(100);
    factory_display.init();
    factory_display.clear();
    factory_display.setFont(ArialMT_Plain_16);
    factory_display.setTextAlignment(TEXT_ALIGN_CENTER);
    factory_display.drawString(64, 26, "Inicializando...");
    factory_display.display();
}

// =====================================================================
// LOOP PRINCIPAL
// =====================================================================
void loop() {
    Radio.IrqProcess();
    calculateRPM(); // Atualiza o cálculo do RPM
    if (millis() - lastReadTime >= readInterval && lora_idle) {
        lastReadTime = millis();
        // --- Leitura dos Sensores ---
         currentTemperature = readTemperature();
         AddReadingRPM(getRPM()); 
         currentLevelPercentage = readLevel(tankHeight);

        // --- Lógica de Alerta de Zona Morta (Prioridade Máxima) ---
        if (currentLevelPercentage <= deadZoneLevel) {
            doc.clear();
            doc["nodeID"] = nodeChipID;
            doc["level"] = currentLevelPercentage;
            doc["alert"] = "deadzone"; 

            serializeJson(doc, txpacket, sizeof(txpacket));
            Radio.Send((uint8_t *)txpacket, strlen(txpacket));
            
            lora_idle = false; 
            Serial.printf("\r\nEnviando PACOTE DE ALERTA: \"%s\"\r\n", txpacket);
            return; // Sai do loop para esperar o envio ser concluído
        }

        // --- Lógica de Envio por Delta ---
        if (!rpmBufferFull) { // Não faz nada até o buffer de RPM estar cheio
            Serial.print("oi");
            return;
        }
        
        averageRPM = std::accumulate(rpmReadings.begin(), rpmReadings.end(), 0) / (float)rpmReadings.size();
        Serial.print("MEDIA RPM");
        Serial.println(averageRPM);
        bool shouldSend = false;
        doc.clear();

        // Verifica delta da temperatura
        if (fabs(currentTemperature - lastSentTemperature) > tempChangeDelta) {
            doc["temp"] = currentTemperature;
            shouldSend = true;
        }

        // Verifica delta do RPM (percentual)
        float rpmChange = 0;
        
        rpmChange = fabs(averageRPM - lastSentAverageRPM) / lastSentAverageRPM;
        if (rpmChange > rpmChangeDeltaPercent || lastSentAverageRPM < 0) {
             Serial.println("Montei json");
             doc["rpm_avg"] = round(averageRPM);
             shouldSend = true;
        }

        // Verifica delta do Nível
        if (abs(currentLevelPercentage - lastSentLevelPercentage) > levelChangeDelta) {
            doc["level"] = currentLevelPercentage; 
            shouldSend = true;
        }

        // Se alguma condição foi atendida, monta e envia o pacote
        if (shouldSend) {   
            doc["nodeID"] = nodeChipID;
            serializeJson(doc, txpacket, sizeof(txpacket));

            // Armazena os valores que serão enviados para confirmar no OnTxDone
            if (doc.containsKey("temp")) stagedTemperature = currentTemperature;
            if (doc.containsKey("rpm_avg")) stagedAverageRPM = averageRPM;
            if (doc.containsKey("level")) stagedLevelPercentage = currentLevelPercentage;

            Radio.Send((uint8_t *)txpacket, strlen(txpacket));
            
            lora_idle = false; 
            
            Serial.printf("\r\nEnviando pacote consolidado: \"%s\"\r\n", txpacket);
            
            factory_display.clear();
            factory_display.setFont(ArialMT_Plain_10);
            factory_display.drawString(0, 0, "Enviando pacote:");
            factory_display.drawString(0, 12, txpacket);
            factory_display.display();
        }
    }
}

// =====================================================================
// CALLBACKS LoRa
// =====================================================================
void OnTxDone(void) {
  Serial.println("TX done......");
  
  // Confirma a atualização dos valores "último enviado"
  if (doc.containsKey("temp")) lastSentTemperature = stagedTemperature;
  if (doc.containsKey("rpm_avg")) lastSentAverageRPM = stagedAverageRPM;
  if (doc.containsKey("level")) lastSentLevelPercentage = stagedLevelPercentage;
  
  lora_idle = true;
}

void OnTxTimeout(void) {
    Radio.Sleep();
    Serial.println("TX Timeout......");
    lora_idle = true;
}

// =====================================================================
// Funções Auxiliares
// =====================================================================
void AddReadingRPM(int newValue) {
    rpmReadings[rpmReadingIndex] = newValue;
    rpmReadingIndex = (rpmReadingIndex + 1) % rpmReadings.size();
    
    if (!rpmBufferFull && rpmReadingIndex == 0) {
        rpmBufferFull = true; // Buffer foi preenchido pela primeira vez
    }
}

String getChipId() {
  uint64_t chipid = ESP.getEfuseMac();
  char chipid_str[17];
  snprintf(chipid_str, sizeof(chipid_str), "%04X%08X", (uint16_t)(chipid >> 32), (uint32_t)chipid);
  return String(chipid_str);
}

void VextON(void) {
  pinMode(Vext, OUTPUT);
  digitalWrite(Vext, LOW);
}

void VextOFF(void) {
  pinMode(Vext, OUTPUT);
  digitalWrite(Vext, HIGH);
}
