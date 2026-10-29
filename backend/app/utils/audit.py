"""
Audit Logging Utility
NSS MJCET Nasha Mukti Abhiyaan
Chronicles administrative operations safely without recording tokens or secrets.
"""

from typing import Dict, Any, Optional
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase


async def record_audit_log(
    db: AsyncIOMotorDatabase,
    actor_email: str,
    action: str,  # create, update, delete, publish, archive, role_change
    module: str,  # activities, gallery, developers, quiz, users, settings
    record_id: str,
    metadata: Optional[Dict[str, Any]] = None,
) -> None:
    """Inserts a structured audit log entry."""
    entry = {
        "actorEmail": actor_email.strip().lower(),
        "action": action,
        "module": module,
        "recordId": record_id,
        "metadata": metadata or {},
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    try:
        await db["audit_logs"].insert_one(entry)
    except Exception as e:
        # Don't let an audit log failure break the primary request
        pass
