#include "Mqtt_Service.h"
#define MQTT_MSG_BUFFER_SIZE 256

WiFiClient espClient;
PubSubClient client(espClient);

static char s_mqttMessage[MQTT_MSG_BUFFER_SIZE];
static bool s_newMessageAvailable = false;

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
      client.subscribe("ioturn/gateways/all/commands");
      Serial.println("Inscrito no tópico 'ioturn/gateways/all/commands'");
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
  client.setCallback(callback);
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

void callback(char* topic, byte* payload, unsigned int length) {
  if (length < MQTT_MSG_BUFFER_SIZE) {
    memcpy(s_mqttMessage, payload, length);
    s_mqttMessage[length] = '\0'; // Adiciona o terminador nulo
    s_newMessageAvailable = true;
  } else {
    Serial.println("ERRO: Mensagem MQTT muito grande para o buffer!");
  }
}
bool getNewMqttMessage(char* buffer, size_t bufferSize) {
  // Esta seção é "atômica": a flag só é baixada depois de copiar a mensagem
  if (s_newMessageAvailable) {
    strncpy(buffer, s_mqttMessage, bufferSize - 1);
    buffer[bufferSize - 1] = '\0'; // Garante terminação nula
    s_newMessageAvailable = false; // "Consome" a mensagem
    return true;
  }
  return false;
}
String httpGETRequest(const char* serverName) {
  // Cria um objeto WiFiClient para ser gerenciado pelo HTTPClient
  WiFiClient client;
  HTTPClient http;
    
  // Inicia a requisição
  http.begin(client, serverName);
  
  // Envia a requisição GET
  int httpResponseCode = http.GET();
  
  String payload = "[]"; // Retorna um array JSON vazio em caso de erro
  
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    payload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  
  // Libera os recursos
  http.end();

  return payload;
}
