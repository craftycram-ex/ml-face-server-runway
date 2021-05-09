// import libraries
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsClient.h>
#include <Hash.h>

// initialize libraries
ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

// define constants
#define USE_SERIAL Serial
#define ledG D0
#define ledR D1

// handle websocket events
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  // check for event type
  switch (type) {
    case WStype_DISCONNECTED:
      // log disconnect event
      USE_SERIAL.printf("[WSc] Disconnected!\n");
      break;
    case WStype_CONNECTED: {
        // log connect event
        USE_SERIAL.printf("[WSc] Connected to url: %s\n", payload);
        // send message to server when Connected
        webSocket.sendTXT("howdy server");
      }
      break;
    case WStype_TEXT:
      // recieve message event
      USE_SERIAL.printf("[WSc] get text: %s\n", payload);
      // parse state and set led's accordingly
      switch (payload[0]) {
        case '0':
          // nobody in camera, led' off
          digitalWrite(ledG, LOW);
          digitalWrite(ledR, LOW);
          break;
        case '1':
          // only owner in camera, only green led on
          digitalWrite(ledG, HIGH);
          digitalWrite(ledR, LOW);
          break;
        case '2':
          // owner and strangers in camera, both led's on
          digitalWrite(ledG, HIGH);
          digitalWrite(ledR, HIGH);
          break;
        case '3':
          // only strangers in camera, only red led on
          digitalWrite(ledG, LOW);
          digitalWrite(ledR, HIGH);
          break;
        default:
          break;
      }
      webSocket.sendTXT("updated leds");
      break;
    case WStype_BIN:
      USE_SERIAL.printf("[WSc] get binary length: %u\n", length);
      hexdump(payload, length);

      // send data to server
      // webSocket.sendBIN(payload, length);
      break;
    case WStype_PING:
      // pong will be send automatically
      USE_SERIAL.printf("[WSc] get ping\n");
      break;
    case WStype_PONG:
      // answer to a ping we send
      USE_SERIAL.printf("[WSc] get pong\n");
      break;
  }
}

void setup() {
  USE_SERIAL.setDebugOutput(true);

  // set pin modes
  pinMode(ledG, OUTPUT);
  pinMode(ledR, OUTPUT);

  // write leds to low on startup
  digitalWrite(ledG, LOW);
  digitalWrite(ledR, LOW);

  // wait for boot
  for (uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  // add wifi connection
  WiFiMulti.addAP("ssid", "pwd"); // set your wifi credentials here!

  // connect to wifi
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  // connect to websocker server
  webSocket.begin("serverip", 81, "/"); // set backend server ip here

  // set websocket event handler
  webSocket.onEvent(webSocketEvent);

  // set reconnect interval to five seconds if connection lost
  webSocket.setReconnectInterval(5000);

  // enable heartbeat signal
  webSocket.enableHeartbeat(15000, 3000, 2);

}

// loop websocket
void loop() {
  webSocket.loop();
}
