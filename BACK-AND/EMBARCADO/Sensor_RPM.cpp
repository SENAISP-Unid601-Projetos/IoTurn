#include "Sensor_RPM.h"

int signal = 2;
int rpm;
volatile byte pulses;
unsigned long timeOld;
unsigned int pulses_per_turn = 1;

 void count(){
    pulses++;
}

void setupInit(){
    pinMode(signal, INPUT);
    attachInterrupt(digitalPinToInterrupt(signal), count, FALLING);
    pulses = 0;
    rpm = 0;
    timeOld = 0;
}

int readRPM(){
    if(millis() - timeOld >= 1000){
        detachInterrupt(digitalPinToInterrupt(signal));
        rpm = (60 * 1000 / pulses_per_turn) / (millis() - timeOld) * pulses;
        timeOld = millis();
        pulses = 0;
        return rpm;
        attachInterrupt(digitalPinToInterrupt(signal), count, FALLING);
    }
}