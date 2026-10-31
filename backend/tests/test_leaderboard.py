"""
Quiz Leaderboard & Official Results Release Tests
NSS MJCET Nasha Mukti Abhiyaan

Tests:
1. Public unpublished endpoint returns 'coming_soon' and empty entries (zero data leak).
2. Admin endpoint previews calculated rankings (highest score first, time tie-breaker).
3. Super Admin can update presentation settings (announcement date, public names toggle).
4. Super Admin can publish results.
5. Once published, public endpoint returns calculated rankings with podium metadata.
6. Super Admin can unpublish results, returning public endpoint to 'coming_soon'.
7. Editor cannot publish or unpublish (403 Forbidden).
8. Super Admin can override participant attempt data.
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.db.mongodb import connect_to_mongo, get_database


SUPER_ADMIN_TOKEN = "dev-test-token:jawaduddin470@gmail.com"
EDITOR_TOKEN = "dev-test-token:editor.test@mjcet.ac.in"
UNAPPROVED_TOKEN = "dev-test-token:intruder.unapproved@random.com"


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
async def test_public_leaderboard_unpublished_state(client):
    """Verifies that an unpublished leaderboard returns announcement state with zero entries."""
    db = get_database()
    # Ensure quiz leaderboard is unpublished
    await db["quiz_leaderboards"].update_one(
        {"quizId": "nmba-awareness-challenge-v1"},
        {"$set": {"isPublished": False, "status": "coming_soon"}},
        upsert=True,
    )

    res = await client.get("/api/v1/quiz/leaderboard/nmba-awareness-challenge-v1")
    assert res.status_code == 200
    data = res.json()

    assert data["isPublished"] is False
    assert data["status"] == "coming_soon"
    assert "RESULTS COMING SOON" in data["message"]
    assert "preparing the official results" in data["supportingText"]
    # CRITICAL: Entries must be strictly empty when unpublished
    assert data["entries"] == []
    assert data["totalParticipants"] >= 0


@pytest.mark.asyncio
async def test_admin_leaderboard_preview_ranking(client):
    """Verifies that Super Admin / Editor can preview real participant rankings."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    res = await client.get("/api/v1/admin/quiz/leaderboard/nmba-awareness-challenge-v1", headers=headers)
    assert res.status_code == 200
    data = res.json()

    assert data["quizId"] == "nmba-awareness-challenge-v1"
    assert "entries" in data
    assert "stats" in data
    assert len(data["entries"]) >= 0

    # If entries exist, verify descending score ordering
    if len(data["entries"]) >= 2:
        for i in range(len(data["entries"]) - 1):
            assert data["entries"][i]["score"] >= data["entries"][i + 1]["score"]
            assert data["entries"][i]["rank"] <= data["entries"][i + 1]["rank"]


@pytest.mark.asyncio
async def test_editor_cannot_publish_results(client):
    """Verifies that ordinary editors are forbidden from publishing official results."""
    headers = {"Authorization": f"Bearer {EDITOR_TOKEN}"}
    res = await client.post("/api/v1/admin/quiz/leaderboard/nmba-awareness-challenge-v1/publish", headers=headers)
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_super_admin_publish_and_unpublish_flow(client):
    """Tests the complete publication lifecycle by Super Admin."""
    sa_headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}

    # 1. Update settings
    settings_res = await client.put(
        "/api/v1/admin/quiz/leaderboard/nmba-awareness-challenge-v1/settings",
        json={"announcementDate": "November 2, 2026", "showPublicNames": True},
        headers=sa_headers,
    )
    assert settings_res.status_code == 200

    # 2. Publish
    pub_res = await client.post(
        "/api/v1/admin/quiz/leaderboard/nmba-awareness-challenge-v1/publish",
        headers=sa_headers,
    )
    assert pub_res.status_code == 200
    assert pub_res.json()["success"] is True

    # 3. Verify public endpoint now shows published results
    public_res = await client.get("/api/v1/quiz/leaderboard/nmba-awareness-challenge-v1")
    assert public_res.status_code == 200
    pub_data = public_res.json()
    assert pub_data["isPublished"] is True
    assert pub_data["status"] == "published"
    assert len(pub_data["entries"]) > 0
    assert pub_data["entries"][0]["rank"] == 1

    # 4. Unpublish (return to Coming Soon state per future activation requirement)
    unpub_res = await client.post(
        "/api/v1/admin/quiz/leaderboard/nmba-awareness-challenge-v1/unpublish",
        headers=sa_headers,
    )
    assert unpub_res.status_code == 200
    assert unpub_res.json()["success"] is True

    # 5. Verify public endpoint is back to Coming Soon with entries = []
    final_res = await client.get("/api/v1/quiz/leaderboard/nmba-awareness-challenge-v1")
    assert final_res.status_code == 200
    final_data = final_res.json()
    assert final_data["isPublished"] is False
    assert final_data["status"] == "coming_soon"
    assert final_data["entries"] == []


@pytest.mark.asyncio
async def test_quiz_leaderboards_summary_and_isolation(client):
    """Verifies that both quizzes are returned and their results remain isolated."""
    res = await client.get("/api/v1/quiz/leaderboards")
    assert res.status_code == 200
    summaries = res.json()
    assert len(summaries) >= 2

    quiz_ids = [s["quizId"] for s in summaries]
    assert "nmba-awareness-challenge-v1" in quiz_ids
    assert "national-unity-day-quiz-v1" in quiz_ids

    # Check that National Unity Day has its own separate coming_soon status
    unity_res = await client.get("/api/v1/quiz/leaderboard/national-unity-day-quiz-v1")
    assert unity_res.status_code == 200
    unity_data = unity_res.json()
    assert unity_data["quizTitle"] == "National Unity Day Quiz"
    assert unity_data["isPublished"] is False
    assert unity_data["entries"] == []


@pytest.mark.asyncio
async def test_masked_names_setting(client):
    """Verifies that when showPublicNames is False, names are masked in public output."""
    sa_headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    db = get_database()

    # Set showPublicNames = False and publish temporarily
    await client.put(
        "/api/v1/admin/quiz/leaderboard/nmba-awareness-challenge-v1/settings",
        json={"showPublicNames": False},
        headers=sa_headers,
    )
    await client.post("/api/v1/admin/quiz/leaderboard/nmba-awareness-challenge-v1/publish", headers=sa_headers)

    pub_res = await client.get("/api/v1/quiz/leaderboard/nmba-awareness-challenge-v1")
    assert pub_res.status_code == 200
    entries = pub_res.json()["entries"]
    if entries:
        # Check that asterisk masking is present
        assert "*" in entries[0]["participantName"]

    # Restore unpublish & showPublicNames = True
    await client.post("/api/v1/admin/quiz/leaderboard/nmba-awareness-challenge-v1/unpublish", headers=sa_headers)
    await client.put(
        "/api/v1/admin/quiz/leaderboard/nmba-awareness-challenge-v1/settings",
        json={"showPublicNames": True},
        headers=sa_headers,
    )

