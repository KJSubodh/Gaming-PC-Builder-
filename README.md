# 🎮 PCStore — Gaming PC E-Commerce Platform

A full-stack e-commerce platform for browsing, configuring, and buying gaming PC components — with a guided PC Builder, real-time compatibility checks, and a complete admin dashboard.

## ✨ Features

**Shopping**
- Browse components by category (CPU, GPU, Motherboard, RAM, PSU, Storage, Case, Cooling)
- Filter by price, category, and search by name/brand
- Detailed product pages with priority-ordered specifications

**PC Builder**
- Step-by-step build wizard, one component at a time
- Real-time compatibility checks (socket, chipset, RAM type/speed, PSU wattage, case clearance)
- Live build summary with running total
- Add the entire build to cart in one click

**Cart & Checkout**
- Guest and authenticated carts, with cart merge on login
- Quantity updates and item removal
- Order summary with subtotal, GST (18%), shipping, and grand total

**Accounts**
- JWT-based register/login
- Profile management
- Order history with status tracking

**Admin Dashboard**
- Product CRUD and inventory control
- User management with role assignment
- Order management and status updates

## 🏗️ Tech Stack

**Frontend** — React 18 · Vite · Tailwind CSS · Framer Motion · TanStack Query · React Router v6 · Axios · React Hot Toast

**Backend** — Spring Boot 3 · Spring Security · JWT · PostgreSQL · Spring Data JPA / Hibernate · Lombok

## 📁 Project Structure

```
PCStore/
├── pcstore-backend/
│   └── src/main/java/com/pcstore/
│       ├── config/        # Security & app configuration
│       ├── controller/    # REST endpoints
│       ├── dto/           # Data transfer objects
│       ├── model/         # JPA entities
│       ├── repository/    # Spring Data repositories
│       ├── service/       # Business logic
│       └── security/      # JWT & auth filters
│
└── pcstore-frontend/
    └── src/
        ├── components/    # Reusable UI components
        ├── pages/
        │   ├── admin/     # Admin dashboard
        │   ├── Home/
        │   ├── Products/
        │   ├── ProductDetail/
        │   ├── PCBuilder/
        │   ├── Cart/
        │   ├── Checkout/
        │   ├── Orders/
        │   └── OrderDetail/
        ├── context/       # React Context providers
        ├── services/      # API calls
        └── hooks/         # Custom hooks
```

## 🔧 Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL 14+
- Maven

### Backend

```bash
cd pcstore-backend
```

Create the database:

```sql
CREATE DATABASE pcstore_db;
```

Create a `.env` file in the backend root:

```env
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_256bit_secret_key
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@pcstore.com
ADMIN_PASSWORD=admin123
```

Run it:

```bash
mvn clean install
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`.

### Frontend

```bash
cd pcstore-frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080/api
```

Run it:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## 🌐 API Reference

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/categories` | List categories |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |

### Authenticated

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get current cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update/{id}` | Update cart item |
| DELETE | `/api/cart/remove/{id}` | Remove cart item |
| POST | `/api/orders/create` | Place order |
| GET | `/api/orders/my-orders` | Order history |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List users |
| PUT | `/api/admin/users/{id}/role` | Update user role |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/{id}` | Update product |
| DELETE | `/api/admin/products/{id}` | Delete product |
| GET | `/api/admin/orders` | List all orders |
| PUT | `/api/admin/orders/{id}/status` | Update order status |

## 🐛 Troubleshooting

**JWT signature exception**

```bash
openssl rand -base64 32
# set the output as JWT_SECRET in .env, then restart
```

**Port already in use**

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

## 📦 Deployment

**Backend**

```bash
mvn clean package -DskipTests
java -jar target/pcstore-backend-0.0.1-SNAPSHOT.jar
```

**Frontend**

```bash
npm run build
npm run preview
```

## 📄 License

MIT