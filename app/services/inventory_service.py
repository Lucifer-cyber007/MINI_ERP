from sqlalchemy.orm import Session
from app.models.product import Product

def check_stock(db: Session, product_id: int, required_qty: int):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise ValueError("Product not found")

    if product.stock_quantity < required_qty:
        raise ValueError(
            f"Insufficient stock for product {product.name}. "
            f"Available: {product.stock_quantity}, Required: {required_qty}"
        )

def reduce_stock(db: Session, product_id: int, qty: int):
    product = db.query(Product).filter(Product.id == product_id).first()
    product.stock_quantity -= qty
    db.add(product)

def restore_stock(db: Session, product_id: int, qty: int):
    product = db.query(Product).filter(Product.id == product_id).first()
    product.stock_quantity += qty
    db.add(product)
