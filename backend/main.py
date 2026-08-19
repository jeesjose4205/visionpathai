"""
VisionPath AI Backend - FastAPI Application

Object detection endpoint using Ultralytics YOLO model.
"""

import os
import traceback
from typing import List

import cv2
import numpy as np
import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO


# ============================================================================
# CONFIGURATION CONSTANTS
# ============================================================================

# YOLO model confidence threshold
# Objects with confidence below this value are filtered out
YOLO_CONFIDENCE_THRESHOLD = 0.25

# Image dimensions for position estimation (default)
DEFAULT_IMAGE_WIDTH = 640
DEFAULT_IMAGE_HEIGHT = 640

# Position estimation thresholds (proportions of image width)
# left: center_x < left_boundary
# center: left_boundary <= center_x < right_boundary
# right: center_x >= right_boundary
LEFT_THRESHOLD = 0.33  # Left third
RIGHT_THRESHOLD = 0.67  # Right third

# Proximity estimation thresholds (proportions of image area)
# close: relative_area >= close_threshold
# medium: medium_threshold <= relative_area < close_threshold
# far: relative_area < medium_threshold
PROXIMITY_CLOSE_THRESHOLD = 0.25  # Large portion of image
PROXIMITY_MEDIUM_THRESHOLD = 0.0625  # Medium portion (1/16th)

# Priority base scores for object categories
# Higher priority for objects that are more important for navigation
PRIORITY_BASE_SCORES = {
    "person": 5,  # Highest priority for safety
    "car": 4,     # Vehicles are important
    "bus": 4,
    "truck": 4,
    "bicycle": 4,
    "motorcycle": 4,
    "train": 3,
    "airplane": 3,
    "boat": 3,
    "traffic light": 3,
    "fire hydrant": 3,
    "stop sign": 3,
    "bench": 2,
    "bird": 2,
    "cat": 2,
    "dog": 2,
    "horse": 2,
    "sheep": 2,
    "cow": 2,
    "elephant": 2,
    "bear": 2,
    "zebra": 2,
    "giraffe": 2,
}

# Default priority for unrecognized objects
DEFAULT_PRIORITY = 1


# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class BoundingBox(BaseModel):
    """Bounding box metadata with calculated properties."""
    x1: float
    y1: float
    x2: float
    y2: float
    center_x: float
    center_y: float
    width: float
    height: float
    area: float


class DetectionResult(BaseModel):
    """Single detection result from YOLO model with enhanced metadata."""
    label: str
    confidence: float
    bbox: BoundingBox
    position: str  # "left", "center", or "right"
    proximity: str  # "close", "medium", or "far"
    priority: int  # 1 (lowest) to 5 (highest)


class DetectionResponse(BaseModel):
    """Response structure for object detection."""
    detections: List[DetectionResult]


# ============================================================================
# FASTAPI APPLICATION
# ============================================================================

app = FastAPI(
    title="VisionPath AI API",
    description="Object detection backend using Ultralytics YOLO",
    version="1.0.0"
)

# CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# ============================================================================
# GLOBAL STATE
# ============================================================================

# YOLO model - loaded once at startup
MODEL = None


def get_model() -> YOLO:
    """Get or initialize the YOLO model."""
    global MODEL
    if MODEL is None:
        # Load YOLOv8-nano model
        # Ultralytics will download automatically if not found
        MODEL = YOLO("yolov8n.pt")
    return MODEL


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def calculate_position(center_x: float, image_width: int) -> str:
    """
    Calculate horizontal position of an object within the image.
    
    Args:
        center_x: X coordinate of the object's center
        image_width: Total width of the image in pixels
        
    Returns:
        "left" if object is in left third
        "center" if object is in middle third
        "right" if object is in right third
    """
    left_boundary = image_width * LEFT_THRESHOLD
    right_boundary = image_width * RIGHT_THRESHOLD
    
    if center_x < left_boundary:
        return "left"
    elif center_x >= right_boundary:
        return "right"
    else:
        return "center"


def calculate_proximity(bounding_box_area: float, image_area: float) -> str:
    """
    Calculate approximate proximity based on bounding box size.
    
    NOTE: This is an approximate visual heuristic only.
    It estimates relative size in the image, not actual physical distance.
    Larger apparent size (closer to camera) = "close"
    Smaller apparent size (farther from camera) = "far"
    
    Args:
        bounding_box_area: Area of the bounding box in pixels
        image_area: Total area of the image in pixels
        
    Returns:
        "close" if object fills significant portion of image
        "medium" if object fills moderate portion
        "far" if object is small in image
    """
    if image_area <= 0:
        return "far"
    
    relative_area = bounding_box_area / image_area
    
    if relative_area >= PROXIMITY_CLOSE_THRESHOLD:
        return "close"
    elif relative_area >= PROXIMITY_MEDIUM_THRESHOLD:
        return "medium"
    else:
        return "far"


def calculate_priority(label: str, proximity: str) -> int:
    """
    Calculate priority score for a detected object.
    
    Priority depends on:
    1. Object category importance (person > vehicle > other)
    2. Approximate proximity (closer = higher priority)
    
    Args:
        label: Object class label
        proximity: "close", "medium", or "far"
        
    Returns:
        Integer priority from 1 (lowest) to 5 (highest)
    """
    # Get base score for object category
    base_priority = PRIORITY_BASE_SCORES.get(label.lower(), DEFAULT_PRIORITY)
    
    # Adjust priority based on proximity
    # Closer objects get higher priority
    proximity_multiplier = {
        "close": 1.0,
        "medium": 0.75,
        "far": 0.5,
    }
    
    adjusted = base_priority * proximity_multiplier.get(proximity, 0.5)
    
    # Round to nearest integer, clamped to 1-5 range
    return max(1, min(5, round(adjusted)))


def get_priority_emoji(priority: int) -> str:
    """Get emoji representation for priority level."""
    emojis = {1: "⚪", 2: "⚪", 3: "🟡", 4: "🟠", 5: "🔴"}
    return emojis.get(priority, "⚪")


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "name": "VisionPath AI API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": ["/detect"],
        "yolo_model": "yolov8n.pt",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers."""
    return {"status": "healthy"}


@app.post("/detect", response_model=DetectionResponse)
async def detect_objects(file: UploadFile = File(...)):
    """
    Perform object detection on an uploaded image.
    
    Args:
        file: Uploaded image file (multipart/form-data with 'file' field)
        
    Returns:
        DetectionResponse: List of detected objects with metadata including:
            - label, confidence, bounding box
            - position (left/center/right)
            - proximity (close/medium/far)
            - priority (1-5)
            
    Raises:
        HTTPException: For invalid file uploads or processing errors
    """
    # Validate that a file was uploaded
    if file.filename is None or file.filename == "":
        raise HTTPException(
            status_code=400,
            detail="No file uploaded. Please provide a file with the 'file' field."
        )
    
    # Read the uploaded file content
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read uploaded file: {str(e)}")
    
    # Validate file extension (basic check)
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'}
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Decode image using OpenCV
    try:
        file_buffer = np.frombuffer(contents, dtype=np.uint8)
        image = cv2.imdecode(file_buffer, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Failed to decode image. File may be corrupted.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image decoding failed: {str(e)}")
    
    # Get image dimensions for position/proximity calculations
    image_height, image_width = image.shape[:2]
    image_area = image_width * image_height
    
    # Run object detection
    try:
        model = get_model()
        
        # Perform inference
        results = model.predict(
            source=image,
            conf=YOLO_CONFIDENCE_THRESHOLD,
            verbose=False
        )
        
        # Extract detection results
        detections: List[DetectionResult] = []
        
        if results and len(results) > 0:
            result = results[0]
            
            if result.boxes is not None:
                for box in result.boxes:
                    # Get bounding box coordinates
                    xyxy = box.xyxy[0].cpu().numpy()
                    x1, y1, x2, y2 = float(xyxy[0]), float(xyxy[1]), float(xyxy[2]), float(xyxy[3])
                    
                    # Calculate bounding box metadata
                    width = x2 - x1
                    height = y2 - y1
                    center_x = x1 + width / 2
                    center_y = y1 + height / 2
                    area = width * height
                    
                    bbox = BoundingBox(
                        x1=x1,
                        y1=y1,
                        x2=x2,
                        y2=y2,
                        center_x=center_x,
                        center_y=center_y,
                        width=width,
                        height=height,
                        area=area
                    )
                    
                    # Calculate position, proximity, and priority
                    position = calculate_position(center_x, image_width)
                    proximity = calculate_proximity(area, image_area)
                    priority = calculate_priority(model.names[int(box.cls[0].cpu().numpy())], proximity)
                    
                    # Get confidence score and label
                    confidence = float(box.conf[0].cpu().numpy())
                    label = model.names[int(box.cls[0].cpu().numpy())]
                    
                    detections.append(DetectionResult(
                        label=label,
                        confidence=confidence,
                        bbox=bbox,
                        position=position,
                        proximity=proximity,
                        priority=priority
                    ))
        
        return DetectionResponse(detections=detections)
        
    except Exception as e:
        error_detail = f"Model inference failed: {str(e)}"
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_detail)


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
