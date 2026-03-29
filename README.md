# 🍽️ Smart Canteen Pre-Order System

## 📌 Overview

This project is a **microservices-based food ordering system** that allows students to pre-order meals efficiently.

The system is designed using:
- Microservices Architecture
- Event-Driven Communication
- REST APIs

---

## 🏗️ Architecture

The system consists of multiple independent services:

- **User Service** → Authentication & JWT
- **Menu Service** → Menu retrieval (with Redis caching)
- **Order Service** → Core business logic
- **Wallet Service** → Payment handling (atomic operations)
- **Notification Service** → Event-based notifications

---

## 🔄 Communication

### Synchronous (REST APIs)
- Order → Menu Service (validate items)
- Order → Wallet Service (deduct balance)

### Asynchronous (RabbitMQ)
- Order → Notification Service

---

## 📬 Event-Driven Flow

Events used:
- `ORDER_PLACED`
- `ORDER_READY`
- `ORDER_CANCELLED`

---

## ⚙️ Technologies Used

- Node.js / Express
- MongoDB
- Redis
- RabbitMQ

---

## 🚀 How to Run

### 1. Start Required Services

- MongoDB
- Redis
- RabbitMQ

---

### 2. Clone Repository

```bash
git clone <your-repo-url>
cd smart-canteen-system


3. Setup Environment Variables

Copy .env.example → .env

4. Run Services

For each service:

cd services/<service-name>
npm install
npm start
📁 Project Structure
services/
shared/
docs/
📜 System Features
Microservices-based design
Event-driven architecture
Redis caching for performance
Atomic wallet transactions (concurrency control)
Asynchronous notifications
🧠 Key Concepts Demonstrated
Microservices Architecture
REST API Communication
Event-Driven Systems (RabbitMQ)
Caching (Redis)
Concurrency Control (MongoDB)
👥 Team Responsibilities

Each team member is responsible for one microservice.

⚠️ Important Rules
Do NOT change event format
Do NOT change queue name
Always use shared constants
Use RabbitMQ for event communication
🎯 Conclusion

This project demonstrates a scalable and efficient microservices architecture for a real-world food ordering system.