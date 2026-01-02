from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Sales Order Line Schemas
class SalesOrderLineCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: float


class SalesOrderLineResponse(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    unit_price: float
    line_total: float

    class Config:
        from_attributes = True


# Sales Order Schemas
class SalesOrderCreate(BaseModel):
    customer_id: int
    lines: List[SalesOrderLineCreate]


class SalesOrderResponse(BaseModel):
    id: int
    customer_id: int
    order_date: datetime
    status: str
    total_amount: float
    lines: List[SalesOrderLineResponse]

    class Config:
        from_attributes = True
