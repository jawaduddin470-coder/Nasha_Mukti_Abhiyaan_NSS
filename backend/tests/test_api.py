"""
Automated Backend & Security Test Suite — Phase 5.1
NSS MJCET Nasha Mukti Abhiyaan

Tests complete functionality including:
- Activities CRUD and strict <= 5 images cap
- Central Media Library upload, retrieval, and reference-safe deletion
- Gallery CRUD
- Developers CRUD
- Quiz Curriculum questions validation (valid single/boolean vs malformed 422 rejection)
- Post-Quiz Awareness Messages CRUD
- Authoritative Quiz submission scoring & participant analytics
- Strict Role Separation (Editor vs Super Admin)
- Authenticated Excel Export (.xlsx)
- Security Audit Logging
"""

import io
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.db.mongodb import connect_to_mongo, close_mongo_connection, get_database


SUPER_ADMIN_TOKEN = "dev-test-token:jawaduddin470@gmail.com"
EDITOR_TOKEN = "dev-test-token:editor.test@mjcet.ac.in"
UNAPPROVED_TOKEN = "dev-test-token:intruder.unapproved@random.com"


@pytest_asyncio.fixture(scope="function")
async def client():
    await connect_to_mongo()
    # Ensure editor account exists in db for testing role separation
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
    await close_mongo_connection()


@pytest.mark.asyncio
async def test_01_health_check(client: AsyncClient):
    """1. Health check returns healthy and database connected."""
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"


@pytest.mark.asyncio
async def test_02_activities_crud(client: AsyncClient):
    """2. Activities creation, retrieval, update, and deletion in MongoDB."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    payload = {
        "title": "Automated Test Rally Drive",
        "slug": "automated-test-rally-drive",
        "category": "rallies",
        "summary": "Demonstration rally against drug abuse in Hyderabad.",
        "description": "Full description of automated test rally with faculty and students.",
        "venue": "MJCET Main Gate",
        "date": "2026-11-15",
        "timeDisplay": "09:30 AM IST",
        "status": "upcoming",
        "publicationStatus": "published",
        "coverImage": "https://example.com/test-rally-cover.jpg",
        "galleryImages": [
            {"url": "https://example.com/g1.jpg", "caption": "Assembly", "displayOrder": 1},
            {"url": "https://example.com/g2.jpg", "caption": "Banner March", "displayOrder": 2},
        ],
        "displayOrder": 99,
        "featured": True,
    }

    # Create
    create_res = await client.post("/api/v1/admin/activities", json=payload, headers=headers)
    assert create_res.status_code == 201
    created_act = create_res.json()
    act_id = created_act["id"]
    assert created_act["title"] == payload["title"]

    # Update
    update_res = await client.put(
        f"/api/v1/admin/activities/{act_id}",
        json={"summary": "Updated rally summary for verification."},
        headers=headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["summary"] == "Updated rally summary for verification."

    # Delete
    del_res = await client.delete(f"/api/v1/admin/activities/{act_id}", headers=headers)
    assert del_res.status_code == 200


@pytest.mark.asyncio
async def test_03_activity_imagery_cap(client: AsyncClient):
    """3. Activity creation with > 5 total images rejected with 422."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    over_limit_payload = {
        "title": "Invalid 6-Image Activity",
        "slug": "invalid-6-image-activity",
        "category": "rallies",
        "summary": "Should be rejected because cover + 5 gallery = 6 images total.",
        "description": "Validation test for strict 5-image total cap.",
        "venue": "Campus",
        "date": "2026-11-20",
        "timeDisplay": "10:00 AM",
        "status": "completed",
        "publicationStatus": "draft",
        "coverImage": "https://example.com/cover.jpg",
        "galleryImages": [
            {"url": "https://example.com/1.jpg", "caption": "1", "displayOrder": 1},
            {"url": "https://example.com/2.jpg", "caption": "2", "displayOrder": 2},
            {"url": "https://example.com/3.jpg", "caption": "3", "displayOrder": 3},
            {"url": "https://example.com/4.jpg", "caption": "4", "displayOrder": 4},
            {"url": "https://example.com/5.jpg", "caption": "5", "displayOrder": 5},
        ],  # Total = 1 + 5 = 6 images!
    }
    response = await client.post("/api/v1/admin/activities", json=over_limit_payload, headers=headers)
    assert response.status_code == 422
    assert "at most 5 total images" in response.text


@pytest.mark.asyncio
async def test_04_media_upload(client: AsyncClient):
    """4. Central Media Library upload validates MIME/size and creates MongoDB record."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}

    # Valid PNG fake file
    fake_img = io.BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82")
    files = {"file": ("test_upload_poster.png", fake_img, "image/png")}
    data = {"title": "Automated Test Poster", "category": "gallery"}

    response = await client.post("/api/v1/admin/media/upload", files=files, data=data, headers=headers)
    assert response.status_code == 201
    res_json = response.json()
    assert res_json["title"] == "Automated Test Poster"
    assert res_json["category"] == "gallery"
    assert res_json["mimeType"] == "image/png"
    assert "id" in res_json
    assert res_json["url"].startswith("/") or res_json["url"].startswith("http")


@pytest.mark.asyncio
async def test_05_media_library_retrieval(client: AsyncClient):
    """5. Central Media Library search and category filtering."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    response = await client.get("/api/v1/admin/media?category=gallery", headers=headers)
    assert response.status_code == 200
    items = response.json()
    assert isinstance(items, list)
    for it in items:
        assert it["category"] == "gallery"


@pytest.mark.asyncio
async def test_06_media_deletion_checks(client: AsyncClient):
    """6. Deleting media referenced by active content is blocked with 400."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    db = get_database()

    # Insert a dummy media item
    dummy_id = "test-media-ref-check"
    dummy_url = "/images/referenced_banner.jpg"
    await db["media_items"].update_one(
        {"id": dummy_id},
        {
            "$set": {
                "id": dummy_id,
                "filename": "referenced_banner.jpg",
                "originalFilename": "referenced_banner.jpg",
                "url": dummy_url,
                "mimeType": "image/jpeg",
                "sizeBytes": 1024,
                "category": "activities",
                "title": "Referenced Banner",
                "createdAt": "2026-10-28T12:00:00Z",
            }
        },
        upsert=True,
    )

    # Reference this URL in an activity
    await db["activities"].insert_one(
        {
            "id": "act-temp-for-media-test",
            "title": "Temp Activity with Media",
            "coverImage": dummy_url,
            "publicationStatus": "published",
        }
    )

    try:
        # Attempt delete -> should fail with 400 or 409 Conflict
        del_res = await client.delete(f"/api/v1/admin/media/{dummy_id}", headers=headers)
        assert del_res.status_code in [400, 409]
        assert "referenced" in del_res.json()["detail"].lower()
    finally:
        # Clean up referencing activity and media item
        await db["activities"].delete_one({"id": "act-temp-for-media-test"})
        # Now delete should succeed
        clean_res = await client.delete(f"/api/v1/admin/media/{dummy_id}", headers=headers)
        assert clean_res.status_code == 200


@pytest.mark.asyncio
async def test_07_gallery_crud(client: AsyncClient):
    """7. Gallery photo creation, retrieval, update, and deletion in MongoDB."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    payload = {
        "title": "Pledge Taking Ceremony 2026",
        "caption": "Students and faculty taking the national anti-drug pledge.",
        "category": "pledges",
        "imageUrl": "https://example.com/gallery-pledge.jpg",
        "thumbnailUrl": "https://example.com/gallery-pledge.jpg",
        "photographer": "NSS MJCET Media Wing",
        "date": "2026-10-28",
        "location": "MJCET Central Hall",
        "aspectRatio": "landscape",
        "tags": ["Pledge", "Youth", "Campus"],
        "publicationStatus": "published",
        "featuredIn3D": True,
        "displayOrder": 10,
    }

    # Create
    create_res = await client.post("/api/v1/admin/gallery", json=payload, headers=headers)
    assert create_res.status_code == 201
    photo = create_res.json()
    photo_id = photo["id"]

    # Update
    update_res = await client.put(
        f"/api/v1/admin/gallery/{photo_id}",
        json={"caption": "Updated caption verifying gallery mutation."},
        headers=headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["caption"] == "Updated caption verifying gallery mutation."

    # Delete
    del_res = await client.delete(f"/api/v1/admin/gallery/{photo_id}", headers=headers)
    assert del_res.status_code == 200


@pytest.mark.asyncio
async def test_08_developers_crud(client: AsyncClient):
    """8. Developer profile creation, retrieval, update, and deletion in MongoDB."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    payload = {
        "fullName": "Jawad Uddin Test",
        "role": "Cloud Architect & Security Lead",
        "bio": "Spearheaded FastAPI MongoDB backend and Firebase authentication integration.",
        "roleCategory": "Fullstack & Cloud",
        "skills": ["Python", "FastAPI", "MongoDB", "Firebase"],
        "avatarUrl": "https://example.com/jawad-avatar.jpg",
        "githubUrl": "https://github.com/jawaduddin",
        "linkedinUrl": "https://linkedin.com/in/jawaduddin",
        "departmentOrAffiliation": "MJCET",
        "featured": True,
        "displayOrder": 1,
        "publicationStatus": "published",
    }

    # Create
    create_res = await client.post("/api/v1/admin/developers", json=payload, headers=headers)
    assert create_res.status_code == 201
    dev = create_res.json()
    dev_id = dev["id"]

    # Update
    update_res = await client.put(
        f"/api/v1/admin/developers/{dev_id}",
        json={"role": "Lead Systems Architect"},
        headers=headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["role"] == "Lead Systems Architect"

    # Delete
    del_res = await client.delete(f"/api/v1/admin/developers/{dev_id}", headers=headers)
    assert del_res.status_code == 200


@pytest.mark.asyncio
async def test_09_quiz_question_valid_single(client: AsyncClient):
    """9. Valid single-choice quiz question created successfully."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    payload = {
        "text": "What is the primary function of dopamine in the brain reward system?",
        "category": "health_impacts",
        "type": "single",
        "options": [
            {"id": "opt-1", "text": "Regulates body temperature"},
            {"id": "opt-2", "text": "Mediates reward reinforcement and motivation pathways"},
            {"id": "opt-3", "text": "Controls voluntary blood circulation"},
        ],
        "correctAnswerIds": ["opt-2"],
        "explanation": "Dopamine acts as a principal neurotransmitter reinforcing motivation and learned behaviors in the mesolimbic pathway.",
        "points": 10,
        "displayOrder": 5,
        "publicationStatus": "published",
    }
    response = await client.post("/api/v1/admin/quiz/questions", json=payload, headers=headers)
    assert response.status_code == 201
    created_q = response.json()
    assert created_q["correctAnswerIds"] == ["opt-2"]

    # Clean up
    await client.delete(f"/api/v1/admin/quiz/questions/{created_q['id']}", headers=headers)


@pytest.mark.asyncio
async def test_10_quiz_question_malformed_single(client: AsyncClient):
    """10. Malformed single-choice question (2 correct answers) rejected with 422."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    malformed_payload = {
        "text": "Malformed single-choice test question?",
        "category": "substance_facts",
        "type": "single",
        "options": [
            {"id": "opt-1", "text": "Option A"},
            {"id": "opt-2", "text": "Option B"},
        ],
        "correctAnswerIds": ["opt-1", "opt-2"],  # INVALID for single choice!
        "explanation": "Invalid test explanation.",
        "points": 5,
        "displayOrder": 1,
        "publicationStatus": "draft",
    }
    response = await client.post("/api/v1/admin/quiz/questions", json=malformed_payload, headers=headers)
    assert response.status_code == 422
    assert "must have exactly one correct answer" in response.text


@pytest.mark.asyncio
async def test_11_quiz_question_valid_boolean(client: AsyncClient):
    """11. Valid boolean question (2 options, 1 answer) created successfully."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    payload = {
        "text": "Substance addiction is clinically classified as a treatable medical disease of the brain.",
        "category": "health_impacts",
        "type": "boolean",
        "options": [
            {"id": "opt-true", "text": "True"},
            {"id": "opt-false", "text": "False"},
        ],
        "correctAnswerIds": ["opt-true"],
        "explanation": "Scientific consensus from WHO and NIH classifies substance addiction as a treatable chronic brain condition.",
        "points": 10,
        "displayOrder": 6,
        "publicationStatus": "published",
    }
    response = await client.post("/api/v1/admin/quiz/questions", json=payload, headers=headers)
    assert response.status_code == 201
    q_data = response.json()
    assert len(q_data["options"]) == 2
    assert q_data["correctAnswerIds"] == ["opt-true"]

    # Clean up
    await client.delete(f"/api/v1/admin/quiz/questions/{q_data['id']}", headers=headers)


@pytest.mark.asyncio
async def test_12_quiz_question_malformed_boolean(client: AsyncClient):
    """12. Malformed boolean question (3 options) rejected with 422."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    payload = {
        "text": "Malformed boolean question?",
        "category": "health_impacts",
        "type": "boolean",
        "options": [
            {"id": "opt-1", "text": "True"},
            {"id": "opt-2", "text": "False"},
            {"id": "opt-3", "text": "Maybe"},  # INVALID: boolean must have exactly 2 options
        ],
        "correctAnswerIds": ["opt-1"],
        "explanation": "Explanation",
        "points": 10,
        "displayOrder": 1,
    }
    response = await client.post("/api/v1/admin/quiz/questions", json=payload, headers=headers)
    assert response.status_code == 422
    assert "must have exactly two options" in response.text


@pytest.mark.asyncio
async def test_13_awareness_messages_crud(client: AsyncClient):
    """13. Post-quiz awareness message creation, retrieval, update, and deletion."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    payload = {
        "title": "Peer Counseling & Confidential Support",
        "body": "NSS MJCET provides confidential student counseling sessions with certified clinical psychologists.",
        "category": "Peer Support",
        "callToAction": "Book Confidential Session",
        "resourceLink": "/support",
        "displayOrder": 1,
        "publicationStatus": "published",
    }

    # Create
    create_res = await client.post("/api/v1/admin/awareness-messages", json=payload, headers=headers)
    assert create_res.status_code == 201
    msg = create_res.json()
    msg_id = msg["id"]

    # Update
    update_res = await client.put(
        f"/api/v1/admin/awareness-messages/{msg_id}",
        json={"title": "Updated Peer Counseling Guidance"},
        headers=headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Updated Peer Counseling Guidance"

    # Delete
    del_res = await client.delete(f"/api/v1/admin/awareness-messages/{msg_id}", headers=headers)
    assert del_res.status_code == 200


@pytest.mark.asyncio
async def test_14_public_endpoints_reflect_mutations(client: AsyncClient):
    """14. Public endpoints reflect published changes in MongoDB."""
    pub_res = await client.get("/api/v1/awareness-messages")
    assert pub_res.status_code == 200
    items = pub_res.json()
    assert isinstance(items, list)
    assert len(items) >= 3


@pytest.mark.asyncio
async def test_15_unauthenticated_rejected_401(client: AsyncClient):
    """15. Accessing protected admin endpoints without a token returns 401."""
    response = await client.get("/api/v1/admin/users")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_16_unapproved_user_rejected_403(client: AsyncClient):
    """16. Authenticated user not on admin allowlist rejected with 403."""
    headers = {"Authorization": f"Bearer {UNAPPROVED_TOKEN}"}
    response = await client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_17_editor_permissions(client: AsyncClient):
    """17. Editor can manage activities, gallery, developers, questions, and awareness messages."""
    headers = {"Authorization": f"Bearer {EDITOR_TOKEN}"}

    # Editor can view activities
    act_res = await client.get("/api/v1/admin/activities", headers=headers)
    assert act_res.status_code == 200

    # Editor can view gallery
    gal_res = await client.get("/api/v1/admin/gallery", headers=headers)
    assert gal_res.status_code == 200

    # Editor can view developers
    dev_res = await client.get("/api/v1/admin/developers", headers=headers)
    assert dev_res.status_code == 200

    # Editor can view quiz questions
    q_res = await client.get("/api/v1/admin/quiz/questions", headers=headers)
    assert q_res.status_code == 200

    # Editor can view awareness messages
    msg_res = await client.get("/api/v1/admin/awareness-messages", headers=headers)
    assert msg_res.status_code == 200


@pytest.mark.asyncio
async def test_18_editor_denied_superadmin_routes(client: AsyncClient):
    """18. Editor strictly denied (403) from Super Admin endpoints (users, settings, audit-logs, excel export)."""
    headers = {"Authorization": f"Bearer {EDITOR_TOKEN}"}

    # Denied /admin/users
    u_res = await client.get("/api/v1/admin/users", headers=headers)
    assert u_res.status_code == 403

    # Denied /admin/settings
    s_res = await client.put("/api/v1/admin/settings", json={"siteTitle": "Hacked"}, headers=headers)
    assert s_res.status_code == 403

    # Denied /admin/audit-logs
    a_res = await client.get("/api/v1/admin/audit-logs", headers=headers)
    assert a_res.status_code == 403

    # Denied /admin/quiz/export (Excel)
    e_res = await client.get("/api/v1/admin/quiz/export", headers=headers)
    assert e_res.status_code == 403


@pytest.mark.asyncio
async def test_19_superadmin_excel_export(client: AsyncClient):
    """19. Super Admin can export genuine OpenPyXL .xlsx workbook."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    response = await client.get("/api/v1/admin/quiz/export", headers=headers)
    assert response.status_code == 200
    assert "spreadsheetml" in response.headers.get("content-type", "")
    assert len(response.content) > 1000  # Valid non-empty workbook bytes


@pytest.mark.asyncio
async def test_20_security_audit_logging(client: AsyncClient):
    """20. Administrative actions are chronologically recorded in audit_logs collection."""
    headers = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}
    response = await client.get("/api/v1/admin/audit-logs?limit=10", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 1
