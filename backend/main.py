import sys
import os
import types

# Ensure 'backend' namespace is available even when Vercel deploys with root='backend'
if "backend" not in sys.modules:
    _backend_dir = os.path.dirname(os.path.abspath(__file__))
    _pkg = types.ModuleType("backend")
    _pkg.__path__ = [_backend_dir]
    sys.modules["backend"] = _pkg
    if _backend_dir not in sys.path:
        sys.path.insert(0, _backend_dir)

try:
    from app.main import app
except Exception as _startup_exc:
    import traceback
    _error_trace = traceback.format_exc()
    import logging
    logging.error(f"FATAL BACKEND STARTUP ERROR: {_startup_exc}\n{_error_trace}")
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse

    app = FastAPI(title="NSS MJCET Backend Diagnostic Fallback")

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"])
    async def startup_error_fallback(path: str):
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "FastAPI Backend Startup Failed",
                "exception": str(_startup_exc),
                "traceback": _error_trace,
            },
        )

__all__ = ["app"]
