# 📡 Content Broadcasting System — Backend

> A production-grade, subject-based content distribution platform for modern educational environments. Teachers upload content, Principals approve it, and students receive a live rotating broadcast through a public API — all with zero manual intervention.

**Assignment Submission** · Backend Developer Role · Built with Node.js, Express, PostgreSQL & Prisma

---

## 🔗 Quick Links

| Resource | Link |
|---|---|
| 🐙 GitHub Repository | [backend_assignment](https://github.com/akshatmalik-bruh/backend_assignment) |
| 🚀 Live Deployment | [backend-assignment-m7px.onrender.com](https://backend-assignment-m7px.onrender.com) |
| 📮 API Documentation | [Postman Collection](https://documenter.getpostman.com/view/45068277/2sBXqGr2E9) |
| 🎥 Demo Video | **[Insert Video Link]** |

---

## 🚀 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Runtime | Node.js v22+ (ES Modules) | Async-first, non-blocking I/O |
| Framework | Express.js | Minimal, flexible HTTP layer |
| Database | PostgreSQL via Supabase | Relational integrity, managed hosting |
| ORM | Prisma 7 (Driver Adapters) | Type-safe queries, schema-as-source-of-truth |
| Auth | JWT (HS256) + Bcrypt | Stateless sessions, secure password hashing |
| Validation | Zod | Schema-first, parse-don't-validate approach |
| File Uploads | Multer (Disk Storage) | Lightweight, configurable local file handling |
| Security | Helmet.js + CORS + express-rate-limit | HTTP hardening, origin control, brute-force protection |
| Deployment | Render (Web Service) | Container-native, auto-deploys from GitHub |

---

## 📁 Project Structure

```
backend/
├── auth/
│   ├── auth.router.js         # Login & register endpoints
│   ├── auth.controllers.js    # Request parsing, Zod validation
│   ├── auth.services.js       # JWT issuance, Bcrypt comparison
│   ├── auth.middleware.js     # JWT verification → req.user
│   └── auth.validation.js     # Zod schema for login/signup
│
├── principal/
│   ├── principal.router.js    # Approve / reject routes (Principal only)
│   ├── principal.controllers.js
│   └── principal.services.js  # Content state transitions + audit trail
│
├── upload/
│   ├── upload.routes.js       # File upload route (Teacher only)
│   ├── upload.controllers.js
│   ├── upload.services.js     # DB record creation post-upload
│   ├── upload.middleware.js   # Multer filtering and storage config
│   └── upload.validation.js   # Zod schema for upload fields
│
├── live/
│   ├── live.router.js         # Public broadcast endpoint (no auth)
│   ├── live.controller.js
│   └── live.services.js       # 🔑 Deterministic Rotation engine lives here
│
├── db/
│   └── connection.js          # Database initialization logic
│
├── utils/
│   └── prisma.js              # Singleton PrismaClient (prevents connection leaks)
│
├── prisma/
│   └── schema.prisma          # Database models and relations
│
├── server.js                  # App entry point and middleware assembly
└── config.js                  # Environment variable central management
```

---

## 🏗 System Architecture

The system follows a strict **3-layer SCR pattern** (Service → Controller → Route). Each layer has exactly one responsibility and does not reach into another.

```
Request
   │
   ▼
[ Route ]          → Defines path, attaches middleware (Auth, Multer)
   │
   ▼
[ Controller ]     → Validates input (Zod), checks role, formats HTTP response
   │
   ▼
[ Service ]        → Business logic + Prisma database calls
   │
   ▼
[ PostgreSQL ]
```

---

## ✅ Core Features

### 🔐 Authentication & RBAC
- Stateless JWT authentication using the `HS256` algorithm.
- Role-based access strictly enforced at middleware and controller levels.
- Bcrypt password hashing with high-security cost factor.
- **Rate Limiting**: 100 requests per 15-minute window to prevent brute-force attacks.

### 📤 Content Upload (Teacher)
- Upload images (JPG, PNG, GIF) with a **10MB hard limit**.
- Dynamic scheduling: Set `startTime`, `endTime`, and `rotationDuration` per item.
- Automatic filename sanitization using Unix timestamps to prevent collisions.

### ✅ Approval Workflow (Principal)
- Principals review a real-time queue of `pending` content.
- **Mandatory Feedback**: Rejections require a reason, ensuring clear communication with teachers.
- Audit trail: Every approval records the Principal's ID and timestamp.

### 📡 Live Broadcasting (Public)
- **Zero Auth**: Student devices can access the broadcast without complex login steps.
- **Subject-based streams**: Supports query filtering (e.g., `?subject=Maths`).
- **Stateless Rotation**: Uses the deterministic modulo algorithm for perfect synchronization across all devices.

---

## 🔑 Key Implementation Proofs

### 1. Robust RBAC (Role-Based Access Control)
Access is enforced at both the Middleware and Controller levels. This ensure that even if a token is valid, a Teacher can never access Principal-only business logic.

```javascript
// Layer 1: Middleware Verification
export const middleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains { id, role }
    next();
};

// Layer 2: Controller Authorization
export const approveContentController = async (req, res) => {
    if (req.user.role !== "principal") {
        return res.status(403).json({ message: "Forbidden: Principal access required" });
    }
    // ... logic
};
```

### 2. Deterministic Rotation Algorithm
This is the system's most complex component. It avoids the need for heavy cron jobs by calculating the "Live" item mathematically on every request.

```javascript
// From live.services.js
const totalRotationMinutes = subContent.reduce((sum, item) => sum + item.rotationDuration, 0);
const totalRotationMs = totalRotationMinutes * 60 * 1000;

// Deterministic selection based on Unix Epoch
const currentMs = Date.now() % totalRotationMs;

let accumulatedMs = 0;
for (const item of subContent) {
    const durationMs = item.rotationDuration * 60 * 1000;
    if (currentMs >= accumulatedMs && currentMs < accumulatedMs + durationMs) {
        selectedItem = item; // This item is LIVE right now
        break;
    }
    accumulatedMs += durationMs;
}
```

### 3. Schema-Based Validation (Zod)
We use a "Parse, Don't Validate" approach to ensure only sanitized data enters our services.

```javascript
export const uploadSchema = z.object({
    title: z.string().min(1),
    subject: z.string().min(1),
    rotationDuration: z.coerce.number().min(1),
    startTime: z.string().datetime(),
    endTime: z.string().datetime()
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
    message: "endTime must be after startTime"
});
```

### 4. Prisma Singleton (Infrastructure)
Prevents database connection exhaustion by ensuring only one instance of the Prisma client exists throughout the application lifecycle.

```javascript
const prisma = global.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
```

---

## 🛡️ Edge Case Handling

| Case | Handling Strategy |
|---|---|
| No content approved | Returns `200 OK` with `"No content available"` message. |
| Expired content | Automatically filtered out by the rotation engine query. |
| Unauthorized access | Rejected at the middleware layer with `401` or `403`. |
| Large file uploads | Multer hard-limit of 10MB enforced at the entry point. |

---

## ⚙️ Setup & Installation

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file with `DATABASE_URL` and `JWT_SECRET`.

3. **Database Setup**
   ```bash
   npx prisma db push
   ```

4. **Run**
   ```bash
   npm run dev
   ```

## 👤 Author

**Akshat Malik**  
Focused on **architectural integrity**, **real-world edge case handling**, and **clean, maintainable code**.
