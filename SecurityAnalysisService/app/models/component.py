from pydantic import BaseModel

class Component(BaseModel):
    name: str | None = None
    version: str | None = None
    purl: str | None = None
    type: str | None = None