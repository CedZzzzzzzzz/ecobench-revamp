// ECOBENCH ESP32 FIRMWARE - FINAL 
// Hardware: ESP32 DevKit V1 + Waveshare 2.13" V4 (B74)

#include <Wire.h>
#include <SPI.h>
#include <WiFi.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_ADS1X15.h>
#include <GxEPD2_BW.h>
#include <Fonts/FreeSansBold12pt7b.h>
#include <Fonts/FreeSans9pt7b.h>
#include <Preferences.h>

// E-INK PINS (Waveshare V4)
#define EINK_CS   27
#define EINK_DC   26
#define EINK_RST  25
#define EINK_BUSY 33

GxEPD2_BW<GxEPD2_213_B74, GxEPD2_213_B74::HEIGHT> display(
  GxEPD2_213_B74(EINK_CS, EINK_DC, EINK_RST, EINK_BUSY)
);

// WIFI & API
// WiFi credentials are managed by WiFiManager - configured via captive portal
// API URL is stored in device memory and can be updated
WiFiManager wifiManager;
Preferences preferences;
char API_URL[256] = "http://192.168.1.100:8000/api/sensor-data-enhanced"; // Default, configurable 

// SENSORS & CALIBRATION 
Adafruit_ADS1115 ads; 
#define CURRENT_PIN 34

// --- CALIBRATION FIX ---
// Old Value: 2.51 -> Result: 1.3A (Too low)
// New Value: 2.64 -> Should result in ~0.0A
float ZERO_POINT = 2.38;    

float RESISTOR_RATIO = 1.0; 
float BATTERY_MULTIPLIER = 12.5;
float SENSITIVITY = 0.100;  
float NOISE_THRESHOLD = 0.15; // Ignore anything below 0.15A

// VARIABLES
const float MIN_DISCHARGE_FOR_PORT = 0.3;
const unsigned long UPDATE_INTERVAL = 5000; 
unsigned long lastUpdate = 0;

struct PortStatus {
  int portNumber;
  bool isActive;
  float estimatedCurrent;
  String deviceType;
  String status;
};

float currentBatteryVoltage = 0;
float currentCurrent = 0;
float currentPower = 0;
int currentBatteryPercent = 0;
int activePortCount = 0;
bool isCharging = false;

// SETUP
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n--- ECOBENCH RESTORED ---");

  // Initialize storage and load saved API URL
  preferences.begin("ecobench", false);
  String storedUrl = preferences.getString("api_url", API_URL);
  storedUrl.toCharArray(API_URL, sizeof(API_URL));

  SPI.begin(18, 19, 23);
  pinMode(CURRENT_PIN, INPUT);
  
  if (!ads.begin(0x48)) Serial.println("ADS1115 Failed!");
  
  display.init(115200); 
  display.setRotation(1);
  display.setTextColor(GxEPD_BLACK);
  
  showStartupScreen();
  
  // WiFi provisioning via captive portal
  configureWiFiWithManager();
}

// MAIN LOOP
void loop() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastUpdate >= UPDATE_INTERVAL) {
    
    // 1. Read & Process
    float batteryVolts = readBatteryVoltage();
    float totalCurrent = readCurrent(); // Smoothed & Zeroed
    
    currentBatteryVoltage = batteryVolts;
    currentCurrent = totalCurrent;
    currentPower = batteryVolts * abs(totalCurrent);
    currentBatteryPercent = calculateBatteryPercent(batteryVolts);
    isCharging = totalCurrent > 0.05;
    
    PortStatus ports[4];
    detectActivePorts(totalCurrent, ports);
    
    activePortCount = 0;
    for (int i = 0; i < 4; i++) {
      if (ports[i].isActive) activePortCount++;
    }
    
    // 2. Output
    displayReadings(batteryVolts, totalCurrent);
    updateEinkDisplay(); // Restored Design

    if (WiFi.status() == WL_CONNECTED) {
      sendDataToBackend(batteryVolts, totalCurrent, ports);
    } else {
      WiFi.reconnect();
    }
    
    lastUpdate = currentTime;
  }
}

// RESTORED DISPLAY DESIGN (With Battery Bar)
void updateEinkDisplay() {
  Serial.println("-> Updating Screen (Original Design)...");
  
  display.setFullWindow();
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    
    // ===== HEADER =====
    display.setFont(&FreeSansBold12pt7b);
    display.setCursor(5, 20);
    display.print("ECOBENCH");
    
    // ===== BATTERY SECTION =====
    display.setFont(&FreeSans9pt7b);
    display.setCursor(5, 45);
    display.print("Battery:");
    
    // Battery percentage (large)
    display.setFont(&FreeSansBold12pt7b);
    display.setCursor(100, 45);
    display.print(currentBatteryPercent);
    display.print("%");
    
    // --- THE BATTERY BAR IS BACK ---
    int barX = 5;
    int barY = 50;
    int barWidth = 160;
    int barHeight = 15;
    
    // Draw outline
    display.drawRect(barX, barY, barWidth, barHeight, GxEPD_BLACK);
    // Fill bar based on percent
    int fillWidth = (barWidth - 4) * currentBatteryPercent / 100;
    display.fillRect(barX + 2, barY + 2, fillWidth, barHeight - 4, GxEPD_BLACK);
    
    // ===== VOLTAGE & POWER =====
    display.setFont(&FreeSans9pt7b);
    display.setCursor(5, 85);
    display.print("Voltage:");
    display.setCursor(80, 85);
    display.print(currentBatteryVoltage, 1);
    display.print("V");
    
    display.setCursor(150, 85);
    display.print(currentPower, 1);
    display.print("W");
    
    // ===== CURRENT & PORTS =====
    display.setCursor(5, 105);
    display.print("Current:");
    display.setCursor(80, 105);
    if (currentCurrent >= 0) display.print("+");
    display.print(currentCurrent, 1); 
    display.print("A");
    
    display.setCursor(150, 105);
    display.print("Ports:");
    display.setCursor(210, 105);
    display.print(activePortCount);
    display.print("/4");
    
    // ===== STATUS =====
    display.setFont();
    display.setCursor(5, 115);
    if (isCharging) {
      display.print("Status: CHARGING");
    } else if (activePortCount > 0) {
      display.print("Status: DISCHARGING");
    } else {
      display.print("Status: STANDBY");
    }
    
  } while (display.nextPage());
  
  Serial.println("<- Screen Updated");
}

// SENSORS
float readBatteryVoltage() {
  int16_t adc1 = ads.readADC_SingleEnded(1);
  return (adc1 * 0.0001875) * BATTERY_MULTIPLIER;
}

float readCurrent() {
  float totalAmps = 0;
  // Increase samples for better stability
  for (int i = 0; i < 60; i++) {
    int rawCurrent = analogRead(CURRENT_PIN);
    float pinVoltage = (rawCurrent / 4095.0) * 3.3;
    float sensorOutputVoltage = pinVoltage * RESISTOR_RATIO;
    // Uses the new calibrated ZERO_POINT (2.64)
    float amps = (sensorOutputVoltage - ZERO_POINT) / SENSITIVITY;
    totalAmps += amps;
    delay(1);
  }
  float averageAmps = totalAmps / 60.0;

  // Hard Zero Clamp
  if (abs(averageAmps) < NOISE_THRESHOLD) averageAmps = 0.00;
  return averageAmps;
}

// HELPERS
void showStartupScreen() {
  display.setFullWindow();
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.setFont(&FreeSansBold12pt7b);
    display.setCursor(20, 30);
    display.print("ECOBENCH");
    display.setFont(&FreeSans9pt7b);
    display.setCursor(30, 60);
    display.print("Calibrating...");
  } while (display.nextPage());
}

int calculateBatteryPercent(float voltage) {
  if (voltage >= 9.0) return 100;
  if (voltage <= 6.0) return 0;
  return map((long)(voltage * 100), 600, 900, 0, 100);
}

void detectActivePorts(float totalCurrent, PortStatus ports[]) {
  int activePorts = 0;
  float dischargeCurrent = 0.0;
  if (totalCurrent < -MIN_DISCHARGE_FOR_PORT) {
    dischargeCurrent = abs(totalCurrent);
    if (dischargeCurrent >= 0.4 && dischargeCurrent <= 1.5) activePorts = 1;
    else if (dischargeCurrent >= 1.6 && dischargeCurrent <= 3.0) activePorts = 2;
    else if (dischargeCurrent >= 3.1 && dischargeCurrent <= 4.5) activePorts = 3;
    else if (dischargeCurrent >= 4.6) activePorts = 4;
  }
  String portTypes[4] = {"USB-C", "Lightning", "USB-C", "Lightning"};
  for (int i = 0; i < 4; i++) {
    ports[i].portNumber = i + 1;
    ports[i].deviceType = portTypes[i];
    if (i < activePorts) {
      ports[i].isActive = true;
      ports[i].status = "CHARGING";
      ports[i].estimatedCurrent = dischargeCurrent / activePorts;
    } else {
      ports[i].isActive = false;
      ports[i].status = "AVAILABLE";
      ports[i].estimatedCurrent = 0.0;
    }
  }
}

void displayReadings(float voltage, float totalCurrent) {
  Serial.print("V: "); Serial.print(voltage);
  Serial.print(" | A: "); Serial.println(totalCurrent);
}

void configureWiFiWithManager() {
  // WiFiManager handles WiFi provisioning via captive portal
  // On first boot or if WiFi is unavailable, a config portal appears
  // Users connect to "EcoBench-Setup" network to enter WiFi credentials
  
  wifiManager.setConfigPortalTimeout(300); // 5 minute timeout
  
  // Custom parameter for API URL configuration
  WiFiManagerParameter custom_api_url("apiurl", "API URL", API_URL, 256);
  wifiManager.addParameter(&custom_api_url);
  
  // Try to connect to previously saved WiFi
  // If not found, start config portal
  if (!wifiManager.autoConnect("EcoBench-Setup", "setup123")) {
    Serial.println("WiFi setup timeout - restarting");
    delay(3000);
    ESP.restart();
  }
  
  // Connected to WiFi successfully
  Serial.println("\n✓ WiFi Connected!");
  Serial.print("  SSID: ");
  Serial.println(WiFi.SSID());
  Serial.print("  IP:   ");
  Serial.println(WiFi.localIP());
  
  // Update API URL if changed in config portal
  String newUrl = custom_api_url.getValue();
  if (newUrl.length() > 10) { // Sanity check
    newUrl.toCharArray(API_URL, sizeof(API_URL));
    preferences.putString("api_url", API_URL);
    Serial.print("  API URL updated: ");
    Serial.println(API_URL);
  }
}

void sendDataToBackend(float voltage, float totalCurrent, PortStatus ports[]) {
  HTTPClient http;
  StaticJsonDocument<512> doc;
  doc["voltage"] = round(voltage * 100) / 100.0;
  doc["current"] = round(totalCurrent * 100) / 100.0;
  JsonArray portsArray = doc.createNestedArray("ports");
  for (int i = 0; i < 4; i++) {
    JsonObject port = portsArray.createNestedObject();
    port["port_number"] = ports[i].portNumber;
    port["device_type"] = ports[i].deviceType;
    port["is_active"] = ports[i].isActive;
    port["status"] = ports[i].status;
    port["current"] = ports[i].isActive ? (round(ports[i].estimatedCurrent * 100) / 100.0) : 0.0;
    if (ports[i].isActive) {
      port["voltage"] = 5.0;
      port["power"] = round((5.0 * ports[i].estimatedCurrent) * 10) / 10.0;
    }
  }
  int activeCount = 0;
  for (int i = 0; i < 4; i++) if (ports[i].isActive) activeCount++;
  doc["active_ports"] = activeCount;
  doc["available_ports"] = 4 - activeCount;
  String jsonString;
  serializeJson(doc, jsonString);
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  http.POST(jsonString);
  http.end();
}