# System Architecture

## Overview

Smart Canteen Management System uses a microservices architecture with a React frontend and a single API gateway. Each backend service owns one business area, which makes the project easier to explain, test, and extend.

![System Architecture](system-architecture.svg)

## High-Level Flow

```text
React Frontend
  -> API Gateway
    -> User Service
    -> Menu Service
    -> Wallet Service
    -> Order Service
    -> Notification Service
    -> Admin Service

Order Service
  -> Menu Service over REST
  -> Wallet Service over REST
  -> RabbitMQ order_events queue
    -> Notification Service
```

## Service Responsibilities

| Service | Responsibility |
| --- | --- |
| API Gateway | Receives frontend requests and proxies them to backend services |
| User Service | Handles student registration, login, profile, and JWT generation |
| Menu Service | Handles menu item storage, retrieval, and Redis caching |
| Order Service | Handles order creation, item validation, wallet debit, and event publishing |
| Wallet Service | Handles wallet creation, balance lookup, and atomic balance debit |
| Notification Service | Listens to RabbitMQ order events, saves notifications, and exposes notification APIs |
| Admin Service | Handles admin auth plus menu and order management controls |

## Communication Types

### Synchronous REST

The frontend sends all requests to the API gateway. The gateway proxies those requests to the target service.

The order service also uses REST internally:

- Order Service -> Menu Service to validate menu item details.
- Order Service -> Wallet Service to debit the student's wallet.

### Asynchronous RabbitMQ

The order service publishes order events to the `order_events` queue. The notification service consumes those events and saves user-facing notifications.

Supported events:

- `ORDER_PLACED`
- `ORDER_READY`
- `ORDER_CANCELLED`

## Data Storage

Each service uses its own MongoDB database:

- `user_db`
- `menu_db`
- `order_db`
- `wallet_db`
- `notification_db`
- `admin_db`

Redis is used by the menu service to cache menu retrieval results.

## Security

JWT tokens are issued during login and passed in protected requests using:

```text
Authorization: Bearer <token>
```

All services that verify JWTs must use the same `JWT_SECRET`.
