#include "Lora_Sender.h"
#include <SPI.h>
#include <LoRa.h>

#define ss 5
#define rst 14
#define dio0 2

void SetupLoraSender(){
    LoRa.setPins(ss, rst, dio0);
    // replace the LoRa.begin(---E-) argument with your location's frequency
    // 433E6 for Asia
    // 868E6 for Europe
    // 915E6 for North America
    while (!LoRa.begin(433E6))
    {
        Serial.println(".");
        delay(500);
    }
    // Change sync word (0xF3) to match the receiver
    // The sync word assures you don't get LoRa messages from other LoRa transceivers
    // ranges from 0-0xFF
    LoRa.setSyncWord(0xF3);
    Serial.println("LoRa Initializing OK!"); 
}

void SendData(String message){
    LoRa.beginPacket();
    LoRa.print(message);
    LoRa.endPacket();
}