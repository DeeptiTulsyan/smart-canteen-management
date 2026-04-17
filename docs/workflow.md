# System Workflow

## Student Flow

1. Student opens the frontend at `http://localhost:5173`.
2. Student registers using the registration page.
3. Student logs in and receives a JWT token.
4. Frontend stores the token in `localStorage` through `AuthContext`.
5. Frontend calls `/api/users/me` to load the logged-in profile.
6. Student opens the menu page.
7. Frontend calls `/api/menu` to show all available menu items.
8. Student clicks the plus button on a menu item.
9. Frontend calls `/api/menu/:id`, then saves the selected item in the local cart.
10. Student reviews cart and clicks Place Order.
11. Frontend calls `/api/orders` with cart items.
12. Order service validates items, debits wallet, saves the order, and publishes an order event.
13. Notification service consumes the RabbitMQ event and saves a notification.
14. Student opens Notifications and frontend calls `/api/notifications/me`.

## Wallet Flow

1. Student opens the Wallet page.
2. Frontend calls `/api/users/me` through the auth context to know the logged-in student.
3. Frontend can create a wallet using `/api/wallet/create`.
4. Frontend can fetch wallet balance using `/api/wallet/:studentId`.
5. During order placement, the order service calls `/api/wallet/debit` internally.

## Admin Flow

1. Admin opens the same login page and selects the Admin tab.
2. Frontend calls `/api/admin/auth/login`.
3. Admin token is stored separately from the student token.
4. Admin is redirected to `/admin/menu`.
5. Admin can create, update, or delete menu items through `/api/admin/menu`.
6. Admin can open `/admin/orders` and update order status through `/api/admin/orders/:id`.

## Event-Driven Notification Flow

```text
Student places order
  -> Order Service saves order
  -> Order Service publishes ORDER_PLACED to RabbitMQ
  -> Notification Service consumes event
  -> Notification Service saves notification in MongoDB
  -> Frontend fetches notifications from /api/notifications/me
```

## Why The API Gateway Matters

The frontend does not need to remember seven backend service URLs. It only knows:

```text
VITE_API_GATEWAY=http://localhost:5000
```

The gateway then forwards requests:

- `/api/auth` -> User Service
- `/api/users` -> User Service
- `/api/menu` -> Menu Service
- `/api/orders` -> Order Service
- `/api/wallet` -> Wallet Service
- `/api/notifications` -> Notification Service
- `/api/admin` -> Admin Service
