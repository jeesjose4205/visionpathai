import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  Camera,
  Zap
} from "lucide-react-native";

import {
  DetectionResult,
  detectObjects,
  getMostImportantDetection
} from "@/services/api";

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

const DETECTION_INTERVAL_MS = 1000;
const DETECTION_FEED_COOLDOWN_MS = 3000;
const MAX_FEED_ITEMS = 5;

// ============================================================================
// TYPES
// ============================================================================

type DetectionState =
    | "idle"
    | "active"
    | "processing"
    | "paused"
    | "error";

type CameraFacing = "back" | "front";

interface DetectionFeedItem {
    id: string;
    detection: DetectionResult;
    timestamp: number;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Top control bar with Back, Status Badge, Flash, and Camera Flip
 */
function TopBar({
    onBack,
    isDetecting,
    onFlashToggle,
    isFlashOn,
    onCameraFlip,
}: {
    onBack: () => void;
    isDetecting: boolean;
    onFlashToggle: () => void;
    isFlashOn: boolean;
    onCameraFlip: () => void;
}) {
    return (
        <View style={styles.topBar}>
            <Pressable
                style={styles.backButton}
                onPress={onBack}
                accessibilityLabel="Back to home"
                accessibilityRole="button"
            >
                <ArrowLeft size={24} color="#FFFFFF" />
            </Pressable>

            <View style={styles.statusBadge}>
                <View
                    style={[
                        styles.statusDot,
                        isDetecting ? styles.statusDotActive : null
                    ]}
                />

                <Text style={styles.statusBadgeText}>
                    {isDetecting ? "LIVE DETECTION" : "LIVE"}
                </Text>
            </View>

            <View style={styles.topRightControls}>
                {/* Flashlight Button */}
                <Pressable
                    style={styles.flashButton}
                    onPress={onFlashToggle}
                    accessibilityLabel={
                        isFlashOn
                            ? "Turn flashlight off"
                            : "Turn flashlight on"
                    }
                    accessibilityRole="button"
                    accessibilityState={{ checked: isFlashOn }}
                >
                    <Zap
                        size={21}
                        color={isFlashOn ? "#FFD700" : "#FFFFFF"}
                    />

                    {isFlashOn && (
                        <View style={styles.flashActiveIndicator} />
                    )}
                </Pressable>

                {/* Camera Flip Button */}
                <Pressable
                    style={styles.cameraFlipButton}
                    onPress={onCameraFlip}
                    accessibilityLabel="Switch camera"
                    accessibilityHint="Toggle between front and back camera"
                    accessibilityRole="button"
                >
                    <Camera size={20} color="#FFFFFF" />
                </Pressable>
            </View>
        </View>
    );
}

/**
 * Live detection feed - shows recent detections like comments
 */
function DetectionFeed({
    detections
}: {
    detections: DetectionResult[];
}) {
    const [feedItems, setFeedItems] = useState<DetectionFeedItem[]>([]);
    const lastDetectionRef = useRef<Record<string, DetectionResult>>({});
    const lastUpdateTimeRef = useRef<Record<string, number>>({});

    useEffect(() => {
        if (!detections || detections.length === 0) return;

        const now = Date.now();
        const newItems: DetectionFeedItem[] = [];

        detections.forEach((detection) => {
            const key = `${detection.label}-${detection.position}-${detection.proximity}`;

            const lastTime =
                lastUpdateTimeRef.current[key] || 0;

            if (now - lastTime > DETECTION_FEED_COOLDOWN_MS) {
                const lastDetection =
                    lastDetectionRef.current[key];

                const isNew =
                    !lastDetection ||
                    lastDetection.label !== detection.label ||
                    lastDetection.position !== detection.position ||
                    lastDetection.proximity !== detection.proximity;

                if (isNew) {
                    lastUpdateTimeRef.current[key] = now;

                    lastDetectionRef.current[key] = detection;

                    newItems.push({
                        id: `${detection.label}-${now}`,
                        detection,
                        timestamp: now
                    });
                }
            }
        });

        if (newItems.length > 0) {
            setFeedItems((prev) => {
                const updated = [...prev, ...newItems]
                    .sort(
                        (a, b) =>
                            b.detection.priority -
                            a.detection.priority
                    )
                    .slice(0, MAX_FEED_ITEMS);

                return updated;
            });
        }
    }, [detections]);

    useEffect(() => {
        const interval = setInterval(() => {
            setFeedItems((prev) => {
                const now = Date.now();

                return prev.filter(
                    (item) =>
                        now - item.timestamp < 10000
                );
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (feedItems.length === 0) {
        return (
            <View style={styles.emptyFeed}>
                <Text style={styles.emptyFeedText}>
                    Start detection to see objects
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.detectionFeed}>
            {feedItems.map((item, index) => (
                <DetectionFeedItem
                    key={item.id}
                    item={item}
                    index={index}
                />
            ))}
        </View>
    );
}

/**
 * Single detection feed item
 */
function DetectionFeedItem({
    item,
    index
}: {
    item: DetectionFeedItem;
    index: number;
}) {
    const {
        label,
        position,
        proximity,
        priority
    } = item.detection;

    const getPriorityIcon = () => {
        if (priority >= 5) return "⚠️";
        if (priority >= 4) return "⚠️";
        if (priority >= 3) return "🚩";

        return "📍";
    };

    const formattedLabel =
        label.charAt(0).toUpperCase() +
        label.slice(1);

    return (
        <View
            style={[
                styles.feedItem,
                {
                    opacity: 1 - index * 0.15
                }
            ]}
            accessibilityLabel={`${formattedLabel}, ${position}, ${proximity}, priority ${priority}`}
            accessibilityRole="text"
        >
            <Text style={styles.feedPriority}>
                {getPriorityIcon()}
            </Text>

            <View style={styles.feedContent}>
                <Text style={styles.feedLabel}>
                    {formattedLabel}
                </Text>

                <Text style={styles.feedDetails}>
                    {position.toUpperCase()} •{" "}
                    {proximity.toUpperCase()}
                </Text>
            </View>
        </View>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CameraScreen() {
    const { mode, object } =
        useLocalSearchParams<{
            mode?: string;
            object?: string;
        }>();

    const [permission, requestPermission] =
        useCameraPermissions();

    const cameraRef =
        useRef<CameraView>(null);

    // Detection state
    const [isDetecting, setIsDetecting] =
        useState(false);

    const [detectionState, setDetectionState] =
        useState<DetectionState>("idle");

    const [
        currentDetection,
        setCurrentDetection
    ] = useState<DetectionResult | undefined>();

    const [
        lastDetectedObjects,
        setLastDetectedObjects
    ] = useState<DetectionResult[] | undefined>();

    // Camera state
    const [facing, setFacing] =
        useState<CameraFacing>("back");

    const [isFlashOn, setIsFlashOn] =
        useState(false);

    const isProcessingRef =
        useRef(false);

    const detectionIntervalRef =
        useRef<NodeJS.Timeout | null>(null);

    const detectionStartTimeRef =
        useRef<number | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopDetection();
        };
    }, []);

    // Stop detection when screen loses focus
    useFocusEffect(
        useCallback(() => {
            return () => {
                stopDetection();
            };
        }, [])
    );

    // Start detection loop
    const startDetection = useCallback(async () => {
        if (isDetecting) return;

        setIsDetecting(true);
        setDetectionState("active");

        detectionStartTimeRef.current =
            Date.now();

        if (detectionIntervalRef.current) {
            clearInterval(
                detectionIntervalRef.current
            );
        }

        detectionIntervalRef.current =
            setInterval(async () => {
                if (isProcessingRef.current) {
                    return;
                }

                if (!permission?.granted) {
                    stopDetection();
                    return;
                }

                try {
                    const photo =
                        await cameraRef.current?.takePictureAsync({
                            quality: 0.8,
                            base64: false,
                            skipProcessing: true
                        });

                    if (photo && photo.uri) {
                        setDetectionState(
                            "processing"
                        );

                        isProcessingRef.current = true;

                        const result =
                            await detectObjects(
                                photo.uri
                            );

                        const mostImportant =
                            getMostImportantDetection(
                                result.detections
                            );

                        setCurrentDetection(
                            mostImportant
                        );

                        setLastDetectedObjects(
                            result.detections
                        );

                        setDetectionState(
                            "active"
                        );
                    }
                } catch (error) {
                    console.error(
                        "[Detection] Error:",
                        error
                    );

                    setDetectionState("active");
                } finally {
                    isProcessingRef.current =
                        false;
                }
            }, DETECTION_INTERVAL_MS);
    }, [isDetecting, permission]);

    // Stop detection loop
    const stopDetection = useCallback(() => {
        if (!isDetecting) return;

        setIsDetecting(false);
        setDetectionState("paused");

        detectionStartTimeRef.current = null;

        if (detectionIntervalRef.current) {
            clearInterval(
                detectionIntervalRef.current
            );

            detectionIntervalRef.current = null;
        }

        isProcessingRef.current = false;
    }, [isDetecting]);

    // Toggle detection
    const toggleDetection = () => {
        if (isDetecting) {
            stopDetection();
        } else {
            startDetection();
        }
    };

    // Camera flip handler
    const handleCameraFlip =
        useCallback(() => {
            const newFacing =
                facing === "back"
                    ? "front"
                    : "back";

            const wasDetecting =
                isDetecting;

            if (wasDetecting) {
                stopDetection();
            }

            setFacing(newFacing);

            setTimeout(() => {
                if (wasDetecting) {
                    startDetection();
                }
            }, 100);
        }, [
            facing,
            isDetecting,
            startDetection,
            stopDetection
        ]);

    // Flashlight toggle
    const handleFlashToggle =
        useCallback(() => {
            setIsFlashOn((prev) => !prev);
        }, []);

    // Loading camera permission
    if (!permission) {
        return (
            <SafeAreaView
                style={styles.loadingSafeArea}
            >
                <View
                    style={styles.loadingContainer}
                >
                    <Text
                        style={styles.loadingText}
                    >
                        Loading camera...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // Camera permission not granted
    if (!permission.granted) {
        return (
            <SafeAreaView
                style={styles.permissionSafeArea}
            >
                <View
                    style={styles.permissionContainer}
                >
                    <View
                        style={styles.permissionIconBox}
                    >
                        <Camera
                            size={48}
                            color="#FFFFFF"
                        />
                    </View>

                    <Text
                        style={styles.permissionTitle}
                    >
                        Camera Access Required
                    </Text>

                    <Text
                        style={
                            styles.permissionDescription
                        }
                    >
                        VisionPath AI needs access to your
                        camera to provide environmental
                        awareness and navigation assistance.
                    </Text>

                    <Pressable
                        style={
                            styles.permissionButton
                        }
                        onPress={requestPermission}
                        accessibilityLabel="Request camera access"
                        accessibilityRole="button"
                    >
                        <Text
                            style={
                                styles.permissionButtonText
                            }
                        >
                            Allow Camera Access
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />

            <View style={styles.cameraContainer}>
                <CameraView
                    ref={cameraRef}
                    style={styles.cameraPreview}
                    facing={facing}
                />

                {/* TOP BAR */}
                <TopBar
                    onBack={() => router.back()}
                    isDetecting={isDetecting}
                    onFlashToggle={handleFlashToggle}
                    isFlashOn={isFlashOn}
                    onCameraFlip={handleCameraFlip}
                />

                {/* DETECTION FEED */}
                <DetectionFeed
                    detections={
                        lastDetectedObjects || []
                    }
                />

                {/* START / STOP LIVE DETECTION BUTTON */}
                <Pressable
                    style={[
                        styles.liveDetectionButton,
                        isDetecting
                            ? styles.liveDetectionButtonActive
                            : null
                    ]}
                    onPress={toggleDetection}
                    accessibilityLabel={
                        isDetecting
                            ? "Stop Live Detection"
                            : "Start Live Detection"
                    }
                    accessibilityRole="button"
                    accessibilityState={{
                        checked: isDetecting
                    }}
                >
                    <Text
                        style={
                            isDetecting
                                ? styles.liveStopButtonText
                                : styles.liveStartButtonText
                        }
                    >
                        {isDetecting
                            ? "STOP LIVE"
                            : "START LIVE"}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#000000"
    },

    loadingSafeArea: {
        flex: 1,
        backgroundColor: "#000000"
    },

    permissionSafeArea: {
        flex: 1,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center"
    },

    cameraContainer: {
        flex: 1,
        position: "relative",
        overflow: "hidden"
    },

    cameraPreview: {
        ...StyleSheet.absoluteFillObject
    },

    /* TOP BAR */

    topBar: {
        position: "absolute",
        top: 20,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        zIndex: 50
    },

    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center"
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#FFFFFF",
        marginRight: 8
    },

    statusDotActive: {
        backgroundColor: "#22C55E"
    },

    statusBadgeText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "600",
        textTransform: "uppercase"
    },

    topRightControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },

    cameraFlipButton: {
        width: 40,
        height: 40,
        borderRadius: 13,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center"
    },

    flashButton: {
        width: 40,
        height: 40,
        borderRadius: 13,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center"
    },

    flashActiveIndicator: {
        position: "absolute",
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#FFD700",
        opacity: 0.8
    },

    /* DETECTION FEED */

    detectionFeed: {
        position: "absolute",
        bottom: 145,
        left: 16,
        right: 16,
        gap: 8,
        zIndex: 40
    },

    emptyFeed: {
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 12,
        borderRadius: 12,
        alignItems: "center"
    },

    emptyFeedText: {
        color: "#B8C5D9",
        fontSize: 12
    },

    feedItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 10,
        borderRadius: 12,
        gap: 10
    },

    feedPriority: {
        fontSize: 18
    },

    feedContent: {
        flex: 1,
        gap: 2
    },

    feedLabel: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700"
    },

    feedDetails: {
        color: "#B8C5D9",
        fontSize: 11
    },

    /* LIVE DETECTION BUTTON */

    liveDetectionButton: {
        position: "absolute",
        bottom: 105,
        left: "50%",
        transform: [{ translateX: -115 }],
        minWidth: 230,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2563EB",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6
        },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 50
    },

    liveDetectionButtonActive: {
        backgroundColor: "#DC2626"
    },

    liveStartButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5
    },

    liveStopButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5
    },

    /* PERMISSION SCREEN */

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    loadingText: {
        color: "#FFFFFF",
        fontSize: 14
    },

    permissionContainer: {
        width: "80%",
        maxWidth: 400,
        padding: 30,
        borderRadius: 25,
        backgroundColor: "#000000",
        alignItems: "center"
    },

    permissionIconBox: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "rgba(255,255,255,0.1)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },

    permissionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 12,
        textAlign: "center"
    },

    permissionDescription: {
        fontSize: 14,
        color: "#B8C5D9",
        lineHeight: 20,
        textAlign: "center",
        marginBottom: 24
    },

    permissionButton: {
        width: "100%",
        paddingVertical: 14,
        borderRadius: 15,
        backgroundColor: "#1761B0",
        alignItems: "center"
    },

    permissionButtonText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#FFFFFF"
    }
});