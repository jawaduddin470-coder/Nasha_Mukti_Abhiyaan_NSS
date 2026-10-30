"""
Phase 5.10 Test Suite — Homepage Content Manager & Permanent Delete with Reference Safety
NSS MJCET Nasha Mukti Abhiyaan
"""

import os
import time
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.db.mongodb import connect_to_mongo, close_mongo_connection, get_database
from backend.app.core.config import Settings


SUPER_ADMIN_TOKEN = "dev-test-token:jawaduddin470@gmail.com"
AUTH_HEADER = {"Authorization": f"Bearer {SUPER_ADMIN_TOKEN}"}


@pytest_asyncio.fixture(scope="function")
async def client():
    await connect_to_mongo()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
    await close_mongo_connection()


@pytest.mark.asyncio
async def test_01_homepage_public_endpoint(client: AsyncClient):
    """GET /homepage/public returns featured activities and gallery items."""
    res = await client.get("/api/v1/homepage/public")
    assert res.status_code == 200
    data = res.json()
    assert "featuredActivities" in data
    assert "featuredGallery" in data
    assert "isCustomized" in data
    assert isinstance(data["featuredActivities"], list)
    assert isinstance(data["featuredGallery"], list)


@pytest.mark.asyncio
async def test_02_admin_homepage_configuration_flow(client: AsyncClient):
    """Test full admin draft, publish, and revert lifecycle."""
    ts = int(time.time())
    # 1. Fetch admin homepage state
    res = await client.get("/api/v1/admin/homepage", headers=AUTH_HEADER)
    assert res.status_code == 200
    admin_state = res.json()
    assert "draftConfig" in admin_state
    assert "publishedConfig" in admin_state
    assert "availableActivities" in admin_state
    assert "availableGallery" in admin_state

    # 2. Create 2 test activities with unique slug
    act1 = await client.post(
        "/api/v1/admin/activities",
        headers=AUTH_HEADER,
        json={
            "title": f"Phase 5.10 Featured Act 1 {ts}",
            "slug": f"phase-5-10-featured-act-1-{ts}",
            "summary": "Featured activity 1 for testing",
            "description": "Featured activity for testing homepage curator",
            "category": "awareness-stalls",
            "venue": "MJCET Main Gate",
            "date": "2026-11-01",
            "timeDisplay": "10:00 AM",
            "status": "upcoming",
            "publicationStatus": "published",
            "coverImage": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        },
    )
    assert act1.status_code == 201
    act1_id = act1.json()["id"]

    act2 = await client.post(
        "/api/v1/admin/activities",
        headers=AUTH_HEADER,
        json={
            "title": f"Phase 5.10 Featured Act 2 {ts}",
            "slug": f"phase-5-10-featured-act-2-{ts}",
            "summary": "Featured activity 2 for testing",
            "description": "Second activity for testing homepage curator",
            "category": "workshops",
            "venue": "Auditorium",
            "date": "2026-11-02",
            "timeDisplay": "02:00 PM",
            "status": "upcoming",
            "publicationStatus": "published",
            "coverImage": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846",
        },
    )
    assert act2.status_code == 201
    act2_id = act2.json()["id"]

    # 3. Create 2 test gallery photos
    gal1 = await client.post(
        "/api/v1/admin/gallery",
        headers=AUTH_HEADER,
        json={
            "title": f"Phase 5.10 Photo 1 {ts}",
            "imageUrl": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
            "category": "rallies",
            "caption": "Photo 1 test",
            "date": "2026-11-01",
        },
    )
    assert gal1.status_code == 201
    gal1_id = gal1.json()["id"]

    gal2 = await client.post(
        "/api/v1/admin/gallery",
        headers=AUTH_HEADER,
        json={
            "title": f"Phase 5.10 Photo 2 {ts}",
            "imageUrl": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846",
            "category": "seminars",
            "caption": "Photo 2 test",
            "date": "2026-11-02",
        },
    )
    assert gal2.status_code == 201
    gal2_id = gal2.json()["id"]

    try:
        # 4. Save draft with selected items and custom ordering
        draft_payload = {
            "featuredActivities": [
                {"activityId": act2_id, "order": 0, "enabled": True},
                {"activityId": act1_id, "order": 1, "enabled": True},
            ],
            "featuredGallery": [
                {"photoId": gal2_id, "order": 0, "enabled": True},
                {"photoId": gal1_id, "order": 1, "enabled": True},
            ],
        }
        update_res = await client.put(
            "/api/v1/admin/homepage/draft",
            headers=AUTH_HEADER,
            json=draft_payload,
        )
        assert update_res.status_code == 200
        updated_state = update_res.json()
        assert updated_state["hasUnpublishedChanges"] is True

        # 5. Publish changes
        pub_res = await client.post("/api/v1/admin/homepage/publish", headers=AUTH_HEADER)
        assert pub_res.status_code == 200
        pub_data = pub_res.json()
        assert pub_data["hasUnpublishedChanges"] is False
        assert len(pub_data["publishedConfig"]["featuredActivities"]) == 2
        assert pub_data["publishedConfig"]["featuredActivities"][0]["activityId"] == act2_id
        assert pub_data["publishedConfig"]["featuredActivities"][1]["activityId"] == act1_id

        # 6. Verify public endpoint returns exactly the configured items in order
        public_res = await client.get("/api/v1/homepage/public")
        assert public_res.status_code == 200
        public_data = public_res.json()
        assert public_data["isCustomized"] is True
        assert len(public_data["featuredActivities"]) >= 2
        assert public_data["featuredActivities"][0]["id"] == act2_id
        assert public_data["featuredActivities"][1]["id"] == act1_id
        assert len(public_data["featuredGallery"]) >= 2
        assert public_data["featuredGallery"][0]["id"] == gal2_id
        assert public_data["featuredGallery"][1]["id"] == gal1_id

        # 7. Remove an item from homepage without deleting original activity
        single_draft = {
            "featuredActivities": [
                {"activityId": act1_id, "order": 0, "enabled": True},
            ],
            "featuredGallery": [
                {"photoId": gal1_id, "order": 0, "enabled": True},
            ],
        }
        await client.put("/api/v1/admin/homepage/draft", headers=AUTH_HEADER, json=single_draft)
        await client.post("/api/v1/admin/homepage/publish", headers=AUTH_HEADER)

        # Check act2 still exists in activities database
        check_act2 = await client.get(f"/api/v1/activities/{act2_id}")
        assert check_act2.status_code == 200
        assert check_act2.json()["title"] == f"Phase 5.10 Featured Act 2 {ts}"

    finally:
        # Cleanup test items
        await client.delete(f"/api/v1/admin/activities/{act1_id}?permanent=true", headers=AUTH_HEADER)
        await client.delete(f"/api/v1/admin/activities/{act2_id}?permanent=true", headers=AUTH_HEADER)
        await client.delete(f"/api/v1/admin/gallery/{gal1_id}?permanent=true", headers=AUTH_HEADER)
        await client.delete(f"/api/v1/admin/gallery/{gal2_id}?permanent=true", headers=AUTH_HEADER)


@pytest.mark.asyncio
async def test_03_activity_archive_and_restore(client: AsyncClient):
    """Archive soft-deletes and removes from public; restore returns it."""
    ts = int(time.time())
    # 1. Create activity
    act_res = await client.post(
        "/api/v1/admin/activities",
        headers=AUTH_HEADER,
        json={
            "title": f"Phase 5.10 Archive Test {ts}",
            "slug": f"phase-5-10-archive-test-{ts}",
            "summary": "To be archived",
            "description": "Full description for archive testing",
            "category": "awareness-stalls",
            "venue": "Room 101",
            "date": "2026-11-05",
            "timeDisplay": "11:00 AM",
            "status": "upcoming",
            "publicationStatus": "published",
            "coverImage": "https://example.com/cover.jpg",
        },
    )
    assert act_res.status_code == 201
    act_id = act_res.json()["id"]

    try:
        # 2. Archive it
        archive_res = await client.post(f"/api/v1/admin/activities/{act_id}/archive", headers=AUTH_HEADER)
        assert archive_res.status_code == 200

        # Check in admin that it is archived
        adm_item = await client.get(f"/api/v1/admin/activities/{act_id}", headers=AUTH_HEADER)
        assert adm_item.status_code == 200
        assert adm_item.json()["publicationStatus"] == "archived"

        # 3. Public get single should return 404 (hidden from public)
        pub_get = await client.get(f"/api/v1/activities/{act_id}")
        assert pub_get.status_code == 404

        # 4. Restore it
        restore_res = await client.post(f"/api/v1/admin/activities/{act_id}/restore", headers=AUTH_HEADER)
        assert restore_res.status_code == 200

        # 5. Check in admin that it is published
        adm_item_restored = await client.get(f"/api/v1/admin/activities/{act_id}", headers=AUTH_HEADER)
        assert adm_item_restored.status_code == 200
        assert adm_item_restored.json()["publicationStatus"] == "published"

        # 6. Now public can see it again
        pub_get_again = await client.get(f"/api/v1/activities/{act_id}")
        assert pub_get_again.status_code == 200
    finally:
        # Permanent delete cleanup
        del_res = await client.delete(f"/api/v1/admin/activities/{act_id}?permanent=true", headers=AUTH_HEADER)
        assert del_res.status_code == 200


@pytest.mark.asyncio
async def test_04_gallery_archive_and_restore(client: AsyncClient):
    """Gallery archive and restore."""
    ts = int(time.time())
    gal_res = await client.post(
        "/api/v1/admin/gallery",
        headers=AUTH_HEADER,
        json={
            "title": f"Archive Photo Test {ts}",
            "imageUrl": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
            "category": "rallies",
            "caption": "Photo archive test",
            "date": "2026-11-01",
        },
    )
    assert gal_res.status_code == 201
    photo_id = gal_res.json()["id"]

    try:
        # Archive
        arc = await client.post(f"/api/v1/admin/gallery/{photo_id}/archive", headers=AUTH_HEADER)
        assert arc.status_code == 200

        doc_arc = await client.get(f"/api/v1/admin/gallery/{photo_id}", headers=AUTH_HEADER)
        assert doc_arc.status_code == 200
        assert doc_arc.json()["publicationStatus"] == "archived"

        # Restore
        rst = await client.post(f"/api/v1/admin/gallery/{photo_id}/restore", headers=AUTH_HEADER)
        assert rst.status_code == 200

        doc_restored = await client.get(f"/api/v1/admin/gallery/{photo_id}", headers=AUTH_HEADER)
        assert doc_restored.status_code == 200
        assert doc_restored.json()["publicationStatus"] == "published"
    finally:
        # Permanent delete
        pdel = await client.delete(f"/api/v1/admin/gallery/{photo_id}?permanent=true", headers=AUTH_HEADER)
        assert pdel.status_code == 200


@pytest.mark.asyncio
async def test_05_permanent_delete_shared_image_safety(client: AsyncClient):
    """Shared images referenced by another entity must NOT be deleted from disk upon record deletion."""
    settings = Settings()
    os.makedirs(settings.MEDIA_UPLOAD_DIR, exist_ok=True)
    mock_filename = f"shared_test_image_phase5_10_{int(time.time())}.jpg"
    mock_filepath = os.path.join(settings.MEDIA_UPLOAD_DIR, mock_filename)
    with open(mock_filepath, "wb") as f:
        f.write(b"MOCK IMAGE DATA FOR TESTING REFERENCE SAFETY")
    assert os.path.exists(mock_filepath)

    mock_image_url = f"/uploads/{mock_filename}"
    ts = int(time.time())

    # Create Activity A referencing this mock image
    act_a = await client.post(
        "/api/v1/admin/activities",
        headers=AUTH_HEADER,
        json={
            "title": f"Shared Image Act A {ts}",
            "slug": f"shared-image-act-a-{ts}",
            "summary": "Summary A",
            "description": "Referencing shared image",
            "category": "awareness-stalls",
            "venue": "Room A",
            "date": "2026-11-10",
            "timeDisplay": "10:00 AM",
            "status": "upcoming",
            "publicationStatus": "published",
            "coverImage": mock_image_url,
        },
    )
    assert act_a.status_code == 201
    act_a_id = act_a.json()["id"]

    # Create Activity B referencing the EXACT SAME mock image
    act_b = await client.post(
        "/api/v1/admin/activities",
        headers=AUTH_HEADER,
        json={
            "title": f"Shared Image Act B {ts}",
            "slug": f"shared-image-act-b-{ts}",
            "summary": "Summary B",
            "description": "Also referencing shared image",
            "category": "awareness-stalls",
            "venue": "Room B",
            "date": "2026-11-11",
            "timeDisplay": "11:00 AM",
            "status": "upcoming",
            "publicationStatus": "published",
            "coverImage": mock_image_url,
        },
    )
    assert act_b.status_code == 201
    act_b_id = act_b.json()["id"]

    # Permanently delete Activity A
    del_a = await client.delete(f"/api/v1/admin/activities/{act_a_id}?permanent=true", headers=AUTH_HEADER)
    assert del_a.status_code == 200

    # Verify Activity A is deleted from MongoDB
    db = get_database()
    find_a = await db["activities"].find_one({"id": act_a_id})
    assert find_a is None

    # CRITICAL: Verify the file STILL EXISTS on disk because Activity B still references it!
    assert os.path.exists(mock_filepath), "Shared image file was prematurely deleted while referenced by Activity B!"

    # Now permanently delete Activity B (the last reference)
    del_b = await client.delete(f"/api/v1/admin/activities/{act_b_id}?permanent=true", headers=AUTH_HEADER)
    assert del_b.status_code == 200

    # Verify Activity B is deleted from MongoDB
    find_b = await db["activities"].find_one({"id": act_b_id})
    assert find_b is None

    # CRITICAL: Verify the orphan image file is now safely unlinked from disk
    assert not os.path.exists(mock_filepath), "Orphan image file should have been cleaned up after all references were deleted!"
