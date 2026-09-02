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

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

/**
 * Default backend URL for development.
 * Change this to your computer's local network IP address when running on a physical device.
 */
export const DEFAULT_BACKEND_URL = "http://10.141.118.91:8000";

/**
 * Backend URL configuration.
 * Can be overridden by user in Settings.
 * Default: DEFAULT_BACKEND_URL
 */
export let BACKEND_URL = DEFAULT_BACKEND_URL;

/**
 * Request timeout in milliseconds.
 * Requests exceeding this duration will be aborted.
 */
export const REQUEST_TIMEOUT_MS = 12000; // 12 seconds

/**
 * Maximum number of retry attempts for failed requests.
 */
export const MAX_RETRIES = 3;

/**
 * Initial delay for exponential backoff in milliseconds.
 */
export const INITIAL_RETRY_DELAY_MS = 500;

/**
 * Maximum delay for exponential backoff in milliseconds.
 */
export const MAX_RETRY_DELAY_MS = 3000;

// ============================================================================
// NETWORK STATE MANAGEMENT
// ============================================================================

/**
 * Connection state for backend availability.
 */
export type ConnectionState = 'connected' | 'checking' | 'disconnected';

/**
 * Connection state listener callback.
 */
export type ConnectionStateListener = (state: ConnectionState) => void;

// Connection state management
let connectionState: ConnectionState = 'checking';
const connectionListeners: Set<ConnectionStateListener> = new Set();

/**
 * Subscribe to connection state changes.
 * Returns unsubscribe function.
 */
export function subscribeToConnectionState(listener: ConnectionStateListener): () => void {
    connectionListeners.add(listener);
    // Notify immediately with current state
    listener(connectionState);
    
    return () => {
        connectionListeners.delete(listener);
    };
}

/**
 * Notify all listeners of connection state change.
 */
function notifyConnectionState(newState: ConnectionState): void {
    if (connectionState !== newState) {
        connectionState = newState;
        console.log(`[API] Connection state changed: ${connectionState}`);
        connectionListeners.forEach(listener => listener(newState));
    }
}

/**
 * Check backend health and update connection state.
 * Returns the current connection state.
 */
export async function checkBackendHealth(): Promise<ConnectionState> {
    if (connectionState === 'checking') {
        return connectionState;
    }
    
    notifyConnectionState('checking');
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        
        const response = await fetch(`${BACKEND_URL}/health`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`[API] Backend health check: ${data.status}`);
            notifyConnectionState('connected');
            return 'connected';
        } else {
            console.log(`[API] Backend health check failed: ${response.status}`);
            notifyConnectionState('disconnected');
            return 'disconnected';
        }
    } catch (error) {
        console.log(`[API] Backend health check error: ${String(error)}`);
        notifyConnectionState('disconnected');
        return 'disconnected';
    }
}

/**
 * Set the backend URL.
 * Call this when user changes the backend URL in Settings.
 */
export function setBackendUrl(url: string): void {
    // Validate URL format (basic check)
    try {
        new URL(url);
        BACKEND_URL = url;
        console.log(`[API] Backend URL updated: ${url}`);
        
        // Reset connection state after URL change
        notifyConnectionState('checking');
        
        // Check new backend health
        checkBackendHealth();
    } catch (error) {
        console.error(`[API] Invalid backend URL: ${url}`);
        throw new Error('Invalid backend URL format');
    }
}

/**
 * Get the current backend URL.
 */
export function getBackendUrl(): string {
    return BACKEND_URL;
}

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
 * Send an image to the FastAPI backend for object detection with retry logic.
 * 
 * @param imageUri - Local file URI of the image to analyze
 * @returns Promise<DetectionResponse> - Array of detected objects with metadata
 * @throws Error if the API request fails after all retries or returns an error status
 */
export async function detectObjects(imageUri: string): Promise<DetectionResponse> {
  // Validate input
  if (!imageUri || imageUri.trim() === "") {
    throw new Error("Image URI cannot be empty");
  }

  // Get backend URL from centralized config
  const backendUrl = getBackendUrl();
  
  console.log("[API] Uploading image for object detection...");
  console.log(`[API] Backend URL: ${backendUrl}`);

  // Create FormData for multipart/form-data upload
  // For React Native, keep the file:// prefix intact in the uri property
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: "photo.jpg",
    type: "image/jpeg",
  } as any);

  // Retry logic with exponential backoff
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[API] Attempt ${attempt}/${MAX_RETRIES}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const response = await fetch(`${backendUrl}/detect`, {
        method: "POST",
        headers: {
          // Let fetch set the Content-Type with proper boundary
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
      lastError = error as Error;
      
      // Check if this is a network error or timeout
      const isNetworkError = error instanceof TypeError && String(error).includes('Network request failed');
      const isAbortError = error instanceof Error && error.message.includes('abort');
      
      if (isNetworkError || isAbortError) {
        console.log(`[API] Network error on attempt ${attempt}: ${String(error)}`);
        
        // If this is the last attempt, throw the error
        if (attempt === MAX_RETRIES) {
          console.log(`[API] Max retries reached. Throwing final error.`);
          throw new Error(`Network error: ${lastError?.message || 'Connection failed after retries'}`);
        }
        
        // Calculate exponential backoff delay
        const delay = Math.min(
          INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1),
          MAX_RETRY_DELAY_MS
        );
        
        console.log(`[API] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
      } else {
        // For other errors (e.g., server errors, validation errors), don't retry
        console.log(`[API] Non-retryable error: ${String(error)}`);
        throw error;
      }
    }
  }
  
  // This should never be reached, but just in case
  throw lastError || new Error("Object detection failed");
}

/**
 * Error classification for API failures.
 */
export type ApiErrorType = 
  | 'network_error' 
  | 'timeout' 
  | 'backend_error' 
  | 'server_error' 
  | 'invalid_response' 
  | 'unknown';

/**
 * Error details for API failures.
 */
export interface ApiErrorDetails {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  detail?: string;
}

/**
 * Classify an error from the API service.
 * 
 * @param error - The error to classify
 * @returns Classified error details
 */
export function classifyApiError(error: Error): ApiErrorDetails {
  const message = error.message || 'Unknown error';
  
  // Check for network errors
  if (message.includes('Network request failed') || message.includes('Failed to fetch')) {
    return {
      type: 'network_error',
      message: 'Network error. Check your connection and backend URL.',
    };
  }
  
  // Check for timeout
  if (message.includes('abort') || message.includes('timeout')) {
    return {
      type: 'timeout',
      message: 'Request timeout. The backend took too long to respond.',
    };
  }
  
  // Check for backend errors (4xx client errors)
  const backendMatch = message.match(/Backend error: (.+)$/);
  if (backendMatch) {
    const detail = backendMatch[1];
    return {
      type: 'backend_error',
      message: `Backend error: ${detail}`,
      detail,
    };
  }
  
  // Check for server errors (5xx)
  const serverMatch = message.match(/HTTP 5\d\d: (.+)$/);
  if (serverMatch) {
    const detail = serverMatch[1];
    return {
      type: 'server_error',
      message: `Server error: ${detail}`,
      detail,
    };
  }
  
  // Check for invalid response
  if (message.includes('Invalid response format') || message.includes('expected')) {
    return {
      type: 'invalid_response',
      message: 'Invalid response from backend. Please try again.',
    };
  }
  
  // Default to unknown
  return {
    type: 'unknown',
    message,
  };
}

/**
 * Get a user-friendly error message for API failures.
 * 
 * @param error - The error to format
 * @returns User-friendly error message
 */
export function getFriendlyErrorMessage(error: Error): string {
  const details = classifyApiError(error);
  
  switch (details.type) {
    case 'network_error':
      return 'Cannot connect to backend. Check your connection and backend URL.';
    
    case 'timeout':
      return 'Request timeout. The backend took too long to respond. Please try again.';
    
    case 'backend_error':
      return details.message;
    
    case 'server_error':
      return details.message;
    
    case 'invalid_response':
      return 'Invalid response from backend. Please try again.';
    
    default:
      return `Detection failed: ${details.message}`;
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
