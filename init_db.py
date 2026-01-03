"""
Database initialization script for Mini ERP
Run this script to create the database tables
"""
from app.database import Base, engine
from app.models.product import Product
from app.models.customer import Customer
from app.models.sales_order import SalesOrder
from app.models.sales_order_line import SalesOrderLine

def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
