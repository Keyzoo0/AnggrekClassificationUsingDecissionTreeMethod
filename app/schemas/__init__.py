from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    success: bool
    uploaded_count: int
    skipped: list[dict] = []
    total: dict


class TrainRequest(BaseModel):
    max_depth: int = Field(5, ge=2, le=15)
    criterion: str = Field("gini")
    test_size: float = Field(0.2, ge=0.1, le=0.4)
    min_samples_split: int = Field(4, ge=2, le=20)
    min_samples_leaf: int = Field(2, ge=1, le=10)
