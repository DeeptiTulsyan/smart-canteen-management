# API and Event Contracts

Base URL for the frontend:

```text
http://localhost:5000
```

All frontend requests should go through the API gateway, not directly to individual service ports.

Protected APIs require:

```text
Authorization: Bearer <token>
```

## Student Auth and Profile

### Register Student

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "Sumeet",
  "email": "student@example.com",
  "password": "password123",
  "studentId": "22BCE1023"
}
```

### Login Student

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

Response includes a JWT token.

### Get Logged-In Student

```http
GET /api/users/me
```

### Update Logged-In Student

```http
PUT /api/users/me
```

## Menu

### Get Menu Items

```http
GET /api/menu
```

### Get Menu Item By ID

```http
GET /api/menu/:id
```

The frontend uses this endpoint when a student clicks the plus button before saving the item into the local cart.

## Cart

Cart is frontend-only and is stored in browser `localStorage`. There is no separate backend cart service.

## Wallet

### Create Wallet

```http
POST /api/wallet/create
```

### Get Wallet By Student ID

```http
GET /api/wallet/:studentId
```

### Debit Wallet

```http
POST /api/wallet/debit
```

The order service calls this during order placement. The frontend should normally place an order instead of calling debit directly.

## Orders

### Place Order

```http
POST /api/orders
```

Body:

```json
{
  "items": [
    {
      "menuId": "menu_item_id",
      "qty": 2
    }
  ]
}
```

The order service validates menu items, calculates total amount, debits wallet, saves the order, and publishes an event.

### Get Orders

```http
GET /api/orders
```

Students receive their own orders. Admin-related order updates are handled through admin routes.

### Get Order By ID

```http
GET /api/orders/:id
```

## Notifications

### Get Logged-In Student Notifications

```http
GET /api/notifications/me
```

### Get Notifications By Student ID

```http
GET /api/notifications/:studentId
```

## Admin Auth

### Register Admin

```http
POST /api/admin/auth/register
```

Used during development/platform setup.

### Login Admin

```http
POST /api/admin/auth/login
```

Response includes an admin JWT token.

## Admin Controls

### Create Menu Item

```http
POST /api/admin/menu
```

### Update Menu Item

```http
PUT /api/admin/menu/:id
```

### Delete Menu Item

```http
DELETE /api/admin/menu/:id
```

### Update Order Status

```http
PATCH /api/admin/orders/:id
```

Common statuses:

- `PLACED`
- `PREPARING`
- `READY`
- `CANCELLED`

## RabbitMQ Event Contract

Queue name:

```text
order_events
```

Event structure:

```json
{
  "event": "ORDER_PLACED",
  "orderId": "order_id",
  "studentId": "22BCE1023",
  "email": "student@example.com",
  "items": [
    {
      "name": "Paneer Roll",
      "price": 75,
      "qty": 1
    }
  ],
  "total": 75,
  "status": "PLACED",
  "timestamp": "2026-04-17T10:30:00.000Z"
}
```

Rules:

- Keep the queue name as `order_events`.
- Keep event names consistent across producer and consumer.
- Publish order events from the order service only.
- Consume and save notification records in the notification service.
