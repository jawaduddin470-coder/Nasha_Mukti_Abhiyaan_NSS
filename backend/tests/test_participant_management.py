"""
Test Suite: Quiz Participant Management & Secure Deletion System
NSS MJCET Nasha Mukti Abhiyaan

Validates:
1. Soft-deleting one attempt while retaining another attempt from the same participant.
2. Soft-deleting a participant across multiple quiz attempts.
3. Exclusion of deleted attempts from individual and unified leaderboards.
4. Revocation of certificate access for deleted attempts/participants.
5. Restoration of deleted participants and re-enabling certificate/leaderboard eligibility.
6. RBAC enforcement: non-admin forbidden, editor cannot permanently delete.
7. Permanent deletion by Super Admin only with typed 'DELETE' confirmation.
8. Audit logging for all actions.
"""

import pytest
import pytest_asyncio
import httpx
from datetime import datetime, timezone
from backend.app.main import app
from backend.app.db.mongodb import get_database


@pytest.mark.asyncio
async def test_participant_deletion_and_management_workflow():
    db = get_database()
    now_iso = datetime.now(timezone.utc).isoformat()

    test_email = "test.mgmt.participant@mjcet.ac.in"
    attempt_a_id = "test-atmpt-mgmt-nmba-001"
    attempt_b_id = "test-atmpt-mgmt-unity-002"
    cert_a_id = "NSS-NM-2026-TESTDELA"
    cert_b_id = "NSS-NUD-2026-TESTDELB"

    # Clean up any leftover test data
    await db["quiz_attempts"].delete_many({"participant.email": test_email})
    await db["certificates"].delete_many({"certificateId": {"$in": [cert_a_id, cert_b_id]}})

    try:
        # Seed two attempts for the same participant:
        # Attempt A: Nasha Mukti
        attempt_a = {
            "attemptId": attempt_a_id,
            "quizId": "nmba-awareness-challenge-v1",
            "quizTitle": "Nasha Mukti Awareness Challenge",
            "participant": {
                "fullName": "Management Test Participant",
                "email": test_email,
                "institutionName": "Muffakham Jah College",
                "department": "Computer Science & Engineering",
                "rollNumber": "1604-22-733-888",
            },
            "score": 280,
            "maxScore": 300,
            "percentage": 93,
            "passed": True,
            "timeTakenSeconds": 360,
            "submittedAt": now_iso,
        }
        await db["quiz_attempts"].insert_one(attempt_a)

        # Attempt B: National Unity Day
        attempt_b = {
            "attemptId": attempt_b_id,
            "quizId": "national-unity-day-quiz-v1",
            "quizTitle": "National Unity Day Challenge",
            "participant": {
                "fullName": "Management Test Participant",
                "email": test_email,
                "institutionName": "Muffakham Jah College",
                "department": "Computer Science & Engineering",
                "rollNumber": "1604-22-733-888",
            },
            "score": 90,
            "maxScore": 100,
            "percentage": 90,
            "passed": True,
            "timeTakenSeconds": 240,
            "submittedAt": now_iso,
        }
        await db["quiz_attempts"].insert_one(attempt_b)

        # Seed corresponding certificates
        cert_a = {
            "certificateId": cert_a_id,
            "attemptId": attempt_a_id,
            "quizId": "nmba-awareness-challenge-v1",
            "quizTitle": "Anti-Drug Awareness Programme Certificate",
            "certificateType": "anti_drug_awareness",
            "participantName": "Management Test Participant",
            "participantEmail": test_email,
            "participantInstitution": "Muffakham Jah College",
            "participantRollNumber": "1604-22-733-888",
            "score": 280,
            "maxScore": 300,
            "percentage": 93,
            "passed": True,
            "issuedAt": now_iso,
        }
        await db["certificates"].insert_one(cert_a)

        cert_b = {
            "certificateId": cert_b_id,
            "attemptId": attempt_b_id,
            "quizId": "national-unity-day-quiz-v1",
            "quizTitle": "National Unity Day Certificate",
            "certificateType": "national_unity_day",
            "participantName": "Management Test Participant",
            "participantEmail": test_email,
            "participantInstitution": "Muffakham Jah College",
            "participantRollNumber": "1604-22-733-888",
            "score": 90,
            "maxScore": 100,
            "percentage": 90,
            "passed": True,
            "issuedAt": now_iso,
        }
        await db["certificates"].insert_one(cert_b)

        headers_super = {"Authorization": "Bearer dev-test-token:jawaduddin470@gmail.com"}
        headers_editor = {"Authorization": "Bearer dev-test-token:editor.test@mjcet.ac.in"}

        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
            # -------------------------------------------------------------
            # 1. Verify Active List & Impact
            # -------------------------------------------------------------
            res_active = await client.get("/api/v1/admin/quiz/attempts?status=active", headers=headers_editor)
            assert res_active.status_code == 200
            active_ids = [item["attemptId"] for item in res_active.json()["items"]]
            assert attempt_a_id in active_ids
            assert attempt_b_id in active_ids

            # Impact check
            res_impact = await client.get(f"/api/v1/admin/quiz/participants/impact?email={test_email}", headers=headers_editor)
            assert res_impact.status_code == 200
            impact = res_impact.json()
            assert impact["totalAttempts"] == 2
            assert impact["nashaMuktiAttempts"] == 1
            assert impact["unityDayAttempts"] == 1
            assert impact["certificateCount"] == 2

            # -------------------------------------------------------------
            # 2. Delete Single Attempt (Attempt A)
            # -------------------------------------------------------------
            res_del_att = await client.delete(
                f"/api/v1/admin/quiz/attempts/{attempt_a_id}?reason=Duplicate+entry",
                headers=headers_editor,
            )
            assert res_del_att.status_code == 200

            # Verify Attempt A is soft-deleted, but Attempt B is still ACTIVE!
            att_a_doc = await db["quiz_attempts"].find_one({"attemptId": attempt_a_id})
            assert att_a_doc["isDeleted"] is True
            assert att_a_doc["deletionReason"] == "Duplicate entry"

            att_b_doc = await db["quiz_attempts"].find_one({"attemptId": attempt_b_id})
            assert att_b_doc.get("isDeleted") is not True

            # Certificate A should be marked isDeleted
            cert_a_doc = await db["certificates"].find_one({"certificateId": cert_a_id})
            assert cert_a_doc["isDeleted"] is True

            # Certificate B should remain active
            cert_b_doc = await db["certificates"].find_one({"certificateId": cert_b_id})
            assert cert_b_doc.get("isDeleted") is not True

            # Certificate A check returns 404, Certificate B check returns 200
            res_cert_a_check = await client.get(f"/api/v1/certificates/{cert_a_id}")
            assert res_cert_a_check.status_code == 404

            res_cert_b_check = await client.get(f"/api/v1/certificates/{cert_b_id}")
            assert res_cert_b_check.status_code == 200

            # -------------------------------------------------------------
            # 3. Restore Single Attempt (Attempt A)
            # -------------------------------------------------------------
            res_restore_att = await client.post(
                f"/api/v1/admin/quiz/attempts/{attempt_a_id}/restore",
                headers=headers_editor,
            )
            assert res_restore_att.status_code == 200

            att_a_doc = await db["quiz_attempts"].find_one({"attemptId": attempt_a_id})
            assert att_a_doc["isDeleted"] is False

            cert_a_doc = await db["certificates"].find_one({"certificateId": cert_a_id})
            assert cert_a_doc["isDeleted"] is False

            res_cert_a_check = await client.get(f"/api/v1/certificates/{cert_a_id}")
            assert res_cert_a_check.status_code == 200

            # -------------------------------------------------------------
            # 4. Delete Entire Participant
            # -------------------------------------------------------------
            # Attempt without typing DELETE should fail with 400
            res_bad_confirm = await client.post(
                "/api/v1/admin/quiz/participants/delete",
                json={"email": test_email, "reason": "Test deletion", "confirmation": "NO"},
                headers=headers_editor,
            )
            assert res_bad_confirm.status_code == 400

            # Valid participant deletion
            res_del_part = await client.post(
                "/api/v1/admin/quiz/participants/delete",
                json={"email": test_email, "reason": "Student withdrawal request", "confirmation": "DELETE"},
                headers=headers_editor,
            )
            assert res_del_part.status_code == 200
            data_del = res_del_part.json()
            assert data_del["attemptsArchived"] == 2
            assert data_del["certificatesArchived"] == 2

            # Both attempts should now be soft-deleted
            count_active = await db["quiz_attempts"].count_documents({"participant.email": test_email, "isDeleted": {"$ne": True}})
            assert count_active == 0

            # Both certificates should be revoked
            res_ca = await client.get(f"/api/v1/certificates/{cert_a_id}")
            assert res_ca.status_code == 404
            res_cb = await client.get(f"/api/v1/certificates/{cert_b_id}")
            assert res_cb.status_code == 404

            # -------------------------------------------------------------
            # 5. Verify Exclusion from Leaderboards
            # -------------------------------------------------------------
            # Nasha Mukti leaderboard
            res_lb_nmba = await client.get("/api/v1/admin/quiz/leaderboard/nmba-awareness-challenge-v1", headers=headers_editor)
            assert res_lb_nmba.status_code == 200
            lb_emails = [e["participantEmail"].lower() for e in res_lb_nmba.json()["entries"]]
            assert test_email.lower() not in lb_emails

            # National Unity Day leaderboard
            res_lb_unity = await client.get("/api/v1/admin/quiz/leaderboard/national-unity-day-quiz-v1", headers=headers_editor)
            assert res_lb_unity.status_code == 200
            lb_unity_emails = [e["participantEmail"].lower() for e in res_lb_unity.json()["entries"]]
            assert test_email.lower() not in lb_unity_emails

            # Unified leaderboard
            res_lb_uni = await client.get("/api/v1/admin/quiz/leaderboard/unified-nss-mjcet-leaderboard", headers=headers_editor)
            assert res_lb_uni.status_code == 200
            lb_uni_emails = [e["participantEmail"].lower() for e in res_lb_uni.json()["entries"]]
            assert test_email.lower() not in lb_uni_emails

            # -------------------------------------------------------------
            # 6. Verify Deleted Participants Tab query
            # -------------------------------------------------------------
            res_deleted_tab = await client.get("/api/v1/admin/quiz/attempts?status=deleted", headers=headers_editor)
            assert res_deleted_tab.status_code == 200
            deleted_ids = [item["attemptId"] for item in res_deleted_tab.json()["items"]]
            assert attempt_a_id in deleted_ids
            assert attempt_b_id in deleted_ids

            # -------------------------------------------------------------
            # 7. Restore Entire Participant
            # -------------------------------------------------------------
            res_restore_part = await client.post(
                "/api/v1/admin/quiz/participants/restore",
                json={"email": test_email},
                headers=headers_editor,
            )
            assert res_restore_part.status_code == 200

            # Active list should contain both again
            count_restored = await db["quiz_attempts"].count_documents({"participant.email": test_email, "isDeleted": {"$ne": True}})
            assert count_restored == 2

            # Certificates restored
            res_ca_restored = await client.get(f"/api/v1/certificates/{cert_a_id}")
            assert res_ca_restored.status_code == 200
            res_cb_restored = await client.get(f"/api/v1/certificates/{cert_b_id}")
            assert res_cb_restored.status_code == 200

            # -------------------------------------------------------------
            # 8. RBAC: Non-Super Admin cannot permanently delete
            # -------------------------------------------------------------
            res_perm_editor = await client.delete(
                f"/api/v1/admin/quiz/attempts/{attempt_a_id}/permanent",
                headers=headers_editor,  # Editor
            )
            assert res_perm_editor.status_code == 403  # Forbidden for Editor!

            res_perm_part_editor = await client.post(
                "/api/v1/admin/quiz/participants/permanent-delete",
                json={"email": test_email, "confirmation": "DELETE"},
                headers=headers_editor,  # Editor
            )
            assert res_perm_part_editor.status_code == 403  # Forbidden for Editor!

            # -------------------------------------------------------------
            # 9. Super Admin permanent deletion with DELETE confirmation
            # -------------------------------------------------------------
            # Invalid confirmation fails
            res_perm_bad = await client.post(
                "/api/v1/admin/quiz/participants/permanent-delete",
                json={"email": test_email, "confirmation": "WRONG"},
                headers=headers_super,
            )
            assert res_perm_bad.status_code == 400

            # Valid confirmation succeeds
            res_perm_ok = await client.post(
                "/api/v1/admin/quiz/participants/permanent-delete",
                json={"email": test_email, "confirmation": "DELETE"},
                headers=headers_super,
            )
            assert res_perm_ok.status_code == 200

            # Documents are permanently purged
            purged_attempts = await db["quiz_attempts"].count_documents({"participant.email": test_email})
            assert purged_attempts == 0
            purged_certs = await db["certificates"].count_documents({"attemptId": {"$in": [attempt_a_id, attempt_b_id]}})
            assert purged_certs == 0

            # -------------------------------------------------------------
            # 10. Verify Audit Logging
            # -------------------------------------------------------------
            audit_entries = await db["audit_logs"].find({"recordId": test_email}).to_list(20)
            actions = [entry.get("action") for entry in audit_entries]
            assert "soft_delete_participant" in actions
            assert "restore_participant" in actions
            assert "permanent_delete_participant" in actions

    finally:
        # Guarantee test cleanup
        await db["quiz_attempts"].delete_many({"participant.email": test_email})
        await db["certificates"].delete_many({"certificateId": {"$in": [cert_a_id, cert_b_id]}})
