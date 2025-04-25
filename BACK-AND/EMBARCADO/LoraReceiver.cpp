#include "LoraReceiver.h"
#include <SPI.h>
#include <LoRa.h>

#define ss 5
#define rst 14
#define dio0 2

void SetupLoraReceiver()
{
    LoRa.setPins(ss, rst, dio0);
    while (!LoRa.begin(433E6)){
        Serial.println(".");
        delay(500);
    }
    LoRa.setSyncWord(0xF3);
    Serial.println("LoRa Initializing OK!");
}

String ReceiverData()
{
    int packetSize = LoRa.parsePacket();
    if (packetSize){
        Serial.print("Received packet '");
        while (LoRa.available()){
            String LoRaData = LoRa.readString();
            return LoRaData;
        }
        Serial.print("' with RSSI ");
        Serial.println(LoRa.packetRssi());
    }
    return "Not found";
}