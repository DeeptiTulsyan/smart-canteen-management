# 📜 API & Event Contracts

---

## 📌 Event Contract

### Queue Name
order_events

---

### Supported Events

- ORDER_PLACED
- ORDER_READY
- ORDER_CANCELLED

---

### Event Structure

```json
{
  "event": "ORDER_PLACED",
  "orderId": "ORD101",
  "studentId": "22BCE1023",
  "email": "student@email.com",
  "items": [
    {
      "name": "Veg Sandwich",
      "price": 80,
      "qty": 1
    }
  ],
  "total": 150,
  "status": "PLACED",
  "timestamp": "2026-03-06T10:30:00Z"
}


📌 REST APIs
🔐 User Service

POST /auth/login

Response:

{
  "token": "jwt_token_here"
}
🍽️ Menu Service

GET /menu

GET /menu/:id

🧾 Order Service

POST /orders

PATCH /orders/:id

💰 Wallet Service

POST /wallet/debit

📌 Communication Rules
Synchronous (REST)
Order → Menu
Order → Wallet
Asynchronous (RabbitMQ)
Order → Notification
📌 Rules
Do NOT change event format
Do NOT change queue name
Always use shared constants
Use RabbitMQ for notifications
📌 Security

JWT must be passed in headers:

Authorization: Bearer <token>