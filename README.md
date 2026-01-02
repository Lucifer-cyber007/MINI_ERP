🧾 Mini ERP – Sales & Inventory Management System

A Mini ERP backend system inspired by Odoo-style architecture, built using FastAPI, PostgreSQL, and SQLAlchemy.
This project demonstrates real ERP workflows, not just CRUD operations.

🚀 Project Overview

This system implements core ERP modules:

Product Management

Customer Management

Sales Order Management

Inventory Management (workflow-driven)

The backend follows clean layered architecture with clear separation between:

Models (ORM)

Schemas (validation)

Services (business logic)

Routes (API layer)

Inventory updates are strictly controlled by order workflow states, similar to real ERP systems like Odoo.

🧠 Key ERP Concepts Implemented

ORM-driven relational data modeling

Workflow-based order lifecycle:

DRAFT → CONFIRMED → CANCELLED

Inventory updates only on confirmation

Stock restoration on cancellation

Prevention of negative stock

Business logic isolated in service layer

🛠 Tech Stack

Backend: FastAPI (Python 3.10+)

Database: PostgreSQL

ORM: SQLAlchemy

Frontend: HTML + Vanilla JavaScript

API Style: REST

Environment: Virtualenv

Version Control: Git + GitHub

📁 Project Structure
mini_erp/
│
├── app/
│   ├── main.py
│   ├── database.py
│   │
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── routes/
│   └── utils/
│
├── frontend/
│   ├── index.html
│   └── app.js
│
├── requirements.txt
├── README.md
└── .gitignore

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/Lucifer-cyber007/MINI_ERP.git
cd MINI_ERP

2️⃣ Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

3️⃣ Install dependencies
pip install -r requirements.txt

4️⃣ PostgreSQL setup

Create a database:

CREATE DATABASE mini_erp;


Create a .env file in project root:

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/mini_erp

5️⃣ Run the backend
uvicorn app.main:app --reload


Open API docs:

http://127.0.0.1:8000/docs

6️⃣ Run the frontend

Open:

frontend/index.html


in your browser (backend must be running).

📌 API Endpoints (Implemented)
Products

POST /products

GET /products

Customers

POST /customers

GET /customers

Sales Orders

POST /orders

POST /orders/{id}/confirm

POST /orders/{id}/cancel

🔄 ERP Workflow Explained
🟡 Create Order

Order is created in DRAFT

Inventory is NOT affected

🟢 Confirm Order

Stock is validated

Inventory is reduced

Status becomes CONFIRMED

🔴 Cancel Order

Only allowed for confirmed orders

Inventory is restored

Status becomes CANCELLED

🧪 Test Scenarios

✔ Confirm order with sufficient stock
✔ Prevent confirmation with insufficient stock
✔ Restore stock on cancellation
✔ Maintain complete order history

All scenarios are tested via Swagger UI and frontend.

🧠 Interview Talking Points

ERP-style workflow control

ORM-driven business logic

Service-layer architecture

Inventory consistency guarantees

Odoo-inspired design principles

👤 Author

Aditya
Aspiring Odoo Software Development Intern
GitHub: https://github.com/Lucifer-cyber007

🏁 Final Notes

This project is designed to be:

Resume-ready

Interview-explainable

Extendable to full ERP systems (invoicing, warehouses, reporting)

✅ WHAT YOU SHOULD DO NOW (IMPORTANT)

1️⃣ Replace your README.md with the above
2️⃣ Commit & push:

git add README.md
git commit -m "Fix README: correct setup, APIs, and ERP workflow explanation"
git push

🎯 After this, your repo is:

✔ Technically correct
✔ Interview-ready
✔ Odoo-aligned
✔ Professionally documented
