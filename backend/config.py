"""
VisionPath AI Backend Configuration
"""

import logging
import os
from typing import List

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("visionpath")

# ============================================================================
# ENVIRONMENT CONFIGURATION
# ============================================================================

# Server configuration
VISIONPATH_HOST = os.getenv("VISIONPATH_HOST", "0.0.0.0")
VISIONPATH_PORT = int(os.getenv("VISIONPATH_PORT", "8000"))

# File upload limits (bytes)
VISIONPATH_MAX_FILE_SIZE = int(os.getenv("VISIONPATH_MAX_FILE_SIZE", "5242880"))  # 5MB

# Detection confidence threshold
VISIONPATH_CONFIDENCE_THRESHOLD = float(
    os.getenv("VISIONPATH_CONFIDENCE_THRESHOLD", "0.25")
)

# CORS allowed origins
# Development default allows localhost and Expo development
VISIONPATH_ALLOWED_ORIGINS = os.getenv(
    "VISIONPATH_ALLOWED_ORIGINS",
    "http://localhost:8081,http://localhost:8082,http://localhost:19006,http://127.0.0.1:8000",
)
ALLOWED_ORIGINS_LIST: List[str] = VISIONPATH_ALLOWED_ORIGINS.split(",")

# Timeouts (seconds)
VISIONPATH_REQUEST_TIMEOUT = int(os.getenv("VISIONPATH_REQUEST_TIMEOUT", "15"))

# ============================================================================
# SUPPORTED IMAGE EXTENSIONS
# ============================================================================

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}
SUPPORTED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/tiff",
    "image/webp",
}

# ============================================================================
# VALIDATION THRESHOLDS
# ============================================================================

# Position thresholds (proportions of image width)
LEFT_THRESHOLD = 0.33
RIGHT_THRESHOLD = 0.67

# Proximity thresholds (proportions of image area)
PROXIMITY_CLOSE_THRESHOLD = 0.25
PROXIMITY_MEDIUM_THRESHOLD = 0.0625

# ============================================================================
# PRIORITY SCORES
# ============================================================================

PRIORITY_BASE_SCORES = {
    "person": 5,
    "car": 4,
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

DEFAULT_PRIORITY = 1

# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================


def is_valid_extension(filename: str) -> bool:
    """Check if file has a supported image extension."""
    ext = os.path.splitext(filename)[1].lower()
    return ext in SUPPORTED_EXTENSIONS


def is_valid_mime_type(content_type: str) -> bool:
    """Check if MIME type is supported."""
    return content_type in SUPPORTED_MIME_TYPES
