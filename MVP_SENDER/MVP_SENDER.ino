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
#include "EmonLib.h"
#include <UnicViewAD.h>
#include <HardhareSerial.h>


// Configurações LoRa
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

// Configurações dos pinos da Serial 1
#define PIN_RX 48
#define PIN_TX 47


float pinSCT013 = 5;

HardwareSerial DisplaySerial(1);
LCM Lcm(DisplaySerial);
SSD1306Wire  factory_display(0x3c, 500000, SDA_OLED, SCL_OLED, GEOMETRY_128_64, RST_OLED);
EnergyMonitor emon1;


// Variáveis do Display Victor Vision
LcmVar Rpm(100);
LcmVar Corrente(110);
LcmVar Temperatura(120);
LcmVar NivelTanque(130);

char txpacket[BUFFER_SIZE];
StaticJsonDocument<256> doc;
String nodeChipID;

volatile bool lora_idle = true;

float currentTemperature;
float lastSentTemperature = -100.0; 
const float tempChangeDelta = 0.5;   

double Irms;
const float currentChangeDelta = 0.5;
double lastSentCurrent = -1;

std::array<int, 5> rpmReadings;
int rpmReadingIndex = 0;
bool rpmBufferFull = false;
int lastSentAverageRPM = -1; 
float averageRPM = 0.0;
const float rpmChangeDeltaPercent = 0.10; 

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
double stagedCurrent;

// Controle de tempo
unsigned long lastReadTime = 0;
const int readInterval = 1000; 


// 
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
                      
    pinMode(PIN_RX, INPUT_PULLUP);
    pinMode(PIN_TX, OUTPUT);
    DisplaySerial.begin(115200, SERIAL_8N1, PIN_RX, PIN_TX);
    Lcm.begin();
    nodeChipID = getChipId();
    emon1.current(pinSCT013, 7.4074);
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
         Irms = emon1.calcIrms(1480); // Calcula a corrente RMS
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
            return; 
        }

        
        if (!rpmBufferFull) { 
            Serial.print("oi");
            return;
        }
        
        averageRPM = std::accumulate(rpmReadings.begin(), rpmReadings.end(), 0) / (float)rpmReadings.size();

        // Atualiza o display Victor Vision
        Rpm.write(round(averageRPM));
        Corrente.write(Irms);
        Temperatura.write(currentTemperature);
        NivelTanque.write(currentLevelPercentage);
        
        bool shouldSend = false;
        doc.clear();
  
        if(fabs(Irms - lastSentCurrent) > currentChangeDelta){
            doc["current"] = Irms;
            shouldSend = true;
        }
        if (fabs(currentTemperature - lastSentTemperature) > tempChangeDelta) {
            doc["temp"] = currentTemperature;
            shouldSend = true;
        }

        float rpmChange = 0;
        
        rpmChange = fabs(averageRPM - lastSentAverageRPM) / lastSentAverageRPM;
        if (rpmChange > rpmChangeDeltaPercent || lastSentAverageRPM < 0) {
             doc["rpm_avg"] = round(averageRPM);
             shouldSend = true;
        }

        if (abs(currentLevelPercentage - lastSentLevelPercentage) > levelChangeDelta) {
            doc["level"] = currentLevelPercentage; 
            shouldSend = true;
        }

        if (shouldSend) {   
            doc["nodeID"] = nodeChipID;
            serializeJson(doc, txpacket, sizeof(txpacket));

            if (doc.containsKey("temp")) stagedTemperature = currentTemperature;
            if (doc.containsKey("rpm_avg")) stagedAverageRPM = averageRPM;
            if (doc.containsKey("level")) stagedLevelPercentage = currentLevelPercentage;
            if(doc.containsKey("current")) stagedCurrent = Irms;

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

void OnTxDone(void) {
  Serial.println("TX done......");
  
  if (doc.containsKey("temp")) lastSentTemperature = stagedTemperature;
  if (doc.containsKey("rpm_avg")) lastSentAverageRPM = stagedAverageRPM;
  if (doc.containsKey("level")) lastSentLevelPercentage = stagedLevelPercentage;
  if(doc.containsKey("current")) lastSentCurrent = stagedCurrent;
  
  lora_idle = true;
}

void OnTxTimeout(void) {
    Radio.Sleep();
    Serial.println("TX Timeout......");
    lora_idle = true;
}

void AddReadingRPM(int newValue) {
    rpmReadings[rpmReadingIndex] = newValue;
    rpmReadingIndex = (rpmReadingIndex + 1) % rpmReadings.size();
    
    if (!rpmBufferFull && rpmReadingIndex == 0) {
        rpmBufferFull = true; 
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
