# Smart Canteen Frontend

React + Vite frontend for the Smart Canteen Management System. The app supports both student and admin workflows through the same login page.

## Run Locally

```bash
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Environment

Create `frontend/.env` from `frontend/.env.example`:

```text
VITE_API_GATEWAY=http://localhost:5000
```

All frontend requests go through `VITE_API_GATEWAY`.

## Frontend Structure

```text
src/
  components/
    AdminNavbar.jsx
    AdminProtectedRoute.jsx
    Navbar.jsx
    ProtectedRoute.jsx
  context/
    AuthContext.jsx
    authContextValue.js
    useAuth.js
  pages/
    Login.jsx
    Register.jsx
    Menu.jsx
    Cart.jsx
    Orders.jsx
    Notifications.jsx
    Wallet.jsx
    admin/
      AdminLogin.jsx
      AdminMenu.jsx
      AdminOrders.jsx
  services/
    adminService.js
    authService.js
    cartStorage.js
    menuService.js
    notificationService.js
    orderService.js
    walletService.js
  App.jsx
  config.js
  main.jsx
```

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Student/Admin login with role tabs |
| `/register` | Public | Student registration |
| `/menu` | Student | Browse menu and add items to cart |
| `/cart` | Student | Review cart and place order |
| `/orders` | Student | View order history |
| `/notifications` | Student | View order notifications |
| `/wallet` | Student | Create wallet and view balance |
| `/admin/menu` | Admin | Create, update, delete menu items |
| `/admin/orders` | Admin | Update order status |

## Auth Flow

Student login calls `/api/auth/login`. The returned token is saved as `canteen_token` in `localStorage` and managed by `AuthContext`.

Admin login calls `/api/admin/auth/login`. The returned token is saved separately as `canteen_admin_token`.

Protected routes check for the correct token before rendering pages.

## Cart Flow

The cart is stored in browser `localStorage` using the key `canteen_cart`.

When a student clicks the plus button:

1. Frontend calls `/api/menu/:id`.
2. The selected item is saved to the local cart.
3. The navbar cart count updates using a `cart-updated` browser event.

When the student places an order, the cart is sent to `/api/orders`.

## Build Check

```bash
npm run lint
npm run build
```
