# Frontend Implementation Guide

This file documents the current frontend implementation. The main frontend README is available at `frontend/README.md`.

## Current Setup

The frontend is a Vite React app located in:

```text
frontend/
```

It communicates with the backend through the API gateway:

```text
VITE_API_GATEWAY=http://localhost:5000
```

The frontend should not call the user, menu, order, wallet, admin, or notification services directly during normal usage. The gateway handles routing.

## Important Files

| File | Purpose |
| --- | --- |
| `src/App.jsx` | Defines public, student, and admin routes |
| `src/config.js` | Stores API base URLs and localStorage keys |
| `src/context/AuthContext.jsx` | Stores student token/profile state and exposes login/logout |
| `src/context/useAuth.js` | Helper hook for reading auth context |
| `src/services/*.js` | Axios API functions used by pages |
| `src/services/cartStorage.js` | Local cart helper functions |
| `src/components/ProtectedRoute.jsx` | Protects student pages |
| `src/components/AdminProtectedRoute.jsx` | Protects admin pages |

## Student Pages

| Page | Route | Backend APIs Used |
| --- | --- | --- |
| `Login.jsx` | `/login` | `POST /api/auth/login` |
| `Register.jsx` | `/register` | `POST /api/auth/register` |
| `Menu.jsx` | `/menu` | `GET /api/menu`, `GET /api/menu/:id` |
| `Cart.jsx` | `/cart` | `POST /api/orders` |
| `Orders.jsx` | `/orders` | `GET /api/orders` |
| `Notifications.jsx` | `/notifications` | `GET /api/notifications/me` |
| `Wallet.jsx` | `/wallet` | `POST /api/wallet/create`, `GET /api/wallet/:studentId` |

## Admin Pages

| Page | Route | Backend APIs Used |
| --- | --- | --- |
| `Login.jsx` with admin role | `/admin/login` | `POST /api/admin/auth/login` |
| `AdminMenu.jsx` | `/admin/menu` | `POST /api/admin/menu`, `PUT /api/admin/menu/:id`, `DELETE /api/admin/menu/:id` |
| `AdminOrders.jsx` | `/admin/orders` | `GET /api/orders`, `PATCH /api/admin/orders/:id` |

## Token Storage

Student token:

```text
localStorage key: canteen_token
```

Admin token:

```text
localStorage key: canteen_admin_token
```

Cart:

```text
localStorage key: canteen_cart
```

## Role-Based Login

The project uses one login UI with role tabs:

- Student tab calls the user service through `/api/auth/login`.
- Admin tab calls the admin service through `/api/admin/auth/login`.

After login:

- Students go to `/menu`.
- Admins go to `/admin/menu`.

## Local Commands

```bash
cd frontend
npm install
npm run dev
```

Before pushing frontend changes:

```bash
npm run lint
npm run build
```
