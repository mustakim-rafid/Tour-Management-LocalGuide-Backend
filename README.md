# 🧭 Tour Management – Local Guide (Backend)

A backend system for **Local Guide Platform**, connecting travelers with passionate local experts who offer personalized, authentic, and off-the-beaten-path experiences.  
This system powers user roles, tours, bookings, payments, reviews, and analytics — enabling a smooth travel experience for tourists and income opportunities for local guides.

---

## ✨ Core Features

### 🔐 Authentication & User Roles
- Secure **JWT-based authentication**
- **Login**, **refresh token**, and **get logged-in user info**
- **Role-based access** for:
  - **Admin**
  - **Guide**
  - **Tourist**
- Password change with route protection

---

### 👤 User Management
- Create **Admin**, **Guide**, or **Tourist** accounts
- Profile photo upload support
- Update user information
- Admin-only user listing
- Soft delete users

---

### 🗺️ Tour Management
- Guides can:
  - Create tours
  - Upload tour images
  - Manage their own tours (update, delete)
- Public can:
  - Explore all tours
  - View tour details

---

### 📘 Booking Management
- Tourists can book tours
- Guides can confirm, manage, and complete bookings
- Admin/Guide/Tourist can cancel bookings (based on rules)
- Tourists can view their booking history

---

### 💳 Payment Processing
- Tourists can pay for bookings
- Secure checkout endpoint for booking payments

---

### ⭐ Review System
- Tourists can review completed tours
- Ratings + comments stored with tourist reference

---

### 📊 Dashboard & Analytics
- **Admin Dashboard:** system-wide metrics  
- **Guide Dashboard:** bookings, income, tour metrics  
- **Tourist Dashboard:** bookings, completed trips  

---

## 🧪 API Endpoints

Base URL:  `/api/v1`

---

# 🔐 Auth Routes (`/api/v1/auth`)

| Method | Endpoint            | Description             | Access |
|--------|---------------------|-------------------------|--------|
| POST   | `/login`            | Login user              | Public |
| GET    | `/getme`            | Get logged-in user info | Auth   |
| POST   | `/refresh-token`    | Refresh access token    | Public |
| PATCH  | `/change-password`  | Change user password    | Admin, Guide, Tourist |

---

# 👤 User Routes (`/api/v1/user`)

| Method | Endpoint              | Description              | Access |
|--------|------------------------|--------------------------|--------|
| POST   | `/create-admin`       | Create admin user        | Admin  |
| POST   | `/create-guide`       | Register guide           | Public |
| POST   | `/create-tourist`     | Register tourist         | Public |
| GET    | `/`                   | Get all users            | Admin  |
| PATCH  | `/`                   | Update user              | Admin, Guide, Tourist |
| PATCH  | `/soft-delete/:userId`| Soft delete user         | Admin  |

---

# 🗺️ Tour Routes (`/api/v1/tour`)

| Method | Endpoint          | Description                  | Access |
|--------|--------------------|------------------------------|--------|
| POST   | `/`               | Create a tour                | Guide  |
| GET    | `/`               | Get all tours                | Public |
| GET    | `/guide-tours`    | Get tours by logged-in guide | Guide  |
| GET    | `/:id`            | Get tour by ID               | Public |
| PATCH  | `/:id`            | Update a tour                | Guide  |
| DELETE | `/:id`            | Delete tour                  | Guide  |

---

# 📘 Booking Routes (`/api/v1/booking`)

| Method | Endpoint              | Description                       | Access |
|--------|------------------------|-----------------------------------|--------|
| POST   | `/`                   | Create booking                    | Tourist |
| GET    | `/tourist-bookings`   | Get bookings for tourist          | Tourist |
| PATCH  | `/confirm/:id`        | Guide confirms booking            | Guide |
| PATCH  | `/cancel/:id`         | Cancel booking                    | Admin, Guide, Tourist |
| PATCH  | `/complete`           | Complete multiple bookings        | Guide |

---

# 💳 Payment Routes (`/api/v1/payment`)

| Method | Endpoint               | Description              | Access |
|--------|-------------------------|--------------------------|--------|
| POST   | `/:bookingId`          | Pay for a booking        | Tourist |

---

# ⭐ Review Routes (`/api/v1/review`)

| Method | Endpoint | Description          | Access |
|--------|----------|----------------------|--------|
| POST   | `/`      | Create a review      | Tourist |

---

# 📊 Dashboard Routes (`/api/v1/dashboard`)

| Method | Endpoint     | Description              | Access |
|--------|---------------|--------------------------|--------|
| GET    | `/admin`      | Admin dashboard metrics  | Admin  |
| GET    | `/guide`      | Guide dashboard metrics  | Guide  |
| GET    | `/tourist`    | Tourist dashboard info   | Tourist |

---

## 🛠️ Tech Stack

- **TypeScript**
- **Node.js**
- **Express.js**
- **PostgreSQL** + **Prisma ORM**
- **JWT Authentication**
- **Bcrypt** password hashing
- **Zod** validation
- Role-based authorization

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/mustakim-rafid/Tour-Management-LocalGuide-Backend.git
cd Tour-Management-LocalGuide-Backend
```

### 2. Create `.env` file in the root directory

```env
PORT=
NODE_ENV=development

# Database
DATABASE_URL=database-url

# Cloudinary
CLOUDINARY_CLOUD_NAME=cloudinary-cloud-name
CLOUDINARY_API_KEY=cloudinary-api-key
CLOUDINARY_API_SECRET=cloudinary-api-secret

# bcrypt
BCRYPT_SALT_ROUND=

# JWT
ACCESS_TOKEN_SECRET=access-token-secret
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=refresh-token-secret
REFRESH_TOKEN_EXPIRY=

# Stripe

STRIPE_SECRET_KEY=stripe-secret-key
STRIPE_WEBHOOK_SECRET=stripe-webhook-secret

# Super admin

SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=

# Frontend url
FRONTEND_URL=frontend-url
```

### 3. Install dependencies and also configure prisma from documentation

```bash
npm install
```

### 4. Start the local server

```bash
npm run dev
```

### 6. Test with Postman or any API testing tool

---

## If you like this project, give it a star on GitHub! ⭐, Thanks.
