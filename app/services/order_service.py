from sqlalchemy.orm import Session
from app.models.sales_order import SalesOrder
from app.models.sales_order_line import SalesOrderLine
from app.services.inventory_service import check_stock, reduce_stock, restore_stock
from app.utils.enums import OrderStatus

def confirm_order(db: Session, order_id: int):
    order = db.query(SalesOrder).filter(SalesOrder.id == order_id).first()

    if not order:
        raise ValueError("Order not found")

    if order.status != OrderStatus.DRAFT:
        raise ValueError("Only DRAFT orders can be confirmed")

    # 1️⃣ Validate stock
    for line in order.lines:
        check_stock(db, line.product_id, line.quantity)

    # 2️⃣ Reduce stock
    for line in order.lines:
        reduce_stock(db, line.product_id, line.quantity)

    # 3️⃣ Update order status
    order.status = OrderStatus.CONFIRMED

    db.add(order)
    db.commit()
    db.refresh(order)

    return order


def cancel_order(db: Session, order_id: int):
    order = db.query(SalesOrder).filter(SalesOrder.id == order_id).first()

    if not order:
        raise ValueError("Order not found")

    if order.status != OrderStatus.CONFIRMED:
        raise ValueError("Only CONFIRMED orders can be cancelled")

    # 1️⃣ Restore stock
    for line in order.lines:
        restore_stock(db, line.product_id, line.quantity)

    # 2️⃣ Update status
    order.status = OrderStatus.CANCELLED

    db.add(order)
    db.commit()
    db.refresh(order)

    return order
