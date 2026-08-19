import { router } from "expo-router";
import React from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    ArrowLeft,
    BookOpen,
    Camera,
    FileText,
    ScanText,
    Signpost,
    Tag,
    Volume2,
} from "lucide-react-native";

export default function ReadTextScreen() {
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
            <Text style={styles.title}>Read Text</Text>
            <Text style={styles.subtitle}>
              Scan and listen to text around you
            </Text>
          </View>
        </View>

        {/* CAMERA PREVIEW */}
        <View style={styles.cameraContainer}>
          <View style={styles.cameraTop}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>READY</Text>
            </View>

            <View style={styles.cameraIconBox}>
              <Camera size={21} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.cameraCenter}>
            <View style={styles.scanFrame}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />

              <ScanText size={42} color="#FFFFFF" />
            </View>

            <Text style={styles.cameraTitle}>Text Scanner</Text>

            <Text style={styles.cameraSubtitle}>
              Point your camera at any text
            </Text>
          </View>

          <View style={styles.cameraBottom}>
            <View style={styles.readyBadge}>
              <View style={styles.readyDot} />
              <Text style={styles.readyText}>Ready to scan</Text>
            </View>
          </View>
        </View>

        {/* SUPPORTED TEXT */}
        <View style={styles.supportCard}>
          <View style={styles.supportHeader}>
            <View style={styles.supportIconBox}>
              <ScanText size={23} color="#1761B0" />
            </View>

            <View>
              <Text style={styles.supportTitle}>What can I read?</Text>
              <Text style={styles.supportSubtitle}>
                VisionPath AI can recognize many types of text
              </Text>
            </View>
          </View>

          <View style={styles.supportGrid}>
            <View style={styles.supportItem}>
              <BookOpen size={20} color="#1761B0" />
              <Text style={styles.supportText}>Books</Text>
            </View>

            <View style={styles.supportItem}>
              <FileText size={20} color="#1761B0" />
              <Text style={styles.supportText}>Documents</Text>
            </View>

            <View style={styles.supportItem}>
              <Signpost size={20} color="#1761B0" />
              <Text style={styles.supportText}>Signs</Text>
            </View>

            <View style={styles.supportItem}>
              <Tag size={20} color="#1761B0" />
              <Text style={styles.supportText}>Labels</Text>
            </View>
          </View>
        </View>

        {/* VOICE OUTPUT INFO */}
        <View style={styles.voiceCard}>
          <View style={styles.voiceIcon}>
            <Volume2 size={22} color="#18865A" />
          </View>

          <View style={styles.voiceContent}>
            <Text style={styles.voiceTitle}>Voice Reading</Text>
            <Text style={styles.voiceDescription}>
              Detected text can be read aloud automatically.
            </Text>
          </View>
        </View>

        {/* FLEX SPACE */}
        <View style={styles.flexSpace} />

        {/* SCAN BUTTON */}
        <Pressable
          style={styles.scanButton}
          onPress={() =>
            router.push({
              pathname: "/camera",
              params: { mode: "text" },
            })
          }
        >
          <View style={styles.scanButtonIcon}>
            <ScanText size={25} color="#1761B0" />
          </View>

          <View>
            <Text style={styles.scanButtonSmallText}>Detect and read text</Text>

            <Text style={styles.scanButtonText}>Scan Text</Text>
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
    height: 245,
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
    backgroundColor: "#35D07F",
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

  scanFrame: {
    width: 78,
    height: 78,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 22,
    height: 22,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FFFFFF",
    borderTopLeftRadius: 10,
  },

  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 22,
    height: 22,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FFFFFF",
    borderTopRightRadius: 10,
  },

  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 22,
    height: 22,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FFFFFF",
    borderBottomLeftRadius: 10,
  },

  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FFFFFF",
    borderBottomRightRadius: 10,
  },

  cameraTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },

  cameraSubtitle: {
    color: "#B8C5D9",
    fontSize: 12,
    marginTop: 4,
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

  /* SUPPORT CARD */
  supportCard: {
    marginTop: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,

    shadowColor: "#667085",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  supportHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  supportIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#E7EFF9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  supportTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#17233D",
  },

  supportSubtitle: {
    fontSize: 11,
    color: "#667085",
    marginTop: 2,
    flexShrink: 1,
  },

  supportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 10,
  },

  supportItem: {
    width: "47%",
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F5F8FC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  supportText: {
    marginLeft: 8,
    fontSize: 11,
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
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 11,
    color: "#667085",
    marginTop: 3,
  },

  /* FLEX SPACE */
  flexSpace: {
    flex: 1,
    minHeight: 10,
  },

  /* SCAN BUTTON */
  scanButton: {
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

  scanButtonIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  scanButtonSmallText: {
    fontSize: 11,
    color: "#D8E8FC",
    marginBottom: 2,
  },

  scanButtonText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
