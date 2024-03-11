#include <Adafruit_GFX.h>
#include <Adafruit_GrayOLED.h>
#include <Adafruit_SPITFT.h>
#include <Adafruit_SPITFT_Macros.h>
#include <Adafruit_MPU6050.h>
#include <gfxfont.h>

#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <HardwareSerial.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// network credentials
const char* ssid = "OnePlus 9RT 5G";
const char* password = "alvin12345";

// MPU variables
sensors_event_t a, g, temp;
sensors_event_t previous_a, previous_g, previous_temp;

const char* ca = \
"-----BEGIN CERTIFICATE-----\n" \
"MIIE6DCCA9CgAwIBAgIQAnQuqhfKjiHHF7sf/P0MoDANBgkqhkiG9w0BAQsFADBh\n" \
"MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\n" \
"d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD\n" \
"QTAeFw0yMDA5MjMwMDAwMDBaFw0zMDA5MjIyMzU5NTlaME0xCzAJBgNVBAYTAlVT\n" \
"MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxJzAlBgNVBAMTHkRpZ2lDZXJ0IFNIQTIg\n" \
"U2VjdXJlIFNlcnZlciBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB\n" \
"ANyuWJBNwcQwFZA1W248ghX1LFy949v/cUP6ZCWA1O4Yok3wZtAKc24RmDYXZK83\n" \
"nf36QYSvx6+M/hpzTc8zl5CilodTgyu5pnVILR1WN3vaMTIa16yrBvSqXUu3R0bd\n" \
"KpPDkC55gIDvEwRqFDu1m5K+wgdlTvza/P96rtxcflUxDOg5B6TXvi/TC2rSsd9f\n" \
"/ld0Uzs1gN2ujkSYs58O09rg1/RrKatEp0tYhG2SS4HD2nOLEpdIkARFdRrdNzGX\n" \
"kujNVA075ME/OV4uuPNcfhCOhkEAjUVmR7ChZc6gqikJTvOX6+guqw9ypzAO+sf0\n" \
"RR3w6RbKFfCs/mC/bdFWJsCAwEAAaOCAa4wggGqMB0GA1UdDgQWBBQPgGEcgjFh\n" \
"1S8o541GOLQs4cbZ4jAfBgNVHSMEGDAWgBQD3lA1VtFMu2bwo+IbG8OXsj3RVTAO\n" \
"BgNVHQ8BAf8EBAMCAYYwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMBIG\n" \
"A1UdEwEB/wQIMAYBAf8CAQAwdgYIKwYBBQUHAQEEajBoMCQGCCsGAQUFBzABhhho\n" \
"dHRwOi8vb2NzcC5kaWdpY2VydC5jb20wQAYIKwYBBQUHMAKGNGh0dHA6Ly9jYWNl\n" \
"cnRzLmRpZ2ljZXJ0LmNvbS9EaWdpQ2VydEdsb2JhbFJvb3RDQS5jcnQwewYDVR0f\n" \
"BHQwcjA3oDWgM4YxaHR0cDovL2NybDMuZGlnaWNlcnQuY29tL0RpZ2lDZXJ0R2xv\n" \
"YmFsUm9vdENBLmNybDA3oDWgM4YxaHR0cDovL2NybDQuZGlnaWNlcnQuY29tL0Rp\n" \
"Z2lDZXJ0R2xvYmFsUm9vdENBLmNybDAwBgNVHSAEKTAnMAcGBWeBDAEBMAgGBmeB\n" \
"DAECATAIBgZngQwBAgIwCAYGZ4EMAQIDMA0GCSqGSIb3DQEBCwUAA4IBAQB3MR8I\n" \
"l9cSm2PSEWUIpvZlubj6kgPLoX7hyA2MPrQbkb4CCF6fWXF7Ef3gwOOPWdegUqHQ\n" \
"S1TSSJZI73fpKQbLQxCgLzwWji3+HlU87MOY7hgNI+gH9bMtxKtXc1r2G1O6+x/6\n" \
"vYzTUVEgR17vf5irF0LKhVyfIjc0RXbyQ14AniKDrN+v0ebHExfppGlkTIBn6rak\n" \
"f4994VH6npdn6mkus5CkHBXIrMtPKex6XF2firjUDLuU7tC8y7WlHgjPxEEDDb0G\n" \ 
"w6D0yDdVSvG/5XlCNatBmO/8EznDu1vr72N8gJzISUZwa6CCUD7QBLbKJcXBBVVf\n" \
"8nwvV9GvlW+sbXlr\n" \
"-----END CERTIFICATE-----\n";

// Define NTP Client to get time
WiFiUDP ntpUDP;
WiFiClientSecure wifi;
HTTPClient http;
Adafruit_MPU6050 mpu;
NTPClient timeClient(ntpUDP);
HardwareSerial sim800l(2);
char daysOfTheWeek[7][12] = { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 64  // OLED display height, in pixels
int button;
int button_menu;
int steps = 0;
String json;
DynamicJsonDocument doc(4096);

// Color definitions
// Declaration for SSD1306 display connected using software SPI (default case):
#define i2c_Address 0x3c
#define OLED_RESET -1
Adafruit_SH1106G display = Adafruit_SH1106G(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
void setup() {
  pinMode(18, INPUT);
  pinMode(23, INPUT);
  Serial.begin(115200);
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  wifi.setInsecure();
  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  timeClient.begin();
  if (!mpu.begin()) {
    Serial.println("MPU6050 failed");
    while (1)
      yield();
  }
  Serial.println("Found a MPU-6050 sensor");
  // Set offset time in seconds to adjust for your timezone, for example:
  // GMT +1 = 3600
  // GMT +8 = 28800
  // GMT -1 = -3600
  // GMT 0 = 0
  timeClient.setTimeOffset(19800);  // 6060(+5.5)
  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  display.begin(i2c_Address, true);
  // Show initial display buffer contents on the screen --
  // the library initializes this with an Adafruit splash screen.
  //display.display();
  //delay(2000); // Pause for 2 seconds
  // Clear the buffer
  // Clear the buffer.
  //display.clearDisplay();
  // Display bitmap
  //display.drawBitmap(0, 0, myBitmap, 128, 64, BLACK, WHITE);
  display.display();
  mpu.getEvent(&previous_a, &previous_g, &previous_temp);
  mpu.getEvent(&a, &g, &temp);
}
void loop() {
  Clock();
}
int Clock() {
  Serial.println("IM ON CLOCKKKKKKKKKK");
  timeClient.update();
  String day = daysOfTheWeek[timeClient.getDay()];
  int hour = int(timeClient.getHours());
  int minute = int(timeClient.getMinutes());
  int second = int(timeClient.getSeconds());
  String date = timeClient.getFormattedDate();
  int current_year = date.substring(0, 4).toInt();
  int current_month = date.substring(5, 7).toInt();
  int current_date = date.substring(8, 10).toInt();
  //int year = int(timeClient.getYear());
  unsigned long previousMillis = 0;
  const long interval = 1000;
  for (;;) {
    unsigned long currentMillis = millis();
    // visibility off/on
    if (currentMillis - previousMillis >= interval) {
      // save the last time you blinked the LED
      previousMillis = currentMillis;
      display.clearDisplay();
      // if (button==0)
      Clock_Home(hour, minute, second, "", current_date, current_month, current_year, day, SH110X_WHITE);
      // else
      // Clock_Home(hour,minute,second,"PM",6,9,2020, day,BLACK);
      second++;

      http.begin(wifi, "https://shiny-funicular-7wwg56x5v6wfr5vj-8000.app.github.dev/append_data");
      http.addHeader("Content-Type", "application/json");
      JsonObject gyroscopeObj = doc.createNestedObject("gyroscope");
  //     double z_acl = (a.acceleration.z - previous_a.acceleration.z);
  // double y_acl = (a.acceleration.y - previous_a.acceleration.y);
  // double x_acl = (a.acceleration.x - previous_a.acceleration.x);
      gyroscopeObj["x"] = a.gyro.x;
      gyroscopeObj["y"] = a.gyro.y;
      gyroscopeObj["z"] = a.gyro.z;

      JsonObject accelerometerObj = doc.createNestedObject("accelerometer");
      accelerometerObj["x"] = a.acceleration.x;
      accelerometerObj["y"] = a.acceleration.y;
      accelerometerObj["z"] = a.acceleration.z;

      doc["steps"] = steps;
      serializeJson(doc, json);
      Serial.println(json);
      http.POST(json);
      // Serial.println(http.getString());
      http.end();

      if (second >= 60) {
        second = 0;
        minute++;
      }
      if (minute >= 60) {
        minute = 0;
        hour++;
      }
      if (hour >= 24) {
        second = 0;
        minute = 0;
        hour = 0;
        steps = 0;
        ESP.restart();
      }

      // if(second<10){
      // second
      // }
    }
  }
}

int check_fallen() {
  previous_a = a;
  previous_g = g;
  previous_temp = temp;
  mpu.getEvent(&a, &g, &temp);
  double z_acl = (a.acceleration.z - previous_a.acceleration.z);
  double y_acl = (a.acceleration.y - previous_a.acceleration.y);
  double x_acl = (a.acceleration.x - previous_a.acceleration.x);
  Serial.print("Accelerometer ");
  Serial.print("X: ");
  Serial.print(a.acceleration.x, 1);
  Serial.print(" m/s^2, ");
  Serial.print("Y: ");
  Serial.print(a.acceleration.y, 1);
  Serial.print(" m/s^2, ");
  Serial.print("Z: ");
  Serial.print(a.acceleration.z, 1);
  Serial.println(" m/s^2");



  Serial.print("Gyroscope ");
  Serial.print("X: ");
  Serial.print(g.gyro.x, 1);
  Serial.print(" rps, ");
  Serial.print("Y: ");
  Serial.print(g.gyro.y, 1);
  Serial.print(" rps, ");
  Serial.print("Z: ");
  Serial.print(g.gyro.z, 1);
  Serial.println(" rps");

  float acceleration_x = a.acceleration.x;
  float acceleration_y = a.acceleration.y;
  float acceleration_z = a.acceleration.z;
  float jitter = sqrt(a.acceleration.x + a.acceleration.y + a.acceleration.z);
  float pjitter = (jitter / 100);
  Serial.println(jitter);
  Serial.println(pjitter);
  if (sqrt((x_acl * x_acl) + (y_acl * y_acl) + (z_acl * z_acl)) > 4) {
    steps++;
  }
  Serial.println(sqrt((x_acl * x_acl) + (y_acl * y_acl) + (z_acl * z_acl)));
  if (z_acl > 3) {
    http.begin(wifi, "https://shiny-funicular-7wwg56x5v6wfr5vj-8000.app.github.dev/send_message");
    http.addHeader("Content-Type", "application/json");
    http.GET();
    Serial.println(http.getString());
        
    return 1;
  } else {
    return 0;
  }
}

int Clock_Home(int hour, int minute, int second, String am_pm, int date, int month, int year, String day, int VISIBLE) {
  display.clearDisplay();
  display.setTextSize(1);  // Draw 1X-scale text
  display.setTextColor(VISIBLE);
  display.setCursor(0, 0);
  display.println(day);
  display.setTextSize(2);
  display.setCursor(10, 25);
  if (check_fallen()) {
    display.print("SOS :(");
  } else if (hour == 6 && minute == 0) {
    display.print("WAKE UP :)");
  } else if (hour == 8 && minute == 0) {
    display.print("BREAKFAST :)");
    // put buzzer or whatever sound thing here
  } else if (hour == 12 && minute == 30) {
    display.print("LUNCH :)");
    // put buzzer or whatever sound thing here
  } else if (hour == 7 && minute == 30) {
    display.print("DINNER :)");
    // put buzzer or whatever sound thing here
  } else if (hour == 10 && minute == 0) {
    display.print("SLEEP :)");
  } else {
    if (hour < 10) {
      display.print("0" + String(hour));
    } else {
      display.print(hour);
    }
    display.print(":");
    if (minute < 10) {
      display.print("0" + String(minute));
    } else {
      display.print(minute);
    }
    display.print(":");
    if (second < 10) {
      display.print("0" + String(second));
    } else {
      display.print(second);
    }
    //display.println(am_pm);
    display.setTextSize(1);
    display.setCursor(35, 46);
    display.print(String(steps) + " steps");
    display.setCursor(30, 56);
    if (int(date) < 10) {
      display.print("0" + String(date));
    } else {
      display.print(String(date));
    }
    display.print("/");
    if (month < 10) {
      display.print(String(0) + String(month));
    } else {
      display.print(month);
    }
    display.print("/");
    display.print(year);
    display.print("          ");
    // display.println(F("DAY"));  // Show initial text
    //display.clearDisplay();
  }
  display.display();
  delay(100);
  return 0;
  // delay(7000);
}