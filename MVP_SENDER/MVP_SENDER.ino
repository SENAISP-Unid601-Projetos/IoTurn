
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

#define RF_FREQUENCY                                915000000 // Hz

#define TX_OUTPUT_POWER                             20        // dBm, PADRÃO FUNCIONAL: 5

#define LORA_BANDWIDTH                              0         // [0: 125 kHz,
                                                              //  1: 250 kHz,
                                                              //  2: 500 kHz,
                                                              //  3: Reserved]
#define LORA_SPREADING_FACTOR                       9         // [SF7..SF12] PADRÃO FUNCIONAL: 7
#define LORA_CODINGRATE                             1         // [1: 4/5,
                                                              //  2: 4/6,
                                                              //  3: 4/7,
                                                              //  4: 4/8]
#define LORA_PREAMBLE_LENGTH                        8         // Same for Tx and Rx
#define LORA_SYMBOL_TIMEOUT                         0         // Symbols
#define LORA_FIX_LENGTH_PAYLOAD_ON                  false
#define LORA_IQ_INVERSION_ON                        false


#define RX_TIMEOUT_VALUE                            1000
#define BUFFER_SIZE                                 64 // Define the payload size here



SSD1306Wire  factory_display(0x3c, 500000, SDA_OLED, SCL_OLED, GEOMETRY_128_64, RST_OLED); // addr , freq , i2c group , resolution , rst
char txpacket[BUFFER_SIZE];
char rxpacket[BUFFER_SIZE];

StaticJsonDocument<256> doc;
char jsonBuffer[256];

volatile bool lora_idle= true;

float currentTemperature;
float lastSentTemperature = -100;
const float tempChangeDelta  = 0.5;

std::array<int,5> rpmReadings;
int rpmReadingCount  = 0;
int lastSentAverageRPM = -100;
float averageRPM = 0;
const float rpmChangeDelta = 50.0;

int lastSentLevelPercentage = -100;
const int levelChangeDelta = 25;
const int deadZoneLevel = 5;
int currentLevelPercentage;
float tankHeight = 10.0;


float stagedTemperature;
float stagedAverageRPM;
int stagedLevelPercentage;

unsigned long lastReadTime = 0;
const int readInterval = 1000;

static RadioEvents_t RadioEvents;
void OnTxDone( void );
void OnTxTimeout( void );
void AddReadingRPM( int newValue );

String nodeChipID;

void setup() {
    Serial.begin(115200);
    Mcu.begin(HELTEC_BOARD,SLOW_CLK_TPYE);

    RadioEvents.TxDone = OnTxDone;
    RadioEvents.TxTimeout = OnTxTimeout;
    
    Radio.Init( &RadioEvents );
    Radio.SetChannel( RF_FREQUENCY );
    Radio.SetTxConfig( MODEM_LORA, TX_OUTPUT_POWER, 0, LORA_BANDWIDTH,
                                   LORA_SPREADING_FACTOR, LORA_CODINGRATE,
                                   LORA_PREAMBLE_LENGTH, LORA_FIX_LENGTH_PAYLOAD_ON,
                                   true, 0, 0, LORA_IQ_INVERSION_ON, 3000 );
    nodeChipID = getChipId();
    startTemperature();
    //startRPM();
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



void loop()
{
    Radio.IrqProcess();
    
    if (millis() - lastReadTime > readInterval && lora_idle)
    {
        lastReadTime = millis();

        currentTemperature = readTemperature();
        //AddReadingRPM(readRPM()); 
        currentLevelPercentage = readLevel(tankHeight);

        if (currentLevelPercentage <= deadZoneLevel) {
            doc.clear();
            doc["level"] = currentLevelPercentage;
            doc["deadzone"] = true; 

            serializeJson(doc, txpacket);
            Radio.Send((uint8_t *)txpacket, strlen(txpacket));
            
            lora_idle = false; 
            Serial.printf("\r\nEnviando PACOTE DE ALERTA: \"%s\"\r\n", txpacket);
          
            //return; 
        }

        //if (rpmReadingCount < rpmReadings.size()) {
        //    return; 
        //}
        
        averageRPM = std::accumulate(rpmReadings.begin(), rpmReadings.end(), 0) / (float)rpmReadings.size();

        doc.clear();

        if (fabs(averageRPM - lastSentAverageRPM) > rpmChangeDelta) {
            doc["rpm_avg"] = averageRPM;
        }

        if (fabs(currentTemperature - lastSentTemperature) > tempChangeDelta) {
            doc["temp"] = currentTemperature;
        }

        if (abs(currentLevelPercentage - lastSentLevelPercentage) > levelChangeDelta) {
            doc["level"] = currentLevelPercentage; 
        }

        if (doc.size() > 0) 
        {   
            doc["nodeID"] = nodeChipID;
            serializeJson(doc, txpacket,sizeof(txpacket));

            if (doc.containsKey("rpm_avg")) {
                stagedAverageRPM = averageRPM;
            }
            if (doc.containsKey("temp")) {
                stagedTemperature = currentTemperature;
            }
            if (doc.containsKey("level")) {
                stagedLevelPercentage = currentLevelPercentage;
            }

            Radio.Send((uint8_t *)txpacket, strlen(txpacket));
            
            lora_idle = false; 
            
            Serial.printf("\r\nEnviando pacote consolidado: \"%s\"\r\n", txpacket);
            
            factory_display.clear();
            factory_display.setFont(ArialMT_Plain_10);
            factory_display.drawString(0, 10, txpacket);
            factory_display.display();
        }
    }
}

void OnTxDone( void )
{
  Serial.println("TX done......");
  if (doc.containsKey("rpm_avg")) {
        lastSentAverageRPM = stagedAverageRPM;
  }
  if (doc.containsKey("temp")) {
      lastSentTemperature = stagedTemperature;
  }
  if (doc.containsKey("level")) {
      lastSentLevelPercentage = stagedLevelPercentage;
  }

  lora_idle = true;
}

void OnTxTimeout( void )
{
    Radio.Sleep( );
    Serial.println("TX Timeout......");
    lora_idle = true;
}
void VextON(void)
{
  pinMode(Vext,OUTPUT);
  digitalWrite(Vext, LOW);
}

void VextOFF(void) //Vext default OFF
{
  pinMode(Vext,OUTPUT);
  digitalWrite(Vext, HIGH);
}

void AddReadingRPM(int newValue)
{
  if(rpmReadingCount  < rpmReadings.size()){
    rpmReadings[rpmReadingCount ] = newValue;
    rpmReadingCount ++;
  } else {
      for (size_t i = 0; i < rpmReadings.size() - 1; ++i) {
          rpmReadings[i] = rpmReadings[i + 1];
      }
      rpmReadings[rpmReadings.size() - 1] = newValue;
    }
}
// Função para ler o Chip ID diretamente do hardware
String getChipId() {
  uint64_t chipid = ESP.getEfuseMac();
  char chipid_str[17];
  snprintf(chipid_str, sizeof(chipid_str), "%04X%08X", (uint16_t)(chipid >> 32), (uint32_t)chipid);
  return String(chipid_str);
}
