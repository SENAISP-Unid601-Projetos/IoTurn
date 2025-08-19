#include "Sensor_DS18B20.h"
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 7
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void startTemperature() {
    sensors.begin();
}

float readTemperature() {
    sensors.requestTemperatures();
    float celsius = sensors.getTempCByIndex(0); 

    return celsius;
}