import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    ArrowLeft,
    Eye,
    MessageCircle,
    Mic,
    Navigation,
    ScanText,
    Search,
    Sparkles,
    Volume2,
} from "lucide-react-native";

export default function AssistantScreen() {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

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
            <Text style={styles.title}>AI Assistant</Text>
            <Text style={styles.subtitle}>
              Your intelligent vision companion
            </Text>
          </View>
        </View>

        {/* AI ASSISTANT CARD */}
        <View style={styles.assistantCard}>
          <View style={styles.statusRow}>
            <View style={styles.aiBadge}>
              <Sparkles size={14} color="#FFFFFF" />
              <Text style={styles.aiBadgeText}>VISIONPATH AI</Text>
            </View>

            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>

          <View style={styles.assistantCenter}>
            <View
              style={[styles.micCircle, isListening && styles.micCircleActive]}
            >
              <Mic size={48} color="#FFFFFF" />
            </View>

            <Text style={styles.assistantTitle}>
              {isListening ? "Listening..." : "How can I help you?"}
            </Text>

            <Text style={styles.assistantDescription}>
              {isListening
                ? "Speak clearly. I am listening to your command."
                : "Tap the microphone and tell me what you need."}
            </Text>
          </View>

          <View style={styles.voiceStatus}>
            <Volume2 size={16} color="#D8E8FC" />
            <Text style={styles.voiceStatusText}>Voice assistance ready</Text>
          </View>
        </View>

        {/* QUICK COMMANDS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Commands</Text>

          <Text style={styles.sectionSubtitle}>Try asking me to</Text>
        </View>

        <View style={styles.commandGrid}>
          <Pressable
            style={styles.commandCard}
            onPress={() => router.push("/navigate")}
          >
            <View style={styles.commandIcon}>
              <Navigation size={20} color="#1761B0" />
            </View>

            <View style={styles.commandTextContainer}>
              <Text style={styles.commandTitle}>Navigate</Text>
              <Text style={styles.commandText}>Help me navigate</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.commandCard}
            onPress={() => router.push("/find-object")}
          >
            <View style={styles.commandIcon}>
              <Search size={20} color="#1761B0" />
            </View>

            <View style={styles.commandTextContainer}>
              <Text style={styles.commandTitle}>Find Object</Text>
              <Text style={styles.commandText}>Find something for me</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.commandCard}
            onPress={() => router.push("/read-text")}
          >
            <View style={styles.commandIcon}>
              <ScanText size={20} color="#1761B0" />
            </View>

            <View style={styles.commandTextContainer}>
              <Text style={styles.commandTitle}>Read Text</Text>
              <Text style={styles.commandText}>Read this for me</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.commandCard}
            onPress={() => router.push("/describe-scene")}
          >
            <View style={styles.commandIcon}>
              <Eye size={20} color="#1761B0" />
            </View>

            <View style={styles.commandTextContainer}>
              <Text style={styles.commandTitle}>Describe Scene</Text>
              <Text style={styles.commandText}>What is around me?</Text>
            </View>
          </Pressable>
        </View>

        {/* INFO CARD */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <MessageCircle size={21} color="#18865A" />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Try natural commands</Text>

            <Text style={styles.infoDescription}>
              You can speak naturally. VisionPath AI will understand and guide
              you.
            </Text>
          </View>
        </View>

        <View style={styles.flexSpace} />

        {/* MAIN MICROPHONE BUTTON */}
        <Pressable
          style={[styles.speakButton, isListening && styles.speakButtonActive]}
          onPress={toggleListening}
        >
          <View style={styles.speakIcon}>
            <Mic size={27} color="#1761B0" />
          </View>

          <View>
            <Text style={styles.speakSmallText}>
              {isListening
                ? "Listening to your command"
                : "Tap to start speaking"}
            </Text>

            <Text style={styles.speakText}>
              {isListening ? "Listening..." : "Start Assistant"}
            </Text>
          </View>
        </Pressable>
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
    paddingBottom: 15,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
    elevation: 2,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#17233D",
  },

  subtitle: {
    fontSize: 13,
    color: "#667085",
    marginTop: 2,
  },

  /* AI CARD */

  assistantCard: {
    height: 245,
    backgroundColor: "#17233D",
    borderRadius: 28,
    padding: 16,
    justifyContent: "space-between",
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(139,92,246,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },

  aiBadgeText: {
    marginLeft: 5,
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(53,208,127,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#35D07F",
    marginRight: 6,
  },

  onlineText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#E7FFF2",
  },

  assistantCenter: {
    alignItems: "center",
  },

  micCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#1761B0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 7,
    borderColor: "rgba(255,255,255,0.08)",
  },

  micCircleActive: {
    backgroundColor: "#18865A",
  },

  assistantTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  assistantDescription: {
    fontSize: 11,
    color: "#B8C5D9",
    marginTop: 5,
    textAlign: "center",
  },

  voiceStatus: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },

  voiceStatusText: {
    marginLeft: 7,
    fontSize: 11,
    color: "#D8E8FC",
  },

  /* QUICK COMMANDS */

  sectionHeader: {
    marginTop: 17,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#17233D",
  },

  sectionSubtitle: {
    fontSize: 11,
    color: "#667085",
    marginTop: 2,
  },

  commandGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  commandCard: {
    width: "48.5%",
    minHeight: 68,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  commandIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#E7EFF9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  commandTextContainer: {
    flex: 1,
  },

  commandTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#17233D",
  },

  commandText: {
    fontSize: 9.5,
    color: "#667085",
    marginTop: 2,
  },

  /* INFO */

  infoCard: {
    marginTop: 13,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
  },

  infoIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#EAF8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#17233D",
  },

  infoDescription: {
    marginTop: 3,
    fontSize: 10.5,
    lineHeight: 15,
    color: "#667085",
  },

  flexSpace: {
    flex: 1,
  },

  /* BUTTON */

  speakButton: {
    height: 78,
    borderRadius: 25,
    backgroundColor: "#1761B0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  speakButtonActive: {
    backgroundColor: "#18865A",
  },

  speakIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  speakSmallText: {
    fontSize: 11,
    color: "#D8E8FC",
    marginBottom: 2,
  },

  speakText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
