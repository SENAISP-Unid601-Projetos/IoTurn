#include "Sensor_RPM.h"
#include <Arduino.h>

const int signalPulse = 48; 
volatile unsigned long pulses = 0;
int currentRpm = 0;
const unsigned long CALCULATION_INTERVAL = 1000; 
unsigned long previousMillis = 0;

const unsigned int pulses_per_turn = 1;

void IRAM_ATTR count() {
    pulses++;
}

void startRPM() {
    pinMode(signalPulse, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(signalPulse), count, FALLING);
    previousMillis = millis();
}

// Função que deve ser chamada repetidamente no loop principal
void calculateRPM() {
    if (millis() - previousMillis >= CALCULATION_INTERVAL) {
        
        unsigned long pulses_copy;

        noInterrupts(); 
        pulses_copy = pulses; // Copia o valor de forma segura
        pulses = 0;           // Zera a contagem para o próximo intervalo
        interrupts();         // Fim da Seção Crítica: reabilita interrupções
        
        // Calcula o tempo real decorrido
        unsigned long elapsedTime = millis() - previousMillis;
        previousMillis = millis();

        // Calcula o RPM
        // (pulsos / pulsos_por_volta) -> número de voltas
        // (60000 / tempo_decorrido) -> fator de conversão para minutos
        currentRpm = (pulses_copy * 60000.0) / (pulses_per_turn * elapsedTime);
    }
}

// Função para obter o último valor de RPM calculado
int getRPM() {
    return currentRpm;
}
