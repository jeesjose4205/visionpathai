import { router } from "expo-router";
import React from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    AlertTriangle,
    ArrowLeft,
    MapPin,
    Navigation,
    Phone,
    ShieldAlert,
    UserRound,
} from "lucide-react-native";

export default function SOSScreen() {
  const activateSOS = () => {
    Alert.alert(
      "Activate Emergency SOS?",
      "This will send an emergency alert to your saved contacts with your location.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Activate SOS",
          style: "destructive",
          onPress: () => {
            Alert.alert("SOS Activated", "Emergency alert has been activated.");
          },
        },
      ],
    );
  };

  const callEmergency = () => {
    Alert.alert(
      "Emergency Call",
      "Emergency calling will be implemented here.",
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={23} color="#17233D" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Emergency SOS</Text>
            <Text style={styles.subtitle}>Get help when you need it</Text>
          </View>

          <View style={styles.headerPlaceholder} />
        </View>

        {/* EMERGENCY WARNING */}

        <View style={styles.warningCard}>
          <View style={styles.warningIcon}>
            <ShieldAlert size={28} color="#D92D20" />
          </View>

          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Emergency Assistance</Text>

            <Text style={styles.warningDescription}>
              Activate SOS to alert your emergency contacts and share your
              location.
            </Text>
          </View>
        </View>

        {/* LOCATION */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Location</Text>
        </View>

        <View style={styles.locationCard}>
          <View style={styles.locationIcon}>
            <MapPin size={23} color="#1761B0" />
          </View>

          <View style={styles.locationContent}>
            <Text style={styles.locationTitle}>Current Location</Text>

            <Text style={styles.locationText}>
              Location will be shared during an emergency
            </Text>
          </View>

          <Navigation size={19} color="#667085" />
        </View>

        {/* EMERGENCY CONTACT */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
        </View>

        <View style={styles.contactCard}>
          <View style={styles.contactAvatar}>
            <UserRound size={23} color="#1761B0" />
          </View>

          <View style={styles.contactContent}>
            <Text style={styles.contactName}>Emergency Contact</Text>

            <Text style={styles.contactNumber}>Add a trusted contact</Text>
          </View>

          <Pressable style={styles.callButton} onPress={callEmergency}>
            <Phone size={19} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* SAFETY INFORMATION */}

        <View style={styles.infoCard}>
          <AlertTriangle size={21} color="#E58A18" />

          <Text style={styles.infoText}>
            Only activate SOS during a real emergency. Your emergency contacts
            will be notified.
          </Text>
        </View>

        {/* SOS BUTTON */}

        <View style={styles.sosContainer}>
          <Text style={styles.sosInstruction}>
            Press the button below to activate
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.sosButton,
              pressed && styles.sosButtonPressed,
            ]}
            onPress={activateSOS}
          >
            <View style={styles.sosInner}>
              <AlertTriangle size={42} color="#FFFFFF" strokeWidth={2.5} />

              <Text style={styles.sosText}>SOS</Text>

              <Text style={styles.sosSubtext}>EMERGENCY</Text>
            </View>
          </Pressable>
        </View>
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
  },

  /* HEADER */

  header: {
    height: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  headerText: {
    alignItems: "center",
  },

  title: {
    fontSize: 19,
    marginTop: 25,
    fontWeight: "800",
    color: "#17233D",
  },

  subtitle: {
    marginTop: 2,
    fontSize: 10,
    color: "#667085",
  },

  headerPlaceholder: {
    width: 44,
  },

  /* WARNING */

  warningCard: {
    backgroundColor: "#FFF1F1",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  warningIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFE0E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  warningContent: {
    flex: 1,
  },

  warningTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#B42318",
  },

  warningDescription: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 15,
    color: "#8A4A45",
  },

  /* SECTION */

  sectionHeader: {
    marginTop: 20,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#344054",
  },

  /* LOCATION */

  locationCard: {
    height: 72,
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },

  locationIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#E7EFF9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  locationContent: {
    flex: 1,
  },

  locationTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#17233D",
  },

  locationText: {
    marginTop: 3,
    fontSize: 9,
    color: "#667085",
  },

  /* CONTACT */

  contactCard: {
    height: 72,
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },

  contactAvatar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#E7EFF9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  contactContent: {
    flex: 1,
  },

  contactName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#17233D",
  },

  contactNumber: {
    marginTop: 3,
    fontSize: 9,
    color: "#667085",
  },

  callButton: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: "#1761B0",
    alignItems: "center",
    justifyContent: "center",
  },

  /* INFORMATION */

  infoCard: {
    marginTop: 18,
    backgroundColor: "#FFF8E8",
    borderRadius: 17,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 9.5,
    lineHeight: 14,
    color: "#805D21",
  },

  /* SOS */

  sosContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 12,
  },

  sosInstruction: {
    marginBottom: 14,
    fontSize: 10,
    color: "#667085",
  },

  sosButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#D92D20",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },

  sosButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },

  sosInner: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  sosText: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },

  sosSubtext: {
    marginTop: 1,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#FFE5E3",
  },
});
