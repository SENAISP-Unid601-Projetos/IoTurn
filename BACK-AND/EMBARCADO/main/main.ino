#include "Sensor_DS18B20.h"
#include "Mqtt_Service.h"
#include "Converter.h"

const char* ssid = "linksys";
const char* password = "";
const char* broker = "10.110.12.51";

float gerarFloatAleatorio(float min, float max) {
  long inteiro = random(10000); // número entre 0 e 9999
  float valor = (float)inteiro / 10000.0; // transforma em float de 0.0 a 0.9999
  return min + valor * (max - min);       // escala para o intervalo desejado
}

void setup() {
  Serial.begin(115200);
  startTemperature();
  setup_wifi(ssid,password);
  mqtt_setup(broker);
  randomSeed(analogRead(A0));
}

void loop() {
  mqtt_loop();
  //float temp = readTemperature();
  float aleatorio = gerarFloatAleatorio(0.0, 1.0);
  mqtt_publish("esp32/sensor",floatToStr(aleatorio,2));
  //Serial.print("Temperautra:");
  //Serial.println(readTemperature());
  delay(2000);
}
