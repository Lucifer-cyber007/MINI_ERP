from sqlalchemy import Column, Integer, ForeignKey, DateTime, Numeric, String
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class SalesOrder(Base):
    __tablename__ = "sales_orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    order_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), nullable=False)
    total_amount = Column(Numeric(10, 2), default=0)

    customer = relationship("Customer")
    lines = relationship(
        "SalesOrderLine",
        back_populates="order",
        cascade="all, delete-orphan"
    )
