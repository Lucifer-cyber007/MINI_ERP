# 🏢 Mini ERP - Sales & Inventory Management System

A complete, production-ready ERP system built with **FastAPI**, **PostgreSQL**, and **SQLAlchemy ORM**, demonstrating real-world business workflows similar to **Odoo**.

---

## 📌 Project Overview

This Mini ERP system implements core business modules found in enterprise resource planning software:

- **Product Management** - Manage product catalog with pricing and inventory
- **Customer Management** - Maintain customer records
- **Sales Order Management** - Create and manage sales orders with workflow states
- **Inventory Management** - Automatic stock updates based on order confirmations

### 🎯 Key Features

✅ **ORM-Driven Architecture** - SQLAlchemy models with relationships and cascades  
✅ **Business Workflow Engine** - Order state transitions (DRAFT → CONFIRMED → CANCELLED)  
✅ **Inventory Automation** - Stock reduces on confirmation, restores on cancellation  
✅ **Data Validation** - Prevents negative stock and invalid state transitions  
✅ **Clean Architecture** - Separation of concerns (models, schemas, services, routes)  
✅ **RESTful API** - Proper HTTP methods and status codes  
✅ **Modern Frontend** - Responsive HTML/CSS/JS interface with real-time updates

---

## 🏗️ Architecture

This project follows **Odoo-style layered architecture**:

```
┌─────────────────────────────────────┐
│         Frontend (HTML/JS)          │
├─────────────────────────────────────┤
│       API Layer (FastAPI)           │
├─────────────────────────────────────┤
│    Business Logic (Services)        │
├─────────────────────────────────────┤
│      ORM Layer (SQLAlchemy)         │
├─────────────────────────────────────┤
│      Database (PostgreSQL)          │
└─────────────────────────────────────┘
```

### Why This Architecture?

1. **Separation of Concerns** - Each layer has a single responsibility
2. **Testability** - Business logic is isolated and testable
3. **Maintainability** - Changes in one layer don't affect others
4. **Scalability** - Easy to add new modules following the same pattern

---

## 📁 Project Structure

```
mini_erp/
│
├── app/
│   ├── main.py                    # FastAPI application entry point
│   ├── database.py                # Database connection and session management
│   │
│   ├── models/                    # SQLAlchemy ORM models
│   │   ├── product.py
│   │   ├── customer.py
│   │   ├── sales_order.py
│   │   └── sales_order_line.py
│   │
│   ├── schemas/                   # Pydantic validation schemas
│   │   ├── product.py
│   │   ├── customer.py
│   │   └── sales_order.py
│   │
│   ├── services/                  # Business logic layer
│   │   ├── inventory_service.py   # Stock management logic
│   │   └── order_service.py       # Order workflow logic
│   │
│   ├── routes/                    # API endpoints
│   │   ├── product_routes.py
│   │   ├── customer_routes.py
│   │   └── order_routes.py
│   │
│   └── utils/
│       └── enums.py               # Order status enumeration
│
├── frontend/
│   ├── index.html                 # Main UI
│   ├── styles.css                 # Modern dark theme styling
│   └── app.js                     # Frontend logic and API calls
│
├── requirements.txt               # Python dependencies
├── .env                           # Database configuration
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────────┐         ┌─────────────────────┐
│   Customer   │         │   Sales Order    │         │  Sales Order Line   │
├──────────────┤         ├──────────────────┤         ├─────────────────────┤
│ id (PK)      │◄────────│ id (PK)          │◄────────│ id (PK)             │
│ name         │         │ customer_id (FK) │         │ order_id (FK)       │
│ email        │         │ order_date       │         │ product_id (FK)     │
│ phone        │         │ status           │         │ quantity            │
└──────────────┘         │ total_amount     │         │ unit_price          │
                         └──────────────────┘         │ line_total          │
                                                      └─────────────────────┘
                                                               │
                                                               │
                         ┌──────────────┐                     │
                         │   Product    │◄────────────────────┘
                         ├──────────────┤
                         │ id (PK)      │
                         │ name         │
                         │ price        │
                         │ stock_qty    │
                         │ is_active    │
                         └──────────────┘
```

### Why PostgreSQL?

- **ACID Compliance** - Critical for inventory consistency
- **Relational Integrity** - Foreign keys ensure data consistency
- **Concurrent Transactions** - Multiple users can work simultaneously
- **Production-Ready** - Used in real ERP systems like Odoo

---

## 🚀 Setup Instructions

### Prerequisites

- Python 3.10+
- PostgreSQL 12+
- Git

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd mini_erp
```

### Step 2: Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Database

Create a PostgreSQL database:

```sql
CREATE DATABASE mini_erp;
```

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/mini_erp
```

Replace `username` and `password` with your PostgreSQL credentials.

### Step 5: Run the Backend

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Step 6: Open the Frontend

Open `frontend/index.html` in your browser, or serve it with:

```bash
# Using Python's built-in server
cd frontend
python -m http.server 8080
```

Then visit `http://localhost:8080`

---

## 📊 Business Workflow

### Sales Order Lifecycle

```
┌─────────┐    confirm_order()    ┌───────────┐    cancel_order()    ┌───────────┐
│  DRAFT  │ ──────────────────► │ CONFIRMED │ ──────────────────► │ CANCELLED │
└─────────┘                       └───────────┘                       └───────────┘
     │                                  │                                  │
     │                                  │                                  │
     └─ No stock change                 └─ Stock reduced                  └─ Stock restored
```

### Business Rules

1. **Order Creation**
   - Orders are created in `DRAFT` status
   - Multiple products can be added to one order
   - Total amount is calculated automatically

2. **Order Confirmation**
   - Only `DRAFT` orders can be confirmed
   - System validates stock availability for all products
   - If stock is sufficient, order moves to `CONFIRMED` and stock is reduced
   - If stock is insufficient, order remains `DRAFT` and error is returned

3. **Order Cancellation**
   - Only `CONFIRMED` orders can be cancelled
   - Stock is restored for all products in the order
   - Order moves to `CANCELLED` status

4. **Inventory Consistency**
   - Stock changes are transactional (all-or-nothing)
   - Prevents negative stock situations
   - Maintains data integrity through database constraints

---

## 🔌 API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products/` | Create a new product |
| GET | `/products/` | List all products |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customers/` | Create a new customer |
| GET | `/customers/` | List all customers |

### Sales Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders/` | Create a new order (DRAFT) |
| GET | `/orders/` | List all orders |
| GET | `/orders/{id}` | Get specific order details |
| POST | `/orders/{id}/confirm` | Confirm order (reduce stock) |
| POST | `/orders/{id}/cancel` | Cancel order (restore stock) |

### Example API Calls

**Create a Product:**
```bash
curl -X POST http://localhost:8000/products/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "stock_quantity": 50
  }'
```

**Create a Sales Order:**
```bash
curl -X POST http://localhost:8000/orders/ \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "lines": [
      {"product_id": 1, "quantity": 2, "unit_price": 999.99}
    ]
  }'
```

**Confirm an Order:**
```bash
curl -X POST http://localhost:8000/orders/1/confirm
```

---

## 🧪 Testing Scenarios

### Scenario 1: Successful Order Flow

1. Create a product with stock = 10
2. Create a customer
3. Create an order for 5 units (status: DRAFT)
4. Confirm the order → Stock becomes 5, status: CONFIRMED
5. Cancel the order → Stock restored to 10, status: CANCELLED

### Scenario 2: Insufficient Stock

1. Create a product with stock = 3
2. Create an order for 5 units (status: DRAFT)
3. Try to confirm → **Error: Insufficient stock**
4. Order remains in DRAFT, stock unchanged

### Scenario 3: Invalid State Transition

1. Create and confirm an order
2. Try to confirm again → **Error: Only DRAFT orders can be confirmed**

---

## 🎓 Interview Talking Points

### How This Relates to Odoo

| Aspect | This Project | Odoo |
|--------|-------------|------|
| **ORM** | SQLAlchemy with declarative models | Odoo ORM with Model classes |
| **Workflows** | Order state machine (DRAFT/CONFIRMED/CANCELLED) | Odoo's state fields and workflow engine |
| **Business Logic** | Service layer (order_service, inventory_service) | Odoo's business logic in model methods |
| **API** | FastAPI REST endpoints | Odoo's RPC/JSON-RPC API |
| **Relationships** | SQLAlchemy relationships | Odoo's Many2one, One2many fields |
| **Validation** | Pydantic schemas + service validations | Odoo's @api.constrains decorators |

### Key Technical Concepts

1. **ORM Benefits**
   - Database-agnostic code
   - Automatic SQL generation
   - Relationship management
   - Migration support

2. **Service Layer Pattern**
   - Encapsulates business logic
   - Reusable across different interfaces (API, CLI, etc.)
   - Easier to test and maintain

3. **Transaction Management**
   - Database commits only after all validations pass
   - Rollback on errors maintains consistency

4. **State Machine Pattern**
   - Controlled transitions between states
   - Prevents invalid operations
   - Audit trail of status changes

### What Could Be Extended?

If this were a full ERP system, we could add:

- **Invoicing Module** - Generate invoices from confirmed orders
- **Warehouse Management** - Multiple locations, stock moves
- **Purchase Orders** - Replenish inventory from suppliers
- **Reporting** - Sales analytics, inventory reports
- **User Authentication** - Role-based access control
- **Audit Logging** - Track all changes for compliance
- **Email Notifications** - Alert customers on order status
- **Payment Integration** - Process payments for orders

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Modern, fast web framework for building APIs |
| **SQLAlchemy** | SQL toolkit and ORM for Python |
| **PostgreSQL** | Production-grade relational database |
| **Pydantic** | Data validation using Python type hints |
| **Uvicorn** | ASGI server for running FastAPI |
| **HTML/CSS/JS** | Frontend user interface |

---

## 📝 Code Quality Features

- ✅ Type hints throughout the codebase
- ✅ Docstrings for all functions
- ✅ Proper error handling with meaningful messages
- ✅ Consistent naming conventions
- ✅ Modular design for easy extension
- ✅ Environment-based configuration
- ✅ Git version control ready

---

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is open-source and available for educational purposes.

---

## 👤 Author

**Your Name**  
Aspiring Odoo Software Developer  

*This project demonstrates my understanding of ERP systems, ORM-based development, and clean architecture principles.*

---

## 🔗 Links

- **API Documentation**: `http://localhost:8000/docs` (when running)
- **GitHub Repository**: [Your Repo URL]
- **LinkedIn**: [Your Profile]

---

**Built with ❤️ for learning and showcasing ERP development skills**
