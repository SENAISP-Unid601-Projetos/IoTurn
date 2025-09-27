#ifndef MQTT_SERVICE_H
#define MQTT_SERVICE_H

#include <WiFi.h>
#include <PubSubClient.h>
#include <HTTPClient.h>

bool getNewMqttMessage(char* buffer, size_t bufferSize);
void setup_wifi(const char* ssid, const char* password);
void mqtt_setup(const char* broker, uint16_t port = 1883);
void mqtt_loop();
void mqtt_publish(const char* topic, const char* message);
void callback(char* topic, byte* payload, unsigned int length);
String httpGETRequest(const char* serverName);

#endif
