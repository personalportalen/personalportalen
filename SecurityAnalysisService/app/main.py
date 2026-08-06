from fastapi import FastAPI
from app.models.sbom_request import SbomRequest
from app.services.sbom_service import analyze_sbom

app = FastAPI(
    title="Security Analysis Service",
    version="1.0.0"
)

@app.get("/health")
async def health():
    return {
        "status": "ok"
    }

@app.post("/analyze-sbom")
async def analyze_sbom(request: SbomRequest):
    component_count = analyze_sbom(request.sbom)

    return {
        "componentCount": component_count
    }