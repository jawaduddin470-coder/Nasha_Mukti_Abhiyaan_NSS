"""
Analytics & CMS Dashboard Overview Router
NSS MJCET Nasha Mukti Abhiyaan
Aggregates authentic database-backed campaign and operational metrics.
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.permissions import require_editor_or_above
from backend.app.db.mongodb import get_database

router = APIRouter(prefix="/admin/analytics", tags=["Analytics"])


@router.get("/overview")
async def get_dashboard_overview_metrics(
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Computes genuine live database metrics for the Admin Dashboard Overview.
    Guarantees 100% database accuracy without fabricated or mock statistics.
    """
    # 1. Activities counts
    total_published_activities = await db["activities"].count_documents({"publicationStatus": "published"})
    upcoming_activities = await db["activities"].count_documents({"status": "upcoming"})
    completed_activities = await db["activities"].count_documents({"status": "completed"})
    archived_activities = await db["activities"].count_documents({"publicationStatus": "archived"})

    # 2. Gallery photos
    published_gallery_photos = await db["gallery_photos"].count_documents({"publicationStatus": "published"})

    # 3. Developer profiles
    total_developers = await db["developers"].count_documents({"publicationStatus": "published"})

    # 4. Quiz Attempts & Participants
    total_quiz_attempts = await db["quiz_attempts"].count_documents({})

    pipeline_unique_participants = [
        {"$match": {"participant.email": {"$exists": True, "$ne": ""}}},
        {"$group": {"_id": "$participant.email"}},
        {"$count": "count"},
    ]
    unique_cursor = db["quiz_attempts"].aggregate(pipeline_unique_participants)
    unique_res = await unique_cursor.to_list(length=1)
    unique_participants = unique_res[0]["count"] if unique_res else 0

    pipeline_scores = [
        {
            "$group": {
                "_id": None,
                "avgScore": {"$avg": "$percentage"},
                "passedCount": {"$sum": {"$cond": ["$passed", 1, 0]}},
                "totalCount": {"$sum": 1},
            }
        }
    ]
    score_cursor = db["quiz_attempts"].aggregate(pipeline_scores)
    score_res = await score_cursor.to_list(length=1)

    avg_score = round(score_res[0]["avgScore"], 1) if score_res and score_res[0].get("avgScore") is not None else 0.0
    passed_count = score_res[0]["passedCount"] if score_res else 0
    total_graded = score_res[0]["totalCount"] if score_res else 0
    passing_rate = round((passed_count / total_graded) * 100, 1) if total_graded > 0 else 0.0

    # 5. Recent Audit Logs (last 8 entries)
    audit_cursor = db["audit_logs"].find().sort("timestamp", -1).limit(8)
    recent_audit_logs = []
    async for entry in audit_cursor:
        entry["_id"] = str(entry["_id"])
        recent_audit_logs.append(entry)

    return {
        "activities": {
            "published": total_published_activities,
            "upcoming": upcoming_activities,
            "completed": completed_activities,
            "archived": archived_activities,
        },
        "gallery": {
            "published": published_gallery_photos,
        },
        "developers": {
            "total": total_developers,
        },
        "quiz": {
            "totalAttempts": total_quiz_attempts,
            "uniqueParticipants": unique_participants,
            "averageScore": avg_score,
            "passingRate": passing_rate,
        },
        "recentAuditLogs": recent_audit_logs,
    }
