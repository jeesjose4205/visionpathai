import { router } from "expo-router";
import React from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    Armchair,
    ArrowLeft,
    Camera,
    Eye,
    ScanEye,
    Sparkles,
    Trees,
    Users,
    Volume2,
} from "lucide-react-native";

export default function DescribeSceneScreen() {
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
            <Text style={styles.title}>Describe Scene</Text>
            <Text style={styles.subtitle}>
              Understand your surroundings with AI
            </Text>
          </View>
        </View>

        {/* CAMERA PREVIEW */}
        <View style={styles.cameraContainer}>
          <View style={styles.cameraTop}>
            <View style={styles.aiBadge}>
              <Sparkles size={13} color="#FFFFFF" />
              <Text style={styles.aiText}>AI READY</Text>
            </View>

            <View style={styles.cameraIconBox}>
              <Camera size={21} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.cameraCenter}>
            <View style={styles.eyeCircle}>
              <ScanEye size={45} color="#FFFFFF" />
            </View>

            <Text style={styles.cameraTitle}>Scene Analysis</Text>

            <Text style={styles.cameraSubtitle}>
              Point your camera at your surroundings
            </Text>
          </View>

          <View style={styles.cameraBottom}>
            <View style={styles.readyBadge}>
              <View style={styles.readyDot} />
              <Text style={styles.readyText}>Ready to analyze</Text>
            </View>
          </View>
        </View>

        {/* AI CAN DESCRIBE */}
        <View style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <View style={styles.analysisIconBox}>
              <Eye size={23} color="#1761B0" />
            </View>

            <View style={styles.analysisHeaderText}>
              <Text style={styles.analysisTitle}>
                What can VisionPath AI describe?
              </Text>

              <Text style={styles.analysisSubtitle}>
                AI analyzes important details around you
              </Text>
            </View>
          </View>

          <View style={styles.descriptionGrid}>
            <View style={styles.descriptionItem}>
              <View style={styles.itemIconBox}>
                <Users size={20} color="#1761B0" />
              </View>

              <Text style={styles.itemText}>People</Text>
            </View>

            <View style={styles.descriptionItem}>
              <View style={styles.itemIconBox}>
                <Armchair size={20} color="#1761B0" />
              </View>

              <Text style={styles.itemText}>Objects</Text>
            </View>

            <View style={styles.descriptionItem}>
              <View style={styles.itemIconBox}>
                <Trees size={20} color="#1761B0" />
              </View>

              <Text style={styles.itemText}>Environment</Text>
            </View>
          </View>
        </View>

        {/* VOICE DESCRIPTION */}
        <View style={styles.voiceCard}>
          <View style={styles.voiceIcon}>
            <Volume2 size={22} color="#18865A" />
          </View>

          <View style={styles.voiceContent}>
            <Text style={styles.voiceTitle}>Audio Description</Text>

            <Text style={styles.voiceDescription}>
              The scene description can be spoken aloud for easier
              accessibility.
            </Text>
          </View>
        </View>

        {/* FLEXIBLE SPACE */}
        <View style={styles.flexSpace} />

        {/* DESCRIBE BUTTON */}
        <Pressable
          style={styles.describeButton}
          onPress={() =>
            router.push({
              pathname: "/camera",
              params: { mode: "scene" },
            })
          }
        >
          <View style={styles.describeButtonIcon}>
            <Sparkles size={25} color="#1761B0" />
          </View>

          <View>
            <Text style={styles.describeButtonSmallText}>
              Analyze your surroundings
            </Text>

            <Text style={styles.describeButtonText}>Describe Scene</Text>
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
    height: 250,
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

  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(139,92,246,0.32)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },

  aiText: {
    marginLeft: 5,
    color: "#FFFFFF",
    fontSize: 10,
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

  eyeCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
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

  readyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(24,134,90,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },

  readyDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#35D07F",
    marginRight: 7,
  },

  readyText: {
    color: "#E7FFF2",
    fontSize: 11,
    fontWeight: "600",
  },

  /* ANALYSIS CARD */

  analysisCard: {
    marginTop: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,

    shadowColor: "#667085",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  analysisHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  analysisIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#E7EFF9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  analysisHeaderText: {
    flex: 1,
  },

  analysisTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#17233D",
  },

  analysisSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: "#667085",
  },

  descriptionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
  },

  descriptionItem: {
    width: "31%",
    height: 75,
    borderRadius: 16,
    backgroundColor: "#F5F8FC",
    alignItems: "center",
    justifyContent: "center",
  },

  itemIconBox: {
    marginBottom: 6,
  },

  itemText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#475467",
  },

  /* VOICE CARD */

  voiceCard: {
    marginTop: 13,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#667085",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  voiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EAF8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  voiceContent: {
    flex: 1,
  },

  voiceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#17233D",
  },

  voiceDescription: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: "#667085",
  },

  /* FLEX SPACE */

  flexSpace: {
    flex: 1,
    minHeight: 10,
  },

  /* BUTTON */

  describeButton: {
    height: 78,
    borderRadius: 25,
    backgroundColor: "#1761B0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,

    shadowColor: "#0E4D91",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  describeButtonIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  describeButtonSmallText: {
    fontSize: 11,
    color: "#D8E8FC",
    marginBottom: 2,
  },

  describeButtonText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
