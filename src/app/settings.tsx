import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  Bell,
  Camera,
  ChevronRight,
  Eye,
  Globe,
  Info,
  Mic,
  Moon,
  Settings as SettingsIcon,
  ShieldCheck,
  Vibrate,
  Volume2,
} from "lucide-react-native";

type SettingsRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  background: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
};

function SettingsRow({
  icon,
  title,
  description,
  background,
  rightElement,
  onPress,
}: SettingsRowProps) {
  return (
    <Pressable style={styles.settingRow} onPress={onPress}>
      <View style={[styles.settingIcon, { backgroundColor: background }]}>
        {icon}
      </View>

      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>

      {rightElement || <ChevronRight size={20} color="#98A2B3" />}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [backendUrl, setBackendUrl] = useState("http://10.58.116.91:8000");
  const [testingConnection, setTestingConnection] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#17233D" />
          </Pressable>

          <View>
            <Text style={styles.title}>Settings</Text>

            <Text style={styles.subtitle}>
              Customize your VisionPath experience
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* SETTINGS HERO CARD */}
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <SettingsIcon size={28} color="#FFFFFF" />
            </View>

            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Personalize VisionPath</Text>

              <Text style={styles.heroDescription}>
                Adjust accessibility, voice, camera and notification
                preferences.
              </Text>
            </View>
          </View>

          {/* VOICE & ACCESSIBILITY */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Voice & Accessibility</Text>

            <Text style={styles.sectionSubtitle}>
              Customize how VisionPath communicates with you
            </Text>
          </View>

          <View style={styles.settingsCard}>
            <SettingsRow
              icon={<Volume2 size={21} color="#18865A" />}
              title="Voice Assistance"
              description="Enable spoken guidance and feedback"
              background="#EAF8F0"
              rightElement={
                <Switch
                  value={voiceEnabled}
                  onValueChange={setVoiceEnabled}
                  trackColor={{
                    false: "#D0D5DD",
                    true: "#A8D5BE",
                  }}
                  thumbColor={voiceEnabled ? "#18865A" : "#FFFFFF"}
                />
              }
            />

            <View style={styles.divider} />

            <SettingsRow
              icon={<Mic size={21} color="#8B5CF6" />}
              title="Voice Commands"
              description="Configure assistant voice interaction"
              background="#F1EBFF"
              onPress={() => router.push("/assistant")}
            />

            <View style={styles.divider} />

            <SettingsRow
              icon={<Eye size={21} color="#1761B0" />}
              title="Visual Accessibility"
              description="Text size, contrast and display options"
              background="#E7EFF9"
            />
          </View>

          {/* BACKEND CONFIGURATION */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Backend Configuration</Text>

            <Text style={styles.sectionSubtitle}>
              Configure API backend connection
            </Text>
          </View>

          <View style={styles.settingsCard}>
            <SettingsRow
              icon={<Globe size={21} color="#1761B0" />}
              title="Backend Server URL"
              description="Change the backend server URL"
              background="#E7EFF9"
              rightElement={
                <Pressable
                  onPress={async () => {
                    if (!isValidUrl(backendUrl)) {
                      Alert.alert("Invalid URL", "Please enter a valid URL format (e.g., http://192.168.1.100:8000)");
                      return;
                    }
                    
                    setTestingConnection(true);
                    const result = await testBackendConnection(backendUrl);
                    setTestingConnection(false);
                    
                    if (result.success) {
                      Alert.alert("Connection Successful", result.message);
                    } else {
                      Alert.alert("Connection Failed", result.message);
                    }
                  }}
                  disabled={testingConnection}
                >
                  <Text style={[
                    styles.testButton,
                    testingConnection && styles.testButtonDisabled
                  ]}>
                    {testingConnection ? "Testing..." : "Test Connection"}
                  </Text>
                </Pressable>
              }
            />

            <View style={styles.divider} />

            <SettingsRow
              icon={<SettingsIcon size={21} color="#1761B0" />}
              title="Backend Configuration"
              description="Manage API backend settings"
              background="#E7EFF9"
            />
          </View>

          {/* CAMERA */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Camera & Vision</Text>

            <Text style={styles.sectionSubtitle}>
              Manage camera-based AI features
            </Text>
          </View>

          <View style={styles.settingsCard}>
            <SettingsRow
              icon={<Camera size={21} color="#1761B0" />}
              title="Camera Preferences"
              description="Configure camera and detection settings"
              background="#E7EFF9"
              onPress={() => router.push("/camera")}
            />

            <View style={styles.divider} />

            <SettingsRow
              icon={<ShieldCheck size={21} color="#18865A" />}
              title="Detection Feedback"
              description="Control alerts for detected objects"
              background="#EAF8F0"
            />
          </View>

          {/* NOTIFICATIONS */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>

            <Text style={styles.sectionSubtitle}>
              Control alerts and feedback
            </Text>
          </View>

          <View style={styles.settingsCard}>
            <SettingsRow
              icon={<Bell size={21} color="#E58A18" />}
              title="Notifications"
              description="Receive important VisionPath updates"
              background="#FFF4E5"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{
                    false: "#D0D5DD",
                    true: "#A9C9EA",
                  }}
                  thumbColor={notificationsEnabled ? "#1761B0" : "#FFFFFF"}
                />
              }
            />

            <View style={styles.divider} />

            <SettingsRow
              icon={<Vibrate size={21} color="#8B5CF6" />}
              title="Vibration Feedback"
              description="Use vibration for important alerts"
              background="#F1EBFF"
              rightElement={
                <Switch
                  value={vibrationEnabled}
                  onValueChange={setVibrationEnabled}
                  trackColor={{
                    false: "#D0D5DD",
                    true: "#C9B3F5",
                  }}
                  thumbColor={vibrationEnabled ? "#8B5CF6" : "#FFFFFF"}
                />
              }
            />
          </View>

          {/* APP PREFERENCES */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>App Preferences</Text>

            <Text style={styles.sectionSubtitle}>
              Appearance and application information
            </Text>
          </View>

          <View style={styles.settingsCard}>
            <SettingsRow
              icon={<Moon size={21} color="#344054" />}
              title="Dark Mode"
              description="Switch between light and dark appearance"
              background="#EEF2F6"
              rightElement={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{
                    false: "#D0D5DD",
                    true: "#344054",
                  }}
                  thumbColor="#FFFFFF"
                />
              }
            />

            <View style={styles.divider} />

            <SettingsRow
              icon={<Info size={21} color="#1761B0" />}
              title="About VisionPath AI"
              description="Version, features and app information"
              background="#E7EFF9"
            />
          </View>

          <View style={styles.versionCard}>
            <Text style={styles.versionTitle}>VisionPath AI</Text>

            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if URL format is valid (basic check).
 */
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Test connection to backend.
 */
async function testBackendConnection(url: string): Promise<{ success: boolean; message: string }> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`${url}/health`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                message: `Connected! Backend is ready (version ${data.version}).`,
            };
        } else {
            return {
                success: false,
                message: `Backend responded with error: ${response.status}`,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `Cannot connect to backend. Check your network and URL.`,
        };
    }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEF2F8",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
    elevation: 2,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#17233D",
  },

  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#667085",
  },

  scrollContent: {
    paddingBottom: 10,
  },

  heroCard: {
    backgroundColor: "#17233D",
    borderRadius: 25,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#1761B0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  heroContent: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  heroDescription: {
    marginTop: 4,
    fontSize: 10.5,
    lineHeight: 15,
    color: "#B8C5D9",
  },

  sectionHeader: {
    marginBottom: 9,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#17233D",
  },

  sectionSubtitle: {
    marginTop: 2,
    fontSize: 10.5,
    color: "#667085",
  },

  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 14,
    marginBottom: 20,
  },

  settingRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
  },

  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  settingContent: {
    flex: 1,
    paddingRight: 8,
  },

  settingTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#17233D",
  },

  settingDescription: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 14,
    color: "#667085",
  },

  /* TEST CONNECTION BUTTON */
  testButton: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1761B0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#E7EFF9",
    borderRadius: 8,
  },

  testButtonDisabled: {
    opacity: 0.6,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF2F6",
    marginLeft: 55,
  },

  versionCard: {
    alignItems: "center",
    paddingVertical: 12,
  },

  versionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#667085",
  },

  versionText: {
    marginTop: 3,
    fontSize: 10,
    color: "#98A2B3",
  },

  bottomSpace: {
    height: 20,
  },
});
