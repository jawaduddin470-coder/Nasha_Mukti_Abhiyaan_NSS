"""
MongoDB Idempotent Seeder
NSS MJCET Nasha Mukti Abhiyaan
Migrates all existing curated records into MongoDB Atlas without duplication.
"""

import asyncio
import logging
from datetime import datetime, timezone
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from backend.app.core.config import settings
from backend.app.db.indexes import create_indexes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nmba_backend.seeder")

NOW_ISO = datetime.now(timezone.utc).isoformat()

INITIAL_SUPER_ADMINS = [
    {
        "email": "jawaddduddin@gmail.com",
        "role": "SUPER_ADMIN",
        "status": "active",
        "displayName": "Syed Jawaduddin (Lead Super Admin)",
        "photoUrl": "",
        "addedBy": "system_bootstrap",
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
        "lastLoginAt": None,
    }
]

INITIAL_ACTIVITIES = [
    {
        "id": "act-pledge-walkathon-2026",
        "slug": "youth-pledge-campus-walkathon-2026",
        "title": "Nasha Mukt Bharat Youth Pledge & Campus Walkathon",
        "summary": "An inspiring solidarity march and solemn collective pledge across the historic MJCET campus quadrangle.",
        "description": "Over 1,200 students, faculty mentors, and youth volunteers assembled at the MJCET campus to take the official Nasha Mukt Bharat Abhiyaan pledge. Accompanied by national flags and awareness placards, the delegation walked through Sultan Bazar and Banjara Hills.",
        "category": "campus_campaigns",
        "status": "completed",
        "publicationStatus": "published",
        "date": "2026-08-12",
        "timeDisplay": "09:30 AM - 12:30 PM IST",
        "venue": "MJCET Main Campus Quadrangle to Banjara Hills",
        "venueCoordinates": {"lat": 17.3949, "lng": 78.4385},
        "targetAudience": "Undergraduate Engineers & Faculty Mentors",
        "coordinators": ["Dr. M. A. Quadri (NSS Program Coordinator)", "Student Lead Syed Jawad"],
        "impactMetrics": [
            {"label": "Volunteers Pledged", "value": "1,200+"},
            {"label": "Distance Covered", "value": "4.2 km"},
            {"label": "Pamphlets Distributed", "value": "3,500"},
        ],
        "agenda": [
            {"time": "09:30 AM", "title": "Assembly & National Anthem", "description": "Gathering at the campus fountain grounds."},
            {"time": "10:00 AM", "title": "Solemn Pledge Administration", "description": "Led by Principal and NSS officers."},
            {"time": "10:30 AM", "title": "Advocacy Walkathon Flag-off", "description": "March route through primary junctions."},
            {"time": "12:00 PM", "title": "Concluding Reflection Circle", "description": "Open mic sharing and pledge signatures."},
        ],
        "coverImage": "/PHOTO-2026-10-27-23-13-25.jpg",
        "galleryImages": [
            {"url": "/PHOTO-2026-10-27-23-38-22.jpg", "caption": "Students taking the Nasha Mukti pledge", "displayOrder": 1},
            {"url": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80", "caption": "Campus gathering and leadership address", "displayOrder": 2},
        ],
        "tags": ["Walkathon", "Pledge Drive", "Campus Event", "Youth Leadership"],
        "featured": True,
        "displayOrder": 1,
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "act-wellness-seminar-2026",
        "slug": "mental-resilience-and-substance-harm-reduction-seminar",
        "title": "Clinical Neuroscience of Addiction & Coping Seminar",
        "summary": "Specialist clinical seminar dissecting chemical habituation, neurobiology of dependency, and constructive stress mitigation.",
        "description": "Renowned clinical psychiatrists and de-addiction counselors delivered keynote addresses on how substance dependency hijacks the brain's dopamine pathways. The panel answered student questions candidly.",
        "category": "educational_outreach",
        "status": "completed",
        "publicationStatus": "published",
        "date": "2026-09-05",
        "timeDisplay": "02:00 PM - 05:00 PM IST",
        "venue": "MJCET Central Auditorium",
        "venueCoordinates": {"lat": 17.3951, "lng": 78.4388},
        "targetAudience": "First & Second Year Undergraduate Engineers",
        "coordinators": ["Prof. Fatima Sultana", "NSS Medical Advisory Committee"],
        "impactMetrics": [
            {"label": "Attendees", "value": "650+"},
            {"label": "Q&A Submissions", "value": "92"},
            {"label": "Counseling Referrals", "value": "18"},
        ],
        "agenda": [
            {"time": "02:00 PM", "title": "Welcome Address & Clinical Framework", "description": "Introductory remarks by Head of Student Affairs."},
            {"time": "02:45 PM", "title": "Neurobiology of Dopamine Hijacking", "description": "Visual presentation by visiting neuropsychiatrist."},
            {"time": "04:00 PM", "title": "Interactive Open Q&A Session", "description": "Anonymous index card questions answered directly."},
        ],
        "coverImage": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
        "galleryImages": [
            {"url": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80", "caption": "Auditorium keynote session", "displayOrder": 1},
        ],
        "tags": ["Clinical Seminar", "Neurobiology", "Mental Health", "Counseling"],
        "featured": True,
        "displayOrder": 2,
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "act-peer-ambassador-workshop",
        "slug": "peer-advocate-empowerment-and-counseling-clinic",
        "title": "Peer Ambassador Training: De-escalation & Safe Interventions",
        "summary": "Hands-on certification workshop preparing 40 student leaders to identify warning signs and facilitate compassionate care pathways.",
        "description": "Student representatives across all 8 engineering branches underwent rigorous empathy and intervention training. Topics included active listening, recognizing quiet withdrawal, addressing vaping/nicotine proliferation, and safely directing peers to confidential counseling.",
        "category": "health_initiatives",
        "status": "completed",
        "publicationStatus": "published",
        "date": "2026-09-20",
        "timeDisplay": "10:00 AM - 04:00 PM IST",
        "venue": "Civil Engineering Seminar Hall",
        "venueCoordinates": {"lat": 17.3948, "lng": 78.4382},
        "targetAudience": "Elected Class Representatives & NSS Volunteer Leads",
        "coordinators": ["Student Welfare Cell", "Telangana State Council Counseling Wing"],
        "impactMetrics": [
            {"label": "Certified Peer Advocates", "value": "42"},
            {"label": "Role-Play Scenarios Tested", "value": "14"},
            {"label": "Departments Covered", "value": "8/8"},
        ],
        "agenda": [
            {"time": "10:00 AM", "title": "Active Listening & Empathy Training", "description": "Deconstructing non-judgmental dialogue."},
            {"time": "12:00 PM", "title": "Simulated Peer Intervention", "description": "Role-play scenarios on identifying chemical dependency."},
            {"time": "02:30 PM", "title": "Confidentiality Protocols & Care Escalation", "description": "How to safely connect peers to doctors."},
        ],
        "coverImage": "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80",
        "galleryImages": [
            {"url": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80", "caption": "Interactive peer breakout circle", "displayOrder": 1},
        ],
        "tags": ["Peer Leadership", "Workshop", "Empathy", "Certification"],
        "featured": True,
        "displayOrder": 3,
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "act-creative-expression-contest",
        "slug": "sober-stories-intercollegiate-short-film-and-art-slam",
        "title": "'Sober Stories': Intercollegiate Art, Poetry & Short Film Slam",
        "summary": "Creative competition honoring raw stories of resilience, refusal agency, and breaking free from social stigma.",
        "description": "Over 140 original artwork entries, 35 slam poems, and 12 short documentary reels were submitted by engineering and university students across Hyderabad. Winning entries were publicly exhibited at the central campus library foyer.",
        "category": "creative_contests",
        "status": "completed",
        "publicationStatus": "published",
        "date": "2026-10-02",
        "timeDisplay": "11:00 AM - 05:30 PM IST",
        "venue": "MJCET Central Library Foyer & Audio-Visual Hall",
        "venueCoordinates": {"lat": 17.3953, "lng": 78.4391},
        "targetAudience": "All Collegiate Artists, Writers & Filmmakers",
        "coordinators": ["NSS Cultural Committee", "Literary & Art Club MJCET"],
        "impactMetrics": [
            {"label": "Art & Film Entries", "value": "187"},
            {"label": "Exhibition Visitors", "value": "2,400+"},
            {"label": "Colleges Represented", "value": "11"},
        ],
        "agenda": [
            {"time": "11:00 AM", "title": "Art & Poster Exhibition Inauguration", "description": "Curated display of original awareness paintings."},
            {"time": "02:00 PM", "title": "Slam Poetry & Monologue Showcase", "description": "Live spoken word performance."},
            {"time": "04:30 PM", "title": "Short Film Screenings & Awards", "description": "Screening of top 5 student documentary reels."},
        ],
        "coverImage": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
        "galleryImages": [
            {"url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80", "caption": "Award ceremony and film screening", "displayOrder": 1},
        ],
        "tags": ["Short Film", "Art Exhibition", "Poetry Slam", "Intercollegiate"],
        "featured": True,
        "displayOrder": 4,
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "act-community-health-screening",
        "slug": "adopt-a-basti-community-health-screening-camp",
        "title": "Community Health & Substance Screening Camp",
        "summary": "Medical outreach and confidential counseling camp in adopted civic bastis near Golconda and Asif Nagar.",
        "description": "NSS volunteers partnered with practicing physicians from Deccan Medical College to conduct free health checkups, blood pressure screenings, and confidential addiction screenings for over 450 local residents and daily wage laborers.",
        "category": "community_service",
        "status": "completed",
        "publicationStatus": "published",
        "date": "2026-10-15",
        "timeDisplay": "08:30 AM - 02:00 PM IST",
        "venue": "Government Community Center, Asif Nagar",
        "venueCoordinates": {"lat": 17.3871, "lng": 78.4412},
        "targetAudience": "Local Community Families & Youth",
        "coordinators": ["Dr. K. Rammohan Rao (Chief Medical Officer)", "NSS Community Outreach Cell"],
        "impactMetrics": [
            {"label": "Citizens Screened", "value": "460+"},
            {"label": "Nutrition Kits Distributed", "value": "300"},
            {"label": "Counseling Enrollments", "value": "34"},
        ],
        "agenda": [
            {"time": "08:30 AM", "title": "Registration & Vital Signs Screening", "description": "Blood pressure, sugar, and general wellness tests."},
            {"time": "10:30 AM", "title": "Confidential Counseling Desks", "description": "Private rooms with certified psychologists."},
            {"time": "01:00 PM", "title": "Community Nutrition Kit Distribution", "description": "Supporting families in need."},
        ],
        "coverImage": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
        "galleryImages": [
            {"url": "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80", "caption": "Doctor consulting with community member", "displayOrder": 1},
        ],
        "tags": ["Community Outreach", "Medical Camp", "Free Screening", "Civic Action"],
        "featured": True,
        "displayOrder": 5,
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
    {
        "id": "act-flash-mob-metro-square",
        "slug": "street-theatre-and-flash-mob-advocacy-drive",
        "title": "'Jaagte Raho': Street Play & Public Transit Advocacy Drive",
        "summary": "High-energy street theatrical performance and street-theatre advocacy staged at major metro stations and bustling junctions.",
        "description": "NSS MJCET dramatic society presented a hard-hitting 20-minute Nukkad Natak highlighting peer pressure traps, synthetic drug realities, and the power of asking for help. The flash play engaged thousands of commuters during evening peak transit.",
        "category": "awareness_drives",
        "status": "completed",
        "publicationStatus": "published",
        "date": "2026-10-24",
        "timeDisplay": "04:30 PM - 07:00 PM IST",
        "venue": "Nampally Metro Concourse & Public Transit Plaza",
        "venueCoordinates": {"lat": 17.3924, "lng": 78.4682},
        "targetAudience": "General Commuters, Urban Youth & Families",
        "coordinators": ["NSS Street Theatre Troop", "Hyderabad Metro Transit Security"],
        "impactMetrics": [
            {"label": "Live Spectators", "value": "3,000+"},
            {"label": "Street Plays Staged", "value": "3"},
            {"label": "Helpline Cards Handed Out", "value": "2,200"},
        ],
        "agenda": [
            {"time": "04:30 PM", "title": "Transit Concourse Assembly", "description": "Drum beat gathering and acoustic call-in."},
            {"time": "05:00 PM", "title": "Nukkad Natak: 'Jaagte Raho' (Act 1)", "description": "Depicting student stress and unhealthy temptations."},
            {"time": "06:00 PM", "title": "Pledge Card Concourse Distribution", "description": "Handing verified toll-free care numbers to citizens."},
        ],
        "coverImage": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
        "galleryImages": [
            {"url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80", "caption": "Commuters watching street play", "displayOrder": 1},
        ],
        "tags": ["Street Play", "Nukkad Natak", "Flash Mob", "Metro Transit"],
        "featured": True,
        "displayOrder": 6,
        "createdAt": NOW_ISO,
        "updatedAt": NOW_ISO,
    },
]

INITIAL_GALLERY = [
    {
        "id": "gal-01",
        "title": "Solemn Pledge Circle & Flag Bearers",
        "caption": "Over 1,200 students assemble at the central quadrangle to take the Nasha Mukt Bharat national pledge.",
        "category": "pledge_signatures",
        "imageUrl": "/PHOTO-2026-10-27-23-13-25.jpg",
        "thumbnailUrl": "/PHOTO-2026-10-27-23-13-25.jpg",
        "photographer": "NSS MJCET Media Wing",
        "date": "2026-08-12",
        "location": "MJCET Main Quadrangle",
        "aspectRatio": "landscape",
        "tags": ["Pledge", "Campus", "Assembly", "Solidarity"],
        "publicationStatus": "published",
        "featuredIn3D": True,
        "displayOrder": 1,
        "createdAt": NOW_ISO,
    },
    {
        "id": "gal-02",
        "title": "Youth Solidarity Campus Walkathon",
        "caption": "Students and faculty carrying awareness placards and tricolour banners through campus avenues.",
        "category": "campus_rally",
        "imageUrl": "/PHOTO-2026-10-27-23-38-22.jpg",
        "thumbnailUrl": "/PHOTO-2026-10-27-23-38-22.jpg",
        "photographer": "Syed Jawaduddin",
        "date": "2026-08-12",
        "location": "Banjara Hills Avenue",
        "aspectRatio": "landscape",
        "tags": ["Walkathon", "Rally", "Youth", "Advocacy"],
        "publicationStatus": "published",
        "featuredIn3D": True,
        "displayOrder": 2,
        "createdAt": NOW_ISO,
    },
    {
        "id": "gal-03",
        "title": "Clinical Neuroscience Keynote Address",
        "caption": "Visiting neuropsychiatrist delivering an engaging breakdown of dopamine pathways and recovery science.",
        "category": "workshops",
        "imageUrl": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
        "photographer": "NSS Technical Committee",
        "date": "2026-09-05",
        "location": "MJCET Central Auditorium",
        "aspectRatio": "landscape",
        "tags": ["Seminar", "Neuroscience", "Mental Health"],
        "publicationStatus": "published",
        "featuredIn3D": True,
        "displayOrder": 3,
        "createdAt": NOW_ISO,
    },
    {
        "id": "gal-04",
        "title": "Peer Advocate Training Breakout Circle",
        "caption": "Class representatives practicing compassionate bystander intervention and active listening protocols.",
        "category": "workshops",
        "imageUrl": "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=600&q=80",
        "photographer": "Student Welfare Cell",
        "date": "2026-09-20",
        "location": "Civil Engineering Seminar Hall",
        "aspectRatio": "landscape",
        "tags": ["Workshop", "Peer Support", "Empathy"],
        "publicationStatus": "published",
        "featuredIn3D": True,
        "displayOrder": 4,
        "createdAt": NOW_ISO,
    },
    {
        "id": "gal-05",
        "title": "'Sober Stories' Creative Expression Gallery",
        "caption": "Original student paintings, visual poems, and anti-substance graphics on display at the central library foyer.",
        "category": "pledge_signatures",
        "imageUrl": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80",
        "photographer": "Literary Club MJCET",
        "date": "2026-10-02",
        "location": "Central Library Foyer",
        "aspectRatio": "landscape",
        "tags": ["Art Slam", "Creative", "Exhibition"],
        "publicationStatus": "published",
        "featuredIn3D": True,
        "displayOrder": 5,
        "createdAt": NOW_ISO,
    },
    {
        "id": "gal-06",
        "title": "Community Health & Confidential Counseling",
        "caption": "Free medical checkups and private psychological guidance provided for over 450 neighborhood residents.",
        "category": "student_walks",
        "imageUrl": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
        "photographer": "Deccan Medical Volunteers",
        "date": "2026-10-15",
        "location": "Asif Nagar Community Center",
        "aspectRatio": "landscape",
        "tags": ["Medical Camp", "Community", "Screening"],
        "publicationStatus": "published",
        "featuredIn3D": True,
        "displayOrder": 6,
        "createdAt": NOW_ISO,
    },
    {
        "id": "gal-08",
        "title": "'Jaagte Raho' Transit Concourse Street Natak",
        "caption": "Live street theatrical drama performing for evening transit commuters at the Nampally Metro Concourse.",
        "category": "campus_rally",
        "imageUrl": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
        "thumbnailUrl": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
        "photographer": "NSS Dramatic Society",
        "date": "2026-10-24",
        "location": "Nampally Metro Station",
        "aspectRatio": "landscape",
        "tags": ["Nukkad Natak", "Street Play", "Metro Concourse"],
        "publicationStatus": "published",
        "featuredIn3D": True,
        "displayOrder": 7,
        "createdAt": NOW_ISO,
    },
]

INITIAL_DEVELOPERS = [
    {
        "id": "dev-01",
        "fullName": "Mohammed Meraj Uddin",
        "role": "Platform Engineering Lead",
        "bio": "Undergraduate technologist leading web platform engineering and accessible user experiences for the NSS MJCET digital campaign.",
        "roleCategory": "core_lead",
        "skills": ["React", "TypeScript", "Tailwind CSS", "FastAPI"],
        "avatarUrl": "",
        "githubUrl": "",
        "linkedinUrl": "",
        "otherUrl": "",
        "departmentOrAffiliation": "Computer Science & Engineering, MJCET",
        "featured": True,
        "displayOrder": 1,
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
    },
    {
        "id": "dev-02",
        "fullName": "Shaik Adnan Hyder",
        "role": "Platform Engineering & UI Lead",
        "bio": "Undergraduate engineer contributing to responsive UI design, frontend architecture, and interactive campaign media presentation.",
        "roleCategory": "frontend",
        "skills": ["React", "TypeScript", "Tailwind CSS", "Vite"],
        "avatarUrl": "",
        "githubUrl": "",
        "linkedinUrl": "",
        "otherUrl": "",
        "departmentOrAffiliation": "Computer Science & Engineering, MJCET",
        "featured": True,
        "displayOrder": 2,
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
    },
    {
        "id": "dev-03",
        "fullName": "Ayesha Siddiqua",
        "role": "UI/UX Designer & Accessibility Lead",
        "bio": "Human-centered design practitioner focused on WCAG AA accessibility, institutional aesthetics, and seamless mobile interactions.",
        "roleCategory": "design",
        "skills": ["Figma", "UI/UX Design", "Design Systems", "Accessibility (a11y)"],
        "avatarUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
        "githubUrl": "",
        "linkedinUrl": "https://linkedin.com/in/ayesha-siddiqua",
        "otherUrl": "",
        "departmentOrAffiliation": "Information Technology, MJCET",
        "featured": True,
        "displayOrder": 3,
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
    },
    {
        "id": "dev-04",
        "fullName": "Farhan Ahmed",
        "role": "Backend & Cloud Infrastructure Engineer",
        "bio": "Backend systems engineer with expertise in asynchronous Python APIs, database indexing, and secure token lifecycle enforcement.",
        "roleCategory": "backend",
        "skills": ["FastAPI", "Python", "MongoDB Atlas", "Docker", "REST APIs"],
        "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
        "githubUrl": "https://github.com/farhan-ahmed",
        "linkedinUrl": "https://linkedin.com/in/farhan-ahmed",
        "otherUrl": "",
        "departmentOrAffiliation": "Computer Science & Engineering, MJCET",
        "featured": True,
        "displayOrder": 4,
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
    },
    {
        "id": "dev-05",
        "fullName": "Zainab Fatima",
        "role": "Curriculum Researcher & Content Strategist",
        "bio": "NSS volunteer researcher collaborating with clinical practitioners to verify evidence-based substance education content.",
        "roleCategory": "research",
        "skills": ["Curriculum Design", "Clinical Fact-Checking", "Content Strategy"],
        "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
        "githubUrl": "",
        "linkedinUrl": "https://linkedin.com/in/zainab-fatima",
        "otherUrl": "",
        "departmentOrAffiliation": "Civil Engineering & NSS Editorial Board, MJCET",
        "featured": True,
        "displayOrder": 5,
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
    },
    {
        "id": "dev-06",
        "fullName": "Dr. M. A. Quadri",
        "role": "Faculty Advisor & NSS Program Officer",
        "bio": "Professor and Institutional Program Officer providing administrative guidance, clinical review oversight, and institutional support.",
        "roleCategory": "mentorship",
        "skills": ["Institutional Leadership", "Public Health Advocacy", "Program Coordination"],
        "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
        "githubUrl": "",
        "linkedinUrl": "",
        "otherUrl": "",
        "departmentOrAffiliation": "Faculty of Engineering, MJCET",
        "featured": True,
        "displayOrder": 6,
        "publicationStatus": "published",
        "createdAt": NOW_ISO,
    },
]

INITIAL_QUIZ_QUESTIONS = [
    {
        "id": "q1",
        "text": "What is the primary neurochemical mechanism responsible for chemical habituation and craving in substance dependency?",
        "category": "substance_risks",
        "type": "single",
        "options": [
            {"id": "q1_o1", "text": "Temporary suppression of red blood cell hemoglobin synthesis"},
            {"id": "q1_o2", "text": "Supra-physiological dopamine surges in the mesolimbic reward pathway followed by receptor downregulation"},
            {"id": "q1_o3", "text": "Immediate permanent breakdown of peripheral nerve myelin sheaths"},
            {"id": "q1_o4", "text": "Selective elevation of thyroid-stimulating hormones in skeletal muscle"},
        ],
        "correctAnswerIds": ["q1_o2"],
        "explanation": "Addictive substances stimulate unnatural surges of dopamine in the nucleus accumbens. The brain adapts by downregulating dopamine receptors, causing tolerance and chronic cravings.",
        "points": 10,
        "displayOrder": 1,
        "publicationStatus": "published",
    },
    {
        "id": "q2",
        "text": "True or False: Addiction is medically recognized as a chronic treatable medical condition rather than an innate failure of personal willpower.",
        "category": "myths_and_facts",
        "type": "boolean",
        "options": [
            {"id": "q2_true", "text": "True"},
            {"id": "q2_false", "text": "False"},
        ],
        "correctAnswerIds": ["q2_true"],
        "explanation": "The World Health Organization (WHO) and Indian Council of Medical Research (ICMR) classify substance use disorder as a neurobiological health condition requiring clinical and behavioral support.",
        "points": 10,
        "displayOrder": 2,
        "publicationStatus": "published",
    },
    {
        "id": "q3",
        "text": "Which of the following communication techniques exemplifies assertive refusal agency when confronting peer pressure?",
        "category": "peer_pressure",
        "type": "single",
        "options": [
            {"id": "q3_o1", "text": "Agreeing outwardly but attempting to discard the beverage secretly"},
            {"id": "q3_o2", "text": "Clear, direct, unhurried refusal with calm eye contact without moralizing or aggressive defensiveness"},
            {"id": "q3_o3", "text": "Insulting the peer who extended the invitation to display dominance"},
            {"id": "q3_o4", "text": "Fabricating intricate medical emergencies to rationalize stepping away"},
        ],
        "correctAnswerIds": ["q3_o2"],
        "explanation": "Assertive refusal focuses on firm, calm, and respectful boundary-setting without aggressive counter-attacks or excessive apologizing.",
        "points": 10,
        "displayOrder": 3,
        "publicationStatus": "published",
    },
    {
        "id": "q4",
        "text": "During exam stress, which non-chemical coping mechanisms scientifically stimulate natural dopamine and endorphin synthesis?",
        "category": "healthy_coping",
        "type": "multiple",
        "options": [
            {"id": "q4_o1", "text": "High-intensity cardiovascular exercise and rhythmic campus jogging"},
            {"id": "q4_o2", "text": "Structured restorative sleep (7–9 hours) supporting circadian dopamine replenishment"},
            {"id": "q4_o3", "text": "Excessive consumption of over-the-counter stimulant energy beverages"},
            {"id": "q4_o4", "text": "Creative expression, acoustic music, and team sports engagement"},
        ],
        "correctAnswerIds": ["q4_o1", "q4_o2", "q4_o4"],
        "explanation": "Exercise, sleep hygiene, and social/creative activities naturally stimulate neurotransmitter balance without neurotoxic crashes or tolerance cycles.",
        "points": 10,
        "displayOrder": 4,
        "publicationStatus": "published",
    },
    {
        "id": "q5",
        "text": "When you observe a classmate exhibiting sudden withdrawal, irregular attendance, and agitation, what is the safest initial peer response?",
        "category": "seeking_help",
        "type": "single",
        "options": [
            {"id": "q5_o1", "text": "Confront them aggressively in a crowded classroom to force acknowledgment"},
            {"id": "q5_o2", "text": "Initiate a private, non-judgmental check-in expressing compassionate concern and offer to connect them to confidential student support"},
            {"id": "q5_o3", "text": "Share rumors on student social media groups to notify their peer network"},
            {"id": "q5_o4", "text": "Ignore the observation completely to respect absolute personal detachment"},
        ],
        "correctAnswerIds": ["q5_o2"],
        "explanation": "Non-judgmental, one-on-one check-ins build psychological safety, encouraging the individual to seek professional support.",
        "points": 10,
        "displayOrder": 5,
        "publicationStatus": "published",
    },
    {
        "id": "q6",
        "text": "What is the official 24/7 toll-free National De-addiction Helpline number operated across India under the Ministry of Social Justice and Empowerment?",
        "category": "campaign_goals",
        "type": "single",
        "options": [
            {"id": "q6_o1", "text": "100"},
            {"id": "q6_o2", "text": "14446"},
            {"id": "q6_o3", "text": "1098"},
            {"id": "q6_o4", "text": "1900"},
        ],
        "correctAnswerIds": ["q6_o2"],
        "explanation": "14446 is the official national 24x7 toll-free helpline for substance abuse counseling, rehabilitation guidance, and crisis intervention.",
        "points": 10,
        "displayOrder": 6,
        "publicationStatus": "published",
    },
    {
        "id": "q7",
        "text": "What critical biological risk is associated with modern high-potency synthetic drugs and unregulated e-cigarette liquids?",
        "category": "substance_risks",
        "type": "single",
        "options": [
            {"id": "q7_o1", "text": "Unpredictable adulteration, lethal synthetic fentanyl contamination, and severe respiratory injury"},
            {"id": "q7_o2", "text": "Gradual improvement of visual acuity during late night study sessions"},
            {"id": "q7_o3", "text": "Temporary enhancement of tooth enamel calcification"},
            {"id": "q7_o4", "text": "Total immunity against seasonal viral fevers"},
        ],
        "correctAnswerIds": ["q7_o1"],
        "explanation": "Unregulated synthetics and modern vapes pose severe risks of acute chemical poisoning, unknown toxic adulterants, and rapid physical dependence.",
        "points": 10,
        "displayOrder": 7,
        "publicationStatus": "published",
    },
    {
        "id": "q8",
        "text": "What core mission underpins the Nasha Mukt Bharat Abhiyaan initiative launched by the Government of India across vulnerable educational hubs?",
        "category": "campaign_goals",
        "type": "multiple",
        "options": [
            {"id": "q8_o1", "text": "Community-led youth awareness and peer counseling in colleges"},
            {"id": "q8_o2", "text": "Dismantling addiction stigma to promote timely medical treatment"},
            {"id": "q8_o3", "text": "Replacing college physical education with mandatory silent meditation"},
            {"id": "q8_o4", "text": "Fostering institutional environments of zero substance tolerance with robust care pathways"},
        ],
        "correctAnswerIds": ["q8_o1", "q8_o2", "q8_o4"],
        "explanation": "NMBA combines prevention education, stigma reduction, and accessible healthcare to build resilient campus environments nationwide.",
        "points": 10,
        "displayOrder": 8,
        "publicationStatus": "published",
    },
]

INITIAL_AWARENESS_MESSAGES = [
    {
        "id": "msg-01",
        "title": "Your Choices Shape Your Future",
        "body": "Chemical substances promise temporary relief but systematically compromise clarity, agency, and health. True strength lies in conscious choices, supportive friendships, and seeking guidance when life gets overwhelming.",
        "category": "Harm Reduction & Prevention",
        "callToAction": "Explore Verified Campus Care Pathways",
        "resourceLink": "/support",
        "publicationStatus": "published",
        "displayOrder": 1,
        "createdAt": NOW_ISO,
    },
    {
        "id": "msg-02",
        "title": "Support Without Stigma: You Are Never Alone",
        "body": "Substance dependency is a treatable health condition, not a moral failure. If you or someone you care about is struggling, reaching out is an act of courageous leadership. Confidential, non-judgmental assistance is available 24/7.",
        "category": "Peer Support & Compassion",
        "callToAction": "Call National Toll-Free Helpline: 14446",
        "resourceLink": "/support",
        "publicationStatus": "published",
        "displayOrder": 2,
        "createdAt": NOW_ISO,
    },
    {
        "id": "msg-03",
        "title": "Healthy Minds Build Resilient Engineers",
        "body": "Academic pressure is real, but healthy coping mechanisms — consistent sleep, regular exercise, team sports, and creative hobbies — fuel lasting vitality. Celebrate sobriety and lead the Nasha Mukt Bharat movement on your campus.",
        "category": "Youth Leadership & Wellness",
        "callToAction": "Read Our Awareness Curriculum",
        "resourceLink": "/awareness",
        "publicationStatus": "published",
        "displayOrder": 3,
        "createdAt": NOW_ISO,
    },
]


async def seed_database() -> None:
    """Executes idempotent upsert operations for all collections."""
    logger.info("Connecting to MongoDB Atlas for migration seeder...")
    client = AsyncIOMotorClient(settings.MONGODB_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
    db = client[settings.DATABASE_NAME]

    try:
        # 1. Create indexes
        await create_indexes(db)

        # 2. Seed Super Admin Users
        for user in INITIAL_SUPER_ADMINS:
            await db["admin_users"].update_one(
                {"email": user["email"]},
                {"$set": user},
                upsert=True,
            )
        logger.info(f"Seeded {len(INITIAL_SUPER_ADMINS)} Admin User(s).")

        # 3. Seed Activities
        for act in INITIAL_ACTIVITIES:
            await db["activities"].update_one(
                {"id": act["id"]},
                {"$set": act},
                upsert=True,
            )
        logger.info(f"Seeded {len(INITIAL_ACTIVITIES)} Activities.")

        # 4. Seed Gallery Photos
        for photo in INITIAL_GALLERY:
            await db["gallery_photos"].update_one(
                {"id": photo["id"]},
                {"$set": photo},
                upsert=True,
            )
        logger.info(f"Seeded {len(INITIAL_GALLERY)} Gallery Photos.")

        # 5. Seed Developers
        for dev in INITIAL_DEVELOPERS:
            await db["developers"].update_one(
                {"id": dev["id"]},
                {"$set": dev},
                upsert=True,
            )
        logger.info(f"Seeded {len(INITIAL_DEVELOPERS)} Developers.")

        # 6. Seed Quiz Questions
        for q in INITIAL_QUIZ_QUESTIONS:
            await db["quiz_questions"].update_one(
                {"id": q["id"]},
                {"$set": q},
                upsert=True,
            )
        logger.info(f"Seeded {len(INITIAL_QUIZ_QUESTIONS)} Quiz Questions.")

        # 7. Seed Awareness Messages
        for msg in INITIAL_AWARENESS_MESSAGES:
            await db["awareness_messages"].update_one(
                {"id": msg["id"]},
                {"$set": msg},
                upsert=True,
            )
        logger.info(f"Seeded {len(INITIAL_AWARENESS_MESSAGES)} End-of-Quiz Awareness Messages.")

        # 8. Seed Site Settings
        default_settings = {
            "key": "global_config",
            "siteTitle": "NSS MJCET Nasha Mukti Abhiyaan",
            "institutionName": "Muffakham Jah College of Engineering & Technology",
            "campaignTagline": "Youth Substance Awareness, Prevention & Resilience",
            "contactEmail": "nss@mjcet.ac.in",
            "helplineNumber": "14446",
            "updatedAt": NOW_ISO,
        }
        await db["site_settings"].update_one(
            {"key": "global_config"},
            {"$set": default_settings},
            upsert=True,
        )
        logger.info("Seeded Site Settings.")

        logger.info("Database migration completed successfully!")

    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
