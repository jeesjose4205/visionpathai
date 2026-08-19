import { router } from "expo-router";
import React, { useState } from "react";
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
    ArrowLeft,
    CalendarDays,
    ChevronRight,
    Clock,
    Eye,
    History as HistoryIcon,
    Navigation,
    ScanText,
    Search,
    Sparkles,
    Trash2,
} from "lucide-react-native";

type HistoryItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  color: string;
  background: string;
};

function HistoryItem({
  icon,
  title,
  description,
  time,
  background,
}: HistoryItemProps) {
  return (
    <Pressable style={styles.historyItem}>
      <View style={[styles.historyIcon, { backgroundColor: background }]}>
        {icon}
      </View>

      <View style={styles.historyContent}>
        <Text style={styles.historyTitle}>{title}</Text>

        <Text style={styles.historyDescription} numberOfLines={1}>
          {description}
        </Text>

        <View style={styles.timeRow}>
          <Clock size={11} color="#98A2B3" />

          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>

      <ChevronRight size={18} color="#98A2B3" />
    </Pressable>
  );
}

export default function HistoryScreen() {
  const [history, setHistory] = useState([
    {
      id: "1",
      type: "navigate",
      title: "Navigation Started",
      description: "Guidance for the path ahead",
      time: "Today • 10:42 AM",
    },
    {
      id: "2",
      type: "object",
      title: "Object Search",
      description: "Searching for a chair",
      time: "Today • 9:18 AM",
    },
    {
      id: "3",
      type: "text",
      title: "Text Read",
      description: "Text successfully scanned and read aloud",
      time: "Yesterday • 6:35 PM",
    },
    {
      id: "4",
      type: "scene",
      title: "Scene Described",
      description: "Indoor environment with people and furniture",
      time: "Yesterday • 4:12 PM",
    },
    {
      id: "5",
      type: "object",
      title: "Object Search",
      description: "Searching for a door",
      time: "Aug 17 • 2:20 PM",
    },
  ]);

  const clearHistory = () => {
    setHistory([]);
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "navigate":
        return {
          icon: <Navigation size={21} color="#1761B0" />,
          background: "#E7EFF9",
        };

      case "object":
        return {
          icon: <Search size={21} color="#8B5CF6" />,
          background: "#F1EBFF",
        };

      case "text":
        return {
          icon: <ScanText size={21} color="#18865A" />,
          background: "#EAF8F0",
        };

      case "scene":
        return {
          icon: <Eye size={21} color="#E58A18" />,
          background: "#FFF4E5",
        };

      default:
        return {
          icon: <HistoryIcon size={21} color="#1761B0" />,
          background: "#E7EFF9",
        };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#17233D" />
            </Pressable>

            <View>
              <Text style={styles.title}>History</Text>

              <Text style={styles.subtitle}>
                Your recent VisionPath activity
              </Text>
            </View>
          </View>

          {history.length > 0 && (
            <Pressable style={styles.clearButton} onPress={clearHistory}>
              <Trash2 size={18} color="#D92D20" />
            </Pressable>
          )}
        </View>

        {history.length > 0 ? (
          <>
            {/* SUMMARY CARD */}

            <View style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <View style={styles.summaryIcon}>
                  <HistoryIcon size={25} color="#FFFFFF" />
                </View>

                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryTitle}>Activity Summary</Text>

                  <Text style={styles.summaryDescription}>
                    Your recent VisionPath AI activity
                  </Text>
                </View>

                <View style={styles.totalBadge}>
                  <Text style={styles.totalNumber}>{history.length}</Text>

                  <Text style={styles.totalText}>Activities</Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Navigation size={17} color="#D8E8FC" />

                  <Text style={styles.statText}>Navigate</Text>
                </View>

                <View style={styles.statItem}>
                  <Search size={17} color="#E6DBFF" />

                  <Text style={styles.statText}>Objects</Text>
                </View>

                <View style={styles.statItem}>
                  <Sparkles size={17} color="#FFE2B8" />

                  <Text style={styles.statText}>AI Vision</Text>
                </View>
              </View>
            </View>

            {/* DATE LABEL */}

            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <CalendarDays size={17} color="#1761B0" />

                <Text style={styles.sectionTitle}>Recent Activity</Text>
              </View>

              <Text style={styles.sectionCount}>{history.length} items</Text>
            </View>

            {/* HISTORY LIST */}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.historyList}
            >
              {history.map((item) => {
                const iconDetails = renderIcon(item.type);

                return (
                  <HistoryItem
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    time={item.time}
                    icon={iconDetails.icon}
                    background={iconDetails.background}
                    color="#1761B0"
                  />
                );
              })}
            </ScrollView>
          </>
        ) : (
          /* EMPTY STATE */

          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <HistoryIcon size={46} color="#1761B0" />
            </View>

            <Text style={styles.emptyTitle}>No activity yet</Text>

            <Text style={styles.emptyDescription}>
              Your navigation, object searches, text scans, and scene
              descriptions will appear here.
            </Text>

            <Pressable
              style={styles.homeButton}
              onPress={() => router.replace("/")}
            >
              <Text style={styles.homeButtonText}>Start Exploring</Text>

              <ChevronRight size={19} color="#FFFFFF" />
            </Pressable>
          </View>
        )}
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
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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

  clearButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFF1F0",
    alignItems: "center",
    justifyContent: "center",
  },

  /* SUMMARY */

  summaryCard: {
    backgroundColor: "#17233D",
    borderRadius: 25,
    padding: 17,
  },

  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#1761B0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  summaryTextContainer: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  summaryDescription: {
    marginTop: 3,
    fontSize: 10.5,
    color: "#B8C5D9",
  },

  totalBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  totalNumber: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  totalText: {
    fontSize: 8,
    color: "#B8C5D9",
    marginTop: 1,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 15,
  },

  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statText: {
    marginTop: 5,
    fontSize: 9.5,
    color: "#D8E8FC",
  },

  /* SECTION */

  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionTitle: {
    marginLeft: 7,
    fontSize: 16,
    fontWeight: "700",
    color: "#17233D",
  },

  sectionCount: {
    fontSize: 10.5,
    color: "#667085",
  },

  /* HISTORY */

  historyList: {
    paddingBottom: 20,
  },

  historyItem: {
    minHeight: 82,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#667085",
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 1,
  },

  historyIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  historyContent: {
    flex: 1,
  },

  historyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#17233D",
  },

  historyDescription: {
    marginTop: 3,
    fontSize: 10.5,
    color: "#667085",
  },

  timeRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  timeText: {
    marginLeft: 4,
    fontSize: 9.5,
    color: "#98A2B3",
  },

  /* EMPTY STATE */

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
  },

  emptyIcon: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: "#E7EFF9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#17233D",
  },

  emptyDescription: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#667085",
  },

  homeButton: {
    marginTop: 22,
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 17,
    backgroundColor: "#1761B0",
    flexDirection: "row",
    alignItems: "center",
  },

  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginRight: 7,
  },
});
