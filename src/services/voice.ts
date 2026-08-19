/**
 * VisionPath AI Voice Service
 * 
 * Text-to-speech integration for object detection guidance.
 * Uses expo-speech for audio output.
 * 
 * Features:
 * - Intelligent message generation based on detection results
 * - Priority-based announcement system
 * - Cooldown mechanism to prevent repetitive speech
 * - Object category awareness (HIGH_RISK, OBSTACLES, LOW_PRIORITY)
 * - Position and proximity language conversion
 */

import * as Speech from "expo-speech";

import { DetectionResult } from "@/services/api";

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

/**
 * Voice cooldown period in milliseconds.
 * Prevents repetitive speech for the same detection.
 */
export const VOICE_COOLDOWN_MS = 4000;

/**
 * Priority thresholds for voice announcement behavior.
 */
export const PRIORITY_CRITICAL = 5; // Immediate warning
export const PRIORITY_HIGH = 4;     // Quick announcement
export const PRIORITY_MEDIUM = 3;   // Normal announcement
export const PRIORITY_LOW = 2;      // Limited announcement
export const PRIORITY_MIN = 1;      // Minimum priority

// ============================================================================
// OBJECT CATEGORIES
// ============================================================================

/**
 * Categories for YOLO object types.
 * Used to generate appropriate message styles.
 */
export const OBJECT_CATEGORIES = {
    HIGH_RISK: [
        "person",
        "car",
        "bus",
        "truck",
        "motorcycle",
        "bicycle",
        "train",
        "traffic light",
        "stop sign",
        "fire hydrant",
        "street sign",
    ] as string[],
    
    OBSTACLES: [
        "chair",
        "bench",
        "table",
        "suitcase",
        "backpack",
        "umbrella",
        "box",
        "bin",
        "pole",
        "couch",
        "bed",
        "toilet",
        "tv",
        "laptop",
        "keyboard",
        "mouse",
        "remote",
        "microwave",
        "oven",
        "toaster",
        "sink",
        "refrigerator",
        "book",
        "clock",
        "vase",
        "scissors",
    ] as string[],
    
    LOW_PRIORITY: [
        "bottle",
        "cup",
        "wine glass",
        "fork",
        "knife",
        "spoon",
        "bowl",
        "banana",
        "apple",
        "sandwich",
        "orange",
        "carrot",
        "hot dog",
        "pizza",
        "donut",
        "cake",
        "chair",
    ] as string[],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a label belongs to a specific category.
 */
function getCategory(label: string): "HIGH_RISK" | "OBSTACLES" | "LOW_PRIORITY" | "GENERAL" {
    const labelLower = label.toLowerCase();
    
    if (OBJECT_CATEGORIES.HIGH_RISK.some(obj => labelLower.includes(obj))) {
        return "HIGH_RISK";
    }
    
    if (OBJECT_CATEGORIES.OBSTACLES.some(obj => labelLower.includes(obj))) {
        return "OBSTACLES";
    }
    
    if (OBJECT_CATEGORIES.LOW_PRIORITY.some(obj => labelLower.includes(obj))) {
        return "LOW_PRIORITY";
    }
    
    return "GENERAL";
}

/**
 * Convert position to natural language.
 */
function positionToLanguage(position: DetectionResult["position"]): string {
    switch (position) {
        case "left":
            return "on your left";
        case "right":
            return "on your right";
        case "center":
            return "ahead";
        default:
            return "in front";
    }
}

/**
 * Convert proximity to natural language with urgency.
 */
function proximityToLanguage(proximity: DetectionResult["proximity"], priority: number): string {
    // Higher priority items use more urgent language for same proximity
    if (proximity === "close") {
        if (priority >= PRIORITY_CRITICAL) return "very close";
        return "close";
    }
    
    if (proximity === "medium") {
        return "nearby";
    }
    
    return "in the distance";
}

/**
 * Check if detection is directly ahead (center position).
 */
function isDirectlyAhead(detection: DetectionResult): boolean {
    return detection.position === "center";
}

/**
 * Check if detection is close and in a critical position.
 */
function isUrgentSituation(detection: DetectionResult): boolean {
    return detection.position === "center" && detection.proximity === "close";
}

// ============================================================================
// MESSAGE GENERATION
// ============================================================================

/**
 * Generate an intelligent message from a detection result.
 * 
 * Uses:
 * - Object category for appropriate message style
 * - Position for directional language
 * - Proximity for urgency
 * - Priority for importance indication
 * 
 * @param detection - Detection result to format
 * @returns Formatted string for voice output
 */
export function formatDetectionForVoice(detection: DetectionResult): string {
    const { label, position, proximity, priority } = detection;
    
    const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
    const positionLang = positionToLanguage(position);
    const proximityLang = proximityToLanguage(proximity, priority);
    const category = getCategory(label);
    
    // Priority 5: Critical - immediate warning with urgency
    if (priority === PRIORITY_CRITICAL) {
        if (isUrgentSituation(detection)) {
            // Directly ahead and very close - immediate warning
            if (category === "HIGH_RISK") {
                return `Warning. ${formattedLabel} directly ahead and very close.`;
            }
            if (category === "OBSTACLES") {
                return `Warning. ${formattedLabel} directly ahead and very close.`;
            }
            return `Warning. ${formattedLabel} directly ahead and very close.`;
        }
        
        if (category === "HIGH_RISK") {
            return `Warning. ${formattedLabel} ${positionLang} and ${proximityLang}.`;
        }
        return `Warning. ${formattedLabel} ${positionLang} and ${proximityLang}.`;
    }
    
    // Priority 4: High importance
    if (priority === PRIORITY_HIGH) {
        if (category === "HIGH_RISK") {
            if (position === "center") {
                return `${formattedLabel} ahead.`;
            }
            return `${formattedLabel} ${positionLang}.`;
        }
        if (category === "OBSTACLES") {
            return `${formattedLabel} ${positionLang}.`;
        }
        return `${formattedLabel} ${positionLang} and ${proximityLang}.`;
    }
    
    // Priority 3: Medium importance
    if (priority === PRIORITY_MEDIUM) {
        if (isDirectlyAhead(detection)) {
            return `${formattedLabel} ahead.`;
        }
        return `${formattedLabel} ${positionLang}.`;
    }
    
    // Priority 1-2: Low importance - concise
    if (category === "HIGH_RISK") {
        return `${formattedLabel} ${positionLang}.`;
    }
    return `${formattedLabel} ${positionLang}.`;
}

// ============================================================================
// COOLDOWN & DUPLICATE PREVENTION
// ============================================================================

/**
 * Detection key for cooldown tracking.
 * Combines label, position, and proximity.
 */
export function getDetectionKey(detection: DetectionResult): string {
    return `${detection.label}-${detection.position}-${detection.proximity}`;
}

/**
 * State for tracking voice announcements.
 */
interface VoiceState {
    lastAnnouncedKey: string | null;
    lastAnnouncementTime: number | null;
    isSpeaking: boolean;
    pendingDetection: DetectionResult | null;
    isVoiceEnabled: boolean;
}

const voiceState: VoiceState = {
    lastAnnouncedKey: null,
    lastAnnouncementTime: null,
    isSpeaking: false,
    pendingDetection: null,
    isVoiceEnabled: true, // Default: ON
};

/**
 * Check if a detection should be announced based on cooldown and duplicates.
 * 
 * Rules:
 * 1. Same detection within cooldown: skip
 * 2. Position change: allow announcement
 * 3. Proximity change: allow announcement (especially important)
 * 4. Priority increase: allow immediate announcement
 * 5. Priority 5 alerts override lower-priority cooldowns
 * 
 * @param detection - Current detection result
 * @param force - Force announcement (bypass cooldown)
 * @returns true if the detection should be announced
 */
export function shouldAnnounceDetection(
    detection: DetectionResult,
    force: boolean = false
): boolean {
    const key = getDetectionKey(detection);
    const now = Date.now();
    
    // If force is true, always announce
    if (force) {
        return true;
    }
    
    // If no prior announcement, announce
    if (voiceState.lastAnnouncedKey === null) {
        return true;
    }
    
    // Check if same detection
    if (voiceState.lastAnnouncedKey === key) {
        // Same detection - check cooldown
        if (voiceState.lastAnnouncementTime !== null) {
            const elapsed = now - voiceState.lastAnnouncementTime;
            if (elapsed < VOICE_COOLDOWN_MS) {
                return false; // Still in cooldown
            }
        }
        return true;
    }
    
    // Different detection - check if it's a significant change
    const lastKeyParts = voiceState.lastAnnouncedKey.split("-");
    const currentKeyParts = key.split("-");
    
    // Position changed - announce
    if (lastKeyParts[1] !== currentKeyParts[1]) {
        return true;
    }
    
    // Proximity changed - announce (especially important)
    if (lastKeyParts[2] !== currentKeyParts[2]) {
        return true;
    }
    
    // If we get here, it's a different object but same position/proximity
    // Check if new one has higher priority
    if (detection.priority > PRIORITY_LOW) {
        return true;
    }
    
    return false;
}

// ============================================================================
// SPEECH CONTROL
// ============================================================================

/**
 * Stop any ongoing speech.
 */
export function stopSpeaking(): void {
    if (voiceState.isSpeaking) {
        Speech.stop();
        voiceState.isSpeaking = false;
        voiceState.pendingDetection = null;
    }
}

/**
 * Check if speech is currently playing.
 */
export function isSpeaking(): boolean {
    return voiceState.isSpeaking;
}

// ============================================================================
// MAIN VOICE FUNCTION
// ============================================================================

/**
 * Speak a detection result with intelligent message generation.
 * 
 * This function:
 * 1. Checks if voice is enabled
 * 2. Checks cooldown and duplicate prevention
 * 3. Generates appropriate message based on priority and category
 * 4. Plays the speech using expo-speech
 * 5. Updates voice state
 * 
 * @param detection - Detection result to speak
 * @param force - Force announcement regardless of cooldown
 */
export function speakDetection(
    detection: DetectionResult,
    force: boolean = false
): void {
    // Check if voice is enabled
    if (!voiceState.isVoiceEnabled) {
        return;
    }
    
    // Stop any pending speech
    if (voiceState.pendingDetection !== null) {
        voiceState.pendingDetection = null;
    }
    
    // Check if we should speak
    if (!shouldAnnounceDetection(detection, force)) {
        console.log(`[VOICE] Skipped: ${getDetectionKey(detection)} (in cooldown)`);
        return;
    }
    
    // Generate message
    const message = formatDetectionForVoice(detection);
    
    console.log(`[VOICE] Speaking: ${message}`);
    
    // Play speech
    Speech.speak(message, {
        language: "en",
        pitch: 1.0,
        rate: 0.85, // Slightly slower for clarity
        onBoundary: (event: { name: string }) => {
            if (event.name === "start") {
                voiceState.isSpeaking = true;
            }
            if (event.name === "end") {
                voiceState.isSpeaking = false;
            }
        },
        onError: (error) => {
            console.error("[VOICE] Speech error:", error);
            voiceState.isSpeaking = false;
        },
    });
    
    // Update state
    voiceState.lastAnnouncedKey = getDetectionKey(detection);
    voiceState.lastAnnouncementTime = Date.now();
}

// ============================================================================
// CLEANUP
// ============================================================================

/**
 * Clean up voice service state.
 * Call this when leaving the camera screen or stopping detection.
 */
export function cleanupVoiceService(): void {
    stopSpeaking();
    voiceState.lastAnnouncedKey = null;
    voiceState.lastAnnouncementTime = null;
    voiceState.pendingDetection = null;
}

/**
 * Enable or disable voice feedback.
 * 
 * @param enabled - true to enable, false to disable
 */
export function setVoiceEnabled(enabled: boolean): void {
    voiceState.isVoiceEnabled = enabled;
    console.log(`[VOICE] Voice ${enabled ? "enabled" : "disabled"}`);
}

/**
 * Check if voice feedback is currently enabled.
 */
export function isVoiceEnabled(): boolean {
    return voiceState.isVoiceEnabled;
}
