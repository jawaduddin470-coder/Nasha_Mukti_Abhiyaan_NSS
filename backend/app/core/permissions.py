"""
Role-Based Access Control (RBAC) Policies
NSS MJCET Nasha Mukti Abhiyaan
Enforces SUPER_ADMIN vs. EDITOR boundaries on every protected endpoint.
"""

from typing import Dict, Any, Callable
from fastapi import Depends, HTTPException, status
from backend.app.core.security import get_current_admin_user


def require_role(allowed_roles: list[str]) -> Callable:
    """Dependency factory checking that user holds at least one of the allowed roles."""
    async def role_checker(
        current_user: Dict[str, Any] = Depends(get_current_admin_user)
    ) -> Dict[str, Any]:
        user_role = current_user.get("role", "")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: Action requires one of {allowed_roles}, but your role is '{user_role}'.",
            )
        return current_user

    return role_checker


# Convenient role dependency shortcuts
require_super_admin = require_role(["SUPER_ADMIN"])
require_editor_or_above = require_role(["SUPER_ADMIN", "EDITOR"])
