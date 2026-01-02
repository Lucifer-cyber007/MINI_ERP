from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.sales_order import SalesOrder
from app.models.sales_order_line import SalesOrderLine
from app.schemas.sales_order import SalesOrderCreate, SalesOrderResponse
from app.services.order_service import confirm_order, cancel_order
from app.utils.enums import OrderStatus

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=SalesOrderResponse)
def create_order(order_data: SalesOrderCreate, db: Session = Depends(get_db)):
    """Create a new sales order in DRAFT status"""
    # Calculate total amount
    total = sum(line.quantity * line.unit_price for line in order_data.lines)
    
    # Create order
    new_order = SalesOrder(
        customer_id=order_data.customer_id,
        status=OrderStatus.DRAFT,
        total_amount=total
    )
    db.add(new_order)
    db.flush()  # Get the order ID
    
    # Create order lines
    for line_data in order_data.lines:
        line_total = line_data.quantity * line_data.unit_price
        order_line = SalesOrderLine(
            order_id=new_order.id,
            product_id=line_data.product_id,
            quantity=line_data.quantity,
            unit_price=line_data.unit_price,
            line_total=line_total
        )
        db.add(order_line)
    
    db.commit()
    db.refresh(new_order)
    return new_order


@router.get("/", response_model=list[SalesOrderResponse])
def list_orders(db: Session = Depends(get_db)):
    """List all sales orders"""
    return db.query(SalesOrder).all()


@router.get("/{order_id}", response_model=SalesOrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get a specific sales order by ID"""
    order = db.query(SalesOrder).filter(SalesOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/{order_id}/confirm")
def confirm_sales_order(order_id: int, db: Session = Depends(get_db)):
    """Confirm an order (DRAFT → CONFIRMED) and reduce inventory"""
    try:
        order = confirm_order(db, order_id)
        return {"message": "Order confirmed", "order_id": order.id, "status": order.status}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{order_id}/cancel")
def cancel_sales_order(order_id: int, db: Session = Depends(get_db)):
    """Cancel an order (CONFIRMED → CANCELLED) and restore inventory"""
    try:
        order = cancel_order(db, order_id)
        return {"message": "Order cancelled", "order_id": order.id, "status": order.status}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
