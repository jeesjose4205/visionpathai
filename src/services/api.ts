/**
 * VisionPath AI API Service
 * 
 * Backend: FastAPI with Ultralytics YOLO object detection
 * Endpoint: POST /detect
 * 
 * IMPORTANT: Backend Configuration for Physical Expo Go Devices
 * --------------------------------------------------------------
 * When running on a physical Android device:
 * - "localhost" and "127.0.0.1" refer to the phone itself, NOT the computer
 * - The FastAPI backend runs on your development computer
 * - Replace "YOUR_COMPUTER_IP" with your computer's local network IPv4 address
 * - Both devices must be on the same WiFi network
 * 
 * To find your computer's IP address:
 * - Windows: ipconfig (look for IPv4 under your WiFi adapter)
 * - macOS: ifconfig (look for en0 or en1)
 * - Linux: ip addr show
 */

// Backend URL configuration
// TODO: Replace YOUR_COMPUTER_IP with your actual computer's local network IP
// Example: const BASE_URL = "http://192.168.1.100:8000";
const BASE_URL = "http://10.58.116.91:8000";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Bounding box metadata with calculated properties.
 */
export interface BoundingBox {
  /**
   * Top-left X coordinate (pixels)
   */
  x1: number;
  
  /**
   * Top-left Y coordinate (pixels)
   */
  y1: number;
  
  /**
   * Bottom-right X coordinate (pixels)
   */
  x2: number;
  
  /**
   * Bottom-right Y coordinate (pixels)
   */
  y2: number;
  
  /**
   * Center X coordinate (pixels)
   */
  center_x: number;
  
  /**
   * Center Y coordinate (pixels)
   */
  center_y: number;
  
  /**
   * Width in pixels
   */
  width: number;
  
  /**
   * Height in pixels
   */
  height: number;
  
  /**
   * Area in pixels
   */
  area: number;
}

/**
 * Single detection result from the backend.
 */
export interface DetectionResult {
  /**
   * Object class label (e.g., "person", "car", "chair")
   */
  label: string;
  
  /**
   * Confidence score between 0.0 and 1.0
   */
  confidence: number;
  
  /**
   * Bounding box with full metadata
   */
  bbox: BoundingBox;
  
  /**
   * Horizontal position relative to image: "left", "center", or "right"
   */
  position: "left" | "center" | "right";
  
  /**
   * Approximate proximity based on apparent size: "close", "medium", or "far"
   */
  proximity: "close" | "medium" | "far";
  
  /**
   * Priority score from 1 (lowest) to 5 (highest)
   */
  priority: number;
}

/**
 * Response structure for object detection.
 */
export interface DetectionResponse {
  /**
   * List of detected objects with metadata
   */
  detections: DetectionResult[];
}

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * Send an image to the FastAPI backend for object detection.
 * 
 * @param imageUri - Local file URI of the image to analyze
 * @returns Promise<DetectionResponse> - Array of detected objects with metadata
 * @throws Error if the API request fails or returns an error status
 */
export async function detectObjects(imageUri: string): Promise<DetectionResponse> {
  // Validate input
  if (!imageUri || imageUri.trim() === "") {
    throw new Error("Image URI cannot be empty");
  }

  console.log("[API] Uploading image for object detection...");
  console.log(`[API] Backend URL: ${BASE_URL}`);

  // Create FormData for multipart/form-data upload
  // For React Native, keep the file:// prefix intact in the uri property
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: "photo.jpg",
    type: "image/jpeg",
  } as any);

  try {
    console.log(`[API] Sending POST request to ${BASE_URL}/detect`);

    const response = await fetch(`${BASE_URL}/detect`, {
      method: "POST",
      headers: {
        // Let fetch set the Content-Type with proper boundary
      },
      body: formData,
    });

    console.log(`[API] HTTP response status: ${response.status} ${response.statusText}`);

    // Check for non-successful HTTP status
    if (!response.ok) {
      let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
      
      // Try to parse error details from response body
      try {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.detail) {
          errorDetail = errorData.detail;
        }
      } catch {
        // Ignore JSON parsing errors for error reporting
      }
      
      throw new Error(`Backend error: ${errorDetail}`);
    }

    // Parse JSON response
    const result: DetectionResponse = await response.json();

    // Validate response structure
    if (!result || !Array.isArray(result.detections)) {
      throw new Error("Invalid response format: expected 'detections' array");
    }

    console.log(`[API] Detected ${result.detections.length} object(s)`);
    console.log(`[API] Detection result:`, result);

    return result;
    
  } catch (error) {
    console.error("[API] Error during object detection:", error);
    
    // Rethrow with clearer context
    throw new Error(`Object detection failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get the most important detection from a list.
 * Sorts by priority descending and returns the highest priority object.
 * 
 * @param detections - Array of detection results
 * @returns The highest priority detection, or undefined if no detections
 */
export function getMostImportantDetection(detections: DetectionResult[]): DetectionResult | undefined {
  if (!detections || detections.length === 0) {
    return undefined;
  }
  
  // Sort by priority descending
  const sorted = [...detections].sort((a, b) => b.priority - a.priority);
  
  return sorted[0];
}

/**
 * Format detection result for voice guidance.
 * 
 * @param detection - Detection result to format
 * @returns Formatted string for voice output
 */
export function formatDetectionForVoice(detection: DetectionResult): string {
  const { label, position, proximity } = detection;
  
  // Capitalize first letter
  const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
  
  return `${formattedLabel} • ${position.toUpperCase()} • ${proximity.toUpperCase()}`;
}
