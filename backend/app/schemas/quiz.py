"""
Quiz Questions & Attempts Pydantic Schemas
NSS MJCET Nasha Mukti Abhiyaan
"""

from typing import List, Dict, Optional, Literal, Any
from pydantic import BaseModel, Field, model_validator
try:
    from pydantic import EmailStr
except Exception:
    EmailStr = str


class QuizOption(BaseModel):
    id: str
    text: str


class QuizConfigItem(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    badge: str
    estimatedMinutes: int
    status: Literal["active", "upcoming", "disabled"]
    theme: Literal["awareness", "unity"]
    passingScorePercentage: int = 70
    timeLimitMinutes: int = 15
    questionCount: int = 0
    totalPoints: int = 0


class QuizConfigUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    badge: Optional[str] = None
    estimatedMinutes: Optional[int] = None
    status: Optional[Literal["active", "upcoming", "disabled"]] = None
    passingScorePercentage: Optional[int] = None
    timeLimitMinutes: Optional[int] = None


class QuizQuestionBase(BaseModel):
    quizId: str = "nmba-awareness-challenge-v1"
    text: str
    category: str
    type: Literal["single", "multiple", "boolean"]
    options: List[QuizOption]
    points: int = 1
    displayOrder: int = 1
    publicationStatus: Literal["draft", "published", "archived"] = "published"


class QuizQuestionCreate(QuizQuestionBase):
    correctAnswerIds: List[str]
    explanation: str

    @model_validator(mode="after")
    def validate_question_structure(self):
        if not self.options or len(self.options) < 2:
            raise ValueError("A quiz question must provide at least two answer options.")

        option_ids = {opt.id for opt in self.options}
        for cid in self.correctAnswerIds:
            if cid not in option_ids:
                raise ValueError(f"Correct answer '{cid}' does not match any valid option ID.")

        if self.type == "single":
            if len(self.correctAnswerIds) != 1:
                raise ValueError("Single-choice questions must have exactly one correct answer.")
        elif self.type == "boolean":
            if len(self.options) != 2:
                raise ValueError("Boolean (True/False) questions must have exactly two options.")
            if len(self.correctAnswerIds) != 1:
                raise ValueError("Boolean questions must have exactly one correct answer.")
        elif self.type == "multiple":
            if len(self.correctAnswerIds) < 1:
                raise ValueError("Multiple-choice questions must specify at least one correct answer.")

        return self


class QuizQuestionUpdate(BaseModel):
    quizId: Optional[str] = None
    text: Optional[str] = None
    category: Optional[str] = None
    type: Optional[Literal["single", "multiple", "boolean"]] = None
    options: Optional[List[QuizOption]] = None
    points: Optional[int] = None
    correctAnswerIds: Optional[List[str]] = None
    explanation: Optional[str] = None
    displayOrder: Optional[int] = None
    publicationStatus: Optional[Literal["draft", "published", "archived"]] = None

    @model_validator(mode="after")
    def validate_update_structure(self):
        if self.options is not None and len(self.options) < 2:
            raise ValueError("A quiz question must provide at least two answer options.")

        if self.options is not None and self.correctAnswerIds is not None:
            option_ids = {opt.id for opt in self.options}
            for cid in self.correctAnswerIds:
                if cid not in option_ids:
                    raise ValueError(f"Correct answer '{cid}' does not match any option ID.")

            q_type = self.type or "single"
            if q_type == "single" and len(self.correctAnswerIds) != 1:
                raise ValueError("Single-choice questions must have exactly one correct answer.")
            elif q_type == "boolean" and (len(self.options) != 2 or len(self.correctAnswerIds) != 1):
                raise ValueError("Boolean questions must have two options and exactly one correct answer.")
            elif q_type == "multiple" and len(self.correctAnswerIds) < 1:
                raise ValueError("Multiple-choice questions must specify at least one correct answer.")

        return self


class QuizQuestionPublicResponse(QuizQuestionBase):
    id: str


class QuizQuestionAdminResponse(QuizQuestionBase):
    id: str
    correctAnswerIds: List[str]
    explanation: str
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class ParticipantData(BaseModel):
    fullName: str
    email: EmailStr
    institutionName: str
    rollNumber: Optional[str] = ""
    phone: Optional[str] = ""
    department: str
    yearOfStudy: str
    consentDataProcessing: bool = True


class QuizAttemptSubmit(BaseModel):
    quizId: str
    participant: ParticipantData
    userAnswers: Dict[str, List[str]]
    timeTakenSeconds: Optional[int] = None


class QuestionBreakdownItem(BaseModel):
    questionId: str
    questionText: str
    category: str
    type: str
    points: int
    earnedPoints: int
    selectedOptionIds: List[str]
    correctOptionIds: List[str]
    isCorrect: bool
    options: List[QuizOption]
    explanation: str


class QuizAttemptResult(BaseModel):
    attemptId: str
    quizId: str
    participantName: str
    participantInstitution: str
    submittedAt: str
    score: int
    maxScore: int
    percentage: int
    passed: bool
    totalQuestions: int
    correctCount: int
    incorrectCount: int
    badgeName: str
    badgeDescription: str
    summaryMessage: str
    questionBreakdown: List[QuestionBreakdownItem]
    timeTakenSeconds: Optional[int] = None


# =========================================================================
# Quiz Leaderboard Schemas
# =========================================================================

class LeaderboardEntryPublic(BaseModel):
    rank: int
    attemptId: str
    participantName: str
    participantInstitution: str
    score: int
    maxScore: int
    percentage: int
    timeTakenSeconds: Optional[int] = None
    timeFormatted: str
    badgeName: str
    submittedAt: str
    completedQuizzes: Optional[List[str]] = None
    nashaMuktiScore: Optional[int] = None
    unityDayScore: Optional[int] = None
    quizzesAttemptedCount: Optional[int] = None


class LeaderboardPublicResponse(BaseModel):
    quizId: str
    quizTitle: str
    quizSlug: str
    isPublished: bool
    status: Literal["coming_soon", "published"]
    message: str
    supportingText: str
    announcementDate: Optional[str] = None
    customNote: Optional[str] = None
    showPublicNames: bool = True
    highlightTopThree: bool = True
    eligibilityRule: Optional[str] = "any"
    totalParticipants: int
    publishedAt: Optional[str] = None
    entries: List[LeaderboardEntryPublic] = []


class LeaderboardSummaryItem(BaseModel):
    quizId: str
    quizTitle: str
    quizSlug: str
    isPublished: bool
    status: Literal["coming_soon", "published"]
    totalParticipants: int
    announcementDate: Optional[str] = None


class LeaderboardEntryAdmin(BaseModel):
    rank: int
    attemptId: str
    participantName: str
    participantEmail: str
    participantInstitution: str
    rollNumber: Optional[str] = ""
    phone: Optional[str] = ""
    department: Optional[str] = ""
    yearOfStudy: Optional[str] = ""
    score: int
    maxScore: int
    percentage: int
    passed: bool
    timeTakenSeconds: Optional[int] = None
    timeFormatted: str
    badgeName: str
    submittedAt: str
    completedQuizzes: Optional[List[str]] = None
    nashaMuktiScore: Optional[int] = None
    unityDayScore: Optional[int] = None
    quizzesAttemptedCount: Optional[int] = None
    nashaMuktiAttemptId: Optional[str] = None
    unityDayAttemptId: Optional[str] = None


class LeaderboardAdminResponse(BaseModel):
    quizId: str
    quizTitle: str
    quizSlug: str
    isPublished: bool
    status: Literal["draft", "published"]
    publishedAt: Optional[str] = None
    publishedBy: Optional[str] = None
    announcementDate: Optional[str] = None
    showPublicNames: bool = True
    highlightTopThree: bool = True
    eligibilityRule: Optional[str] = "any"
    customNote: Optional[str] = None
    totalParticipants: int
    entries: List[LeaderboardEntryAdmin] = []
    stats: Dict[str, Any] = {}


class LeaderboardSettingsUpdate(BaseModel):
    announcementDate: Optional[str] = None
    showPublicNames: Optional[bool] = None
    highlightTopThree: Optional[bool] = None
    customNote: Optional[str] = None
    eligibilityRule: Optional[Literal["any", "both"]] = None


class AttemptOverrideRequest(BaseModel):
    score: Optional[int] = None
    timeTakenSeconds: Optional[int] = None
    participantName: Optional[str] = None
    notes: Optional[str] = None
