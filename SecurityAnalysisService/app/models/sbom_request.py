from pydantic import BaseModel

class SbomRequest(BaseModel):
    sbom: dict