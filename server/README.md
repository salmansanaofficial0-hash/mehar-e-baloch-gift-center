# Mehr-e-Baloch Cosmetics — Backend API

A complete e-commerce REST API built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**. Features full authentication, product/category management, cart & wishlist, orders with invoices, payments (Stripe + COD), admin dashboard, coupons, and review moderation.

---

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary configuration
│   │   ├── nodemailer.js       # Email SMTP transport
│   │   └── stripe.js           # Stripe client
│   ├── controllers/
│   │   ├── adminController.js  # Dashboard, customer management
│   │   ├── authController.js   # Register, login, verify, password reset
│   │   ├── cartController.js   # Cart CRUD
│   │   ├── categoryController.js # Category/subcategory CRUD
│   │   ├── couponController.js # Coupon CRUD + validation
│   │   ├── orderController.js  # Place order, order history, invoice
│   │   ├── paymentController.js # Stripe checkout + webhook
│   │   ├── productController.js # Product CRUD + search + filters
│   │   ├── reviewController.js # Review submit + moderation
│   │   ├── userController.js   # User profile
│   │   └── wishlistController.js # Wishlist toggle
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect + adminOnly
│   │   ├── errorHandler.js     # Centralized error handler
│   │   ├── rateLimiter.js      # Auth rate limiter
│   │   └── uploadMiddleware.js # Multer + Cloudinary upload
│   ├── models/
│   │   ├── Banner.js
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Coupon.js
│   │   ├── CustomGiftRequest.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Review.js
│   │   ├── Setting.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bannerRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── couponRoutes.js
│   │   ├── customRequestRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── db.js               # MongoDB connection
│   │   ├── emailService.js     # Email helpers (with console fallback)
│   │   ├── generateToken.js    # JWT generator
│   │   └── pdfGenerator.js     # Invoice PDF generation
│   ├── seed.js                 # Database seeder
│   └── server.js               # Express app entry point
├── .env.example
└── package.json
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp server/.env.example server/.env
```

Then edit `server/.env` and fill in:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for access tokens |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens |
| `ADMIN_EMAIL` | Default admin email (auto-created on startup) |
| `ADMIN_PASSWORD` | Default admin password |
| `CLIENT_URL` | Frontend URL (for CORS and email links) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Email credentials (optional, logs to console if missing) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary credentials (optional, stores locally if missing) |
| `STRIPE_SECRET_KEY` | Stripe secret key (optional, required for card payments) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret for secure event validation |

### 3. Seed the Database

```bash
npm run seed --workspace server
```

**Seeded data includes:**
- Admin: `admin@meharbaloch.com` / `Admin@123`
- Customer: `customer@test.com` / `Customer@123`
- 4 categories + 2 subcategories
- 8 sample products with variants
- 3 discount coupons: `WELCOME10`, `EID2025`, `FLAT500`
- 2 banners

### 4. Start the Server

Development (with auto-reload):
```bash
npm run server
```

Production:
```bash
npm run start --workspace server
```

---

## API Reference

**Base URL:** `http://localhost:5000/api`

All responses follow the format:
```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... }
}
```

---

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login | Public |
| POST | `/verify-email` | Verify email code | Public |
| POST | `/resend-code` | Resend verification code | Public |
| POST | `/refresh` | Refresh access token | Public |
| POST | `/forgot-password` | Send password reset link | Public |
| POST | `/reset-password` | Reset password | Public |

---

### Products — `/api/products`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List products (search, filter, paginate) | Public |
| GET | `/categories/all` | List all categories | Public |
| GET | `/id/:id` | Get product by ID | Public |
| GET | `/:slug` | Get product by slug | Public |
| POST | `/` | Create product (with image upload) | Admin |
| PUT | `/bulk/status` | Bulk enable/disable | Admin |
| POST | `/bulk/delete` | Bulk delete | Admin |
| GET | `/alerts/low-stock` | Low stock alert list | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |

**Query params for GET /api/products:**
- `search`, `category`, `minPrice`, `maxPrice`, `sort`, `featured`, `status`, `page`, `limit`

---

### Admin — `/api/admin`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/dashboard` | Dashboard stats | Admin |
| GET | `/dashboard/charts` | Revenue chart data | Admin |
| POST | `/categories` | Create category | Admin |
| PUT | `/categories/:id` | Update category | Admin |
| DELETE | `/categories/:id` | Delete category | Admin |
| GET | `/customers` | List all customers | Admin |
| PUT | `/customers/:id/block` | Block/unblock customer | Admin |
| GET | `/customers/:id/orders` | Customer order history | Admin |

---

### Cart & Wishlist — `/api/users`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/cart` | Get cart | Customer |
| POST | `/cart` | Add item to cart | Customer |
| PUT | `/cart` | Update item quantity | Customer |
| DELETE | `/cart` | Remove item | Customer |
| POST | `/cart/clear` | Clear cart | Customer |
| GET | `/wishlist` | Get wishlist | Customer |
| POST | `/wishlist` | Toggle wishlist item | Customer |

---

### Orders — `/api/orders`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Place order from cart | Customer |
| GET | `/customer/my-orders` | My order history | Customer |
| GET | `/customer/:id` | Order details | Customer |
| GET | `/:id/invoice` | Download invoice PDF | Customer |
| GET | `/admin/all` | All orders (filterable) | Admin |
| PUT | `/admin/:id/status` | Update order status | Admin |

---

### Coupons — `/api/coupons`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/validate/:code` | Validate coupon | Public |
| GET | `/admin/all` | All coupons | Admin |
| POST | `/admin/create` | Create coupon | Admin |
| PUT | `/admin/:id` | Update coupon | Admin |
| DELETE | `/admin/:id` | Delete coupon | Admin |

---

### Reviews — `/api/reviews`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/product/:productId` | Product reviews | Public |
| POST | `/` | Submit review (requires delivered order) | Customer |
| GET | `/admin/all` | All reviews | Admin |
| PUT | `/admin/:id/approve` | Approve review | Admin |
| DELETE | `/admin/:id` | Delete review | Admin |

---

### Payments — `/api/payments`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/create-checkout-session` | Create Stripe checkout | Customer |
| POST | `/webhook` | Stripe webhook handler | Public |

---

### User Profile — `/api/users`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/profile` | Get profile | Customer |
| PUT | `/profile` | Update profile | Customer |

---

### Custom Gift Requests — `/api/custom-requests`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Submit custom request |
| GET | `/:email` | View requests by email |
| GET | `/admin/all` | All requests | Admin |
| PUT | `/admin/:id/status` | Update request status | Admin |

---

## Deployment (InsForge)

1. Set all environment variables via the InsForge dashboard or CLI secrets.
2. The server reads `PORT` from environment — no hardcoded ports.
3. Start command is `node src/server.js` — listed as `start` in `package.json`.
4. For Stripe webhooks, configure the webhook endpoint in Stripe Dashboard to point to `https://your-domain/api/payments/webhook`.

---

## Default Credentials (After Seed)

| Role | Email | Password |
|---|---|---|
| Admin | admin@meharbaloch.com | Admin@123 |
| Customer | customer@test.com | Customer@123 |
