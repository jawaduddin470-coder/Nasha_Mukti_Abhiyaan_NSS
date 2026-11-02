"""
Automated Certificate Generation System Tests
NSS MJCET Nasha Mukti Abhiyaan

Tests:
1. Nasha Mukti quiz passing attempt generates Anti-Drug Awareness certificate (NSS-NM-2026-XXXXXX).
2. National Unity Day passing attempt generates National Unity Day certificate (NSS-NUD-2026-XXXXXX).
3. Participant name and registered institution are faithfully preserved.
4. Correct font designation: Georgia / Georgia Pro for Anti-Drug vs Yeseva One for Unity Day.
5. Idempotent generation: Repeating generation returns identical certificate without duplicate IDs.
6. Non-passing attempt (<70%) is rejected with HTTP 400.
7. Public verification endpoint /certificates/{certificate_id} returns accurate record.
8. PDF download endpoint returns valid binary PDF with application/pdf header.
9. Admin endpoints: settings lookup, update (Super Admin), and search filtering.
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from datetime import datetime, timezone
from backend.app.main import app
from backend.app.db.mongodb import connect_to_mongo, get_database


SUPER_ADMIN_TOKEN = "dev-test-token:jawaduddin470@gmail.com"
EDITOR_TOKEN = "dev-test-token:editor.test@mjcet.ac.in"


@pytest_asyncio.fixture(scope="function")
async def client():
    await connect_to_mongo()
    db = get_database()
    await db["admin_users"].update_one(
        {"email": "editor.test@mjcet.ac.in"},
        {
            "$set": {
                "email": "editor.test@mjcet.ac.in",
                "role": "EDITOR",
                "status": "active",
                "displayName": "Test Editor",
            }
        },
        upsert=True,
    )
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.mark.asyncio
async def test_certificate_anti_drug_generation(client):
    """Passing Nasha Mukti attempt generates Anti-Drug Awareness certificate."""
    db = get_database()
    attempt_id = f"test-atmpt-nm-{int(datetime.now().timestamp() * 1000)}"

    # Seed passing attempt
    await db["quiz_attempts"].insert_one({
        "attemptId": attempt_id,
        "quizId": "nmba-awareness-challenge-v1",
        "participant": {
            "fullName": "Mohd Rayyan Siddiqui",
            "email": "rayyan.test@mjcet.ac.in",
            "institutionName": "Muffakham Jah College of Engg & Tech",
            "rollNumber": "1604-22-733-001",
        },
        "score": 90,
        "maxScore": 100,
        "percentage": 90,
        "passed": True,
        "submittedAt": datetime.now(timezone.utc).isoformat(),
    })

    # Request certificate generation
    res = await client.post("/api/v1/certificates/generate", json={"attemptId": attempt_id})
    assert res.status_code == 200, res.text
    data = res.json()

    assert data["certificateId"].startswith("NSS-NM-2026-")
    assert len(data["certificateId"]) == len("NSS-NM-2026-XXXXXX")
    assert data["certificateType"] == "anti_drug_awareness"
    assert data["participantName"] == "Mohd Rayyan Siddiqui"
    assert data["participantInstitution"] == "Muffakham Jah College of Engg & Tech"
    assert "Georgia" in data["fontUsed"]
    assert data["passed"] is True
    assert f"/api/v1/certificates/{data['certificateId']}/download" in data["downloadUrl"]

    # Clean up test attempt and certificate
    await db["quiz_attempts"].delete_one({"attemptId": attempt_id})
    await db["certificates"].delete_one({"certificateId": data["certificateId"]})


@pytest.mark.asyncio
async def test_certificate_unity_day_generation(client):
    """Passing National Unity Day attempt generates National Unity Day certificate with Yeseva One."""
    db = get_database()
    attempt_id = f"test-atmpt-nud-{int(datetime.now().timestamp() * 1000)}"

    # Seed passing attempt
    await db["quiz_attempts"].insert_one({
        "attemptId": attempt_id,
        "quizId": "national-unity-day-quiz-v1",
        "participant": {
            "fullName": "Syeda Anam Fatima",
            "email": "anam.test@mjcet.ac.in",
            "institutionName": "Osmania University Campus",
            "rollNumber": "1604-22-733-045",
        },
        "score": 100,
        "maxScore": 100,
        "percentage": 100,
        "passed": True,
        "submittedAt": datetime.now(timezone.utc).isoformat(),
    })

    res = await client.post("/api/v1/certificates/generate", json={"attemptId": attempt_id})
    assert res.status_code == 200, res.text
    data = res.json()

    assert data["certificateId"].startswith("NSS-NUD-2026-")
    assert len(data["certificateId"]) == len("NSS-NUD-2026-XXXXXX")
    assert data["certificateType"] == "national_unity_day"
    assert data["participantName"] == "Syeda Anam Fatima"
    assert data["fontUsed"] == "Yeseva One"

    # Clean up
    await db["quiz_attempts"].delete_one({"attemptId": attempt_id})
    await db["certificates"].delete_one({"certificateId": data["certificateId"]})


@pytest.mark.asyncio
async def test_certificate_idempotency(client):
    """Repeated download or generation request returns the exact same certificate ID."""
    db = get_database()
    attempt_id = f"test-atmpt-idemp-{int(datetime.now().timestamp() * 1000)}"

    await db["quiz_attempts"].insert_one({
        "attemptId": attempt_id,
        "quizId": "nmba-awareness-challenge-v1",
        "participant": {
            "fullName": "Zaid Bin Tariq",
            "email": "zaid.test@mjcet.ac.in",
            "institutionName": "MJCET",
        },
        "score": 80,
        "maxScore": 100,
        "percentage": 80,
        "passed": True,
        "submittedAt": datetime.now(timezone.utc).isoformat(),
    })

    # First generation
    res1 = await client.post("/api/v1/certificates/generate", json={"attemptId": attempt_id})
    assert res1.status_code == 200
    cert_id_1 = res1.json()["certificateId"]

    # Second generation for same attempt
    res2 = await client.post("/api/v1/certificates/generate", json={"attemptId": attempt_id})
    assert res2.status_code == 200
    cert_id_2 = res2.json()["certificateId"]

    # Both must match exactly (zero duplicates)
    assert cert_id_1 == cert_id_2

    # Check MongoDB collection has exactly 1 certificate document
    count = await db["certificates"].count_documents({"attemptId": attempt_id})
    assert count == 1

    # Clean up
    await db["quiz_attempts"].delete_one({"attemptId": attempt_id})
    await db["certificates"].delete_one({"certificateId": cert_id_1})


@pytest.mark.asyncio
async def test_certificate_rejection_for_failed_attempt(client):
    """Attempts with passed=False are rejected from certificate issuance."""
    db = get_database()
    attempt_id = f"test-atmpt-failed-{int(datetime.now().timestamp() * 1000)}"

    await db["quiz_attempts"].insert_one({
        "attemptId": attempt_id,
        "quizId": "nmba-awareness-challenge-v1",
        "participant": {
            "fullName": "Incomplete Attempt Participant",
            "email": "failed.test@mjcet.ac.in",
            "institutionName": "MJCET",
        },
        "score": 40,
        "maxScore": 100,
        "percentage": 40,
        "passed": False,
        "submittedAt": datetime.now(timezone.utc).isoformat(),
    })

    res = await client.post("/api/v1/certificates/generate", json={"attemptId": attempt_id})
    assert res.status_code == 400
    assert "70%" in res.json()["detail"]

    # Clean up
    await db["quiz_attempts"].delete_one({"attemptId": attempt_id})


@pytest.mark.asyncio
async def test_certificate_pdf_download(client):
    """Download endpoint returns valid PDF with application/pdf header."""
    db = get_database()
    attempt_id = f"test-atmpt-dl-{int(datetime.now().timestamp() * 1000)}"

    await db["quiz_attempts"].insert_one({
        "attemptId": attempt_id,
        "quizId": "national-unity-day-quiz-v1",
        "participant": {
            "fullName": "Ayesha Siddiqua",
            "email": "ayesha.test@mjcet.ac.in",
            "institutionName": "MJCET",
        },
        "score": 100,
        "maxScore": 100,
        "percentage": 100,
        "passed": True,
        "submittedAt": datetime.now(timezone.utc).isoformat(),
    })

    gen_res = await client.post("/api/v1/certificates/generate", json={"attemptId": attempt_id})
    cert_id = gen_res.json()["certificateId"]

    # Test PDF download
    dl_res = await client.get(f"/api/v1/certificates/{cert_id}/download")
    assert dl_res.status_code == 200
    assert dl_res.headers["content-type"] == "application/pdf"
    assert dl_res.content[:4] == b"%PDF"  # Valid PDF binary signature

    # Clean up
    await db["quiz_attempts"].delete_one({"attemptId": attempt_id})
    await db["certificates"].delete_one({"certificateId": cert_id})


@pytest.mark.asyncio
async def test_certificate_admin_settings_lifecycle(client):
    """Super admin can update certificate issuance settings and inspect configurations."""
    # 1. Fetch settings
    res = await client.get(
        "/api/v1/certificates/admin/settings",
        headers={"Authorization": f"Bearer {EDITOR_TOKEN}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert "antiDrug" in data
    assert "unityDay" in data
    assert data["antiDrug"]["fontFamily"] == "Georgia Pro"
    assert data["unityDay"]["fontFamily"] == "Yeseva One"

    # 2. Update settings (Super Admin)
    up_res = await client.put(
        "/api/v1/certificates/admin/settings",
        json={"antiDrugFontSize": 22, "unityDayFontSize": 28},
        headers={"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"},
    )
    assert up_res.status_code == 200
    updated = up_res.json()
    assert updated["antiDrug"]["fontSize"] == 22
    assert updated["unityDay"]["fontSize"] == 28
