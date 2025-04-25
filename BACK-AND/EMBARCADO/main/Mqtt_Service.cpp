#include "mqtt_service.h"

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi(const char* ssid, const char* password) {
  delay(10);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi conectado!");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Tentando conectar ao MQTT... ");
    String clientId = "ESP32";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("Conectado!");
    } else {
      Serial.print("Falhou, rc=");
      Serial.print(client.state());
      Serial.println(" tentando de novo em 5 segundos...");
      delay(5000);
    }
  }
}

void mqtt_setup(const char* broker, uint16_t port) {
  client.setServer(broker, port);
}

void mqtt_loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}

void mqtt_publish(const char* topic, const char* message) {
  client.publish(topic, message);
  Serial.print("Publicou no tópico ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(message);
}
