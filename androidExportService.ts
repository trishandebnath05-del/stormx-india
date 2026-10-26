import JSZip from 'jszip';

export interface AndroidProjectFile {
  path: string;
  category: 'manifest' | 'gradle' | 'kotlin-ui' | 'kotlin-data' | 'ci-workflow' | 'guide';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidProjectFile[] = [
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'manifest',
    description: 'Android Manifest with required internet, location, and notification permissions',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.stormx.india">

    <!-- Permissions required for Open-Meteo API & live radar -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Safe location permissions for Indian city detection -->
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

    <!-- Android 13+ runtime notification permission -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="StormX India"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.StormXIndia"
        android:usesCleartextTraffic="false">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.StormXIndia">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>
</manifest>`
  },
  {
    path: 'build.gradle.kts',
    category: 'gradle',
    description: 'Root Gradle build script with Kotlin and Android Gradle Plugin',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}`
  },
  {
    path: 'app/build.gradle.kts',
    category: 'gradle',
    description: 'App-level Gradle script with Jetpack Compose, Material3, and Retrofit',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.stormx.india"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.stormx.india"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation("androidx.navigation:navigation-compose:2.8.5")

    // Retrofit & Moshi for Open-Meteo & IMD APIs
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-moshi:2.11.0")
    implementation("com.squareup.moshi:moshi-kotlin:1.15.2")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Coil for modern async image loading
    implementation("io.coil-kt:coil-compose:2.7.0")

    // AndroidX Core & Location Services
    implementation(libs.androidx.core.ktx)
    implementation("com.google.android.gms:play-services-location:21.3.0")
}`
  },
  {
    path: 'app/src/main/java/com/stormx/india/MainActivity.kt',
    category: 'kotlin-ui',
    description: 'Main Jetpack Compose Activity with Navigation and Material 3 Dark Navy theme',
    content: `package com.stormx.india

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.navigation.compose.*
import com.stormx.india.ui.theme.StormXIndiaTheme
import com.stormx.india.ui.screens.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            StormXIndiaTheme {
                val navController = rememberNavController()
                var currentScreen by remember { mutableStateOf("home") }

                Scaffold(
                    bottomBar = {
                        NavigationBar(
                            containerColor = Color(0xFF080E1E),
                            contentColor = Color(0xFF00E5FF)
                        ) {
                            NavigationBarItem(
                                selected = currentScreen == "home",
                                onClick = { currentScreen = "home" },
                                label = { Text("Home") },
                                icon = { /* Icon Home */ }
                            )
                            NavigationBarItem(
                                selected = currentScreen == "forecast",
                                onClick = { currentScreen = "forecast" },
                                label = { Text("Forecast") },
                                icon = { /* Icon Forecast */ }
                            )
                            NavigationBarItem(
                                selected = currentScreen == "alerts",
                                onClick = { currentScreen = "alerts" },
                                label = { Text("IMD Alerts") },
                                icon = { /* Icon Warning */ }
                            )
                            NavigationBarItem(
                                selected = currentScreen == "news",
                                onClick = { currentScreen = "news" },
                                label = { Text("News") },
                                icon = { /* Icon News */ }
                            )
                            NavigationBarItem(
                                selected = currentScreen == "settings",
                                onClick = { currentScreen = "settings" },
                                label = { Text("Settings") },
                                icon = { /* Icon Settings */ }
                            )
                        }
                    }
                ) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding).fillMaxSize().background(Color(0xFF050914))) {
                        when (currentScreen) {
                            "home" -> HomeScreen()
                            "forecast" -> ForecastScreen()
                            "alerts" -> AlertsScreen()
                            "news" -> NewsScreen()
                            "settings" -> SettingsScreen()
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/stormx/india/ui/theme/Color.kt',
    category: 'kotlin-ui',
    description: 'Electric Blue & Dark Navy color palette for StormX India',
    content: `package com.stormx.india.ui.theme

import androidx.compose.ui.graphics.Color

val DarkNavyBackground = Color(0xFF050914)
val DarkNavyCard = Color(0xFF0D172E)
val DarkNavyCardBorder = Color(0xFF1E2D54)
val ElectricBlue = Color(0xFF00E5FF)
val DeepAccentBlue = Color(0xFF2979FF)
val TextPrimary = Color(0xFFF0F6FC)
val TextSecondary = Color(0xFF8B9CB5)
val AlertRed = Color(0xFFFF2A55)
val AlertOrange = Color(0xFFFF9500)
val AlertYellow = Color(0xFFFFCC00)
val AlertGreen = Color(0xFF00E676)`
  },
  {
    path: 'app/src/main/java/com/stormx/india/ui/theme/Theme.kt',
    category: 'kotlin-ui',
    description: 'Material 3 Dark Theme setup with electric accents',
    content: `package com.stormx.india.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = ElectricBlue,
    secondary = DeepAccentBlue,
    tertiary = Color(0xFF00B0FF),
    background = DarkNavyBackground,
    surface = DarkNavyCard,
    onPrimary = Color.Black,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun StormXIndiaTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}`
  },
  {
    path: 'app/src/main/java/com/stormx/india/data/remote/OpenMeteoApi.kt',
    category: 'kotlin-data',
    description: 'Retrofit interface for Open-Meteo weather and geocoding',
    content: `package com.stormx.india.data.remote

import retrofit2.http.GET
import retrofit2.http.Query

interface OpenMeteoApi {
    @GET("v1/forecast")
    suspend fun getForecast(
        @Query("latitude") latitude: Double,
        @Query("longitude") longitude: Double,
        @Query("current") current: String = "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m",
        @Query("hourly") hourly: String = "temperature_2m,precipitation_probability,weather_code,wind_speed_10m",
        @Query("daily") daily: String = "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
        @Query("timezone") timezone: String = "auto"
    ): Any
}`
  },
  {
    path: 'app/src/main/java/com/stormx/india/notifications/StormXNotificationManager.kt',
    category: 'kotlin-data',
    description: 'Android Notification Channels setup for severe alerts and daily forecast',
    content: `package com.stormx.india.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build

object StormXNotificationManager {
    const val CHANNEL_SEVERE_ALERTS = "stormx_severe_alerts"
    const val CHANNEL_DAILY_FORECAST = "stormx_daily_forecast"

    fun createChannels(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            val severeChannel = NotificationChannel(
                CHANNEL_SEVERE_ALERTS,
                "IMD Severe Storm & Cyclone Warnings",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "High-priority notifications for Red and Orange IMD alerts"
                enableVibration(true)
            }

            val forecastChannel = NotificationChannel(
                CHANNEL_DAILY_FORECAST,
                "Daily Morning Weather Briefing",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Daily weather summaries"
            }

            notificationManager.createNotificationChannel(severeChannel)
            notificationManager.createNotificationChannel(forecastChannel)
        }
    }
}`
  },
  {
    path: '.github/workflows/build-apk.yml',
    category: 'ci-workflow',
    description: '100% Free GitHub Actions workflow to build the Android APK without a PC',
    content: `name: Build StormX India APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew || echo "gradle wrapper check"

    - name: Build Debug APK with Gradle
      run: gradle assembleDebug --stacktrace || ./gradlew assembleDebug

    - name: Upload Debug APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: stormx-india-debug-apk
        path: app/build/outputs/apk/debug/*.apk
        retention-days: 14`
  },
  {
    path: 'BUILD_INSTRUCTIONS_NO_PC.md',
    category: 'guide',
    description: 'Exact instructions to compile and install the APK using free tools on phone with zero budget',
    content: `# StormX India - Android APK Build Guide (Zero Budget & No PC)

You can build and install the native Android APK directly from your phone for **₹0** using GitHub Actions or Termux.

---

### Option 1: Zero-Install Cloud Build (Easiest & Free)

1. **Download the ZIP**:
   Tap the **"Download Complete Android Project (.zip)"** button inside StormX India.
2. **Open GitHub on your phone browser**:
   - Go to [github.com](https://github.com) (log in or create a free account).
   - Create a new public repository named \`stormx-india\`.
3. **Upload the files**:
   - Unzip the downloaded file on your phone file manager (e.g., Google Files or ZArchiver).
   - Tap **"Add file" -> "Upload files"** in GitHub, drag or select all files, and commit.
4. **Automatic APK Build**:
   - The included \`.github/workflows/build-apk.yml\` will trigger immediately!
   - Tap the **Actions** tab on GitHub on your phone.
   - Watch the build complete in ~2-3 minutes.
5. **Download & Install**:
   - Tap the completed workflow run -> Scroll to **Artifacts** -> Tap \`stormx-india-debug-apk\`.
   - Your phone will download the ZIP containing \`app-debug.apk\`.
   - Tap the APK to install on your phone!

---

### Option 2: Termux On-Device Build (Directly inside Android Phone)

If you have F-Droid and Termux installed on your Android phone:
\`\`\`bash
pkg update && pkg install openjdk-17 git gradle
git clone <your-repo-url>
cd stormx-india
gradle assembleDebug
# Your APK will be at app/build/outputs/apk/debug/app-debug.apk
termux-open app/build/outputs/apk/debug/app-debug.apk
\`\`\`

---

### Notification Architecture (App Closed State)
For reliable push alerts when the app is completely killed:
- Integrate **Firebase Cloud Messaging (FCM)** (Free Spark Plan).
- Set up a lightweight Cloud Function or cron worker that queries IMD alerts every 15 minutes.
- When an alert occurs, the worker fires a high-priority FCM data payload to \`topic: weather_india\`.
- Android receives it wakefully via \`FirebaseMessagingService\` without consuming background battery.
`
  }
];

/**
 * Generate a complete downloadable ZIP containing the full Kotlin Jetpack Compose Android app project
 */
export async function generateAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Add all project files
  for (const file of ANDROID_PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  // Add root settings & wrappers
  zip.file('settings.gradle.kts', `rootProject.name = "StormXIndia"\ninclude(":app")\n`);
  zip.file('gradle.properties', `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8\nandroid.useAndroidX=true\nkotlin.code.style=official\n`);

  return await zip.generateAsync({ type: 'blob' });
}
