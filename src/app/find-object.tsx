import { router } from "expo-router";
import React, { useState } from "react";
import {
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    ArrowLeft,
    Briefcase,
    Camera,
    Crosshair,
    Glasses,
    KeyRound,
    Search,
    Smartphone,
    Sparkles,
} from "lucide-react-native";

export default function FindObjectScreen() {
  const [searchText, setSearchText] = useState("");

  const suggestedObjects = [
    {
      name: "Glasses",
      icon: Glasses,
    },
    {
      name: "Phone",
      icon: Smartphone,
    },
    {
      name: "Keys",
      icon: KeyRound,
    },
    {
      name: "Bag",
      icon: Briefcase,
    },
  ];

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
            <Text style={styles.title}>Find Object</Text>

            <Text style={styles.subtitle}>Let AI help you find things</Text>
          </View>
        </View>

        {/* SEARCH SECTION */}

        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>What are you looking for?</Text>

          <View style={styles.searchBox}>
            <Search size={21} color="#1761B0" />

            <TextInput
              style={styles.searchInput}
              placeholder="Search for an object..."
              placeholderTextColor="#98A2B3"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* SUGGESTED OBJECTS */}

        <View style={styles.suggestedSection}>
          <Text style={styles.sectionTitle}>Suggested Objects</Text>

          <View style={styles.objectGrid}>
            {suggestedObjects.map((item) => {
              const Icon = item.icon;

              return (
                <Pressable
                  key={item.name}
                  style={styles.objectCard}
                  onPress={() => setSearchText(item.name)}
                >
                  <View style={styles.objectIconBox}>
                    <Icon size={25} color="#1761B0" />
                  </View>

                  <Text style={styles.objectName}>{item.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* CAMERA SEARCH CARD */}

        <View style={styles.cameraCard}>
          <View style={styles.cameraIconCircle}>
            <Crosshair size={34} color="#1761B0" />
          </View>

          <Text style={styles.cameraTitle}>AI Camera Search</Text>

          <Text style={styles.cameraDescription}>
            Point your camera around you and VisionPath AI will help locate the
            object.
          </Text>

          <View style={styles.tipBox}>
            <Sparkles size={18} color="#8B5CF6" />

            <Text style={styles.tipText}>
              Make sure the object name is entered first.
            </Text>
          </View>
        </View>

        {/* FLEX SPACE */}

        <View style={styles.flexSpace} />

        {/* OPEN CAMERA BUTTON */}

        <Pressable
          style={styles.cameraButton}
          onPress={() =>
            router.push({
              pathname: "/camera",
              params: {
                mode: "object",
                object: searchText,
              },
            })
          }
        >
          <View style={styles.cameraButtonIcon}>
            <Camera size={25} color="#1761B0" />
          </View>

          <View>
            <Text style={styles.cameraButtonSmallText}>Start searching</Text>

            <Text style={styles.cameraButtonText}>Open Camera</Text>
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
    marginBottom: 24,
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

  /* SEARCH */

  searchSection: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#17233D",
    marginBottom: 10,
  },

  searchBox: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,

    shadowColor: "#667085",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#17233D",
    marginLeft: 10,
  },

  /* OBJECT GRID */

  suggestedSection: {
    marginBottom: 20,
  },

  objectGrid: {
    flexDirection: "row",
    gap: 10,
  },

  objectCard: {
    flex: 1,
    height: 88,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#667085",
    shadowOpacity: 0.06,
    shadowRadius: 7,
    elevation: 2,
  },

  objectIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,

    backgroundColor: "#E7EFF9",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 5,
  },

  objectName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#344054",
  },

  /* CAMERA CARD */

  cameraCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 20,

    alignItems: "center",

    shadowColor: "#667085",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },

  cameraIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,

    backgroundColor: "#E7EFF9",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  cameraTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#17233D",
  },

  cameraDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: "#667085",

    textAlign: "center",
    marginTop: 7,
  },

  tipBox: {
    width: "100%",
    marginTop: 16,

    backgroundColor: "#F5F3FF",
    borderRadius: 14,

    paddingVertical: 10,
    paddingHorizontal: 12,

    flexDirection: "row",
    alignItems: "center",
  },

  tipText: {
    flex: 1,
    marginLeft: 8,

    fontSize: 11,
    color: "#6D5CA8",
    lineHeight: 16,
  },

  /* FLEX SPACE */

  flexSpace: {
    flex: 1,
    minHeight: 12,
  },

  /* CAMERA BUTTON */

  cameraButton: {
    height: 80,
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

  cameraButtonIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 13,
  },

  cameraButtonSmallText: {
    fontSize: 11,
    color: "#D8E8FC",
    marginBottom: 2,
  },

  cameraButtonText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
