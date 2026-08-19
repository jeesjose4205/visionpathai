import { router } from "expo-router";
import React from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    ArrowLeft,
    Camera,
    CircleStop,
    MapPin,
    Navigation,
    ScanLine,
    Volume2,
} from "lucide-react-native";

export default function NavigateScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={25} color="#17233D" />
          </Pressable>

          <View>
            <Text style={styles.title}>Navigate</Text>
            <Text style={styles.subtitle}>AI-powered camera guidance</Text>
          </View>
        </View>

        {/* CAMERA PREVIEW */}

        <View style={styles.cameraContainer}>
          <View style={styles.cameraTop}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>

            <View style={styles.cameraIconBox}>
              <Camera size={22} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.cameraCenter}>
            <View style={styles.scanCircle}>
              <ScanLine size={48} color="#FFFFFF" strokeWidth={1.8} />
            </View>

            <Text style={styles.cameraTitle}>Camera Navigation</Text>

            <Text style={styles.cameraSubtitle}>
              Your surroundings will appear here
            </Text>
          </View>

          <View style={styles.cameraBottom}>
            <View style={styles.detectingBadge}>
              <View style={styles.detectingDot} />

              <Text style={styles.detectingText}>Ready to navigate</Text>
            </View>
          </View>
        </View>

        {/* ENVIRONMENT STATUS */}

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIconBox}>
              <Navigation size={25} color="#1761B0" />
            </View>

            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Environment Status</Text>

              <Text style={styles.statusSubtitle}>
                AI will analyze your surroundings
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statusInfoRow}>
            <View style={styles.infoItem}>
              <MapPin size={20} color="#18865A" />

              <Text style={styles.infoText}>Path analysis ready</Text>
            </View>

            <View style={styles.infoItem}>
              <Volume2 size={20} color="#1761B0" />

              <Text style={styles.infoText}>Voice guidance ready</Text>
            </View>
          </View>
        </View>

        {/* NAVIGATION INFORMATION */}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How Navigation Works</Text>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>

            <Text style={styles.stepText}>Point your camera forward</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>

            <Text style={styles.stepText}>
              VisionPath AI analyzes obstacles and paths
            </Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>

            <Text style={styles.stepText}>
              Listen to real-time voice guidance
            </Text>
          </View>
        </View>

        {/* START BUTTON */}

        <Pressable style={styles.startButton}>
          <View style={styles.startIconCircle}>
            <Navigation size={24} color="#1761B0" fill="#1761B0" />
          </View>

          <View>
            <Text style={styles.startSmallText}>Camera navigation</Text>

            <Text style={styles.startText}>Start Navigation</Text>
          </View>
        </Pressable>

        {/* STOP BUTTON */}

        <Pressable style={styles.stopButton}>
          <CircleStop size={20} color="#E53E3E" />

          <Text style={styles.stopText}>Stop Navigation</Text>
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

  /* HEADER */

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

    shadowColor: "#667085",
    shadowOpacity: 0.08,
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
    fontSize: 13,
    color: "#667085",
  },

  /* CAMERA */

  cameraContainer: {
    height: 280,
    borderRadius: 28,
    backgroundColor: "#17233D",
    overflow: "hidden",
    padding: 16,
    justifyContent: "space-between",
  },

  cameraTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.28)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FF4B4B",
    marginRight: 6,
  },

  liveText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  cameraIconBox: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  cameraCenter: {
    alignItems: "center",
  },

  scanCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.55)",
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  cameraTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  cameraSubtitle: {
    color: "#B8C5D9",
    fontSize: 12,
    marginTop: 5,
  },

  cameraBottom: {
    alignItems: "center",
  },

  detectingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(24,134,90,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },

  detectingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#35D07F",
    marginRight: 7,
  },

  detectingText: {
    color: "#E7FFF2",
    fontSize: 11,
    fontWeight: "600",
  },

  /* STATUS CARD */

  statusCard: {
    marginTop: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
  },

  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusIconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#E7EFF9",
    alignItems: "center",
    justifyContent: "center",
  },

  statusTextContainer: {
    marginLeft: 12,
    flex: 1,
  },

  statusTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#17233D",
  },

  statusSubtitle: {
    fontSize: 11.5,
    color: "#667085",
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#E6EBF2",
    marginVertical: 14,
  },

  statusInfoRow: {
    gap: 12,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    marginLeft: 9,
    fontSize: 12,
    color: "#4A5568",
  },

  /* INFORMATION */

  infoCard: {
    marginTop: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#17233D",
    marginBottom: 13,
  },

  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },

  stepNumber: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#E7EFF9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  stepNumberText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1761B0",
  },

  stepText: {
    flex: 1,
    fontSize: 12,
    color: "#4A5568",
    lineHeight: 17,
  },

  /* START BUTTON */

  startButton: {
    marginTop: "auto",
    height: 82,
    borderRadius: 26,
    backgroundColor: "#1761B0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  startIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  startSmallText: {
    fontSize: 11,
    color: "#D8E8FC",
    marginBottom: 2,
  },

  startText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* STOP BUTTON */

  stopButton: {
    marginTop: 10,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#FFF1F1",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  stopText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#E53E3E",
  },
});
