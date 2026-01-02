from pydantic import BaseModel
from typing import Optional

class CustomerCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None


class CustomerResponse(CustomerCreate):
    id: int

    class Config:
        from_attributes = True
