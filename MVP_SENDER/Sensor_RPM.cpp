#include "Sensor_RPM.h"
#include <Arduino.h>
int signalPulse = 2;
int rpm;
volatile byte pulses;
unsigned long timeOld;
unsigned int pulses_per_turn = 1;

 void count(){
    pulses++;
}

void startRPM(){
    pinMode(signalPulse, INPUT);
    attachInterrupt(digitalPinToInterrupt(signalPulse), count, FALLING);
    pulses = 0;
    rpm = 0;
    timeOld = 0;
}

int readRPM(){
    if(millis() - timeOld >= 1000){
        detachInterrupt(digitalPinToInterrupt(signalPulse));
        rpm = (60 * 1000 / pulses_per_turn) / (millis() - timeOld) * pulses;
        timeOld = millis();
        pulses = 0;
        return rpm;
        attachInterrupt(digitalPinToInterrupt(signalPulse), count, FALLING);
    }
}