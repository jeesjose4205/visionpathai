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
const BASE_URL = "http://YOUR_COMPUTER_IP:8000";

// TypeScript interfaces for API response types
export interface DetectionResult {
  /**
   * Object class label from YOLO model (e.g., "person", "car", "chair")
   */
  label: string;
  
  /**
   * Confidence score between 0.0 and 1.0
   */
  confidence: number;
  
  /**
   * Bounding box top-left X coordinate (pixels)
   */
  x1: number;
  
  /**
   * Bounding box top-left Y coordinate (pixels)
   */
  y1: number;
  
  /**
   * Bounding box bottom-right X coordinate (pixels)
   */
  x2: number;
  
  /**
   * Bounding box bottom-right Y coordinate (pixels)
   */
  y2: number;
}

export interface DetectionResponse {
  /**
   * List of detected objects with their bounding boxes and confidence scores
   */
  detections: DetectionResult[];
}

/**
 * Send an image to the FastAPI backend for object detection.
 * 
 * @param imageUri - Local file URI of the image to analyze
 * @returns Promise<DetectionResponse> - Array of detected objects with bounding boxes
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
        // "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
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
