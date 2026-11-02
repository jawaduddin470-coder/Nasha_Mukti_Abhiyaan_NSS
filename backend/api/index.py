import sys
import os
import types

# Ensure 'backend' namespace is available even when Vercel deploys with root='backend'
if "backend" not in sys.modules:
    _backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    _pkg = types.ModuleType("backend")
    _pkg.__path__ = [_backend_dir]
    sys.modules["backend"] = _pkg
    if _backend_dir not in sys.path:
        sys.path.insert(0, _backend_dir)

from app.main import app

__all__ = ["app"]
