#include "Sensor_DS18B20.h"
#include <OneWire.h>
#include <DallasTemperature.h>

const int oneWireBus = 18;

OneWire oneWire(oneWireBus);

DallasTemperature sensors(&oneWire);

void startTemperature() {
    sensors.begin();
}

float readTemperature() {
    sensors.requestTemperatures();
    float celsius = sensors.getTempCByIndex(0); 

    return celsius;
}
