#include "Sensor_HCSR04.h"
#include "Arduino.h"
#define TRIG 33
#define ECHO 47

void startLevel(){
    pinMode(TRIG, OUTPUT);
    pinMode(ECHO, INPUT);
}

int readLevel(float tankHeight){
    digitalWrite(TRIG, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG, LOW);

    long signalDuration = pulseIn(ECHO, HIGH);
    float speedSound = 0.0343;
    float emptySpace  = (signalDuration * speedSound) / 2;
    float liquidHeight = tankHeight - emptySpace;
    float levelPercentage = (liquidHeight / tankHeight) * 100;

    if(levelPercentage < 0){
        levelPercentage = 0;
    }
    if(levelPercentage > 100){
        levelPercentage = 100;
    }

    return (int)levelPercentage;
}
