# Content Broadcasting System (Backend)

A robust, subject-based content distribution system for modern educational environments. Teachers upload content, Principals approve/reject it, and students access a live, rotating broadcast via a public API.

## 🚀 Tech Stack
- **Runtime**: Node.js (v22+)
- **Framework**: Express.js (ES Modules)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 7
- **Authentication**: JWT & Bcrypt
- **File Handling**: Multer
- **Validation**: Zod

---

## 🛡️ Key Implementation Proofs

### 1. Robust RBAC (Role-Based Access Control)
Enforced at both the Middleware and Service levels to ensure strict separation between Teachers and Principals.

```javascript
// From principal.controllers.js
export const approveContentController = async (req, res) => {
    const { role } = req.user;
    if (role !== "principal") {
        return res.status(403).json({ message: "Unauthorized: Principal access required" });
    }
    // ...
}
```

### 2. Smart Scheduling & Rotation Logic (Core Business Logic)
The system dynamically determines the "Live" content using a modulo-based algorithm on the current timestamp.

```javascript
// From live.services.js
const totalRotationMs = subContent.reduce((sum, item) => sum + item.rotationDuration, 0) * 60 * 1000;
const currentMs = Date.now() % totalRotationMs;

let accumulatedMs = 0;
for (const item of subContent) {
    const durationMs = item.rotationDuration * 60 * 1000;
    if (currentMs >= accumulatedMs && currentMs < accumulatedMs + durationMs) {
        return item; // This item is currently LIVE
    }
    accumulatedMs += durationMs;
}
```

### 3. Strict File & Data Validation
Uses Zod for schema validation and Multer for file-type/size restrictions.

```javascript
// From upload.validation.js
export const uploadValidation = z.object({
    subject: z.string(),
    title: z.string(),
    rotationDuration: z.coerce.number().min(1),
    startTime: z.string().datetime(),
    endTime: z.string().datetime()
});
```

### 4. Database Schema (Prisma Models)
Designed for clear relationships and lifecycle tracking.

```prisma
model Content {
  id               String        @id @default(uuid())
  title            String
  subject          String
  status           ContentStatus @default(pending)
  uploadedBy       String
  startTime        DateTime?
  endTime          DateTime?
  rotationDuration Int?
  // ... relations to User
}
```

---

## 📁 Project Structure
```text
src/
├── auth/           # JWT Auth & User Management
├── principal/      # Approval & Rejection Workflow
├── upload/         # Multer-based File Uploading
├── live/           # Public Broadcasting Engine (Rotation Logic)
├── utils/          # Prisma Singleton & Shared Helpers
```

## ⚙️ Setup Instructions

### 1. Installation
```bash
npm install
npx prisma generate
```

### 2. Environment Variables (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secret"
PORT=3000
```

### 3. Execution
```bash
npm run dev   # Development (Nodemon)
npm start     # Production
```

---
**Assignment Submission for Backend Developer Role.**
Created with focus on architectural integrity and real-world edge case handling.
