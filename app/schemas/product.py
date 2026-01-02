from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    price: float
    stock_quantity: int
    is_active: Optional[bool] = True


class ProductResponse(ProductCreate):
    id: int

    class Config:
        from_attributes = True
