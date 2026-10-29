"""
Quiz & Participant Analytics Router
NSS MJCET Nasha Mukti Abhiyaan
Server-side authoritative scoring, participant attempt recording, and Excel export.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import io
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

from backend.app.core.permissions import require_super_admin, require_editor_or_above
from backend.app.db.mongodb import get_database
from backend.app.schemas.quiz import (
    QuizQuestionPublicResponse,
    QuizQuestionAdminResponse,
    QuizQuestionCreate,
    QuizQuestionUpdate,
    QuizAttemptSubmit,
    QuizAttemptResult,
    QuestionBreakdownItem,
)
from backend.app.utils.audit import record_audit_log

router = APIRouter(tags=["Quiz"])


def sanitize_excel_cell(val: Any) -> Any:
    """Neutralizes Excel formula injection risks for user-supplied strings."""
    if isinstance(val, str) and len(val) > 0:
        if val[0] in ("=", "+", "-", "@", "\t", "\r"):
            return "'" + val
    return val


# Public Endpoints
@router.get("/quiz/public", response_model=List[QuizQuestionPublicResponse])
async def get_public_quiz_questions(
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Returns public questions for participant attempts.
    STRICT SECURITY: Excludes 'correctAnswerIds' and 'explanation' to prevent cheating.
    """
    cursor = db["quiz_questions"].find({"publicationStatus": "published"}).sort("displayOrder", 1)
    questions = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        # Ensure correct answers are stripped
        doc.pop("correctAnswerIds", None)
        doc.pop("explanation", None)
        questions.append(QuizQuestionPublicResponse(**doc))
    return questions


@router.post("/quiz/submit", response_model=QuizAttemptResult)
async def submit_quiz_attempt(
    payload: QuizAttemptSubmit,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Authoritative server-side quiz evaluation and participant attempt recording.
    Calculates genuine score against canonical database records and returns result breakdown.
    """
    # Fetch authoritative published questions with answers
    cursor = db["quiz_questions"].find({"publicationStatus": "published"}).sort("displayOrder", 1)
    canonical_questions = {}
    async for q in cursor:
        canonical_questions[q["id"]] = q

    if not canonical_questions:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Quiz questions are temporarily unavailable.",
        )

    earned_score = 0
    max_score = 0
    correct_count = 0
    incorrect_count = 0
    question_breakdown: List[QuestionBreakdownItem] = []

    for q_id, q in canonical_questions.items():
        points = q.get("points", 10)
        max_score += points
        correct_ids = q.get("correctAnswerIds", [])
        selected_ids = payload.userAnswers.get(q_id, [])

        is_correct = False
        if q.get("type") == "multiple":
            # Multi-select: exact match of set
            is_correct = set(selected_ids) == set(correct_ids) and len(selected_ids) > 0
        else:
            # Single or boolean
            is_correct = len(selected_ids) == 1 and len(correct_ids) >= 1 and selected_ids[0] == correct_ids[0]

        pts = points if is_correct else 0
        earned_score += pts

        if is_correct:
            correct_count += 1
        else:
            incorrect_count += 1

        question_breakdown.append(
            QuestionBreakdownItem(
                questionId=q_id,
                questionText=q.get("text", ""),
                category=q.get("category", ""),
                type=q.get("type", "single"),
                points=points,
                earnedPoints=pts,
                selectedOptionIds=selected_ids,
                correctOptionIds=correct_ids,
                isCorrect=is_correct,
                options=q.get("options", []),
                explanation=q.get("explanation", ""),
            )
        )

    percentage = round((earned_score / max_score) * 100) if max_score > 0 else 0
    passed = percentage >= 70

    # Assign badge and message
    if percentage >= 90:
        badge_name = "Nasha Mukti Campus Champion"
        badge_desc = "Exceptional mastery of prevention science, refusal agency, and community care."
        summary_msg = "Outstanding! You have demonstrated exceptional awareness of substance dependency science and compassionate peer support."
    elif percentage >= 70:
        badge_name = "Informed Peer Advocate"
        badge_desc = "Solid grasp of neurobiology, de-escalation, and verified helplines."
        summary_msg = "Well done! You possess the essential knowledge to make conscious choices and support peers in need."
    else:
        badge_name = "Awareness Contributor"
        badge_desc = "Completed the curriculum review and engaged in conscious learning."
        summary_msg = "Knowledge grows with reflection. Review the question explanations below to deepen your awareness of recovery science."

    now_iso = datetime.now(timezone.utc).isoformat()
    attempt_id = f"atmpt-{int(datetime.now().timestamp() * 1000)}"

    attempt_doc = {
        "attemptId": attempt_id,
        "quizId": payload.quizId,
        "participant": payload.participant.model_dump(),
        "score": earned_score,
        "maxScore": max_score,
        "percentage": percentage,
        "passed": passed,
        "totalQuestions": len(canonical_questions),
        "correctCount": correct_count,
        "incorrectCount": incorrect_count,
        "badgeName": badge_name,
        "badgeDescription": badge_desc,
        "summaryMessage": summary_msg,
        "submittedAt": now_iso,
        "userAnswers": payload.userAnswers,
    }

    # Save to MongoDB quiz_attempts collection
    await db["quiz_attempts"].insert_one(attempt_doc)

    return QuizAttemptResult(
        attemptId=attempt_id,
        quizId=payload.quizId,
        participantName=payload.participant.fullName.strip(),
        participantInstitution=payload.participant.institutionName.strip(),
        submittedAt=now_iso,
        score=earned_score,
        maxScore=max_score,
        percentage=percentage,
        passed=passed,
        totalQuestions=len(canonical_questions),
        correctCount=correct_count,
        incorrectCount=incorrect_count,
        badgeName=badge_name,
        badgeDescription=badge_desc,
        summaryMessage=summary_msg,
        questionBreakdown=question_breakdown,
    )


# Protected CMS Endpoints for Quiz Questions
@router.get("/admin/quiz/questions", response_model=List[QuizQuestionAdminResponse])
async def list_admin_quiz_questions(
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves all questions including correct answers and explanations for CMS."""
    cursor = db["quiz_questions"].find().sort("displayOrder", 1)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(QuizQuestionAdminResponse(**doc))
    return results


@router.post("/admin/quiz/questions", response_model=QuizQuestionAdminResponse, status_code=status.HTTP_201_CREATED)
async def create_quiz_question(
    payload: QuizQuestionCreate,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Creates a new quiz question."""
    now_iso = datetime.now(timezone.utc).isoformat()
    q_id = f"q-{int(datetime.now().timestamp() * 1000) % 1000000}"

    doc = payload.model_dump()
    doc["id"] = q_id
    doc["createdAt"] = now_iso
    doc["updatedAt"] = now_iso

    await db["quiz_questions"].insert_one(doc)
    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="create_quiz_question",
        module="quiz_questions",
        record_id=q_id,
        metadata={"category": payload.category},
    )

    doc["_id"] = str(doc.get("_id", ""))
    return QuizQuestionAdminResponse(**doc)


@router.put("/admin/quiz/questions/{id}", response_model=QuizQuestionAdminResponse)
async def update_quiz_question(
    id: str,
    payload: QuizQuestionUpdate,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Updates a quiz question, options, answers, or explanation."""
    target = await db["quiz_questions"].find_one({"id": id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Question '{id}' not found.")

    update_dict = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_dict["updatedAt"] = datetime.now(timezone.utc).isoformat()

    await db["quiz_questions"].update_one({"id": id}, {"$set": update_dict})
    updated_doc = await db["quiz_questions"].find_one({"id": id})

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="update_quiz_question",
        module="quiz_questions",
        record_id=id,
        metadata={"changes": list(update_dict.keys())},
    )

    updated_doc["_id"] = str(updated_doc["_id"])
    return QuizQuestionAdminResponse(**updated_doc)


@router.delete("/admin/quiz/questions/{id}", status_code=status.HTTP_200_OK)
async def delete_quiz_question(
    id: str,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Deletes a quiz question."""
    target = await db["quiz_questions"].find_one({"id": id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Question '{id}' not found.")

    await db["quiz_questions"].delete_one({"id": id})
    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="delete_quiz_question",
        module="quiz_questions",
        record_id=id,
        metadata={"text": target.get("text")[:40]},
    )

    return {"message": f"Question '{id}' has been deleted successfully."}


# Protected Quiz Attempts & Excel Export
@router.get("/admin/quiz/attempts")
async def list_quiz_attempts(
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Lists real participant attempts from MongoDB with pagination."""
    cursor = db["quiz_attempts"].find().sort("submittedAt", -1).skip(skip).limit(limit)
    total = await db["quiz_attempts"].count_documents({})
    items = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return {"total": total, "items": items, "limit": limit, "skip": skip}


@router.get("/admin/quiz/export")
async def export_quiz_attempts_excel(
    current_admin: Dict[str, Any] = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Generates and returns an authentic .xlsx Excel workbook containing all participant
    quiz attempts and aggregate statistics using OpenPyXL.
    """
    cursor = db["quiz_attempts"].find().sort("submittedAt", -1)
    attempts = []
    async for doc in cursor:
        attempts.append(doc)

    wb = openpyxl.Workbook()

    # Style presets
    header_fill = PatternFill(start_color="1B2A4A", end_color="1B2A4A", fill_type="solid")  # Navy
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    data_font = Font(name="Calibri", size=10)
    border_thin = Border(
        left=Side(style="thin", color="E2E8F0"),
        right=Side(style="thin", color="E2E8F0"),
        top=Side(style="thin", color="E2E8F0"),
        bottom=Side(style="thin", color="E2E8F0"),
    )

    # 1. Sheet 1: Quiz Attempts
    ws1 = wb.active
    ws1.title = "Quiz Attempts"

    headers1 = [
        "Attempt ID",
        "Submitted At (UTC)",
        "Participant Name",
        "Email",
        "Institution / College",
        "Roll Number",
        "Mobile Number",
        "Department",
        "Year of Study",
        "Score",
        "Max Score",
        "Percentage (%)",
        "Status",
        "Correct Answers",
        "Incorrect Answers",
        "Assigned Badge",
    ]
    ws1.append(headers1)
    for col_num in range(1, len(headers1) + 1):
        cell = ws1.cell(row=1, column=col_num)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center")

    for att in attempts:
        p = att.get("participant", {})
        row = [
            sanitize_excel_cell(att.get("attemptId", "")),
            sanitize_excel_cell(att.get("submittedAt", "")),
            sanitize_excel_cell(p.get("fullName", "")),
            sanitize_excel_cell(p.get("email", "")),
            sanitize_excel_cell(p.get("institutionName", "")),
            sanitize_excel_cell(p.get("rollNumber", "")),
            sanitize_excel_cell(p.get("phone", "")),
            sanitize_excel_cell(p.get("department", "")),
            sanitize_excel_cell(p.get("yearOfStudy", "")),
            att.get("score", 0),
            att.get("maxScore", 0),
            att.get("percentage", 0),
            "PASSED" if att.get("passed") else "ATTEMPTED",
            att.get("correctCount", 0),
            att.get("incorrectCount", 0),
            sanitize_excel_cell(att.get("badgeName", "")),
        ]
        ws1.append(row)

    # Apply data borders and alignment
    for row in ws1.iter_rows(min_row=2, max_row=ws1.max_row, min_col=1, max_col=len(headers1)):
        for cell in row:
            cell.font = data_font
            cell.border = border_thin

    # Auto-fit column widths
    for col in ws1.columns:
        max_len = max(len(str(cell.value or "")) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws1.column_dimensions[col_letter].width = max(max_len + 4, 12)

    # 2. Sheet 2: Participant Summary
    ws2 = wb.create_sheet(title="Campaign Metrics")
    ws2.append(["Metric", "Recorded Value"])
    ws2.cell(row=1, column=1).fill = header_fill
    ws2.cell(row=1, column=1).font = header_font
    ws2.cell(row=1, column=2).fill = header_fill
    ws2.cell(row=1, column=2).font = header_font

    total_attempts = len(attempts)
    unique_emails = len(set(a.get("participant", {}).get("email") for a in attempts if a.get("participant", {}).get("email")))
    passed_count = sum(1 for a in attempts if a.get("passed"))
    avg_score = round(sum(a.get("percentage", 0) for a in attempts) / total_attempts, 1) if total_attempts > 0 else 0
    pass_rate = round((passed_count / total_attempts) * 100, 1) if total_attempts > 0 else 0

    metrics_rows = [
        ("Total Quiz Attempts", total_attempts),
        ("Unique Participants", unique_emails),
        ("Successful Completions (>= 70%)", passed_count),
        ("Average Score Percentage", f"{avg_score}%"),
        ("Passing Rate", f"{pass_rate}%"),
        ("Export Generated At (UTC)", datetime.now(timezone.utc).isoformat()),
        ("Export Requested By", current_admin.get("email")),
    ]
    for m, val in metrics_rows:
        ws2.append([m, val])

    ws2.column_dimensions["A"].width = 35
    ws2.column_dimensions["B"].width = 30

    # Save to buffer
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="export_quiz_attempts_excel",
        module="quiz_analytics",
        record_id="export_all",
        metadata={"totalRecordsExported": total_attempts},
    )

    filename = f"nmba_quiz_attempts_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
