import sys
import os

# Ensure backend root is on Python module search path
sys.path.insert(0, os.path.dirname(__file__))

from app.main import app

__all__ = ["app"]
