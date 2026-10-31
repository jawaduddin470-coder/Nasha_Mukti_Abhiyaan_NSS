"""
National Unity Day Quiz & Unified Portal Database Seeder
NSS MJCET Nasha Mukti Abhiyaan
Ensures both quizzes, all 10 National Unity Day MCQs, and 3 leaderboards are persisted in MongoDB.
"""

import asyncio
from datetime import datetime, timezone
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from backend.app.core.config import settings

NOW_ISO = datetime.now(timezone.utc).isoformat()

INITIAL_QUIZZES = [
    {
        "id": "nmba-awareness-challenge-v1",
        "title": "Nasha Mukti Awareness Challenge",
        "slug": "nasha-mukti-awareness",
        "description": "Explore substance abuse awareness, prevention, mental wellbeing, healthy choices and the importance of supporting one another.",
        "badge": "Campus Resilience & Health",
        "estimatedMinutes": 10,
        "status": "active",
        "theme": "awareness",
        "passingScorePercentage": 70,
        "timeLimitMinutes": 15,
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "national-unity-day-quiz-v1",
        "title": "National Unity Day Challenge",
        "slug": "national-unity-day",
        "description": "Celebrate India's unity, diversity and national identity through an interactive challenge exploring Indian history, patriotism, national integration and civic values.",
        "badge": "Rashtriya Ekta Diwas",
        "estimatedMinutes": 8,
        "status": "active",
        "theme": "unity",
        "passingScorePercentage": 70,
        "timeLimitMinutes": 10,
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
]

NATIONAL_UNITY_QUESTIONS = [
    {
        "id": "unity-q1",
        "quizId": "national-unity-day-quiz-v1",
        "displayOrder": 1,
        "points": 10,
        "type": "single",
        "category": "national_unity",
        "text": "Why is National Unity Day (Rashtriya Ekta Diwas) celebrated annually across India on 31st October?",
        "options": [
            {"id": "uq1-opt1", "text": "To commemorate the birth anniversary of Sardar Vallabhbhai Patel."},
            {"id": "uq1-opt2", "text": "To celebrate the adoption of the Indian Constitution."},
            {"id": "uq1-opt3", "text": "To honor the founding of the National Service Scheme."},
            {"id": "uq1-opt4", "text": "To mark the official declaration of India as a sovereign republic."},
        ],
        "correctAnswerIds": ["uq1-opt1"],
        "explanation": "National Unity Day was introduced by the Government of India in 2014 and is observed on October 31st to honor the birth anniversary of Sardar Vallabhbhai Patel, the principal architect of India's national integration.",
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "unity-q2",
        "quizId": "national-unity-day-quiz-v1",
        "displayOrder": 2,
        "points": 10,
        "type": "single",
        "category": "national_heroes",
        "text": "Which historic executive portfolio was held by Sardar Vallabhbhai Patel in independent India's first cabinet?",
        "options": [
            {"id": "uq2-opt1", "text": "First Deputy Prime Minister and Home Minister of India"},
            {"id": "uq2-opt2", "text": "First Defense Minister of India"},
            {"id": "uq2-opt3", "text": "First Chief Justice of the Supreme Court"},
            {"id": "uq2-opt4", "text": "First Minister of External Affairs"},
        ],
        "correctAnswerIds": ["uq2-opt1"],
        "explanation": "Sardar Vallabhbhai Patel served as the first Deputy Prime Minister and Home Minister of independent India from 1947 to 1950, steering the newly independent nation through partition and national consolidation.",
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "unity-q3",
        "quizId": "national-unity-day-quiz-v1",
        "displayOrder": 3,
        "points": 10,
        "type": "single",
        "category": "national_integration",
        "text": "Approximately how many princely states did Sardar Patel and V. P. Menon successfully integrate into the Indian Union?",
        "options": [
            {"id": "uq3-opt1", "text": "Over 565 princely states"},
            {"id": "uq3-opt2", "text": "Around 50 princely states"},
            {"id": "uq3-opt3", "text": "Exactly 100 princely states"},
            {"id": "uq3-opt4", "text": "Over 1,200 princely states"},
        ],
        "correctAnswerIds": ["uq3-opt1"],
        "explanation": "Through firm diplomacy, statesmanship, and the Instrument of Accession, Sardar Patel and V. P. Menon achieved the historic unification of more than 565 autonomous princely states into a unified democratic republic.",
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "unity-q4",
        "quizId": "national-unity-day-quiz-v1",
        "displayOrder": 4,
        "points": 10,
        "type": "single",
        "category": "monuments_heritage",
        "text": "Where is the world's tallest monument, the Statue of Unity, located?",
        "options": [
            {"id": "uq4-opt1", "text": "Ekta Nagar (Kevadia), Gujarat, facing the Sardar Sarovar Dam on the Narmada River"},
            {"id": "uq4-opt2", "text": "New Delhi, along the Yamuna River"},
            {"id": "uq4-opt3", "text": "Hyderabad, Telangana, near Hussain Sagar"},
            {"id": "uq4-opt4", "text": "Mumbai, Maharashtra, on Marine Drive"},
        ],
        "correctAnswerIds": ["uq4-opt1"],
        "explanation": "Standing at a monumental height of 182 metres (597 ft), the Statue of Unity is located in Ekta Nagar (Kevadia), Gujarat, facing the Sardar Sarovar Dam on the Narmada River.",
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "unity-q5",
        "quizId": "national-unity-day-quiz-v1",
        "displayOrder": 5,
        "points": 10,
        "type": "single",
        "category": "civic_values",
        "text": "What does the phrase 'Unity in Diversity' celebrate in the context of the Indian Republic?",
        "options": [
            {"id": "uq5-opt1", "text": "Harmony and collective national identity flourishing across diverse languages, cultures, and traditions"},
            {"id": "uq5-opt2", "text": "The enforcement of a single uniform language across all states"},
            {"id": "uq5-opt3", "text": "The complete elimination of regional customs and traditions"},
            {"id": "uq5-opt4", "text": "The isolation of different cultural communities from one another"},
        ],
        "correctAnswerIds": ["uq5-opt1"],
        "explanation": "'Unity in Diversity' celebrates India's profound strength: a united sovereign republic built upon peaceful coexistence, mutual respect, and rich cultural, linguistic, and spiritual diversity.",
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "unity-q6",
        "quizId": "national-unity-day-quiz-v1",
        "displayOrder": 6,
        "points": 10,
        "type": "single",
        "category": "constitutional_duties",
        "text": "Under Article 51A of the Constitution of India, which of the following is a Fundamental Duty of every citizen?",
        "options": [
            {"id": "uq6-opt1", "text": "To uphold and protect the sovereignty, unity, and integrity of India"},
            {"id": "uq6-opt2", "text": "To serve compulsorily in the armed forces upon graduation"},
            {"id": "uq6-opt3", "text": "To hold public political office at least once"},
            {"id": "uq6-opt4", "text": "To vote exclusively for a designated national party"},
        ],
        "correctAnswerIds": ["uq6-opt1"],
        "explanation": "Article 51A(c) explicitly enlists the duty 'to uphold and protect the sovereignty, unity and integrity of India' as a core constitutional duty of every citizen.",
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "unity-q7",
        "quizId": "national-unity-day-quiz-v1",
        "displayOrder": 7,
        "points": 10,
        "type": "single",
        "category": "patriotism_pledge",
        "text": "What is the primary commitment affirmed in the official Rashtriya Ekta Diwas (National Unity) Pledge?",
        "options": [
            {"id": "uq7-opt1", "text": "To preserve the unity, integrity, and security of the nation and spread this message among fellow citizens"},
            {"id": "uq7-opt2", "text": "To pursue individual financial prosperity above public service"},
            {"id": "uq7-opt3", "text": "To restrict social service activities to one's own hometown"},
            {"id": "uq7-opt4", "text": "To prioritize international trade over community welfare"},
        ],
        "correctAnswerIds": ["uq7-opt1"],
        "explanation": "The National Unity Pledge is a solemn affirmation dedicating citizens to preserving the unity, integrity, and security of the nation and striving toward harmonious community life.",
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "unity-q8",
        "quizId": "national-unity-day-quiz-v1",
        "displayOrder": 8,
        "points": 10,
        "type": "single",
        "category": "national_institutions",
        "text": "Why is Sardar Vallabhbhai Patel remembered as the 'Patron Saint of India's Civil Services'?",
        "options": [
            {"id": "uq8-opt1", "text": "He championed the creation of modern All India Services (IAS/IPS) as the steel frame of national governance"},
            {"id": "uq8-opt2", "text": "He served as the first Comptroller and Auditor General of India"},
            {"id": "uq8-opt3", "text": "He authored the Indian Penal Code"},
            {"id": "uq8-opt4", "text": "He designed the Union Public Service Commission building in Delhi"},
        ],
        "correctAnswerIds": ["uq8-opt1"],
        "explanation": "Sardar Patel envisioned modern All India Services as the unifying 'steel frame' of the nation, speaking passionately to the first batch of civil servants at Metcalfe House in April 1947.",
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "unity-q9",
        "quizId": "national-unity-day-quiz-v1",
        "displayOrder": 9,
        "points": 10,
        "type": "single",
        "category": "nss_ethos",
        "text": "What is the official motto of the National Service Scheme (NSS), and what does it signify?",
        "options": [
            {"id": "uq9-opt1", "text": "'Not Me But You' — reflecting selfless service, democratic living, and compassion for the community"},
            {"id": "uq9-opt2", "text": "'Truth Alone Triumphs' — focused exclusively on courtroom legal victories"},
            {"id": "uq9-opt3", "text": "'Service Before Self' — military combat training for scouts"},
            {"id": "uq9-opt4", "text": "'Work is Worship' — exclusively dedicated to industrial manufacturing"},
        ],
        "correctAnswerIds": ["uq9-opt1"],
        "explanation": "The NSS motto 'NOT ME BUT YOU' expresses the essence of democratic living and selfless community service, teaching students that individual welfare ultimately depends upon the welfare of society as a whole.",
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "unity-q10",
        "quizId": "national-unity-day-quiz-v1",
        "displayOrder": 10,
        "points": 10,
        "type": "single",
        "category": "youth_action",
        "text": "How can collegiate youth actively practice patriotism and national unity in daily campus life?",
        "options": [
            {"id": "uq10-opt1", "text": "By fostering inclusivity, rejecting discrimination, supporting peers, and volunteering for constructive social causes"},
            {"id": "uq10-opt2", "text": "By avoiding participation in college initiatives or student welfare programs"},
            {"id": "uq10-opt3", "text": "By interacting only with peers who share the same regional background"},
            {"id": "uq10-opt4", "text": "By remaining indifferent to community challenges and public health issues"},
        ],
        "correctAnswerIds": ["uq10-opt1"],
        "explanation": "True patriotism in collegiate life is expressed through active empathy, inclusivity, social service through NSS, upholding community well-being, and rejecting substance abuse to build an empowered India.",
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
]

LEADERBOARD_INITIAL_RECORDS = [
    {
        "quizId": "nmba-awareness-challenge-v1",
        "quizTitle": "Nasha Mukti Awareness Quiz",
        "quizSlug": "nasha-mukti-awareness",
        "isPublished": False,
        "status": "coming_soon",
        "publishedAt": None,
        "publishedBy": None,
        "announcementDate": None,
        "showPublicNames": True,
        "highlightTopThree": True,
        "customNote": "Official certified rankings authenticated by NSS MJCET Examination Authority.",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "quizId": "national-unity-day-quiz-v1",
        "quizTitle": "National Unity Day Quiz",
        "quizSlug": "national-unity-day",
        "isPublished": False,
        "status": "coming_soon",
        "publishedAt": None,
        "publishedBy": None,
        "announcementDate": None,
        "showPublicNames": True,
        "highlightTopThree": True,
        "customNote": "Official certified rankings authenticated by NSS MJCET Examination Authority.",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "quizId": "unified-nss-mjcet-leaderboard",
        "quizTitle": "Unified NSS MJCET Leaderboard",
        "quizSlug": "unified",
        "isPublished": False,
        "status": "coming_soon",
        "publishedAt": None,
        "publishedBy": None,
        "announcementDate": None,
        "showPublicNames": True,
        "highlightTopThree": True,
        "eligibilityRule": "any",
        "customNote": "Official combined honors authenticated across both National Unity Day & Nasha Mukti Awareness Challenges.",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
]


async def seed_unity_and_portal():
    client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=5000,
    )
    db = client[settings.DATABASE_NAME]

    try:
        # 1. Upsert Quizzes Config
        for q in INITIAL_QUIZZES:
            await db["quizzes"].update_one(
                {"id": q["id"]},
                {"$set": q},
                upsert=True,
            )
        print(f"Upserted {len(INITIAL_QUIZZES)} Quizzes in 'quizzes' collection.")

        # 2. Tag existing awareness questions with quizId if needed
        res = await db["quiz_questions"].update_many(
            {"$or": [{"quizId": None}, {"quizId": {"$exists": False}}]},
            {"$set": {"quizId": "nmba-awareness-challenge-v1"}},
        )
        if res.modified_count > 0:
            print(f"Tagged {res.modified_count} existing questions with nmba-awareness-challenge-v1.")

        # 3. Upsert National Unity Day Questions
        for q in NATIONAL_UNITY_QUESTIONS:
            await db["quiz_questions"].update_one(
                {"id": q["id"]},
                {"$set": q},
                upsert=True,
            )
        print(f"Upserted {len(NATIONAL_UNITY_QUESTIONS)} National Unity Day questions in 'quiz_questions'.")

        # 4. Upsert Leaderboards (preserving publication status if already exists)
        for lb in LEADERBOARD_INITIAL_RECORDS:
            existing = await db["quiz_leaderboards"].find_one({"quizId": lb["quizId"]})
            if not existing:
                await db["quiz_leaderboards"].insert_one(lb)
                print(f"Created leaderboard record for {lb['quizId']}.")
            else:
                # Update metadata but preserve isPublished
                await db["quiz_leaderboards"].update_one(
                    {"quizId": lb["quizId"]},
                    {
                        "$set": {
                            "quizTitle": lb["quizTitle"],
                            "quizSlug": lb["quizSlug"],
                            "customNote": lb["customNote"],
                        }
                    },
                )
                print(f"Updated metadata for existing leaderboard {lb['quizId']}.")

        print("Seeding completed successfully!")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(seed_unity_and_portal())
