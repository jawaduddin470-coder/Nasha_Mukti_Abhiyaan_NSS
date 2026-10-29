"""
Quiz Questions & Attempts Pydantic Schemas
NSS MJCET Nasha Mukti Abhiyaan
"""

from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field, EmailStr, model_validator


class QuizOption(BaseModel):
    id: str
    text: str


class QuizQuestionBase(BaseModel):
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
