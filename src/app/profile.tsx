import { router } from "expo-router";
import React from "react";
import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    Accessibility,
    ArrowLeft,
    Bell,
    ChevronRight,
    Edit3,
    Eye,
    Info,
    Mic,
    Settings,
    Shield,
    User,
    Volume2,
} from "lucide-react-native";

type OptionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  background: string;
  onPress?: () => void;
};

function ProfileOption({
  icon,
  title,
  description,
  background,
  onPress,
}: OptionProps) {
  return (
    <Pressable style={styles.optionCard} onPress={onPress}>
      <View style={[styles.optionIcon, { backgroundColor: background }]}>
        {icon}
      </View>

      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>

        <Text style={styles.optionDescription}>{description}</Text>
      </View>

      <ChevronRight size={20} color="#98A2B3" />
    </Pressable>
  );
}

export default function ProfileScreen() {
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
            <Text style={styles.title}>Profile</Text>

            <Text style={styles.subtitle}>
              Manage your VisionPath experience
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* PROFILE CARD */}

          <View style={styles.profileCard}>
            <View style={styles.profileTop}>
              <View style={styles.avatar}>
                <User size={38} color="#FFFFFF" />
              </View>

              <Pressable style={styles.editButton}>
                <Edit3 size={17} color="#1761B0" />
              </Pressable>
            </View>

            <Text style={styles.userName}>VisionPath User</Text>

            <Text style={styles.userDescription}>
              Your personal AI vision companion
            </Text>

            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>VisionPath AI Active</Text>
            </View>
          </View>

          {/* ACCESSIBILITY */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Accessibility</Text>

            <Text style={styles.sectionSubtitle}>
              Personalize your experience
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <ProfileOption
              icon={<Volume2 size={21} color="#18865A" />}
              title="Voice Assistance"
              description="Voice guidance and spoken feedback"
              background="#EAF8F0"
              onPress={() => router.push("/settings")}
            />

            <View style={styles.divider} />

            <ProfileOption
              icon={<Eye size={21} color="#1761B0" />}
              title="Visual Preferences"
              description="Adjust display and visual accessibility"
              background="#E7EFF9"
              onPress={() => router.push("/settings")}
            />

            <View style={styles.divider} />

            <ProfileOption
              icon={<Mic size={21} color="#8B5CF6" />}
              title="Voice Commands"
              description="Manage how you interact with AI"
              background="#F1EBFF"
              onPress={() => router.push("/assistant")}
            />
          </View>

          {/* APP SETTINGS */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>App & Privacy</Text>

            <Text style={styles.sectionSubtitle}>Manage your preferences</Text>
          </View>

          <View style={styles.optionsContainer}>
            <ProfileOption
              icon={<Settings size={21} color="#1761B0" />}
              title="Settings"
              description="Camera, voice and app preferences"
              background="#E7EFF9"
              onPress={() => router.push("/settings")}
            />

            <View style={styles.divider} />

            <ProfileOption
              icon={<Bell size={21} color="#E58A18" />}
              title="Notifications"
              description="Manage alerts and important updates"
              background="#FFF4E5"
              onPress={() => router.push("/settings")}
            />

            <View style={styles.divider} />

            <ProfileOption
              icon={<Shield size={21} color="#18865A" />}
              title="Privacy & Security"
              description="Control your data and permissions"
              background="#EAF8F0"
              onPress={() => router.push("/settings")}
            />
          </View>

          {/* ABOUT CARD */}

          <View style={styles.aboutCard}>
            <View style={styles.aboutIcon}>
              <Accessibility size={23} color="#1761B0" />
            </View>

            <View style={styles.aboutContent}>
              <Text style={styles.aboutTitle}>VisionPath AI</Text>

              <Text style={styles.aboutDescription}>
                AI-powered environmental awareness and accessibility assistance.
              </Text>

              <View style={styles.versionRow}>
                <Info size={12} color="#98A2B3" />

                <Text style={styles.versionText}>Version 1.0.0</Text>
              </View>
            </View>
          </View>

          {/* BOTTOM SPACE */}

          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
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

  /* HEADER */

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

    shadowColor: "#667085",
    shadowOpacity: 0.06,
    shadowRadius: 8,
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

  /* PROFILE CARD */

  profileCard: {
    backgroundColor: "#17233D",
    borderRadius: 28,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  profileTop: {
    position: "relative",
    marginBottom: 12,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#1761B0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.1)",
  },

  editButton: {
    position: "absolute",
    right: -4,
    bottom: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  userDescription: {
    marginTop: 4,
    fontSize: 11,
    color: "#B8C5D9",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "rgba(53,208,127,0.12)",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#35D07F",
    marginRight: 7,
  },

  statusText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#E7FFF2",
  },

  /* SECTION */

  sectionHeader: {
    marginBottom: 9,
    marginTop: 2,
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

  /* OPTIONS */

  optionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginBottom: 19,
    paddingHorizontal: 14,
  },

  optionCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
  },

  optionIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#17233D",
  },

  optionDescription: {
    marginTop: 3,
    fontSize: 10,
    color: "#667085",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF2F6",
    marginLeft: 54,
  },

  /* ABOUT */

  aboutCard: {
    flexDirection: "row",
    backgroundColor: "#E7EFF9",
    borderRadius: 22,
    padding: 15,
    alignItems: "center",
  },

  aboutIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  aboutContent: {
    flex: 1,
  },

  aboutTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#17233D",
  },

  aboutDescription: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: "#667085",
  },

  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  versionText: {
    marginLeft: 5,
    fontSize: 9.5,
    color: "#98A2B3",
  },

  bottomSpace: {
    height: 20,
  },
});
