from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerResponse

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.post("/", response_model=CustomerResponse)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    try:
        new_customer = Customer(**customer.model_dump())
        db.add(new_customer)
        db.commit()
        db.refresh(new_customer)
        return new_customer
    except IntegrityError as e:
        db.rollback()
        # Check if it's a duplicate email error
        if "customers_email_key" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail=f"A customer with email '{customer.email}' already exists."
            )
        # Handle other integrity errors
        raise HTTPException(
            status_code=400,
            detail="Unable to create customer due to a data constraint violation."
        )


@router.get("/", response_model=list[CustomerResponse])
def list_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()
