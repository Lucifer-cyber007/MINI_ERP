# 🏢 Mini ERP - Sales & Inventory Management System

A complete, production-ready ERP system built with **FastAPI**, **PostgreSQL**, **React**, and **SQLAlchemy ORM**, demonstrating real-world business workflows similar to **Odoo**.

![Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)

---

## 📌 Project Overview

This Mini ERP system implements core business modules found in enterprise resource planning software:

- **Product Management** - Manage product catalog with pricing and inventory
- **Customer Management** - Maintain customer records
- **Sales Order Management** - Create and manage sales orders with workflow states
- **Inventory Management** - Automatic stock updates based on order confirmations
- **Dashboard Analytics** - Real-time metrics and low stock alerts

### 🎯 Key Features

✅ **Modern React Frontend** - Professional UI with sidebar navigation and responsive design  
✅ **ORM-Driven Architecture** - SQLAlchemy models with relationships and cascades  
✅ **Business Workflow Engine** - Order state transitions (DRAFT → CONFIRMED → CANCELLED)  
✅ **Inventory Automation** - Stock reduces on confirmation, restores on cancellation  
✅ **Data Validation** - Prevents negative stock and invalid state transitions  
✅ **Clean Architecture** - Separation of concerns (models, schemas, services, routes)  
✅ **RESTful API** - Proper HTTP methods and status codes  
✅ **Real-time Updates** - Dynamic UI with instant feedback

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 12+
- Git

### Backend Setup

```bash
# Clone repository
git clone https://github.com/Lucifer-cyber007/MINI_ERP.git
cd MINI_ERP

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure database
# Create .env file with:
# DATABASE_URL=postgresql://username:password@localhost:5432/mini_erp

# Run backend
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`  
API Documentation: `http://localhost:8000/docs`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 🎨 Screenshots

### Dashboard Overview
- Metrics cards showing total products, customers, orders, and low stock alerts
- Recent sales orders table with status badges
- Inventory alerts section

### Sales Orders
- Create new orders with multiple product lines
- Confirm orders to reduce inventory
- Cancel orders to restore stock
- Real-time total calculation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│      Frontend (React + Vite)        │
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

---

## 📁 Project Structure

```
mini_erp/
├── app/                           # Backend
│   ├── main.py                    # FastAPI app + CORS
│   ├── database.py                # DB connection
│   ├── models/                    # SQLAlchemy models
│   ├── schemas/                   # Pydantic schemas
│   ├── services/                  # Business logic
│   ├── routes/                    # API endpoints
│   └── utils/                     # Utilities
├── frontend/                      # React Frontend
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API integration
│   │   ├── App.jsx                # Main app
│   │   └── main.jsx               # Entry point
│   ├── package.json
│   └── vite.config.js             # Vite config
├── requirements.txt
├── .env
└── README.md
```

---

## 🔌 API Endpoints

### Products
- `POST /products/` - Create product
- `GET /products/` - List all products

### Customers
- `POST /customers/` - Create customer
- `GET /customers/` - List all customers

### Sales Orders
- `POST /orders/` - Create order (DRAFT)
- `GET /orders/` - List all orders
- `GET /orders/{id}` - Get order details
- `POST /orders/{id}/confirm` - Confirm order (reduce stock)
- `POST /orders/{id}/cancel` - Cancel order (restore stock)

---

## 🔄 Business Workflow

### Order Lifecycle

```
┌─────────┐    confirm    ┌───────────┐    cancel    ┌───────────┐
│  DRAFT  │ ───────────► │ CONFIRMED │ ──────────► │ CANCELLED │
└─────────┘               └───────────┘              └───────────┘
     │                          │                          │
     └─ No stock change         └─ Stock reduced          └─ Stock restored
```

---

## 🛠️ Technologies Used

### Backend
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Production database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

---

## 🧪 Testing

### Manual Testing Flow

1. **Start Backend**: `uvicorn app.main:app --reload`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Create Product**: Add "Laptop" with price $999, stock 10
4. **Create Customer**: Add "John Doe"
5. **Create Order**: Select customer, add 3 laptops
6. **Confirm Order**: Stock reduces to 7
7. **Cancel Order**: Stock restores to 10

---

## 🎓 Interview Talking Points

### How This Relates to Odoo

| Aspect | This Project | Odoo |
|--------|-------------|------|
| **ORM** | SQLAlchemy declarative models | Odoo ORM with Model classes |
| **Workflows** | Order state machine | Odoo's workflow engine |
| **Business Logic** | Service layer | Model methods with decorators |
| **API** | FastAPI REST | XML-RPC / JSON-RPC |
| **Frontend** | React SPA | Odoo Web Client |

---

## 📝 Development

### Running in Development

```bash
# Backend (Terminal 1)
cd mini_erp
venv\Scripts\activate
uvicorn app.main:app --reload

# Frontend (Terminal 2)
cd mini_erp/frontend
npm run dev
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build

# Serve built files
npm run preview
```

---

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome!

---

## 📄 License

This project is open-source and available for educational purposes.

---

## 👤 Author

**Lucifer-cyber007**  
Aspiring Odoo Software Developer

*This project demonstrates understanding of ERP systems, ORM-based development, and modern full-stack architecture.*

---

## 🔗 Links

- **Repository**: https://github.com/Lucifer-cyber007/MINI_ERP
- **API Docs**: http://localhost:8000/docs (when running)
- **Frontend**: http://localhost:5173 (when running)

---

**Built with ❤️ for learning and showcasing ERP development skills**
