import sys
import os

# Add backend directory to Python sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.main import app

__all__ = ["app"]
