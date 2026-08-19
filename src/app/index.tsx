import { router } from "expo-router";
import React from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AlertTriangle,
  Camera,
  ChevronRight,
  Eye,
  History,
  Mic,
  Navigation,
  ScanText,
  Search,
  User,
} from "lucide-react-native";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  background: string;
  iconColor: string;
  onPress: () => void;
};

function FeatureCard({
  icon,
  title,
  description,
  background,
  onPress,
}: FeatureCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.featureCard,
        pressed && styles.featureCardPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: background }]}>
        {icon}
      </View>

      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{title}</Text>

        <Text style={styles.cardDescription} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>VisionPath AI</Text>

            <Text style={styles.subtitle}>
              Your intelligent vision companion
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.profileButton,
              pressed && styles.profileButtonPressed,
            ]}
            onPress={() => router.push("/profile")}
          >
            <User size={21} color="#1761B0" />
          </Pressable>
        </View>

        {/* FEATURE GRID */}

        <View style={styles.grid}>
          <FeatureCard
            title="Navigate"
            description="Get guidance while moving"
            background="#E7EFF9"
            iconColor="#1761B0"
            icon={<Navigation size={30} color="#1761B0" />}
            onPress={() => router.push("/navigate")}
          />

          <FeatureCard
            title="Find Object"
            description="Locate objects around you"
            background="#F1EBFF"
            iconColor="#8B5CF6"
            icon={<Search size={30} color="#8B5CF6" />}
            onPress={() => router.push("/find-object")}
          />

          <FeatureCard
            title="Read Text"
            description="Read text aloud instantly"
            background="#EAF8F0"
            iconColor="#18865A"
            icon={<ScanText size={30} color="#18865A" />}
            onPress={() => router.push("/read-text")}
          />

          <FeatureCard
            title="Describe Scene"
            description="Understand your surroundings"
            background="#FFF4E5"
            iconColor="#E58A18"
            icon={<Eye size={30} color="#E58A18" />}
            onPress={() => router.push("/describe-scene")}
          />

          <FeatureCard
            title="Open Camera"
            description="Access AI camera"
            background="#E7EFF9"
            iconColor="#1761B0"
            icon={<Camera size={30} color="#1761B0" />}
            onPress={() => router.push("/camera")}
          />

          <FeatureCard
            title="SOS"
            description="Emergency assistance"
            background="#FFF0F0"
            iconColor="#D92D20"
            icon={<AlertTriangle size={30} color="#D92D20" />}
            onPress={() => router.push("/sos")}
          />
        </View>

        {/* SYSTEM STATUS */}

        <View style={styles.systemStatus}>
          <View style={styles.statusLeft}>
            <View style={styles.statusDot} />

            <View>
              <Text style={styles.statusTitle}>System Status</Text>

              <Text style={styles.statusText}>All systems are ready</Text>
            </View>
          </View>

          <View style={styles.readyBadge}>
            <Text style={styles.readyText}>READY</Text>
          </View>
        </View>

        {/* HISTORY AND PROFILE */}

        <View style={styles.bottomActions}>
          <Pressable
            style={({ pressed }) => [
              styles.bottomAction,
              pressed && styles.bottomActionPressed,
            ]}
            onPress={() => router.push("/history")}
          >
            <History size={19} color="#1761B0" />

            <Text style={styles.bottomActionText}>History</Text>
          </Pressable>

          <View style={styles.actionDivider} />

          <Pressable
            style={({ pressed }) => [
              styles.bottomAction,
              pressed && styles.bottomActionPressed,
            ]}
            onPress={() => router.push("/profile")}
          >
            <User size={19} color="#1761B0" />

            <Text style={styles.bottomActionText}>Profile</Text>
          </Pressable>
        </View>

        {/* AI ASSISTANT */}

        <Pressable
          style={({ pressed }) => [
            styles.assistantCard,
            pressed && styles.assistantCardPressed,
          ]}
          onPress={() => router.push("/assistant")}
        >
          <View style={styles.assistantIcon}>
            <Mic size={25} color="#FFFFFF" />
          </View>

          <View style={styles.assistantContent}>
            <Text style={styles.assistantTitle}>Start Assistant</Text>

            <Text style={styles.assistantDescription}>
              Tap to speak with VisionPath AI
            </Text>
          </View>

          <ChevronRight size={21} color="#FFFFFF" />
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
    paddingHorizontal: 18,
    paddingTop: 8,
  },

  /* HEADER */

  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  appName: {
    fontSize: 25,
    fontWeight: "800",
    color: "#17233D",
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#667085",
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  profileButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },

  /* FEATURE GRID */

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 9,
    marginTop: 6,
  },

  featureCard: {
    width: "48.7%",
    height: 150,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    padding: 12,
    justifyContent: "space-between",
    elevation: 1,
  },

  featureCardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTextContainer: {
    marginTop: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#17233D",
  },

  cardDescription: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 13,
    color: "#667085",
  },

  /* SYSTEM STATUS */

  systemStatus: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginTop: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 1,
  },

  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#35B96D",
    marginRight: 10,
  },

  statusTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#17233D",
  },

  statusText: {
    marginTop: 2,
    fontSize: 12,
    color: "#667085",
  },

  readyBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor: "#EAF8F0",
  },

  readyText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#18865A",
  },

  /* HISTORY / PROFILE */

  bottomActions: {
    height: 58,
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },

  bottomAction: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomActionPressed: {
    opacity: 0.65,
  },

  bottomActionText: {
    marginLeft: 7,
    fontSize: 15,
    fontWeight: "700",
    color: "#17233D",
  },

  actionDivider: {
    width: 1,
    height: 25,
    backgroundColor: "#E4E7EC",
  },

  /* AI ASSISTANT */

  assistantCard: {
    height: 74,
    marginTop: 12,
    borderRadius: 21,
    backgroundColor: "#1761B0",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  assistantCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  assistantIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  assistantContent: {
    flex: 1,
  },

  assistantTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  assistantDescription: {
    marginTop: 3,
    fontSize: 12,
    color: "#D8E8FC",
  },
});
