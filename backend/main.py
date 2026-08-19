"""
VisionPath AI Backend - FastAPI Application

Object detection endpoint using Ultralytics YOLO model.
"""

import io
import os
import tempfile
import traceback
from typing import List

import cv2
import numpy as np
import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO


# Pydantic models for response structure
class DetectionResult(BaseModel):
    """Single detection result from YOLO model."""
    label: str
    confidence: float
    x1: float
    y1: float
    x2: float
    y2: float


class DetectionResponse(BaseModel):
    """Response structure for object detection."""
    detections: List[DetectionResult]


# FastAPI application setup
app = FastAPI(
    title="VisionPath AI API",
    description="Object detection backend using Ultralytics YOLO",
    version="1.0.0"
)

# CORS middleware for development
# Configure to allow requests from Expo development server
# Tighten this configuration for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Global YOLO model instance - loaded once at startup
MODEL = None


def get_model() -> YOLO:
    """Get or initialize the YOLO model."""
    global MODEL
    if MODEL is None:
        # Load a lightweight YOLO model for initial testing
        # 'yolov8n.pt' is the nano model - fastest and smallest
        # Ultralytics will download automatically if not found
        MODEL = YOLO("yolov8n.pt")
    return MODEL


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "name": "VisionPath AI API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": ["/detect"]
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
        file: Uploaded image file (multipart/form-data)
        
    Returns:
        DetectionResponse: List of detected objects with bounding boxes
        
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
    
    # Save uploaded file to temporary file for processing
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
            tmp_file.write(contents)
            tmp_file_path = tmp_file.name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {str(e)}")
    
    # Clean up temp file after processing
    try:
        # Decode image using OpenCV
        try:
            file_buffer = np.frombuffer(contents, dtype=np.uint8)
            image = cv2.imdecode(file_buffer, cv2.IMREAD_COLOR)
            
            if image is None:
                raise HTTPException(status_code=400, detail="Failed to decode image. File may be corrupted.")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Image decoding failed: {str(e)}")
        
        # Run object detection
        try:
            model = get_model()
            
            # Perform inference
            # conf=0.25 sets minimum confidence threshold
            # verbose=False suppresses YOLO output to console
            results = model.predict(
                source=image,
                conf=0.25,
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
                        
                        # Get confidence score
                        confidence = float(box.conf[0].cpu().numpy())
                        
                        # Get class label
                        class_idx = int(box.cls[0].cpu().numpy())
                        label = model.names[class_idx]
                        
                        detections.append(DetectionResult(
                            label=label,
                            confidence=confidence,
                            x1=x1,
                            y1=y1,
                            x2=x2,
                            y2=y2
                        ))
            
            return DetectionResponse(detections=detections)
            
        except Exception as e:
            error_detail = f"Model inference failed: {str(e)}"
            # Log full traceback for debugging
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=error_detail)
            
    finally:
        # Clean up temporary file
        try:
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
        except Exception:
            pass  # Ignore cleanup errors


# Run the application if executed directly
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
