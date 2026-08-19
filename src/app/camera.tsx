import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    ArrowLeft,
    Camera,
    Navigation,
    RotateCcw,
    ScanSearch,
    ScanText,
    Sparkles,
    Volume2,
    Zap
} from "lucide-react-native";

export default function CameraScreen() {
  const { mode, object } = useLocalSearchParams<{
    mode?: string;
    object?: string;
  }>();

  const getModeDetails = () => {
    switch (mode) {
      case "object":
        return {
          title: "Find Object",
          subtitle: object
            ? `Searching for: ${object}`
            : "Point camera toward the object",
          icon: ScanSearch,
          label: "OBJECT SEARCH",
        };

      case "text":
        return {
          title: "Read Text",
          subtitle: "Point camera at the text",
          icon: ScanText,
          label: "TEXT SCANNER",
        };

      case "scene":
        return {
          title: "Describe Scene",
          subtitle: "Analyzing your surroundings",
          icon: Sparkles,
          label: "SCENE ANALYSIS",
        };

      case "navigate":
        return {
          title: "Navigate",
          subtitle: "Analyzing the path ahead",
          icon: Navigation,
          label: "NAVIGATION",
        };

      default:
        return {
          title: "Camera",
          subtitle: "VisionPath AI camera",
          icon: Camera,
          label: "CAMERA",
        };
    }
  };

  const details = getModeDetails();
  const ModeIcon = details.icon;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        {/* CAMERA AREA */}

        <View style={styles.cameraArea}>
          {/* TOP BAR */}

          <View style={styles.topBar}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </Pressable>

            <View style={styles.modeBadge}>
              <View style={styles.liveDot} />

              <Text style={styles.modeBadgeText}>{details.label}</Text>
            </View>

            <Pressable style={styles.flashButton}>
              <Zap size={21} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* CAMERA CONTENT */}

          <View style={styles.cameraCenter}>
            <View style={styles.focusFrame}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />

              <View style={styles.cameraIconCircle}>
                <ModeIcon size={46} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.cameraTitle}>{details.title}</Text>

            <Text style={styles.cameraSubtitle}>{details.subtitle}</Text>
          </View>

          {/* CAMERA STATUS */}

          <View style={styles.cameraStatus}>
            <View style={styles.statusDot} />

            <Text style={styles.statusText}>Camera ready</Text>
          </View>
        </View>

        {/* INFORMATION PANEL */}

        <View style={styles.bottomPanel}>
          <View style={styles.handle} />

          <View style={styles.modeHeader}>
            <View style={styles.modeIconBox}>
              <ModeIcon size={24} color="#1761B0" />
            </View>

            <View style={styles.modeTextContainer}>
              <Text style={styles.modeTitle}>{details.title}</Text>

              <Text style={styles.modeSubtitle}>{details.subtitle}</Text>
            </View>

            <View style={styles.aiStatus}>
              <Sparkles size={15} color="#8B5CF6" />

              <Text style={styles.aiStatusText}>AI Ready</Text>
            </View>
          </View>

          {/* STATUS ROW */}

          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={styles.smallIconBox}>
                <Camera size={19} color="#1761B0" />
              </View>

              <View>
                <Text style={styles.statusItemTitle}>Camera</Text>

                <Text style={styles.statusItemValue}>Active</Text>
              </View>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.statusItem}>
              <View style={styles.smallIconBox}>
                <Volume2 size={19} color="#18865A" />
              </View>

              <View>
                <Text style={styles.statusItemTitle}>Voice</Text>

                <Text style={styles.statusItemValue}>Ready</Text>
              </View>
            </View>
          </View>

          {/* CONTROLS */}

          <View style={styles.controls}>
            <Pressable style={styles.secondaryControl}>
              <RotateCcw size={22} color="#17233D" />
            </Pressable>

            <Pressable style={styles.captureButton}>
              <View style={styles.captureInner}>
                <ModeIcon size={28} color="#1761B0" />
              </View>
            </Pressable>

            <Pressable style={styles.secondaryControl}>
              <Volume2 size={22} color="#17233D" />
            </Pressable>
          </View>

          <Text style={styles.captureHint}>
            Tap the center button to analyze
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#17233D",
  },

  container: {
    flex: 1,
    backgroundColor: "#17233D",
  },

  /* CAMERA AREA */

  cameraArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    justifyContent: "space-between",
    paddingBottom: 24,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  flashButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#35D07F",
    marginRight: 7,
  },

  modeBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  /* CAMERA CENTER */

  cameraCenter: {
    alignItems: "center",
    justifyContent: "center",
  },

  focusFrame: {
    width: 190,
    height: 190,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 45,
    height: 45,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FFFFFF",
    borderTopLeftRadius: 25,
  },

  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 45,
    height: 45,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FFFFFF",
    borderTopRightRadius: 25,
  },

  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 45,
    height: 45,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FFFFFF",
    borderBottomLeftRadius: 25,
  },

  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 45,
    height: 45,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FFFFFF",
    borderBottomRightRadius: 25,
  },

  cameraIconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  cameraTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  cameraSubtitle: {
    fontSize: 13,
    color: "#B8C5D9",
    marginTop: 6,
    textAlign: "center",
  },

  /* STATUS */

  cameraStatus: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(24,134,90,0.24)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#35D07F",
    marginRight: 8,
  },

  statusText: {
    color: "#E7FFF2",
    fontSize: 11,
    fontWeight: "600",
  },

  /* BOTTOM PANEL */

  bottomPanel: {
    backgroundColor: "#EEF2F8",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25,
  },

  handle: {
    width: 42,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 18,
  },

  modeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  modeIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#E7EFF9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  modeTextContainer: {
    flex: 1,
  },

  modeTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#17233D",
  },

  modeSubtitle: {
    fontSize: 11,
    color: "#667085",
    marginTop: 3,
  },

  aiStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3EEFF",
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 14,
  },

  aiStatusText: {
    marginLeft: 5,
    fontSize: 10,
    fontWeight: "600",
    color: "#6D5CA8",
  },

  /* STATUS ROW */

  statusRow: {
    height: 78,
    marginTop: 18,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  statusItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  smallIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F2F6FC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  statusItemTitle: {
    fontSize: 10,
    color: "#667085",
  },

  statusItemValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#17233D",
    marginTop: 2,
  },

  verticalDivider: {
    width: 1,
    height: 38,
    backgroundColor: "#E6EBF2",
    marginHorizontal: 10,
  },

  /* CONTROLS */

  controls: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  secondaryControl: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#1761B0",
    alignItems: "center",
    justifyContent: "center",
  },

  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  captureHint: {
    textAlign: "center",
    fontSize: 11,
    color: "#667085",
    marginTop: 12,
  },
});
