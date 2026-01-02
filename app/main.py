from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes.order_routes import router as order_router
from app.routes.product_routes import router as product_router
from app.routes.customer_routes import router as customer_router

# Import models so SQLAlchemy registers them
from app.models.product import Product
from app.models.customer import Customer
from app.models.sales_order import SalesOrder
from app.models.sales_order_line import SalesOrderLine

# Create FastAPI app
app = FastAPI(title="Mini ERP System")

# Add CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

# Root health check
@app.get("/")
def root():
    return {"status": "Mini ERP backend running"}

# Register routers
app.include_router(order_router)
app.include_router(product_router)
app.include_router(customer_router)

