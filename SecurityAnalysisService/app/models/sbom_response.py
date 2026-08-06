from pydantic import BaseModel

class SbomResponse(BaseModel):
    componentCount: int
    riskScore: int
    packages: list[dict]